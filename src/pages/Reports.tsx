
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Child, HealthRecord, FoodItem, ClothingItem, Donation, Sponsorship } from "@/types";
import { format, parse, subMonths, getMonth, getYear } from "date-fns";
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface MonthlyCount {
  month: string;
  active?: number;
  transferred?: number;
  adopted?: number;
  graduated?: number;
  illness?: number;
  checkup?: number;
  vaccination?: number;
  treatment?: number;
  clothing?: number;
  food?: number;
  monetary?: number;
  sponsorships?: number;
}

// Sample data - in a real app this would come from an API or database
const mockChildren: Child[] = [
  {
    id: "1",
    firstName: "James",
    lastName: "Wilson",
    dateOfBirth: "2015-03-12",
    gender: "male",
    dateAdmitted: "2020-05-15",
    status: "active",
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    dateOfBirth: "2017-07-23",
    gender: "female",
    dateAdmitted: "2019-11-30",
    status: "active",
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Brown",
    dateOfBirth: "2016-01-05",
    gender: "male",
    dateAdmitted: "2022-03-10",
    status: "transferred",
  },
  {
    id: "4",
    firstName: "Emma",
    lastName: "Davis",
    dateOfBirth: "2018-09-18",
    gender: "female",
    dateAdmitted: "2021-06-22",
    status: "adopted",
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Miller",
    dateOfBirth: "2014-11-30",
    gender: "male",
    dateAdmitted: "2020-02-15",
    status: "graduated",
  },
];

const mockHealthRecords: HealthRecord[] = [
  {
    id: "hr1",
    childId: "1",
    childFirstName: "James",
    childLastName: "Wilson",
    date: "2023-10-15",
    type: "illness",
    description: "Diagnosed with malaria",
    doctor: "Dr. Kimani",
    isPaid: true,
  },
  {
    id: "hr2",
    childId: "1",
    childFirstName: "James",
    childLastName: "Wilson",
    date: "2023-12-05",
    type: "checkup",
    description: "Routine health checkup",
    doctor: "Dr. Omondi",
    isPaid: true,
  },
  {
    id: "hr3",
    childId: "2",
    childFirstName: "Sarah",
    childLastName: "Johnson",
    date: "2024-01-20",
    type: "illness",
    description: "Admitted with pneumonia",
    doctor: "Dr. Wanjiku",
    isPaid: false,
  },
  {
    id: "hr4",
    childId: "1",
    childFirstName: "James",
    childLastName: "Wilson",
    date: "2024-02-10",
    type: "vaccination",
    description: "MMR booster",
    doctor: "Dr. Kimani",
    isPaid: true,
  },
];

const mockClothingItems: ClothingItem[] = [
  {
    id: "c1",
    name: "T-Shirts",
    category: "tops",
    type: "casual",
    size: "6-8",
    gender: "unisex",
    quantity: 12,
    condition: "new",
    dateReceived: "2023-11-15",
  },
  {
    id: "c2",
    name: "Jeans",
    category: "bottoms",
    type: "casual",
    size: "6-8",
    gender: "unisex",
    quantity: 8,
    condition: "good",
    dateReceived: "2023-12-20",
  },
  {
    id: "c3",
    name: "Sweaters",
    category: "tops",
    type: "winter",
    size: "8-10",
    gender: "unisex",
    quantity: 5,
    condition: "new",
    dateReceived: "2024-01-05",
  },
];

const mockFoodItems: FoodItem[] = [
  {
    id: "1",
    name: "Rice",
    category: "grain",
    quantity: 25,
    unit: "kg",
    expiryDate: "2024-07-15",
    dateReceived: "2023-10-15",
  },
  {
    id: "2",
    name: "Beans",
    category: "protein",
    quantity: 15,
    unit: "kg",
    expiryDate: "2024-08-20",
    dateReceived: "2023-12-01",
  },
  {
    id: "3",
    name: "Milk",
    category: "dairy",
    quantity: 3,
    unit: "ltr",
    expiryDate: "2024-02-25",
    dateReceived: "2024-02-01",
  },
];

