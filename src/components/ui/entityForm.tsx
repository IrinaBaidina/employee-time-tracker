import { useCallback, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ControllerRenderProps, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodTypeAny } from "zod";
import { FieldValues, Path } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/NativeSelect";
import { FieldChangingRespError } from "@/services/server/ServerErrors";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./calendar";
import { Textarea } from "./textArea";
import { Locale } from "date-fns";
import { Mode } from "react-day-picker";

// типы конфигурации формы
type FieldType = "input" | "select" | "textarea" | "date" | "label" | "extra";

interface FieldConfigBase<T extends FieldValues> {
  name: Path<T>; // имя поля
  label: string;          // отображаемое название
  type: FieldType;        // какой компонент отрисовать
  placeholder?: string;
  className?: string;
  labelClassName?: string;
}

interface LabelField<T extends FieldValues> extends FieldConfigBase<T> {
  type: "label";
}

interface InputField<T extends FieldValues> extends FieldConfigBase<T> {
  type: "input" | "textarea";
  inputType?: React.HTMLInputTypeAttribute;
  readOnly?: boolean,
}

interface SelectField<T extends FieldValues> extends FieldConfigBase<T> {
  type: "select";
  options: { value: string; label: string }[];
}

interface DateField<T extends FieldValues> extends FieldConfigBase<T> {
  type: "date";
  locale?: Locale;
  mode?: Mode;
  datesRepresentation: (from?: Date, to?: Date) => string;
}

interface ExtraField<T extends FieldValues> extends FieldConfigBase<T> {
  type: "extra";
  renderExtraFields?: (form: UseFormReturn<T>) => React.ReactNode;
}

export type FieldConfig<T extends FieldValues> = InputField<T> | SelectField<T> | DateField<T> | LabelField<T> | ExtraField<T>;

export type ErrorSchema<TSchema extends ZodTypeAny> = Record<
  string,                          // сообщение с бэка
  keyof z.infer<TSchema> | "root"  // куда мапить: поле или глобальная ошибка
>;

interface EntityFormProps<TSchema extends ZodTypeAny> {
  item?: z.infer<TSchema> | null;
  schema: TSchema;
  fields?: FieldConfig<z.infer<TSchema>>[];
  onSubmit: (data: z.infer<TSchema>) => Promise<void> | void;
  title?: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => Promise<void> | void;
}

export function EntityForm<TSchema extends ZodTypeAny>({
  item,
  schema,
  fields,
  onSubmit,
  title,
  description,
  open,
  onOpenChange,
  onClose,
}: EntityFormProps<TSchema>) {
  const [isDialogOpen, setIsDialogOpen] = useState(open);
  const form = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    if (open) {
      form.reset(item as z.infer<TSchema>);
    }
    setIsDialogOpen(open);
  }, [open]);

  const handleOpenChange = async (nextOpen: boolean) => {
    onOpenChange?.(nextOpen);
    if (!nextOpen && onClose)
      await onClose();
  };

  const createFormControls = useCallback((fieldConfig: FieldConfig<TSchema>, field: ControllerRenderProps<TSchema, Path<TSchema>>) => {
    if (fieldConfig.type === "label")
      return <h1 {...field} id={fieldConfig.name}>{field.value}</h1>;

    else if (fieldConfig.type === "input")
      return <Input id={fieldConfig.name} placeholder={fieldConfig.placeholder} type={fieldConfig.inputType} {...field} />;

    else if (fieldConfig.type === "textarea")
      return (
        <Textarea
          id={fieldConfig.name}
          className=""
          placeholder={fieldConfig.placeholder}
          readOnly={fieldConfig.readOnly}
          {...field}
        />
      );

    else if (fieldConfig.type === "select" && "options" in fieldConfig) {
      return (
        <NativeSelect
          id={fieldConfig.name}
          value={field.value}
          onChange={field.onChange}
          name={field.name}
          ref={field.ref}
          options={fieldConfig.options}
          placeholder="Выберите значение..."
        />
      );
    }
    else if (fieldConfig.type === "date") {
      const calendarModeProps =
        fieldConfig.mode === "range" || fieldConfig.mode === undefined
          ? { mode: "range" as const, required: true }
          : { mode: fieldConfig.mode };
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={fieldConfig.name}
              variant="outline"
              className="w-full justify-start text-left font-normal date-picker-trigger">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {field.value ? fieldConfig.datesRepresentation(field.value.from || field.value, field.value.to) : field.value}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              {...field}
              {...calendarModeProps}
              selected={field.value}
              locale={fieldConfig.locale}
              className={cn("p-3 pointer-events-auto")}
              onSelect={field.onChange}
            />
          </PopoverContent>
        </Popover>
      )
    }
    else if (fieldConfig.type === "extra") {
      return fieldConfig.renderExtraFields ? fieldConfig.renderExtraFields(form) : null;
    }
  }, [form]);

  const onFormSubmit = useCallback(
    async (data: z.infer<TSchema>) => {
      try {
        await onSubmit(data);
        handleOpenChange(false);
      } catch (error) {
        if (error instanceof FieldChangingRespError) {
          if (error.field && error.field !== "root") {
            // Ошибка на конкретное поле
            form.setError(error.field as Path<z.infer<TSchema>>, {
              type: "server",
              message: error.message,
            });
          } else {
            // Глобальная ошибка (root)
            form.setError("root", {
              type: "server",
              message: error.message,
            });
          }
        }
        else {
          form.setError("root", {
            type: "server",
            message: `${error}`,
          });
        }
      }
    },
    [onSubmit, form, handleOpenChange]
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[95vw] w-fit max-w-[95vw] max-h-[90vh] p-8 grid grid-rows-[auto_minmax(0,1fr)] overflow-hidden"
      >
        <DialogHeader className="shrink-0">
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="overflow-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onFormSubmit)}
              className="flex flex-col gap-4 flex-1 max-h-[75vh]">
              {fields?.map((fieldConfig) => (
                <FormField
                  key={fieldConfig.name}
                  control={form.control}
                  name={fieldConfig.name}
                  render={({ field }) => (
                    <FormItem className={fieldConfig.className}>
                      {fieldConfig.type !== 'extra' && (fieldConfig.type === "label" ?
                        <FormDescription className={fieldConfig.labelClassName}>
                          {fieldConfig.label}
                        </FormDescription>
                        :
                        <FormLabel htmlFor={fieldConfig.name} className={fieldConfig.labelClassName}>
                          {fieldConfig.label}
                        </FormLabel>)}
                      <FormControl>
                        {createFormControls(fieldConfig, field)}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              {form.formState.errors.root && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.root.message}
                </p>
              )}

              <DialogFooter className="content-center sm:justify-center pt-2">
                <Button type="submit" variant="destructive">
                  Сохранить
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}