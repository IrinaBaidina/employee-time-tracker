import { ProfessionalUserData } from "@/services/API/UserProfileAPI";


export interface CompanyTreeNode {
  id: number;
  user: ProfessionalUserData;
  children?: CompanyTreeNode[];
}
interface TreeNodeProps {
  node: CompanyTreeNode;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node }) => {
  const { user, children } = node;

  const name = `${user.personal_data.last_name} ${user.personal_data.first_name}`;
  const type = user.position?.name ?? "Сотрудник";

  return (
    <div className="ml-4">
      <div className="flex flex-col">
        <span className="font-medium">{name}</span>
        <span className="text-xs text-muted-foreground">{type}</span>
      </div>

      {children && children.length > 0 && (
        <div className="ml-4">
            {children.map(child => (
            <TreeNode key={child.id} node={child} />
            ))}
        </div>
        )}
    </div>
  );
};
export default TreeNode
