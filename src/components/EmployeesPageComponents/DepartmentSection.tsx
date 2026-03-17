import { ProfessionalUserData } from "@/services/API/UserProfileAPI";
import { Department } from "@/services/Objects/Department";
import { RoleNames } from "@/services/Objects/Role";
import React, { memo } from "react";
import { baseColumnDefinitions } from "./BaseColumnDefinitions";
import { AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { GenericTable } from "../ui/genericTable";
import EmployeeCard from "./EmployeeCard";
import {prepareColumns} from "./ColomnVisibility"

interface Props{
    department: Department;
    departmentEmployees: ProfessionalUserData[];
    visibleColumns: {
        phone: boolean;
        birthdate: boolean;
        hiredate: boolean;
    };
    role: RoleNames | undefined;
    userDepartmentId: number | undefined;
    onEditEmployee: (employee: ProfessionalUserData) => void;
    onDismissEmployee: (employee: ProfessionalUserData) => void;
    onRestore: (employee: ProfessionalUserData) => void;

}

export function canSeeSalaryColumns(
  role: RoleNames | undefined,
  userDepartmentId: number | undefined,
  currentDepartmentId: number
): boolean {
  if (role === "ADMIN" || role === "DIRECTOR") {
    return true;
  }

  if (role === "DEPARTMENT_LEADER") {
    return userDepartmentId === currentDepartmentId;
  }

  return false;
}

const DepartmentSection: React.FC<Props> = ({department, departmentEmployees, visibleColumns, role, userDepartmentId, onEditEmployee, onDismissEmployee, onRestore}) => {
    const canSeeSalary = canSeeSalaryColumns(
        role,
        userDepartmentId,
        department.id
    );

    const preparedColumns = React.useMemo(() => {
    return prepareColumns(
        baseColumnDefinitions({
            onEdit: onEditEmployee,
            onDismiss: onDismissEmployee,
            onRestore: onRestore,
        }),
        departmentEmployees,
        visibleColumns,
        { canSeeSalary }
        );
    }, [
        departmentEmployees,
        visibleColumns,
        canSeeSalary,
        onEditEmployee,
        onDismissEmployee,
        onRestore
    ]);
    return (
        <AccordionItem
        key={department.id}
        value={`dept-${department.id}`}
        className="rounded-xl overflow-hidden shadow-md border"
      >
        <AccordionTrigger
          className="bg-signature text-signature-foreground px-4 py-3 items-center hover:bg-signature/50"
          chevronElement="CustomChevron"
        >
          <div className="flex justify-between items-center w-full">
            <span className="text-lg font-semibold">
              {department.full_name} ({departmentEmployees.length})
            </span>
          </div>
        </AccordionTrigger>

        <AccordionContent className="p-4 space-y-1 overflow-x-auto">
          <div className="w-auto !text-sm overflow-hidden min-w-[1550px]">
            <GenericTable
              className="!text-xs leading-tight table-fixed w-full"
              columns={preparedColumns}
              rowKey={(item) => String(item.personal_data.profile_id)}
              noBody={true}
              fixedLayout={true}
              data={[{} as ProfessionalUserData]}

            />

            {departmentEmployees.map((employee) => {
              return <EmployeeCard
                key={employee.personal_data.profile_id}
                employee={employee}
                filteredColumns={preparedColumns}
                onEdit={onEditEmployee}
              />
            }
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    )
}
export default memo(DepartmentSection);