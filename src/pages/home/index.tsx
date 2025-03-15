import { CodeBlock } from "@/components/code-block";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Cable,
  Code,
  Code2,
  Github,
  Shield,
  Sparkle,
  Unplug,
} from "lucide-react";

// ---------------------------
// Hero Section Component
// ---------------------------
function HeroSection() {
  return (
    <section className="relative w-full py-12 overflow-hidden md:py-24 lg:py-32 xl:py-48">
      <div className="absolute inset-0 bg-grid-small-white/[0.2] -z-10" />
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <div className="w-3/4 rounded-full h-3/4 bg-primary/5 blur-3xl" />
      </div>
      <div className="container relative px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                A Powerful React CSV Importer for Modern Apps
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Map, validate, and process your CSV data seamlessly with CSV
                Flow. Designed for React applications, CSV Flow lets you easily
                map CSV columns to your internal fields, apply advanced
                validations, and process your data into production-ready output.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <a href="#installation">
                <Button size="lg" className="rounded-full group">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>
              <Link to="/demo">
                <Button variant="outline" size="lg" className="rounded-full">
                  See the Demo
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden border shadow-2xl rounded-xl border-border/40 backdrop-blur-sm bg-background/30">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background/10 -z-10" />
            <img
              src="/placeholder.svg?height=550&width=550"
              width={550}
              height={550}
              alt="CSV Flow interface showing mapped data with error indicators and editable cells"
              className="object-cover mx-auto overflow-hidden aspect-video sm:w-full lg:order-last"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------
// Features Section Component
// ---------------------------
function FeaturesSection() {
  const features = [
    {
      icon: <Cable className="w-5 h-5" />,
      title: "Custom Field Mapping",
      description:
        "Enable or disable custom fields, and choose from flexible output options: object, JSON, or flat.",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Advanced Validation",
      description:
        "Built-in support for type coercion, regex, unique, and custom validations with priority handling.",
    },
    {
      icon: <Unplug className="w-5 h-5" />,
      title: "Seamless React Integration",
      description:
        "Designed as a React component, CSV Flow fits perfectly into your React application, offering flexible customization via props.",
    },
    {
      icon: <Sparkle className="w-5 h-5" />,
      title: "Built on Modern Tools",
      description:
        "Powered by shadcn/ui, React Table, and TanStack Virtualizer for performance and responsiveness.",
    },
    {
      icon: <Code2 className="w-5 h-5" />,
      title: "Open Source & Extensible",
      description:
        "Free to use, modify, and contribute. Explore our source code and tailor CSV Flow to your needs.",
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: "Developer Friendly",
      description:
        "Easy to integrate with your existing codebase with comprehensive documentation and examples.",
    },
  ];

  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32">
      <div className="absolute inset-0 bg-grid-small-white/[0.2] -z-10" />
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-flex items-center px-3 py-1 mb-2 text-sm border rounded-full shadow-sm border-border/40 bg-background/95 backdrop-blur-md">
            <span className="font-medium text-primary">Features</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Powerful Features
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Everything you need to import, validate, and process CSV data in
              your application.
            </p>
          </div>
        </div>
        <div className="grid max-w-5xl gap-8 py-12 mx-auto md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="flex flex-col items-start p-6 space-y-3 transition-all border shadow-sm rounded-xl border-border/40 backdrop-blur-md bg-background/30 hover:shadow-md"
            >
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------
// Installation Section Component
// ---------------------------
function InstallationSection() {
  return (
    <section
      id="installation"
      className="relative w-full py-12 md:py-24 lg:py-32"
    >
      <div className="absolute inset-0 bg-grid-small-white/[0.2] -z-10" />
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <div className="w-1/2 rounded-full h-1/2 bg-primary/5 blur-3xl" />
      </div>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-flex items-center px-3 py-1 mb-2 text-sm border rounded-full shadow-sm border-border/40 bg-background/95 backdrop-blur-md">
            <span className="font-medium text-primary">Installation</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Quick Setup
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Install CSV Flow effortlessly using shadcn CLI integration. Just
              run the command below to get started:
            </p>
          </div>
          <div className="w-full max-w-3xl mt-8">
            <div className="overflow-hidden border shadow-lg rounded-xl border-border/40 backdrop-blur-md bg-background/30">
              <CodeBlock
                language="bash"
                code="pnpm dlx shadcn@latest add https://csv-flow.vercel.app/r/csv-flow.json"
              />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              This command pulls in the CSV Flow Component, so you can integrate
              our importer into your project without hassle.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------
// Playground Section Component
// ---------------------------
function PlaygroundSection() {
  return (
    <section
      id="playground"
      className="relative w-full py-12 md:py-24 lg:py-32"
    >
      <div className="absolute inset-0 bg-grid-small-white/[0.2] -z-10" />
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-flex items-center px-3 py-1 mb-2 text-sm border rounded-full shadow-sm border-border/40 bg-background/95 backdrop-blur-md">
            <span className="font-medium text-primary">Interactive Demo</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Explore our interactive demo to see CSV Flow in action
            </h2>
            <div className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
              <p>With our demo, you can:</p>
              <ul className="mt-2 text-center list-disc list-inside">
                <li>
                  <strong>Import Sample Data:</strong> Open the CSV Flow
                  importer, use a sample CSV file from our public folder, and
                  see how your data is processed.
                </li>
                <li>
                  <strong>Review Results:</strong> Immediately view the cleaned,
                  validated, and processed data, so you know exactly what will
                  be sent to your backend.
                </li>
                <li>
                  <strong>Explore the Component:</strong> Get a feel for CSV
                  Flow’s features, including custom field mapping, advanced
                  validations, and seamless React integration.
                </li>
              </ul>
            </div>
          </div>
          <div className="flex gap-2 mt-8">
            <Link to="/demo">
              <Button className="rounded-full group">
                See the Demo
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/docs">
              <Button variant="outline" className="rounded-full">
                View Full Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------
// Open Source Section Component
// ---------------------------
function OpenSourceSection() {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32">
      <div className="absolute inset-0 bg-grid-small-white/[0.2] -z-10" />
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <div className="w-1/2 rounded-full h-1/2 bg-primary/5 blur-3xl" />
      </div>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-flex items-center px-3 py-1 mb-2 text-sm border rounded-full shadow-sm border-border/40 bg-background/95 backdrop-blur-md">
            <span className="font-medium text-primary">Open Source</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              See the Code
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              CSV Flow is open source and maintained on GitHub. Star our
              repository, explore the source code, and see how CSV Flow can help
              streamline CSV importing for your React applications.
            </p>
          </div>
          <div className="mt-6">
            <a
              href="https://github.com/khuranamanan/csv-flow"
              target="_blank"
              rel="noreferrer"
            >
              <Button className="gap-2 rounded-full group">
                <Github className="w-5 h-5" />
                Star on GitHub
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------
// HomePage Component
// ---------------------------
export function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <InstallationSection />
      <PlaygroundSection />
      <OpenSourceSection />
    </div>
  );
}
