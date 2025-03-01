import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import {
  useVirtualizer,
  VirtualItem,
  Virtualizer,
} from "@tanstack/react-virtual";
import { useCallback, useMemo, useRef, useState } from "react";
import { FieldConfig, FieldMappingItem, FieldStatus, Meta } from "./types";
import { cn } from "@/lib/utils";

interface ReviewStepProps {
  fields: FieldConfig[];
  data: (Record<string, unknown> & Meta)[];
  fieldMappings: FieldMappingItem[];
}

export function ReviewStepTt(props: ReviewStepProps) {
  const { data, fieldMappings } = props;

  const [rowData] = useState<(Record<string, unknown> & Meta)[]>(data);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
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
          id: mapping.mappedValue,
          header: mapping.mappedValue,
          accessorKey: mapping.mappedValue,
          size: 180,
          minSize: 100,
          cell: ({ getValue }) => {
            const value = getValue() as string;
            return <div className="truncate">{value}</div>;
          },
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
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        size: 48,
        minSize: 48,
        enableResizing: false,
      },
      ...mappingColumns,
    ];
  }, [fieldMappings]);

  const table = useReactTable({
    data: rowData,
    columns,
    getRowId: (row) => row.__index,
    defaultColumn: {
      minSize: 50,
      maxSize: 600,
    },
    columnResizeMode: "onChange",
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

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
    <div className="flex flex-col h-full">
      {/* Top controls: Filter and Delete */}
      <div className="flex items-center justify-end gap-4 mb-4">
        <label className="flex items-center gap-2">
          <span>Filter rows with errors</span>
          <Checkbox checked={false} onCheckedChange={() => {}} />
        </label>
        <Button variant="destructive" size="sm">
          Delete Selected
        </Button>
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
          <TableBody table={table} tableContainerRef={tableContainerRef} />
        </table>
      </div>

      {/* Continue button */}
      <div className="flex justify-end mt-4">
        <Button>Import</Button>
      </div>
    </div>
  );
}

interface TableBodyProps {
  table: Table<Record<string, unknown> & Meta>;
  tableContainerRef: React.RefObject<HTMLDivElement>;
}

function TableBody({ table, tableContainerRef }: TableBodyProps) {
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: useCallback(() => 37, []),
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    // overscan: 5,
  });

  return (
    <tbody
      className="[&_tr:last-child]:border-0 relative"
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow.index];

        return (
          <TableBodyRow
            key={row.id}
            row={row}
            virtualRow={virtualRow}
            rowVirtualizer={rowVirtualizer}
          />
        );
      })}
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
          className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
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
