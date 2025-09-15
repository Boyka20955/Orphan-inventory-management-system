
import React from "react";
import { HealthRecord, Child } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Edit, Pill, AlertTriangle, DollarSign, CheckCircle, Trash } from "lucide-react";

interface HealthRecordsListProps {
  records: HealthRecord[];
  showChildName?: boolean;
  showFinancials?: boolean;
  onEditRecord: (record: HealthRecord) => void;
  onDeleteRecord: (recordId: string) => void;
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "checkup":
      return "bg-blue-100 text-blue-800";
    case "vaccination":
      return "bg-green-100 text-green-800";
    case "illness":
      return "bg-red-100 text-red-800";
    case "treatment":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getChildFullName = (record: HealthRecord) => {
  if (record.childFirstName && record.childLastName) {
    return `${record.childFirstName} ${record.childLastName}`;
  }
  return "Unknown Child";
};

const HealthRecordsList: React.FC<HealthRecordsListProps> = ({
  records,
  showChildName = false,
  showFinancials = false,
  onEditRecord,
  onDeleteRecord,
}) => {
  if (records.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No health records found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {records.map((record) => (
        <Card key={record.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">
                  {record.description}
                </CardTitle>
                <CardDescription>
                  {formatDate(record.date)}
                </CardDescription>
              </div>
              <Badge className={getTypeColor(record.type)}>
                {record.type}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            {showChildName && (
              <div className="mb-2">
                <span className="text-sm font-medium">Child: </span>
                <span className="text-sm">{getChildFullName(record)}</span>
              </div>
            )}
            
            <div className="mb-2">
              <span className="text-sm font-medium">Doctor: </span>
              <span className="text-sm">{record.doctor}</span>
            </div>
            
            {record.hospital && (
              <div className="mb-2">
                <span className="text-sm font-medium">Hospital/Clinic: </span>
                <span className="text-sm">{record.hospital}</span>
              </div>
            )}
            
            {record.disease && (
              <div className="mb-2 flex items-start">
                <Pill className="h-4 w-4 mt-0.5 mr-1 text-red-500" />
                <div>
                  <span className="text-sm font-medium">Disease: </span>
                  <span className="text-sm">{record.disease}</span>
                </div>
              </div>
            )}

            {record.treatment && (
              <div className="mb-2">
                <span className="text-sm font-medium">Treatment: </span>
                <span className="text-sm">{record.treatment}</span>
              </div>
            )}

            {showFinancials && record.cost !== undefined && (
              <div className="mt-3 space-y-1 pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                    Cost:
                  </span>
                  <span className="text-sm font-medium">
                    {record.cost.toLocaleString()} KES
                  </span>
                </div>

                {record.isPaid ? (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Paid</span>
                    {record.paymentReceipt && (
                      <span className="ml-2 text-xs">
                        (Receipt: {record.paymentReceipt})
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center text-red-500 text-sm">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span>Not paid</span>
                    {record.debt && (
                      <span className="ml-2">
                        (Outstanding: {record.debt.toLocaleString()} KES)
                      </span>
                    )}
                  </div>
                )}
                
                {record.pendingMedicines && record.pendingMedicines.length > 0 && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Pending Medicines: </span>
                    <span>{record.pendingMedicines.join(", ")}</span>
                  </div>
                )}
              </div>
            )}
            
            {record.notes && (
              <div className="mt-3 text-sm">
                <span className="font-medium">Notes: </span>
                <span className="text-muted-foreground">{record.notes}</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-1 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onEditRecord(record)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => onDeleteRecord(record.id)}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default HealthRecordsList;
