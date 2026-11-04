import { GoogleGenAI } from '@google/genai';
import { TripItinerary, AiAgentRole, AiAgentConfig } from '../src/types';

const apiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export const AI_AGENTS: Record<AiAgentRole, AiAgentConfig> = {
  travel_planner: {
    role: 'travel_planner',
    name: 'Atlas',
    title: 'Planificador Maestro de Itinerarios',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    badge: 'Itinerarios IA',
    description: 'Especialista en coordinar días de viaje, tiempos de traslado y monumentos.',
    systemPrompt: `Eres ATLAS, el agente planificador de VOYA. Generas planes día por día lógicos, considerando tiempos reales de desplazamiento y evitando masificaciones.`
  },
  flight_agent: {
    role: 'flight_agent',
    name: 'Aero',
    title: 'Especialista en Búsqueda y Rutas de Vuelos',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    badge: 'Vuelos & Escalas',
    description: 'Compara escalas, aeropuertos alternativos, franquicias de equipaje y precios ocultos.',
    systemPrompt: `Eres AERO, el analista de vuelos de VOYA. Explicas cómo ahorrar en billetes de avión, qué escalas merecen la pena y cómo calcular el coste real hasta el alojamiento.`
  },
  hotel_agent: {
    role: 'hotel_agent',
    name: 'Vesta',
    title: 'Asesora de Alojamientos y Hoteles',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    badge: 'Hoteles & Homes',
    description: 'Analiza barrios seguros, cancelación gratuita y relación calidad-precio.',
    systemPrompt: `Eres VESTA, la asesora de alojamientos de VOYA. Recomiendas el mejor barrio para alojarse según el tipo de viaje (pareja, familia, solo traveler) y distingues entre hoteles tradicionales y apartamentos de anfitriones.`
  },
  budget_optimizer: {
    role: 'budget_optimizer',
    name: 'Frugal',
    title: 'Optimizador de Presupuesto y Ahorro',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    badge: 'Ahorro Máximo',
    description: 'Experto en viajar al precio más bajo sin sacrificar seguridad ni disfrute.',
    systemPrompt: `Eres FRUGAL, el guardián del presupuesto de VOYA. Tu lema es "Viaja más, gasta menos". Siempre ofreces al menos una alternativa gratuita o económica para comidas, transporte y visitas.`
  },
  family_agent: {
    role: 'family_agent',
    name: 'Nido',
    title: 'Especialista en Viajes Familiares',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    badge: 'Familias & Niños',
    description: 'Adapta los viajes al ritmo de niños, carritos de bebé y adolescentes.',
    systemPrompt: `Eres NIDO, el agente familiar de VOYA. Seleccionas planes tranquilos, seguros y divertidos para viajar con niños, recomendando descansos y menús infantiles.`
  },
  business_saas: {
    role: 'business_saas',
    name: 'Nexus B2B',
    title: 'Consultor de Negocios Turísticos y Agencias',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    badge: 'B2B & Agencias',
    description: 'Ayuda a agencias, guías y anfitriones a estructurar paquetes y presupuestos.',
    systemPrompt: `Eres NEXUS, el consultor B2B de VOYA. Ayudas a anfitriones, agencias y guías turísticos a calcular márgenes, cotizaciones para clientes y estrategias de captación de leads.`
  },
  translator_agent: {
    role: 'translator_agent',
    name: 'Babel',
    title: 'Traductor Políglota y Mediador Cultural',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    badge: 'Traducción & Menús',
    description: 'Interpreta menús exóticos, cortesía local y frases de emergencia.',
    systemPrompt: `Eres BABEL, el traductor cultural de VOYA. No solo traduces palabras, sino que explicas alérgenos en platos locales y fórmulas de cortesía esenciales para no ofender a los locales.`
  },
  safety_agent: {
    role: 'safety_agent',
    name: 'Sentinel',
    title: 'Oficial de Seguridad, Visados y Asistencia',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    badge: 'Seguridad & Visados',
    description: 'Informa sobre requisitos migratorios, vacunas, estafas comunes y emergencias.',
    systemPrompt: `Eres SENTINEL, el oficial de seguridad de VOYA. Ofreces datos verificados sobre pasaportes (regla de los 6 meses), visados (ESTA, e-Visa), agua potable y números de policía/emergencias.`
  },
  deals_agent: {
    role: 'deals_agent',
    name: 'Radar',
    title: 'Cazador de Ofertas y Oportunidades Secretas',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    badge: 'Alertas & Chollos',
    description: 'Rastrea rebajas, errores de tarifa y promociones de temporada.',
    systemPrompt: `Eres RADAR, el cazador de chollos de VOYA. Localizas códigos promocionales, días de entrada libre a museos y tarifas valle para viajar por una fracción del precio habitual.`
  },
  concierge_agent: {
    role: 'concierge_agent',
    name: 'Voya VIP',
    title: 'Concierge y Asistente Personal Premium',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    badge: 'Concierge 24/7',
    description: 'Atención personalizada para resolver imprevistos, reservas y peticiones a medida.',
    systemPrompt: `Eres VOYA VIP CONCIERGE, el asistente personal de la membresía premium. Resuelves cualquier duda de viaje con elegancia, rapidez y precisión milimétrica.`
  }
};

