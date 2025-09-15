
import { Pencil, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ClothingItem, Child } from "@/types";
import { formatDate } from "@/lib/utils";

interface ClothingItemsTableProps {
  items: ClothingItem[];
  onEdit: (item: ClothingItem) => void;
  onDelete: (itemId: string) => void;
  onAssign: (item: ClothingItem) => void;
  children: Child[];
}

const ClothingItemsTable = ({ items, onEdit, onDelete, onAssign, children }: ClothingItemsTableProps) => {
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

  const getAssignedChildrenNames = (assignedTo: string[] | undefined) => {
    if (!assignedTo || assignedTo.length === 0) return "Not assigned";
    
    return assignedTo.map(childId => {
      const child = children.find(c => c.id === childId);
      return child ? `${child.firstName} ${child.lastName}` : "Unknown Child";
    }).join(", ");
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Date Received</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="capitalize">{item.type || item.category}</TableCell>
              <TableCell>{item.size}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>
                <Badge className={`${getConditionColor(item.condition)} capitalize`}>
                  {item.condition}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(item.dateReceived)}</TableCell>
              <TableCell>
                <span className="line-clamp-1" title={getAssignedChildrenNames(item.assignedTo)}>
                  {getAssignedChildrenNames(item.assignedTo)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => onEdit(item)}
                  >
                    <Pencil className="h-4 w-4 text-amber-600" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onAssign(item)}
                  >
                    <Users className="h-4 w-4 text-orphan-blue" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClothingItemsTable;
