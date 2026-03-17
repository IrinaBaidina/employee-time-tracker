import React from "react";
import { EmployeesPageProvider } from '@/context/employeesPage/provider';
import EmployeesPageComponents from "../components/EmployeesPageComponents/EmployeesPageComponents";
import { CurrentUserSubordinationProvider } from "@/context/providers";

const EmployeesPage: React.FC = () => {
  return (
    <CurrentUserSubordinationProvider>
      <EmployeesPageProvider>
        <EmployeesPageComponents />
      </EmployeesPageProvider>
    </CurrentUserSubordinationProvider>
  );
};

export default EmployeesPage;