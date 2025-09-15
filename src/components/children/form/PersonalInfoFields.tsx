
import FormField from "./FormField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PersonalInfoFieldsProps {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  errors?: {
    firstName?: string;
    lastName?: string;
  };
}

const PersonalInfoFields = ({
  firstName,
  lastName,
  dateOfBirth,
  gender,
  onInputChange,
  onSelectChange,
  errors = {}
}: PersonalInfoFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="firstName">First Name*</Label>
          <Input
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={onInputChange}
            className={errors.firstName ? "border-red-500" : ""}
            required
          />
          {errors.firstName && (
            <p className="text-xs text-red-500">{errors.firstName}</p>
          )}
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="lastName">Last Name*</Label>
          <Input
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={onInputChange}
            className={errors.lastName ? "border-red-500" : ""}
            required
          />
          {errors.lastName && (
            <p className="text-xs text-red-500">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="dateOfBirth"
          label="Date of Birth"
          type="date"
          value={dateOfBirth}
          onChange={onInputChange}
          required
        />
        <div className="space-y-2">
          <Label htmlFor="gender">Gender*</Label>
          <Select 
            value={gender} 
            onValueChange={(value) => onSelectChange("gender", value)}
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoFields;
