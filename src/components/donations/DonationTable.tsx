
import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Donation {
  id: string;
  donor: {
    name: string;
    email?: string;
    phone?: string;
  };
  amount: number;
  currency: string;
  donationDate: string;
  paymentMethod: string;
}

interface DonationTableProps {
  donations: Donation[];
  onEdit: (donation: Donation) => void;
  onDelete: (id: string) => void;
}

const DonationTable: React.FC<DonationTableProps> = ({ donations, onEdit, onDelete }) => {
  const { language } = useLanguage();

  const translations = {
    en: {
      noDonations: "No donations found",
      donor: "Donor",
      amount: "Amount",
      date: "Date",
      method: "Payment Method",
      actions: "Actions",
      edit: "Edit",
      delete: "Delete"
    },
    sw: {
      noDonations: "Hakuna michango iliyopatikana",
      donor: "Mchangiaji",
      amount: "Kiasi",
      date: "Tarehe",
      method: "Njia ya Malipo",
      actions: "Vitendo",
      edit: "Hariri",
      delete: "Futa"
    }
  };

  const text = translations[language as keyof typeof translations];

  return (
    <Table>
      <TableCaption>{donations.length === 0 ? text.noDonations : ""}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>{text.donor}</TableHead>
          <TableHead>{text.amount}</TableHead>
          <TableHead>{text.date}</TableHead>
          <TableHead>{text.method}</TableHead>
          <TableHead className="w-[100px]">{text.actions}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {donations.map((donation) => (
          <TableRow key={donation.id}>
            <TableCell className="font-medium">{donation.donor.name}</TableCell>
            <TableCell>
              {donation.amount.toLocaleString()} {donation.currency}
            </TableCell>
            <TableCell>{new Date(donation.donationDate).toLocaleDateString()}</TableCell>
            <TableCell>{donation.paymentMethod}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(donation)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(donation.id)}>
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

export default DonationTable;
