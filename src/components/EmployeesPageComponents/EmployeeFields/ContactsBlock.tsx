import { Controller, UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormDatePicker } from "@/components/ui/datePicker";
import { EmployeeFormValues } from "../employeeSchema";
import { cn } from "@/lib/utils";

export const ContactsBlock = ({ form }: { form: UseFormReturn<EmployeeFormValues> }) => (
  <div className="grid grid-cols-3 gap-3 px-1 ">
    <div>
        <Controller
            control={form.control}
            name={"phone"}
            render={({ field }) => (
            <div className="flex flex-col gap-1">
                <Label
                    className={cn(
                        "flex flex-col gap-1",
                        !!form.formState.errors.phone && "text-red-500"
                    )}
                    >
                Мобильный телефон
                <Input placeholder="+7-912-567-8901" {...field} />
                </Label>
            </div>
            )} />
        {form.formState.errors.phone && (
            <div>
            <p className="text-xs mt-1 text-red-500">
                {form.formState.errors.phone.message}
            </p>
            </div>
        )}
        </div>
        <div>
        <Controller
            control={form.control}
            name={"email"}
            render={({ field }) => (
            <div className="flex flex-col gap-1">
                <Label
                    className={cn(
                        "flex flex-col gap-1",
                        !!form.formState.errors.email && "text-red-500"
                    )}
                    >
                email
                <Input {...field} placeholder="user@rlproject.ru" type="email"/>
                </Label>
            </div>
            )} />
        {form.formState.errors.email && (
            <div>
            <p className="text-xs mt-1 text-red-500">
                {form.formState.errors.email.message}
            </p>
            </div>
        )}
        </div>
        <div>
            <Controller
                control={form.control}
                name={"birthdate"}
                render={({ field }) => (
                <div className="flex flex-col gap-1">
                    <FormDatePicker
                        label="Дата рождения"
                        value={field.value ?? undefined}
                        onChange={(date) => field.onChange(date ?? null)}
                    />
                </div>
            )} />
            {form.formState.errors.birthdate && (
              <div>
                <p className="text-xs mt-1 text-red-500">
                  {form.formState.errors.birthdate.message}
                </p>
              </div>
            )}
        
        </div>
  </div>
);
