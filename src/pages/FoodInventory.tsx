
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import FoodItemFormModal from "@/components/inventory/FoodItemFormModal";
import FoodItemsTable from "@/components/inventory/FoodItemsTable";
import { ApiFoodItem, UIFoodItem, mapApiFoodItemToUIFoodItem, mapUIFoodItemToApiFoodItem } from "@/types/common";
import { FoodItem } from "@/types";

// Helper function to convert UIFoodItem to the expected FoodItem format for the component
const convertToComponentFoodItem = (item: UIFoodItem): FoodItem => {
  return {
    ...item,
    status: item.status || 'normal',
    dateReceived: item.dateReceived || new Date().toISOString().split('T')[0]
  };
};

// Helper function to convert from component format to UIFoodItem
const convertFromComponentFoodItem = (item: FoodItem): UIFoodItem => {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    unit: item.unit,
    expiryDate: item.expiryDate,
    dateReceived: item.dateReceived,
    supplier: item.supplier,
    status: item.status
  };
};

const FoodInventory = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [foodItems, setFoodItems] = useState<UIFoodItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<UIFoodItem | null>(null);

  const translations = {
    en: {
      foodInventory: "Food Inventory",
      addItem: "Add Food Item",
      noItems: "No food items found",
      addItemDescription: "Click the button above to add food items to the inventory"
    },
    sw: {
      foodInventory: "Hifadhi ya Chakula",
      addItem: "Ongeza Chakula",
      noItems: "Hakuna vifaa vya chakula vilivyopatikana",
      addItemDescription: "Bofya kitufe hapo juu kuongeza vifaa vya chakula kwenye hifadhi"
    }
  };

  const text = translations[language as keyof typeof translations];

  // Fetch food items from API
  const fetchFoodItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/inventory/food');
      
      // Transform API data to match our frontend types
      const apiData: ApiFoodItem[] = Array.isArray(response.data) ? response.data : [];
      const transformedData = apiData.map(mapApiFoodItemToUIFoodItem);
      
      setFoodItems(transformedData);
    } catch (error) {
      console.error('Error fetching food items:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch food inventory",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const handleAddItem = () => {
    setCurrentItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: UIFoodItem) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await axios.delete(`/api/inventory/food/${itemId}`);
      toast({
        title: "Item Deleted",
        description: "Food item has been successfully deleted",
      });
      fetchFoodItems(); // Refresh the list
    } catch (error) {
      console.error('Error deleting food item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete food item",
      });
    }
  };

  const handleSaveItem = async (itemData: FoodItem) => {
    try {
      // Convert from component FoodItem to UIFoodItem before mapping to API format
      const uiItemData = convertFromComponentFoodItem(itemData);
      const apiItemData = mapUIFoodItemToApiFoodItem(uiItemData);
      
      if (currentItem) {
        // Update existing item
        await axios.put(`/api/inventory/food/${currentItem.id}`, apiItemData);
        toast({
          title: "Item Updated",
          description: "Food item has been successfully updated",
        });
      } else {
        // Create new item
        await axios.post('/api/inventory/food', apiItemData);
        toast({
          title: "Item Added",
          description: "New food item has been successfully added",
        });
      }
      setIsModalOpen(false);
      fetchFoodItems(); // Refresh the list
    } catch (error) {
      console.error('Error saving food item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save food item",
      });
    }
  };

  // Convert items for component use
  const componentFoodItems = foodItems.map(convertToComponentFoodItem);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{text.foodInventory}</h1>
        <Button onClick={handleAddItem}>
          <Plus className="mr-2 h-4 w-4" /> {text.addItem}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : foodItems.length > 0 ? (
        <FoodItemsTable 
          items={componentFoodItems} 
          onEdit={(item) => {
            const uiItem = foodItems.find(i => i.id === item.id);
            if (uiItem) {
              handleEditItem(uiItem);
            }
          }}
          onDelete={handleDeleteItem} 
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-80 border-2 border-dashed rounded-lg">
          <p className="text-xl text-muted-foreground">{text.noItems}</p>
          <p className="text-sm text-muted-foreground mt-2">{text.addItemDescription}</p>
        </div>
      )}

      {isModalOpen && (
        <FoodItemFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveItem}
          item={currentItem ? convertToComponentFoodItem(currentItem) : null}
        />
      )}
    </div>
  );
};

export default FoodInventory;
