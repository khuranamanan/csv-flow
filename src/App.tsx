import { useState } from "react";
import { ThemeSwitch } from "./components/theme-switch";
import CsvFlow from "./features/csv-flow";
import { FieldConfig } from "./features/csv-flow/types";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "./components/ui/button";

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
    columnName: "age",
    displayName: "Age",
    columnRequired: false,
    type: "number",
    validations: [
      {
        rule: "custom",
        validate: (value: unknown) => typeof value === "number" && value >= 0,
        errorMessage: "Age must be a non-negative number",
        level: "error",
      },
    ],
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

function App() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="relative flex items-center justify-center min-h-dvh">
        <Button variant="outline" onClick={() => setOpen(true)}>
          Upload files
        </Button>

        <div className="absolute bottom-4 left-4">
          <ThemeSwitch />
        </div>
      </div>

      <Toaster richColors />

      <CsvFlow
        open={open}
        setOpen={setOpen}
        fields={csvFlowFieldsConfig}
        maxRows={10000}
        enableCustomFields
        onImport={(data) =>
          console.log("Received data in onImport callback:", data)
        }
      />
    </>
  );
}

export default App;
