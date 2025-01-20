import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import StepIndicator from "./step-indicator";
import { StepItems } from "./types";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
}

function CsvFlow(props: Props) {
  const { open, setOpen } = props;

  const [steps] = useState<StepItems>(StepItems.Upload);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Upload files</Button>
      </DialogTrigger>
      <DialogContent className="h-[90vh] w-[90vw] max-w-[90vw] flex flex-col">
        <DialogHeader className="pb-6 border-b">
          <div className="flex space-x-4">
            <StepIndicator
              number={1}
              text="Upload a CSV file"
              description="Upload a CSV file to get started"
              active={steps === StepItems.Upload}
            />
            <StepIndicator
              number={2}
              text="Map fields"
              description="Map fields to the corresponding columns"
              active={steps === StepItems.Map}
            />
            <StepIndicator
              number={3}
              text="Review data"
              description="Review the data before importing"
              active={steps === StepItems.Review}
            />
          </div>
        </DialogHeader>

        <div className="flex-grow overflow-hidden">{/* {renderStep()} */}</div>
      </DialogContent>
    </Dialog>
  );
}

export default CsvFlow;
