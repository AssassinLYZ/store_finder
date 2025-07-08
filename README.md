# Jumbo Store Finder

A store finder application built with Nuxt 3, featuring Store search, store details, and multi-language support.

## 🚀 Features

- **Store Search**: Store search with autocomplete suggestions
- **Store Cards**: Display store information with opening hours
- **Store Details**: Detailed view with location and facilities
- **Multi-language**: Support for English and Dutch
- **Responsive Design**: Mobile-friendly interface
- **GraphQL API**: Modern data fetching with GraphQL
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Frontend**: Nuxt 3, Vue 3, TypeScript
- **Styling**: SCSS, CSS Grid
- **State Management**: Pinia
- **API**: GraphQL with Apollo Client
- **Testing**: Vitest (Unit), Playwright (E2E)
- **Internationalization**: @nuxtjs/i18n
- **Icons**: @nuxt/icon

## 📦 Installation

```bash
# Clone the repository
git clone ... 
cd nuxt

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Google Maps API key to .env
GOOGLE_MAPS_API_KEY=your_api_key_here
```

## 🚀 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Show E2E test report
npm run test:e2e:report
```

## 📁 Project Structure

```
nuxt/
├── components/                 # Vue components
│   ├── AutoComplete/          # Search autocomplete
│   ├── CityFilter/            # City filter component
│   ├── GoogleMap/             # Google Maps integration
│   ├── Layout/                # Layout components
│   ├── StoreCard/             # Store card component
│   ├── StoreDetailDrawer/     # Store detail modal
│   └── ui/                    # UI components
├── composables/               # Vue composables
├── pages/                     # Application pages
├── server/                    # Server-side code
│   ├── api/                   # API routes
│   ├── data/                  # Data files
│   └── graphql/              # GraphQL schema & resolvers
├── stores/                    # Pinia stores
├── test/                      # Test utilities
├── types/                     # TypeScript types
└── utils/                     # Utility functions
```

## 🌐 API Endpoints

- **GraphQL API**: `/api/graphql`
- **GraphQL Playground**: `/api/graphql` (in development)

### GraphQL Schema

```graphql
type Store {
  storeId: String!
  name: String!
  location: Location!
  openingHours: OpeningHours!
  facilities: Facilities!
  commerce: Commerce!
}

type Query {
  stores: [Store!]!
  store(storeId: String!): Store
  storesByCity(city: String!): [Store!]!
}
```

## 🎨 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run E2E tests

## 🌍 Internationalization

The application supports multiple languages:

- **English** (`/en`) - Default
- **Dutch** (`/nl`) - Primary language

Language switching is available through the language switcher in the header.

## 🔧 Configuration

### Environment Variables

- `GOOGLE_MAPS_API_KEY` - Google Maps API key for map functionality

### Nuxt Configuration

The application is configured with:

- Port: 3000 (development)
- Default locale: Dutch
- GraphQL integration
- Pinia for state management
- SCSS for styling

## 📱 Features

### Store Search
- Real-time autocomplete
- Search by store name, city, or address
- Debounced input for performance

### Store Display
- Grid layout with store cards
- Pagination for large datasets
- Opening hours with status indicators

### Store Details
- Modal drawer with detailed information
- Location details and facilities
- Opening hours and contact information

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions

