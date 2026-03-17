import { ProfessionalUserData } from "@/services/API/UserProfileAPI";
import { TableColumn } from "@/components/ui/genericTable";
import { UserRound, Cake} from "lucide-react";
import EmployeeActionsPopover from "./EmployeeActionsPopover";

export interface TableColumnWithSalary extends TableColumn<ProfessionalUserData>{
  onlyForSalaryAccess?: boolean
}
interface ColumnActions {
  onEdit: (employee: ProfessionalUserData) => void;
  onDismiss: (employee: ProfessionalUserData) => void;
  onRestore: (employee: ProfessionalUserData) => void;
}

export function formatBirthdate(date: Date, showYear: boolean) {
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    ...(showYear ? { year: "numeric" } : {}),
  });
}

export const baseColumnDefinitions = ({onEdit, onDismiss, onRestore}: ColumnActions): TableColumnWithSalary[] => [
  {
    header: '',
    render: () => (
      <div className="flex items-center justify-center">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-tablegray flex items-center justify-center">
          <UserRound className="h-4 w-4" />
        </div>
      </div>
    ),
    key: "avatar",
    headerClassName: "w-[6%] bg-tablegray !text-sm text-[11px]",
    rowClassName: "w-[6%] max-w-[6%] !text-xs h-8"
  },
  {
    header: 'ФИО',
    render: (pud) => <p style={{ fontSize: "11px", lineHeight: "1.2" }}> {pud.personal_data.last_name} {pud.personal_data.first_name} {pud.personal_data.middle_name}</p>,
    key: "name",
    headerClassName: "w-[15%] max-w-[15%] bg-tablegray text-center leading-tight px-1 whitespace-normal break-words text-[11px]",
    rowClassName: "w-[15%] max-w-[15%] text-wrap !text-sm h-8",
  },
  {
    header: 'Должность',
    key: "position",
    render: (pud) => <p style={{ fontSize: "11px", lineHeight: "1.2" }}> {pud.position?.name}</p>,
    headerClassName: "w-auto text-center bg-tablegray leading-tight px-1 whitespace-normal break-words text-[11px]",
    rowClassName: "w-auto max-w-auto text-wrap text-center h-8 !text-sm leading-tight"
  },
  {
    header: 'email',
    key: "email",
    //accessor: "personal_data.email",
    render: (pud) => <p style={{ fontSize: "11px", lineHeight: "1.2" }}> {pud.personal_data.email}</p>,
    headerClassName: "w-[10%] text-center bg-tablegray leading-tight px-1 whitespace-normal break-words text-[11px]",
    rowClassName: "w-[10%] max-w-[10%] text-wrap text-center h-8  !text-sm leading-tight"
  },
  {
    header: 'Мобильный телефон',
    key: "phone",
    //accessor: "personal_data.phone",
    render: (pud) => <p style={{ fontSize: "11px", lineHeight: "1.2" }}> {pud.personal_data.phone}</p>,
    headerClassName: "w-[10%] text-center bg-tablegray leading-tight px-1 whitespace-normal break-words text-[11px]",
    rowClassName: "w-[10%] max-w-[10%] text-wrap text-center h-8 !text-sm leading-tight",
  },
  {
    header: 'Дата рождения',
    key: "birthdate",
    render: (row) =>{
      const showYear = row.personal_data.personalization?.showYear ?? false;
      return(
        <p style={{ fontSize: "11px", lineHeight: "1.2" }}>{row.personal_data.birthdate
         ? formatBirthdate(new Date(row.personal_data.birthdate), showYear)
         : ' '}</p>
      )
    },

    headerClassName: "w-[7%] text-center bg-tablegray leading-tight px-1 whitespace-normal break-words text-[11px]",
    rowClassName: "w-[7%] max-w-[7%] text-wrap text-center h-8 text-sm",
  },
  {
    header: 'Дата приема',
    key: "hiredate",
    render: (row) => <p style={{ fontSize: "11px", lineHeight: "1.2" }}>{row.personal_data.hiredate
      ? new Date(row.personal_data.hiredate).toLocaleDateString('ru-RU')
      : ' '}</p>,
    onlyForSalaryAccess: true,
    headerClassName: "w-[7%] text-center bg-tablegray leading-tight px-1 whitespace-normal break-words text-[11px]",
    rowClassName: "w-[7%] max-w-[7%] text-wrap text-center h-8 text-sm",
  },
  {
    header: 'Дата вступления в должность',
    key: "entrydate",
    render: (row) => <p style={{ fontSize: "11px", lineHeight: "1.2" }}>{row.personal_data.entrydate
      ? new Date(row.personal_data.entrydate).toLocaleDateString('ru-RU')
      : ' '}</p>,
    headerClassName: "w-[7%] text-center bg-tablegray leading-tight px-1 whitespace-normal break-words text-[11px]",
    onlyForSalaryAccess: true,
    rowClassName: "w-[7%] max-w-[7%] text-wrap text-center h-8 text-sm",
  },
  {
    header: 'Тариф, руб',
    key: "payment_tariff",
    render: (row) => <p >{row.personal_data?.payment_tariff ?? 1}</p>,
    onlyForSalaryAccess: true,
    headerClassName: "w-[5%] text-center  bg-tablegray leading-tight px-1 whitespace-normal break-words text-[11px]",
    rowClassName: "w-[5%] max-w-[5%] text-wrap text-center h-8 text-[11px] leading-tight px-1 whitespace-normal break-words"
  },
  {
    header: 'Ставка',
    key: "payment_rate",
    render: (row) => <p >{row.personal_data?.payment_rate ?? 1}</p>,
    onlyForSalaryAccess: true,
    headerClassName: "w-[3%] text-center bg-tablegray  leading-tight px-1 whitespace-normal break-words text-[11px]",
    rowClassName: "w-[3%] max-w-[3%] text-wrap text-center h-8 text-[11px] leading-tight px-1 whitespace-normal break-words"
  },
  {
    header: 'Группа выплат',
    key: "payment_group",
    render: (row) => <p>{row.personal_data?.payment_group ?? 1}</p>,
    onlyForSalaryAccess: true,
    headerClassName: "w-[3%] text-center bg-tablegray leading-tight px-1 whitespace-normal break-words text-[11px]",
    rowClassName: "w-[3%] max-w-[3%] text-wrap text-center h-8 text-[11px] leading-tight px-1 whitespace-normal break-words"
  },
  {
    header: '',
    render: (row) => {
      const birthdate = row.personal_data.birthdate;
      if (!birthdate) return null;

      const today = new Date();
      const birth = new Date(birthdate);
      const isBirthdayToday =
        today.getDate() === birth.getDate() &&
        today.getMonth() === birth.getMonth();
      return isBirthdayToday ? (
        <div className="flex items-center justify-center">
          <Cake className="h-5 w-5 mx-auto" />
        </div>
      ) : null;
    },

    key: "birthday",
    headerClassName: "w-[7%] bg-tablegray text-sm text-[11px]",
    rowClassName: "w-[7%] text-sm"
  },
  {
    header: '',
    render: (employee) => (
      <div className="flex items-center justify-center">
        <EmployeeActionsPopover
          employee={employee}
          onEdit={onEdit}
          onDismiss={onDismiss}
          onRestore={onRestore}
        />
      </div>
    ),
    key: "button",
    headerClassName: "w-[3%] bg-tablegray leading-tight px-1 whitespace-normal break-words text-[11px]",
    onlyForSalaryAccess: true ,
    rowClassName: "w-[3%] max-w-[3%] text-[11px] leading-tight px-1 whitespace-normal break-words"
  },
];