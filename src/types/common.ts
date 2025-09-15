
// Common interfaces for API and UI data mapping

// API Data Types (from backend)
export interface ApiChild {
  _id: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  entryDate: string;
  medicalConditions?: string[];
  guardianName?: string;
  guardianContact?: string;
  background?: string;
  photo?: string;
  status?: string;
}

export interface ApiHealthRecord {
  _id: string;
  childId: string;
  recordType: string;
  date: string;
  description: string;
  doctor?: string;
  hospital?: string;
  cost?: number;
  medications?: string[];
  nextAppointment?: string;
  attachments?: string[];
  notes?: string;
  createdAt: string;
}

export interface ApiFoodItem {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expirationDate?: string;
  supplier?: string;
  batchNumber?: string;
  purchaseDate: string;
  notes?: string;
}

export interface ApiClothingItem {
  _id: string;
  name: string;
  type: string;
  size: string;
  gender: string;
  ageGroup: string;
  quantity: number;
  condition: string;
  assignedTo?: string[];
  notes?: string;
}

export interface ApiDonation {
  _id: string;
  type: string;
  amount: number;
  currency: string;
  donor: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    isAnonymous?: boolean;
  };
  donationDate: string;
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
}

export interface ApiSponsorship {
  _id: string;
  childId: string;
  sponsor: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  startDate: string;
  endDate?: string;
  amount: number;
  frequency: string;
  currency: string;
  paymentMethod?: string;
  status: string;
  notes?: string;
}

// UI Data Types (used in components)
export interface UIChild {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  dateAdmitted: string;
  status: string;
  guardianInfo?: string;
  childPresent?: boolean;
  childUpdated?: boolean;
}

export interface UIHealthRecord {
  id: string;
  childId: string;
  childName?: string;
  recordType: string;
  date: string;
  description: string;
  doctor?: string;
  hospital?: string;
  cost?: number;
  medications?: string[];
  nextAppointment?: string;
  attachments?: string[];
  notes?: string;
  createdAt: string;
  disease?: string; // Added disease property
  treatment?: string; // Added treatment property
  debt?: number; // Added debt property
  isPaid?: boolean; // Added isPaid property
}