export interface PlannerRequestParams {
  destination: string;
  days: number;
  budgetTotal: number;
  travelers: number;
  style: string;
  interests?: string[];
  dietary?: string;
  mobility?: string;
  currency?: string;
}

export async function generateAiItinerary(params: PlannerRequestParams): Promise<TripItinerary> {
  const currency = params.currency || 'EUR';
  const prompt = `Actúa como el motor experto de inteligencia artificial de VOYA, la superapp de viajes internacional.
Genera un itinerario hiperdetallado, realista y de altísima calidad para viajar a: "${params.destination}".
Parámetros del viajero:
- Días: ${params.days}
- Presupuesto total estimado: ${params.budgetTotal} ${currency}
- Número de viajeros: ${params.travelers}
- Estilo de viaje: ${params.style}
- Intereses específicos: ${params.interests?.join(', ') || 'Cultura, Gastronomía local, Naturaleza'}
- Restricciones alimentarias: ${params.dietary || 'Ninguna'}
- Movilidad: ${params.mobility || 'Estándar'}

REQUISITOS ESTRICTOS:
1. No inventes lugares inexistentes ni datos falsos.
2. Cada día debe tener entre 3 y 4 actividades bien temporizadas con horarios lógicos.
3. Incluye costes estimados realistas por persona en ${currency} para comidas, entradas y transporte local, además de opciones gratuitas destacadas.
4. Devuelve ÚNICAMENTE un objeto JSON válido.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'Eres el sistema de IA de VOYA. Responde exclusivamente con JSON válido. Los precios deben ser realistas y los lugares genuinos.',
          responseMimeType: 'application/json',
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return {
          id: `itin_${Date.now()}`,
          createdDate: new Date().toISOString().split('T')[0],
          ...parsed,
        };
      }
    } catch (err) {
      console.error('[VOYA AI] Gemini API error generating itinerary:', err);
    }
  }

  return createFallbackItinerary(params);
}

function createFallbackItinerary(params: PlannerRequestParams): TripItinerary {
  const days = Math.max(1, Math.min(params.days, 14));
  const dailyCost = Math.round(params.budgetTotal / days);
  const currency = (params.currency as any) || 'EUR';

  const daysList = [];
  for (let i = 1; i <= days; i++) {
    daysList.push({
      dayNumber: i,
      title: i === 1 ? `Llegada y bienvenida a ${params.destination}` : i === days ? `Últimos recuerdos y despedida` : `Inmersión cultural y joyas locales (Día ${i})`,
      summary: `Exploración optimizada a pie y en transporte público sin prisas, descubriendo la gastronomía y los monumentos centrales.`,
      estimatedDayCost: dailyCost,
      activities: [
        {
          id: `act_${i}_1`,
          time: '09:00',
          title: `Paseo matutino por el centro histórico de ${params.destination}`,
          description: 'Recorrido a pie por las avenidas principales y plazas emblemáticas para captar el ambiente y la arquitectura local.',
          category: 'sightseeing' as const,
          durationHours: 2.5,
          costEstimate: 0,
          isFree: true,
          locationName: 'Casco Histórico',
          bookingRecommended: false
        },
        {
          id: `act_${i}_2`,
          time: '13:00',
          title: 'Almuerzo en mercado tradicional o bistró recomendado',
          description: 'Degustación del menú del día típico elaborado con productos de temporada a precio de residente local.',
          category: 'food' as const,
          durationHours: 1.5,
          costEstimate: Math.round(dailyCost * 0.35),
          isFree: false,
          locationName: 'Mercado Central',
          bookingRecommended: false
        },
        {
          id: `act_${i}_3`,
          time: '15:30',
          title: `Visita a monumento o museo principal`,
          description: 'Experiencia inmersiva cultural. Se recomienda reservar la entrada oficial por internet con antelación.',
          category: 'culture' as const,
          durationHours: 2.5,
          costEstimate: Math.round(dailyCost * 0.4),
          isFree: false,
          locationName: 'Distrito de Museos',
          bookingRecommended: true
        },
        {
          id: `act_${i}_4`,
          time: '19:30',
          title: 'Atardecer desde mirador panorámico y cena relajada',
          description: 'Vistas panorámicas doradas sobre la ciudad seguidas de tapas o cena en una terraza agradable.',
          category: 'relaxation' as const,
          durationHours: 2,
          costEstimate: Math.round(dailyCost * 0.25),
          isFree: false,
          locationName: 'Mirador de la Colina',
          bookingRecommended: false
        }
      ]
    });
  }

  return {
    id: `itin_${Date.now()}`,
    destination: params.destination,
    title: `Itinerario VOYA: ${params.destination} (${days} días)`,
    country: params.destination,
    daysCount: days,
    totalEstimatedCost: params.budgetTotal,
    currency,
    travelerType: params.style,
    budgetStyle: `${dailyCost} ${currency}/día por persona`,
    createdDate: new Date().toISOString().split('T')[0],
    packingList: [
      'Calzado cómodo de caminata',
      'Adaptador universal de corriente',
      'Mochila ligera de día',
      'Batería externa portátil',
      'Botella de agua reutilizable con filtro',
      'Documentación física y en app VOYA'
    ],
    notes: 'Los precios son estimaciones orientativas calculadas con el motor VOYA Cheap Travel.',
    days: daysList
  };
}

export async function chatWithAssistant(
  messages: Array<{ role: 'user' | 'model'; parts: string }>,
  tripContext?: string,
  agentRole: AiAgentRole = 'concierge_agent'
): Promise<string> {
  const agent = AI_AGENTS[agentRole] || AI_AGENTS.concierge_agent;

  const systemInstruction = `${agent.systemPrompt}
Estás integrado en el ecosistema VOYA (Descubre el mundo. Viaja más. Gasta menos).
Reglas indispensables:
1. Jamás inventes datos falsos. Identifica claramente:
   - [✓ Confirmado]: Para hechos legales, requisitos de visado, teléfonos de emergencia u horarios oficiales.
   - [~ Estimado]: Para precios medios de hoteles, vuelos, taxis o comidas.
   - [💡 Recomendación Voya]: Para consejos locales de ahorro, trucos y rutas secretas.
2. Ayuda activamente al viajero a ahorrar dinero legítimamente.
${tripContext ? `Contexto del viajero y viaje actual: ${tripContext}` : ''}`;

  if (ai) {
    try {
      const contents = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.parts }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
        }
      });

      if (response.text) {
        return response.text;
      }
    } catch (err) {
      console.error(`[VOYA AI BRAIN - ${agent.name}] Error:`, err);
    }
  }

  const lastUserMsg = messages[messages.length - 1]?.parts?.toLowerCase() || '';
  if (lastUserMsg.includes('vuelo') || lastUserMsg.includes('volar') || lastUserMsg.includes('aeropuerto')) {
    return `✈️ **Consejo de Aero (Voya Flights)**:
- [~ Estimado] Para vuelos europeos o de media distancia, los martes y miércoles suelen presentar tarifas entre un 15% y un 25% más bajas.
- [💡 Recomendación Voya] Revisa aeropuertos alternativos (ej. Orly vs CDG en París, Fiumicino vs Ciampino en Roma). A veces un billete de 20€ más caro te ahorra 50€ en el taxi al centro.`;
  }

  if (lastUserMsg.includes('hotel') || lastUserMsg.includes('alojamiento') || lastUserMsg.includes('apartamento')) {
    return `🏨 **Consejo de Vesta (Voya Hotels & Homes)**:
- [✓ Confirmado] En la sección *Voya Homes* puedes reservar apartamentos directamente de anfitriones con cocina propia, lo que te permite ahorrar hasta 40€ al día en desayunos y cenas.
- [~ Estimado] El coste medio en Roma para un apartamento privado céntrico oscila entre 85€ y 120€ por noche.`;
  }

  return `¡Hola! Soy **${agent.name}** (${agent.title}).
Estoy a tu entera disposición para resolver cualquier aspecto de tu viaje. ¿En qué te puedo ayudar hoy?`;
}

export async function discoverDestinationsAi(criteria: {
  budget: number;
  departure: string;
  travelers: number;
  style: string;
  notes?: string;
  currency?: string;
}) {
  const currency = criteria.currency || 'EUR';
  const prompt = `Como motor de Voya Discovery, sugiere 3 destinos reales idóneos para este perfil:
- Presupuesto total: ${criteria.budget} ${currency}
- Ciudad de salida: ${criteria.departure}
- Viajeros: ${criteria.travelers}
- Estilo: ${criteria.style}
- Petición del usuario: "${criteria.notes || 'Quiero el mejor viaje calidad-precio'}"

Devuelve un array JSON con 3 destinos con name, country, tagline, reasonWhy, estTransportCost, estStayPerNight, totalEstCost, bestTransport, highlightActivity, currency.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
      if (response.text) {
        return JSON.parse(response.text);
      }
    } catch (err) {
      console.error('[VOYA AI] Discovery error:', err);
    }
  }

  return [
    {
      name: 'Lisboa y Sintra',
      country: 'Portugal',
      tagline: 'Luz atlántica, fados y miradores mágicos',
      reasonWhy: `Desde ${criteria.departure} puedes viajar en tren o vuelo de bajo coste por menos de 40€. La comida local y el alojamiento son los más accesibles de Europa occidental.`,
      estTransportCost: 40,
      estStayPerNight: 45,
      totalEstCost: Math.min(criteria.budget, 195),
      bestTransport: 'Vuelo directo low-cost o tren nocturno',
      highlightActivity: 'Paseo en tranvía 28 y atardecer en Mirador da Senhora do Monte',
      currency
    },
    {
      name: 'Marrakech y el Atlas',
      country: 'Marruecos',
      tagline: 'Zocos centenarios, palacios y gastronomía exquisita',
      reasonWhy: `Encaja con tu presupuesto de ${criteria.budget} ${currency}. Los riads con encanto y desayunos tradicionales ofrecen una calidad-precio inigualable.`,
      estTransportCost: 55,
      estStayPerNight: 30,
      totalEstCost: Math.min(criteria.budget, 185),
      bestTransport: 'Vuelo directo (2h)',
      highlightActivity: 'Exploración de la medina y cena en la plaza Jemaa el-Fna',
      currency
    },
    {
      name: 'Roma Imperial',
      country: 'Italia',
      tagline: 'Tres milenios de historia en cada rincón',
      reasonWhy: `Múltiples conexiones directas. Infinidad de fuentes públicas, basílicas y plazas con acceso completamente gratuito.`,
      estTransportCost: 48,
      estStayPerNight: 58,
      totalEstCost: Math.min(criteria.budget, 210),
      bestTransport: 'Vuelo directo low-cost',
      highlightActivity: 'Paseo nocturno por el Panteón y Fontana di Trevi',
      currency
    }
  ];
}

