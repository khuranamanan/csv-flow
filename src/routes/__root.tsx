import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/30">
        <Header />
        <main className="container flex-1 px-2 mx-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
      <TanStackRouterDevtools />
    </>
  ),
});
