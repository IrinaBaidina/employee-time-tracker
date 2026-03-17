import { Controller, UseFormReturn } from "react-hook-form";
import { FormDatePicker } from "@/components/ui/datePicker";
import { EmployeeFormValues } from "../employeeSchema";

export const EmploymentDatesBlock = ({ form, isNewUser = false }: { form: UseFormReturn<EmployeeFormValues>, isNewUser?: boolean; }) => (
  <div className={`grid ${isNewUser ? 'grid-cols-1' : 'grid-cols-2'} gap-3 px-1`}>
    <div>
            <Controller
              control={form.control}
              name={"hiredate"}
              render={({ field }) => (
                <div>
                  <FormDatePicker
                    label="Дата приема на работу"
                    value={field.value ?? undefined}
                    onChange={(date) => field.onChange(date ?? null)}
                  />
                </div>
              )} />
            {form.formState.errors.hiredate && (
              <div>
                <p className="text-xs mt-1">
                  {form.formState.errors.hiredate.message}
                </p>
              </div>
            )}
          </div>
          {!isNewUser && (
            <div>
            <Controller
              control={form.control}
              name={"entrydate"}
              render={({ field }) => (
                <div>
                  <FormDatePicker
                    label="Дата вступления в должность"
                    value={field.value ?? undefined}
                    onChange={(date) => field.onChange(date ?? null)}
                  />
                </div>
              )} />
            {form.formState.errors.entrydate && (
              <div>
                <p className="text-xs mt-1">
                  {form.formState.errors.entrydate.message}
                </p>
              </div>
            )}
          </div>
          )}
          
  </div>
);
