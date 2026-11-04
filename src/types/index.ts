export type LanguageCode = 'es' | 'en' | 'fr' | 'ar' | 'de' | 'it' | 'pt' | 'zh' | 'ja';

export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'JPY' | 'AED' | 'CAD' | 'CHF' | 'MXN';

export type UserTier = 'free' | 'plus' | 'pro' | 'business' | 'family' | 'premium';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tier: UserTier;
  role: 'traveler' | 'creator' | 'business' | 'host' | 'admin';
  homeCity: string;
  preferredCurrency: CurrencyCode;
  preferredLanguage: LanguageCode;
  visitedCountries: string[];
  badges: string[];
  savedTripsCount: number;
  referralCode: string;
  referralCredits: number;
  businessName?: string;
  isHost?: boolean;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  continent: 'Europe' | 'Asia' | 'Americas' | 'Africa' | 'Oceania' | 'Middle East';
  category: 'beach' | 'mountain' | 'culture' | 'budget' | 'nature' | 'urban' | 'hidden_gem';
  tagline: string;
  description: string;
  image: string;
  gallery: string[];
  coordinates: [number, number]; // [lat, lng]
  currency: string;
  currencyCode: CurrencyCode;
  language: string;
  avgDailyCost: number; // in EUR
  bestSeason: string;
  safetyScore: number; // 1-10
  costLevel: '$' | '$$' | '$$$' | '$$$$';
  tags: string[];
  weather: {
    tempC: number;
    condition: string;
    icon: string;
  };
  highlights: string[];
  localTips: string[];
  accessibility: string;
}

export type TransportType = 'flight' | 'train' | 'bus' | 'ferry' | 'carpool' | 'car_rental' | 'airport_transfer' | 'combined';

export interface TravelOffer {
  id: string;
  type: TransportType;
  operator: string;
  operatorLogo?: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  durationMinutes: number;
  stops: number;
  price: number; // in EUR
  currency: CurrencyCode;
  luggageIncluded: string;
  carbonKg: number;
  transferCostEst: number; // estimated cost to city center
  transferTimeMinutes: number;
  bookingUrl: string;
  affiliatePartner: string;
  tags: string[];
  rating: number;
}

export interface HotelListing {
  id: string;
  name: string;
  type: 'hotel' | 'resort' | 'hostel' | 'apartment' | 'boutique';
  destination: string;
  country: string;
  address: string;
  coordinates: [number, number];
  stars: number;
  rating: number;
  reviewCount: number;
  nightlyPrice: number;
  currency: CurrencyCode;
  amenities: {
    wifi: boolean;
    pool: boolean;
    spa: boolean;
    breakfast: boolean;
    freeCancellation: boolean;
    parking: boolean;
    airConditioning: boolean;
    petFriendly: boolean;
  };
  images: string[];
  roomTypes: Array<{
    name: string;
    bed: string;
    price: number;
    freeCancellation: boolean;
  }>;
  affiliatePartner: string;
  bookingUrl: string;
  featured?: boolean;
}

export interface HomeListing {
  id: string;
  title: string;
  propertyType: 'apartment' | 'villa' | 'cottage' | 'private_room';
  destination: string;
  country: string;
  nightlyPrice: number;
  cleaningFee: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  host: {
    name: string;
    avatar: string;
    superhost: boolean;
    responseRate: string;
  };
  photos: string[];
  rating: number;
  reviewCount: number;
  instantBookable: boolean;
  rules: string[];
}

export interface ExperienceItem {
  id: string;
  title: string;
  category: 'guided_tour' | 'museum' | 'food_tasting' | 'water_sport' | 'adventure' | 'nightlife' | 'family';
  destination: string;
  country: string;
  duration: string;
  price: number;
  currency: CurrencyCode;
  rating: number;
  reviewsCount: number;
  included: string[];
  languages: string[];
  freeCancellationHours: number;
  image: string;
  partner: string;
  bookingUrl: string;
  meetingPoint: string;
  badge?: string;
}

