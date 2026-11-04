import fs from 'fs';
import path from 'path';
import {
  Destination,
  TravelOffer,
  BookingItem,
  ExpenseItem,
  SafetyInfo,
  EsimPackage,
  CommunityPost,
  ShopProduct,
  LocalBusiness,
  AdminMetrics,
  UserProfile,
  TripItinerary,
  HotelListing,
  HomeListing,
  ExperienceItem,
  TransportRental,
  InsurancePlan,
  VisaRequirement,
  LeadItem,
  AdCampaign,
  PartnerAffiliate
} from '../src/types';

interface StoreData {
  user: UserProfile;
  destinations: Destination[];
  travelOffers: TravelOffer[];
  bookings: BookingItem[];
  expenses: ExpenseItem[];
  itineraries: TripItinerary[];
  safetyData: Record<string, SafetyInfo>;
  esimPackages: EsimPackage[];
  communityPosts: CommunityPost[];
  shopProducts: ShopProduct[];
  localBusinesses: LocalBusiness[];
  hotels: HotelListing[];
  homes: HomeListing[];
  experiences: ExperienceItem[];
  transportRentals: TransportRental[];
  insurancePlans: InsurancePlan[];
  visaRequirements: VisaRequirement[];
  leads: LeadItem[];
  adCampaigns: AdCampaign[];
  partners: PartnerAffiliate[];
  adminMetrics: AdminMetrics;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'voya_store.json');

const INITIAL_USER: UserProfile = {
  id: 'usr_voya_001',
  name: 'Alejandro Morales',
  email: 'alejandro.morales@voyatravel.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  tier: 'pro',
  role: 'traveler',
  homeCity: 'Madrid (MAD)',
  preferredCurrency: 'EUR',
  preferredLanguage: 'es',
  visitedCountries: ['ES', 'FR', 'IT', 'JP', 'MA', 'PT'],
  badges: ['Globe Trotter', 'Budget Savvy', 'Culture Explorer', 'Photographer', 'Super Host'],
  savedTripsCount: 4,
  referralCode: 'VOYA-ALEJ78',
  referralCredits: 75,
  isHost: true
};

const INITIAL_HOTELS: HotelListing[] = [
  {
    id: 'htl_001',
    name: 'Hotel Gracery Shinjuku',
    type: 'hotel',
    destination: 'Tokio',
    country: 'Japón',
    address: '1-19-1 Kabukicho, Shinjuku-ku, Tokyo',
    coordinates: [35.6953, 139.7022],
    stars: 4,
    rating: 8.8,
    reviewCount: 3410,
    nightlyPrice: 115,
    currency: 'EUR',
    amenities: {
      wifi: true,
      pool: false,
      spa: false,
      breakfast: true,
      freeCancellation: true,
      parking: true,
      airConditioning: true,
      petFriendly: false
    },
    images: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&auto=format&fit=crop&q=80'
    ],
    roomTypes: [
      { name: 'Habitación Doble Estándar', bed: '1 cama doble grande', price: 115, freeCancellation: true },
      { name: 'Habitación Superior Godzilla View', bed: '1 cama queen', price: 145, freeCancellation: true }
    ],
    affiliatePartner: 'Booking.com Partner',
    bookingUrl: 'https://www.booking.com',
    featured: true
  },
  {
    id: 'htl_002',
    name: 'Palazzo Navona Hotel Roma',
    type: 'boutique',
    destination: 'Roma',
    country: 'Italia',
    address: 'Largo Sapienza 8, Navona, Roma',
    coordinates: [41.8978, 12.4742],
    stars: 4,
    rating: 9.1,
    reviewCount: 1820,
    nightlyPrice: 160,
    currency: 'EUR',
    amenities: {
      wifi: true,
      pool: false,
      spa: true,
      breakfast: true,
      freeCancellation: true,
      parking: false,
      airConditioning: true,
      petFriendly: true
    },
    images: [
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&auto=format&fit=crop&q=80'
    ],
    roomTypes: [
      { name: 'Classic Queen', bed: '1 cama doble', price: 160, freeCancellation: true },
      { name: 'Junior Suite con Terraza', bed: '1 cama king', price: 220, freeCancellation: true }
    ],
    affiliatePartner: 'Agoda Affiliate',
    bookingUrl: 'https://www.agoda.com',
    featured: true
  },
  {
    id: 'htl_003',
    name: 'Riad Ksar Kasbah & Spa',
    type: 'resort',
    destination: 'Marrakech',
    country: 'Marruecos',
    address: 'Derb Asouel, Kasbah, Marrakech',
    coordinates: [31.6185, -7.9865],
    stars: 4,
    rating: 9.4,
    reviewCount: 940,
    nightlyPrice: 78,
    currency: 'EUR',
    amenities: {
      wifi: true,
      pool: true,
      spa: true,
      breakfast: true,
      freeCancellation: true,
      parking: false,
      airConditioning: true,
      petFriendly: false
    },
    images: [
      'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&auto=format&fit=crop&q=80'
    ],
    roomTypes: [
      { name: 'Suite Tradicional Bereber', bed: '1 cama king', price: 78, freeCancellation: true }
    ],
    affiliatePartner: 'HotelsCombined',
    bookingUrl: 'https://www.hotelscombined.es'
  }
];

