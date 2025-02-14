import { FileUploader } from "@/components/file-uploader";
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
import { parseCsv } from "@/lib/csv-parse";
import { formatBytes } from "@/lib/utils";
import { Check, Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FlowSteps } from ".";
import { FieldConfig, StepItems } from "./types";

interface Props {
  fields: FieldConfig[];
  maxRows: number;
  setStep: React.Dispatch<React.SetStateAction<FlowSteps>>;
  maxFileSize: number;
}

function UploadStep(props: Props) {
  const { fields, maxRows, setStep, maxFileSize } = props;
  const [processing, setProcessing] = useState(false);

  const [files, setFiles] = useState<File[]>([]);

  async function onNextStepClick() {
    setProcessing(true);
    try {
      const parsedResult = await parseCsv({ file: files[0], limit: maxRows });
      // await new Promise<void>((resolve) => setTimeout(resolve, 10000));
      toast.success("CSV parsed successfully!");
      console.log(parsedResult);
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
    <div className="flex flex-col h-full gap-4">
      <div className="grid flex-grow grid-cols-3 gap-6">
        <div className="h-full col-span-2">
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
          <p className="p-2 text-sm text-center rounded-lg text-muted-foreground bg-muted">
            Max file size: {formatBytes(maxFileSize)}, Max rows: {maxRows}
          </p>
          <Separator className="my-2" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Expected Column</TableHead>
                <TableHead>Required</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field) => (
                <TableRow key={field.fieldName}>
                  <TableCell>{field.displayName || field.fieldName}</TableCell>
                  <TableCell>
                    {field.required ? <Check size={16} /> : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <DialogFooter>
        {processing && (
          <p className="flex items-center gap-2 mr-4 text-sm text-muted-foreground">
            <Loader className="size-4 animate-spin" /> Processing...
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
