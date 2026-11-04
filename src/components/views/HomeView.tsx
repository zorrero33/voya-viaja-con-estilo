import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  Search,
  Plane,
  Train,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Calendar,
  Users,
  Coins,
  ChevronRight,
  ArrowRight,
  Sun,
  Flame,
  Award,
  Zap,
  Globe2,
  Hotel,
  Home,
  Palmtree,
  Car,
  FileCheck,
  Umbrella,
  Building2,
  Bot,
  Heart,
  Star,
  Clock,
  Filter,
  CheckCircle2,
  ChevronLeft,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Destination } from '../../types';

interface SearchResultItem {
  id: string;
  type: 'flight' | 'hotel' | 'experience' | 'car';
  title: string;
  provider: string;
  price: number;
  duration?: string;
  departureTime?: string;
  arrivalTime?: string;
  destination: string;
  rating?: number;
  tags?: string[];
  image?: string;
  bookingUrl?: string;
}

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&auto=format&fit=crop&q=85',
    destination: 'Kyoto, Japan',
    title: 'Historic Zen Gardens & Ancient Temples'
  },
  {
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1920&auto=format&fit=crop&q=85',
    destination: 'Amalfi Coast, Italy',
    title: 'Dramatic Cliffs & Mediterranean Romance'
  },
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&auto=format&fit=crop&q=85',
    destination: 'Swiss Alps, Switzerland',
    title: 'Glacial Horizons & Alpine Freedom'
  },
  {
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&auto=format&fit=crop&q=85',
    destination: 'Santorini, Greece',
    title: 'Iconic Caldera Sunsets & Cycladic Charm'
  },
  {
    image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1920&auto=format&fit=crop&q=85',
    destination: 'Sahara, Morocco',
    title: 'Golden Starlit Dunes & Berber Hospitality'
  }
];

