
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
import { Sponsorship } from "@/types";

// Sample sponsorships data
const sampleSponsorships: Sponsorship[] = [
  {
    id: "s1",
    donorType: "person",
    firstName: "John",
    lastName: "Smith",
    childId: "c1",
    childName: "James Wilson",
    startDate: "2023-01-15",
    amount: 100,
    frequency: 'monthly',
    status: 'active',
  },
  {
    id: "s2",
    donorType: "organization",
    organizationName: "ABC Foundation",
    childId: "c2",
    childName: "Emma Thompson",
    startDate: "2022-11-10",
    amount: 1200,
    frequency: 'annually',
    notes: "Includes extra for school supplies",
    status: 'active',
  },
  {
    id: "s3",
    donorType: "person",
    firstName: "Maria",
    lastName: "Garcia",
    childId: "c3",
    childName: "Michael Brown",
    startDate: "2023-02-05",
    endDate: "2023-08-05",
    amount: 300,
    frequency: 'quarterly',
    notes: "Sponsor relocated",
    status: 'ended',
  },
];

interface SponsoredChildrenListProps {
  onEdit: (sponsorship: Sponsorship) => void;
  onDelete: (id: string) => void;
  customSponsorships?: any[];
}

const SponsoredChildrenList: React.FC<SponsoredChildrenListProps> = ({ 
  onEdit, 
  onDelete, 
  customSponsorships = [] 
}) => {
  const { toast } = useToast();
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>(sampleSponsorships);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sponsorshipToDelete, setSponsorshipToDelete] = useState<string | null>(null);

  // Combine sample and custom sponsorships
  const allSponsorships = [...sponsorships, ...customSponsorships];

  const handleDelete = (id: string) => {
    setSponsorshipToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (sponsorshipToDelete) {
      // Check if it's a custom sponsorship
      const isCustomSponsorship = customSponsorships.some(s => s.id === sponsorshipToDelete);
      
      if (isCustomSponsorship) {
        onDelete(sponsorshipToDelete);
      } else {
        setSponsorships(sponsorships.filter(s => s.id !== sponsorshipToDelete));
        toast({
          title: "Sponsorship deleted",
          description: "The sponsorship record has been successfully removed.",
        });
      }
      
      setDeleteDialogOpen(false);
      setSponsorshipToDelete(null);
    }
  };

  // Helper function to get donor name
  const getDonorName = (sponsorship: Sponsorship): string => {
    if (sponsorship.donorType === 'organization') {
      return sponsorship.organizationName || "Unknown Organization";
    } else {
      return `${sponsorship.firstName || ""} ${sponsorship.lastName || ""}`.trim() || "Unknown";
    }
  };

  // Helper function to get child name
  const getChildName = (sponsorship: Sponsorship): string => {
    if (sponsorship.childName) {
      return sponsorship.childName;
    } else if (sponsorship.childFirstName && sponsorship.childLastName) {
      return `${sponsorship.childFirstName} ${sponsorship.childLastName}`;
    }
    return "Unknown Child";
  };

  return (
    <>
      <Table>
        <TableCaption>List of sponsored children</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Child</TableHead>
            <TableHead>Sponsor</TableHead>
            <TableHead>Sponsor Type</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allSponsorships.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6">
                No sponsorships found. Add your first child sponsorship.
              </TableCell>
            </TableRow>
          ) : (
            allSponsorships.map((sponsorship) => (
              <TableRow key={sponsorship.id}>
                <TableCell>{getChildName(sponsorship)}</TableCell>
                <TableCell>{getDonorName(sponsorship)}</TableCell>
                <TableCell className="capitalize">{sponsorship.donorType || "person"}</TableCell>
                <TableCell>{format(new Date(sponsorship.startDate), "MMM d, yyyy")}</TableCell>
                <TableCell>${sponsorship.amount}</TableCell>
                <TableCell className="capitalize">{sponsorship.frequency}</TableCell>
                <TableCell>
                  <Badge variant={sponsorship.status === 'active' ? 'default' : 'outline'}>
                    {sponsorship.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(sponsorship)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive" 
                        onClick={() => handleDelete(sponsorship.id)}
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
              This will permanently delete the sponsorship record. This action cannot be undone.
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

export default SponsoredChildrenList;
