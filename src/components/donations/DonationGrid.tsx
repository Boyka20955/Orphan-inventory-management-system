
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Heart, Trash2, Calendar, CreditCard } from "lucide-react";
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

interface DonationGridProps {
  donations: Donation[];
  onEdit: (donation: Donation) => void;
  onDelete: (id: string) => void;
}

const DonationGrid: React.FC<DonationGridProps> = ({ donations, onEdit, onDelete }) => {
  const { language } = useLanguage();

  const translations = {
    en: {
      noDonations: "No donations found",
      addDonationDescription: "Click the 'Add Donation' button to record a donation",
      date: "Date",
      method: "Method",
      edit: "Edit",
      delete: "Delete"
    },
    sw: {
      noDonations: "Hakuna michango iliyopatikana",
      addDonationDescription: "Bofya kitufe 'Ongeza Mchango' kurekodi mchango",
      date: "Tarehe",
      method: "Njia",
      edit: "Hariri",
      delete: "Futa"
    }
  };

  const text = translations[language as keyof typeof translations];

  if (donations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
        <p className="text-xl text-muted-foreground">{text.noDonations}</p>
        <p className="text-sm text-muted-foreground mt-2">{text.addDonationDescription}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {donations.map((donation) => (
        <Card key={donation.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-primary/10 p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">{donation.donor.name}</h3>
                <p className="text-2xl font-bold">
                  {donation.amount.toLocaleString()} {donation.currency}
                </p>
              </div>
              <div className="bg-background rounded-full p-3">
                <Heart className="h-6 w-6 text-red-500" />
              </div>
            </div>
            
            <div className="p-6 space-y-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  {text.date}: {new Date(donation.donationDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  {text.method}: {donation.paymentMethod}
                </span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="bg-muted/50 px-6 py-3 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(donation)}>
              <Edit className="h-4 w-4 mr-1" /> {text.edit}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(donation.id)}>
              <Trash2 className="h-4 w-4 mr-1" /> {text.delete}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default DonationGrid;
