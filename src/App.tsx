import { useState } from "react";
import { ThemeSwitch } from "./components/theme-switch";
import CsvFlow from "./features/csv-flow";
import { FieldConfig } from "./features/csv-flow/types";

const csvFlowFieldsConfig: FieldConfig[] = [
  {
    fieldName: "firstName",
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
    required: true,
    type: "string",
    validations: [{ rule: "required" }],
  },
  {
    fieldName: "Email",
    required: false,
    type: "email",
  },
  {
    fieldName: "Phone",
    required: false,
    type: "string",
    validations: [{ rule: "unique" }],
  },
];

function App() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-center min-h-dvh">
      <CsvFlow
        open={open}
        setOpen={setOpen}
        fields={csvFlowFieldsConfig}
        maxRows={500}
      />
      <div className="absolute bottom-4 left-4">
        <ThemeSwitch />
      </div>
    </div>
  );
}

export default App;
