import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { memo, useCallback, useState } from "react";
import MapStep from "./map-step";
import { ReviewStep } from "./review-step";
import StepIndicator from "./step-indicator";
import { FieldConfig, FieldMappingItem, Meta, StepItems } from "./types";
import UploadStep from "./upload-step";

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
      data: (Record<string, unknown> & Meta)[];
      fieldMappings: FieldMappingItem[];
    };

/**
 * Props for the CSV Flow component.
 *
 * @interface CsvFlowProps
 *
 * @property {boolean} open - Indicates whether the CSV flow dialog is open.
 * @property {(v: boolean) => void} setOpen - Callback function to update the open state.
 * @property {FieldConfig[]} fields - An array of field configuration objects used to map CSV columns.
 * Each object should include:
 *   - **columnName**: The internal name of the field (e.g., "Name", "Email").
 *   - **displayName** (optional): A user-friendly name for the field. If omitted, `columnName` is used.
 *   - **required**: A boolean indicating whether the field is mandatory.
 *   - **type**: The expected data type for the field. One of "string", "number", "email", or "date".
 *   - **validations** (optional): An array of validations to apply. Validations can be of the following types:
 *     - **RequiredValidation**: `{ rule: "required", errorMessage?: string, level?: "info" | "warning" | "error" }`
 *     - **UniqueValidation**: `{ rule: "unique", allowEmpty?: boolean, errorMessage?: string, level?: "info" | "warning" | "error" }`
 *     - **RegexValidation**: `{ rule: "regex", value: string, flags?: string, errorMessage: string, level?: "info" | "warning" | "error" }`
 *
 *  **Error Levels:** Default "error".
 *   - **"error"**: A critical validation error that must be resolved before import can proceed.
 *   - **"warning"** or **"info"**: These indicate less critical issues that are only informational and
 *     will not block the import.
 *
 * @property {number} - Optional. Maximum number of data rows to process. Defaults to 1000.
 * @property {number | undefined} - Optional. Maximum allowed file size (in bytes)
 * for the CSV file uploader. Defaults to 2MB.
 *
 * @example
 * import { useState } from "react";
 * import CsvFlow from "./features/csv-flow";
 * import { someFieldConfigs } from "./field-configurations";
 *
 * function App() {
 *   const [open, setOpen] = useState(false);
 *
 *   return (
 *     <>
 *       <button onClick={() => setOpen(true)}>Open CSV Flow</button>
 *       <CsvFlow
 *         open={open}
 *         setOpen={setOpen}
 *         fields={someFieldConfigs}
 *         maxRows={500}         // Optional: override default max rows (default is 1000)
 *         maxFileSize={1024 * 1024} // Optional: override default max file size (default is 2MB)
 *       />
 *     </>
 *   );
 * }
 */
interface CsvFlowProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  fields: FieldConfig[];
  maxRows?: number;
  maxFileSize?: number;
}

function CsvFlow(props: CsvFlowProps) {
  const {
    open,
    setOpen,
    fields,
    maxRows = 1000,
    maxFileSize = 1024 * 1024 * 2,
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
          />
        );
      case StepItems.Map:
        return (
          <MapStep
            fields={fields}
            data={currentStep.data}
            columns={currentStep.columns}
            setStep={setCurrentStep}
          />
        );

      case StepItems.Review:
        return (
          <ReviewStep
            data={currentStep.data}
            fields={fields}
            fieldMappings={currentStep.fieldMappings}
          />
        );
      default:
        return null;
    }
  }, [currentStep, fields, maxRows, maxFileSize]);

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
        className="h-[90vh] w-[90vw] max-w-[90vw] flex flex-col"
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

        <div className="flex-grow overflow-hidden">{renderStep()}</div>
      </DialogContent>
    </Dialog>
  );
}

export default memo(CsvFlow);
