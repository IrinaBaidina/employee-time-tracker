import React from "react";
import { GenericTable, TableColumn } from "@/components/ui/genericTable";
import { ProfessionalUserData } from "@/services/API/UserProfileAPI";

interface Props {
  data: ProfessionalUserData[];
  columns: TableColumn<ProfessionalUserData>[];
  onRowAction?: (employee: ProfessionalUserData) => void;
}

const EmployeesTable: React.FC<Props> = ({ data, columns}) => {
  return (
    <GenericTable
      columns={columns}
      data={data}
      noHeader
      rowKey={(item) => item.personal_data.profile_id.toString()}
    />
  );
};

export default EmployeesTable;