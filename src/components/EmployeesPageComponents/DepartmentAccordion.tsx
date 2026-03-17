import { useEmployeesPage } from "@/context/employeesPage/context";
import { ProfessionalUserData } from "@/services/API/UserProfileAPI";
import { useAuth } from '@/context/exports';
import { RoleNames } from "@/services/Objects/Role";
import React, { memo, useMemo } from "react";
import DepartmentSection from "./DepartmentSection";

export interface EmployeeRowData {
  id: number;
  name: string;
  position: string;
  department: string;
  email?: string | null;
  phone?: string;
  birthdate?: number;
  hiredate?: number;
  payment_tariff?: number;
  payment_rate?: number;
  payment_group?: number;
}

export type VisibleColumnsMap = {
  phone: boolean;
  birthdate: boolean;
  hiredate: boolean;
};


interface Props {
  employees: ProfessionalUserData[];
  visibleColumns: {
    phone: boolean;
    birthdate: boolean;
    hiredate: boolean;
  };
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

const DepartmentAccordion: React.FC<Props> = ({ employees, visibleColumns, onEditEmployee, onDismissEmployee, onRestore }) => {
  const { departments } = useEmployeesPage();
  const { userData } = useAuth();

  const role = userData?.current?.role.system_name;
  const userDepartmentId = userData?.current?.department?.id;

  const employeesByDepartment = useMemo(() => {
    const map = new Map<number, ProfessionalUserData[]>();

    for (const emp of employees) {
      const deptId = emp.department?.id;
      if (!deptId) continue;

      if (!map.has(deptId)) map.set(deptId, []);
      map.get(deptId)!.push(emp);
    }

    return map;
  }, [employees]);

  return departments.current.map((department) => {
    const departmentEmployees =
    employeesByDepartment.get(department.id) ?? [];

    if (departmentEmployees.length === 0) return null;

    return (

      <DepartmentSection
        key={department.id}
        department={department}
        departmentEmployees={departmentEmployees}
        visibleColumns={visibleColumns}
        role={role}
        userDepartmentId={userDepartmentId}
        onEditEmployee={onEditEmployee}
        onDismissEmployee={onDismissEmployee}
        onRestore={onRestore}
      />

    );
  });
};

export default memo(DepartmentAccordion);