import { ThemeSwitch } from "./components/theme-switch";

function App() {
  return (
    <div className="flex justify-center items-center min-h-dvh relative">
      App
      <div className="absolute bottom-4 left-4">
        <ThemeSwitch />
      </div>
    </div>
  );
}

export default App;
