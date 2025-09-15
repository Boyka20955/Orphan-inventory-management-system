
import { Eye, Pencil, Trash2, User, CalendarIcon, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Child } from "@/types";
import { formatDate, calculateAge, getStatusColor } from "@/lib/utils";

interface ChildrenGridProps {
  children: Child[];
  onViewProfile: (child: Child) => void;
  onEditChild: (child: Child) => void;
  onDeleteChild: (child: Child) => void;
}

const ChildrenGrid = ({ children, onViewProfile, onEditChild, onDeleteChild }: ChildrenGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {children.map((child) => (
        <Card key={child.id} className="card-hover">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg flex items-center">
                  {child.firstName} {child.lastName}
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
                </CardTitle>
                <CardDescription className="mt-1">
                  ID: {child.id} • {calculateAge(child.dateOfBirth)} years old
                </CardDescription>
              </div>
              <Badge className={`${getStatusColor(child.status)} capitalize`}>
                {child.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">Gender:</span>
                <span className="capitalize">{child.gender}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">Admitted:</span>
                <span>{formatDate(child.dateAdmitted)}</span>
              </div>
              {child.guardianInfo && (
                <div className="pt-2 text-xs text-muted-foreground">
                  <p className="line-clamp-2">{child.guardianInfo}</p>
                </div>
              )}
            </div>
            <div className="mt-4 pt-2 border-t">
              <div className="flex justify-between">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-orphan-blue px-2"
                  onClick={() => onViewProfile(child)}
                >
                  <Eye className="mr-1 h-3 w-3" />
                  View
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-amber-600 px-2"
                  onClick={() => onEditChild(child)}
                >
                  <Pencil className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 px-2"
                  onClick={() => onDeleteChild(child)}
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ChildrenGrid;
