import { Controller, UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EmployeeFormValues } from "../employeeSchema";


export const AuthBlock = ({ form, isNewUser = false }: { form: UseFormReturn<EmployeeFormValues>, isNewUser?: boolean; }) => (
  <div className="grid grid-cols-3 gap-3 px-1">
    <div>
        <Controller
            control={form.control}
            name={"username"}
            render={({ field }) => (
            <div>
                <Label className={!!form.formState.errors.username ? "text-red-500" : ""}>
                Логин *
                <Input placeholder="username" required {...field}
                className={cn(!!form.formState.errors.username)}/>
                </Label>
            </div>
            )} />
        {form.formState.errors.username && (
            <div>
            <p className="text-xs mt-1 text-red-500">
                {form.formState.errors.username.message}
            </p>
            </div>
        )}
        </div>
        <div>
        <Controller
            control={form.control}
            name={"newPassword"}
            render={({ field }) => (
            <div>
                <Label className={!!form.formState.errors.newPassword ? "text-red-500" : ""}>
                {isNewUser ? "Пароль *" : "Новый пароль"}
                <Input {...field} required={isNewUser} type="password"
                className={cn(!!form.formState.errors.username)}/>
                </Label>
                <p className="text-xs text-gray-500 mt-1">Только латинские буквы, цифры и _</p>
            </div>
            )} />
        {form.formState.errors.newPassword && (
            <div>
            <p className="text-xs mt-1 && text-red-500">
                {form.formState.errors.newPassword.message}
            </p>
            </div>
        )}
        </div>
        <div>
        <Controller
            control={form.control}
            name={"confirmPassword"}
            render={({ field }) => (
            <div>
                <Label className={!!form.formState.errors.confirmPassword ? "text-red-500" : ""}>
                {isNewUser ? "Подтверждение пароля *" : "Подтверждение пароля"}
                <Input {...field} required={isNewUser} type="password"
                className={cn(!!form.formState.errors.username)}/>
                </Label>
                <p className="text-xs text-gray-500 mt-1">Только латинские буквы, цифры и _</p>
            </div>
            )} />
        {form.formState.errors.confirmPassword && (
            <div>
            <p className="text-xs mt-1 text-red-500">
                {form.formState.errors.confirmPassword.message}
            </p>
            </div>
        )}
        </div>
  </div>
);
