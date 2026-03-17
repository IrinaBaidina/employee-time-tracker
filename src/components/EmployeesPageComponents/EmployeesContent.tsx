import React, { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import SortFilter from "@/components/CommonComponents/SortFilter";
import { useCurrentUserSubordination, useSortFilter } from '@/context/exports';
import { UserRound, Funnel } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Accordion } from "@/components/ui/accordion";
import DepartmentAccordion from "./DepartmentAccordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ProfessionalUserData, userDataService } from "@/services/API/UserProfileAPI";
import { useEmployeesPage } from "@/context/employeesPage/context"
import { EntityForm } from '@/components/ui/entityForm';
import { z } from 'zod';
import { OBJECT_MARK_ENUM } from "@/services/API/CommonAPI";
import { employeeSchema } from "./employeeSchema";
import { getEmployeeFields } from "./EmployeeFieldConfig";
import { FieldChangingRespError } from "@/services/server/ServerErrors";
import { toast } from "sonner";
import { RoleNames } from "@/services/Objects/Role";
import { useAuth } from '@/context/exports';
import { WTCDate } from "@/services/Objects/WTCDate";
import { getAvailableBosses } from "./SelectorGetAvailableBosses";
import { subordinationDataService } from "@/services/API/SubordinationAPI";

interface Props {
  canSeeDismissed: boolean;
}

type EmployeeFormValues = z.infer<ReturnType<typeof employeeSchema>> & {
  __authDataBlock?: never;
  __personalInfoBlock?: never;
  __contactsBlock?: never;
  __employmentDatesBlock?: never;
  __positionBlock?: never;
  __payloadBlock?: never;
  __companyStructureBlock?: never;
};

