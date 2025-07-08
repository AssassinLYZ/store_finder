export interface Address {
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  state: string;
  countryCode: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: Address;
}

export interface Availability {
  startsOn: string;
  endsOn: string;
}

export interface CommerceService {
  available: boolean;
  availability: Availability;
}

export interface Commerce {
  inStore: CommerceService;
  homeDelivery: CommerceService;
  collection: CommerceService;
}

export interface Facilities {
  cookingStudio: boolean;
  dryCleaning: boolean;
  flowers: boolean;
  kitchen: boolean;
  liquorService: boolean;
  locationType: string;
  parking: string;
  pharmacy: boolean;
  photoService: boolean;
  pickUpType: string;
  postOffice: boolean;
  selfCheckout: boolean;
  selfScan: boolean;
  wifi: boolean;
}

export interface OpeningHoursDay {
  opensAt: string;
  closesAt: string;
}

export interface OpeningHours {
  monday: OpeningHoursDay;
  tuesday: OpeningHoursDay;
  wednesday: OpeningHoursDay;
  thursday: OpeningHoursDay;
  friday: OpeningHoursDay;
  saturday: OpeningHoursDay;
  sunday: OpeningHoursDay;
}

export interface Store {
  storeId: string;
  name: string;
  complexNumber: number;
  websiteURL: string;
  facilities: Facilities;
  commerce: Commerce;
  location: Location;
  openingHours: OpeningHours;
}

export interface StoreData {
  stores: Store[];
}

export interface Suggestion {
  id: string;
  text: string;
  type: string;
  count?: number;
  data: Store[];
}
