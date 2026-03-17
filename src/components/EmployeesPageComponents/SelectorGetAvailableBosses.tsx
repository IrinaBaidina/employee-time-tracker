import { ProfessionalUserData } from "@/services/API/UserProfileAPI";
import { Subordination } from "@/services/Objects/Subordination";
import { findFirstBossesByRank } from "@/utils/UserDataUtils";

export function getAvailableBosses( allUsers: ProfessionalUserData[], editedEmployee: ProfessionalUserData | undefined, subordinations: Subordination[],): ProfessionalUserData[] {
  if (!editedEmployee) return [];

  const currentId = editedEmployee.personal_data.profile_id;

  const usersMap = new Map(
    allUsers.map(u => [u.personal_data.profile_id, u])
  );

  // Карта "кто чей начальник"
  const bossMap = findFirstBossesByRank(
    usersMap,
    subordinations,
    editedEmployee.role.rank
  );

  return allUsers.filter(user => {
    const userId = user.personal_data.profile_id;

    // проверка на себя
    if (userId === currentId) return false;

    // проверка на активных
    if (!user.personal_data.is_active) return false;

    // проверка на не сотрудника
    if (user.role.system_name === "EMPLOYEE") return false;

    // проверка на цикличное подчинение
    const usersBoss = bossMap.get(userId);
    if (usersBoss?.personal_data.profile_id === currentId) {
      return false;
    }

    return true;
  });
}