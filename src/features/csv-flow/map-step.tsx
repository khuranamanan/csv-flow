import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  CsvColumn,
  FieldConfig,
  FieldMappingItem,
  FieldStatus,
  Meta,
  StepItems,
} from "./types";
import { addErrorsToData, mapCsvRow } from "@/lib/map-utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Loader } from "lucide-react";
import { FlowSteps } from ".";

/**
 * Transforms CSV data by mapping each row using the field mappings,
 * then applying validations based on the field configuration.
 */
async function mapData(
  fieldMappings: FieldMappingItem[],
  fields: FieldConfig[],
  data: Record<string, unknown>[]
): Promise<(Record<string, string> & Meta)[]> {
  try {
    const mappedRows = data.map((row) => mapCsvRow(row, fieldMappings));
    const validatedData = await addErrorsToData(
      mappedRows,
      fields,
      fieldMappings
    );
    return validatedData as (Record<string, string> & Meta)[];
  } catch (error) {
    console.error("Error mapping data:", error);
    throw new Error("Failed to map and validate data");
  }
}

interface MapStepProps {
  fields: FieldConfig[];
  data: Record<string, string>[];
  columns: CsvColumn[];
  setStep: React.Dispatch<React.SetStateAction<FlowSteps>>;
}

const mappingSchema = z.object({
  mappings: z.record(z.string()),
});

function MapStep({ fields, data, columns, setStep }: MapStepProps) {
  const [processing, setProcessing] = useState(false);

  const defaultValues = {
    mappings: columns.reduce((acc, col) => {
      acc[col.id] = "IGNORE_FIELD";
      return acc;
    }, {} as Record<string, string>),
  };

  const form = useForm<z.infer<typeof mappingSchema>>({
    resolver: zodResolver(mappingSchema),
    defaultValues,
  });

  const fieldOptions = fields.map((field) => ({
    value: field.columnName,
    label:
      (field.displayName || field.columnName) +
      (field.columnRequired ? " *" : ""),
  }));

  const additionalOptions = [
    { value: "CUSTOM_FIELD", label: "Custom Field" },
    { value: "IGNORE_FIELD", label: "Ignore Field" },
  ];

  const onSubmit = async (values: z.infer<typeof mappingSchema>) => {
    setProcessing(true);

    const formValues = values.mappings;

    const missingRequired = fields.filter(
      (field) =>
        field.columnRequired &&
        !Object.values(formValues).includes(field.columnName)
    );
    if (missingRequired.length > 0) {
      toast.error(
        `Please map the required fields: ${missingRequired
          .map((f) => f.displayName || f.columnName)
          .join(", ")}`
      );
      setProcessing(false);
      return;
    }

    const fieldMappings: FieldMappingItem[] = columns.map((col) => {
      const mappingOption = formValues[col.id];
      if (mappingOption === "IGNORE_FIELD") {
        return {
          id: nanoid(),
          csvValue: col.column,
          status: FieldStatus.Ignored,
        };
      } else if (mappingOption === "CUSTOM_FIELD") {
        return {
          id: nanoid(),
          csvValue: col.column,
          status: FieldStatus.Custom,
          mappedValue: col.column,
        };
      } else {
        const field = fields.find((f) => f.columnName === mappingOption);
        return {
          id: nanoid(),
          csvValue: col.column,
          status: FieldStatus.Mapped,
          mappedValue: mappingOption,
          type: field?.type || "string",
        };
      }
    });

    try {
      const mappedData = await mapData(fieldMappings, fields, data);
      // await new Promise<void>((resolve) => setTimeout(resolve, 10000));
      toast.success("Data mapped and validated successfully!");
      console.log("Mapped Data:", mappedData);
      setStep({
        step: StepItems.Review,
        data: mappedData,
        fieldMappings,
      });
    } catch (error) {
      toast.error("Error mapping data: " + (error as Error)?.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <p className="mb-2 text-sm">
        For each CSV column, select how it should be mapped to your
        application’s fields.
      </p>
      <div className="p-2 mb-4 text-xs rounded-lg bg-muted text-muted-foreground">
        <p>
          Expected Fields:{" "}
          {fields.length === 1 ? (
            <span>
              {fields[0].displayName || fields[0].columnName}
              {fields[0].columnRequired && " (Required)"}
            </span>
          ) : (
            fields.map((field, index) => (
              <span key={field.columnName}>
                {field.displayName || field.columnName}
                {field.columnRequired && " (Required)"}
                {index < fields.length - 2
                  ? ", "
                  : index === fields.length - 2
                  ? " & "
                  : ""}
              </span>
            ))
          )}
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col min-h-0 space-y-6"
        >
          <ScrollArea>
            <Table>
              <TableHeader className="sticky top-0">
                <TableRow>
                  <TableHead>CSV Column</TableHead>
                  <TableHead>Sample Data</TableHead>
                  <TableHead>Map to Field</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {columns.map((col) => {
                  const sampleValue =
                    data
                      .slice(0, 2)
                      .map((row) => row[col.column])
                      .filter(Boolean)
                      .join(", ") || "";
                  return (
                    <TableRow key={col.id}>
                      <TableCell className="font-medium min-w-40">
                        {col.column}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground">
                          {sampleValue}
                        </p>
                      </TableCell>
                      <TableCell className="min-w-80">
                        <FormField
                          control={form.control}
                          name={`mappings.${col.id}`}
                          render={({ field }) => (
                            <FormItem className="w-64">
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select mapping" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {fieldOptions.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                    {additionalOptions.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
          <div className="flex justify-end">
            {processing && (
              <p className="flex items-center gap-2 mr-4 text-sm text-muted-foreground">
                <Loader className="size-4 animate-spin" /> Processing...
              </p>
            )}
            <Button type="submit" disabled={processing}>
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default MapStep;
