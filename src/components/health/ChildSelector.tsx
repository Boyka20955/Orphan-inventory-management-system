
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Child } from '@/types';

interface ChildSelectorProps {
  children: Child[];
  selectedChildId: string | null;
  onSelect: (childId: string) => void; // Changed from onChange to onSelect
  includeAll?: boolean;
  allChildrenLabel?: string;
}

const ChildSelector = ({
  children,
  selectedChildId,
  onSelect, // Changed from onChange to onSelect
  includeAll = false,
  allChildrenLabel = "All Children"
}: ChildSelectorProps) => {
  return (
    <Select 
      value={selectedChildId || (includeAll ? "all" : "")} 
      onValueChange={(value) => {
        if (value === "all") {
          onSelect("");
        } else {
          onSelect(value);
        }
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a child" />
      </SelectTrigger>
      <SelectContent>
        {includeAll && (
          <SelectItem value="all">{allChildrenLabel}</SelectItem>
        )}
        {children.map((child) => (
          <SelectItem key={child.id} value={child.id}>
            {child.firstName} {child.lastName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ChildSelector;