export interface TransportRental {
  id: string;
  type: 'car_rental' | 'airport_transfer' | 'ferry' | 'train' | 'parking';
  title: string;
  operator: string;
  pickupLocation: string;
  dropoffLocation?: string;
  dailyPrice: number;
  vehicleCategory?: string;
  seats?: number;
  luggage?: number;
  transmission?: 'Manual' | 'Automático';
  fuelPolicy?: string;
  mileage?: string;
  rating: number;
  bookingUrl: string;
  partner: string;
}

export interface InsurancePlan {
  id: string;
  provider: string;
  name: string;
  tier: 'basic' | 'comfort' | 'premium' | 'annual';
  medicalCoverage: string;
  luggageCoverage: string;
  cancellationCovered: boolean;
  pricePerDay: number;
  covidCovered: boolean;
  repatriationIncluded: boolean;
  sportsCovered: boolean;
  summary: string;
  officialDisclosure: string;
  bookingUrl: string;
}

export interface VisaRequirement {
  id: string;
  originCountry: string;
  originCountryCode: string;
  destinationCountry: string;
  destinationCountryCode: string;
  requirementType: 'visa_free' | 'evisa' | 'visa_on_arrival' | 'embassy_visa' | 'eta';
  maxStayDays: number;
  passportValidityMonths: number;
  feeEstimated: number; // in EUR
  processingTimeDays: number;
  requiredDocuments: string[];
  officialEmbassyUrl: string;
  lastVerifiedDate: string;
  notes: string;
}

export interface ItineraryActivity {
  id: string;
  time: string;
  title: string;
  description: string;
  category: 'sightseeing' | 'food' | 'culture' | 'nature' | 'relaxation' | 'transport';
  durationHours: number;
  costEstimate: number; // in EUR
  isFree: boolean;
  locationName: string;
  coordinates?: [number, number];
  accessibilityNotes?: string;
  bookingRecommended?: boolean;
}

export interface ItineraryDay {
  dayNumber: number;
  date?: string;
  title: string;
  summary: string;
  estimatedDayCost: number;
  activities: ItineraryActivity[];
}

export interface TripItinerary {
  id: string;
  destination: string;
  title: string;
  country: string;
  daysCount: number;
  totalEstimatedCost: number;
  currency: CurrencyCode;
  travelerType: string;
  budgetStyle: string;
  createdDate: string;
  days: ItineraryDay[];
  notes?: string;
  packingList?: string[];
}

export interface BookingItem {
  id: string;
  type: 'flight' | 'hotel' | 'train' | 'car' | 'activity' | 'ferry' | 'insurance';
  title: string;
  referenceNumber: string;
  provider: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location: string;
  totalPrice: number;
  currency: CurrencyCode;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
  documentName?: string;
  qrCodeData?: string;
}

export interface ExpenseItem {
  id: string;
  tripId?: string;
  date: string;
  category: 'transport' | 'accommodation' | 'food' | 'activities' | 'shopping' | 'emergency' | 'other';
  description: string;
  amount: number;
  currency: CurrencyCode;
  paidBy: string;
  splitWith: string[];
}

export interface SafetyInfo {
  countryCode: string;
  countryName: string;
  emergencyNumbers: {
    general: string;
    police: string;
    ambulance: string;
    fire: string;
  };
  safetyScore: number; // 1-10
  advisoryLevel: 'normal' | 'caution' | 'warning' | 'avoid';
  advisorySummary: string;
  embassies: Array<{
    country: string;
    city: string;
    phone: string;
    address: string;
    emergencyEmail?: string;
  }>;
  commonScams: string[];
  healthAdvice: string[];
  tapWaterSafe: boolean;
  hospitals: Array<{
    name: string;
    city: string;
    phone: string;
    hasEnglishStaff: boolean;
  }>;
}

