
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileDigit, FileText, Award, Pen, Trash2, Upload, FileCheck2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

// Certificate schema
const certificateSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  type: z.string().min(1, { message: "Certificate type is required" }),
  issueDate: z.date({
    required_error: "Issue date is required",
  }),
  issuedBy: z.string().min(1, { message: "Issuer is required" }),
  fileUrl: z.string().optional(),
});

type CertificateFormValues = z.infer<typeof certificateSchema>;

// Certificate type with ID for storage
interface Certificate extends CertificateFormValues {
  id: string;
  fileUrl: string;
}

const Backup = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: "1",
      title: "Birth Certificate",
      type: "birth",
      issueDate: new Date("2010-05-15"),
      issuedBy: "Municipal Corporation",
      fileUrl: "/placeholder.svg",
    },
    {
      id: "2",
      title: "Swimming Championship",
      type: "sports",
      issueDate: new Date("2022-08-10"),
      issuedBy: "National Swimming Association",
      fileUrl: "/placeholder.svg",
    },
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  
  const form = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      title: "",
      type: "",
      issueDate: new Date(),
      issuedBy: "",
      fileUrl: "",
    },
  });
  
  const handleAddCertificate = (data: CertificateFormValues) => {
    const newCertificate: Certificate = {
      ...data,
      id: Date.now().toString(),
      fileUrl: data.fileUrl || "/placeholder.svg",
    };
    
    setCertificates([...certificates, newCertificate]);
    toast.success("Certificate added successfully");
    setIsAddDialogOpen(false);
    form.reset();
  };
  
  const handleEditCertificate = (data: CertificateFormValues) => {
    if (!selectedCertificate) return;
    
    const updatedCertificates = certificates.map((cert) => 
      cert.id === selectedCertificate.id 
        ? { ...cert, ...data } 
        : cert
    );
    
    setCertificates(updatedCertificates);
    toast.success("Certificate updated successfully");
    setIsEditDialogOpen(false);
    setSelectedCertificate(null);
  };
  
  const handleDeleteCertificate = (id: string) => {
    setCertificates(certificates.filter(cert => cert.id !== id));
    toast.success("Certificate deleted successfully");
  };
  
  const handleEditClick = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    form.reset({
      title: certificate.title,
      type: certificate.type,
      issueDate: new Date(certificate.issueDate),
      issuedBy: certificate.issuedBy,
      fileUrl: certificate.fileUrl,
    });
    setIsEditDialogOpen(true);
  };
  
  const getCertificateIcon = (type: string) => {
    switch (type) {
      case "birth":
        return <FileDigit className="h-10 w-10 text-blue-500" />;
      case "education":
        return <FileText className="h-10 w-10 text-green-500" />;
      case "sports":
        return <Award className="h-10 w-10 text-yellow-500" />;
      default:
        return <FileCheck2 className="h-10 w-10 text-gray-500" />;
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orphan-blue">Certificate Backup</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orphan-blue hover:bg-orphan-lightBlue">
              <Upload className="mr-2 h-4 w-4" /> Add Certificate
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Certificate</DialogTitle>
              <DialogDescription>
                Upload and store important certificates securely
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddCertificate)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certificate Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter certificate title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certificate Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select certificate type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="birth">Birth Certificate</SelectItem>
                          <SelectItem value="education">Education Certificate</SelectItem>
                          <SelectItem value="sports">Sports Certificate</SelectItem>
                          <SelectItem value="other">Other Certificate</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Issue</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button 
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal pointer-events-auto ${
                                !field.value ? "text-muted-foreground" : ""
                              }`}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="issuedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issued By</FormLabel>
                      <FormControl>
                        <Input placeholder="Organization name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certificate File</FormLabel>
                      <FormControl>
                        <Input 
                          type="file" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // In a real app, you would upload this file to storage
                              // For this demo, we'll just store the file name
                              field.onChange(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload a PDF or image of the certificate
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">Save Certificate</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((certificate) => (
          <Card key={certificate.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {getCertificateIcon(certificate.type)}
                  <div>
                    <CardTitle className="text-lg">{certificate.title}</CardTitle>
                    <CardDescription>
                      Issued on {format(new Date(certificate.issueDate), "PPP")}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Type:</span>
                  <span>
                    {certificate.type.charAt(0).toUpperCase() + certificate.type.slice(1)} Certificate
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Issued By:</span>
                  <span>{certificate.issuedBy}</span>
                </div>
              </div>
              <div className="border rounded-md overflow-hidden h-32 bg-gray-50 flex items-center justify-center">
                {certificate.fileUrl && (
                  <img 
                    src={certificate.fileUrl} 
                    alt={certificate.title} 
                    className="object-contain h-full w-full"
                  />
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditClick(certificate)}
                  >
                    <Pen className="h-4 w-4 mr-1" /> Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Certificate</DialogTitle>
                    <DialogDescription>
                      Update certificate information
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleEditCertificate)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Certificate Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter certificate title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Certificate Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select certificate type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="birth">Birth Certificate</SelectItem>
                                <SelectItem value="education">Education Certificate</SelectItem>
                                <SelectItem value="sports">Sports Certificate</SelectItem>
                                <SelectItem value="other">Other Certificate</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="issueDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date of Issue</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button 
                                    variant={"outline"}
                                    className={`w-full pl-3 text-left font-normal pointer-events-auto ${
                                      !field.value ? "text-muted-foreground" : ""
                                    }`}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="issuedBy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Issued By</FormLabel>
                            <FormControl>
                              <Input placeholder="Organization name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="fileUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Certificate File</FormLabel>
                            <FormControl>
                              <Input 
                                type="file" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    // In a real app, you would upload this file to storage
                                    // For this demo, we'll just store the file name
                                    field.onChange(URL.createObjectURL(file));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Upload a PDF or image of the certificate
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button type="submit">Update Certificate</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the
                      certificate from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteCertificate(certificate.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {certificates.length === 0 && (
        <Card className="border-dashed border-2 p-6">
          <div className="flex flex-col items-center justify-center text-center p-8">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No certificates added yet</h3>
            <p className="text-muted-foreground mb-4">
              Add important documents like birth certificates, education certificates, and more.
            </p>
            <Button 
              className="bg-orphan-blue hover:bg-orphan-lightBlue"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Upload className="mr-2 h-4 w-4" /> Add Certificate
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Backup;