const mockDonations: Donation[] = [
  {
    id: "d1",
    donorType: "person",
    firstName: "John",
    lastName: "Doe",
    date: "2023-10-10",
    amount: 500,
    currency: "USD",
    type: "monetary",
    purpose: "General expenses",
  },
  {
    id: "d2",
    donorType: "organization",
    organizationName: "ABC Foundation",
    date: "2023-11-25",
    amount: 1500,
    currency: "USD",
    type: "monetary",
    purpose: "Education",
  },
  {
    id: "d3",
    donorType: "person",
    firstName: "Mary",
    lastName: "Smith",
    date: "2024-01-15",
    amount: 750,
    currency: "USD",
    type: "monetary",
    purpose: "Healthcare",
  },
];

const mockSponsorships: Sponsorship[] = [
  {
    id: "s1",
    donorType: "person",
    firstName: "Robert",
    lastName: "Johnson",
    childId: "1",
    childFirstName: "James",
    childLastName: "Wilson",
    startDate: "2023-09-01",
    amount: 100,
    frequency: "monthly",
    status: "active",
  },
  {
    id: "s2",
    donorType: "organization",
    organizationName: "XYZ Charity",
    childId: "2",
    childFirstName: "Sarah",
    childLastName: "Johnson",
    startDate: "2023-10-15",
    amount: 200,
    frequency: "monthly",
    status: "active",
  },
];

