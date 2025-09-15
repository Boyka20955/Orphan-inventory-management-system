
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FoodItem } from "@/types";
import { toast } from "@/hooks/use-toast";

interface FoodItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: FoodItem) => void;
  item?: FoodItem;
}

const generateId = () => Math.floor(Math.random() * 10000).toString();

const FoodItemFormModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  item 
}: FoodItemFormModalProps) => {
  const isEditing = !!item;
  
  const [formData, setFormData] = useState<FoodItem>({
    id: "",
    name: "",
    category: "",
    quantity: 0,
    unit: "",
    expiryDate: "",
    dateReceived: "",
    supplier: "",
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        id: `food${generateId()}`,
        name: "",
        category: "grain",
        quantity: 0,
        unit: "kg",
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dateReceived: new Date().toISOString().split('T')[0],
        supplier: "",
        status: "normal"
      });
    }
  }, [item, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? 0 : Number(value),
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.unit || formData.quantity <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and ensure quantity is greater than 0.",
        variant: "destructive",
      });
      return;
    }
    
    // Automatically set status based on quantity if not set manually
    if (!formData.status) {
      const status = formData.quantity < 5 ? "lowStock" : "normal";
      setFormData(prev => ({
        ...prev,
        status
      }));
    }
    
    // Calculate days to expiry
    const today = new Date();
    const expiryDate = new Date(formData.expiryDate);
    const daysToExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // If near expiry (less than 14 days) and not manually set to lowStock, set to nearExpiry
    if (daysToExpiry < 14 && formData.status !== "lowStock") {
      setFormData(prev => ({
        ...prev,
        status: "nearExpiry"
      }));
    }
    
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Food Item" : "Add New Food Item"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the information for this food item." 
              : "Enter the details to add a new food item to the inventory."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name*</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category*</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grain">Grain</SelectItem>
                <SelectItem value="protein">Protein</SelectItem>
                <SelectItem value="dairy">Dairy</SelectItem>
                <SelectItem value="vegetable">Vegetable</SelectItem>
                <SelectItem value="fruit">Fruit</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity*</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                step="0.1"
                value={formData.quantity}
                onChange={handleNumberChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit*</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => handleSelectChange("unit", value)}
              >
                <SelectTrigger id="unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilogram (kg)</SelectItem>
                  <SelectItem value="g">Gram (g)</SelectItem>
                  <SelectItem value="ltr">Liter (ltr)</SelectItem>
                  <SelectItem value="ml">Milliliter (ml)</SelectItem>
                  <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                  <SelectItem value="box">Box</SelectItem>
                  <SelectItem value="bag">Bag</SelectItem>
                  <SelectItem value="sack">Sack</SelectItem>
                  <SelectItem value="crate">Crate</SelectItem>
                  <SelectItem value="bale">Bale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status || 'normal'}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="lowStock">Low Stock</SelectItem>
                <SelectItem value="nearExpiry">Near Expiry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateReceived">Date Received*</Label>
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
              <Label htmlFor="expiryDate">Expiry Date*</Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier">Supplier</Label>
            <Input
              id="supplier"
              name="supplier"
              value={formData.supplier || ""}
              onChange={handleInputChange}
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

export default FoodItemFormModal;