const EmployeesContent: React.FC<Props> = ({ canSeeDismissed }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { sortedValues } = useSortFilter();
  const { showDismissed, setShowDismissed, roles, positions, departments, allUserProfiles, setAllUserProfiles } = useEmployeesPage();
  const [selectedEmployee, setselectedEmployee] = useState<ProfessionalUserData>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { userData } = useAuth();
  const currentRole = userData?.current?.role.system_name;
  const allActiveUsers = allUserProfiles.filter(e => e.personal_data?.is_active)
  const { subordinationData } = useCurrentUserSubordination();

  type ColumnControl = {
    id: string;
    key: string;
    label: string;
    onlyForSalaryAccess?: boolean;
  };

  const COLUMN_CONTROLS: ColumnControl[] = [
    { id: "birth-date", key: "birthdate", label: "Дата рождения" },
    { id: "mobile-phone", key: "phone", label: "Мобильный телефон" },
    { id: "email", key: "email", label: "Email" },
    { id: "hire-date", key: "hiredate", label: "Дата приема", onlyForSalaryAccess: true, },
    {
      id: "entry-date",
      key: "entrydate",
      label: "Дата вступления в должность",
      onlyForSalaryAccess: true,
    },
  ];
  const hasColumnAccess = useCallback((column: ColumnControl): boolean => {
    if (column.onlyForSalaryAccess) {
      return canAddEmployee(currentRole);
    }
    return true;
  }, [currentRole]);

  const toEmployeesDate = (d?: Date | null): WTCDate | null =>
    d ? new WTCDate(d) : null;

  const toDateOrNull = (value: unknown): Date | null => {
    if (!value) return null;
    if (value instanceof Date) return value;
    const d = new Date(value as any);
    return isNaN(d.getTime()) ? null : d;
  };


  function canAddEmployee(role: RoleNames | undefined): boolean {
    if (!role) return false;
    return (role === "ADMIN" || role === "DIRECTOR" || role === "DEPARTMENT_LEADER");
  }

  const canEditDirector = useMemo(() => {
    if (!selectedEmployee) return false;
    if (!userData.current) return false;

    return (
      selectedEmployee.personal_data.profile_id !==
      userData.current.personal_data.profile_id
    );
  }, [selectedEmployee, userData.current]);

  const [visibleColumns, setVisibleColumns] = useState({
    phone: true,
    birthdate: true,
    hiredate: true,
    entrydate: true,
    email: true,
  });

  const isNewUser = useMemo(() => {
    return selectedEmployee?.objectMark === OBJECT_MARK_ENUM.NEW;
  }, [selectedEmployee]);


  const currentSchema = useMemo(() => {
    return employeeSchema(isNewUser);
  }, [isNewUser]);

  const availableBosses = useMemo(() => {
    if (!selectedEmployee) return [];
    let availableBosses = getAvailableBosses(allActiveUsers, selectedEmployee, subordinationData.subordinations);
    if (userData.current?.role.system_name === "DEPARTMENT_LEADER")
      availableBosses = availableBosses.filter(boss => boss.department.full_name === userData.current?.department.full_name)
    return availableBosses;
  }, [allActiveUsers, selectedEmployee, subordinationData.subordinations, userData.current]);

  const fields = useMemo(
    () => getEmployeeFields({ roles, positions, departments, isNewUser, availableBosses, canEditDirector }),
    [roles, positions, departments, isNewUser, allActiveUsers, availableBosses, canEditDirector]
  );

  const [tempVisibleColumns, setTempVisibleColumns] = useState(visibleColumns);

  const toggleTempColumn = (key: string, value: boolean) => {
    setTempVisibleColumns((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    setVisibleColumns(tempVisibleColumns);
    setIsPopoverOpen(false);
  };

  const resetFilters = useCallback(() => {
    setTempVisibleColumns(prev => ({
      ...prev,
      phone: true,
      birthdate: true,
      hiredate: hasColumnAccess(COLUMN_CONTROLS.find(col => col.key === "hiredate")!),
      entrydate: hasColumnAccess(COLUMN_CONTROLS.find(col => col.key === "entrydate")!),
      email: true,
    }));
  }, [hasColumnAccess])

  const addEmployee = useCallback(() => {
    setselectedEmployee(
      {
        user: {
          id: -1,
          username: '',
          password: '',
        },
        role: roles.current.find(r => r.system_name === "EMPLOYEE")!,
        personal_data: {
          profile_id: -1,
          payment_tariff: 1,
          payment_rate: 1,
          payment_group: 1,
          is_active: true,
          birthdate: null,
          hiredate: null,
          entrydate: null,
          boss_id: userData.current?.personal_data.profile_id!,
          personalization: {},
        },
        department: departments.current.at(0)!,
        position: positions.current.at(0),
        objectMark: OBJECT_MARK_ENUM.NEW,
      }
    );
    setIsDialogOpen(true);

  }, [])

  const editEmployee = useCallback((employee: ProfessionalUserData) => {
    setselectedEmployee(employee);
    setIsDialogOpen(true);
  }, []);

  const dismissEmployee = useCallback(async (employee: ProfessionalUserData) => {
    try {
      employee.objectMark = OBJECT_MARK_ENUM.DELETED;
      employee.personal_data.is_active = false;
      await userDataService.updateUserData(employee);
      if (showDismissed === false)
        setAllUserProfiles(prev => prev.filter(p => p !== employee));
      else
        setAllUserProfiles(prev => [...prev]);
      toast.success("Сотрудник успешно уволен", {
        description: `${employee.personal_data.last_name} ${employee.personal_data.first_name} ${employee.personal_data.middle_name}`,
      });
    } catch (error) {
      if (selectedEmployee) {
        selectedEmployee.objectMark = OBJECT_MARK_ENUM.EXISTED;
      }
      if (error instanceof FieldChangingRespError)
        toast.error(error.message)
    }

  }, [setAllUserProfiles, showDismissed]);

  const onRestoreEmployee = useCallback(async (employee: ProfessionalUserData) => {
    try {
      employee.objectMark = OBJECT_MARK_ENUM.EXISTED;
      employee.personal_data.is_active = true;

      await userDataService.updateUserData(employee);
      setAllUserProfiles(prev => [...prev]);
      toast.success("Сотрудник успешно восстановлен", {
        description: `${employee.personal_data.last_name} ${employee.personal_data.first_name} ${employee.personal_data.middle_name}`,
      });
    } catch (error) {
      if (error instanceof FieldChangingRespError)
        toast.error(error.message)
    }

  }, [setAllUserProfiles]);

  const handleSubmit = useCallback(async (data: EmployeeFormValues) => {
    const role = roles.current.find(r => r.id === Number(data.role));
    const position = positions.current.find(p => p.id === Number(data.position));
    const department = departments.current.find(d => d.id === Number(data.department));
    if (!selectedEmployee) return;

    if (!role || !position || !department) {
      return;
    }

    selectedEmployee.user.username = data.username;

    if (data.newPassword) {
      selectedEmployee.user.password = data.newPassword;
    } else {
      delete selectedEmployee.user.password;
    }

    selectedEmployee.personal_data.first_name = data.first_name;
    selectedEmployee.personal_data.last_name = data.last_name;
    selectedEmployee.personal_data.middle_name = data.middle_name;
    selectedEmployee.personal_data.email = data.email;
    selectedEmployee.personal_data.phone = data.phone;

    selectedEmployee.personal_data.birthdate = toEmployeesDate(data.birthdate);
    selectedEmployee.personal_data.hiredate = toEmployeesDate(data.hiredate);
    selectedEmployee.personal_data.entrydate = toEmployeesDate(data.entrydate);

    selectedEmployee.personal_data.payment_tariff = data.payment_tariff;
    selectedEmployee.personal_data.payment_rate = data.payment_rate;
    selectedEmployee.personal_data.payment_group = Number(data.payment_group);

    selectedEmployee.role = role;
    selectedEmployee.position = position;
    selectedEmployee.department = department;

    
    //подчинения
    const newBossId =
      data.director && data.director !== "__none__"
        ? Number(data.director)
        : null;
    const prevBossId =
      typeof selectedEmployee.personal_data.boss_id === "number"
        ? selectedEmployee.personal_data.boss_id
        : null;

    
    const updatedEmployee = { ...selectedEmployee };
    try {
      const respsEmployee = await userDataService.updateUserData(updatedEmployee, selectedEmployee.objectMark === OBJECT_MARK_ENUM.NEW
        ? data.newPassword
        : data.newPassword || undefined // При редактировании только если был введен
      );
      if (canEditDirector && newBossId !== prevBossId) {
        await subordinationDataService.updateSubordinationData({
          subordinate_id: selectedEmployee.personal_data.profile_id,
          boss_ids: newBossId ? [newBossId] : [],
        })
      }
      
      selectedEmployee.personal_data.boss_id = Number(data.director);
      setselectedEmployee(respsEmployee);
      setAllUserProfiles(prev => {
        if (selectedEmployee.objectMark === OBJECT_MARK_ENUM.NEW) {
          return [...prev, respsEmployee];
        }
        return [...prev]
      });
    } catch (e: any) {
      throw e;
    }

  }, [allUserProfiles, selectedEmployee])

  const prevTitle = useRef('');
  const title = useMemo(() => {
    if (isDialogOpen)
      prevTitle.current = `Сотрудник ${selectedEmployee?.personal_data.first_name ?? ""} ${selectedEmployee?.personal_data.last_name ?? ""}`
    return prevTitle.current
  }, [isDialogOpen]);

  return (
    <div className="p-4 relative">
      <div className="flex justify-between items-center w-full mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserRound className="h-8 w-8" /> Сотрудники ({(sortedValues as ProfessionalUserData[])?.length ?? 0})
        </h1>

        <div className="flex items-center gap-3">
          <Popover
            open={isPopoverOpen}
            onOpenChange={(open) => {
              if (open) {
                setTempVisibleColumns(visibleColumns);
              }
              setIsPopoverOpen(open);
            }}>
            <PopoverTrigger asChild>
              <Button
                variant="signature"
                className="h-8 px-3"
              >
                <Funnel />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-90 border-signature shadow-lg"
              align="end"
              sideOffset={10}
            >
              <div className="space-y-4">
                <SortFilter />

              </div>
              <div className="border-t border-signature -mx-4 my-2"></div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Показывать колонки:
                  </p>
                  {COLUMN_CONTROLS
                    .filter(col => hasColumnAccess(col))
                    .map((col) => (
                      <div className="flex items-center space-x-2" key={col.id}>
                        <Checkbox
                          id={col.id}
                          checked={tempVisibleColumns[col.key as keyof typeof tempVisibleColumns]}
                          onCheckedChange={(checked) =>
                            toggleTempColumn(col.key, checked as boolean)
                          }
                        />
                        <Label htmlFor={col.id} className="cursor-pointer text-sm">
                          {col.label}
                        </Label>
                      </div>
                    ))}
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    className="h-8 px-4"
                    onClick={resetFilters}
                  >
                    Сбросить
                  </Button>
                  <Button
                    variant="signature"
                    className="h-8 px-4"
                    onClick={applyFilters}
                  >
                    Применить
                  </Button>
                </div>
              </div>

              <div className="border-t border-signature -mx-4 my-2"></div>
              {canSeeDismissed && (
                <div className="space-y-5">
                  <div className="space-y-3">
                    <p className="block text-sm font-medium text-muted-foreground mb-1">
                      Показать:
                    </p>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="dismissed"
                        checked={showDismissed}
                        onCheckedChange={(checked) => setShowDismissed(checked === true)}
                      />
                      <Label htmlFor="dismissed" className="text-sm font-normal cursor-pointer">
                        Уволенных
                      </Label>
                    </div>
                  </div>

                </div>
              )}

            </PopoverContent>
          </Popover>
          {canAddEmployee(currentRole) && (
            <Button variant="signature" className="h-8 px-4" onClick={addEmployee}>
              Добавить сотрудника
            </Button>)}
        </div>
      </div>

      <div className="mt-2">
        <Accordion type="multiple" className="w-full space-y-3">
          <DepartmentAccordion
            employees={sortedValues as ProfessionalUserData[]}
            visibleColumns={visibleColumns}
            onEditEmployee={editEmployee}
            onDismissEmployee={dismissEmployee}
            onRestore={onRestoreEmployee}
          />
        </Accordion>
      </div>

      <EntityForm
        item={selectedEmployee ? {
          username: selectedEmployee.user.username ?? "",
          newPassword: selectedEmployee.user.password ?? "",
          confirmPassword: selectedEmployee.user.password ?? "",
          first_name: selectedEmployee.personal_data.first_name ?? "",
          last_name: selectedEmployee.personal_data.last_name ?? "",
          middle_name: selectedEmployee.personal_data.middle_name ?? "",
          email: selectedEmployee.personal_data.email ?? "",
          phone: selectedEmployee.personal_data.phone ?? "",
          birthdate: toDateOrNull(selectedEmployee.personal_data.birthdate),
          hiredate: toDateOrNull(selectedEmployee.personal_data.hiredate),
          entrydate: toDateOrNull(selectedEmployee.personal_data.entrydate),
          role: selectedEmployee.role?.id?.toString() ?? "",
          position: selectedEmployee.position?.id?.toString() ?? "",
          department: selectedEmployee.department?.id?.toString() ?? "",
          payment_tariff: selectedEmployee.personal_data.payment_tariff ?? "",
          payment_rate: selectedEmployee.personal_data.payment_rate ?? "",
          payment_group: (selectedEmployee.personal_data.payment_group?.toString() as "1" | "2") ?? "1",
          director:
            selectedEmployee.personal_data.boss_id != null
              ? String(selectedEmployee.personal_data.boss_id)
              : "",
        } : null}
        schema={currentSchema}
        fields={fields}
        onSubmit={handleSubmit}
        title={title}
        description={isNewUser
          ? "Добавьте информацию. Обязательные для заполнения поля отмечены *"
          : "Редактирование информации. Пароль заполняется только при его изменении"}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

    </div>
  );
};

export default EmployeesContent;