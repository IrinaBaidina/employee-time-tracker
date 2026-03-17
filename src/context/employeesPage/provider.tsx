import React, { useState, useEffect, useRef } from 'react';
import LoadDataExceptionComponent from '@/components/CommonComponents/ExceptionComponent';
import { ProfessionalUserData, userDataService } from '@/services/API/UserProfileAPI';
import LoadingSpinner from '@/components/CommonComponents/LoadingSpinner';
import { Department } from '@/services/Objects/Department';
import { departmentService, positionService, roleService } from '@/services/API/AdministrationAPI';
import { Role } from "@/services/Objects/Role";
import { EmployeesPageContextProviderBase } from './context';

import { Position } from '@/services/Objects/Position';
import { OBJECT_MARK_ENUM } from '@/services/API/CommonAPI';
import { subordinationDataService } from '@/services/API/SubordinationAPI';
import { useAuth } from '../exports';

export const EmployeesPageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUserProfiles, setAllUserProfiles] = useState<ProfessionalUserData[]>([]);
  const departments = useRef<Department[]>([]);

  const [isUserProfilesLoading, setIsUserProfilesLoading] = useState(true);
  const [isDismissedFetching, setIsDismissedFetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [showDismissed, setShowDismissed] = useState(false);
  const roles = useRef<Role[]>([])
  const positions = useRef<Position[]>([])
  const { userData } = useAuth();


  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        const EmployeeRoles: Role[] = await roleService.getRoles();
        const EmployeePositions: Position[] = await positionService.getPositions();

        const allProfilesResp = await userDataService.getUserProfiles({ all: true, showDismissed: false }) as ProfessionalUserData[];
        const subordinationData = await subordinationDataService.getSubordinationData(userData.current!);
        //руководители всех подчиненных
        allProfilesResp.forEach(p => {
          p.objectMark = OBJECT_MARK_ENUM.EXISTED;
          const profileId = p.personal_data.profile_id;
          const bossSubordination = subordinationData.subordinations.find(s => s.subordinate_profiles.includes(profileId));
          if(bossSubordination){
            p.personal_data.boss_id = bossSubordination.user_profile_id;
          }
        });
        setAllUserProfiles(allProfilesResp);
        
        departments.current = (await departmentService.getDepartments()).sort((d_1, d_2) => d_1.abbreviation.localeCompare(d_2.abbreviation));
        roles.current = EmployeeRoles.sort((r_1, r_2) => r_1.name.localeCompare(r_2.name));
        positions.current = EmployeePositions.sort((p_1, p_2) => p_1.name.localeCompare(p_2.name));
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        }
      } finally {
        setIsUserProfilesLoading(false);
      }
    }
    setIsUserProfilesLoading(true);
    fetchUserProfiles();
  }, []);

  useEffect(() => {
    const fetchDismissedUserProfiles = async () => {
      if (showDismissed) {
        const dismissedUsers = await userDataService.getUserProfiles({ all: true, showDismissed: true }) as ProfessionalUserData[];
        dismissedUsers.forEach(p => p.objectMark = OBJECT_MARK_ENUM.DELETED);
        setAllUserProfiles(prev => [...prev, ...dismissedUsers]);
      } else
        setAllUserProfiles(prev => prev.filter(up => up.personal_data.is_active));
      setIsDismissedFetching(false);
    }
    setIsDismissedFetching(true);
    fetchDismissedUserProfiles();
  }, [showDismissed]);


  if (isUserProfilesLoading) return <LoadingSpinner />;
  if (error) return <LoadDataExceptionComponent message={error.message} />;

  return (
    <EmployeesPageContextProviderBase
      value={{
        isUserProfilesLoading,
        isDismissedFetching,
        allUserProfiles,
        departments,
        showDismissed,
        setShowDismissed,
        roles,
        positions,
        setAllUserProfiles,
      }}
    >
      {children}
    </EmployeesPageContextProviderBase>
  );
};
