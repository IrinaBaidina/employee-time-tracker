import React from "react";
import { FieldConfig } from '@/components/ui/entityForm';
import { EmployeeFormValues } from "./employeeSchema";
import { AuthBlock } from "./EmployeeFields/AuthBlock";
import { PersonalBlock } from "./EmployeeFields/PersonalBlock";
import { ContactsBlock } from "./EmployeeFields/ContactsBlock";
import { PayloadBlock } from "./EmployeeFields/PayloadBlock";
import { PositionBlock } from "./EmployeeFields/PositionBlock";
import { EmploymentDatesBlock } from "./EmployeeFields/EmploymentDatesBlock";
import { Role } from "@/services/Objects/Role";
import { Position } from "@/services/Objects/Position";
import { Department } from "@/services/Objects/Department";
import { CompanyStructureBlock } from "./EmployeeFields/CompanyStructure";
import { ProfessionalUserData } from "@/services/API/UserProfileAPI";

interface FieldsParams {
  roles: React.RefObject<Role[]>;
  positions: React.RefObject<Position[]>;
  departments: React.RefObject<Department[]>;
  isNewUser: boolean;
  availableBosses: ProfessionalUserData[];
  canEditDirector: boolean;
}

export const getEmployeeFields = ({ roles, positions, departments, isNewUser, availableBosses, canEditDirector  }: FieldsParams): FieldConfig<EmployeeFormValues>[] => [
    {
      name: "__authDataBlock",
      label: "",
      type: "extra",
      renderExtraFields: (form) => <AuthBlock form={form} isNewUser={isNewUser} />,
    },
    {
      name: "__personalInfoBlock",
      label: "",
      type: "extra",
      renderExtraFields: (form) => <PersonalBlock form={form} />,
    },
    {
      name: "__contactsBlock",
      label: "",
      type: "extra",
      renderExtraFields: (form) => <ContactsBlock form={form} />,
    },
    {
      name: "__employmentDatesBlock",
      label: "",
      type: "extra",
      renderExtraFields: (form) => <EmploymentDatesBlock form={form} isNewUser={isNewUser}/>
    },
    {
      name: "__positionBlock",
      label: "",
      type: "extra",
      renderExtraFields: (form) => 
      <PositionBlock
        form={form}
        roles={roles}
        positions={positions}
        departments={departments}/>,
    },
    {
      name: "__payloadBlock",
      label: "",
      type: "extra",
      renderExtraFields: (form) => <PayloadBlock form={form} />,
    },
    {
      name: "__companyStructureBlock",
      label: "",
      type: "extra",
      renderExtraFields: (form) => <CompanyStructureBlock form={form} availableBosses={availableBosses} canEditDirector={canEditDirector}/>,
    },
  ];

