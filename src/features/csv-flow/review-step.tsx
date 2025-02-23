/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  AllCommunityModule,
  CellValueChangedEvent,
  ColDef,
  GridApi,
  ModuleRegistry,
  RowNode,
  RowSelectionOptions,
  themeQuartz,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  FieldConfig,
  FieldMappingItem,
  FieldStatus,
  FieldTypes,
  Meta,
} from "./types";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { addErrorsToData } from "@/lib/map-utils";
import { CheckedState } from "@radix-ui/react-checkbox";
import { CircleAlert } from "lucide-react";
import { FlowSteps } from ".";

ModuleRegistry.registerModules([AllCommunityModule]);

interface ReviewStepProps {
  fields: FieldConfig[];
  data: (Record<string, unknown> & Meta)[];
  fieldMappings: FieldMappingItem[];
  setStep: React.Dispatch<React.SetStateAction<FlowSteps>>;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  fields,
  data: initialData,
  fieldMappings,
  // setStep,
}) => {
  const [rowData, setRowData] =
    useState<(Record<string, unknown> & Meta)[]>(initialData);
  const [filterErrors, setFilterErrors] = useState<CheckedState>(false);
  const gridApiRef = useRef<GridApi | null>(null);

  const updateData = useCallback(
    async (updatedData: (Record<string, unknown> & Meta)[]) => {
      const validatedData = await addErrorsToData(
        updatedData,
        fields,
        fieldMappings
      );
      setRowData(validatedData);
    },
    [fields, fieldMappings]
  );

  const fieldTypeToAgGridType = (type: FieldTypes) => {
    switch (type) {
      case "string":
      case "email":
      case "date":
        return "text";
      case "number":
        return "number";
      case "boolean":
        return "boolean";
      default:
        return false;
    }
  };

  const mappingColumns: ColDef[] = useMemo(() => {
    return fieldMappings.reduce<ColDef[]>((acc, mapping) => {
      const cellType =
        mapping.status === FieldStatus.Mapped
          ? fieldTypeToAgGridType(mapping.type)
          : false;

      if (
        mapping.status === FieldStatus.Mapped ||
        mapping.status === FieldStatus.Custom
      ) {
        acc.push({
          headerName: mapping.mappedValue,
          field: mapping.mappedValue,
          cellDataType: cellType,
          editable: true,
          cellEditor:
            cellType === "boolean"
              ? "agCheckboxCellEditor"
              : "agTextCellEditor",
          cellRenderer: (params: any) => {
            const value = params.value;
            const errors = params.data.__errors;
            const errorObj = errors ? errors[mapping.mappedValue] : null;
            return (
              <div className="relative h-full">
                <span>{value}</span>
                {errorObj && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CircleAlert className="absolute top-0 bottom-0 right-0 my-auto size-4 text-destructive" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{errorObj.message}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            );
          },
          cellStyle: (params: any) => {
            const errors = params.data.__errors;
            const errorObj = errors ? errors[mapping.mappedValue] : null;
            return {
              border: errorObj ? "1px solid hsl(var(--destructive))" : "",
            };
          },
        });
      }
      return acc;
    }, []);
  }, [fieldMappings]);

  const columnDefs: ColDef[] = useMemo(() => mappingColumns, [mappingColumns]);

  const onCellValueChanged = useCallback(
    async (event: CellValueChangedEvent) => {
      const updatedRow = event.data;
      const updatedData = rowData.map((row) =>
        row.__index === updatedRow.__index ? updatedRow : row
      );
      await updateData(updatedData);
    },
    [rowData, updateData]
  );

  const deleteSelectedRows = useCallback(() => {
    if (!gridApiRef.current) return;

    const selectedNodes =
      gridApiRef.current.getSelectedNodes() as RowNode<any>[];
    const selectedIds = selectedNodes.map((node) => node.data.__index);
    const newData = rowData.filter((row) => !selectedIds.includes(row.__index));
    updateData(newData);
  }, [rowData, updateData]);

  const filteredData = useMemo(() => {
    if (!filterErrors) return rowData;
    return rowData.filter(
      (row) =>
        row.__errors &&
        Object.values(row.__errors).some((err: any) => err.level === "error")
    );
  }, [rowData, filterErrors]);

  const onContinue = useCallback(() => {
    const hasErrors = rowData.some(
      (row) =>
        row.__errors &&
        Object.values(row.__errors).some((err: any) => err.level === "error")
    );
    if (hasErrors) {
      toast.error(
        "There are rows with errors. Please fix or remove them before continuing."
      );
      return;
    }
    toast.success("Data validated successfully!");
    console.log("Final validated data:", rowData);
  }, [rowData]);

  const myTheme = themeQuartz.withParams({
    backgroundColor: "hsl(var(--background))",
    foregroundColor: "hsl(var(--foreground))",
    accentColor: "hsl(var(--primary))",
    borderColor: "hsl(var(--border))",
    chromeBackgroundColor: "hsl(var(--secondary))",
    textColor: "hsl(var(--foreground))",
    headerTextColor: "hsl(var(--card-foreground))",
    headerBackgroundColor: "hsl(var(--card))",
    oddRowBackgroundColor: "hsla(var(--muted), 0.03)",
    headerColumnResizeHandleColor: "hsl(var(--primary))",
  });

  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return {
      mode: "multiRow",
      headerCheckbox: true,
      checkboxes: true,
    };
  }, []);

  const getRowId = useCallback((params: any) => params.data.__index, []);

  return (
    <div className="flex flex-col h-full p-6">
      {/* Top controls: Delete Selected & Filter Rows */}
      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <span>Filter rows with errors</span>
            <Checkbox
              checked={filterErrors}
              onCheckedChange={(e: CheckedState) => setFilterErrors(e)}
            />
          </label>
          <Button variant="destructive" onClick={deleteSelectedRows} size="sm">
            Delete Selected
          </Button>
        </div>
      </div>
      <div className="flex-grow w-full">
        <AgGridReact
          columnDefs={columnDefs}
          rowData={filteredData}
          defaultColDef={{
            flex: 1,
            minWidth: 100,
            resizable: true,
          }}
          rowSelection={rowSelection}
          onGridReady={(params) => {
            gridApiRef.current = params.api;
          }}
          onCellValueChanged={onCellValueChanged}
          theme={myTheme}
          getRowId={getRowId}
          suppressScrollOnNewData={true}
        />
      </div>
      {/* Continue button */}
      <div className="flex justify-end mt-4">
        <Button onClick={onContinue}>Import</Button>
      </div>
    </div>
  );
};

export default ReviewStep;
