
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Child } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, User, Clock, FileClock, Users } from "lucide-react";

interface ChildProfileModalProps {
  child: Child | null;
  isOpen: boolean;
  onClose: () => void;
}

const ChildProfileModal = ({ child, isOpen, onClose }: ChildProfileModalProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!child) return null;

  // Calculate age from birthdate
  const calculateAge = (birthdate: string) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'adopted':
        return 'bg-blue-100 text-blue-800';
      case 'transferred':
        return 'bg-amber-100 text-amber-800';
      case 'graduated':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const timeSince = (date: string) => {
    const dateObj = new Date(date);
    const now = new Date();
    
    const yearDiff = now.getFullYear() - dateObj.getFullYear();
    const monthDiff = now.getMonth() - dateObj.getMonth();
    
    if (yearDiff > 0) {
      return `${yearDiff} ${yearDiff === 1 ? 'year' : 'years'}`;
    } else if (monthDiff > 0) {
      return `${monthDiff} ${monthDiff === 1 ? 'month' : 'months'}`;
    } else {
      const dayDiff = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
      return `${dayDiff} ${dayDiff === 1 ? 'day' : 'days'}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-bold">
                {child.firstName} {child.lastName}
              </DialogTitle>
              <DialogDescription className="mt-1 text-base">
                ID: {child.id} • {calculateAge(child.dateOfBirth)} years old
              </DialogDescription>
            </div>
            <Badge className={`${getStatusColor(child.status)} capitalize text-sm`}>
              {child.status}
            </Badge>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="mt-4" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="font-medium">Gender:</span>
                  <span className="ml-2 capitalize">{child.gender}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="font-medium">Date of Birth:</span>
                  <span className="ml-2">{formatDate(child.dateOfBirth)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="font-medium">Date Admitted:</span>
                  <span className="ml-2">{formatDate(child.dateAdmitted)}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FileClock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="font-medium">Time at Orphanage:</span>
                  <span className="ml-2">{timeSince(child.dateAdmitted)}</span>
                </div>
                <div className="flex items-start">
                  <Users className="h-5 w-5 mr-2 mt-1 text-muted-foreground" />
                  <span className="font-medium">Guardian Info:</span>
                  <span className="ml-2">{child.guardianInfo || "Not available"}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-medium mb-3">Background Information</h3>
              <p className="text-muted-foreground">
                {child.guardianInfo || "No additional background information available."}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/50">
              <p className="text-center text-muted-foreground">Health records will be available here.</p>
            </div>
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/50">
              <p className="text-center text-muted-foreground">Education records will be available here.</p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChildProfileModal;
