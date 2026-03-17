import { Controller, UseFormReturn } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue  } from "@/components/ui/select";
import { EmployeeFormValues } from "../employeeSchema";
import { ProfessionalUserData } from "@/services/API/UserProfileAPI";

interface Props {
  form: UseFormReturn<EmployeeFormValues>;
  availableBosses: ProfessionalUserData[];
  canEditDirector: boolean;
}

export const CompanyStructureBlock = ({ form, availableBosses, canEditDirector }: Props) => {
    if (!canEditDirector) {
        return null;
    }

    return(
        <div className="grid grid-cols-1 gap-3 px-1">
            <>
                <Controller
                    control={form.control}
                    name={"director"}
                    render={({ field }) => (
                        <Select
                            required
                            value={field.value ?? ""}
                            onValueChange={field.onChange}
                        >
                            <SelectTrigger className="mt-1 w-full">
                            <SelectValue placeholder="Выберите руководителя" />
                            </SelectTrigger>
                            <SelectContent>

                            {availableBosses.map((profile) => (
                                <SelectItem
                                    key={profile.personal_data.profile_id}
                                    value={String(profile.personal_data.profile_id)}
                                    >
                                    {String(profile.personal_data.last_name)} {String(profile.personal_data.first_name)} {String(profile.department.abbreviation)}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    )} />
                {form.formState.errors.role && (
                    <div>
                    <p className="text-xs mt-1">
                        {form.formState.errors.role.message}
                    </p>
                    </div>
                )}
                </>
                
        </div>

    );}

