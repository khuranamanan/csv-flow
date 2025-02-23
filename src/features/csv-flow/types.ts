export enum StepItems {
  Upload = "Upload",
  Map = "Map",
  Review = "Review",
}

/**
 * Configuration for a single field in the CSV.
 *
 * @interface FieldConfig
 * @property {string} columnName - The internal field name used for mapping (e.g., "Name", "Email").
 * @property {string} [displayName] - An optional human-friendly name for display purposes. If not provided, `columnName` is used.
 * @property {boolean} required - Indicates whether the field is mandatory.
 * @property {"string" | "number" | "email" | "date"} type - The expected data type for the field.
 * @property {Validation[]} [validations] - An array of additional validations to apply to this field.
 *
 * @example
 * const fieldConfig: FieldConfig = {
 *   columnName: "email",
 *   displayName: "Email Address",
 *   required: true,
 *   type: "email",
 *   validations: [
 *     {
 *       rule: "regex",
 *       value: "^[\\w.-]+@[\\w.-]+\\.\\w+$",
 *       errorMessage: "Invalid email format",
 *       level: "error"
 *     }
 *   ]
 * };
 */

export type FieldTypes = "string" | "number" | "boolean" | "email" | "date";

export interface FieldConfig {
  columnName: string; // The field name to map to (e.g., "Name", "Email")
  displayName?: string;
  columnRequired: boolean; // Whether the field is mandatory
  type: FieldTypes;
  validations?: Validation[];
}

/**
 * A union type representing the various kinds of field validations.
 *
 * @typedef {RequiredValidation | UniqueValidation | RegexValidation} Validation
 */
export type Validation =
  | RequiredValidation
  | UniqueValidation
  | RegexValidation
  | CustomValidation;

/**
 * Validation for required fields.
 *
 * @typedef {Object} RequiredValidation
 * @property {"required"} rule - The rule identifier.
 * @property {string} [errorMessage] - Optional custom error message if the field is missing.
 * @property {ErrorLevel} [level] - The severity level of the error.
 */
export type RequiredValidation = {
  rule: "required";
  errorMessage?: string;
  level?: ErrorLevel;
};

/**
 * Validation to ensure a field's value is unique across the dataset.
 *
 * @typedef {Object} UniqueValidation
 * @property {"unique"} rule - The rule identifier.
 * @property {boolean} [allowEmpty] - If true, empty values will be ignored in the uniqueness check.
 * @property {string} [errorMessage] - Optional custom error message.
 * @property {ErrorLevel} [level] - The severity level of the error.
 */
export type UniqueValidation = {
  rule: "unique";
  allowEmpty?: boolean;
  errorMessage?: string;
  level?: ErrorLevel;
};

/**
 * Validation using a regular expression.
 *
 * @typedef {Object} RegexValidation
 * @property {"regex"} rule - The rule identifier.
 * @property {string} value - The regular expression pattern to test against.
 * @property {string} [flags] - Optional regex flags (e.g., "i" for case-insensitive).
 * @property {string} errorMessage - The error message to display if validation fails.
 * @property {ErrorLevel} [level] - The severity level of the error.
 */
export type RegexValidation = {
  rule: "regex";
  value: string;
  flags?: string;
  errorMessage: string;
  level?: ErrorLevel;
};

export type CustomValidation = {
  rule: "custom";
  validate: (value: unknown, row: Record<string, unknown>) => boolean;
  errorMessage: string;
  level?: ErrorLevel;
};

/**
 * The severity level for a validation error.
 *
 * @typedef {"info" | "warning" | "error"} ErrorLevel
 */
export type ErrorLevel = "info" | "warning" | "error";

export type Info = {
  message: string;
  level: ErrorLevel;
};

export enum ErrorSources {
  Table = "table",
  Row = "row",
}

export type InfoWithSource = Info & {
  source: ErrorSources;
};

export type Meta = { __index: string; __errors?: Error | null };
export type Error = { [key: string]: InfoWithSource };
export type Errors = { [id: string]: Error };

export enum FieldStatus {
  Unmapped = "Unmapped",
  Custom = "Custom",
  Mapped = "Mapped",
  Ignored = "Ignored",
}

export type FieldMappingItem = {
  id: string;
  csvValue: string;
} & (
  | {
      status: FieldStatus.Mapped;
      mappedValue: string;
      type: FieldTypes;
    }
  | {
      status: FieldStatus.Custom;
      mappedValue: string;
    }
  | { status: FieldStatus.Unmapped | FieldStatus.Ignored }
);
