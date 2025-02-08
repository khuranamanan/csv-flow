import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import StepIndicator from "./step-indicator";
import { FieldConfig, StepItems } from "./types";
import UploadStep from "./upload-step";
import MapStep from "./map-step";

export type FlowSteps =
  | {
      step: StepItems.Upload;
    }
  | {
      step: StepItems.Map;
      data: Record<string, string>[];
      columns: string[];
    }
  | {
      step: StepItems.Review;
    };

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  fields: FieldConfig[];
  maxRows?: number;
}

function CsvFlow(props: Props) {
  const { open, setOpen, fields, maxRows = 1000 } = props;

  const [currentStep, setCurrentStep] = useState<FlowSteps>({
    step: StepItems.Upload,
  });

  const renderStep = () => {
    switch (currentStep.step) {
      case StepItems.Upload:
        return (
          <UploadStep
            fields={fields}
            maxRows={maxRows}
            setStep={setCurrentStep}
          />
        );
      case StepItems.Map:
        return (
          <MapStep
            fields={fields}
            data={currentStep.data}
            columns={currentStep.columns}
          />
        );

      case StepItems.Review:
        return <></>;
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setCurrentStep({ step: StepItems.Upload });
        }
      }}
    >
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
              active={currentStep.step === StepItems.Upload}
            />
            <StepIndicator
              number={2}
              text="Map fields"
              description="Map fields to the corresponding columns"
              active={currentStep.step === StepItems.Map}
            />
            <StepIndicator
              number={3}
              text="Review data"
              description="Review the data before importing"
              active={currentStep.step === StepItems.Review}
            />
          </div>
        </DialogHeader>

        <div className="flex-grow overflow-hidden">{renderStep()}</div>
      </DialogContent>
    </Dialog>
  );
}

export default CsvFlow;
