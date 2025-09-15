
import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Badge } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Sponsorship {
  id: string;
  sponsor: {
    name: string;
    email?: string;
    phone?: string;
  };
  childId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  amount: number;
  currency: string;
  frequency: string;
  startDate: string;
  status: string;
}

interface SponsorshipTableProps {
  sponsorships: Sponsorship[];
  onEdit: (sponsorship: Sponsorship) => void;
  onDelete: (id: string) => void;
}

const SponsorshipTable: React.FC<SponsorshipTableProps> = ({ sponsorships, onEdit, onDelete }) => {
  const { language } = useLanguage();

  const translations = {
    en: {
      noSponsorships: "No sponsorships found",
      sponsor: "Sponsor",
      child: "Child",
      amount: "Amount",
      frequency: "Frequency",
      status: "Status",
      actions: "Actions",
      edit: "Edit",
      delete: "Delete"
    },
    sw: {
      noSponsorships: "Hakuna udhamini uliopatikana",
      sponsor: "Mdhamini",
      child: "Mtoto",
      amount: "Kiasi",
      frequency: "Mzunguko",
      status: "Hali",
      actions: "Vitendo",
      edit: "Hariri",
      delete: "Futa"
    }
  };

  const text = translations[language as keyof typeof translations];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Table>
      <TableCaption>{sponsorships.length === 0 ? text.noSponsorships : ""}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>{text.sponsor}</TableHead>
          <TableHead>{text.child}</TableHead>
          <TableHead>{text.amount}</TableHead>
          <TableHead>{text.frequency}</TableHead>
          <TableHead>{text.status}</TableHead>
          <TableHead className="w-[100px]">{text.actions}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sponsorships.map((sponsorship) => (
          <TableRow key={sponsorship.id}>
            <TableCell className="font-medium">{sponsorship.sponsor.name}</TableCell>
            <TableCell>
              {sponsorship.childId.firstName} {sponsorship.childId.lastName}
            </TableCell>
            <TableCell>
              {sponsorship.amount.toLocaleString()} {sponsorship.currency}
            </TableCell>
            <TableCell className="capitalize">{sponsorship.frequency}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sponsorship.status)}`}>
                {sponsorship.status.charAt(0).toUpperCase() + sponsorship.status.slice(1)}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(sponsorship)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(sponsorship.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SponsorshipTable;