const INITIAL_HOMES: HomeListing[] = [
  {
    id: 'home_001',
    title: 'Ático Luminoso con Terraza frente al Trastevere',
    propertyType: 'apartment',
    destination: 'Roma',
    country: 'Italia',
    nightlyPrice: 95,
    cleaningFee: 30,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    amenities: ['Wi-Fi 300Mbps', 'Cocina equipada', 'Aire acondicionado', 'Terraza privada', 'Lavadora', 'Cafetera Nespresso'],
    host: {
      name: 'Matteo Rossi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      superhost: true,
      responseRate: '100% en menos de 1h'
    },
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.96,
    reviewCount: 148,
    instantBookable: true,
    rules: ['No se permiten fiestas', 'Check-in autónomo con cerradura inteligente', 'Prohibido fumar']
  },
  {
    id: 'home_002',
    title: 'Casa Tradicional Machiya en Barrio Samurai Asakusa',
    propertyType: 'cottage',
    destination: 'Tokio',
    country: 'Japón',
    nightlyPrice: 120,
    cleaningFee: 40,
    maxGuests: 5,
    bedrooms: 2,
    beds: 4,
    bathrooms: 1,
    amenities: ['Tatami original', 'Futones de algodón', 'Jardín Zen privado', 'Baño de madera Hinoki', 'Wi-Fi de bolsillo'],
    host: {
      name: 'Kenji & Yoko',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      superhost: true,
      responseRate: '98%'
    },
    photos: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.98,
    reviewCount: 215,
    instantBookable: true,
    rules: ['Descalzarse en el genkan', 'Cuidado con las puertas shoji de papel', 'Respeto al silencio nocturno']
  }
];

const INITIAL_EXPERIENCES: ExperienceItem[] = [
  {
    id: 'exp_001',
    title: 'Coliseo, Foro Romano y Palatino: Entrada Prioritaria con Arqueólogo',
    category: 'museum',
    destination: 'Roma',
    country: 'Italia',
    duration: '3 horas',
    price: 49,
    currency: 'EUR',
    rating: 4.88,
    reviewsCount: 4210,
    included: ['Entrada sin colas garantizada', 'Guía oficial acreditado en español', 'Auriculares de audio'],
    languages: ['Español', 'Inglés', 'Italiano'],
    freeCancellationHours: 24,
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80',
    partner: 'GetYourGuide Partner',
    bookingUrl: 'https://www.getyourguide.es',
    meetingPoint: 'Junto al Arco de Constantino',
    badge: 'Más Vendido'
  },
  {
    id: 'exp_002',
    title: 'Museo teamLab Planets Tokio: Experiencia de Arte Digital Inmersivo',
    category: 'adventure',
    destination: 'Tokio',
    country: 'Japón',
    duration: '2 horas',
    price: 34,
    currency: 'EUR',
    rating: 4.92,
    reviewsCount: 6890,
    included: ['Entrada digital con código QR instantáneo', 'Acceso descalzo en agua y espejos', 'Taquilla gratuita'],
    languages: ['Español', 'Japonés', 'Inglés'],
    freeCancellationHours: 48,
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
    partner: 'Klook Partner',
    bookingUrl: 'https://www.klook.com',
    meetingPoint: 'Toyosu 6-1-16, Koto City',
    badge: 'Imperdible'
  },
  {
    id: 'exp_003',
    title: 'Excursión de 1 Día al Valle de Ourika y Cordillera del Atlas con Almuerzo',
    category: 'guided_tour',
    destination: 'Marrakech',
    country: 'Marruecos',
    duration: '8 horas',
    price: 28,
    currency: 'EUR',
    rating: 4.85,
    reviewsCount: 1530,
    included: ['Transporte en minibús climatizado', 'Guía local bereber', 'Visita a cooperativa de aceite de argán'],
    languages: ['Español', 'Francés', 'Árabe'],
    freeCancellationHours: 24,
    image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&auto=format&fit=crop&q=80',
    partner: 'Civitatis Affiliate',
    bookingUrl: 'https://www.civitatis.com',
    meetingPoint: 'Recogida en tu hotel o riad en Marrakech'
  }
];

