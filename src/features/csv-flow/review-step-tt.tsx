import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { FieldConfig, FieldMappingItem, FieldStatus, Meta } from "./types";

interface ReviewStepProps {
  fields: FieldConfig[];
  data: (Record<string, unknown> & Meta)[];
  fieldMappings: FieldMappingItem[];
  //   setStep: React.Dispatch<React.SetStateAction<FlowSteps>>;
}

export function ReviewStepTt(props: ReviewStepProps) {
  const { data, fieldMappings } = props;

  const [rowData] = useState<(Record<string, unknown> & Meta)[]>(data);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

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
        minSize: 48,
      },
      ...mappingColumns,
    ];
  }, [fieldMappings]);

  const table = useReactTable({
    data: rowData,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col h-full">
      {/* Top controls: Filter and Delete */}
      <div className="flex items-center justify-end gap-4 mb-4">
        <label className="flex items-center gap-2">
          <span>Filter rows with errors</span>
          <Checkbox
          // checked={filterErrors}
          // onCheckedChange={(e: CheckedState) => setFilterErrors(e)}
          />
        </label>
        <Button variant="destructive" size="sm">
          Delete Selected
        </Button>
      </div>

      {/* Table container */}
      <div className="relative flex-grow w-full overflow-auto text-sm border rounded-md scrollbar-thin scrollbar-thumb-muted-foreground/15 scrollbar-track-muted">
        <table className="w-full text-sm caption-bottom">
          <thead className="[&_tr]:border-b sticky top-0 z-10 bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    className="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
                      key={cell.id}
                      style={{
                        width: `${cell.column.getSize()}px`,
                        minWidth: `${cell.column.columnDef.minSize}px`,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td
                  colSpan={columns.length}
                  className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] h-24 text-center"
                >
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Continue button */}
      <div className="flex justify-end mt-4">
        <Button>Import</Button>
      </div>
    </div>
  );
}
