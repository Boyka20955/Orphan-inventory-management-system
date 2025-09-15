
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
import { toast } from "@/hooks/use-toast";
import { Child } from "@/types";
import PersonalInfoFields from "./form/PersonalInfoFields";
import AdmissionFields from "./form/AdmissionFields";

interface ChildFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (child: Child) => void;
  child?: Child;
}

const generateId = () => Math.floor(Math.random() * 1000).toString();

const ChildFormModal = ({ isOpen, onClose, onSave, child }: ChildFormModalProps) => {
  const isEditing = !!child;
  
  const [formData, setFormData] = useState<Child>({
    id: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "male",
    dateAdmitted: "",
    status: "active",
    guardianInfo: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    dateAdmitted: ""
  });

  useEffect(() => {
    if (child) {
      setFormData(child);
    } else {
      setFormData({
        id: generateId(),
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "male",
        dateAdmitted: new Date().toISOString().split('T')[0],
        status: "active",
        guardianInfo: "",
      });
    }
    setErrors({
      firstName: "",
      lastName: "",
      dateAdmitted: ""
    });
  }, [child, isOpen]);

  const validateName = (name: string, field: 'firstName' | 'lastName'): boolean => {
    const letterOnlyRegex = /^[A-Za-z\s]+$/;
    
    if (!letterOnlyRegex.test(name)) {
      setErrors(prev => ({
        ...prev,
        [field]: "Name should contain only letters"
      }));
      return false;
    }
    
    setErrors(prev => ({
      ...prev,
      [field]: ""
    }));
    return true;
  };

  const validateDates = (dateOfBirth: string, dateAdmitted: string): boolean => {
    if (dateOfBirth && dateAdmitted && dateOfBirth === dateAdmitted) {
      setErrors(prev => ({
        ...prev,
        dateAdmitted: "Date of admission cannot be the same as date of birth"
      }));
      return false;
    }
    
    setErrors(prev => ({
      ...prev,
      dateAdmitted: ""
    }));
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'firstName' || name === 'lastName') {
      validateName(value, name as 'firstName' | 'lastName');
    }
    
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      };
      
      if ((name === 'dateOfBirth' && prev.dateAdmitted) || 
          (name === 'dateAdmitted' && prev.dateOfBirth)) {
        validateDates(
          name === 'dateOfBirth' ? value : prev.dateOfBirth,
          name === 'dateAdmitted' ? value : prev.dateAdmitted
        );
      }
      
      return newData;
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate names
    const isFirstNameValid = validateName(formData.firstName, 'firstName');
    const isLastNameValid = validateName(formData.lastName, 'lastName');
    
    // Validate dates
    const areDatesValid = validateDates(formData.dateOfBirth, formData.dateAdmitted);
    
    if (!isFirstNameValid || !isLastNameValid) {
      toast({
        title: "Validation Error",
        description: "Names should contain only letters.",
        variant: "destructive",
      });
      return;
    }
    
    if (!areDatesValid) {
      toast({
        title: "Validation Error",
        description: "Date of admission cannot be the same as date of birth.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Update Child Information" : "Add New Child"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the information for this child." 
              : "Enter the details to add a new child to the records."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <PersonalInfoFields
            firstName={formData.firstName}
            lastName={formData.lastName}
            dateOfBirth={formData.dateOfBirth}
            gender={formData.gender}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            errors={errors}
          />

          <AdmissionFields
            dateAdmitted={formData.dateAdmitted}
            status={formData.status}
            guardianInfo={formData.guardianInfo}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            errors={errors}
          />

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

export default ChildFormModal;
