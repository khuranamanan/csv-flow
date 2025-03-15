import { z, ZodTypeAny } from "zod";
import {
  ErrorSources,
  FieldConfig,
  FieldMappingItem,
  FieldStatus,
  Meta,
  Error as FieldError,
  UniqueValidation,
  CustomValidation,
  RegexValidation,
  InfoWithSource,
  ErrorLevel,
} from "../types";
import { nanoid } from "nanoid";
import { isValid } from "date-fns";

/**
 * Maps a single CSV row using the provided field mappings.
 */
export function mapCsvRow(
  row: Record<string, unknown>,
  fieldMappings: FieldMappingItem[]
): Record<string, unknown> {
  const mappedRow: Record<string, unknown> = {};
  fieldMappings.forEach((field) => {
    if (
      field.status === FieldStatus.Mapped ||
      field.status === FieldStatus.Custom
    ) {
      mappedRow[field.mappedValue] = row[field.csvValue];
    }
  });
  return mappedRow;
}

/**
 * Returns a base Zod schema for a field based on its type.
 */
function getBaseSchema(field: FieldConfig): ZodTypeAny {
  switch (field.type) {
    case "number":
      return z.preprocess((val) => {
        if (typeof val === "string") {
          if (!val.trim()) return undefined;
          const num = Number(val);
          return isNaN(num) ? val : num;
        }
        return val;
      }, z.number().optional());
    case "boolean":
      return z.preprocess((val) => {
        if (typeof val === "string") {
          if (!val.trim()) return undefined;
          const lower = val.toLowerCase();
          if (lower === "true") return true;
          if (lower === "false") return false;
        }
        return val;
      }, z.boolean().optional());
    case "date":
      return z.preprocess(
        (val) => {
          if (typeof val === "string") {
            if (!val.trim()) return undefined;
            return val;
          }
          return val;
        },
        z
          .string()
          .refine((val) => isValid(new Date(val)), {
            message: "Must be a valid date",
          })
          .optional()
      );
    case "email":
      return z.preprocess((val) => {
        if (typeof val === "string") {
          if (!val.trim()) return undefined;
          return val.trim();
        }
        return val;
      }, z.string().email().optional());
    default:
      return z.string().optional();
  }
}

/**
 * Returns a Zod schema for a field by starting with the base schema,
 * then applying required validations.
 *
 * Note: Custom and regex validations that depend on the entire row are handled separately.
 */
function getFieldSchema(field: FieldConfig): ZodTypeAny {
  let schema = getBaseSchema(field);

  if (field.columnRequired) {
    if (schema instanceof z.ZodString) {
      schema = schema.min(1, { message: "This field is required" });
    } else {
      schema = schema.refine(
        (val) => val !== undefined && val !== null && val !== "",
        { message: "This field is required" }
      );
    }
  }

  return schema;
}

/**
 * Helper function to update an error for a field in an error object.
 * Only updates if the new error's level is higher than the current one.
 */
function updateError(
  fieldName: string,
  newError: InfoWithSource,
  errors: FieldError
) {
  const priority: Record<ErrorLevel, number> = {
    info: 1,
    warning: 2,
    error: 3,
  };
  const current = errors[fieldName];
  if (!current || priority[newError.level] > priority[current.level]) {
    errors[fieldName] = newError;
  }
}

/**
 * Applies validations to the mapped data using Zod for type validations.
 * After parsing each row with the generated row schema, any Zod errors are
 * converted to your expected error format. Then, we run custom (row-level)
 * validations, regex validations, and table-level unique validations.
 *
 * The `fieldMappings` parameter is used to determine if a given field is
 * actually mapped. If a field isn’t mapped (status Unmapped/ Ignored),
 * unique validations for that field are skipped.
 */
export async function addErrorsToData(
  data: Record<string, unknown>[],
  fields: FieldConfig[],
  fieldMappings: FieldMappingItem[]
): Promise<(Record<string, unknown> & Meta)[]> {
  function isFieldMapped(field: FieldConfig) {
    return fieldMappings.some(
      (mapping) =>
        (mapping.status === FieldStatus.Mapped ||
          mapping.status === FieldStatus.Custom) &&
        mapping.mappedValue === field.columnName
    );
  }

  const processedRows = data.map((row) => {
    const newRow: Record<string, unknown> = { ...row };
    const errors: FieldError = {};

    // Type Validation
    fields.forEach((field) => {
      const value = row[field.columnName];
      const schema = getFieldSchema(field);
      const result = schema.safeParse(value);
      if (result.success) {
        newRow[field.columnName] = result.data;
      } else {
        newRow[field.columnName] = value;
        updateError(
          field.columnName,
          {
            message: result.error.issues[0].message,
            level: "error",
            source: ErrorSources.Row,
          },
          errors
        );
      }
    });

    // Custom and Regex Validations (only if field is mapped)
    fields.forEach((field) => {
      if (!isFieldMapped(field)) return;

      // Skip validations if the field is empty and not required.
      const fieldValue = newRow[field.columnName];
      const isEmpty =
        fieldValue === undefined || fieldValue === null || fieldValue === "";
      if (isEmpty && !field.columnRequired) return;

      // Custom Validations.
      const customValidations = field.validations?.filter(
        (v) => v.rule === "custom"
      ) as CustomValidation[] | undefined;

      if (customValidations) {
        customValidations.forEach((validation) => {
          if (!validation.validate(newRow[field.columnName], newRow)) {
            updateError(
              field.columnName,
              {
                message: validation.errorMessage,
                level: validation.level || "error",
                source: ErrorSources.Row,
              },
              errors
            );
          }
        });
      }

      // Regex Validations.
      const regexValidations = field.validations?.filter(
        (v) => v.rule === "regex"
      ) as RegexValidation[] | undefined;

      if (regexValidations) {
        regexValidations.forEach((validation) => {
          const regex = new RegExp(validation.value, validation.flags);
          if (!regex.test(String(newRow[field.columnName] || ""))) {
            updateError(
              field.columnName,
              {
                message: validation.errorMessage,
                level: validation.level || "error",
                source: ErrorSources.Row,
              },
              errors
            );
          }
        });
      }
    });

    return {
      ...newRow,
      __index: (row.__index as string) || nanoid(),
      __errors: Object.keys(errors).length > 0 ? errors : null,
    };
  });

  let result: (Record<string, unknown> & Meta)[] = processedRows;

  // Unique Validation
  fields.forEach((field) => {
    const uniqueValidation = field.validations?.find(
      (v) => v.rule === "unique"
    ) as UniqueValidation | undefined;

    if (uniqueValidation) {
      const isMapped = isFieldMapped(field);
      if (!isMapped) return;

      const values = result.map((entry) => entry[field.columnName]);
      const seen = new Set();
      const duplicates = new Set();
      values.forEach((val) => {
        if (uniqueValidation.allowEmpty && (val === undefined || val === ""))
          return;
        if (seen.has(val)) {
          duplicates.add(val);
        } else {
          seen.add(val);
        }
      });

      result = result.map((entry) => {
        if (duplicates.has(entry[field.columnName])) {
          const currentErrors = entry.__errors || ({} as FieldError);
          updateError(
            field.columnName,
            {
              message: uniqueValidation.errorMessage || "Field must be unique",
              level: uniqueValidation.level || "error",
              source: ErrorSources.Table,
            },
            currentErrors
          );
          return { ...entry, __errors: currentErrors };
        }
        return entry;
      });
    }
  });

  return result;
}
