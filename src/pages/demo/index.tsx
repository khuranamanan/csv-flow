import { useState } from "react";
import { CodeBlock } from "@/components/code-block";
import { Button } from "@/components/ui/button";
import CsvFlow from "@/features/csv-flow";
import { CsvFlowProps, FieldConfig } from "@/features/csv-flow/types";

const csvFlowFieldsConfig: FieldConfig[] = [
  {
    columnName: "id",
    displayName: "ID",
    columnRequired: true,
    type: "number",
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
  },
  {
    columnName: "Email",
    displayName: "Email",
    columnRequired: true,
    type: "email",
    validations: [
      {
        rule: "unique",
        level: "warning",
        errorMessage: "Email must be unique",
      },
    ],
  },
  {
    columnName: "Phone",
    displayName: "Phone",
    columnRequired: false,
    type: "string",
    validations: [
      {
        rule: "unique",
        level: "warning",
        errorMessage: "Phone must be unique",
      },
      {
        rule: "regex",
        value: "^\\+[1-9]\\d{1,14}$",
        errorMessage: "Phone number should be of E.164 format",
        level: "error",
      },
    ],
  },
  {
    columnName: "dob",
    displayName: "Date of Birth",
    columnRequired: true,
    type: "date",
  },
  {
    columnName: "isGraduate",
    displayName: "Has Graduated",
    columnRequired: true,
    type: "boolean",
  },
  {
    columnName: "city",
    displayName: "City",
    columnRequired: false,
    type: "string",
  },
  {
    columnName: "country",
    displayName: "Country",
    columnRequired: false,
    type: "string",
  },
];

export function DemoPage() {
  // Manage the open state for CSV Flow and store imported data.
  const [open, setOpen] = useState<boolean>(false);
  const [importedData, setImportedData] = useState<Record<string, unknown>[]>(
    []
  );

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
    maxRows: 1000,
    maxFileSize: 2097152, // 2MB
    enableCustomFields: true,
    customFieldReturnType: "object",
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
    <div className="container p-6 mx-auto space-y-8">
      <h1 className="text-3xl font-bold">CSV Flow Demo</h1>
      <div className="grid gap-8 md:grid-cols-2">
        {/* Left Column: Demo Area */}
        <div className="flex flex-col space-y-6">
          <div className="p-6 border rounded shadow-sm bg-background/30">
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

          <div className="p-6 border rounded shadow-sm bg-background/30">
            <h2 className="mb-4 text-2xl font-bold">Imported Data</h2>
            {importedData.length === 0 ? (
              <p className="text-muted-foreground">No data imported yet.</p>
            ) : (
              <pre className="p-4 whitespace-pre-wrap bg-gray-100 rounded">
                {JSON.stringify(importedData, null, 2)}
              </pre>
            )}
          </div>
        </div>

        {/* Right Column: Configuration & Explanation */}
        <div className="p-6 border rounded shadow-sm bg-background/30">
          <h2 className="mb-2 text-2xl font-bold">Configuration</h2>
          <p className="mb-4 text-muted-foreground">
            This CSV Flow configuration defines the following fields:
          </p>
          <ul className="mb-4 ml-6 list-disc text-muted-foreground">
            <li>
              <strong>ID:</strong> Required number with a custom validation
              ensuring a positive value.
            </li>
            <li>
              <strong>First Name:</strong> Required string validated via regex
              to contain only letters (warning level).
            </li>
            <li>
              <strong>Last Name:</strong> Required string.
            </li>
            <li>
              <strong>Email:</strong> Required email (built-in email validation)
              with uniqueness validation (warning level).
            </li>
            <li>
              <strong>Phone:</strong> Optional string that must follow E.164
              format and be unique.
            </li>
            <li>
              <strong>Date of Birth:</strong> Required date.
            </li>
            <li>
              <strong>Has Graduated:</strong> Required boolean.
            </li>
            <li>
              <strong>Age:</strong> Optional number with a custom validation
              ensuring a non-negative value.
            </li>
            <li>
              <strong>City:</strong> Optional string.
            </li>
            <li>
              <strong>Country:</strong> Optional string.
            </li>
          </ul>
          <CodeBlock
            language="ts"
            code={JSON.stringify(csvFlowProps, null, 2)}
          />
        </div>
      </div>
    </div>
  );
}
