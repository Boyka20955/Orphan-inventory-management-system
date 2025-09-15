
import { Shirt, Pencil, Trash2, Users, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ClothingItem, Child } from "@/types";
import { formatDate } from "@/lib/utils";

interface ClothingItemsGridProps {
  items: ClothingItem[];
  onEdit: (item: ClothingItem) => void;
  onDelete: (itemId: string) => void;
  onAssign: (item: ClothingItem) => void;
  children: Child[];
}

const ClothingItemsGrid = ({ items, onEdit, onDelete, onAssign, children }: ClothingItemsGridProps) => {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'fair':
        return 'bg-amber-100 text-amber-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getItemIcon = (itemType: string | undefined) => {
    // Use the type property if available, otherwise fall back to category
    const type = itemType || '';
    
    switch (type) {
      case 'shirt':
        return <Shirt className="h-4 w-4" />;
      case 'pants':
        return <Tag className="h-4 w-4" />; 
      case 'shoes':
        return <Tag className="h-4 w-4" />; 
      case 'jacket':
        return <Shirt className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };

  const getAssignedChildrenNames = (assignedTo: string[] | undefined) => {
    if (!assignedTo || assignedTo.length === 0) return "Not assigned";
    
    return assignedTo.map(childId => {
      const child = children.find(c => c.id === childId);
      return child ? `${child.firstName} ${child.lastName}` : "Unknown Child";
    }).join(", ");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <span className="mr-2">{getItemIcon(item.type)}</span>
                <CardTitle className="text-lg">{item.name}</CardTitle>
              </div>
              <Badge className={`${getConditionColor(item.condition)} capitalize`}>
                {item.condition}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="capitalize">{item.type || item.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Size:</span>
                <span>{item.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity:</span>
                <span>{item.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Received:</span>
                <span>{formatDate(item.dateReceived)}</span>
              </div>
              
              {item.gender && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender:</span>
                  <span className="capitalize">{item.gender}</span>
                </div>
              )}
              
              <div className="pt-2 text-xs">
                <div className="flex items-start">
                  <Users className="h-3 w-3 mr-1 mt-0.5 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">Assigned to:</span>
                  <span className="line-clamp-1">
                    {getAssignedChildrenNames(item.assignedTo)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-2 border-t">
              <div className="flex justify-between">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-amber-600 px-2"
                  onClick={() => onEdit(item)}
                >
                  <Pencil className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-orphan-blue px-2"
                  onClick={() => onAssign(item)}
                >
                  <Users className="mr-1 h-3 w-3" />
                  Assign
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 px-2"
                  onClick={() => onDelete(item.id)}
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

export default ClothingItemsGrid;
