import { CodeBlock } from "@/components/code-block";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Code,
  FileText,
  Github,
  Package,
  Shield,
} from "lucide-react";
import React, { useEffect } from "react";

// ---------------------------
// DocsSidebar Component
// ---------------------------
function DocsSidebar() {
  return (
    <aside className="fixed top-20 z-30 -ml-2 hidden h-[calc(100vh-5rem)] w-full shrink-0 md:sticky md:block overflow-y-auto pb-12">
      <div className="relative p-4 border shadow-sm rounded-xl border-border/40 backdrop-blur-md bg-background/30">
        <div className="space-y-4">
          <SidebarGroup
            title="Getting Started"
            links={[
              { href: "#introduction", label: "Introduction" },
              { href: "#features", label: "Features" },
              { href: "#installation", label: "Installation" },
            ]}
          />
          <SidebarGroup
            title="Usage"
            links={[
              { href: "#basic-integration", label: "Basic Integration" },
              {
                href: "#customization-options",
                label: "Customization Options",
              },
            ]}
          />
          <SidebarGroup
            title="API Reference"
            links={[
              { href: "#field-configurations", label: "Field Configurations" },
              {
                href: "#validation-prioritization",
                label: "Validation Prioritization",
              },
            ]}
          />
          <SidebarGroup
            title="More"
            links={[{ href: "#contributing", label: "Contributing" }]}
          />
        </div>
      </div>
    </aside>
  );
}

interface SidebarGroupLink {
  href: string;
  label: string;
}
interface SidebarGroupProps {
  title: string;
  links: SidebarGroupLink[];
}

