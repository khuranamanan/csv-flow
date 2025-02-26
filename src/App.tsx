import { useState } from "react";
import { ThemeSwitch } from "./components/theme-switch";
import CsvFlow from "./features/csv-flow";
import { FieldConfig } from "./features/csv-flow/types";
import { Toaster } from "sonner";
import { Button } from "./components/ui/button";

const csvFlowFieldsConfig: FieldConfig[] = [
  {
    columnName: "id",
    displayName: "ID",
    columnRequired: true,
    type: "number",
    // validations: [{ rule: "required" }],
  },
  {
    columnName: "firstName",
    displayName: "First Name",
    columnRequired: true,
    type: "string",
    validations: [
      { rule: "required" },
      {
        rule: "regex",
        value: "^[a-zA-Z]+$",
        errorMessage: "First name must contain only letters",
      },
    ],
  },
  {
    columnName: "lastName",
    displayName: "Last Name",
    columnRequired: true,
    type: "string",
    validations: [{ rule: "required" }],
  },
  {
    columnName: "Email",
    displayName: "Email",
    columnRequired: true,
    type: "email",
    validations: [{ rule: "unique" }],
  },
  {
    columnName: "Phone",
    displayName: "Phone",
    columnRequired: false,
    type: "string",
    validations: [
      { rule: "unique" },
      {
        rule: "regex",
        value: "^[0-9]+$",
        errorMessage: "Phone number must contain only numbers",
      },
    ],
  },
  // {
  //   columnName: "date",
  //   columnRequired: true,
  //   type: "date",
  //   displayName: "Date",
  //   validations: [{ rule: "required" }],
  // },
  // {
  //   columnName: "Boolean",
  //   columnRequired: true,
  //   type: "boolean",
  //   displayName: "Boolean",
  // },
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

      <Toaster />

      <CsvFlow
        open={open}
        setOpen={setOpen}
        fields={csvFlowFieldsConfig}
        maxRows={10000}
      />
    </>
  );
}

export default App;
