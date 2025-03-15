import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CodeBlockProps = {
  language: string;
  code: string;
  className?: string;
};

export function CodeBlock(props: CodeBlockProps) {
  const { language, code, className } = props;

  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-background/50 backdrop-blur-sm">
        <div className="text-sm text-muted-foreground">{language}</div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCopy}
          className="rounded-full"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span className="sr-only">Copy code</span>
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto bg-background/50 backdrop-blur-sm">
        <code className="text-sm">{code}</code>
      </pre>
    </div>
  );
}