export const HomeView: React.FC = () => {
  const { setActiveTab, setSelectedDestinationId } = useAuth();
  const { t, formatMoney, rates, currency } = useLanguage();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroSlideIdx, setHeroSlideIdx] = useState(0);

  // Search Engine State
  const [searchTab, setSearchTab] = useState<'flights' | 'hotels' | 'experiences' | 'cars' | 'packages'>('flights');
  const [origin, setOrigin] = useState('Madrid (MAD)');
  const [destinationInput, setDestinationInput] = useState('Tokyo (HND)');
  const [departDate, setDepartDate] = useState('2026-12-10');
  const [returnDate, setReturnDate] = useState('2026-12-22');
  const [travelersCount, setTravelersCount] = useState(2);

  // Search Results State
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultItem[] | null>(null);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  // Discovery Filter
  const [destinationFilter, setDestinationFilter] = useState<'all' | 'trending' | 'hidden_gems' | 'affordable' | 'luxury'>('all');
  const [savedFavorites, setSavedFavorites] = useState<string[]>(['dest_tokyo', 'dest_roma']);

  // Hero Carousel Auto-Play
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('/api/destinations')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setDestinations(data.data);
        }
      })
      .catch((err) => console.error('Error fetching destinations:', err))
      .finally(() => setLoading(false));
  }, []);

  // Real search execution across existing endpoints
  const handleExecuteSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearching(true);
    setSearchFeedback(null);
    setSearchResults(null);

    try {
      if (searchTab === 'flights' || searchTab === 'packages') {
        const destQuery = destinationInput.split(' ')[0] || 'Tokyo';
        const res = await fetch(`/api/travel/search?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destQuery)}`);
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          const items: SearchResultItem[] = data.data.map((flight: any) => ({
            id: flight.id,
            type: 'flight',
            title: `${flight.origin} → ${flight.destination}`,
            provider: flight.carrier,
            price: flight.priceTotal,
            duration: flight.duration,
            departureTime: flight.departureTime,
            arrivalTime: flight.arrivalTime,
            destination: flight.destination,
            tags: [flight.flightType === 'direct' ? 'Direct Flight' : '1 Scale', 'Hand Luggage Included'],
            bookingUrl: flight.bookingUrl
          }));
          setSearchResults(items);
        } else {
          setSearchFeedback(`No direct departures found for "${destinationInput}" from "${origin}". Showing recommended flights.`);
        }
      } else if (searchTab === 'hotels') {
        const destQuery = destinationInput.split(' ')[0] || 'Tokio';
        const res = await fetch(`/api/hotels?destination=${encodeURIComponent(destQuery)}`);
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          const items: SearchResultItem[] = data.data.map((hotel: any) => ({
            id: hotel.id,
            type: 'hotel',
            title: hotel.name,
            provider: hotel.affiliatePartner,
            price: hotel.nightlyPrice,
            duration: 'per night',
            destination: hotel.destination,
            rating: hotel.rating,
            tags: [hotel.type.toUpperCase(), `${hotel.stars} Stars`, hotel.amenities.breakfast ? 'Breakfast Included' : 'Free Wi-Fi'],
            image: hotel.images[0],
            bookingUrl: hotel.bookingUrl
          }));
          setSearchResults(items);
        }
      } else if (searchTab === 'experiences') {
        const destQuery = destinationInput.split(' ')[0] || 'Tokio';
        const res = await fetch(`/api/experiences?destination=${encodeURIComponent(destQuery)}`);
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          const items: SearchResultItem[] = data.data.map((exp: any) => ({
            id: exp.id,
            type: 'experience',
            title: exp.title,
            provider: exp.partner,
            price: exp.price,
            duration: exp.duration,
            destination: exp.destination,
            rating: exp.rating,
            tags: [exp.category.replace('_', ' ').toUpperCase(), 'Free Cancellation'],
            image: exp.image,
            bookingUrl: 'https://www.getyourguide.com'
          }));
          setSearchResults(items);
        }
      } else if (searchTab === 'cars') {
        const res = await fetch('/api/transport-rentals');
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          const items: SearchResultItem[] = data.data.map((car: any) => ({
            id: car.id,
            type: 'car',
            title: car.title,
            provider: car.provider,
            price: car.dailyRate,
            duration: 'per day',
            destination: car.pickupLocation,
            rating: 4.8,
            tags: [car.transmission, `${car.seats} Seats`, car.unlimitedMileage ? 'Unlimited Mileage' : 'Standard'],
            image: car.image,
            bookingUrl: car.bookingUrl
          }));
          setSearchResults(items);
        }
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchFeedback('Unable to connect to live booking service. Please check network.');
    } finally {
      setSearching(false);
    }
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredDestinations = destinations.filter((d) => {
    if (destinationFilter === 'all') return true;
    if (destinationFilter === 'trending') return (d.safetyScore || 9) >= 8.5;
    if (destinationFilter === 'hidden_gems') return d.tags.some((t) => t.toLowerCase().includes('gem') || t.toLowerCase().includes('naturaleza'));
    if (destinationFilter === 'affordable') return (d.avgDailyCost || 50) <= 70;
    if (destinationFilter === 'luxury') return (d.avgDailyCost || 50) > 100;
    return true;
  });

  const activeSlide = HERO_SLIDES[heroSlideIdx];

  return (
    <div className="space-y-12 pb-16 animate-fadeIn">
      {/* 1. CINEMATIC FULL-WIDTH HERO SECTION */}
      <section className="relative -mx-4 sm:-mx-8 -mt-6 overflow-hidden rounded-b-[2.5rem] border-b border-white/10 shadow-2xl min-h-[640px] lg:min-h-[720px] flex flex-col justify-between">
        {/* Background Image Carousel with Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={activeSlide.image}
            alt={activeSlide.destination}
            className="h-full w-full object-cover object-center transition-all duration-1000 transform scale-105"
          />
          {/* Deep Navy Cinematic Gradient Mask */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07152F] via-[#07152F]/75 to-[#07152F]/45" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#07152F]/30 to-[#07152F]/90" />
        </div>

        {/* Hero Top Bar Metadata */}
        <div className="relative z-10 p-6 sm:p-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-[#07152F]/70 px-4 py-1.5 backdrop-blur-md">
            <img src="/brand/voya-symbol.svg" alt="VOYA" className="h-4 w-auto" />
            <span className="text-[11px] font-bold tracking-widest text-white uppercase">
              VOYA ULTIMATE • GLOBAL TRAVEL
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-300 bg-[#07152F]/60 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
            <MapPin className="h-3.5 w-3.5 text-[#087BFF]" />
            <span>{activeSlide.destination}</span>
          </div>
        </div>

        {/* Hero Main Copy & Actions */}
        <div className="relative z-10 px-6 sm:px-12 max-w-4xl space-y-4">
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] drop-shadow-md">
            THE WORLD IS YOURS <br />
            <span className="bg-gradient-to-r from-[#087BFF] via-[#38BDF8] to-[#FF8A00] bg-clip-text text-transparent">
              TO DISCOVER.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-200 max-w-2xl font-normal leading-relaxed drop-shadow">
            Discover extraordinary destinations, compare journeys across flights, hotels and trains, and travel smarter with VOYA.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('explore')}
              className="flex items-center gap-2 rounded-xl bg-[#087BFF] px-6 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-xl shadow-[#087BFF]/30 hover:bg-[#006CE6] transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>EXPLORE THE WORLD</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => setActiveTab('planner')}
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-[#0B1B3D]/80 backdrop-blur-md px-6 py-3.5 text-xs sm:text-sm font-extrabold text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-[#FF8A00]" />
              <span>PLAN MY TRIP WITH AI</span>
            </button>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="relative z-10 px-6 sm:px-12 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroSlideIdx(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  heroSlideIdx === i ? 'w-8 bg-[#087BFF]' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
            {heroSlideIdx + 1} / {HERO_SLIDES.length} • {activeSlide.title}
          </span>
        </div>

        {/* 2. INTELLIGENT TRAVEL SEARCH ENGINE WIDGET */}
        <div className="relative z-20 mx-4 sm:mx-10 -mb-16">
          <div className="rounded-3xl border border-white/15 bg-[#0B1B3D]/95 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl">
            {/* Search Categories Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-white/10 pb-3 mb-4">
              {[
                { id: 'flights', label: 'Flights', icon: Plane },
                { id: 'hotels', label: 'Hotels', icon: Hotel },
                { id: 'experiences', label: 'Experiences', icon: Palmtree },
                { id: 'cars', label: 'Car Rentals', icon: Car },
                { id: 'packages', label: 'Flight + Hotel', icon: Zap },
              ].map((tab) => {
                const Icon = tab.icon;
                const isCurrent = searchTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSearchTab(tab.id as any);
                      setSearchResults(null);
                    }}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isCurrent
                        ? 'bg-[#087BFF] text-white shadow-md shadow-[#087BFF]/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Inputs Form */}
            <form onSubmit={handleExecuteSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Departure Location */}
              <div className="rounded-2xl border border-white/10 bg-[#07152F] p-3 focus-within:border-[#087BFF] transition-colors">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Departure Location
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#087BFF] shrink-0" />
                  <input
                    type="text"
                    required
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="e.g. Madrid (MAD)"
                    className="w-full bg-transparent text-xs font-bold text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Destination Selector */}
              <div className="rounded-2xl border border-white/10 bg-[#07152F] p-3 focus-within:border-[#087BFF] transition-colors">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Destination
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <Compass className="h-4 w-4 text-[#FF8A00] shrink-0" />
                  <input
                    type="text"
                    required
                    value={destinationInput}
                    onChange={(e) => setDestinationInput(e.target.value)}
                    placeholder="e.g. Tokyo (HND)"
                    className="w-full bg-transparent text-xs font-bold text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Travel Dates */}
              <div className="rounded-2xl border border-white/10 bg-[#07152F] p-3 focus-within:border-[#087BFF] transition-colors">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Travel Dates
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                  <input
                    type="date"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Number of Travelers */}
              <div className="rounded-2xl border border-white/10 bg-[#07152F] p-3 focus-within:border-[#087BFF] transition-colors">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Travelers
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400 shrink-0" />
                  <select
                    value={travelersCount}
                    onChange={(e) => setTravelersCount(Number(e.target.value))}
                    className="w-full bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                  >
                    <option value={1} className="bg-[#07152F] text-white">1 Adult Traveler</option>
                    <option value={2} className="bg-[#07152F] text-white">2 Adult Travelers</option>
                    <option value={3} className="bg-[#07152F] text-white">3 Travelers (Group)</option>
                    <option value={4} className="bg-[#07152F] text-white">4+ Family / Group</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={searching}
                  className="w-full h-full min-h-[50px] flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#087BFF] to-[#006CE6] px-6 text-xs sm:text-sm font-extrabold text-white shadow-xl shadow-[#087BFF]/30 hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {searching ? (
                    <span>Searching...</span>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      <span>Search {searchTab.toUpperCase()}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Spacer for overlapping search card */}
      <div className="h-12" />

      {/* 3. REAL SEARCH RESULTS DRAWER (IF SEARCHED) */}
      {searchResults && (
        <section className="rounded-3xl border border-[#087BFF]/40 bg-[#0B1B3D] p-6 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#087BFF]">
                Live Real-Time Inventory
              </span>
              <h3 className="font-heading text-xl font-bold text-white">
                Available Results for {destinationInput} ({searchResults.length} options)
              </h3>
            </div>
            <button
              onClick={() => setSearchResults(null)}
              className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              Close Results
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-[#07152F] p-4 flex flex-col justify-between hover:border-[#087BFF]/50 transition-all shadow-md"
              >
                <div>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-36 w-full rounded-xl object-cover mb-3"
                    />
                  )}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-[#087BFF]">{item.provider}</span>
                    {item.rating && (
                      <span className="flex items-center gap-1 font-bold text-amber-400">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        {item.rating}
                      </span>
                    )}
                  </div>
                  <h4 className="font-heading font-bold text-white text-base leading-tight">
                    {item.title}
                  </h4>
                  {item.duration && (
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      {item.duration} {item.departureTime ? `(${item.departureTime} - ${item.arrivalTime})` : ''}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.tags?.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="rounded-lg bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-300 border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Total Price</span>
                    <span className="font-mono text-lg font-bold text-emerald-400">
                      {formatMoney(item.price)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (item.bookingUrl) {
                        window.open(item.bookingUrl, '_blank');
                      } else {
                        setActiveTab('bookings');
                      }
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-[#087BFF] px-4 py-2 text-xs font-bold text-white hover:bg-[#006CE6] transition-all shadow-md cursor-pointer"
                  >
                    <span>Book Journey</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {searchFeedback && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-300">
          {searchFeedback}
        </div>
      )}

      {/* 4. REAL-TIME MULTIMODAL MARKET TICKER */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-[#0B1B3D] p-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#087BFF]/15 text-[#087BFF]">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">Live Forex Rate</p>
            <p className="text-xs font-bold text-white">
              1 EUR = {rates.USD} USD · {rates.JPY} JPY
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-[#0B1B3D] p-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <Plane className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">Verified Low-Cost</p>
            <p className="text-xs font-bold text-white">Direct Flights from 34 €</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-[#0B1B3D] p-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
            <Train className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">High-Speed Rail</p>
            <p className="text-xs font-bold text-white">AVE / Shinkansen Verified</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-[#0B1B3D] p-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">Safety & Assistance</p>
            <p className="text-xs font-bold text-white">Consular SOS 24/7 Active</p>
          </div>
        </div>
      </section>

      {/* 5. VOYA ULTIMATE ECOSYSTEM DIVISIONS */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#087BFF]">
              Comprehensive Platform Architecture
            </span>
            <h2 className="font-heading text-2xl font-black text-white">
              The VOYA Ecosystem
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            All services connected with verified pricing & direct booking
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { id: 'cheap_travel', label: 'VOYA Flights', icon: Plane, desc: 'Global routes' },
            { id: 'hotels', label: 'VOYA Hotels', icon: Hotel, desc: 'Free cancellation' },
            { id: 'homes', label: 'VOYA Homes', icon: Home, desc: 'Vacation villas' },
            { id: 'experiences', label: 'Experiences', icon: Palmtree, desc: 'Tours & tickets' },
            { id: 'transport', label: 'Transport', icon: Car, desc: 'Cars & transfers' },
            { id: 'insurance', label: 'Insurance', icon: Umbrella, desc: 'DGSFP medical' },
            { id: 'visas', label: 'Visas & Docs', icon: FileCheck, desc: 'Official checks' },
            { id: 'business_saas', label: 'Agency B2B', icon: Building2, desc: 'CRM & quotes' },
          ].map((div) => {
            const Icon = div.icon;
            return (
              <button
                key={div.id}
                onClick={() => setActiveTab(div.id)}
                className="group flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0B1B3D] p-3.5 hover:border-[#087BFF]/60 hover:bg-[#0F244F] transition-all cursor-pointer shadow-sm text-center"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#087BFF]/15 text-[#087BFF] group-hover:scale-110 group-hover:bg-[#087BFF] group-hover:text-white transition-all mb-2">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-white group-hover:text-[#087BFF] transition-colors leading-tight">
                  {div.label}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {div.desc}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 6. EXTRAORDINARY DESTINATION DISCOVERY */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#087BFF]">
              Curated World Escapes
            </span>
            <h2 className="font-heading text-3xl font-black text-white">
              Explore Destinations
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Handpicked international journeys with starting estimates and verified seasons.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Places' },
              { id: 'trending', label: 'Trending' },
              { id: 'hidden_gems', label: 'Hidden Gems' },
              { id: 'affordable', label: 'Under 400 €' },
              { id: 'luxury', label: 'Luxury Escapes' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setDestinationFilter(f.id as any)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  destinationFilter === f.id
                    ? 'bg-[#087BFF] text-white shadow-md'
                    : 'border border-white/10 bg-[#0B1B3D] text-slate-300 hover:text-white hover:border-white/20'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Editorial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest) => {
            const isFav = savedFavorites.includes(dest.id);
            return (
              <div
                key={dest.id}
                onClick={() => {
                  setSelectedDestinationId(dest.id);
                  setActiveTab('explore');
                }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0B1B3D] transition-all duration-300 hover:border-[#087BFF]/50 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
              >
                {/* Destination Hero Image with Badges */}
                <div className="relative h-60 w-full overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3D] via-transparent to-black/30" />

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => toggleFavorite(dest.id, e)}
                    className="absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#07152F]/70 text-white backdrop-blur-md transition-transform hover:scale-110 cursor-pointer"
                    aria-label="Save to favorites"
                  >
                    <Heart className={`h-4 w-4 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                  </button>

                  {/* Country Pill */}
                  <span className="absolute left-3.5 top-3.5 rounded-full bg-[#07152F]/80 px-3 py-1 text-xs font-bold text-white backdrop-blur-md border border-white/10">
                    {dest.country}
                  </span>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-3 left-4">
                    <span className="text-[10px] uppercase font-bold text-slate-300 block">Est. Daily</span>
                    <span className="font-mono text-xl font-black text-emerald-400">
                      {formatMoney(dest.avgDailyCost || 65)}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-xl font-bold text-white group-hover:text-[#087BFF] transition-colors">
                        {dest.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span>{(dest.safetyScore ? (dest.safetyScore / 2).toFixed(1) : '4.9')}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {dest.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/8 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#087BFF]" />
                      Best: {dest.bestSeason}
                    </span>
                    <span className="font-bold text-[#087BFF] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Explore Guide <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. NEXT-GEN AI CONCIERGE SPOTLIGHT */}
      <section className="relative overflow-hidden rounded-3xl border border-[#087BFF]/30 bg-gradient-to-br from-[#0B1B3D] via-[#07152F] to-[#0F244F] p-6 sm:p-10 shadow-2xl">
        <div className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-[#087BFF]/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#087BFF]/40 bg-[#087BFF]/10 px-3.5 py-1 text-xs font-bold text-[#087BFF]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>VOYA AI BRAIN • 10 AUTONOMOUS AGENTS</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-black text-white leading-tight">
              Intelligent Concierge.<br />
              <span className="text-[#087BFF]">Tailored to Your Budget.</span>
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Powered by Google Gemini 3.8 Flash, our multi-agent brain organizes daily itineraries, cross-references entry visas, warns of hidden tourist traps, and negotiates B2B travel quotes in real time.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setActiveTab('assistant')}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#087BFF] to-[#006CE6] px-6 py-3 text-xs font-bold text-white shadow-lg shadow-[#087BFF]/25 hover:opacity-95 transition-all cursor-pointer"
              >
                <Bot className="h-4 w-4" />
                <span>Talk with AI Brain</span>
              </button>
              <button
                onClick={() => setActiveTab('planner')}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-xs font-bold text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <span>Generate Itinerary</span>
              </button>
            </div>
          </div>

          {/* Interactive Chat Prompt Preview Card */}
          <div className="rounded-2xl border border-white/10 bg-[#07152F]/90 p-5 backdrop-blur-xl shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Atlas"
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-[#087BFF]"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">Atlas · Master Route Planner</h4>
                  <p className="text-[10px] text-emerald-400">Online & Verified Data</p>
                </div>
              </div>
              <span className="rounded-full bg-[#087BFF]/10 px-2 py-0.5 text-[10px] font-bold text-[#087BFF]">
                Gemini 3.8
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="rounded-xl bg-[#0B1B3D] p-3 text-slate-200">
                <p className="font-semibold text-[#087BFF] text-[10px] uppercase mb-1">User Query</p>
                "Plan a 7-day family trip to Morocco for under €1,500 with transport, hotels and desert tour."
              </div>

              <div className="rounded-xl border border-[#087BFF]/30 bg-[#087BFF]/10 p-3 text-slate-200 space-y-1.5">
                <p className="font-semibold text-emerald-400 text-[10px] uppercase">Atlas Itinerary Proposal</p>
                <p className="text-xs">
                  ✓ Marrakech Medina Riad (3 nights) · ~210 €<br />
                  ✓ High Atlas & Sahara Luxury Camp (2 nights) · ~420 €<br />
                  ✓ High-speed Al Boraq train to Tangier · ~35 €/pax<br />
                  <strong>Total Estimated: 1,280 € (Saves 220 € vs agency quote)</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('assistant')}
              className="w-full rounded-xl bg-white/5 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Open Live Conversation →
            </button>
          </div>
        </div>
      </section>

      {/* 8. GLOBAL CORPORATE FOOTER */}
      <footer className="rounded-3xl border border-white/8 bg-[#0B1B3D] p-8 sm:p-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <img src="/brand/voya-symbol.svg" alt="VOYA" className="h-8 w-auto" />
              <span className="font-heading text-2xl font-black text-white">VOYA</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              VOYA ULTIMATE is the premier international travel superapp, uniting global multi-modal search, vacation rentals, certified travel medical coverage and next-generation autonomous AI planning.
            </p>
            <div className="pt-2 text-[11px] text-slate-500">
              © {new Date().getFullYear()} VOYA Global Technologies S.L. All rights reserved.
            </div>
          </div>

          {/* Column 1: Divisions */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Travel Verticals</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><button onClick={() => setActiveTab('cheap_travel')} className="hover:text-white transition-colors">VOYA Flights</button></li>
              <li><button onClick={() => setActiveTab('hotels')} className="hover:text-white transition-colors">VOYA Hotels</button></li>
              <li><button onClick={() => setActiveTab('homes')} className="hover:text-white transition-colors">VOYA Homes</button></li>
              <li><button onClick={() => setActiveTab('experiences')} className="hover:text-white transition-colors">Experiences & Tours</button></li>
              <li><button onClick={() => setActiveTab('transport')} className="hover:text-white transition-colors">Car Rental</button></li>
            </ul>
          </div>

          {/* Column 2: Protection & Safety */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Safety & Legal</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><button onClick={() => setActiveTab('insurance')} className="hover:text-white transition-colors">DGSFP Medical Insurance</button></li>
              <li><button onClick={() => setActiveTab('visas')} className="hover:text-white transition-colors">Official Visas & Passports</button></li>
              <li><button onClick={() => setActiveTab('safety')} className="hover:text-white transition-colors">SOS Consular Support</button></li>
              <li><button onClick={() => setActiveTab('esim')} className="hover:text-white transition-colors">Global 5G eSIM</button></li>
              <li><button onClick={() => setActiveTab('pricing')} className="hover:text-white transition-colors">Refund & Fair Terms</button></li>
            </ul>
          </div>

          {/* Column 3: Corporate & B2B */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Business Solutions</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><button onClick={() => setActiveTab('business_saas')} className="hover:text-white transition-colors">Travel Agency SaaS</button></li>
              <li><button onClick={() => setActiveTab('business_saas')} className="hover:text-white transition-colors">Qualified Traveler Leads</button></li>
              <li><button onClick={() => setActiveTab('admin')} className="hover:text-white transition-colors">Master Admin Console</button></li>
              <li><button onClick={() => setActiveTab('shop')} className="hover:text-white transition-colors">Creator Marketplace</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span>Cookie Settings</span>
            <span>·</span>
            <span>Security Audited</span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">
            DISCOVER THE WORLD. TRAVEL MORE.
          </span>
        </div>
      </footer>
    </div>
  );
};
