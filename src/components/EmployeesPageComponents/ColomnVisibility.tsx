import { TableColumn } from "@/components/ui/genericTable";
import { ProfessionalUserData } from "@/services/API/UserProfileAPI";
import { TableColumnWithSalary } from "./BaseColumnDefinitions";

interface PrepareColumnsContext {
  canSeeSalary: boolean;
}

export function columnHasAnyData(
  data: ProfessionalUserData[],
  column: TableColumn<ProfessionalUserData>
): boolean {
  if (!data.length) return false;

  return data.some((item, index) => {

    if (column.render) {
      const rendered = column.render(item, index);
      return rendered !== null && rendered !== undefined;
    }

    return true;
  });
}

export function prepareColumns(
  columns: TableColumnWithSalary[],
  data: ProfessionalUserData[],
  visibleColumns: {
    phone: boolean;
    birthdate: boolean;
    hiredate: boolean;
  },
  context?: PrepareColumnsContext
): TableColumnWithSalary[] {
  return columns.filter((column) => {
    const key = column.key?.toString();

    if (column.onlyForSalaryAccess && !context?.canSeeSalary) {
      return false;
    }

    // 1. Управление через чекбоксы
    if (key && key in visibleColumns) {
      return visibleColumns[key as keyof typeof visibleColumns];
    }

    // 2. Управление через данные бекенда
    return columnHasAnyData(data, column);
  });
}