export interface EsimPackage {
  id: string;
  country: string;
  countryCode: string;
  region: string;
  dataAllowance: string;
  validityDays: number;
  price: number;
  provider: string;
  networkTypes: string[];
  instantActivation: boolean;
  hotspotEnabled: boolean;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorCountry: string;
  destination: string;
  date: string;
  title: string;
  content: string;
  images: string[];
  likes: number;
  savedCount: number;
  tags: string[];
  rating: number;
}

export interface ShopProduct {
  id: string;
  type: 'physical' | 'digital';
  title: string;
  category: 'luggage' | 'electronics' | 'comfort' | 'security' | 'guide' | 'template';
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  isCreatorItem?: boolean;
  creatorName?: string;
  affiliateUrl?: string;
  badge?: string;
}

export interface LocalBusiness {
  id: string;
  name: string;
  category: 'hotel' | 'restaurant' | 'agency' | 'guide' | 'museum' | 'transport' | 'activity';
  destination: string;
  country: string;
  description: string;
  tier: 'basic' | 'pro' | 'business';
  rating: number;
  reviewsCount: number;
  verified: boolean;
  address: string;
  phone: string;
  website: string;
  image: string;
  specialOffer?: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
}

export interface LeadItem {
  id: string;
  travelerName: string;
  travelerEmail: string;
  destination: string;
  budgetTotal: number;
  travelersCount: number;
  dates: string;
  tripType: string;
  notes: string;
  status: 'new' | 'assigned' | 'contacted' | 'closed';
  createdDate: string;
  assignedBusiness?: string;
  leadValue: number;
}

export interface AdCampaign {
  id: string;
  advertiserName: string;
  title: string;
  tagline: string;
  targetDestination: string;
  linkUrl: string;
  placement: 'hero_sponsor' | 'destination_card' | 'search_top';
  impressions: number;
  clicks: number;
  budgetDaily: number;
  active: boolean;
}

export interface PartnerAffiliate {
  id: string;
  name: string;
  type: 'influencer' | 'creator' | 'agency' | 'blog';
  referralCode: string;
  trackingLink: string;
  clicks: number;
  conversions: number;
  commissionEarned: number;
  pendingPayout: number;
  status: 'active' | 'review' | 'paid';
}

export interface AdminMetrics {
  grossRevenueMonthly: number;
  subscriptionRevenue: number;
  affiliateRevenue: number;
  digitalStoreRevenue: number;
  localBusinessRevenue: number;
  leadsRevenue: number;
  advertisingRevenue: number;
  activeUsers: number;
  premiumSubscribers: number;
  monthlyGrowthRate: number;
  aiTokensUsedToday: number;
  aiCostEstimateToday: number;
  affiliateClicksToday: number;
  activeCampaigns: number;
  systemHealth: {
    apiStatus: 'healthy' | 'degraded' | 'offline';
    geminiStatus: 'operational' | 'throttled';
    dbStatus: 'operational';
    avgLatencyMs: number;
  };
  tierPrices: {
    plus: number;
    pro: number;
    business: number;
    family: number;
    premium: number;
  };
  enabledModules: {
    ads: boolean;
    affiliates: boolean;
    digitalStore: boolean;
    localBusinesses: boolean;
    voyaHomes: boolean;
    voyaExperiences: boolean;
    voyaInsurance: boolean;
    voyaVisa: boolean;
    voyaLeads: boolean;
    aiPlanner: boolean;
    community: boolean;
  };
}

export type AiAgentRole =
  | 'travel_planner'
  | 'flight_agent'
  | 'hotel_agent'
  | 'budget_optimizer'
  | 'family_agent'
  | 'business_saas'
  | 'translator_agent'
  | 'safety_agent'
  | 'deals_agent'
  | 'concierge_agent';

export interface AiAgentConfig {
  role: AiAgentRole;
  name: string;
  title: string;
  avatar: string;
  badge: string;
  description: string;
  systemPrompt: string;
}
