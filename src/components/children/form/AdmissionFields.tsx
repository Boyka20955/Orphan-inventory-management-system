
import FormField from "./FormField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface AdmissionFieldsProps {
  dateAdmitted: string;
  status: string;
  guardianInfo?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  errors?: {
    dateAdmitted?: string;
  }
}

const AdmissionFields = ({
  dateAdmitted,
  status,
  guardianInfo = "",
  onInputChange,
  onSelectChange,
  errors = {}
}: AdmissionFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="dateAdmitted">Date Admitted*</Label>
          <Input
            id="dateAdmitted"
            name="dateAdmitted"
            type="date"
            value={dateAdmitted}
            onChange={onInputChange}
            className={errors.dateAdmitted ? "border-red-500" : ""}
            required
          />
          {errors.dateAdmitted && (
            <p className="text-xs text-red-500">{errors.dateAdmitted}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status*</Label>
          <Select 
            value={status} 
            onValueChange={(value) => onSelectChange("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="transferred">Transferred</SelectItem>
              <SelectItem value="graduated">Graduated</SelectItem>
              <SelectItem value="adopted">Adopted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <FormField
        id="guardianInfo"
        label="Guardian Information"
        value={guardianInfo}
        onChange={onInputChange}
        component={Textarea}
        placeholder="Enter any information about guardians or relatives"
        rows={3}
      />
    </div>
  );
};

export default AdmissionFields;
