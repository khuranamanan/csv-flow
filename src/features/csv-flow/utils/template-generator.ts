import { FieldConfig } from "../types";

/**
 * Generates a CSV template with headers and optional example data
 * @param fields - Array of field configurations
 * @param includeExampleRow - Whether to include an example row with sample data
 * @returns CSV content as a string
 */
export function generateCsvTemplate(
  fields: FieldConfig[],
  includeExampleRow: boolean = true
): string {
  // Generate headers using displayName or columnName
  const headers = fields.map((field) => field.displayName || field.columnName);

  // Create CSV content
  let csvContent = headers.join(",") + "\n";

  if (includeExampleRow) {
    // Generate example row with example values or default values
    const exampleRow = fields.map((field) => {
      if (field.example !== undefined && field.example !== null) {
        // Use provided example value, convert to string and escape if needed
        const exampleString = convertToString(field.example);
        return escapeCsvValue(exampleString);
      }

      // Generate default example based on field type
      return generateDefaultExample(field.type);
    });

    csvContent += exampleRow.join(",") + "\n";
  }

  return csvContent;
}

/**
 * Converts an unknown value to a string for CSV output
 * @param value - The value to convert
 * @returns String representation of the value
 */
function convertToString(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return value.toString();
  }
  if (typeof value === "boolean") {
    return value.toString();
  }
  if (value instanceof Date) {
    return value.toISOString().split("T")[0]; // YYYY-MM-DD format
  }
  if (value === null || value === undefined) {
    return "";
  }
  // For objects, arrays, etc., convert to JSON string
  return JSON.stringify(value);
}

/**
 * Generates a default example value based on field type
 * @param type - The field type
 * @returns A default example value
 */
function generateDefaultExample(type: string): string {
  switch (type) {
    case "string":
      return "Example Text";
    case "number":
      return "123";
    case "boolean":
      return "true";
    case "email":
      return "example@email.com";
    case "date":
      return "2024-01-01";
    default:
      return "Example Value";
  }
}

/**
 * Escapes CSV values that contain commas, quotes, or newlines
 * @param value - The value to escape
 * @returns The escaped value
 */
function escapeCsvValue(value: string): string {
  // If the value contains comma, quote, or newline, wrap it in quotes and escape internal quotes
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Downloads a CSV file with the given content and filename
 * @param content - The CSV content
 * @param filename - The filename for the download (default: "template.csv")
 */
export function downloadCsvTemplate(
  content: string,
  filename: string = "template.csv"
): void {
  // Create a blob with the CSV content
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });

  // Create a download link
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  // Add to DOM, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);
}
