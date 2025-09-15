
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import ClothingItemFormModal from "@/components/inventory/ClothingItemFormModal";
import ClothingItemsGrid from "@/components/inventory/ClothingItemsGrid";
import ClothingItemsTable from "@/components/inventory/ClothingItemsTable";
import { ApiChild, ApiClothingItem, UIChild, UIClothingItem, mapApiClothingItemToUIClothingItem, mapUIClothingItemToApiClothingItem, mapApiChildToUIChild } from "@/types/common";
import { ClothingItem, Child } from "@/types";

// Helper function to convert UIClothingItem to the expected ClothingItem format for the components
const convertToComponentClothingItem = (item: UIClothingItem): ClothingItem => {
  return {
    id: item.id,
    name: item.name,
    category: item.type, // Map type to category
    type: item.type,
    size: item.size,
    gender: item.gender,
    quantity: item.quantity,
    condition: item.condition,
    ageRange: item.ageGroup,
    notes: item.notes,
    assignedTo: item.assignedTo || []
  };
};

// Helper function to convert from component format to UIClothingItem
const convertFromComponentClothingItem = (item: ClothingItem): UIClothingItem => {
  const uiItem: UIClothingItem = {
    id: item.id,
    name: item.name,
    type: item.type || item.category,
    size: item.size,
    gender: item.gender,
    ageGroup: item.ageRange || '',
    quantity: item.quantity,
    condition: item.condition,
    notes: item.notes
  };
  
  if (item.assignedTo) {
    uiItem.assignedTo = item.assignedTo;
  }
  
  return uiItem;
};

// Helper function to convert ApiChild to the expected Child format for components
const convertApiChildToComponentChild = (child: ApiChild): Child => {
  const uiChild = mapApiChildToUIChild(child);
  return {
    id: uiChild.id,
    firstName: uiChild.firstName,
    lastName: uiChild.lastName,
    dateOfBirth: uiChild.dateOfBirth,
    gender: uiChild.gender,
    dateAdmitted: uiChild.dateAdmitted || new Date().toISOString().split('T')[0],
    status: uiChild.status || 'active',
    guardianInfo: uiChild.guardianInfo
  };
};

const ClothingInventory = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [clothingItems, setClothingItems] = useState<UIClothingItem[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<UIClothingItem | null>(null);
  const [view, setView] = useState('grid');

  const translations = {
    en: {
      clothingInventory: "Clothing Inventory",
      addItem: "Add Clothing Item",
      gridView: "Grid View",
      tableView: "Table View",
      noItems: "No clothing items found",
      addItemDescription: "Click the button above to add clothing items to the inventory"
    },
    sw: {
      clothingInventory: "Hifadhi ya Mavazi",
      addItem: "Ongeza Vazi",
      gridView: "Mwonekano wa Gridi",
      tableView: "Mwonekano wa Jedwali",
      noItems: "Hakuna vifaa vya mavazi vilivyopatikana",
      addItemDescription: "Bofya kitufe hapo juu kuongeza vifaa vya mavazi kwenye hifadhi"
    }
  };

  const text = translations[language as keyof typeof translations];

  // Fetch clothing items and children
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [itemsResponse, childrenResponse] = await Promise.all([
        axios.get('/api/inventory/clothing'),
        axios.get('/api/children')
      ]);
      
      // Transform API data to match our frontend types
      const apiItemsData: ApiClothingItem[] = Array.isArray(itemsResponse.data) ? itemsResponse.data : [];
      const transformedData = apiItemsData.map(mapApiClothingItemToUIClothingItem);
      setClothingItems(transformedData);
      
      // Transform children data
      const childrenData: ApiChild[] = Array.isArray(childrenResponse.data) ? childrenResponse.data : [];
      const transformedChildren = childrenData.map(convertApiChildToComponentChild);
      setChildren(transformedChildren);
      
    } catch (error) {
      console.error('Error fetching clothing items:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch clothing inventory",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddItem = () => {
    setCurrentItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: UIClothingItem) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleAssignItem = (item: UIClothingItem) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await axios.delete(`/api/inventory/clothing/${itemId}`);
      toast({
        title: "Item Deleted",
        description: "Clothing item has been successfully deleted",
      });
      fetchData(); // Refresh the list
    } catch (error) {
      console.error('Error deleting clothing item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete clothing item",
      });
    }
  };

  const handleSaveItem = async (itemData: ClothingItem) => {
    try {
      // Convert from component ClothingItem to UIClothingItem before saving
      const uiItemData = convertFromComponentClothingItem(itemData);
      const apiItemData = mapUIClothingItemToApiClothingItem(uiItemData);
      
      if (currentItem) {
        // Update existing item
        await axios.put(`/api/inventory/clothing/${currentItem.id}`, apiItemData);
        toast({
          title: "Item Updated",
          description: "Clothing item has been successfully updated",
        });
      } else {
        // Create new item
        await axios.post('/api/inventory/clothing', apiItemData);
        toast({
          title: "Item Added",
          description: "New clothing item has been successfully added",
        });
      }
      setIsModalOpen(false);
      fetchData(); // Refresh the list
    } catch (error) {
      console.error('Error saving clothing item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save clothing item",
      });
    }
  };

  // Convert items for component consumption
  const componentClothingItems = clothingItems.map(convertToComponentClothingItem);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{text.clothingInventory}</h1>
        <Button onClick={handleAddItem}>
          <Plus className="mr-2 h-4 w-4" /> {text.addItem}
        </Button>
      </div>

      <Tabs defaultValue={view} value={view} onValueChange={setView} className="w-full">
        <TabsList>
          <TabsTrigger value="grid">{text.gridView}</TabsTrigger>
          <TabsTrigger value="table">{text.tableView}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : clothingItems.length > 0 ? (
            <ClothingItemsGrid 
              items={componentClothingItems}
              onEdit={(item) => {
                const uiItem = clothingItems.find(i => i.id === item.id);
                if (uiItem) {
                  handleEditItem(uiItem);
                }
              }} 
              onDelete={handleDeleteItem}
              onAssign={(item) => {
                const uiItem = clothingItems.find(i => i.id === item.id);
                if (uiItem) {
                  handleAssignItem(uiItem);
                }
              }}
              children={children}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
              <p className="text-xl text-muted-foreground">{text.noItems}</p>
              <p className="text-sm text-muted-foreground mt-2">{text.addItemDescription}</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="table" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : clothingItems.length > 0 ? (
            <ClothingItemsTable 
              items={componentClothingItems}
              onEdit={(item) => {
                const uiItem = clothingItems.find(i => i.id === item.id);
                if (uiItem) {
                  handleEditItem(uiItem);
                }
              }} 
              onDelete={handleDeleteItem}
              onAssign={(item) => {
                const uiItem = clothingItems.find(i => i.id === item.id);
                if (uiItem) {
                  handleAssignItem(uiItem);
                }
              }}
              children={children}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
              <p className="text-xl text-muted-foreground">{text.noItems}</p>
              <p className="text-sm text-muted-foreground mt-2">{text.addItemDescription}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {isModalOpen && (
        <ClothingItemFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveItem}
          item={currentItem ? convertToComponentClothingItem(currentItem) : null}
        />
      )}
    </div>
  );
};

export default ClothingInventory;