const Reports = () => {
  const [viewMode, setViewMode] = useState<"monthly" | "yearly">("monthly");
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [month, setMonth] = useState<string>(format(new Date(), "MMMM"));
  
  const [children, setChildren] = useState<Child[]>(mockChildren);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(mockHealthRecords);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>(mockClothingItems);
  const [foodItems, setFoodItems] = useState<FoodItem[]>(mockFoodItems);
  const [donations, setDonations] = useState<Donation[]>(mockDonations);
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>(mockSponsorships);
  
  const [childrenData, setChildrenData] = useState<MonthlyCount[]>([]);
  const [healthData, setHealthData] = useState<MonthlyCount[]>([]);
  const [clothingData, setClothingData] = useState<MonthlyCount[]>([]);
  const [foodData, setFoodData] = useState<MonthlyCount[]>([]);
  const [donationData, setDonationData] = useState<MonthlyCount[]>([]);

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const yearOptions = Array.from({ length: 10 }, (_, i) => 
    (new Date().getFullYear() - i).toString()
  );

  useEffect(() => {
    // Generate children data for reports
    generateChildrenReportData();
    generateHealthReportData();
    generateClothingReportData();
    generateFoodReportData();
    generateDonationReportData();
  }, [viewMode, year, month, children, healthRecords, clothingItems, foodItems, donations, sponsorships]);

  const generateChildrenReportData = () => {
    let data: MonthlyCount[] = [];
    
    if (viewMode === "monthly") {
      // Generate data for each month of the selected year
      data = months.map(monthName => {
        const monthIndex = months.indexOf(monthName);
        const monthDate = new Date(parseInt(year), monthIndex);
        
        // Count children by status for this month
        const active = children.filter(child => {
          const admitDate = new Date(child.dateAdmitted);
          return (
            child.status === "active" &&
            admitDate <= monthDate
          );
        }).length;

        const transferred = children.filter(child => {
          const admitDate = new Date(child.dateAdmitted);
          return (
            child.status === "transferred" &&
            admitDate <= monthDate
          );
        }).length;

        const adopted = children.filter(child => {
          const admitDate = new Date(child.dateAdmitted);
          return (
            child.status === "adopted" &&
            admitDate <= monthDate
          );
        }).length;

        const graduated = children.filter(child => {
          const admitDate = new Date(child.dateAdmitted);
          return (
            child.status === "graduated" &&
            admitDate <= monthDate
          );
        }).length;

        return {
          month: monthName,
          active,
          transferred,
          adopted,
          graduated
        };
      });
    } else {
      // Yearly data - aggregate data by years
      const years = yearOptions.map(y => parseInt(y));
      
      data = years.map(yearValue => {
        const yearStart = new Date(yearValue, 0, 1);
        const yearEnd = new Date(yearValue, 11, 31);
        
        const active = children.filter(child => {
          const admitDate = new Date(child.dateAdmitted);
          return (
            child.status === "active" &&
            admitDate >= yearStart &&
            admitDate <= yearEnd
          );
        }).length;

        const transferred = children.filter(child => {
          const admitDate = new Date(child.dateAdmitted);
          return (
            child.status === "transferred" &&
            admitDate >= yearStart &&
            admitDate <= yearEnd
          );
        }).length;

        const adopted = children.filter(child => {
          const admitDate = new Date(child.dateAdmitted);
          return (
            child.status === "adopted" &&
            admitDate >= yearStart &&
            admitDate <= yearEnd
          );
        }).length;

        const graduated = children.filter(child => {
          const admitDate = new Date(child.dateAdmitted);
          return (
            child.status === "graduated" &&
            admitDate >= yearStart &&
            admitDate <= yearEnd
          );
        }).length;

        return {
          month: yearValue.toString(), // Using month key for year value
          active,
          transferred,
          adopted,
          graduated
        };
      });
    }
    
    setChildrenData(data);
  };

  const generateHealthReportData = () => {
    let data: MonthlyCount[] = [];

    if (viewMode === "monthly") {
      // Generate data for each month of the selected year
      data = months.map(monthName => {
        const monthIndex = months.indexOf(monthName);
        const startDate = new Date(parseInt(year), monthIndex, 1);
        const endDate = new Date(parseInt(year), monthIndex + 1, 0);
        
        // Count health records by type for this month
        const illness = healthRecords.filter(record => {
          const recordDate = new Date(record.date);
          return (
            record.type === "illness" &&
            recordDate >= startDate &&
            recordDate <= endDate
          );
        }).length;

        const checkup = healthRecords.filter(record => {
          const recordDate = new Date(record.date);
          return (
            record.type === "checkup" &&
            recordDate >= startDate &&
            recordDate <= endDate
          );
        }).length;

        const vaccination = healthRecords.filter(record => {
          const recordDate = new Date(record.date);
          return (
            record.type === "vaccination" &&
            recordDate >= startDate &&
            recordDate <= endDate
          );
        }).length;

        const treatment = healthRecords.filter(record => {
          const recordDate = new Date(record.date);
          return (
            record.type === "treatment" &&
            recordDate >= startDate &&
            recordDate <= endDate
          );
        }).length;

        return {
          month: monthName,
          illness,
          checkup,
          vaccination,
          treatment
        };
      });
    } else {
      // Yearly data - aggregate data by years
      const years = yearOptions.map(y => parseInt(y));
      
      data = years.map(yearValue => {
        const yearStart = new Date(yearValue, 0, 1);
        const yearEnd = new Date(yearValue, 11, 31);
        
        const illness = healthRecords.filter(record => {
          const recordDate = new Date(record.date);
          return (
            record.type === "illness" &&
            recordDate >= yearStart &&
            recordDate <= yearEnd
          );
        }).length;

        const checkup = healthRecords.filter(record => {
          const recordDate = new Date(record.date);
          return (
            record.type === "checkup" &&
            recordDate >= yearStart &&
            recordDate <= yearEnd
          );
        }).length;

        const vaccination = healthRecords.filter(record => {
          const recordDate = new Date(record.date);
          return (
            record.type === "vaccination" &&
            recordDate >= yearStart &&
            recordDate <= yearEnd
          );
        }).length;

        const treatment = healthRecords.filter(record => {
          const recordDate = new Date(record.date);
          return (
            record.type === "treatment" &&
            recordDate >= yearStart &&
            recordDate <= yearEnd
          );
        }).length;

        return {
          month: yearValue.toString(),
          illness,
          checkup,
          vaccination,
          treatment
        };
      });
    }
    
    setHealthData(data);
  };

  const generateClothingReportData = () => {
    let data: MonthlyCount[] = [];

    if (viewMode === "monthly") {
      // Generate data for each month of the selected year
      data = months.map(monthName => {
        const monthIndex = months.indexOf(monthName);
        const startDate = new Date(parseInt(year), monthIndex, 1);
        const endDate = new Date(parseInt(year), monthIndex + 1, 0);
        
        // Sum quantities for clothing items received in this month
        const clothing = clothingItems
          .filter(item => {
            if (!item.dateReceived) return false;
            const receivedDate = new Date(item.dateReceived);
            return receivedDate >= startDate && receivedDate <= endDate;
          })
          .reduce((sum, item) => sum + item.quantity, 0);

        return {
          month: monthName,
          clothing
        };
      });
    } else {
      // Yearly data
      const years = yearOptions.map(y => parseInt(y));
      
      data = years.map(yearValue => {
        const yearStart = new Date(yearValue, 0, 1);
        const yearEnd = new Date(yearValue, 11, 31);
        
        const clothing = clothingItems
          .filter(item => {
            if (!item.dateReceived) return false;
            const receivedDate = new Date(item.dateReceived);
            return receivedDate >= yearStart && receivedDate <= yearEnd;
          })
          .reduce((sum, item) => sum + item.quantity, 0);

        return {
          month: yearValue.toString(),
          clothing
        };
      });
    }
    
    setClothingData(data);
  };

  const generateFoodReportData = () => {
    let data: MonthlyCount[] = [];

    if (viewMode === "monthly") {
      // Generate data for each month of the selected year
      data = months.map(monthName => {
        const monthIndex = months.indexOf(monthName);
        const startDate = new Date(parseInt(year), monthIndex, 1);
        const endDate = new Date(parseInt(year), monthIndex + 1, 0);
        
        // Sum quantities for food items received in this month
        const food = foodItems
          .filter(item => {
            const receivedDate = new Date(item.dateReceived);
            return receivedDate >= startDate && receivedDate <= endDate;
          })
          .reduce((sum, item) => sum + item.quantity, 0);

        return {
          month: monthName,
          food
        };
      });
    } else {
      // Yearly data
      const years = yearOptions.map(y => parseInt(y));
      
      data = years.map(yearValue => {
        const yearStart = new Date(yearValue, 0, 1);
        const yearEnd = new Date(yearValue, 11, 31);
        
        const food = foodItems
          .filter(item => {
            const receivedDate = new Date(item.dateReceived);
            return receivedDate >= yearStart && receivedDate <= yearEnd;
          })
          .reduce((sum, item) => sum + item.quantity, 0);

        return {
          month: yearValue.toString(),
          food
        };
      });
    }
    
    setFoodData(data);
  };

  const generateDonationReportData = () => {
    let data: MonthlyCount[] = [];

    if (viewMode === "monthly") {
      // Generate data for each month of the selected year
      data = months.map(monthName => {
        const monthIndex = months.indexOf(monthName);
        const startDate = new Date(parseInt(year), monthIndex, 1);
        const endDate = new Date(parseInt(year), monthIndex + 1, 0);
        
        // Sum amounts for donations in this month
        const monetary = donations
          .filter(donation => {
            const donationDate = new Date(donation.date);
            return (
              donation.type === "monetary" &&
              donationDate >= startDate &&
              donationDate <= endDate
            );
          })
          .reduce((sum, donation) => sum + donation.amount, 0);

        // Sum amounts for sponsorships in this month
        const sponsorshipAmount = sponsorships
          .filter(sponsorship => {
            const startDate = new Date(sponsorship.startDate);
            return (
              sponsorship.status === "active" &&
              startDate >= startDate &&
              startDate <= endDate
            );
          })
          .reduce((sum, sponsorship) => sum + sponsorship.amount, 0);

        return {
          month: monthName,
          monetary,
          sponsorships: sponsorshipAmount
        };
      });
    } else {
      // Yearly data
      const years = yearOptions.map(y => parseInt(y));
      
      data = years.map(yearValue => {
        const yearStart = new Date(yearValue, 0, 1);
        const yearEnd = new Date(yearValue, 11, 31);
        
        const monetary = donations
          .filter(donation => {
            const donationDate = new Date(donation.date);
            return (
              donation.type === "monetary" &&
              donationDate >= yearStart &&
              donationDate <= yearEnd
            );
          })
          .reduce((sum, donation) => sum + donation.amount, 0);

        const sponsorshipAmount = sponsorships
          .filter(sponsorship => {
            const startDate = new Date(sponsorship.startDate);
            return (
              sponsorship.status === "active" &&
              startDate >= yearStart &&
              startDate <= yearEnd
            );
          })
          .reduce((sum, sponsorship) => sum + sponsorship.amount, 0);

        return {
          month: yearValue.toString(),
          monetary,
          sponsorships: sponsorshipAmount
        };
      });
    }
    
    setDonationData(data);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Visualize data to track patterns and make informed decisions
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
          <div className="flex gap-2">
            <Select value={viewMode} onValueChange={(value) => setViewMode(value as "monthly" | "yearly")}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="View by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            
            {viewMode === "monthly" && (
              <>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((y) => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="children" className="space-y-6">
        <TabsList>
          <TabsTrigger value="children">Children</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
        </TabsList>
        
        {/* Children Tab */}
        <TabsContent value="children" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Children by Status</CardTitle>
              <CardDescription>
                {viewMode === "monthly" 
                  ? `Monthly distribution of children by status in ${year}` 
                  : "Yearly distribution of children by status"}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ChartContainer 
                config={{
                  active: { color: "#4ade80" },
                  transferred: { color: "#fbbf24" },
                  adopted: { color: "#60a5fa" },
                  graduated: { color: "#a78bfa" },
                }}
              >
                <LineChart data={childrenData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend content={<ChartLegendContent />} />
                  <Line type="monotone" dataKey="active" stroke="#4ade80" name="Active" />
                  <Line type="monotone" dataKey="transferred" stroke="#fbbf24" name="Transferred" />
                  <Line type="monotone" dataKey="adopted" stroke="#60a5fa" name="Adopted" />
                  <Line type="monotone" dataKey="graduated" stroke="#a78bfa" name="Graduated" />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Health Tab */}
        <TabsContent value="health" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Health Records by Type</CardTitle>
              <CardDescription>
                {viewMode === "monthly" 
                  ? `Monthly distribution of health records in ${year}` 
                  : "Yearly distribution of health records"}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ChartContainer 
                config={{
                  illness: { color: "#ef4444" },
                  checkup: { color: "#3b82f6" },
                  vaccination: { color: "#10b981" },
                  treatment: { color: "#f97316" },
                }}
              >
                <BarChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend content={<ChartLegendContent />} />
                  <Bar dataKey="illness" fill="#ef4444" name="Illness" />
                  <Bar dataKey="checkup" fill="#3b82f6" name="Checkup" />
                  <Bar dataKey="vaccination" fill="#10b981" name="Vaccination" />
                  <Bar dataKey="treatment" fill="#f97316" name="Treatment" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Clothing Inventory</CardTitle>
                <CardDescription>
                  {viewMode === "monthly" 
                    ? `Monthly clothing acquisitions in ${year}` 
                    : "Yearly clothing acquisitions"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ChartContainer 
                  config={{
                    clothing: { color: "#8b5cf6" },
                  }}
                >
                  <BarChart data={clothingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="clothing" fill="#8b5cf6" name="Clothing Items" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Food Inventory</CardTitle>
                <CardDescription>
                  {viewMode === "monthly" 
                    ? `Monthly food acquisitions in ${year}` 
                    : "Yearly food acquisitions"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ChartContainer 
                  config={{
                    food: { color: "#f97316" },
                  }}
                >
                  <BarChart data={foodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="food" fill="#f97316" name="Food Items" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Donations Tab */}
        <TabsContent value="donations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Donations & Sponsorships</CardTitle>
              <CardDescription>
                {viewMode === "monthly" 
                  ? `Monthly donations and sponsorships in ${year}` 
                  : "Yearly donations and sponsorships"}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ChartContainer 
                config={{
                  monetary: { color: "#22c55e" },
                  sponsorships: { color: "#3b82f6" },
                }}
              >
                <BarChart data={donationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend content={<ChartLegendContent />} />
                  <Bar dataKey="monetary" fill="#22c55e" name="Monetary Donations" />
                  <Bar dataKey="sponsorships" fill="#3b82f6" name="Sponsorships" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
