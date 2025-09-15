import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Baby, Heart, Shirt, Apple, Gift } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Dashboard = () => {
  const [statistics, setStatistics] = useState({
    totalChildren: 4,
    // scheduledCheckups: 2,
    totalClothingItems: 2,
    totalFoodItems: 2,
    // totalDonations: 1000,
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, section: "Children", action: "New child registered", date: "2 hours ago", user: "Admin" },
    // { id: 2, section: "Health Records", action: "Medical checkup completed", date: "Yesterday", user: "Dr. Smith" },
    { id: 3, section: "Clothing", action: "10 shirts added to inventory", date: "2 days ago", user: "Jane" },
    { id: 4, section: "Food", action: "Food supplies ordered", date: "3 days ago", user: "Admin" },
    // { id: 5, section: "Donations", action: "Received $500 donation", date: "1 week ago", user: "Admin" }
  ]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch("/api/dashboard/statistics");
        const data = await response.json();
        setStatistics(data);
      } catch (error) {
        console.error("Error fetching dashboard statistics:", error);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        {/* Dashboard Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Children</CardTitle>
              <Baby className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalChildren}</div>
              <p className="text-xs text-muted-foreground">Total registered</p>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medical Checkups</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.scheduledCheckups}</div>
              <p className="text-xs text-muted-foreground">Scheduled this week</p>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clothing Items</CardTitle>
              <Shirt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalClothingItems}</div>
              <p className="text-xs text-muted-foreground">In inventory</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Food Inventory</CardTitle>
              <Apple className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalFoodItems}</div>
              <p className="text-xs text-muted-foreground">Items in stock</p>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Donations</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${statistics.totalDonations}</div>
              <p className="text-xs text-muted-foreground">Total this month</p>
            </CardContent>
          </Card> */}
        </div>
        
        {/* Recent Activities Table */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Overview of recent operations across all sections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Section</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.section}</TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell>{activity.date}</TableCell>
                    <TableCell>{activity.user}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
