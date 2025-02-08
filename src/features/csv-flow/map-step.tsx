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

// --- Types from your codebase ---
import { FieldConfig, FieldMappingItem, FieldStatus, Meta } from "./types";
import { addErrorsToData, mapCsvRow } from "@/lib/map-utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Loader } from "lucide-react";

/**
 * Transforms CSV data by mapping each row using the field mappings,
 * then applying validations based on the field configuration.
 */
async function mapData(
  fieldMappings: FieldMappingItem[],
  fields: FieldConfig[],
  data: Record<string, string>[]
): Promise<(Record<string, string> & Meta)[]> {
  try {
    // Map each CSV row
    const mappedRows = data.map((row) => mapCsvRow(row, fieldMappings));
    // Validate and attach errors
    const validatedData = await addErrorsToData(mappedRows, fields);
    return validatedData as (Record<string, string> & Meta)[];
  } catch (error) {
    console.error("Error mapping data:", error);
    throw new Error("Failed to map and validate data");
  }
}

interface MapStepProps {
  fields: FieldConfig[];
  data: Record<string, string>[];
  columns: string[];
  // setStep prop omitted for brevity – you can add it if you need to transition to a review step.
}

const mappingSchema = z.object({
  mappings: z.record(z.string()),
});

function MapStep({ fields, data, columns }: MapStepProps) {
  const [processing, setProcessing] = useState(false);

  const form = useForm<z.infer<typeof mappingSchema>>({
    resolver: zodResolver(mappingSchema),
  });

  const fieldOptions = fields.map((field) => ({
    value: field.fieldName,
    label:
      (field.displayName || field.fieldName) + (field.required ? " *" : ""),
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
        field.required && !Object.values(formValues).includes(field.fieldName)
    );
    if (missingRequired.length > 0) {
      toast.error(
        `Please map the required fields: ${missingRequired
          .map((f) => f.displayName || f.fieldName)
          .join(", ")}`
      );
      return;
    }

    const fieldMappings: FieldMappingItem[] = columns.map((col) => {
      const mappingOption = formValues[col];
      if (mappingOption === "IGNORE_FIELD") {
        return { id: nanoid(), csvValue: col, status: FieldStatus.Ignored };
      } else if (mappingOption === "CUSTOM_FIELD") {
        // For a custom field, we default the mappedValue to the CSV column name.
        return {
          id: nanoid(),
          csvValue: col,
          status: FieldStatus.Custom,
          mappedValue: col,
        };
      } else {
        // Otherwise, the mapping option is one of the expected field names.
        return {
          id: nanoid(),
          csvValue: col,
          status: FieldStatus.Mapped,
          mappedValue: mappingOption,
        };
      }
    });

    try {
      const mappedData = await mapData(fieldMappings, fields, data);
      await new Promise<void>((resolve) => setTimeout(resolve, 10000));
      toast.success("Data mapped and validated successfully!");
      console.log("Mapped Data:", mappedData);
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
              {fields[0].displayName || fields[0].fieldName}
              {fields[0].required && " (Required)"}
            </span>
          ) : (
            fields.map((field, index) => (
              <span key={field.fieldName}>
                {field.displayName || field.fieldName}
                {field.required && " (Required)"}
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
                  // Show the sample value from the first row, if available.
                  const sampleValue =
                    data
                      .slice(0, 2)
                      .map((row) => row[col])
                      .filter(Boolean)
                      .join(", ") || "";
                  return (
                    <TableRow key={col}>
                      <TableCell className="font-medium min-w-40">
                        {col}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground">
                          {sampleValue}
                        </p>
                      </TableCell>
                      <TableCell className="min-w-80">
                        <FormField
                          control={form.control}
                          name={`mappings.${col}`}
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
