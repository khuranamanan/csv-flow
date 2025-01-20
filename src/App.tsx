import { useState } from "react";
import { ThemeSwitch } from "./components/theme-switch";
import CsvFlow from "./features/csv-flow";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-center min-h-dvh">
      <CsvFlow open={open} setOpen={setOpen} />
      <div className="absolute bottom-4 left-4">
        <ThemeSwitch />
      </div>
    </div>
  );
}

export default App;
