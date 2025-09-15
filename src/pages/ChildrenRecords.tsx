
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import ChildFormModal from "@/components/children/ChildFormModal";
import ChildrenList from "@/components/children/ChildrenList";
import ChildrenGrid from "@/components/children/ChildrenGrid";
import { ApiChild, UIChild, mapApiChildToUIChild, mapUIChildToApiChild } from "@/types/common";

const ChildrenRecords = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [children, setChildren] = useState<UIChild[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentChild, setCurrentChild] = useState<UIChild | null>(null);
  const [view, setView] = useState("list");

  const translations = {
    en: {
      childrenRecords: "Children Records",
      addChild: "Add Child",
      listView: "List View",
      gridView: "Grid View",
      noRecordsFound: "No children records found",
      addChildDescription: "Click the button above to add a new child record"
    },
    sw: {
      childrenRecords: "Rekodi za Watoto",
      addChild: "Ongeza Mtoto",
      listView: "Mwonekano wa Orodha",
      gridView: "Mwonekano wa Gridi",
      noRecordsFound: "Hakuna rekodi za watoto zilizopatikana",
      addChildDescription: "Bofya kitufe hapo juu kuongeza rekodi mpya ya mtoto"
    }
  };

  const text = translations[language as keyof typeof translations];

  const fetchChildren = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/children');
      
      const apiData: ApiChild[] = Array.isArray(response.data) ? response.data : [];
      const transformedData = apiData.map(mapApiChildToUIChild);
      setChildren(transformedData);
    } catch (error) {
      console.error('Error fetching children:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch children records",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const handleAddChild = () => {
    setCurrentChild(null);
    setIsModalOpen(true);
  };

  const handleEditChild = (child: UIChild) => {
    setCurrentChild(child);
    setIsModalOpen(true);
  };

  const handleDeleteChild = async (id: string) => {
    try {
      await axios.delete(`/api/children/${id}`);
      toast({
        title: "Child Deleted",
        description: "Child record has been successfully deleted",
      });
      fetchChildren();
    } catch (error) {
      console.error('Error deleting child:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete child record",
      });
    }
  };

  const handleSaveChild = async (childData: UIChild) => {
    try {
      const apiChildData = mapUIChildToApiChild(childData);
      
      if (currentChild) {
        await axios.put(`/api/children/${currentChild.id}`, apiChildData);
        toast({
          title: "Child Updated",
          description: "Child record has been successfully updated",
        });
      } else {
        await axios.post('/api/children', apiChildData);
        toast({
          title: "Child Added",
          description: "New child record has been successfully added",
        });
      }
      setIsModalOpen(false);
      fetchChildren();
    } catch (error) {
      console.error('Error saving child:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save child record",
      });
    }
  };

  const handleViewProfile = (child: UIChild) => {
    handleEditChild(child);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{text.childrenRecords}</h1>
        <Button onClick={handleAddChild}>
          <Plus className="mr-2 h-4 w-4" /> {text.addChild}
        </Button>
      </div>

      <Tabs defaultValue={view} value={view} onValueChange={setView} className="w-full">
        <TabsList>
          <TabsTrigger value="list">{text.listView}</TabsTrigger>
          <TabsTrigger value="grid">{text.gridView}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : children.length > 0 ? (
            <ChildrenList
              children={children}
              onViewProfile={handleViewProfile}
              onEditChild={handleEditChild}
              onDeleteChild={(child) => handleDeleteChild(child.id)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
              <p className="text-xl text-muted-foreground">{text.noRecordsFound}</p>
              <p className="text-sm text-muted-foreground mt-2">{text.addChildDescription}</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="grid" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : children.length > 0 ? (
            <ChildrenGrid
              children={children}
              onViewProfile={handleViewProfile}
              onEditChild={handleEditChild}
              onDeleteChild={(child) => handleDeleteChild(child.id)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
              <p className="text-xl text-muted-foreground">{text.noRecordsFound}</p>
              <p className="text-sm text-muted-foreground mt-2">{text.addChildDescription}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {isModalOpen && (
        <ChildFormModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveChild}
          child={currentChild}
        />
      )}
    </div>
  );
};

export default ChildrenRecords;
