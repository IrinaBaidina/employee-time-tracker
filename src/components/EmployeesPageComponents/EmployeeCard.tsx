import React, { memo } from 'react';
import { TableColumn } from '@/components/ui/genericTable';
import EmployeesTable from './EmployeesTable';
import { ProfessionalUserData } from '@/services/API/UserProfileAPI';

interface EmployeeCardProps {
  employee: ProfessionalUserData;
  filteredColumns: TableColumn<any>[];
  onEdit: (employee: ProfessionalUserData) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, filteredColumns, onEdit }) => {
  const tableData = [employee];
  return (
    <div className="mt-2">
      <EmployeesTable data={tableData} columns={filteredColumns} onRowAction={onEdit}/>
    </div>
  
  );
};

export default memo(EmployeeCard);