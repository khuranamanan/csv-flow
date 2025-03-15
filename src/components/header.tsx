import csvFlowLogo from "@/assets/CSV-flow-logo.svg";
import csvFlowLogoWhite from "@/assets/CSV-flow-logo-white.svg";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "@tanstack/react-router";
import { Github, Menu } from "lucide-react";
import { ThemeSwitch } from "./theme-switch";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/80 border-b border-border/40 supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16 px-2 mx-auto">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <img src={csvFlowLogo} className="size-20 dark:hidden" />
            <img
              src={csvFlowLogoWhite}
              className="hidden size-20 dark:inline"
            />
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              to="/playground"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Playground
            </Link>
            <Link
              to="/docs"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Documentation
            </Link>
            <a
              href="https://github.com/khuranamanan/csv-flow"
              className="text-sm font-medium transition-colors hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <a
            href="https://github.com/khuranamanan/csv-flow"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="ghost" size="icon" className="rounded-full">
              <Github className="w-5 h-5" />
              <span className="sr-only">GitHub</span>
            </Button>
          </a>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full md:hidden"
              >
                <Menu className="w-5 h-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-l backdrop-blur-xl bg-background/80 border-border/40"
            >
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  to="/"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Home
                </Link>
                <Link
                  to="/playground"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Playground
                </Link>
                <Link
                  to="/docs"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Documentation
                </Link>
                <a
                  href="https://github.com/khuranamanan/csv-flow"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  GitHub
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
