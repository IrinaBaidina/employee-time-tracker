// Базовый URL API. В реальном проекте это должно быть в env переменных
import { Role } from "@/services/Objects/Role";
import { User } from "@/services/Objects/User";
import { UserPersonalData } from "@/services/Objects/UserPersonalData";
import { Position } from "../Objects/Position";
import { Department } from "../Objects/Department";
import { NetworkManager } from "../server/NetworkManager";
import { OBJECT_MARK_ENUM } from "./CommonAPI";

export interface ProfessionalUserData {
  user: User;
  role: Role;
  personal_data: UserPersonalData;
  department: Department;
  position?: Position;
  objectMark: OBJECT_MARK_ENUM;
}

export const userDataService = {
  getUserProfiles: async (
    options?: {
      all?: boolean;
      showDismissed?: boolean;
    }): Promise<ProfessionalUserData | ProfessionalUserData[]> => {

    const params = new URLSearchParams();
    if(options?.all)
      params.set("all", "true");
    if (options?.showDismissed)
      params.set("only_dismissed", "true");

    return await NetworkManager
      .getNetworkManager()
      .fetchWithAuth(`/user_profile/?${params.toString()}`, {
        method: "GET",
      });
  },


  updateUserData: async (userData: ProfessionalUserData[] | ProfessionalUserData, password?: string): Promise<ProfessionalUserData> => {
    const dataToProcess = Array.isArray(userData) ? userData[0] : userData;

    if (!dataToProcess.personal_data.personalization) {
      dataToProcess.personal_data.personalization = {};
    }
    const payload = {
      ...dataToProcess,
      
      role: { id: dataToProcess.role.id },
      position: dataToProcess.position
      ? { id: dataToProcess.position.id }
      : null,
      department: { id: dataToProcess.department.id },
    };
    if (password) {
      dataToProcess.user.password = password;
    }

    return await NetworkManager.getNetworkManager().fetchWithAuth(`/user_profile/`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  updateJSONUserData: async (userDataJSON: string): Promise<boolean> => {
    // Создание новой записи
    await NetworkManager.getNetworkManager().fetchWithAuth('/user_profile/', {
      method: 'POST',
      body: userDataJSON
    });
    return true;
  }
}


export const passwordService = {
  resetPassword: async (currentPassword: string, newPassword: string): Promise<boolean> => {
    return await NetworkManager.getNetworkManager().fetchWithAuth(`/reset_password/`, {
      method: 'PUT',
      body: JSON.stringify({ 'current_password': currentPassword, 'new_password': newPassword })
    });
  }
}