const INITIAL_TRANSPORT: TransportRental[] = [
  {
    id: 'tr_001',
    type: 'car_rental',
    title: 'Fiat 500 Hybrid o similar (Ideal ciudad y pueblos)',
    operator: 'Sixt / Hertz',
    pickupLocation: 'Aeropuerto Roma Fiumicino (FCO)',
    dropoffLocation: 'Aeropuerto Roma Fiumicino (FCO)',
    dailyPrice: 22,
    vehicleCategory: 'Económico',
    seats: 4,
    luggage: 2,
    transmission: 'Manual',
    fuelPolicy: 'Lleno a Lleno',
    mileage: 'Ilimitado',
    rating: 4.6,
    bookingUrl: 'https://www.rentalcars.com',
    partner: 'RentalCars Partner'
  },
  {
    id: 'tr_002',
    type: 'airport_transfer',
    title: 'Traslado Privado Premium en Mercedes Clase E',
    operator: 'Voya Chauffeur Connect',
    pickupLocation: 'Aeropuerto Tokio Narita (NRT)',
    dropoffLocation: 'Hotel en Shinjuku o Shibuya',
    dailyPrice: 85,
    vehicleCategory: 'Sedan Ejecutivo',
    seats: 3,
    luggage: 3,
    transmission: 'Automático',
    rating: 4.9,
    bookingUrl: 'https://www.welcomepickups.com',
    partner: 'WelcomePickups'
  }
];

const INITIAL_INSURANCE: InsurancePlan[] = [
  {
    id: 'ins_001',
    provider: 'IATI Seguros',
    name: 'IATI Escapadas & Mochilero',
    tier: 'comfort',
    medicalCoverage: '500.000 € en gastos médicos',
    luggageCoverage: '1.500 € por robo o extravío',
    cancellationCovered: true,
    pricePerDay: 3.45,
    covidCovered: true,
    repatriationIncluded: true,
    sportsCovered: true,
    summary: 'El seguro más recomendado para viajar por Europa y Asia sin adelantar ni un euro.',
    officialDisclosure: 'VOYA actúa como canal de información turística y agregador de ofertas de distribuidores habilitados por DGSFP.',
    bookingUrl: 'https://www.iatiseguros.com'
  },
  {
    id: 'ins_002',
    provider: 'Allianz Global Assistance',
    name: 'Allianz Mundo Premium',
    tier: 'premium',
    medicalCoverage: 'Ilimitada (Cobertura Total EEUU/Mundo)',
    luggageCoverage: '3.000 €',
    cancellationCovered: true,
    pricePerDay: 5.80,
    covidCovered: true,
    repatriationIncluded: true,
    sportsCovered: true,
    summary: 'Cobertura médica total para países con costes sanitarios elevados como Estados Unidos, Canadá y Japón.',
    officialDisclosure: 'Póliza suscrita por Allianz Partners. Condiciones particulares en el portal de contratación.',
    bookingUrl: 'https://www.allianz-assistance.es'
  }
];

