
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ClothingItem } from "@/types";

interface ClothingItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ClothingItem) => void;
  item?: ClothingItem | null;
}

const ClothingItemFormModal = ({ isOpen, onClose, onSave, item }: ClothingItemFormModalProps) => {
  const isEditing = !!item;
  
  const [formData, setFormData] = useState<ClothingItem>({
    id: "",
    name: "",
    category: "shirt",
    type: "shirt", // Add default value for type
    size: "",
    quantity: 1,
    condition: "new",
    dateReceived: new Date().toISOString().split('T')[0],
    gender: "unisex",
    assignedTo: [], // Changed to empty array
    ageRange: "",
    notes: ""
  });

  useEffect(() => {
    if (item) {
      // Ensure assignedTo is always an array
      const assignedTo = Array.isArray(item.assignedTo) ? item.assignedTo : 
                        (item.assignedTo ? [item.assignedTo] : []);
                        
      setFormData({
        ...item,
        assignedTo,
        type: item.type || item.category // Use type if available, otherwise fallback to category
      });
    } else {
      setFormData({
        id: "",
        name: "",
        category: "shirt",
        type: "shirt",
        size: "",
        quantity: 1,
        condition: "new",
        dateReceived: new Date().toISOString().split('T')[0],
        gender: "unisex",
        assignedTo: [], // Changed to empty array
        ageRange: "",
        notes: ""
      });
    }
  }, [item, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "quantity") {
      const numValue = parseInt(value);
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure type and category are synchronized
    const updatedFormData = {
      ...formData,
      category: formData.type || formData.category // Keep them consistent
    };
    onSave(updatedFormData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Update Clothing Item" : "Add New Clothing Item"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the information for this clothing item." 
              : "Enter the details to add a new clothing item to inventory."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={formData.type || formData.category} 
                onValueChange={(value) => {
                  handleSelectChange("type", value);
                  handleSelectChange("category", value); // Keep type and category in sync
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shirt">Shirt</SelectItem>
                  <SelectItem value="pants">Pants</SelectItem>
                  <SelectItem value="shoes">Shoes</SelectItem>
                  <SelectItem value="jacket">Jacket</SelectItem>
                  <SelectItem value="socks">Socks</SelectItem>
                  <SelectItem value="underwear">Underwear</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select 
                value={formData.condition} 
                onValueChange={(value) => handleSelectChange("condition", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
                placeholder="e.g., S, M, L, XL, XXL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateReceived">Date Received</Label>
              <Input
                id="dateReceived"
                name="dateReceived"
                type="date"
                value={formData.dateReceived}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select 
                value={formData.gender || "unisex"} 
                onValueChange={(value) => handleSelectChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="unisex">Unisex</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ageRange">Age Range</Label>
            <Input
              id="ageRange"
              name="ageRange"
              value={formData.ageRange || ""}
              onChange={handleInputChange}
              placeholder="e.g.,infant, toddler, child, teen, adult,1-4 years, 5-8 years,9-12 years,13-16 years,17-20 years,21-24 years,25-30 years"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ""}
              onChange={handleInputChange}
              rows={3}
              placeholder="Any additional information about this item"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Update" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClothingItemFormModal;
