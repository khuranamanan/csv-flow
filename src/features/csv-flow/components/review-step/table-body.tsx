import { Table } from "@tanstack/react-table";
import { Meta } from "../../types";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useEffect } from "react";
import { TableBodyRow } from "./table-body-row";

type TableBodyProps = {
  table: Table<Record<string, unknown> & Meta>;
  tableContainerRef: React.RefObject<HTMLDivElement>;
  columnsLength: number;
};

export function TableBody(props: TableBodyProps) {
  const { table, tableContainerRef, columnsLength } = props;

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: useCallback(() => 34, []),
    getScrollElement: () => tableContainerRef.current,
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
