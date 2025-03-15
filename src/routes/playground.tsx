import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/playground")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/playground"!</div>;
}
