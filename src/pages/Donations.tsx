
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import DonationTable from "@/components/donations/DonationTable";
import DonationGrid from "@/components/donations/DonationGrid";
import SponsorshipTable from "@/components/donations/SponsorshipTable";
import SponsorshipGrid from "@/components/donations/SponsorshipGrid";
import DonationFormModal from "@/components/donations/DonationFormModal";
import SponsorshipFormModal from "@/components/donations/SponsorshipFormModal";
import { ApiDonation, ApiSponsorship, ApiChild, UIDonation, UISponsorship, UIChild, mapApiDonationToUIDonation, mapUIDonationToApiDonation, mapApiSponsorshipToUISponsorship, mapUISponsorshipToApiSponsorship, mapApiChildToUIChild } from "@/types/common";
import { Donation, Sponsorship, Child } from "@/types";

// Helper function to convert our UIDonation type to the component's expected Donation type
const convertToComponentDonation = (donation: UIDonation): Donation => {
  return {
    id: donation.id,
    donorId: donation.id,
    donorName: donation.donorName,
    date: donation.date,
    amount: donation.amount,
    currency: donation.currency,
    type: donation.type,
    purpose: donation.purpose || '',
    notes: donation.notes
  };
};

// Helper function to convert component Donation type to our UIDonation type
const convertFromComponentDonation = (donation: Donation): UIDonation => {
  return {
    id: donation.id,
    donorName: donation.donorName || '',
    date: donation.date,
    amount: donation.amount,
    currency: donation.currency,
    type: donation.type,
    purpose: donation.purpose,
    notes: donation.notes
  };
};

// Helper function to convert our UISponsorship type to the component's expected Sponsorship type
const convertToComponentSponsorship = (sponsorship: UISponsorship): Sponsorship => {
  return {
    id: sponsorship.id,
    donorId: sponsorship.id,
    donorName: sponsorship.donorName,
    childId: sponsorship.childId,
    childName: sponsorship.childName,
    startDate: sponsorship.startDate,
    endDate: sponsorship.endDate,
    amount: sponsorship.amount,
    frequency: sponsorship.frequency,
    notes: sponsorship.notes,
    status: sponsorship.status
  };
};

// Helper function to convert component Sponsorship type to our UISponsorship type
const convertFromComponentSponsorship = (sponsorship: Sponsorship): UISponsorship => {
  return {
    id: sponsorship.id,
    donorName: sponsorship.donorName || '',
    childId: sponsorship.childId,
    childName: sponsorship.childName || '',
    startDate: sponsorship.startDate,
    endDate: sponsorship.endDate,
    amount: sponsorship.amount,
    frequency: sponsorship.frequency,
    notes: sponsorship.notes,
    status: sponsorship.status
  };
};

// Convert ApiChild to Child format
const convertApiChildToChild = (apiChild: ApiChild): Child => {
  const uiChild = mapApiChildToUIChild(apiChild);
  return {
    id: uiChild.id,
    firstName: uiChild.firstName,
    lastName: uiChild.lastName,
    dateOfBirth: uiChild.dateOfBirth,
    gender: uiChild.gender,
    dateAdmitted: uiChild.dateAdmitted || '',
    status: uiChild.status,
    guardianInfo: uiChild.guardianInfo
  };
};

