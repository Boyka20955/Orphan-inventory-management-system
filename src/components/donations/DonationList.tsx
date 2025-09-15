
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, MoreVertical, Trash } from "lucide-react";
import { format } from "date-fns";
import { Donation } from "@/types";

// Sample data (would come from API in a real app)
const sampleDonations: Donation[] = [
  {
    id: "1",
    donorType: "person",
    firstName: "John",
    lastName: "Smith",
    date: "2023-06-15",
    amount: 5000,
    currency: "USD",
    type: "monetary",
    purpose: "General support",
    notes: "Annual donation",
  },
  {
    id: "2",
    donorType: "organization",
    organizationName: "ABC Foundation",
    date: "2023-07-20",
    amount: 1200,
    currency: "USD",
    type: "monetary",
    purpose: "Education fund",
  },
  {
    id: "3",
    donorType: "person",
    firstName: "Maria",
    lastName: "Garcia",
    date: "2023-08-05",
    amount: 3500,
    currency: "USD",
    type: "monetary",
    purpose: "Medical supplies",
    notes: "For the health center",
  },
];

interface DonationListProps {
  onEdit: (donation: Donation) => void;
  onDelete: (id: string) => void;
  customDonations?: any[];
}

const DonationList: React.FC<DonationListProps> = ({ onEdit, onDelete, customDonations = [] }) => {
  const { toast } = useToast();
  const [donations, setDonations] = useState<Donation[]>(sampleDonations);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [donationToDelete, setDonationToDelete] = useState<string | null>(null);

  // Combine sample and custom donations
  const allDonations = [...donations, ...customDonations];

  const handleDelete = (id: string) => {
    setDonationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (donationToDelete) {
      // If it's a custom donation, call the parent's onDelete handler
      const isCustomDonation = customDonations.some(d => d.id === donationToDelete);
      
      if (isCustomDonation) {
        onDelete(donationToDelete);
      } else {
        // Otherwise, update local state
        setDonations(donations.filter(d => d.id !== donationToDelete));
        toast({
          title: "Donation deleted",
          description: "The donation has been successfully removed.",
        });
      }
      
      setDeleteDialogOpen(false);
      setDonationToDelete(null);
    }
  };

  // Helper function to get donor name
  const getDonorName = (donation: Donation): string => {
    if (donation.donorType === 'organization') {
      return donation.organizationName || "Unknown Organization";
    } else {
      return `${donation.firstName || ""} ${donation.lastName || ""}`.trim() || "Unknown";
    }
  };

  return (
    <>
      <Table>
        <TableCaption>List of monetary donations</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Donor</TableHead>
            <TableHead>Donor Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allDonations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                No donations found. Add your first donation.
              </TableCell>
            </TableRow>
          ) : (
            allDonations.map((donation) => (
              <TableRow key={donation.id}>
                <TableCell>
                  {format(new Date(donation.date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>{getDonorName(donation)}</TableCell>
                <TableCell className="capitalize">{donation.donorType || "person"}</TableCell>
                <TableCell>
                  <Badge>{donation.currency} {donation.amount.toLocaleString()}</Badge>
                </TableCell>
                <TableCell>{donation.purpose}</TableCell>
                <TableCell>{donation.notes || "-"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(donation)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive" 
                        onClick={() => handleDelete(donation.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the donation record. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DonationList;