export interface UIFoodItem {
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

export interface UIClothingItem {
  id: string;
  name: string;
  type: string;
  size: string;
  gender: string;
  ageGroup: string;
  quantity: number;
  condition: string;
  assignedTo?: string[];
  notes?: string;
}

export interface UIDonation {
  id: string;
  donorType?: 'person' | 'organization';
  donorName: string;
  date: string;
  amount: number;
  currency: string;
  type: string;
  purpose?: string;
  notes?: string;
}

export interface UISponsorship {
  id: string;
  donorType?: 'person' | 'organization';
  donorName: string;
  childId: string;
  childName: string;
  startDate: string;
  endDate?: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually';
  notes?: string;
  status: 'active' | 'ended';
}

// Data Transformation Functions
export function mapApiChildToUIChild(apiChild: ApiChild): UIChild {
  return {
    id: apiChild._id,
    firstName: apiChild.firstName,
    lastName: apiChild.lastName,
    gender: apiChild.gender,
    dateOfBirth: new Date(apiChild.dateOfBirth).toISOString().split('T')[0],
    dateAdmitted: new Date(apiChild.entryDate).toISOString().split('T')[0],
    status: apiChild.status || 'active',
    guardianInfo: apiChild.guardianName ? 
      `${apiChild.guardianName}${apiChild.guardianContact ? ' • ' + apiChild.guardianContact : ''}` : 
      undefined,
  };
}

export function mapUIChildToApiChild(uiChild: UIChild): Partial<ApiChild> {
  let guardianName, guardianContact;
  if (uiChild.guardianInfo) {
    const parts = uiChild.guardianInfo.split('•').map(p => p.trim());
    guardianName = parts[0];
    guardianContact = parts.length > 1 ? parts[1] : undefined;
  }

  return {
    firstName: uiChild.firstName,
    lastName: uiChild.lastName,
    gender: uiChild.gender,
    dateOfBirth: uiChild.dateOfBirth,
    entryDate: uiChild.dateAdmitted,
    guardianName: guardianName,
    guardianContact: guardianContact,
    status: uiChild.status
  };
}

// export function mapApiHealthRecordToUIHealthRecord(record: ApiHealthRecord, childrenMap?: Map<string, ApiChild>): UIHealthRecord {
//   let childName;
//   if (childrenMap && childrenMap.has(record.childId)) {
//     const child = childrenMap.get(record.childId);
//     childName = child ? `${child.firstName} ${child.lastName}` : undefined;
//   }

//   return {
//     id: record._id,
//     childId: record.childId,
//     childName,
//     recordType: record.recordType,
//     date: record.date,
//     description: record.description,
//     doctor: record.doctor,
//     hospital: record.hospital,
//     cost: record.cost,
//     medications: record.medications,
//     nextAppointment: record.nextAppointment,
//     attachments: record.attachments,
//     notes: record.notes,
//     createdAt: record.createdAt
//   };
// }

export function mapApiHealthRecordToUIHealthRecord(
  record: ApiHealthRecord,
  childrenMap?: Map<string, ApiChild>
): UIHealthRecord {
  let childName;
  if (childrenMap && childrenMap.has(record.childId)) {
    const child = childrenMap.get(record.childId);
    childName = child ? `${child.firstName} ${child.lastName}` : undefined;
  }

  return {
    id: record._id,
    childId: record.childId, // must match MongoDB ObjectId of child
    childName,
    recordType: record.recordType,
    date: record.date,
    description: record.description,
    doctor: record.doctor,
    hospital: record.hospital,
    cost: record.cost,
    medications: record.medications,
    nextAppointment: record.nextAppointment,
    attachments: record.attachments,
    notes: record.notes,
    createdAt: record.createdAt
  };
}

export function mapApiFoodItemToUIFoodItem(item: ApiFoodItem): UIFoodItem {
  return {
    id: item._id,
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    unit: item.unit,
    expiryDate: item.expirationDate || '',
    dateReceived: item.purchaseDate,
    supplier: item.supplier,
    status: item.expirationDate && new Date(item.expirationDate) < new Date() ? 'expired' : 
           item.quantity < 5 ? 'low' : 'normal'
  };
}

export function mapUIFoodItemToApiFoodItem(item: UIFoodItem): Partial<ApiFoodItem> {
  return {
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    unit: item.unit,
    expirationDate: item.expiryDate,
    supplier: item.supplier,
    purchaseDate: item.dateReceived
  };
}

export function mapApiClothingItemToUIClothingItem(item: ApiClothingItem): UIClothingItem {
  return {
    id: item._id,
    name: item.name,
    type: item.type,
    size: item.size,
    gender: item.gender,
    ageGroup: item.ageGroup,
    quantity: item.quantity,
    condition: item.condition,
    assignedTo: item.assignedTo,
    notes: item.notes
  };
}

export function mapUIClothingItemToApiClothingItem(item: UIClothingItem): Partial<ApiClothingItem> {
  return {
    name: item.name,
    type: item.type,
    size: item.size,
    gender: item.gender,
    ageGroup: item.ageGroup,
    quantity: item.quantity,
    condition: item.condition,
    assignedTo: item.assignedTo,
    notes: item.notes
  };
}

export function mapApiDonationToUIDonation(donation: ApiDonation): UIDonation {
  return {
    id: donation._id,
    donorName: donation.donor.name,
    date: donation.donationDate,
    amount: donation.amount,
    currency: donation.currency,
    type: donation.type,
    notes: donation.notes
  };
}

export function mapUIDonationToApiDonation(donation: UIDonation): Partial<ApiDonation> {
  return {
    type: donation.type,
    amount: donation.amount,
    currency: donation.currency,
    donor: {
      name: donation.donorName
    },
    donationDate: donation.date,
    notes: donation.notes
  };
}

export function mapApiSponsorshipToUISponsorship(sponsorship: ApiSponsorship, childrenMap: Map<string, UIChild>): UISponsorship {
  let childName = "Unknown Child";
  
  if (childrenMap.has(sponsorship.childId)) {
    const child = childrenMap.get(sponsorship.childId);
    if (child) {
      childName = `${child.firstName} ${child.lastName}`;
    }
  }
  
  return {
    id: sponsorship._id,
    donorName: sponsorship.sponsor.name,
    childId: sponsorship.childId,
    childName: childName,
    startDate: sponsorship.startDate,
    endDate: sponsorship.endDate,
    amount: sponsorship.amount,
    frequency: sponsorship.frequency === 'monthly' || sponsorship.frequency === 'quarterly' || sponsorship.frequency === 'annually' 
      ? sponsorship.frequency as 'monthly' | 'quarterly' | 'annually' 
      : 'monthly',
    notes: sponsorship.notes,
    status: sponsorship.status === 'active' ? 'active' : 'ended'
  };
}

export function mapUISponsorshipToApiSponsorship(sponsorship: UISponsorship): Partial<ApiSponsorship> {
  return {
    childId: sponsorship.childId,
    sponsor: {
      name: sponsorship.donorName
    },
    startDate: sponsorship.startDate,
    endDate: sponsorship.endDate,
    amount: sponsorship.amount,
    frequency: sponsorship.frequency,
    currency: 'USD', // Default value
    status: sponsorship.status,
    notes: sponsorship.notes
  };
}
