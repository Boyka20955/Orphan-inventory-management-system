
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { Donation } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DonationFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  donation?: Donation | null;
  onSave?: (donation: Donation) => void;
}

const DonationFormModal: React.FC<DonationFormModalProps> = ({
  open,
  onOpenChange,
  donation,
  onSave,
}) => {
  const { toast } = useToast();
  const isEditing = !!donation;
  const [donorType, setDonorType] = useState<'person' | 'organization'>('person');
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    organizationName: ""
  });

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      organizationName: "",
      date: new Date(),
      amount: 0,
      currency: "USD",
      purpose: "",
      notes: "",
    },
  });

  const validateName = (name: string, field: 'firstName' | 'lastName' | 'organizationName'): boolean => {
    // Check if name contains only letters and spaces
    if (!/^[A-Za-z\s]+$/.test(name)) {
      setErrors(prev => ({
        ...prev,
        [field]: "Should contain only letters (no numbers or symbols)"
      }));
      return false;
    }
    setErrors(prev => ({
      ...prev,
      [field]: ""
    }));
    return true;
  };

  // Reset form when modal opens with donation data or as a new donation
  useEffect(() => {
    if (open) {
      if (donation) {
        // Handle editing existing donation
        const isDonorOrganization = donation.donorType === 'organization';
        setDonorType(isDonorOrganization ? 'organization' : 'person');
        
        form.reset({
          firstName: donation.firstName || "",
          lastName: donation.lastName || "",
          organizationName: donation.organizationName || "",
          date: new Date(donation.date),
          amount: donation.amount,
          currency: donation.currency,
          purpose: donation.purpose || "",
          notes: donation.notes || "",
        });
      } else {
        // Reset for new donation
        form.reset({
          firstName: "",
          lastName: "",
          organizationName: "",
          date: new Date(),
          amount: 0,
          currency: "USD",
          purpose: "",
          notes: "",
        });
        setDonorType('person');
      }
      
      // Reset validation errors
      setErrors({
        firstName: "",
        lastName: "",
        organizationName: ""
      });
    }
  }, [open, donation, form]);

  const onSubmit = (data: any) => {
    // Validate the names based on donor type
    let isValid = true;
    
    if (donorType === 'person') {
      isValid = validateName(data.firstName, 'firstName') && 
                validateName(data.lastName, 'lastName');
                
      if (!data.firstName || !data.lastName) {
        toast({
          title: "Validation Error",
          description: "Please enter both first and last name.",
          variant: "destructive",
        });
        return;
      }
    } else {
      isValid = validateName(data.organizationName, 'organizationName');
      
      if (!data.organizationName) {
        toast({
          title: "Validation Error",
          description: "Please enter organization name.",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Names should contain only letters (no numbers or symbols).",
        variant: "destructive",
      });
      return;
    }

    // Create a new donation object with all the required fields
    const newDonation: Donation = {
      id: donation?.id || Date.now().toString(),
      donorType: donorType,
      firstName: donorType === 'person' ? data.firstName : undefined,
      lastName: donorType === 'person' ? data.lastName : undefined,
      organizationName: donorType === 'organization' ? data.organizationName : undefined,
      date: format(data.date, 'yyyy-MM-dd'),
      amount: data.amount,
      currency: data.currency,
      type: "monetary",
      purpose: data.purpose,
      notes: data.notes,
    };
    
    // If onSave prop is provided, call it with the new donation
    if (onSave) {
      onSave(newDonation);
    } else {
      // Default behavior if onSave isn't provided
      console.log("Donation data:", newDonation);
      
      toast({
        title: isEditing ? "Donation updated" : "Donation added",
        description: isEditing
          ? "The donation has been successfully updated."
          : "The donation has been successfully added.",
      });
      
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Donation" : "Add New Donation"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of this donation."
              : "Enter the details of the new donation."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-3">
              <FormLabel>Donor Type</FormLabel>
              <Tabs 
                defaultValue={donorType} 
                onValueChange={(value) => setDonorType(value as 'person' | 'organization')}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="person">Individual</TabsTrigger>
                  <TabsTrigger value="organization">Organization</TabsTrigger>
                </TabsList>
                
                <TabsContent value="person" className="space-y-4 mt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FormLabel htmlFor="firstName">First Name*</FormLabel>
                      <Input
                        id="firstName"
                        {...form.register("firstName")}
                        className={errors.firstName ? "border-red-500" : ""}
                        onChange={(e) => {
                          form.setValue("firstName", e.target.value);
                          validateName(e.target.value, 'firstName');
                        }}
                      />
                      {errors.firstName && (
                        <p className="text-xs text-red-500">{errors.firstName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <FormLabel htmlFor="lastName">Last Name*</FormLabel>
                      <Input
                        id="lastName"
                        {...form.register("lastName")}
                        className={errors.lastName ? "border-red-500" : ""}
                        onChange={(e) => {
                          form.setValue("lastName", e.target.value);
                          validateName(e.target.value, 'lastName');
                        }}
                      />
                      {errors.lastName && (
                        <p className="text-xs text-red-500">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="organization" className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <FormLabel htmlFor="organizationName">Organization Name*</FormLabel>
                    <Input
                      id="organizationName"
                      {...form.register("organizationName")}
                      className={errors.organizationName ? "border-red-500" : ""}
                      onChange={(e) => {
                        form.setValue("organizationName", e.target.value);
                        validateName(e.target.value, 'organizationName');
                      }}
                    />
                    {errors.organizationName && (
                      <p className="text-xs text-red-500">{errors.organizationName}</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    The purpose for which this donation will be used.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information about this donation"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">
                {isEditing ? "Update Donation" : "Add Donation"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DonationFormModal;