function SidebarGroup({ title, links }: SidebarGroupProps) {
  return (
    <div className="py-1">
      <h4 className="px-2 py-1 mb-1 text-sm font-semibold rounded-md">
        {title}
      </h4>
      <div className="grid grid-flow-row text-sm auto-rows-max">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.href}
            className="flex items-center w-full px-2 py-1 rounded-md group hover:bg-accent hover:text-accent-foreground"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

// ---------------------------
// DocsHeader Component
// ---------------------------
function DocsHeader() {
  return (
    <div className="flex items-center">
      <Link
        to="/"
        className="inline-flex items-center px-3 py-1 mr-4 text-sm transition-colors rounded-full shadow-sm bg-muted/50 hover:bg-muted/80"
      >
        <ArrowLeft className="w-3 h-3 mr-1" />
        Back to Home
      </Link>
    </div>
  );
}

// ---------------------------
// DocSection Component
// ---------------------------
interface DocSectionProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function DocSection({ id, title, icon, children }: DocSectionProps) {
  return (
    <section
      id={id}
      className="p-6 space-y-4 border shadow-sm rounded-xl border-border/40 backdrop-blur-md bg-background/30 scroll-mt-20"
    >
      <div className="flex items-center gap-2">
        {icon && (
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
}

// ---------------------------
// DocsPageMain Component
// ---------------------------
function DocsPageMain() {
  useEffect(() => {
    // Optionally, you can add scroll-to-anchor or other logic here.
  }, []);

  return (
    <main className="relative">
      <div className="max-w-4xl mx-auto space-y-8">
        <DocsHeader />

        <div className="p-6 border shadow-sm rounded-xl border-border/40 backdrop-blur-md bg-background/30">
          <h1 className="text-4xl font-bold tracking-tight">
            CSV Flow Documentation
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            A powerful, open-source React CSV importer component designed for
            modern web applications.
          </p>
        </div>

        <DocSection
          id="introduction"
          title="Introduction"
          icon={<FileText className="w-4 h-4" />}
        >
          <p className="text-muted-foreground">
            <strong>CSV Flow</strong> is a powerful, open-source React component
            for CSV importing designed for modern web applications. With CSV
            Flow, you can map CSV columns to custom fields, validate data using
            advanced rules, and process your CSV data seamlessly—all within your
            React project.
          </p>
        </DocSection>

        <DocSection
          id="features"
          title="Features"
          icon={<Package className="w-4 h-4" />}
        >
          <div className="mt-4 space-y-6">
            <div className="p-4 border rounded-lg border-border/40 bg-background/50">
              <h3 className="text-xl font-bold">Custom Field Mapping</h3>
              <p className="mt-2 text-muted-foreground">
                Map CSV columns to your desired internal field names. Enable or
                disable custom fields, and choose your preferred output format:{" "}
                <strong>object</strong>, <strong>json</strong>, or{" "}
                <strong>flat</strong>.
              </p>
            </div>
            <div className="p-4 border rounded-lg border-border/40 bg-background/50">
              <h3 className="text-xl font-bold">Advanced Data Validation</h3>
              <p className="mt-2 text-muted-foreground">
                CSV Flow supports type validation & coercion, regex & custom
                validations, and unique validations ensuring that critical
                errors are prioritized.
              </p>
            </div>
            <div className="p-4 border rounded-lg border-border/40 bg-background/50">
              <h3 className="text-xl font-bold">Performance Optimized</h3>
              <p className="mt-2 text-muted-foreground">
                Built to handle thousands of rows efficiently using
                virtualization and Web Workers.
              </p>
            </div>
          </div>
        </DocSection>

        <DocSection
          id="installation"
          title="Installation"
          icon={<Code className="w-4 h-4" />}
        >
          <p className="text-muted-foreground">
            Install CSV Flow effortlessly using the shadcn CLI. CSV Flow is
            configured to integrate seamlessly with your project's design
            system.
          </p>
          <div className="mt-4 overflow-hidden border rounded-lg border-border/40">
            <CodeBlock
              language="bash"
              code="pnpm dlx shadcn@latest add https://csv-flow.vercel.app/r/csv-flow.json"
            />
          </div>
        </DocSection>

        <DocSection
          id="usage"
          title="Usage"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M12 2 2 7l10 5 10-5-10-5Z"></path>
              <path d="M2 17 12 22 22 17"></path>
              <path d="M2 12 12 17 22 12"></path>
            </svg>
          }
        >
          <div
            id="basic-integration"
            className="p-4 mt-6 border rounded-lg border-border/40 bg-background/50 scroll-mt-20"
          >
            <h3 className="text-xl font-bold">Basic Integration</h3>
            <p className="mt-2 mb-4 text-muted-foreground">
              Import CSV Flow into your application and pass in the required
              props:
            </p>
            <div className="overflow-hidden border rounded-lg border-border/40">
              <CodeBlock
                language="tsx"
                code={`import React, { useState } from "react";
import CsvFlow from "@/components/csv-flow";
import { someFieldConfigs } from "@/config/fieldConfigs";

function App() {
  const [open, setOpen] = useState(true);
  const handleImport = (data: Record<string, unknown>[]) => {
    // Process the imported data, e.g. send it to your backend API.
    console.log("Imported Data:", data);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>Open CSV Flow</button>
      <CsvFlow
        open={open}
        setOpen={setOpen}
        fields={someFieldConfigs}
        enableCustomFields={true} // Optional: enable custom fields. (Default: false)
        customFieldReturnType="object" // Optional: set custom field return type. (Default: "object")
        onImport={handleImport}
        maxRows={500}         // Optional: override default max rows (Default: 1000)
        maxFileSize={1024 * 1024} // Optional: override default max file size (Default: 2MB)
      />
    </>
  );
}

export default App;`}
              />
            </div>
          </div>

          <div
            id="customization-options"
            className="p-4 mt-6 border rounded-lg border-border/40 bg-background/50 scroll-mt-20"
          >
            <h3 className="text-xl font-bold">Customization Options</h3>
            <p className="mt-2 text-muted-foreground">
              CSV Flow accepts a variety of props to customize its behavior:
            </p>
            <ul className="mt-4 space-y-4">
              <li className="p-3 rounded-md bg-background/70">
                <code className="font-mono bg-muted/50 px-1 py-0.5 rounded text-sm">
                  fields: FieldConfig[]
                </code>
                <p className="mt-1 text-muted-foreground">
                  An array of field configurations. Each configuration defines
                  the internal name, type, whether it's required, and validation
                  rules.
                </p>
              </li>
              <li className="p-3 rounded-md bg-background/70">
                <code className="font-mono bg-muted/50 px-1 py-0.5 rounded text-sm">
                  enableCustomFields?: boolean
                </code>
                <p className="mt-1 text-muted-foreground">
                  Enable or disable custom fields in the CSV importer. (Default:
                  false)
                </p>
              </li>
              <li className="p-3 rounded-md bg-background/70">
                <code className="font-mono bg-muted/50 px-1 py-0.5 rounded text-sm">
                  customFieldReturnType?: "object" | "json" | "flat"
                </code>
                <p className="mt-1 text-muted-foreground">
                  Determine how custom fields are returned in the final output:
                </p>
                <ul className="pl-6 mt-1 space-y-1 list-disc text-muted-foreground">
                  <li>
                    <strong>object:</strong> Custom fields are nested under a{" "}
                    <code className="bg-muted/50 px-1 py-0.5 rounded text-xs">
                      customFields
                    </code>{" "}
                    key.
                  </li>
                  <li>
                    <strong>json:</strong> Custom fields are stringified into a
                    JSON string.
                  </li>
                  <li>
                    <strong>flat:</strong> Custom fields remain at the top
                    level.
                  </li>
                </ul>
                <p className="mt-1 text-muted-foreground">
                  (Default: "object")
                </p>
              </li>
              <li className="p-3 rounded-md bg-background/70">
                <code className="font-mono bg-muted/50 px-1 py-0.5 rounded text-sm">
                  maxRows?: number
                </code>
                <p className="mt-1 text-muted-foreground">
                  Maximum number of CSV rows to process. (Default: 1000)
                </p>
              </li>
              <li className="p-3 rounded-md bg-background/70">
                <code className="font-mono bg-muted/50 px-1 py-0.5 rounded text-sm">
                  maxFileSize?: number
                </code>
                <p className="mt-1 text-muted-foreground">
                  Maximum allowed file size (in bytes) for the CSV file.
                  (Default: 2097152 bytes / 2MB)
                </p>
              </li>
              <li className="p-3 rounded-md bg-background/70">
                <code className="font-mono bg-muted/50 px-1 py-0.5 rounded text-sm">
                  onImport: (data: Record&lt;string, unknown&gt;[]) =&gt; void
                </code>
                <p className="mt-1 text-muted-foreground">
                  Callback function that is invoked when the import operation is
                  triggered. The callback receives the final, cleaned data as an
                  array of objects.
                </p>
              </li>
            </ul>
          </div>
        </DocSection>

        <DocSection
          id="api-reference"
          title="API Reference"
          icon={<Shield className="w-4 h-4" />}
        >
          <DocSection id="field-configurations" title="Field Configurations">
            <p className="mt-2 text-muted-foreground">
              Each field configuration object includes:
            </p>
            <ul className="mt-4 space-y-4">
              <li className="p-3 rounded-md bg-background/70">
                <code className="font-mono bg-muted/50 px-1 py-0.5 rounded text-sm">
                  columnName: string
                </code>
                <p className="mt-1 text-muted-foreground">
                  The internal key used for the mapped data.
                </p>
              </li>
              <li className="p-3 rounded-md bg-background/70">
                <code className="font-mono bg-muted/50 px-1 py-0.5 rounded text-sm">
                  displayName?: string
                </code>
                <p className="mt-1 text-muted-foreground">
                  An optional user-friendly name for display purposes.
                </p>
              </li>
              <li className="p-3 rounded-md bg-background/70">
                <code className="font-mono bg-muted/50 px-1 py-0.5 rounded text-sm">
                  columnRequired: boolean
                </code>
                <p className="mt-1 text-muted-foreground">
                  Indicates whether the field is mandatory.
                </p>
              </li>
              <li className="p-3 rounded-md bg-background/70">
                <code className="font-mono bg-muted/50 px-1 py-0.5 rounded text-sm">
                  type: "string" | "number" | "boolean" | "email" | "date"
                </code>
                <p className="mt-1 text-muted-foreground">
                  The expected data type for the field.
                </p>
              </li>
              <li className="p-3 rounded-md bg-background/70">
                <code className="font-mono bg-muted/50 px-1 py-0.5 rounded text-sm">
                  validations?: Validation[]
                </code>
                <p className="mt-1 text-muted-foreground">
                  An array of validations applied to the field. Validations can
                  be one of:
                </p>
                <ul className="pl-6 mt-2 space-y-2 list-disc text-muted-foreground">
                  <li>
                    <strong>UniqueValidation:</strong>{" "}
                    <code className="bg-muted/50 px-1 py-0.5 rounded text-xs">
                      unique
                    </code>
                    <p className="mt-1 text-muted-foreground">
                      Ensures that the field's value is unique across the
                      dataset.
                      <br />
                      <strong>Properties:</strong>
                      <ul className="pl-4 mt-1 text-sm list-disc">
                        <li>
                          <code>allowEmpty?: boolean</code> - If true, empty
                          values are ignored in the uniqueness check.
                        </li>
                        <li>
                          <code>errorMessage?: string</code> - Optional custom
                          error message.
                        </li>
                        <li>
                          <code>level?: "info" | "warning" | "error"</code> -
                          The severity level of the error.
                        </li>
                      </ul>
                    </p>
                  </li>
                  <li>
                    <strong>RegexValidation:</strong>{" "}
                    <code className="bg-muted/50 px-1 py-0.5 rounded text-xs">
                      regex
                    </code>
                    <p className="mt-1 text-muted-foreground">
                      Validates the field value against a regular expression.
                      <br />
                      <strong>Properties:</strong>
                      <ul className="pl-4 mt-1 text-sm list-disc">
                        <li>
                          <code>value: string</code> - The regex pattern to test
                          against.
                        </li>
                        <li>
                          <code>flags?: string</code> - Optional regex flags
                          (e.g., "i" for case-insensitive).
                        </li>
                        <li>
                          <code>errorMessage: string</code> - The error message
                          if validation fails.
                        </li>
                        <li>
                          <code>level?: "info" | "warning" | "error"</code> -
                          The severity level.
                        </li>
                      </ul>
                    </p>
                  </li>
                  <li>
                    <strong>CustomValidation:</strong>{" "}
                    <code className="bg-muted/50 px-1 py-0.5 rounded text-xs">
                      custom
                    </code>
                    <p className="mt-1 text-muted-foreground">
                      Implements custom validation logic via a function.
                      <br />
                      <strong>Properties:</strong>
                      <ul className="pl-4 mt-1 text-sm list-disc">
                        <li>
                          <code>
                            validate: (value: unknown, row: Record&lt;string,
                            unknown&gt;) =&gt; boolean
                          </code>{" "}
                          - Function that returns true if valid.
                        </li>
                        <li>
                          <code>errorMessage: string</code> - The error message
                          when validation fails.
                        </li>
                        <li>
                          <code>level?: "info" | "warning" | "error"</code> -
                          The severity level.
                        </li>
                      </ul>
                    </p>
                  </li>
                </ul>
              </li>
            </ul>
          </DocSection>

          <DocSection
            id="validation-prioritization"
            title="Validation Prioritization"
          >
            <p className="mt-2 text-muted-foreground">
              If multiple validations are applied to a single field:
            </p>
            <ul className="pl-6 mt-2 space-y-2 list-disc text-muted-foreground">
              <li>
                <strong>Error messages (level "error")</strong> override
                warnings and info.
              </li>
              <li>
                <strong>Warnings</strong> override info messages.
              </li>
            </ul>
            <p className="mt-2 text-muted-foreground">
              This prioritization ensures that critical issues are addressed
              before less important ones.
            </p>
          </DocSection>
        </DocSection>

        <DocSection
          id="contributing"
          title="Contributing"
          icon={<Github className="w-4 h-4" />}
        >
          <p className="text-muted-foreground">
            CSV Flow is an open-source project and contributions are welcome!
            Visit our GitHub repository, open issues, and submit pull requests
            to help improve CSV Flow.
          </p>
          <div className="mt-4">
            <a
              href="https://github.com/khuranamanan/csv-flow"
              target="_blank"
              rel="noreferrer"
            >
              <Button className="gap-2 rounded-full">
                <Github className="w-5 h-5" />
                Star on GitHub
              </Button>
            </a>
          </div>
        </DocSection>
      </div>
    </main>
  );
}

// ---------------------------
// DocsPage Component
// ---------------------------
export function DocsPage() {
  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 py-8">
      <DocsSidebar />
      <DocsPageMain />
    </div>
  );
}
