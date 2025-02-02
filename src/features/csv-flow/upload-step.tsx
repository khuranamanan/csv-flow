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
import { Check } from "lucide-react";
import { useState } from "react";
import { FieldConfig, StepItems } from "./types";

type Props = {
  fields: FieldConfig[];
  maxRows: number;
  setStep: (step: StepItems) => void;
};

function UploadStep(props: Props) {
  const { fields, maxRows, setStep } = props;

  const [files, setFiles] = useState<File[]>([]);

  async function onNextStepClick() {
    try {
      const parsedResult = await parseCsv({ file: files[0], limit: maxRows });

      console.log(parsedResult);
      setStep(StepItems.Map);
    } catch (error) {
      //   toast(error);
      console.log("error in parsing", error);
    }
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="grid flex-grow grid-cols-3 gap-6">
        <div className="h-full col-span-2">
          <FileUploader
            maxFileCount={1}
            maxSize={8 * 1024 * 1024}
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
            Max file size: 8MB, Max rows: {maxRows}
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
                  <TableCell>{field.fieldName}</TableCell>
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
        <Button onClick={onNextStepClick} disabled={files.length === 0}>
          Next
        </Button>
      </DialogFooter>
    </div>
  );
}

export default UploadStep;
