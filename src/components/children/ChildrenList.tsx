
import { Eye, Pencil, Trash2, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Child } from "@/types";
import { calculateAge, formatDate, getStatusColor } from "@/lib/utils";

interface ChildrenListProps {
  children: Child[];
  onViewProfile: (child: Child) => void;
  onEditChild: (child: Child) => void;
  onDeleteChild: (child: Child) => void;
}

const ChildrenList = ({ children, onViewProfile, onEditChild, onDeleteChild }: ChildrenListProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Age</th>
                <th className="px-4 py-3 text-left font-medium">Gender</th>
                <th className="px-4 py-3 text-left font-medium">Admitted</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {children.map((child) => (
                <tr key={child.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div>
                        <div className="font-medium">{child.firstName} {child.lastName}</div>
                        <div className="text-xs text-muted-foreground">ID: {child.id}</div>
                      </div>
                      {child.childPresent && (
                        <span className="ml-2" title="Child was present at last checkup">
                          <Check className="h-4 w-4 text-green-500" />
                        </span>
                      )}
                      {child.childUpdated && (
                        <span className="ml-1" title="Records updated recently">
                          <RefreshCw className="h-4 w-4 text-blue-500" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">{calculateAge(child.dateOfBirth)} years</td>
                  <td className="px-4 py-3 capitalize">{child.gender}</td>
                  <td className="px-4 py-3">{formatDate(child.dateAdmitted)}</td>
                  <td className="px-4 py-3">
                    <Badge className={`${getStatusColor(child.status)} capitalize`}>
                      {child.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-orphan-blue"
                        onClick={() => onViewProfile(child)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-amber-600"
                        onClick={() => onEditChild(child)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600"
                        onClick={() => onDeleteChild(child)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChildrenList;
