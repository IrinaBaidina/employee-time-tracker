import { Controller, UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue  } from "@/components/ui/select";
import { EmployeeFormValues } from "../employeeSchema";
import { Role } from "@/services/Objects/Role";
import { Position } from "@/services/Objects/Position";
import { Department } from "@/services/Objects/Department";

interface Props {
  form: UseFormReturn<EmployeeFormValues>;
  roles: React.RefObject<Role[]>;
  positions: React.RefObject<Position[]>;
  departments: React.RefObject<Department[]>;
}

export const PositionBlock = ({ form,roles,positions,departments }: Props) => {

    return(
        <div className="grid grid-cols-3 gap-3 px-1">
            <div>
                <Controller
                    control={form.control}
                    name={"role"}
                    render={({ field }) => (
                    <div>
                        <Label>
                        Роль *
                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                        >
                            <SelectTrigger className="mt-1 w-full">
                            <SelectValue placeholder="Выберите роль" />
                            </SelectTrigger>
                            <SelectContent>
                            {roles.current.map((role) => (
                                <SelectItem
                                key={role.id}
                                value={String(role.id)}
                                >
                                {role.name}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        </Label>
                    </div>
                    )} />
                {form.formState.errors.role && (
                    <div>
                    <p className="text-xs mt-1">
                        {form.formState.errors.role.message}
                    </p>
                    </div>
                )}
                </div>
                <div>
                <Controller
                    control={form.control}
                    name={"position"}
                    render={({ field }) => (
                    <div>
                        <Label>
                        Должность *
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="mt-1 w-full">
                            <SelectValue placeholder="Выберите должность" />
                            </SelectTrigger>
                            <SelectContent>
                            {positions.current.map((pos) => (
                                <SelectItem key={pos.id} value={String(pos.id)}>
                                {pos.name}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        </Label>
                    </div>
                    )} />
                {form.formState.errors.position && (
                    <div>
                    <p className="text-xs mt-1">
                        {form.formState.errors.position.message}
                    </p>
                    </div>
                )}
                </div>
                <div>
                <Controller
                    control={form.control}
                    name={"department"}
                    render={({ field }) => (
                    <div>
                        <Label>
                        Отдел *
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="mt-1 w-full">
                            <SelectValue placeholder="Выберите отдел" />
                            </SelectTrigger>
                            <SelectContent>
                            {departments.current.map((dep) => (
                                <SelectItem key={dep.id} value={String(dep.id)}>
                                {dep.full_name}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        </Label>
                    </div>
                    )} />
                {form.formState.errors.department && (
                    <div>
                    <p className="text-xs mt-1">
                        {form.formState.errors.department.message}
                    </p>
                    </div>
                )}
                </div>
        </div>

    );}

