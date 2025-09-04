export type CustomFieldReturnType = "object" | "json" | "flat";

/**
 * Props for the CSV Flow component.
 *
 * @interface CsvFlowProps
 *
 * @property {boolean} open - Indicates whether the CSV flow dialog is open.
 * @property {(v: boolean) => void} setOpen - Callback function to update the open state.
 * @property {FieldConfig[]} fields - An array of field configuration objects used to map CSV columns.
 *   Each object should include:
 *   - **columnName**: The internal name of the field (e.g., "Name", "Email") (Key that will be used when data is returned).
 *   - **displayName** (optional): A user-friendly name for the field. If omitted, `columnName` is used.
 *   - **columnRequired**: A boolean indicating whether the field is mandatory.
 *   - **type**: The expected data type for the field. One of "string", "number", "boolean", "email", or "date".
 *   - **example** (optional): An example value to include in the CSV template download.
 *   - **validations** (optional): An array of validations to apply. Validations can be of the following types:
 *     - **UniqueValidation**: `{ rule: "unique", allowEmpty?: boolean, errorMessage?: string, level?: "info" | "warning" | "error" }`
 *     - **RegexValidation**: `{ rule: "regex", value: string, flags?: string, errorMessage: string, level?: "info" | "warning" | "error" }`
 *     - **CustomValidation**: `{ rule: "custom", validate: (value: unknown, row: Record<string, unknown>) => boolean, errorMessage: string, level?: "info" | "warning" | "error" }`
 *
 * **Error Levels:** Default "error".
 *   - **"error"**: A critical validation error that must be resolved before import can proceed.
 *   - **"warning"** or **"info"**: These indicate less issues that are only informational and
 *     will not block the import.
 *
 * @property {number} [maxRows] - Optional. Maximum number of data rows to process. Defaults to 1000.
 * @property {number} [maxFileSize] - Optional. Maximum allowed file size (in bytes)
 * for the CSV file uploader. Defaults to 2MB.
 *
 * @property {boolean} [enableCustomFields] - When true, enables the custom fields functionality in the importer. Default is false.
 * @property {CustomFieldReturnType} [customFieldReturnType] Specifies how custom fields should be returned in the final data.
 * - "object": (default) Custom fields are returned as an object attached to the main data (e.g. under a `customFields` key).
 * - "json": Custom fields are returned as a JSON string.
 * - "flat": Custom fields are merged directly into the top-level of the final object.
 * @property {boolean} [showTemplateDownload] - When true, shows the download template button in the upload step. Default is true.
 * @property onImport - Callback function invoked when the import operation is triggered.
 *                      It receives an array of objects, where each object represents a row of imported CSV data.
 *
 * @example
 * import { useState } from "react";
 * import CsvFlow from "./features/csv-flow";
 * import { someFieldConfigs } from "./field-configurations";
 *
 * function App() {
 *   const [open, setOpen] = useState(false);
 *
 *   return (
 *     <>
 *       <button onClick={() => setOpen(true)}>Open CSV Flow</button>
 *       <CsvFlow
 *         open={open}
 *         setOpen={setOpen}
 *         fields={someFieldConfigs}
 *         maxRows={500}         // Optional: override default max rows (default is 1000)
 *         maxFileSize={1024 * 1024} // Optional: override default max file size (default is 2MB)
 *         showTemplateDownload={true} // Optional: show download template button (default is true)
 *       />
 *     </>
 *   );
 * }
 */
export type CsvFlowProps = {
  open: boolean;
  setOpen: (v: boolean) => void;
  fields: FieldConfig[];
  maxRows?: number;
  maxFileSize?: number;
  enableCustomFields?: boolean;
  customFieldReturnType?: CustomFieldReturnType;
  showTemplateDownload?: boolean;
  onImport: (data: Record<string, unknown>[]) => void;
};

export enum StepItems {
  Upload = "Upload",
  Map = "Map",
  Review = "Review",
}

type FieldTypes = "string" | "number" | "boolean" | "email" | "date";

/**
 * Configuration for a single field in the CSV.
 *
 * @interface FieldConfig
 * @property {string} columnName - The internal field name used for mapping (e.g., "Name", "Email").
 * @property {string} [displayName] - An optional human-friendly name for display purposes. If not provided, `columnName` is used.
 * @property {boolean} columnRequired - Indicates whether the field is mandatory.
 * @property {"string" | "number" | "email" | "date"} type - The expected data type for the field.
 * @property {Validation[]} [validations] - An array of additional validations to apply to this field.
 * @property {unknown} [example] - An optional example value to include in the CSV template.
 *
 * @example
 * const fieldConfig: FieldConfig = {
 *   columnName: "email",
 *   displayName: "Email Address",
 *   required: true,
 *   type: "email",
 *   example: "john.doe@example.com",
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
export interface FieldConfig {
  columnName: string; // The field name to map to (e.g., "Name", "Email")
  displayName?: string;
  columnRequired: boolean; // Whether the field is mandatory
  type: FieldTypes;
  validations?: Validation[];
  example?: unknown; // Example value for CSV template
}

/**
 * A union type representing the various kinds of field validations.
 *
 * @typedef {RequiredValidation | UniqueValidation | RegexValidation} Validation
 */
type Validation = UniqueValidation | RegexValidation | CustomValidation;

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

/**
 *
 */
/**
 * Represents a custom validation rule.
 *
 * @typedef {object} CustomValidation
 *
 * @property {"custom"} rule - A literal string indicating this is a custom validation rule.
 * @property {(value: unknown, row: Record<string, unknown>) => boolean} validate -
 *   The validation function that takes a value and its associated row, returning true if the value passes the validation, otherwise false.
 * @property {string} errorMessage - The error message to be displayed when the validation fails.
 * @property {ErrorLevel} [level] - An optional property representing the level of the error.
 */
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

type Info = {
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
// export type Errors = { [id: string]: Error };

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
      displayName?: string;
    }
  | {
      status: FieldStatus.Custom;
      mappedValue: string;
    }
  | { status: FieldStatus.Unmapped | FieldStatus.Ignored }
);

export type CsvColumn = { id: string; column: string };

export type UpdateDataType = (
  rowIndex: string,
  columnName: string,
  value: unknown
) => void;
