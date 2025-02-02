import Papa from "papaparse";

export interface ParseCsvArgs {
  file: File;
  limit: number;
  showEmptyFields?: boolean;
  config?: Papa.ParseConfig;
}

export async function parseCsv(
  args: ParseCsvArgs
): Promise<{ data: Record<string, string>[]; columns: string[] }> {
  const { file, config = {}, limit, showEmptyFields = true } = args;

  return new Promise((resolve, reject) => {
    const parsedData: Record<string, string>[] = [];
    let columns: string[] = [];
    let rowCount = 0;

    Papa.parse<Record<string, string>>(file, {
      ...config,
      header: true,
      dynamicTyping: false,
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
          parser.abort();
          console.log("LIMIT EXCEEDED", limit, rowCount);
          reject(new Error(`Row limit exceeded: Only ${limit} rows allowed.`));
        }
      },
      complete: () => {
        console.log("Parsing complete");
        resolve({ data: parsedData, columns });
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

      rows[0] = processedColumns;
      return {
        updatedChunk: Papa.unparse(rows),
        extractedColumns: processedColumns,
      };
    }
  });
}
