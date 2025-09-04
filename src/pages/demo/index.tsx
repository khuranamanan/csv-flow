import { useState } from "react";
import { Button } from "@/components/ui/button";
import CsvFlow from "@/features/csv-flow";
import type { CsvFlowProps, FieldConfig } from "@/features/csv-flow/types";
import JsonView from "@uiw/react-json-view";
import { githubLightTheme } from "@uiw/react-json-view/githubLight";
import { githubDarkTheme } from "@uiw/react-json-view/githubDark";
import { useTheme } from "@/context/theme-context";

const csvFlowFieldsConfig: FieldConfig[] = [
  {
    columnName: "id",
    displayName: "ID",
    columnRequired: true,
    type: "number",
    example: 1,
    validations: [
      {
        rule: "custom",
        validate: (value: unknown) => typeof value === "number" && value > 0,
        errorMessage: "ID must be a positive number",
        level: "error",
      },
    ],
  },
  {
    columnName: "firstName",
    displayName: "First Name",
    columnRequired: true,
    type: "string",
    example: "John",
    validations: [
      {
        rule: "regex",
        value: "^[a-zA-Z]+$",
        level: "warning",
        errorMessage: "First name must contain only letters",
      },
    ],
  },
  {
    columnName: "lastName",
    displayName: "Last Name",
    columnRequired: true,
    type: "string",
    example: "Doe",
    validations: [
      {
        rule: "regex",
        value: "^[a-zA-Z]+(?:[\\s-][a-zA-Z]+)*$",
        level: "info",
        errorMessage:
          "Last name ideally should contain only letters, spaces, or hyphens",
      },
    ],
  },
  {
    columnName: "Email",
    displayName: "Email",
    columnRequired: true,
    type: "email",
    example: "john.doe@example.com",
    validations: [
      {
        rule: "unique",
        level: "warning",
        allowEmpty: true,
        errorMessage: "Email must be unique",
      },
    ],
  },
  {
    columnName: "Phone",
    displayName: "Phone",
    columnRequired: false,
    type: "string",
    example: "+1234567890",
    validations: [
      {
        rule: "unique",
        level: "warning",
        allowEmpty: true,
        errorMessage: "Phone must be unique",
      },
      {
        rule: "regex",
        value: "^\\+[1-9]\\d{1,14}$",
        errorMessage: "Phone number should be of E.164 format",
        level: "error",
      },
      {
        rule: "custom",
        validate: (value: unknown) => {
          if (typeof value !== "string" || value.trim() === "") return true;
          const digits = value.replace(/\D/g, "");
          return digits.length >= 8;
        },
        errorMessage: "Phone number should have at least 8 digits",
        level: "warning",
      },
    ],
  },
  {
    columnName: "dob",
    displayName: "Date of Birth",
    columnRequired: true,
    type: "date",
    example: new Date("1990-01-15"),
  },
  {
    columnName: "isGraduate",
    displayName: "Has Graduated",
    columnRequired: true,
    type: "boolean",
    example: true,
  },
  {
    columnName: "city",
    displayName: "City",
    columnRequired: false,
    type: "string",
    example: "New York",
    validations: [
      {
        rule: "custom",
        validate: (value: unknown) => {
          if (typeof value !== "string" || value.trim() === "") return true;
          return value.charAt(0) === value.charAt(0).toUpperCase();
        },
        errorMessage: "City names should start with a capital letter",
        level: "info",
      },
    ],
  },
  {
    columnName: "country",
    displayName: "Country",
    columnRequired: false,
    type: "string",
    example: "United States",
  },
];

export function DemoPage() {
  // Manage the open state for CSV Flow and store imported data.
  const [open, setOpen] = useState<boolean>(false);
  const [importedData, setImportedData] = useState<Record<string, unknown>[]>(
    []
  );
  const { resolvedTheme } = useTheme();

  // onImport callback for CSV Flow: update imported data.
  const handleImport = (data: Record<string, unknown>[]) => {
    setImportedData(data);
  };

  // CSV Flow props (demo configuration)
  const csvFlowProps: CsvFlowProps = {
    open,
    setOpen,
    fields: csvFlowFieldsConfig,
    onImport: handleImport,
    maxRows: 1100,
    maxFileSize: 2097152, // 2MB
    enableCustomFields: true,
    customFieldReturnType: "object",
    showTemplateDownload: true, // Enable template download button
  };

  // Function to download sample CSV data
  const downloadSampleData = () => {
    const url = "/sample-demo-data.csv";
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="container overflow-x-hidden px-4 py-6 mx-auto space-y-8 max-w-full">
      <h1 className="text-3xl font-bold">CSV Flow Demo</h1>
      <div className="grid gap-8 md:grid-cols-2">
        {/* Left Column: Demo Area */}
        <div className="flex flex-col space-y-6 w-full min-w-0">
          <div className="p-4 min-w-0 rounded border shadow-sm sm:p-6 bg-background/30">
            <h2 className="mb-4 text-2xl font-bold">Demo</h2>
            <p className="mb-4 text-muted-foreground">
              Click "Open CSV Flow" to open the importer. After importing, the
              processed data will be shown below.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button onClick={() => setOpen(true)}>Open CSV Flow</Button>
              <Button variant="outline" onClick={downloadSampleData}>
                Download Sample Data
              </Button>
            </div>
            {/* Render the CSV Flow component */}
            <CsvFlow {...csvFlowProps} />
          </div>

          <div className="p-4 min-w-0 rounded border shadow-sm sm:p-6 bg-background/30">
            <h2 className="mb-4 text-2xl font-bold">Imported Data</h2>
            {importedData.length === 0 ? (
              <p className="text-muted-foreground">No data imported yet.</p>
            ) : (
              <div className="overflow-auto">
                <JsonView
                  value={importedData}
                  style={
                    resolvedTheme === "dark"
                      ? githubDarkTheme
                      : githubLightTheme
                  }
                  className="p-4 w-full break-words"
                  collapsed
                  shortenTextAfterLength={10}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Configuration & Explanation */}
        <div className="p-4 w-full min-w-0 rounded border shadow-sm sm:p-6 bg-background/30">
          <h2 className="mb-2 text-2xl font-bold">Configuration</h2>
          <p className="mb-4 text-muted-foreground">
            This CSV Flow configuration defines the following fields:
          </p>
          <ul className="mb-4 ml-6 w-full list-disc text-muted-foregroup-enabled:">
            <li>
              <strong>ID:</strong> Required number with a custom validation
              ensuring a positive value.
            </li>
            <li>
              <strong>First Name:</strong> Required string validated via regex
              to contain only letters (warning level).
            </li>
            <li>
              <strong>Last Name:</strong> While required, it comes with an
              info-level guideline recommending only letters, spaces, or
              hyphens.
            </li>
            <li>
              <strong>Email:</strong> Required email (built-in email validation)
              with uniqueness validation (warning level).
            </li>
            <li>
              <strong>Phone:</strong> Optional string that must follow E.164
              format and be unique and must have at least 8 digits
              (warning-level), plus a uniqueness check that ignores empty
              values.
            </li>
            <li>
              <strong>Date of Birth:</strong> Required date.
            </li>
            <li>
              <strong>Has Graduated:</strong> Required boolean.
            </li>
            <li>
              <strong>City:</strong> An optional field that suggests the city
              name should start with a capital letter (info-level).
            </li>
            <li>
              <strong>Country:</strong> Optional string.
            </li>
          </ul>
          <div className="overflow-auto">
            <JsonView
              value={csvFlowProps}
              style={
                resolvedTheme === "dark" ? githubDarkTheme : githubLightTheme
              }
              className="p-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
