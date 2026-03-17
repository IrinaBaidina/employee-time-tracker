import { Controller, UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from "@/lib/utils";
import { EmployeeFormValues } from "../employeeSchema";

export const PayloadBlock = ({ form }: { form: UseFormReturn<EmployeeFormValues> }) => (
  <div className="grid grid-cols-3 gap-3 px-1">
    <div>
        <Controller
            control={form.control}
            name={"payment_tariff"}
            render={({ field }) => (
            <div>
                <Label className={!!form.formState.errors.payment_tariff ? "text-red-500" : ""}>
                Тариф *
                <Input 
                type="number"
                step="0.01"
                required 
                {...field}
                className={cn(!!form.formState.errors.payment_tariff)} />
                </Label>
            </div>
            )} />
        {form.formState.errors.payment_tariff && (
            <div>
            <p className="text-xs mt-1 text-red-500">
                {form.formState.errors.payment_tariff.message}
            </p>
            </div>
        )}
        </div>
        <div>
        <Controller
            control={form.control}
            name={"payment_rate"}
            render={({ field }) => (
            <div>
                <Label className={!!form.formState.errors.payment_rate ? "text-red-500" : ""}>
                Ставка *
                <Input
                    className={cn(!!form.formState.errors.payment_rate)}
                    type="number"
                    step="0.01"
                    required
                    {...field}
                />
                </Label>
            </div>
            )} />
        {form.formState.errors.payment_rate && (
            <div>
            <p className="text-xs mt-1 text-red-500">
                {form.formState.errors.payment_rate.message}
            </p>
            </div>
        )}
        </div>
        <div>
        <Controller
            control={form.control}
            name={"payment_group"}
            render={({ field }) => (
            <div className="space-y-1">
                <Label className={!!form.formState.errors.payment_group ? "text-red-500" : ""}>
                Группа выплат *
                <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите группу" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    </SelectContent>
                </Select>
                </Label>
            </div>
            )} />
        {form.formState.errors.payment_group && (
            <div>
            <p className="text-xs mt-1 text-red-500">
                {form.formState.errors.payment_group.message}
            </p>
            </div>
        )}
        </div>
  </div>
);
