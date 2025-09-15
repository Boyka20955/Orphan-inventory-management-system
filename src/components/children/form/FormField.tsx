
import { ReactNode } from "react";
import { Label } from "@/components/ui/label";

export interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  component?: React.ComponentType<any>;
  className?: string;
  error?: string;
}

const FormField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  component: Component,
  rows,
  className = "",
  error
}: FormFieldProps) => {
  const inputProps = {
    id,
    name: id,
    value,
    onChange,
    placeholder,
    required,
    className: `w-full ${error ? "border-red-500" : ""} ${className}`,
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="block">
        {label}{required && '*'}
      </Label>
      
      {Component ? (
        <Component {...inputProps} rows={rows} />
      ) : (
        <input type={type} {...inputProps} />
      )}
      
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FormField;
