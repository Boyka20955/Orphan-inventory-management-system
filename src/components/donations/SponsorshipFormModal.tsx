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
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { Sponsorship, Child } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SponsorshipFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sponsorship?: Sponsorship | null;
  children?: Child[]; // Updated to accept children prop directly
  onSave?: (sponsorship: Sponsorship) => void;
}

const SponsorshipFormModal: React.FC<SponsorshipFormModalProps> = ({
  open,
  onOpenChange,
  sponsorship,
  children = [], // Default to empty array
  onSave,
}) => {
  const { toast } = useToast();
  const isEditing = !!sponsorship;
  const [donorType, setDonorType] = useState<'person' | 'organization'>('person');
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    organizationName: "",
    childFirstName: "",
    childLastName: ""
  });
  const [childEntryMode, setChildEntryMode] = useState<'select' | 'manual'>('select');
  const [childFirstName, setChildFirstName] = useState("");
  const [childLastName, setChildLastName] = useState("");

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      organizationName: "",
      childId: "",
      startDate: new Date(),
      endDate: undefined as Date | undefined,
      amount: 0,
      frequency: "monthly" as 'monthly' | 'quarterly' | 'annually',
      notes: "",
      status: "active" as 'active' | 'ended',
      hasEndDate: false,
    },
  });

  const validateName = (name: string, field: keyof typeof errors): boolean => {
    if (/\d/.test(name)) {
      setErrors(prev => ({
        ...prev,
        [field]: "Should not contain numbers"
      }));
      return false;
    }
    setErrors(prev => ({
      ...prev,
      [field]: ""
    }));
    return true;
  };

  const handleChildNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'childFirstName') {
      setChildFirstName(value);
      validateName(value, 'childFirstName');
    } else if (name === 'childLastName') {
      setChildLastName(value);
      validateName(value, 'childLastName');
    }
  };

  useEffect(() => {
    if (open) {
      if (sponsorship) {
        const isDonorOrganization = sponsorship.donorType === 'organization';
        setDonorType(isDonorOrganization ? 'organization' : 'person');
        setChildEntryMode('select');
        
        form.reset({
          firstName: sponsorship.firstName || "",
          lastName: sponsorship.lastName || "",
          organizationName: sponsorship.organizationName || "",
          childId: sponsorship.childId,
          startDate: new Date(sponsorship.startDate),
          endDate: sponsorship.endDate ? new Date(sponsorship.endDate) : undefined,
          amount: sponsorship.amount,
          frequency: sponsorship.frequency,
          notes: sponsorship.notes || "",
          status: sponsorship.status,
          hasEndDate: !!sponsorship.endDate,
        });
      } else {
        form.reset({
          firstName: "",
          lastName: "",
          organizationName: "",
          childId: "",
          startDate: new Date(),
          endDate: undefined,
          amount: 0,
          frequency: "monthly",
          notes: "",
          status: "active",
          hasEndDate: false,
        });
        setDonorType('person');
        setChildEntryMode('select');
      }
      
      setErrors({
        firstName: "",
        lastName: "",
        organizationName: "",
        childFirstName: "",
        childLastName: ""
      });
      
      setChildFirstName("");
      setChildLastName("");
    }
  }, [open, sponsorship, form]);

  const onSubmit = (data: any) => {
    let isValid = true;
    
    if (donorType === 'person') {
      isValid = validateName(data.firstName, 'firstName') && 
                validateName(data.lastName, 'lastName');
                
      if (!data.firstName || !data.lastName) {
        toast({
          title: "Validation Error",
          description: "Please enter both first and last name for the donor.",
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
    
    if (childEntryMode === 'manual') {
      isValid = isValid && validateName(childFirstName, 'childFirstName') && 
                validateName(childLastName, 'childLastName');
                
      if (!childFirstName || !childLastName) {
        toast({
          title: "Validation Error",
          description: "Please enter both first and last name for the child.",
          variant: "destructive",
        });
        return;
      }
    } else if (!data.childId) {
      toast({
        title: "Validation Error",
        description: "Please select a child.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Names should not contain numbers.",
        variant: "destructive",
      });
      return;
    }

    let childId = data.childId;
    let childName = "";
    
    if (childEntryMode === 'manual') {
      childId = `manual_${Date.now()}`;
      childName = `${childFirstName} ${childLastName}`;
    } else {
      childName = children.find(child => child.id === data.childId)?.firstName || "";
    }

    const newSponsorship: Sponsorship = {
      id: sponsorship?.id || Date.now().toString(),
      donorType: donorType,
      firstName: donorType === 'person' ? data.firstName : undefined,
      lastName: donorType === 'person' ? data.lastName : undefined,
      organizationName: donorType === 'organization' ? data.organizationName : undefined,
      childId: childId,
      childName: childName,
      childFirstName: childEntryMode === 'manual' ? childFirstName : undefined,
      childLastName: childEntryMode === 'manual' ? childLastName : undefined,
      startDate: format(data.startDate, 'yyyy-MM-dd'),
      endDate: data.hasEndDate && data.endDate ? format(data.endDate, 'yyyy-MM-dd') : undefined,
      amount: data.amount,
      frequency: data.frequency,
      notes: data.notes,
      status: data.status,
    };
    
    if (onSave) {
      onSave(newSponsorship);
    } else {
      console.log("Sponsorship data:", newSponsorship);
      
      toast({
        title: isEditing ? "Sponsorship updated" : "Sponsorship added",
        description: isEditing
          ? "The sponsorship has been successfully updated."
          : "The sponsorship has been successfully added.",
      });
      
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Sponsorship" : "Add New Sponsorship"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of this child sponsorship."
              : "Enter the details of the new child sponsorship."}
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
                    />
                    {errors.organizationName && (
                      <p className="text-xs text-red-500">{errors.organizationName}</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-3">
              <FormLabel>Child Information</FormLabel>
              <Tabs 
                defaultValue={childEntryMode} 
                onValueChange={(value) => setChildEntryMode(value as 'select' | 'manual')}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="select">Select Child</TabsTrigger>
                  <TabsTrigger value="manual">Enter Name</TabsTrigger>
                </TabsList>
                
                <TabsContent value="select" className="space-y-4 mt-2">
                  <FormField
                    control={form.control}
                    name="childId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Child</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a child" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {children.map((child) => (
                              <SelectItem key={child.id} value={child.id}>
                                {child.firstName} {child.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="manual" className="space-y-4 mt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FormLabel htmlFor="childFirstName">First Name*</FormLabel>
                      <Input
                        id="childFirstName"
                        name="childFirstName"
                        value={childFirstName}
                        onChange={handleChildNameChange}
                        className={errors.childFirstName ? "border-red-500" : ""}
                      />
                      {errors.childFirstName && (
                        <p className="text-xs text-red-500">{errors.childFirstName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <FormLabel htmlFor="childLastName">Last Name*</FormLabel>
                      <Input
                        id="childLastName"
                        name="childLastName"
                        value={childLastName}
                        onChange={handleChildNameChange}
                        className={errors.childLastName ? "border-red-500" : ""}
                      />
                      {errors.childLastName && (
                        <p className="text-xs text-red-500">{errors.childLastName}</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
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

              <FormField
                control={form.control}
                name="hasEndDate"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-2 mt-8">
                    <FormLabel>Has end date</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {form.watch("hasEndDate") && (
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
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
            )}

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
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="ended">Ended</SelectItem>
                    </SelectContent>
                  </Select>
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
                      placeholder="Any additional information about this sponsorship"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">
                {isEditing ? "Update Sponsorship" : "Add Sponsorship"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SponsorshipFormModal;
