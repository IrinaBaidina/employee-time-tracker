import { Controller, UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EmployeeFormValues } from "../employeeSchema";

export const PersonalBlock = ({ form }: { form: UseFormReturn<EmployeeFormValues> }) => (
  <div className="grid grid-cols-3 gap-3 px-1">
   <div>
        <Controller
            control={form.control}
            name={"first_name"}
            render={({ field }) => (
            <div>
                <Label className={!!form.formState.errors.first_name ? "text-red-500" : ""}>
                Имя *
                <Input placeholder="Иван" required {...field} />
                </Label>
            </div>
            )} />
        {form.formState.errors.first_name && (
            <div>
            <p className="text-xs mt-1 text-red-500">
                {form.formState.errors.first_name.message}
            </p>
            </div>
        )}
        </div>
        <div>
        <Controller
            control={form.control}
            name={"last_name"}
            render={({ field }) => (
            <div>
                <Label className={!!form.formState.errors.last_name ? "text-red-500" : ""}>
                Фамилия *
                <Input placeholder="Иванов" required {...field} />
                </Label>
            </div>
            )} />
        {form.formState.errors.last_name && (
            <div>
            <p className="text-xs mt-1 text-red-500">
                {form.formState.errors.last_name.message}
            </p>
            </div>
        )}
        </div>
        <div>
        <Controller
            control={form.control}
            name={"middle_name"}
            render={({ field }) => (
            <div>
                <Label className={!!form.formState.errors.middle_name ? "text-red-500" : ""}>
                Отчество
                <Input placeholder="Иванович" {...field} />
                </Label>
            </div>
            )} />
        {form.formState.errors.middle_name && (
            <div>
            <p className="text-xs mt-1 text-red-500">
                {form.formState.errors.middle_name.message}
            </p>
            </div>
        )}
        </div>
  </div>
);