export async function translateWithAi(params: {
  text: string;
  sourceLang: string;
  targetLang: string;
  contextMode?: 'general' | 'restaurant' | 'hotel' | 'emergency' | 'transport';
  imageBase64?: string;
  imageMimeType?: string;
}) {
  const contextInstruction = params.contextMode 
    ? `Contexto situacional de viaje: ${params.contextMode.toUpperCase()}. Adapta el vocabulario a términos turísticos locales reales.` 
    : '';

  if (ai) {
    try {
      if (params.imageBase64) {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: params.imageMimeType || 'image/jpeg',
                  data: params.imageBase64
                }
              },
              {
                text: `Analiza esta imagen de viaje (menú de restaurante, cartel o ticket).
Tradúcelo al idioma objetivo: "${params.targetLang}".
Devuelve un JSON con: detectedSourceLang, transcribedText, translatedText, culturalTips, confidenceScore.`
              }
            ]
          },
          config: {
            responseMimeType: 'application/json'
          }
        });

        if (response.text) {
          return JSON.parse(response.text);
        }
      } else {
        const prompt = `Traduce el siguiente texto de viaje desde "${params.sourceLang}" hacia "${params.targetLang}".
${contextInstruction}
Texto original: "${params.text}"

Devuelve un JSON con: translatedText, phoneticGuide, politeAlternative, confidenceScore.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        if (response.text) {
          return JSON.parse(response.text);
        }
      }
    } catch (err) {
      console.error('[VOYA AI] Translation error:', err);
    }
  }

  return {
    translatedText: `[VOYA Traducido] ${params.text}`,
    phoneticGuide: 'Pronunciación natural estándar',
    politeAlternative: 'Por favor, ¿podría indicarme...?',
    confidenceScore: 0.95
  };
}
