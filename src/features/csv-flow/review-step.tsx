import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { addErrorsToData } from "@/lib/map-utils";
import { cn, toHeaderCase } from "@/lib/utils";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  RowData,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import {
  useVirtualizer,
  VirtualItem,
  Virtualizer,
} from "@tanstack/react-virtual";
import { Loader, Trash } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DataTableColumnHeader } from "./data-table-header";
import {
  CustomFieldReturnType,
  FieldConfig,
  FieldMappingItem,
  FieldStatus,
  Meta,
} from "./types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { toast } from "sonner";

type UpdateDataType = (
  rowIndex: string,
  columnName: string,
  value: unknown
) => void;

function EditableCell({
  initialValue,
  updateData,
  row,
  columnId,
  columnName,
}: {
  initialValue: unknown;
  updateData?: UpdateDataType;
  row: Row<Record<string, unknown> & Meta>;
  columnId: string;
  columnName: string;
}) {
  const [value, setValue] = useState(initialValue);

  // When the input is blurred, update the table data.
  const onBlur = () => {
    if (value !== initialValue) {
      updateData?.(row.original.__index, columnName, value);
    }
  };

  // Sync state when initialValue changes.
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const hasError = row.original.__errors?.[columnName];
  const isError = !!hasError && hasError.level === "error";
  const isWarning = !!hasError && hasError.level === "warning";
  const isInfo = !!hasError && hasError.level === "info";

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
              value={String(value)}
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
          value={String(value)}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
        />
      )}
    </div>
  );
}

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    updateData: UpdateDataType;
  }
}

interface ReviewStepProps {
  fields: FieldConfig[];
  data: (Record<string, unknown> & Meta)[];
  fieldMappings: FieldMappingItem[];
  enableCustomFields?: boolean;
  customFieldReturnType?: CustomFieldReturnType;
  onImport: (data: Record<string, unknown>[]) => void;
  handleCloseDialog: () => void;
}

