import { Row } from "@tanstack/react-table";
import { Meta, UpdateDataType } from "../../types";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toHeaderCase } from "../../utils/helpers";

type Props = {
  initialValue: unknown;
  updateData?: UpdateDataType;
  row: Row<Record<string, unknown> & Meta>;
  columnId: string;
  columnName: string;
};

export function EditableCell(props: Props) {
  const { initialValue, updateData, row, columnId, columnName } = props;

  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    if (value !== initialValue) {
      updateData?.(row.original.__index, columnName, value);
    }
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const hasError = row.original.__errors?.[columnName];
  const isError = !!hasError && hasError.level === "error";
  const isWarning = !!hasError && hasError.level === "warning";
  const isInfo = !!hasError && hasError.level === "info";

  const displayValue = typeof value === "boolean" ? String(value) : value;

  return (
    <div
      className={cn("border border-transparent", {
        "border-l-destructive border-l-2 bg-destructive/5": isError,
        "border-l-yellow-500 border-l-2 bg-yellow-500/5": isWarning,
        "border-l-blue-500 border-l-2 bg-blue-500/5": isInfo,
      })}
    >
      {hasError ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <input
              id={`${columnId}-${row.original.__index}}`}
              className="w-full px-3 py-1 leading-normal align-middle bg-transparent text-text focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={displayValue ? String(displayValue) : ""}
              onChange={(e) => setValue(e.target.value)}
              onBlur={onBlur}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>
              <span className="font-medium">
                {toHeaderCase(hasError.level)}
              </span>
              : {hasError.message}
            </p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <input
          id={`${columnId}-${row.original.__index}}`}
          className="w-full px-3 py-1 leading-normal align-middle bg-transparent text-text focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={displayValue ? String(displayValue) : ""}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
        />
      )}
    </div>
  );
}
