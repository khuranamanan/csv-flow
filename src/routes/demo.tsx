import { DemoPage } from "@/pages/demo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo")({
  component: DemoPage,
});
