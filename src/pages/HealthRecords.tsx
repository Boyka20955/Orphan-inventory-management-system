import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import HealthRecordsList from "@/components/health/HealthRecordsList";
import HealthRecordFormModal from "@/components/health/HealthRecordFormModal";
import ChildSelector from "@/components/health/ChildSelector";
import { ApiHealthRecord, ApiChild, UIHealthRecord, UIChild, mapApiHealthRecordToUIHealthRecord, mapApiChildToUIChild } from "@/types/common";
import {Child, HealthRecord } from "@/types/";

const HealthRecords = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<HealthRecord[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<HealthRecord | null>(null);
  const [view, setView] = useState('list');

  const translations = {
    en: {
      healthRecords: "Health Records",
      addRecord: "Add Health Record",
      listView: "List View",
      gridView: "Grid View",
      allChildren: "All Children",
      noRecords: "No health records found",
      addRecordDescription: "Click the button above to add health records"
    },
    sw: {
      healthRecords: "Rekodi za Afya",
      addRecord: "Ongeza Rekodi ya Afya",
      listView: "Mwonekano wa Orodha",
      gridView: "Mwonekano wa Gridi",
      allChildren: "Watoto Wote",
      noRecords: "Hakuna rekodi za afya zilizopatikana",
      addRecordDescription: "Bofya kitufe hapo juu kuongeza rekodi za afya"
    }
  };

  const text = translations[language as keyof typeof translations];

  const fetchData = async () => {
    await Promise.all([
      fetchHealthRecords(),
      fetchChildren()
    ]);
  };

  const fetchHealthRecords = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/health-records');
      const apiRecords: any[] = Array.isArray(response.data) ? response.data : [];
      // Map ApiHealthRecord to HealthRecord for consistency
      const transformedRecords: HealthRecord[] = apiRecords.map(record => ({
        id: record._id,
        childId: record.childId,
        type: record.recordType,
        date: record.date,
        description: record.description,
        doctor: record.doctor || "",
        hospital: record.hospital || "",
        cost: record.cost,
        disease: record.disease || "",
        treatment: record.treatment || "",
        debt: record.debt,
        notes: record.notes || "",
        isPaid: record.isPaid || false,
      }));
      setRecords(transformedRecords);
      setFilteredRecords(transformedRecords);
    } catch (error) {
      console.error('Error fetching health records:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch health records",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChildren = async () => {
    try {
      const response = await axios.get('/api/children');
      const apiChildren: ApiChild[] = Array.isArray(response.data) ? response.data : [];
      const transformedChildren = apiChildren.map(mapApiChildToUIChild);
      setChildren(transformedChildren);
    } catch (error) {
      console.error('Error fetching children:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch children",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedChildId) {
      setFilteredRecords(records.filter(record => record.childId === selectedChildId));
    } else {
      setFilteredRecords(records);
    }
  }, [selectedChildId, records]);


  const handleAddRecord = () => {
    const newRecord: HealthRecord = {
      id: '',
      childId: selectedChildId || '',
      type: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      doctor: '',
      hospital: '',
      cost: 0,
      disease: '',
      treatment: '',
      debt: 0,
      notes: '',
      isPaid: false,
    };
    setCurrentRecord(newRecord);
    setIsModalOpen(true);
  };

  const handleEditRecord = (record: UIHealthRecord) => {
    // Convert UIHealthRecord to HealthRecord for editing
    const healthRecord: HealthRecord = {
      id: record.id,
      childId: record.childId,
      type: record.recordType,
      date: record.date,
      description: record.description,
      doctor: record.doctor || "",
      hospital: record.hospital || "",
      cost: record.cost,
      disease: record.disease || "",
      treatment: record.treatment || "",
      debt: record.debt,
      notes: record.notes || "",
      isPaid: record.isPaid,
    };
    setCurrentRecord(healthRecord);
    setIsModalOpen(true);
  };

  const handleDeleteRecord = async (recordId: string) => {
    try {
      await axios.delete(`/api/health-records/${recordId}`);
      toast({
        title: "Record Deleted",
        description: "Health record has been successfully deleted",
      });
      fetchHealthRecords();
    } catch (error) {
      console.error('Error deleting health record:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete health record",
      });
    }
  };

  const handleSaveRecord = async (recordData: HealthRecord) => {
    try {
      // Map "type" to "recordType" for backend compatibility
      const apiData = {
        childId: recordData.childId,
        recordType: recordData.type,
        date: recordData.date,
        description: recordData.description,
        doctor: recordData.doctor,
        hospital: recordData.hospital,
        cost: recordData.cost,
        disease: recordData.disease,
        treatment: recordData.treatment,
        debt: recordData.debt,
        notes: recordData.notes,
        isPaid: recordData.isPaid,
      };
      
      if (currentRecord && currentRecord.id) {
        await axios.put(`/api/health-records/${currentRecord.id}`, apiData);
        toast({
          title: "Record Updated",
          description: "Health record has been successfully updated",
        });
      } else {
        await axios.post('/api/health-records', apiData);
        toast({
          title: "Record Added",
          description: "New health record has been successfully added",
        });
      }
      setIsModalOpen(false);
      fetchHealthRecords();
    } catch (error) {
      console.error('Error saving health record:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save health record",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{text.healthRecords}</h1>
        <Button onClick={handleAddRecord}>
          <Plus className="mr-2 h-4 w-4" /> {text.addRecord}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="w-full md:w-1/3">
          <ChildSelector 
            children={children}
            selectedChildId={selectedChildId}
            onSelect={setSelectedChildId}  
            includeAll={true}
            allChildrenLabel={text.allChildren}
          />
        </div>
        <div className="md:ml-auto">
          <Tabs value={view} onValueChange={setView}>
            <TabsList>
              <TabsTrigger 
                value="list"
                className={view === 'list' ? "bg-primary text-white" : ""}
              >
                {text.listView}
              </TabsTrigger>
              <TabsTrigger 
                value="grid"
                className={view === 'grid' ? "bg-primary text-white" : ""}
              >
                {text.gridView}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Loading...</p>
        </div>
      ) : filteredRecords.length > 0 ? (
        <HealthRecordsList
          records={filteredRecords as any} // Cast to any to avoid type mismatch
          showChildName={true}
          onEditRecord={handleEditRecord as any} // Cast to any to avoid type mismatch
          onDeleteRecord={handleDeleteRecord}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <p className="text-xl text-muted-foreground">{text.noRecords}</p>
          <p className="text-sm text-muted-foreground mt-2">{text.addRecordDescription}</p>
        </div>
      )}

      {isModalOpen && (
        <HealthRecordFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          children={children}
          record={currentRecord}
          onSave={handleSaveRecord}
        />
      )}
    </div>
  );
};

export default HealthRecords;
