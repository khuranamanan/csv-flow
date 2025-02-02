export enum StepItems {
  Upload = "Upload",
  Map = "Map",
  Review = "Review",
}

export interface FieldConfig {
  fieldName: string; // The field name to map to (e.g., "Name", "Email")
  required: boolean; // Whether the field is mandatory
  type: "string" | "number" | "email" | "date"; // Type of the field
  validations?: Validation[];
}

export type Validation =
  | RequiredValidation
  | UniqueValidation
  | RegexValidation;

export type RequiredValidation = {
  rule: "required";
  errorMessage?: string;
  level?: ErrorLevel;
};

export type UniqueValidation = {
  rule: "unique";
  allowEmpty?: boolean;
  errorMessage?: string;
  level?: ErrorLevel;
};

export type RegexValidation = {
  rule: "regex";
  value: string;
  flags?: string;
  errorMessage: string;
  level?: ErrorLevel;
};

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
