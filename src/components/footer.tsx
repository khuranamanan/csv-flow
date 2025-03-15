import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="w-full py-6 border-t border-border/40 md:py-0 backdrop-blur-md bg-background/80">
      <div className="container flex flex-col items-center justify-between gap-4 px-2 mx-auto md:h-24 md:flex-row">
        <p className="text-sm leading-loose text-center text-muted-foreground md:text-left">
          {new Date().getFullYear()} CSV Flow. Licensed under MIT.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link
            to="/"
            className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
          >
            Home
          </Link>
          <Link
            to="/docs"
            className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
          >
            Documentation
          </Link>
          <a
            href="https://github.com/khuranamanan/csv-flow"
            className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="mailto:khuranamanan12@gmail.com"
            className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
