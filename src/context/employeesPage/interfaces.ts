import { ProfessionalUserData } from '@/services/API/UserProfileAPI';
import { Department } from '@/services/Objects/Department';
import { Position } from '@/services/Objects/Position';
import { Role } from '@/services/Objects/Role';
import { RefObject } from 'react';
import { Dispatch, SetStateAction } from "react";


export interface IEmployeesPageContext {
  isUserProfilesLoading: boolean;
  isDismissedFetching: boolean;
  allUserProfiles: ProfessionalUserData[];
  departments: RefObject<Department[]>;
  showDismissed: boolean;
  setShowDismissed: Dispatch<SetStateAction<boolean>>;
  roles: React.RefObject<Role[]>;
  positions: React.RefObject<Position[]>;
  setAllUserProfiles: React.Dispatch<React.SetStateAction<ProfessionalUserData[]>>;
}