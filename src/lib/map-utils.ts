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
} from "@/features/csv-flow/types";
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
        if (typeof val === "string" && val.trim() !== "") {
          const num = Number(val);
          return isNaN(num) ? val : num;
        }
        return val;
      }, z.number());
    case "boolean":
      return z.preprocess((val) => {
        if (typeof val === "string") {
          const lower = val.toLowerCase();
          if (lower === "true") return true;
          if (lower === "false") return false;
        }
        return val;
      }, z.boolean());
    case "date":
      return z.string().refine((val) => isValid(new Date(val)), {
        message: "Must be a valid date",
      });
    case "email":
      return z.string().email();
    default:
      return z.string();
  }
}

/**
 * Returns a Zod schema for a field by starting with the base schema,
 * then applying required and regex validations.
 *
 * Note: Custom validations that depend on the entire row are handled separately.
 */
function getFieldSchema(field: FieldConfig): ZodTypeAny {
  let schema = getBaseSchema(field);

  if (field.validations?.some((v) => v.rule === "required")) {
    schema = schema.refine(
      (val) => val !== undefined && val !== null && val !== "",
      { message: "This field is required" }
    );
  } else {
    schema = schema.optional();
  }

  if (field.validations) {
    field.validations.forEach((validation) => {
      if (validation.rule === "regex") {
        schema = schema.refine(
          (val) => {
            if (val === undefined || val === null || val === "") return true;
            const regex = new RegExp(validation.value, validation.flags);
            return regex.test(String(val));
          },
          { message: validation.errorMessage }
        );
      }
    });
  }

  return schema;
}

/**
 * Applies validations to the mapped data using Zod for type validations.
 * After parsing each row with the generated row schema, any Zod errors are
 * converted to your expected error format. Then, we run custom (row-level)
 * validations and table-level unique validations.
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
        errors[field.columnName] = {
          message: result.error.issues[0].message,
          level: "error",
          source: ErrorSources.Row,
        };
      }
    });

    fields.forEach((field) => {
      const customValidations = field.validations?.filter(
        (v) => v.rule === "custom"
      ) as CustomValidation[] | undefined;
      if (customValidations) {
        customValidations.forEach((validation) => {
          if (!validation.validate(newRow[field.columnName], newRow)) {
            errors[field.columnName] = {
              message: validation.errorMessage,
              level: validation.level || "error",
              source: ErrorSources.Row,
            };
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
  fields.forEach((field) => {
    const uniqueValidation = field.validations?.find(
      (v) => v.rule === "unique"
    ) as UniqueValidation | undefined;
    if (uniqueValidation) {
      const isMapped = fieldMappings.some(
        (mapping) =>
          (mapping.status === FieldStatus.Mapped ||
            mapping.status === FieldStatus.Custom) &&
          mapping.mappedValue === field.columnName
      );
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
          currentErrors[field.columnName] = {
            message: uniqueValidation.errorMessage || "Field must be unique",
            level: uniqueValidation.level || "error",
            source: ErrorSources.Table,
          };
          return { ...entry, __errors: currentErrors };
        }
        return entry;
      });
    }
  });

  return result;
}
