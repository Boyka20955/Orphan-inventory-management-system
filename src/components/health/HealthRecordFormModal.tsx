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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HealthRecord, Child } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Check, CheckCheck } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface HealthRecordFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: HealthRecord) => void;
  children: Child[];
  record?: HealthRecord;
  selectedChildId?: string;
}

const generateId = () => Math.floor(Math.random() * 10000).toString();

import ChildSelector from "@/components/health/ChildSelector";

const HealthRecordFormModal = ({
  isOpen, 
  onClose, 
  onSave, 
  children,
  record,
  selectedChildId
}: HealthRecordFormModalProps) => {
  const isEditing = !!record;
  
  const [formData, setFormData] = useState<HealthRecord>({
    id: "",
    childId: "",
    date: "",
    type: "checkup",
    description: "",
    doctor: "",
    hospital: "",
    cost: undefined,
    isPaid: false,
  });

  const [childFirstName, setChildFirstName] = useState("");
  const [childLastName, setChildLastName] = useState("");
  
  const [errors, setErrors] = useState({
    childFirstName: "",
    childLastName: "",
    doctor: "",
    hospital: ""
  });

  useEffect(() => {
    if (record) {
      setFormData(record);
      if (record.childFirstName) setChildFirstName(record.childFirstName);
      if (record.childLastName) setChildLastName(record.childLastName);
    } else {
      setFormData({
        id: `hr${generateId()}`,
        childId: selectedChildId || "",
        date: new Date().toISOString().split('T')[0],
        type: "checkup",
        description: "",
        doctor: "",
        hospital: "",
        cost: undefined,
        isPaid: false,
        childUpdated: false,
        childPresent: true,
      });
    }
    
    // Reset errors
    setErrors({
      childFirstName: "",
      childLastName: "",
      doctor: "",
      hospital: ""
    });
    
    // Reset manual entry fields if not editing
    if (!record) {
      setChildFirstName("");
      setChildLastName("");
    }
  }, [record, isOpen, selectedChildId]);

  const validateName = (value: string, field: keyof typeof errors): boolean => {
    const letterOnlyRegex = /^[A-Za-z\s]+$/;
    
    if (!letterOnlyRegex.test(value)) {
      setErrors(prev => ({
        ...prev,
        [field]: "Should contain only letters"
      }));
      return false;
    }
    
    setErrors(prev => ({
      ...prev,
      [field]: ""
    }));
    return true;
  };

  const handleChildInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'childFirstName') {
      setChildFirstName(value);
      validateName(value, 'childFirstName');
    } else if (name === 'childLastName') {
      setChildLastName(value);
      validateName(value, 'childLastName');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'doctor' || name === 'hospital') {
      validateName(value, name as keyof typeof errors);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : Number(value),
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    let isValid = true;
    
    // Validate doctor and hospital names
    if (formData.doctor && !validateName(formData.doctor, 'doctor')) {
      isValid = false;
    }
    
    if (formData.hospital && !validateName(formData.hospital as string, 'hospital')) {
      isValid = false;
    }
    
    // Always validate child name fields
    if (!validateName(childFirstName, 'childFirstName') || !validateName(childLastName, 'childLastName')) {
      isValid = false;
    }
    
    // Both first and last name must be provided
    if (!childFirstName || !childLastName) {
      toast({
        title: "Validation Error",
        description: "Please enter both first and last name for the child.",
        variant: "destructive",
      });

      if (!formData.childId) {
  toast({
    title: "Validation Error",
    description: "Please select a child from the list.",
    variant: "destructive",
  });
  return;
  }
      return;
    }
    
    // Generate a temporary ID that includes the name
    const tempId = `temp_${childFirstName.toLowerCase()}_${childLastName.toLowerCase()}`;
    
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Names should contain only letters.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.date || !formData.description || !formData.doctor || !formData.hospital) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Add child name fields to the record
    const updatedRecord = {
      ...formData,
      childId: tempId,
      childFirstName,
      childLastName
    }as any;

    onSave(updatedRecord);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Update Health Record" : "Add New Health Record"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the information for this health record." 
              : "Enter the details to add a new health record."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Child Information</Label>
              <ChildSelector 
                children={children} 
                selectedChildId={formData.childId} 
                onSelect={(childId) => setFormData(prev => ({ ...prev, childId }))}
              />
            </div>

          {(selectedChildId || formData.childId) && (
            <div className="flex flex-col space-y-2 p-3 border rounded-md bg-muted/20">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="childPresent"
                  checked={formData.childPresent !== false}
                  onCheckedChange={(checked) => {
                    setFormData(prev => ({
                      ...prev,
                      childPresent: checked === "indeterminate" ? undefined : checked
                    }));
                  }}
                />
                <Label htmlFor="childPresent" className="flex items-center text-sm cursor-pointer">
                  <Check className="h-4 w-4 mr-1 text-green-500" />
                  Child was present during visit
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="childUpdated" 
                  checked={formData.childUpdated === true}
                  onCheckedChange={(checked) => {
                    setFormData(prev => ({
                      ...prev,
                      childUpdated: checked === "indeterminate" ? undefined : checked
                    }));
                  }}
                />
                <Label htmlFor="childUpdated" className="flex items-center text-sm cursor-pointer">
                  <CheckCheck className="h-4 w-4 mr-1 text-blue-500" />
                  Child information was updated
                </Label>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="date">Date*</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type*</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value as any)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checkup">Checkup</SelectItem>
                <SelectItem value="vaccination">Vaccination</SelectItem>
                <SelectItem value="illness">Illness</SelectItem>
                <SelectItem value="treatment">Treatment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description*</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hospital">Hospital/Clinic*</Label>
            <Input
              id="hospital"
              name="hospital"
              value={formData.hospital || ""}
              onChange={handleInputChange}
              className={errors.hospital ? "border-red-500" : ""}
              required
            />
            {errors.hospital && (
              <p className="text-xs text-red-500">{errors.hospital}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctor">Doctor*</Label>
            <Input
              id="doctor"
              name="doctor"
              value={formData.doctor}
              onChange={handleInputChange}
              className={errors.doctor ? "border-red-500" : ""}
              required
            />
            {errors.doctor && (
              <p className="text-xs text-red-500">{errors.doctor}</p>
            )}
          </div>

          {(formData.type === "illness" || formData.type === "treatment") && (
            <>
              <div className="space-y-2">
                <Label htmlFor="disease">Disease/Condition</Label>
                <Input
                  id="disease"
                  name="disease"
                  value={formData.disease || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatment">Treatment</Label>
                <Textarea
                  id="treatment"
                  name="treatment"
                  value={formData.treatment || ""}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="cost">Cost (KES)</Label>
            <Input
              id="cost"
              name="cost"
              type="number"
              value={formData.cost === undefined ? "" : formData.cost}
              onChange={handleNumberChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPaid"
              checked={formData.isPaid}
              onCheckedChange={(checked) => {
                setFormData(prev => ({
                  ...prev,
                  isPaid: checked === "indeterminate" ? false : checked
                }));
              }}
            />
            <Label htmlFor="isPaid" className="cursor-pointer">Payment Completed</Label>
          </div>

          {!formData.isPaid && formData.cost && formData.cost > 0 && (
            <div className="space-y-2">
              <Label htmlFor="debt">Outstanding Amount (KES)</Label>
              <Input
                id="debt"
                name="debt"
                type="number"
                value={formData.debt === undefined ? "" : formData.debt}
                onChange={handleNumberChange}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ""}
              onChange={handleInputChange}
              rows={3}
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

export default HealthRecordFormModal;