const Donations = () => {
  const [donations, setDonations] = useState<UIDonation[]>([]);
  const [sponsorships, setSponsorships] = useState<UISponsorship[]>([]);
  const [isDonationLoading, setIsDonationLoading] = useState(false);
  const [isSponsorshipLoading, setIsSponsorshipLoading] = useState(false);
  const [donationView, setDonationView] = useState("grid");
  const [sponsorshipView, setSponsorshipView] = useState("grid");
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isSponsorshipModalOpen, setIsSponsorshipModalOpen] = useState(false);
  const [currentDonation, setCurrentDonation] = useState<UIDonation | null>(null);
  const [currentSponsorship, setCurrentSponsorship] = useState<UISponsorship | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  
  const { language } = useLanguage();
  const { toast } = useToast();

  const translations = {
    en: {
      donations: "Donations",
      monetaryDonations: "Monetary Donations",
      sponsoredChildren: "Sponsored Children",
      addDonation: "Add Donation",
      addSponsorship: "Add Sponsorship",
      grid: "Grid View",
      table: "Table View"
    },
    sw: {
      donations: "Michango",
      monetaryDonations: "Michango ya Kifedha",
      sponsoredChildren: "Watoto Waliodhaminiwa",
      addDonation: "Ongeza Mchango",
      addSponsorship: "Ongeza Udhamini",
      grid: "Mwonekano wa Gridi",
      table: "Mwonekano wa Jedwali"
    }
  };

  const text = translations[language as keyof typeof translations];

  const fetchData = async () => {
    await Promise.all([
      fetchDonations(),
      fetchSponsorships(),
      fetchChildren()
    ]);
  };

  const fetchDonations = async () => {
    try {
      setIsDonationLoading(true);
      const response = await axios.get('/api/donations');
      
      const apiDonations: ApiDonation[] = Array.isArray(response.data) ? response.data : [];
      const transformedDonations = apiDonations.map(mapApiDonationToUIDonation);
      setDonations(transformedDonations);
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch donations",
      });
    } finally {
      setIsDonationLoading(false);
    }
  };

  const fetchSponsorships = async () => {
    try {
      setIsSponsorshipLoading(true);
      const response = await axios.get('/api/donations/sponsorships');
      
      // Ensure we have the children data first
      const childrenData = await fetchChildren();
      
      const apiSponsorships: ApiSponsorship[] = Array.isArray(response.data) ? response.data : [];
      const transformedSponsorships = apiSponsorships.map(s => 
        mapApiSponsorshipToUISponsorship(s, new Map(childrenData.map(c => [c.id, c])))
      );
      
      setSponsorships(transformedSponsorships);
    } catch (error) {
      console.error('Error fetching sponsorships:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch sponsorships",
      });
    } finally {
      setIsSponsorshipLoading(false);
    }
  };

  const fetchChildren = async () => {
    try {
      const response = await axios.get('/api/children');
      
      const apiChildren: ApiChild[] = Array.isArray(response.data) ? response.data : [];
      const transformedChildren = apiChildren.map(convertApiChildToChild);
      
      setChildren(transformedChildren);
      return transformedChildren;
    } catch (error) {
      console.error('Error fetching children:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch children",
      });
      return [];
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddDonation = () => {
    setCurrentDonation(null);
    setIsDonationModalOpen(true);
  };

  const handleEditDonation = (donation: UIDonation) => {
    setCurrentDonation(donation);
    setIsDonationModalOpen(true);
  };

  const handleDeleteDonation = async (donationId: string) => {
    try {
      await axios.delete(`/api/donations/${donationId}`);
      toast({
        title: "Donation Deleted",
        description: "The donation has been successfully deleted.",
      });
      fetchDonations();
    } catch (error) {
      console.error('Error deleting donation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete donation",
      });
    }
  };

  const handleSaveDonation = async (donationData: UIDonation) => {
    try {
      const apiData = mapUIDonationToApiDonation(donationData);
      
      if (currentDonation) {
        await axios.put(`/api/donations/${currentDonation.id}`, apiData);
        toast({
          title: "Donation Updated",
          description: "The donation has been successfully updated.",
        });
      } else {
        await axios.post('/api/donations', apiData);
        toast({
          title: "Donation Added",
          description: "The donation has been successfully added.",
        });
      }
      setIsDonationModalOpen(false);
      fetchDonations();
    } catch (error) {
      console.error('Error saving donation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save donation",
      });
    }
  };

  const handleAddSponsorship = () => {
    setCurrentSponsorship(null);
    setIsSponsorshipModalOpen(true);
  };

  const handleEditSponsorship = (sponsorship: UISponsorship) => {
    setCurrentSponsorship(sponsorship);
    setIsSponsorshipModalOpen(true);
  };

  const handleDeleteSponsorship = async (sponsorshipId: string) => {
    try {
      await axios.delete(`/api/donations/sponsorships/${sponsorshipId}`);
      toast({
        title: "Sponsorship Deleted",
        description: "The sponsorship has been successfully deleted.",
      });
      fetchSponsorships();
    } catch (error) {
      console.error('Error deleting sponsorship:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete sponsorship",
      });
    }
  };

  const handleSaveSponsorship = async (sponsorshipData: UISponsorship) => {
    try {
      const apiData = mapUISponsorshipToApiSponsorship(sponsorshipData);
      
      if (currentSponsorship) {
        await axios.put(`/api/donations/sponsorships/${currentSponsorship.id}`, apiData);
        toast({
          title: "Sponsorship Updated",
          description: "The sponsorship has been successfully updated.",
        });
      } else {
        await axios.post('/api/donations/sponsorships', apiData);
        toast({
          title: "Sponsorship Added",
          description: "The sponsorship has been successfully added.",
        });
      }
      setIsSponsorshipModalOpen(false);
      fetchSponsorships();
    } catch (error) {
      console.error('Error saving sponsorship:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save sponsorship",
      });
    }
  };

  // Convert to component-compatible format
  const componentDonations: any[] = donations.map(convertToComponentDonation);
  const componentSponsorships: any[] = sponsorships.map(convertToComponentSponsorship);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{text.donations}</h1>
      </div>

      <Tabs defaultValue="donations" className="w-full">
        <TabsList>
          <TabsTrigger value="donations">{text.monetaryDonations}</TabsTrigger>
          <TabsTrigger value="sponsorships">{text.sponsoredChildren}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="donations" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <TabsList>
                <TabsTrigger 
                  value="grid"
                  onClick={() => setDonationView("grid")}
                  className={donationView === "grid" ? "bg-primary text-white" : ""}
                >
                  {text.grid}
                </TabsTrigger>
                <TabsTrigger 
                  value="table"
                  onClick={() => setDonationView("table")}
                  className={donationView === "table" ? "bg-primary text-white" : ""}
                >
                  {text.table}
                </TabsTrigger>
              </TabsList>
            </div>
            <Button onClick={handleAddDonation}>
              <Plus className="mr-2 h-4 w-4" /> {text.addDonation}
            </Button>
          </div>

          {isDonationLoading ? (
            <div className="flex justify-center py-8">
              <p>Loading...</p>
            </div>
          ) : (
            donationView === "grid" ? (
              <DonationGrid 
                donations={componentDonations}
                onEdit={(donation) => {
                  const uiDonation = donations.find(d => d.id === donation.id);
                  if (uiDonation) {
                    handleEditDonation(uiDonation);
                  }
                }} 
                onDelete={handleDeleteDonation} 
              />
            ) : (
              <DonationTable 
                donations={componentDonations}
                onEdit={(donation) => {
                  const uiDonation = donations.find(d => d.id === donation.id);
                  if (uiDonation) {
                    handleEditDonation(uiDonation);
                  }
                }} 
                onDelete={handleDeleteDonation} 
              />
            )
          )}
        </TabsContent>
        
        <TabsContent value="sponsorships" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <TabsList>
                <TabsTrigger 
                  value="grid"
                  onClick={() => setSponsorshipView("grid")}
                  className={sponsorshipView === "grid" ? "bg-primary text-white" : ""}
                >
                  {text.grid}
                </TabsTrigger>
                <TabsTrigger 
                  value="table"
                  onClick={() => setSponsorshipView("table")}
                  className={sponsorshipView === "table" ? "bg-primary text-white" : ""}
                >
                  {text.table}
                </TabsTrigger>
              </TabsList>
            </div>
            <Button onClick={handleAddSponsorship}>
              <Plus className="mr-2 h-4 w-4" /> {text.addSponsorship}
            </Button>
          </div>
          
          {isSponsorshipLoading ? (
            <div className="flex justify-center py-8">
              <p>Loading...</p>
            </div>
          ) : (
            sponsorshipView === "grid" ? (
              <SponsorshipGrid 
                sponsorships={componentSponsorships}
                onEdit={(sponsorship) => {
                  const uiSponsorship = sponsorships.find(s => s.id === sponsorship.id);
                  if (uiSponsorship) {
                    handleEditSponsorship(uiSponsorship);
                  }
                }} 
                onDelete={handleDeleteSponsorship} 
              />
            ) : (
              <SponsorshipTable 
                sponsorships={componentSponsorships}
                onEdit={(sponsorship) => {
                  const uiSponsorship = sponsorships.find(s => s.id === sponsorship.id);
                  if (uiSponsorship) {
                    handleEditSponsorship(uiSponsorship);
                  }
                }} 
                onDelete={handleDeleteSponsorship} 
              />
            )
          )}
        </TabsContent>
      </Tabs>

      {isDonationModalOpen && (
        <DonationFormModal
          open={isDonationModalOpen}
          onOpenChange={setIsDonationModalOpen}
          donation={currentDonation}
          onSave={handleSaveDonation}
        />
      )}

      {isSponsorshipModalOpen && (
        <SponsorshipFormModal
          open={isSponsorshipModalOpen}
          onOpenChange={setIsSponsorshipModalOpen}
          sponsorship={currentSponsorship}
          children={children}
          onSave={handleSaveSponsorship}
        />
      )}
    </div>
  );
};

export default Donations;