export function ReviewStep(props: ReviewStepProps) {
  const {
    data,
    fieldMappings,
    fields,
    enableCustomFields,
    customFieldReturnType,
    onImport,
    handleCloseDialog,
  } = props;

  const [rowData, setRowData] =
    useState<(Record<string, unknown> & Meta)[]>(data);
  const [filterErrors, setFilterErrors] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const columns: ColumnDef<Record<string, unknown> & Meta>[] = useMemo<
    ColumnDef<Record<string, unknown> & Meta>[]
  >(() => {
    const mappingColumns = fieldMappings.reduce<
      ColumnDef<Record<string, unknown> & Meta>[]
    >((acc, mapping) => {
      if (
        mapping.status === FieldStatus.Mapped ||
        mapping.status === FieldStatus.Custom
      ) {
        acc.push({
          id: mapping.id,
          header: ({ column }) => (
            <div className="w-full pl-2">
              <DataTableColumnHeader
                column={column}
                title={mapping.mappedValue}
              />
            </div>
          ),
          enableSorting: true,
          accessorKey: mapping.mappedValue,
          size: 180,
          minSize: 100,
          cell: ({ getValue, row, table }) => (
            <EditableCell
              initialValue={getValue()}
              row={row}
              updateData={table.options.meta?.updateData}
              columnName={mapping.mappedValue}
              columnId={mapping.id}
            />
          ),
        });
      }
      return acc;
    }, []);

    return [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <div className="px-2 py-1">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        ),
        size: 48,
        minSize: 48,
        enableResizing: false,
      },
      ...mappingColumns,
    ];
  }, [fieldMappings]);

  const filteredData = useMemo(() => {
    if (!filterErrors) return rowData;
    return rowData.filter(
      (row) =>
        row.__errors &&
        Object.values(row.__errors).some((err) => err.level === "error")
    );
  }, [rowData, filterErrors]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getRowId: (row) => row.__index,
    defaultColumn: {
      minSize: 50,
      maxSize: 600,
    },
    columnResizeMode: "onChange",
    state: {
      rowSelection,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      updateData: async (rowIndex, columnName, value) => {
        const newRowData = rowData.map((row) => {
          if (row.__index === rowIndex) {
            return {
              ...row,
              [columnName]: value,
            };
          }
          return row;
        });
        const newDataWithErrors = await addErrorsToData(
          newRowData,
          fields,
          fieldMappings
        );
        setRowData(newDataWithErrors);
      },
    },
  });

  const selectedRowIds = useMemo(
    () => Object.keys(rowSelection).filter((id) => rowSelection[id]),
    [rowSelection]
  );

  const deleteSelectedRows = async () => {
    const newData = rowData.filter(
      (row) => !selectedRowIds.includes(row.__index)
    );
    const newDataWithErrors = await addErrorsToData(
      newData,
      fields,
      fieldMappings
    );

    setRowData(newDataWithErrors);
    setRowSelection({});
  };

  const handleImport = async () => {
    const hasErrors = rowData.some(
      (row) =>
        row.__errors &&
        Object.values(row.__errors).some((err) => err.level === "error")
    );

    if (hasErrors) {
      toast.error(
        "There are rows with errors. Please fix them before importing."
      );
      return;
    }

    setIsImporting(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let cleanedData = rowData.map(({ __index, __errors, ...rest }) => rest);

      if (enableCustomFields) {
        const customMappings = fieldMappings.filter(
          (mapping) => mapping.status === FieldStatus.Custom
        );
        if (customFieldReturnType === "object") {
          cleanedData = cleanedData.map((row) => {
            const customFields: Record<string, unknown> = {};
            for (const mapping of customMappings) {
              const key = mapping.mappedValue;
              if (key in row) {
                customFields[key] = row[key];
                delete row[key];
              }
            }
            return { ...row, customFields };
          });
        } else if (customFieldReturnType === "json") {
          cleanedData = cleanedData.map((row) => {
            const customFields: Record<string, unknown> = {};
            for (const mapping of customMappings) {
              const key = mapping.mappedValue;
              if (key in row) {
                customFields[key] = row[key];
                delete row[key];
              }
            }
            return { ...row, customFields: JSON.stringify(customFields) };
          });
        }
      }

      onImport(cleanedData);
      handleCloseDialog();
      toast.success("Data imported successfully!");
      setIsImporting(false);
    } catch (error) {
      toast.error("Error importing data: " + (error as Error)?.message);
      setIsImporting(false);
    }
  };

  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: number } = {};
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!;
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        {/* Top controls: Filter and Delete */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-semibold">Review Your Mapped Data</h2>
            <p className="text-sm text-muted-foreground">
              Please verify the data below. You can update any field, select
              rows to discard, or filter to display only rows with errors before
              finalizing the import.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Label className="flex items-center gap-2">
              <span>Show rows with errors</span>
              <Switch
                checked={filterErrors}
                onCheckedChange={(e: boolean) => {
                  setFilterErrors(e);
                  setRowSelection({});
                }}
              />
            </Label>

            <Button
              variant="ghost"
              size="sm"
              onClick={deleteSelectedRows}
              className="text-destructive hover:text-destructive hover:bg-destructive/5"
              disabled={!selectedRowIds.length}
            >
              <Trash className="size-3" />
              Delete Selected Rows
            </Button>
          </div>
        </div>

        {/* Table container */}
        <div
          className="relative flex-grow w-full overflow-auto text-sm border rounded-md scrollbar-thin scrollbar-thumb-muted-foreground/15 scrollbar-track-muted"
          ref={tableContainerRef}
        >
          <table
            className="grid w-full text-sm caption-bottom"
            style={columnSizeVars}
          >
            <thead className="[&_tr]:border-b bg-background z-10 grid sticky top-0">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted flex w-full"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      style={{
                        // width: header.getSize(),
                        width: `calc(var(--header-${header?.id}-size) * 1px)`,
                      }}
                      className="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] flex items-center relative group/th"
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      <div
                        className={cn({
                          "absolute top-0 right-0 cursor-col-resize w-1.5 h-full bg-muted-foreground/30 hover:bg-muted-foreground/50 rounded-lg opacity-0 group-hover/th:opacity-100 transition-opacity":
                            header.column.getCanResize(),
                        })}
                        {...{
                          onDoubleClick: () => header.column.resetSize(),
                          onMouseDown: header.getResizeHandler(),
                          onTouchStart: header.getResizeHandler(),
                        }}
                      />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <TableBody
              table={table}
              tableContainerRef={tableContainerRef}
              columnsLength={columns.length}
            />
          </table>
        </div>

        {/* Continue button */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Total Rows: {rowData.length}
            {selectedRowIds.length > 0 && (
              <span className="ml-4">
                Selected Rows: {selectedRowIds.length}
              </span>
            )}
          </div>

          <div className="flex justify-end">
            {isImporting && (
              <p className="flex items-center gap-2 mr-4 text-sm text-muted-foreground">
                <Loader className="size-4 animate-spin" /> Processing...
              </p>
            )}
            <Button disabled={isImporting} onClick={handleImport}>
              Import
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

interface TableBodyProps {
  table: Table<Record<string, unknown> & Meta>;
  tableContainerRef: React.RefObject<HTMLDivElement>;
  columnsLength: number;
}

function TableBody({
  table,
  tableContainerRef,
  columnsLength,
}: TableBodyProps) {
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: useCallback(() => 34, []),
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
  });

  useEffect(() => {
    if (tableContainerRef.current) {
      rowVirtualizer.measure();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableContainerRef.current]);

  const virtualizedRowItems = rowVirtualizer.getVirtualItems();

  return (
    <tbody
      className="[&_tr:last-child]:border-0 relative grid"
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
      }}
    >
      {virtualizedRowItems.length ? (
        virtualizedRowItems.map((virtualRow) => {
          const row = rows[virtualRow.index];

          return (
            <TableBodyRow
              key={row.id}
              row={row}
              virtualRow={virtualRow}
              rowVirtualizer={rowVirtualizer}
            />
          );
        })
      ) : (
        <tr>
          <td
            colSpan={columnsLength}
            className="h-24 p-4 text-center text-muted-foreground"
          >
            No results.
          </td>
        </tr>
      )}
    </tbody>
  );
}

interface TableBodyRowProps {
  row: Row<Record<string, unknown> & Meta>;
  virtualRow: VirtualItem;
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
}

function TableBodyRow({ row, virtualRow, rowVirtualizer }: TableBodyRowProps) {
  return (
    <tr
      data-index={virtualRow.index}
      ref={(node) => rowVirtualizer.measureElement(node)}
      style={{
        transform: `translateY(${virtualRow.start}px)`,
      }}
      key={row.id}
      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted flex absolute w-full"
      data-state={row.getIsSelected() && "selected"}
    >
      {row.getVisibleCells().map((cell) => (
        <td
          className="align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
          key={cell.id}
          style={{
            // width: `${cell.column.getSize()}px`,
            minWidth: `${cell.column.columnDef.minSize}px`,
            width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
          }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}
