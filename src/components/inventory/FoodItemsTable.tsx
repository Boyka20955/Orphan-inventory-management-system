
import { useState } from "react";
import { FoodItem } from "@/types";
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  MoreVertical,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FoodItemsTableProps {
  items: FoodItem[];
  onEdit: (item: FoodItem) => void;
  onDelete: (id: string) => void;
}

const FoodItemsTable = ({ items, onEdit, onDelete }: FoodItemsTableProps) => {
  const getCategoryLabel = (category: string) => {
    const categories: { [key: string]: string } = {
      grain: "Grain",
      protein: "Protein",
      dairy: "Dairy",
      vegetable: "Vegetable",
      fruit: "Fruit",
      other: "Other",
    };
    return categories[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      grain: "bg-amber-100 text-amber-800",
      protein: "bg-red-100 text-red-800",
      dairy: "bg-blue-100 text-blue-800",
      vegetable: "bg-green-100 text-green-800",
      fruit: "bg-purple-100 text-purple-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  // Check if item quantity is low (less than 5 units)
  const isLowStock = (item: FoodItem) => {
    return item.quantity < 5;
  };

  // Check if item is expired or about to expire (within 7 days)
  const isNearExpiry = (item: FoodItem) => {
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);
    
    return expiryDate <= sevenDaysFromNow;
  };

  // Get status for an item
  const getItemStatus = (item: FoodItem) => {
    if (isNearExpiry(item)) return "Near Expiry";
    if (isLowStock(item)) return "Low Stock";
    return "Normal";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Near Expiry":
        return "bg-red-100 text-red-800";
      case "Low Stock":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Received</TableHead>
            <TableHead>Expiry</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-24">
                No food items found. Add some items to your inventory.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              const status = getItemStatus(item);
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getCategoryColor(item.category)}>
                      {getCategoryLabel(item.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {isLowStock(item) && (
                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                      )}
                      {item.quantity} {item.unit}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(item.dateReceived)}</TableCell>
                  <TableCell className={isNearExpiry(item) ? "text-red-600 font-medium" : ""}>
                    {formatDate(item.expiryDate)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(status)}>
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(item.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FoodItemsTable;