const INITIAL_VISAS: VisaRequirement[] = [
  {
    id: 'visa_es_jp',
    originCountry: 'España / Unión Europea',
    originCountryCode: 'ES',
    destinationCountry: 'Japón',
    destinationCountryCode: 'JP',
    requirementType: 'visa_free',
    maxStayDays: 90,
    passportValidityMonths: 6,
    feeEstimated: 0,
    processingTimeDays: 0,
    requiredDocuments: ['Pasaporte biométrico válido', 'Billete de salida confirmado', 'Registro Visit Japan Web (opcional para agilizar aduana)'],
    officialEmbassyUrl: 'https://www.es.emb-japan.go.jp',
    lastVerifiedDate: '2026-10-15',
    notes: 'Exención de visado para estancias turísticas de hasta 90 días para ciudadanos españoles y de la UE.'
  },
  {
    id: 'visa_es_us',
    originCountry: 'España / Unión Europea',
    originCountryCode: 'ES',
    destinationCountry: 'Estados Unidos',
    destinationCountryCode: 'US',
    requirementType: 'eta',
    maxStayDays: 90,
    passportValidityMonths: 6,
    feeEstimated: 21,
    processingTimeDays: 3,
    requiredDocuments: ['Autorización electrónica ESTA aprobada', 'Pasaporte electrónico con chip', 'Billete de vuelta'],
    officialEmbassyUrl: 'https://esta.cbp.dhs.gov',
    lastVerifiedDate: '2026-10-20',
    notes: 'Obligatorio solicitar ESTA con al menos 72h de antelación al vuelo a través de la web oficial del gobierno de EEUU.'
  },
  {
    id: 'visa_es_ma',
    originCountry: 'España / Unión Europea',
    originCountryCode: 'ES',
    destinationCountry: 'Marruecos',
    destinationCountryCode: 'MA',
    requirementType: 'visa_free',
    maxStayDays: 90,
    passportValidityMonths: 3,
    feeEstimated: 0,
    processingTimeDays: 0,
    requiredDocuments: ['Pasaporte con vigencia mínima de 3 meses', 'Ficha de desembarque cumplimentada'],
    officialEmbassyUrl: 'https://www.consulat.ma',
    lastVerifiedDate: '2026-09-30',
    notes: 'No se requiere visado turístico. El DNI no es válido para entrar; se exige pasaporte en vigor.'
  }
];

const INITIAL_LEADS: LeadItem[] = [
  {
    id: 'lead_001',
    travelerName: 'Sofía & Marcos',
    travelerEmail: 'sofia.marcos@gmail.com',
    destination: 'Japón (Tokio, Kioto, Takayama)',
    budgetTotal: 4500,
    travelersCount: 2,
    dates: 'Abril 2027 (Cerezos en flor)',
    tripType: 'Luna de Miel y Cultura',
    notes: 'Buscamos itinerario con ryokans tradicionales con onsen privado y pases Shinkansen de primera.',
    status: 'new',
    createdDate: '2026-11-04',
    leadValue: 45
  },
  {
    id: 'lead_002',
    travelerName: 'Familia Gómez',
    travelerEmail: 'fam.gomez@empresa.es',
    destination: 'Riviera Maya y Chichén Itzá',
    budgetTotal: 6200,
    travelersCount: 4,
    dates: 'Agosto 2027',
    tripType: 'Viaje Familiar con Niños',
    notes: 'Queremos hotel todo incluido de calidad con excursiones privadas seguras a cenotes.',
    status: 'assigned',
    createdDate: '2026-11-03',
    assignedBusiness: 'Agencia Voya Select',
    leadValue: 60
  }
];

const INITIAL_CAMPAIGNS: AdCampaign[] = [
  {
    id: 'ad_001',
    advertiserName: 'Turismo de Tokio Oficial',
    title: 'Tokio Tokio: Donde la Tradición Abraza el Futuro',
    tagline: 'Descubre los 23 distritos con el pase de metro 72 horas por solo 9€.',
    targetDestination: 'Tokio',
    linkUrl: 'https://www.gotokyo.org',
    placement: 'hero_sponsor',
    impressions: 48900,
    clicks: 1420,
    budgetDaily: 25,
    active: true
  },
  {
    id: 'ad_002',
    advertiserName: 'Frecciarossa Alta Velocidad',
    title: 'Viaja entre Roma, Florencia y Venecia desde 19,90€',
    tagline: 'Trenes italianos a 300 km/h de centro a centro con Wi-Fi gratis.',
    targetDestination: 'Roma',
    linkUrl: 'https://www.trenitalia.com',
    placement: 'destination_card',
    impressions: 32100,
    clicks: 980,
    budgetDaily: 15,
    active: true
  }
];

const INITIAL_PARTNERS: PartnerAffiliate[] = [
  {
    id: 'part_001',
    name: 'MochilerosTV (YouTube / Blog)',
    type: 'creator',
    referralCode: 'MOCHILEROSTV',
    trackingLink: 'https://voyatravel.io/?ref=MOCHILEROSTV',
    clicks: 8420,
    conversions: 312,
    commissionEarned: 1420.5,
    pendingPayout: 320.0,
    status: 'active'
  },
  {
    id: 'part_002',
    name: 'Viajes El Corte Inglés Partner',
    type: 'agency',
    referralCode: 'VECI-SELECT',
    trackingLink: 'https://voyatravel.io/?ref=VECI-SELECT',
    clicks: 14890,
    conversions: 640,
    commissionEarned: 3840.0,
    pendingPayout: 850.0,
    status: 'active'
  }
];

