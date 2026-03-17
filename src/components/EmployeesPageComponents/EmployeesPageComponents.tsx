import React, { useMemo } from "react";
import { SortFilterProvider } from "@/context/sorter/provider";
import EmployeesContent from "./EmployeesContent"
import { useAuth } from '@/context/exports';
import { ProfessionalUserData } from "@/services/API/UserProfileAPI";
import {useEmployeesPage} from "@/context/employeesPage/context"
//import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
//import { TABS_TRIGGERS_CLASS_NAME } from "@/static/styles/clsxStyles";
//import CompanyStructureTree from "./CompanyStructureTree";


const EmployeesPageComponents: React.FC = () => {
  const { userData } = useAuth();
  const { allUserProfiles } = useEmployeesPage();
  
  const canSeeDismissed = Boolean(
    userData.current?.role?.edit_subordination_personal_data
  );

  const employeesForView = useMemo<ProfessionalUserData[]>(() => {
    if (!canSeeDismissed) {
      return allUserProfiles.filter(e => e.personal_data?.is_active);
    }
    return allUserProfiles;
  }, [allUserProfiles, canSeeDismissed]);

  
  return (
    /*<Tabs defaultValue="employees" className="">
      <div className="mb-4 animate-slide-in flex items-center">
        <TabsList className="bg-accent border flex flex-wrap">
            <TabsTrigger
            className={TABS_TRIGGERS_CLASS_NAME}
            value="employees"
          >
            Сотрудники
          </TabsTrigger>
          <TabsTrigger
            className={TABS_TRIGGERS_CLASS_NAME}
            value="structure"
          >
            Структура компании
          </TabsTrigger>

          </TabsList>

      </div>
      <TabsContent value="employees" className="mt-0">
        <SortFilterProvider
          sortingValues={employeesForView}
          sortingKeys={[
            {
              path: "personal_data.last_name",
              definition: "По фамилии",
            },
          ]}
          filterKeys={[
            {
              path: "personal_data.last_name",
              definition: "Фамилия",
              type: "input",
              placeholder: "Введите фамилию",
            },
          ]}
        >
          {employeesForView && (
            <EmployeesContent canSeeDismissed={canSeeDismissed} />
          )}
        </SortFilterProvider>
      </TabsContent>

      <TabsContent value="structure" className="mt-0">
        <CompanyStructureTree />
      </TabsContent>


    </Tabs>*/


<SortFilterProvider
      sortingValues={employeesForView}
      sortingKeys={[{ path: "personal_data.last_name", definition: "По фамилии" }]}
      filterKeys={[
        {
          path: "personal_data.last_name",
          definition: "Фамилия",
          type: "input",
          placeholder: "Введите фамилию",
        },
      ]}
    >
      {employeesForView && <EmployeesContent
      canSeeDismissed={canSeeDismissed} />}

    </SortFilterProvider>
  );
};

export default EmployeesPageComponents;