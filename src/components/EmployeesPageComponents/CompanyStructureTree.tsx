import { Users } from "lucide-react";
import React, { useMemo } from "react";
import TreeNode from "./TreeNode";
import { useAuth } from "@/context/exports";
import { ProfessionalUserData, UserData } from "@/services/API/UserProfileAPI";


export interface CompanyTreeNode {
  id: number;
  user: ProfessionalUserData;
  children?: CompanyTreeNode[];
}
const DIRECTORS = [
  "IgorRudny",
  "DenisNizhegorodtsev",
  "EvgeniyKurilo",
];

const buildTreeFromUserData = (
  userData: UserData
): CompanyTreeNode | null => {
  const user = userData.user_data;

  if (
    user.user.username === "admin" ||
    !user.personal_data.is_active ||
    DIRECTORS.includes(user.user.username)
  ) {
    return null;
  }

  return {
    id: user.personal_data.profile_id,
    user,
    children: userData.subordinate_users
      .map(subUserData =>
        buildTreeFromUserData({
          user_data: subUserData,
          subordinate_users: [],
          subordinations: [],
        })
      )
      .filter(Boolean) as CompanyTreeNode[],
  };
};


const buildCompanyTree = (root: UserData): CompanyTreeNode[] => {
  const denisUser = root.subordinate_users.find(
    u => u.user.username === "MagdiOsmanov"
  );

  if (!denisUser) return [];

  const denis = root.subordinate_users.find(
    u => u.user.username === "MagdiOsmanov"
  );

  if (!denis) return [];
  return root.subordinate_users
    .filter(
      u =>
        u.user.username !== "MagdiOsmanov" &&
        u.user.username !== "admin" &&
        u.personal_data.is_active &&
        !DIRECTORS.includes(u.user.username)
    )
    .map(u => ({
      id: u.personal_data.profile_id,
      user: u,
      children: [], // ← пока всегда пусто
    }));
};

const buildSubordinationTreeFromUserData = (
  userData: UserData
): CompanyTreeNode => {
  return {
    id: userData.user_data.personal_data.profile_id,
    user: userData.user_data,
    children: userData.subordinate_users.map(subUser =>
      buildSubordinationTreeFromUserData({
        user_data: subUser,
        subordinate_users: [],
        subordinations: [],
      })
    ),
  };
};


const CompanyStructureTree: React.FC = () => {
    const { userData } = useAuth();


    
    const companyTree = useMemo(() => {
        if (!userData?.current) return [];
        return buildCompanyTree(userData.current);
        }, [userData]);


    return(
        <div className="p-4 relative">
            <div className="flex justify-between items-center w-full mb-6">
                <div className="flex justify-between items-center w-full">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Users className="h-8 w-8" /> Структура компании 
                    </h1>
                </div>
            </div>
            
            <div className="w-full space-y-4">
                {companyTree.map(node => (
                    <TreeNode key={node.id} node={node} />
                ))}
            </div>
        </div>

    )

}
export default CompanyStructureTree
