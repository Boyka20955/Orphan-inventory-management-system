
// If this file doesn't exist, create it

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  dateAdmitted: string;
  status: string;
  guardianInfo?: string;
  childPresent?: boolean;
  childUpdated?: boolean;
}

export interface HealthRecord {
  id: string;
  childId: string;
  childFirstName?: string;
  childLastName?: string;
  date: string;
  type: string;
  description: string;
  doctor: string;
  hospital?: string;
  disease?: string;
  treatment?: string;
  cost?: number;
  debt?: number;
  isPaid: boolean;
  notes?: string;
  childPresent?: boolean;
  childUpdated?: boolean;
  pendingMedicines?: string[];
  paymentReceipt?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  dateReceived: string;
  supplier?: string;
  status?: string;
}

export interface Donation {
  id: string;
  donorType?: 'person' | 'organization';
  donorId?: string;
  donorName?: string;
  firstName?: string;
  lastName?: string;
  organizationName?: string;
  date: string;
  amount: number;
  currency: string;
  type: string;
  purpose?: string;
  notes?: string;
}

export interface Sponsorship {
  id: string;
  donorType?: 'person' | 'organization';
  donorId?: string;
  donorName?: string;
  firstName?: string;
  lastName?: string;
  organizationName?: string;
  childId: string;
  childName?: string;
  childFirstName?: string;
  childLastName?: string;
  startDate: string;
  endDate?: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually';
  notes?: string;
  status: 'active' | 'ended';
}

export interface ClothingItem {
  id: string;
  name: string;
  category: string;
  size: string;
  gender: string;
  condition: string;
  quantity: number;
  dateReceived?: string;
  location?: string;
  assignedTo?: string[];
  type?: string;
  ageRange?: string;
  notes?: string;
}
