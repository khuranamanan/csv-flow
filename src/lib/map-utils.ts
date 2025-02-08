import {
  ErrorSources,
  FieldConfig,
  FieldMappingItem,
  FieldStatus,
  Meta,
  Error as FieldError,
  InfoWithSource,
} from "@/features/csv-flow/types";
import { nanoid } from "nanoid";

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
 * Applies validations to the mapped data and attaches errors.
 */
export async function addErrorsToData(
  data: Record<string, unknown>[],
  fields: FieldConfig[]
): Promise<(Record<string, unknown> & Meta)[]> {
  const errors: Record<number, FieldError> = {};

  const addError = (
    rowIndex: number,
    fieldName: string,
    error: InfoWithSource
  ) => {
    errors[rowIndex] = {
      ...errors[rowIndex],
      [fieldName]: error,
    };
  };

  // Validate each field’s rules
  fields.forEach((field) => {
    data.forEach((row, rowIndex) => {
      const value = row[field.fieldName];

      // Check for empty values.
      if (value === undefined || value === null || value === "") {
        // If the field is required, add an error.
        if (field.required) {
          addError(rowIndex, field.fieldName, {
            message: "This field is required",
            level: "error",
            source: ErrorSources.Row,
          });
        }
        // Skip type and custom validations if the value is empty.
        return;
      }

      // Type validations
      if (value !== undefined && value !== null && value !== "") {
        switch (field.type) {
          case "number":
            if (isNaN(Number(value))) {
              addError(rowIndex, field.fieldName, {
                message: "Must be a number",
                level: "error",
                source: ErrorSources.Row,
              });
            }
            break;
          case "email":
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
              addError(rowIndex, field.fieldName, {
                message: "Must be a valid email",
                level: "error",
                source: ErrorSources.Row,
              });
            }
            break;
          case "date":
            if (isNaN(Date.parse(String(value)))) {
              addError(rowIndex, field.fieldName, {
                message: "Must be a valid date",
                level: "error",
                source: ErrorSources.Row,
              });
            }
            break;
        }
      }

      // Custom validations
      field.validations?.forEach((validation) => {
        switch (validation.rule) {
          // TODO: Fix Regex validation
          case "regex": {
            const regex = new RegExp(validation.value, validation.flags);
            if (!regex.test(String(value))) {
              addError(rowIndex, field.fieldName, {
                message: validation.errorMessage,
                level: validation.level || "error",
                source: ErrorSources.Row,
              });
            }
            break;
          }
          case "unique": {
            const values = data.map((entry) => entry[field.fieldName]);
            const taken = new Set();
            const duplicates = new Set();

            values.forEach((val) => {
              if (validation.allowEmpty && !val) return;
              if (taken.has(val)) {
                duplicates.add(val);
              } else {
                taken.add(val);
              }
            });

            if (duplicates.has(value)) {
              addError(rowIndex, field.fieldName, {
                message: validation.errorMessage || "Field must be unique",
                level: validation.level || "error",
                source: ErrorSources.Table,
              });
            }
            break;
          }
        }
      });
    });
  });

  return data.map((row, index) => {
    const newValue = {
      ...row,
      __index: (row.__index as string) || nanoid(),
    };

    if (errors[index]) {
      return { ...newValue, __errors: errors[index] };
    }
    if (!errors[index] && row.__errors) {
      return { ...newValue, __errors: null };
    }
    return newValue;
  });
}
