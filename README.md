# CSV Flow

**CSV Flow** is an open-source React component for importing CSV files into your applications. It allows you to map CSV columns to custom fields, validate data with advanced rules, and process your CSV data seamlessly. CSV Flow is designed to work with modern React applications and uses popular libraries like shadcn/ui, React Table, and TanStack Virtualizer.

---

## Features

- **Custom Field Mapping**  
  Easily map CSV columns to your internal field names. Enable or disable custom fields and choose from multiple output options.

- **Advanced Validation & Error Handling**  
  Built-in support for:

  - **Type Validation & Coercion:** Automatically convert CSV strings into numbers, booleans, dates, or emails.
  - **Regex & Custom Validations:** Apply regex rules or custom validation functions to ensure data quality.
  - **Unique Validations:** Prevent duplicate entries with unique field checks.
  - **Custom Validation:** Implements custom validation logic via a function.
  - **Error Prioritization:** Critical errors (level `"error"`) override warnings and info messages.

- **Seamless React Integration**  
  Designed as a React component with customizable props for effortless integration into your projects.

---

## Installation

Install CSV Flow using the shadcn CLI integration:

```bash
pnpm dlx shadcn@latest add https://csv-flow.vercel.app/r/csv-flow.json
```

---

## Demo

https://youtu.be/f98MbYU-UiY?si=WI3ZQXlz-euifrFF

## Usage

Below is an example of how to integrate CSV Flow into your React application:

```tsx
import React, { useState } from "react";
import CsvFlow from "@/components/csv-flow";
import { csvFlowFieldsConfig } from "@/configs/csvFlowFieldsConfig";

function App() {
  const [open, setOpen] = useState(true);
  const handleImport = (data: Record<string, unknown>[]) => {
    // Process the imported data (e.g. send to your backend API)
    console.log("Imported Data:", data);
  };

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open CSV Flow</button>
      <CsvFlow
        open={open}
        setOpen={setOpen}
        fields={csvFlowFieldsConfig}
        onImport={handleImport}
        maxRows={1000}
        maxFileSize={2097152}
        enableCustomFields={false}
        customFieldReturnType="object"
      />
    </div>
  );
}

export default App;
```

---

## Documentation

For detailed documentation, please visit our [Documentation Page](https://csv-flow.vercel.app/docs).

---

## Demo & Playground

To help you get started, we provide a demo page where you can:

- **Open the CSV Flow importer:** Upload and process a CSV file using a sample configuration.
- **Download sample CSV data:** Quickly download a sample file from the public folder.
- **View Imported Data:** See the cleaned and validated data after import.

Check out our [Demo Page](https://csv-flow.vercel.app/demo) to see CSV Flow in action.

---

## Contributing

Contributions are welcome! If you find a bug or have suggestions for improvements, please open an issue or submit a pull request.
