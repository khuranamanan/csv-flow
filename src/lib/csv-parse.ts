import Papa from "papaparse";

export interface ParseCsvArgs {
  file: File;
  limit: number;
  showEmptyFields?: boolean;
  config?: Papa.ParseConfig;
}

export async function parseCsv(
  args: ParseCsvArgs
): Promise<{ data: Record<string, unknown>[]; columns: string[] }> {
  const { file, config = {}, limit, showEmptyFields = true } = args;

  return new Promise((resolve, reject) => {
    const parsedData: Record<string, unknown>[] = [];
    let columns: string[] = [];
    let rowCount = 0;
    let abortedDueToLimit = false;

    Papa.parse<Record<string, unknown>>(file, {
      ...config,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      beforeFirstChunk: (chunk) => {
        const { updatedChunk, extractedColumns } = processFirstChunk(
          chunk,
          showEmptyFields
        );
        columns = extractedColumns;
        return updatedChunk;
      },
      step: (results, parser) => {
        if (rowCount < limit) {
          parsedData.push(results.data);
          rowCount++;
        } else {
          // Mark that we exceeded the row limit and abort the parsing.
          abortedDueToLimit = true;
          parser.abort();
        }
      },
      complete: () => {
        if (abortedDueToLimit) {
          reject(
            new Error(
              `🚨 Row limit exceeded: Please upload a CSV file with a maximum of ${limit} rows.`
            )
          );
        } else {
          resolve({ data: parsedData, columns });
        }
      },
      error: (error) => reject(new Error(`Parsing failed: ${error.message}`)),
    });

    function processFirstChunk(
      chunk: string,
      showEmptyFields: boolean
    ): { updatedChunk: string; extractedColumns: string[] } {
      const parsed = Papa.parse<string[]>(chunk, {
        header: false,
        skipEmptyLines: true,
      });
      const rows = parsed.data;
      const firstRow = rows[0] || [];

      const processedColumns = firstRow
        .map((col, i) => {
          if (
            !showEmptyFields &&
            !rows.slice(1).some((row) => row[i]?.trim())
          ) {
            return null;
          }
          return col.trim() || `Field ${i + 1}`;
        })
        .filter(Boolean) as string[];

      // Replace the first row with the processed columns.
      rows[0] = processedColumns;
      return {
        updatedChunk: Papa.unparse(rows),
        extractedColumns: processedColumns,
      };
    }
  });
}
