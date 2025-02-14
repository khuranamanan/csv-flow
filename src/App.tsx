import { useState } from "react";
import { ThemeSwitch } from "./components/theme-switch";
import CsvFlow from "./features/csv-flow";
import { FieldConfig } from "./features/csv-flow/types";
import { Toaster } from "sonner";
import { Button } from "./components/ui/button";

const csvFlowFieldsConfig: FieldConfig[] = [
  {
    fieldName: "id",
    displayName: "ID",
    required: true,
    type: "number",
    // validations: [{ rule: "required" }],
  },
  {
    fieldName: "firstName",
    displayName: "First Name",
    required: true,
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
    fieldName: "lastName",
    displayName: "Last Name",
    required: true,
    type: "string",
    validations: [{ rule: "required" }],
  },
  {
    fieldName: "Email",
    displayName: "Email",
    required: true,
    type: "email",
    validations: [{ rule: "unique" }],
  },
  {
    fieldName: "Phone",
    displayName: "Phone",
    required: false,
    type: "string",
    validations: [{ rule: "unique" }],
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
