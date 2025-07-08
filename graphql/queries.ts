import { gql } from 'graphql-tag';

export const GET_STORES = gql`
  query {
    stores {
      storeId
      name
      complexNumber
      websiteURL
      location {
        latitude
        longitude
        address {
          street
          houseNumber
          postalCode
          city
          state
          countryCode
        }
      }
      facilities {
        cookingStudio
        dryCleaning
        flowers
        kitchen
        liquorService
        locationType
        parking
        pharmacy
        photoService
        pickUpType
        postOffice
        selfCheckout
        selfScan
        wifi
      }
      commerce {
        inStore {
          available
          availability {
            startsOn
            endsOn
          }
        }
        homeDelivery {
          available
          availability {
            startsOn
            endsOn
          }
        }
        collection {
          available
          availability {
            startsOn
            endsOn
          }
        }
      }
      openingHours {
        monday {
          opensAt
          closesAt
        }
        tuesday {
          opensAt
          closesAt
        }
        wednesday {
          opensAt
          closesAt
        }
        thursday {
          opensAt
          closesAt
        }
        friday {
          opensAt
          closesAt
        }
        saturday {
          opensAt
          closesAt
        }
        sunday {
          opensAt
          closesAt
        }
      }
    }
  }
`;
