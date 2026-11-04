import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { db } from './db.ts';
import {
  generateAiItinerary,
  chatWithAssistant,
  discoverDestinationsAi,
  translateWithAi,
  AI_AGENTS
} from './gemini.ts';

dotenv.config();

export const app = express();

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request logging for API health
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API ${req.method}] ${req.path}`);
  }
  next();
});

// --- API ROUTES ---

// 1. User Profile & Preferences
app.get('/api/user/profile', (req: Request, res: Response) => {
  const user = db.getUser();
  res.json({ success: true, data: user });
});

app.post('/api/user/profile', (req: Request, res: Response) => {
  const updated = db.updateUser(req.body);
  res.json({ success: true, data: updated });
});

// 2. Destinations
app.get('/api/destinations', (req: Request, res: Response) => {
  const { category, search, continent } = req.query;
  let items = db.getDestinations();

  if (category && category !== 'all') {
    items = items.filter(d => d.category === category);
  }
  if (continent && continent !== 'all') {
    items = items.filter(d => d.continent === continent);
  }
  if (search) {
    const s = String(search).toLowerCase();
    items = items.filter(
      d =>
        d.name.toLowerCase().includes(s) ||
        d.country.toLowerCase().includes(s) ||
        d.tags.some(t => t.toLowerCase().includes(s))
    );
  }

  res.json({ success: true, data: items });
});

app.get('/api/destinations/:id', (req: Request, res: Response) => {
  const destination = db.getDestinationById(req.params.id);
  if (!destination) {
    return res.status(404).json({ success: false, error: 'Destination not found' });
  }
  res.json({ success: true, data: destination });
});

// 3. Cheap Travel Multimodal Search (VOYA FLIGHTS & MULTIMODAL)
app.get('/api/travel/search', (req: Request, res: Response) => {
  const { origin, destination, maxPrice, type } = req.query;
  let offers = db.getTravelOffers();

  if (type && type !== 'all') {
    offers = offers.filter(o => o.type === type);
  }
  if (maxPrice) {
    offers = offers.filter(o => o.price <= Number(maxPrice));
  }
  if (destination) {
    const dest = String(destination).toLowerCase();
    offers = offers.filter(
      o =>
        o.destination.toLowerCase().includes(dest) ||
        o.destinationCode.toLowerCase().includes(dest)
    );
  }
  if (origin) {
    const orig = String(origin).toLowerCase();
    offers = offers.filter(
      o =>
        o.origin.toLowerCase().includes(orig) ||
        o.originCode.toLowerCase().includes(orig)
    );
  }

  res.json({ success: true, data: offers });
});

// 4. VOYA HOTELS
app.get('/api/hotels', (req: Request, res: Response) => {
  const { destination, maxPrice, type } = req.query;
  let hotels = db.getHotels();

  if (destination) {
    const d = String(destination).toLowerCase();
    hotels = hotels.filter(h => h.destination.toLowerCase().includes(d) || h.country.toLowerCase().includes(d));
  }
  if (type && type !== 'all') {
    hotels = hotels.filter(h => h.type === type);
  }
  if (maxPrice) {
    hotels = hotels.filter(h => h.nightlyPrice <= Number(maxPrice));
  }

  res.json({ success: true, data: hotels });
});

// 5. VOYA HOMES (Marketplace & Host Listings)
app.get('/api/homes', (req: Request, res: Response) => {
  const { destination, propertyType, maxGuests } = req.query;
  let homes = db.getHomes();

  if (destination) {
    const d = String(destination).toLowerCase();
    homes = homes.filter(h => h.destination.toLowerCase().includes(d) || h.country.toLowerCase().includes(d));
  }
  if (propertyType && propertyType !== 'all') {
    homes = homes.filter(h => h.propertyType === propertyType);
  }
  if (maxGuests) {
    homes = homes.filter(h => h.maxGuests >= Number(maxGuests));
  }

  res.json({ success: true, data: homes });
});

app.post('/api/homes', (req: Request, res: Response) => {
  const newHome = db.addHome(req.body);
  res.status(201).json({ success: true, data: newHome });
});

// 6. VOYA EXPERIENCES
app.get('/api/experiences', (req: Request, res: Response) => {
  const { destination, category } = req.query;
  let exps = db.getExperiences();

  if (destination) {
    const d = String(destination).toLowerCase();
    exps = exps.filter(e => e.destination.toLowerCase().includes(d) || e.country.toLowerCase().includes(d));
  }
  if (category && category !== 'all') {
    exps = exps.filter(e => e.category === category);
  }

  res.json({ success: true, data: exps });
});

// 7. VOYA TRANSPORT (Car Rentals, Airport Transfers)
app.get('/api/transport-rentals', (req: Request, res: Response) => {
  const { type, location } = req.query;
  let items = db.getTransportRentals();

  if (type && type !== 'all') {
    items = items.filter(t => t.type === type);
  }
  if (location) {
    const l = String(location).toLowerCase();
    items = items.filter(t => t.pickupLocation.toLowerCase().includes(l));
  }

  res.json({ success: true, data: items });
});

// 8. VOYA INSURANCE
app.get('/api/insurance', (req: Request, res: Response) => {
  res.json({ success: true, data: db.getInsurancePlans() });
});

// 9. VOYA VISA & DOCUMENTS
app.get('/api/visas', (req: Request, res: Response) => {
  const { origin, destination } = req.query;
  const visas = db.getVisaRequirements(
    origin ? String(origin) : undefined,
    destination ? String(destination) : undefined
  );
  res.json({ success: true, data: visas });
});

// 10. VOYA LEADS (B2B Lead Generation)
app.get('/api/leads', (req: Request, res: Response) => {
  res.json({ success: true, data: db.getLeads() });
});

app.post('/api/leads', (req: Request, res: Response) => {
  const lead = db.addLead(req.body);
  res.status(201).json({ success: true, data: lead });
});

// 11. VOYA ADVERTISING & CAMPAIGNS
app.get('/api/campaigns', (req: Request, res: Response) => {
  res.json({ success: true, data: db.getAdCampaigns() });
});

// 12. VOYA PARTNERS & AFFILIATES
app.get('/api/partners', (req: Request, res: Response) => {
  res.json({ success: true, data: db.getPartners() });
});

// 13. Bookings Management
app.get('/api/bookings', (req: Request, res: Response) => {
  res.json({ success: true, data: db.getBookings() });
});

app.post('/api/bookings', (req: Request, res: Response) => {
  const newBooking = db.addBooking(req.body);
  res.status(201).json({ success: true, data: newBooking });
});

app.delete('/api/bookings/:id', (req: Request, res: Response) => {
  const deleted = db.deleteBooking(req.params.id);
  res.json({ success: deleted });
});

// 14. Budget & Expenses
app.get('/api/expenses', (req: Request, res: Response) => {
  res.json({ success: true, data: db.getExpenses() });
});

app.post('/api/expenses', (req: Request, res: Response) => {
  const newExpense = db.addExpense(req.body);
  res.status(201).json({ success: true, data: newExpense });
});

app.delete('/api/expenses/:id', (req: Request, res: Response) => {
  const deleted = db.deleteExpense(req.params.id);
  res.json({ success: deleted });
});

// 15. Itineraries
app.get('/api/itineraries', (req: Request, res: Response) => {
  res.json({ success: true, data: db.getItineraries() });
});

app.post('/api/itineraries', (req: Request, res: Response) => {
  const saved = db.saveItinerary(req.body);
  res.json({ success: true, data: saved });
});

// 16. Safety & SOS
app.get('/api/safety/:countryCode', (req: Request, res: Response) => {
  const safety = db.getSafety(req.params.countryCode);
  res.json({ success: true, data: safety });
});

// 17. eSIM Connectivity
app.get('/api/connectivity/esim', (req: Request, res: Response) => {
  res.json({ success: true, data: db.getEsimPackages() });
});

// 18. Community
app.get('/api/community/posts', (req: Request, res: Response) => {
  res.json({ success: true, data: db.getCommunityPosts() });
});

app.post('/api/community/posts', (req: Request, res: Response) => {
  const post = db.addCommunityPost(req.body);
  res.status(201).json({ success: true, data: post });
});

// 19. Shop & Digital Store
app.get('/api/shop', (req: Request, res: Response) => {
  res.json({ success: true, data: db.getShopProducts() });
});

// 20. Local Businesses
app.get('/api/businesses', (req: Request, res: Response) => {
  res.json({ success: true, data: db.getLocalBusinesses() });
});

// 21. Admin Metrics & Settings
app.get('/api/admin/metrics', (req: Request, res: Response) => {
  res.json({ success: true, data: db.getAdminMetrics() });
});

app.post('/api/admin/settings', (req: Request, res: Response) => {
  const updated = db.updateAdminSettings(req.body);
  res.json({ success: true, data: updated });
});

// 22. Subscriptions Checkout & Stripe Simulation
app.post('/api/subscriptions/checkout', (req: Request, res: Response) => {
  const { tier, billingCycle, coupon } = req.body;
  const updatedUser = db.updateUser({ tier });
  
  const admin = db.getAdminMetrics();
  const priceAdded = tier === 'plus' ? 4.99 : tier === 'pro' ? 9.99 : tier === 'business' ? 29.99 : tier === 'family' ? 14.99 : 0;
  
  db.updateAdminSettings({
    premiumSubscribers: admin.premiumSubscribers + 1,
    grossRevenueMonthly: admin.grossRevenueMonthly + priceAdded,
    subscriptionRevenue: admin.subscriptionRevenue + priceAdded
  });

  res.json({
    success: true,
    invoiceId: `INV-STRIPE-${Date.now().toString().slice(-6)}`,
    tier,
    status: 'paid',
    message: `¡Suscripción a VOYA ${tier.toUpperCase()} activada con éxito!`,
    user: updatedUser
  });
});

// 23. Affiliate Click Tracking
app.post('/api/affiliate/click', (req: Request, res: Response) => {
  const admin = db.getAdminMetrics();
  db.updateAdminSettings({
    affiliateClicksToday: admin.affiliateClicksToday + 1,
    affiliateRevenue: admin.affiliateRevenue + 0.45
  });
  res.json({ success: true, tracked: true });
});

// 24. AI Endpoints (VOYA AI BRAIN Multi-Agent)
app.get('/api/ai/agents', (req: Request, res: Response) => {
  res.json({ success: true, data: Object.values(AI_AGENTS) });
});

app.post('/api/ai/assistant', async (req: Request, res: Response) => {
  try {
    const { messages, tripContext, agentRole } = req.body;
    const answer = await chatWithAssistant(messages, tripContext, agentRole);
    res.json({ success: true, data: answer });
  } catch (err: any) {
    console.error('Assistant error:', err);
    res.status(500).json({ success: false, error: err.message || 'Error processing request' });
  }
});

app.post('/api/ai/trip-planner', async (req: Request, res: Response) => {
  try {
    const itinerary = await generateAiItinerary(req.body);
    db.saveItinerary(itinerary);
    res.json({ success: true, data: itinerary });
  } catch (err: any) {
    console.error('Itinerary generation error:', err);
    res.status(500).json({ success: false, error: err.message || 'Error generating itinerary' });
  }
});

app.post('/api/ai/discovery', async (req: Request, res: Response) => {
  try {
    const suggestions = await discoverDestinationsAi(req.body);
    res.json({ success: true, data: suggestions });
  } catch (err: any) {
    console.error('Discovery error:', err);
    res.status(500).json({ success: false, error: err.message || 'Error discovering destinations' });
  }
});

app.post('/api/ai/translate', async (req: Request, res: Response) => {
  try {
    const result = await translateWithAi(req.body);
    res.json({ success: true, data: result });
  } catch (err: any) {
    console.error('Translate error:', err);
    res.status(500).json({ success: false, error: err.message || 'Error translating content' });
  }
});
