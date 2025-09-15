
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Users, Trash2, Calendar, Banknote } from "lucide-react";
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

interface SponsorshipGridProps {
  sponsorships: Sponsorship[];
  onEdit: (sponsorship: Sponsorship) => void;
  onDelete: (id: string) => void;
}

const SponsorshipGrid: React.FC<SponsorshipGridProps> = ({ sponsorships, onEdit, onDelete }) => {
  const { language } = useLanguage();

  const translations = {
    en: {
      noSponsorships: "No sponsorships found",
      addSponsorshipDescription: "Click the 'Add Sponsorship' button to create a sponsorship",
      since: "Since",
      frequency: "Frequency",
      status: "Status",
      edit: "Edit",
      delete: "Delete",
      monthly: "Monthly",
      quarterly: "Quarterly",
      annually: "Annually",
      oneTime: "One-time"
    },
    sw: {
      noSponsorships: "Hakuna udhamini uliopatikana",
      addSponsorshipDescription: "Bofya kitufe 'Ongeza Udhamini' kuunda udhamini",
      since: "Tangu",
      frequency: "Mzunguko",
      status: "Hali",
      edit: "Hariri",
      delete: "Futa",
      monthly: "Kila mwezi",
      quarterly: "Kila robo mwaka",
      annually: "Kila mwaka",
      oneTime: "Mara moja"
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

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'monthly':
        return text.monthly;
      case 'quarterly':
        return text.quarterly;
      case 'annually':
        return text.annually;
      case 'one-time':
        return text.oneTime;
      default:
        return frequency;
    }
  };

  if (sponsorships.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
        <p className="text-xl text-muted-foreground">{text.noSponsorships}</p>
        <p className="text-sm text-muted-foreground mt-2">{text.addSponsorshipDescription}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sponsorships.map((sponsorship) => (
        <Card key={sponsorship.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-primary/10 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{sponsorship.sponsor.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {text.status}: 
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sponsorship.status)}`}>
                      {sponsorship.status.charAt(0).toUpperCase() + sponsorship.status.slice(1)}
                    </span>
                  </p>
                </div>
                <div className="bg-background rounded-full p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Sponsoring:</p>
                <p className="text-lg font-bold">
                  {sponsorship.childId.firstName} {sponsorship.childId.lastName}
                </p>
              </div>
            </div>
            
            <div className="p-6 space-y-2">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Banknote className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {sponsorship.amount.toLocaleString()} {sponsorship.currency}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {getFrequencyText(sponsorship.frequency)}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  {text.since}: {new Date(sponsorship.startDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="bg-muted/50 px-6 py-3 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(sponsorship)}>
              <Edit className="h-4 w-4 mr-1" /> {text.edit}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(sponsorship.id)}>
              <Trash2 className="h-4 w-4 mr-1" /> {text.delete}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SponsorshipGrid;