// Import previous initial lists
import { db as previousDbInstance } from './db.ts';

class DatabaseManager {
  private data: StoreData;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): StoreData {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure new collections exist
        return {
          ...parsed,
          hotels: parsed.hotels || INITIAL_HOTELS,
          homes: parsed.homes || INITIAL_HOMES,
          experiences: parsed.experiences || INITIAL_EXPERIENCES,
          transportRentals: parsed.transportRentals || INITIAL_TRANSPORT,
          insurancePlans: parsed.insurancePlans || INITIAL_INSURANCE,
          visaRequirements: parsed.visaRequirements || INITIAL_VISAS,
          leads: parsed.leads || INITIAL_LEADS,
          adCampaigns: parsed.adCampaigns || INITIAL_CAMPAIGNS,
          partners: parsed.partners || INITIAL_PARTNERS,
        };
      }
    } catch (err) {
      console.warn('[VOYA DB] Error reading disk store:', err);
    }

    const defaultData: StoreData = {
      user: INITIAL_USER,
      destinations: previousDbInstance.getDestinations(),
      travelOffers: previousDbInstance.getTravelOffers(),
      bookings: previousDbInstance.getBookings(),
      expenses: previousDbInstance.getExpenses(),
      itineraries: previousDbInstance.getItineraries(),
      safetyData: {
        JP: previousDbInstance.getSafety('JP')!,
        IT: previousDbInstance.getSafety('IT')!,
        FR: previousDbInstance.getSafety('FR')!,
        MA: previousDbInstance.getSafety('MA')!
      },
      esimPackages: previousDbInstance.getEsimPackages(),
      communityPosts: previousDbInstance.getCommunityPosts(),
      shopProducts: previousDbInstance.getShopProducts(),
      localBusinesses: previousDbInstance.getLocalBusinesses(),
      hotels: INITIAL_HOTELS,
      homes: INITIAL_HOMES,
      experiences: INITIAL_EXPERIENCES,
      transportRentals: INITIAL_TRANSPORT,
      insurancePlans: INITIAL_INSURANCE,
      visaRequirements: INITIAL_VISAS,
      leads: INITIAL_LEADS,
      adCampaigns: INITIAL_CAMPAIGNS,
      partners: INITIAL_PARTNERS,
      adminMetrics: {
        ...previousDbInstance.getAdminMetrics(),
        tierPrices: {
          plus: 4.99,
          pro: 9.99,
          business: 29.99,
          family: 14.99,
          premium: 9.99
        },
        enabledModules: {
          ads: true,
          affiliates: true,
          digitalStore: true,
          localBusinesses: true,
          voyaHomes: true,
          voyaExperiences: true,
          voyaInsurance: true,
          voyaVisa: true,
          voyaLeads: true,
          aiPlanner: true,
          community: true
        },
        leadsRevenue: 3420,
        advertisingRevenue: 2850
      }
    };

    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(data: StoreData): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[VOYA DB] Error saving data to disk:', err);
    }
  }

  public getUser(): UserProfile {
    return this.data.user;
  }

  public updateUser(partial: Partial<UserProfile>): UserProfile {
    this.data.user = { ...this.data.user, ...partial };
    this.saveData(this.data);
    return this.data.user;
  }

  public getDestinations(): Destination[] {
    return this.data.destinations;
  }

  public getDestinationById(id: string): Destination | undefined {
    return this.data.destinations.find(d => d.id === id);
  }

  public getTravelOffers(): TravelOffer[] {
    return this.data.travelOffers;
  }

  public getHotels(): HotelListing[] {
    return this.data.hotels;
  }

  public getHomes(): HomeListing[] {
    return this.data.homes;
  }

  public addHome(home: Omit<HomeListing, 'id' | 'rating' | 'reviewCount'>): HomeListing {
    const newHome: HomeListing = {
      ...home,
      id: `home_${Date.now()}`,
      rating: 5.0,
      reviewCount: 0
    };
    this.data.homes.unshift(newHome);
    this.saveData(this.data);
    return newHome;
  }

  public getExperiences(): ExperienceItem[] {
    return this.data.experiences;
  }

  public getTransportRentals(): TransportRental[] {
    return this.data.transportRentals;
  }

  public getInsurancePlans(): InsurancePlan[] {
    return this.data.insurancePlans;
  }

  public getVisaRequirements(originCode?: string, destinationCode?: string): VisaRequirement[] {
    let list = this.data.visaRequirements;
    if (originCode) {
      list = list.filter(v => v.originCountryCode.toLowerCase() === originCode.toLowerCase());
    }
    if (destinationCode) {
      list = list.filter(v => v.destinationCountryCode.toLowerCase() === destinationCode.toLowerCase());
    }
    return list;
  }

  public getLeads(): LeadItem[] {
    return this.data.leads;
  }

  public addLead(lead: Omit<LeadItem, 'id' | 'status' | 'createdDate' | 'leadValue'>): LeadItem {
    const newLead: LeadItem = {
      ...lead,
      id: `lead_${Date.now()}`,
      status: 'new',
      createdDate: new Date().toISOString().split('T')[0],
      leadValue: 40
    };
    this.data.leads.unshift(newLead);
    // increment leads revenue
    this.data.adminMetrics.leadsRevenue += 40;
    this.saveData(this.data);
    return newLead;
  }

  public getAdCampaigns(): AdCampaign[] {
    return this.data.adCampaigns;
  }

  public getPartners(): PartnerAffiliate[] {
    return this.data.partners;
  }

  public getBookings(): BookingItem[] {
    return this.data.bookings;
  }

  public addBooking(item: Omit<BookingItem, 'id'>): BookingItem {
    const newBooking: BookingItem = {
      ...item,
      id: `book_${Date.now()}`
    };
    this.data.bookings.unshift(newBooking);
    this.saveData(this.data);
    return newBooking;
  }

  public deleteBooking(id: string): boolean {
    const len = this.data.bookings.length;
    this.data.bookings = this.data.bookings.filter(b => b.id !== id);
    if (this.data.bookings.length !== len) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public getExpenses(): ExpenseItem[] {
    return this.data.expenses;
  }

  public addExpense(item: Omit<ExpenseItem, 'id'>): ExpenseItem {
    const newExpense: ExpenseItem = {
      ...item,
      id: `exp_${Date.now()}`
    };
    this.data.expenses.unshift(newExpense);
    this.saveData(this.data);
    return newExpense;
  }

  public deleteExpense(id: string): boolean {
    const len = this.data.expenses.length;
    this.data.expenses = this.data.expenses.filter(e => e.id !== id);
    if (this.data.expenses.length !== len) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public getItineraries(): TripItinerary[] {
    return this.data.itineraries;
  }

  public saveItinerary(itinerary: TripItinerary): TripItinerary {
    const index = this.data.itineraries.findIndex(i => i.id === itinerary.id);
    if (index >= 0) {
      this.data.itineraries[index] = itinerary;
    } else {
      this.data.itineraries.unshift(itinerary);
    }
    this.saveData(this.data);
    return itinerary;
  }

  public getSafety(countryCode: string): SafetyInfo | undefined {
    return this.data.safetyData[countryCode.toUpperCase()] || this.data.safetyData['JP'];
  }

  public getEsimPackages(): EsimPackage[] {
    return this.data.esimPackages;
  }

  public getCommunityPosts(): CommunityPost[] {
    return this.data.communityPosts;
  }

  public addCommunityPost(post: Omit<CommunityPost, 'id' | 'date' | 'likes' | 'savedCount'>): CommunityPost {
    const newPost: CommunityPost = {
      ...post,
      id: `post_${Date.now()}`,
      date: 'Ahora mismo',
      likes: 1,
      savedCount: 0
    };
    this.data.communityPosts.unshift(newPost);
    this.saveData(this.data);
    return newPost;
  }

  public getShopProducts(): ShopProduct[] {
    return this.data.shopProducts;
  }

  public getLocalBusinesses(): LocalBusiness[] {
    return this.data.localBusinesses;
  }

  public getAdminMetrics(): AdminMetrics {
    return this.data.adminMetrics;
  }

  public updateAdminSettings(settings: Partial<AdminMetrics>): AdminMetrics {
    this.data.adminMetrics = { ...this.data.adminMetrics, ...settings };
    this.saveData(this.data);
    return this.data.adminMetrics;
  }
}

export const db = new DatabaseManager();
