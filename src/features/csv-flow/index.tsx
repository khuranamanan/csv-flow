import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { memo, useCallback, useState } from "react";
import MapStep from "./components/map-step";
import { ReviewStep } from "./components/review-step";
import StepIndicator from "./components/step-indicator";
import {
  CsvColumn,
  CsvFlowProps,
  FieldMappingItem,
  Meta,
  StepItems,
} from "./types";
import UploadStep from "./components/upload-step";

export type FlowSteps =
  | {
      step: StepItems.Upload;
    }
  | {
      step: StepItems.Map;
      data: Record<string, string>[];
      columns: CsvColumn[];
    }
  | {
      step: StepItems.Review;
      data: (Record<string, unknown> & Meta)[];
      fieldMappings: FieldMappingItem[];
    };

function CsvFlow(props: CsvFlowProps) {
  const {
    open,
    setOpen,
    fields,
    maxRows = 1000,
    maxFileSize = 1024 * 1024 * 2,
    enableCustomFields = false,
    customFieldReturnType = "object",
    showTemplateDownload = true,
    onImport,
  } = props;

  const [currentStep, setCurrentStep] = useState<FlowSteps>({
    step: StepItems.Upload,
  });

  const renderStep = useCallback(() => {
    switch (currentStep.step) {
      case StepItems.Upload:
        return (
          <UploadStep
            fields={fields}
            maxRows={maxRows}
            setStep={setCurrentStep}
            maxFileSize={maxFileSize}
            showTemplateDownload={showTemplateDownload}
          />
        );
      case StepItems.Map:
        return (
          <MapStep
            fields={fields}
            data={currentStep.data}
            columns={currentStep.columns}
            setStep={setCurrentStep}
            enableCustomFields={enableCustomFields}
          />
        );

      case StepItems.Review:
        return (
          <ReviewStep
            data={currentStep.data}
            fields={fields}
            fieldMappings={currentStep.fieldMappings}
            enableCustomFields={enableCustomFields}
            customFieldReturnType={customFieldReturnType}
            onImport={onImport}
            handleCloseDialog={() => {
              setOpen(false);
              setCurrentStep({
                step: StepItems.Upload,
              });
            }}
          />
        );
      default:
        return null;
    }
  }, [
    currentStep,
    fields,
    maxRows,
    maxFileSize,
    customFieldReturnType,
    enableCustomFields,
    showTemplateDownload,
    onImport,
    setOpen,
  ]);

  return (
    <Dialog
      modal
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setCurrentStep({ step: StepItems.Upload });
        }
      }}
    >
      <DialogContent
        className="h-[90vh] w-[90vw] max-w-[90vw] sm:max-w-[90vw] flex flex-col"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
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

        <div className="grow overflow-hidden">{renderStep()}</div>
      </DialogContent>
    </Dialog>
  );
}

export default memo(CsvFlow);
