import { gql } from 'graphql-tag';

export const storeSchema = gql`
  type Address {
    street: String
    houseNumber: String
    postalCode: String
    city: String
    state: String
    countryCode: String
  }

  type Location {
    latitude: Float
    longitude: Float
    address: Address
  }

  type Availability {
    startsOn: String
    endsOn: String
  }

  type CommerceService {
    available: Boolean
    availability: Availability
  }

  type Commerce {
    inStore: CommerceService
    homeDelivery: CommerceService
    collection: CommerceService
  }

  type Facilities {
    cookingStudio: Boolean
    dryCleaning: Boolean
    flowers: Boolean
    kitchen: Boolean
    liquorService: Boolean
    locationType: String
    parking: String
    pharmacy: Boolean
    photoService: Boolean
    pickUpType: String
    postOffice: Boolean
    selfCheckout: Boolean
    selfScan: Boolean
    wifi: Boolean
  }

  type OpeningHoursDay {
    opensAt: String
    closesAt: String
  }

  type OpeningHours {
    monday: OpeningHoursDay
    tuesday: OpeningHoursDay
    wednesday: OpeningHoursDay
    thursday: OpeningHoursDay
    friday: OpeningHoursDay
    saturday: OpeningHoursDay
    sunday: OpeningHoursDay
  }

  type Store {
    storeId: String
    name: String
    complexNumber: Int
    websiteURL: String
    facilities: Facilities
    commerce: Commerce
    location: Location
    openingHours: OpeningHours
  }

  type Query {
    stores: [Store]
    store(storeId: String): Store
    storesByCity(city: String): [Store]
    storesWithFacility(facility: String): [Store]
  }
`;
