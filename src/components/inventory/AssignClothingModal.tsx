
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ClothingItem, Child } from "@/types";
import { calculateAge } from "@/lib/utils";

interface AssignClothingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (childIds: string[]) => void;
  item: ClothingItem;
  children: Child[];
  alreadyAssignedTo: string[];
}

const AssignClothingModal = ({ 
  isOpen, 
  onClose, 
  onAssign, 
  item, 
  children, 
  alreadyAssignedTo 
}: AssignClothingModalProps) => {
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [filteredChildren, setFilteredChildren] = useState<Child[]>([]);

  useEffect(() => {
    setSelectedChildren([...alreadyAssignedTo]);
    
    // Filter children by gender and age if available
    let filtered = [...children];
    
    if (item.gender && item.gender !== "unisex") {
      filtered = filtered.filter(child => child.gender === item.gender);
    }
    
    if (item.ageRange && typeof item.ageRange === 'string') {
      const [minAge, maxAge] = item.ageRange.split('-').map(Number);
      if (!isNaN(minAge) && !isNaN(maxAge)) {
        filtered = filtered.filter(child => {
          const age = calculateAge(child.dateOfBirth);
          return age >= minAge && age <= maxAge;
        });
      }
    }
    
    setFilteredChildren(filtered);
  }, [children, item, alreadyAssignedTo]);

  const handleToggleChild = (childId: string) => {
    setSelectedChildren(prev => {
      if (prev.includes(childId)) {
        return prev.filter(id => id !== childId);
      } else {
        return [...prev, childId];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign(selectedChildren);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign {item.name}</DialogTitle>
          <DialogDescription>
            Select children to assign this clothing item to. You have {item.quantity} item(s) available.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Available Children</Label>
              <span className="text-sm text-muted-foreground">
                Selected: {selectedChildren.length}/{item.quantity}
              </span>
            </div>
            
            <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto space-y-3">
              {filteredChildren.length > 0 ? (
                filteredChildren.map(child => (
                  <div key={child.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`child-${child.id}`}
                      checked={selectedChildren.includes(child.id)}
                      onCheckedChange={() => handleToggleChild(child.id)}
                      disabled={!selectedChildren.includes(child.id) && selectedChildren.length >= item.quantity}
                    />
                    <Label 
                      htmlFor={`child-${child.id}`}
                      className="flex flex-1 justify-between items-center"
                    >
                      <span>{child.firstName} {child.lastName}</span>
                      <span className="text-xs text-muted-foreground">
                        {calculateAge(child.dateOfBirth)} yrs • {child.gender}
                      </span>
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-2">
                  No matching children found. Try adjusting the item's gender or age range.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={selectedChildren.length === 0}
            >
              Assign to {selectedChildren.length} {selectedChildren.length === 1 ? "child" : "children"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignClothingModal;
