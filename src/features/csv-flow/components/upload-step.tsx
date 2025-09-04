import { FileUploader } from "../components/file-uploader";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { parseCsv } from "../utils/csv-parse";
import { Check, Loader, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FlowSteps } from "..";
import { FieldConfig, StepItems } from "../types";
import { formatBytes, toHeaderCase } from "../utils/helpers";
import {
  generateCsvTemplate,
  downloadCsvTemplate,
} from "../utils/template-generator";

type Props = {
  fields: FieldConfig[];
  maxRows: number;
  setStep: React.Dispatch<React.SetStateAction<FlowSteps>>;
  maxFileSize: number;
  showTemplateDownload?: boolean;
};

function UploadStep(props: Props) {
  const {
    fields,
    maxRows,
    setStep,
    maxFileSize,
    showTemplateDownload = true,
  } = props;
  const [processing, setProcessing] = useState(false);

  const [files, setFiles] = useState<File[]>([]);

  function handleDownloadTemplate() {
    if (!fields || fields.length === 0) {
      toast.error("No field configurations available for template generation");
      return;
    }

    try {
      const csvContent = generateCsvTemplate(fields, true);
      downloadCsvTemplate(csvContent, "csv-template.csv");
      toast.success("Template downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate template");
      console.error("Template generation error:", error);
    }
  }

  async function onNextStepClick() {
    setProcessing(true);
    try {
      const parsedResult = await parseCsv({ file: files[0], limit: maxRows });
      // await new Promise<void>((resolve) => setTimeout(resolve, 10000));
      toast.success("CSV parsed successfully!");
      setStep({
        step: StepItems.Map,
        ...parsedResult,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Parsing failed.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="grid overflow-y-auto grid-cols-1 gap-6 grow md:grid-cols-3">
        <div className="col-span-2 h-full">
          <FileUploader
            maxFileCount={1}
            maxSize={maxFileSize}
            onValueChange={setFiles}
            containerClassName="h-full"
            className="flex-1"
            accept={{
              "text/csv": [".csv"],
            }}
          />
        </div>
        <div>
          <div className="flex flex-col gap-2 mb-4">
            <p className="p-2 text-sm text-center rounded-lg text-muted-foreground bg-muted">
              Max file size: {formatBytes(maxFileSize)}, Max rows: {maxRows}
            </p>
            {showTemplateDownload && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                className="flex gap-2 items-center w-full"
              >
                <Download className="size-4" />
                Download Template
              </Button>
            )}
          </div>
          <Separator className="my-2" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Expected Column</TableHead>
                <TableHead>Expected Type</TableHead>
                <TableHead>Required</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field) => (
                <TableRow key={field.columnName}>
                  <TableCell>{field.displayName || field.columnName}</TableCell>
                  <TableCell>{toHeaderCase(field.type)}</TableCell>
                  <TableCell>
                    {field.columnRequired ? <Check size={16} /> : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <DialogFooter>
        {processing && (
          <p className="flex gap-2 items-center mr-4 text-sm text-muted-foreground">
            <Loader className="animate-spin size-4" /> Processing...
          </p>
        )}
        <Button
          onClick={onNextStepClick}
          disabled={files.length === 0 || processing}
        >
          Next
        </Button>
      </DialogFooter>
    </div>
  );
}

export default UploadStep;
