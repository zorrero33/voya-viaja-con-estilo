import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Lightbulb,
  CornerDownLeft,
  User,
  Trash2,
  Plane,
  Compass,
  Home,
  PiggyBank,
  Users2,
  Building2,
  Languages,
  Tag,
  Crown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AiAgentRole, AiAgentConfig } from '../../types';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  agentRole?: AiAgentRole;
}

const AGENT_LIST: Array<{
  role: AiAgentRole;
  name: string;
  title: string;
  badge: string;
  icon: any;
  avatar: string;
  color: string;
  quickPrompts: string[];
  welcomeText: string;
}> = [
  {
    role: 'travel_planner',
    name: 'Atlas',
    title: 'Planificador Maestro de Itinerarios',
    badge: 'Itinerarios IA',
    icon: Compass,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    color: 'from-blue-600 to-indigo-600',
    quickPrompts: [
      'Crea un itinerario de 5 días en Kioto optimizando tiempos',
      '¿Cuál es el mejor orden para visitar los museos de París sin colas?',
      'Plan de fin de semana barato en Lisboa para dos personas'
    ],
    welcomeText: '¡Hola viajero! Soy **Atlas**, tu planificador de rutas. Diseñaré un itinerario día por día optimizando traslados y evitando aglomeraciones. ¿A dónde viajas?'
  },
  {
    role: 'flight_agent',
    name: 'Aero',
    title: 'Especialista en Búsqueda y Rutas de Vuelos',
    badge: 'Vuelos & Escalas',
    icon: Plane,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    color: 'from-cyan-600 to-blue-600',
    quickPrompts: [
      '¿Qué día de la semana suele ser más barato volar a Bangkok?',
      '¿Vale la pena hacer escala de 7 horas en Doha para salir a la ciudad?',
      '¿Cómo evitar recargos sorpresa por maleta de mano?'
    ],
    welcomeText: '¡Hola! Soy **Aero**, analista de rutas y tarifas aéreas de VOYA. ¿Qué vuelo necesitas encontrar o qué escala quieres evaluar?'
  },
  {
    role: 'hotel_agent',
    name: 'Vesta',
    title: 'Asesora de Alojamientos y Hoteles',
    badge: 'Hoteles & Homes',
    icon: Home,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    color: 'from-teal-600 to-emerald-600',
    quickPrompts: [
      '¿Cuál es el barrio más seguro y céntrico de Roma para alojarse?',
      '¿Conviene más hotel o apartamento de anfitrión en Tokio?',
      '¿Cómo verificar si un alojamiento tiene buena conexión a internet?'
    ],
    welcomeText: '¡Saludos! Soy **Vesta**, tu asesora de hoteles y casas vacacionales. Te recomendaré la mejor zona según tu presupuesto y estilo de viaje.'
  },
  {
    role: 'budget_optimizer',
    name: 'Frugal',
    title: 'Optimizador de Presupuesto y Ahorro',
    badge: 'Ahorro Máximo',
    icon: PiggyBank,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    color: 'from-emerald-600 to-green-600',
    quickPrompts: [
      '¿Cuánto cuesta comer bien en Londres gastando menos de £25 al día?',
      'Tarjetas de transporte ilimitadas vs billetes sueltos en Nueva York',
      'Actividades y miradores gratuitos en Barcelona'
    ],
    welcomeText: '¡Hola! Soy **Frugal**. Mi filosofía es simple: *Viaja más, gasta menos*. Pregúntame cómo reducir costes de transporte, comida y atracciones sin renunciar al disfrute.'
  },
  {
    role: 'family_agent',
    name: 'Nido',
    title: 'Especialista en Viajes Familiares',
    badge: 'Familias & Niños',
    icon: Users2,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    color: 'from-purple-600 to-pink-600',
    quickPrompts: [
      'Plan para viajar a Ámsterdam con un niño de 4 años en carrito',
      'Destinos de playa familiares seguros con aguas tranquilas',
      '¿Qué llevar en el bolso de cabina para un vuelo largo con niños?'
    ],
    welcomeText: '¡Hola familia! Soy **Nido**. Coordino viajes con niños y bebés para que todos disfruten a un ritmo tranquilo y sin estrés.'
  },
  {
    role: 'business_saas',
    name: 'Nexus B2B',
    title: 'Consultor de Negocios Turísticos y Agencias',
    badge: 'B2B & Agencias',
    icon: Building2,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    color: 'from-indigo-600 to-purple-600',
    quickPrompts: [
      '¿Cómo estructurar un margen del 18% en un paquete a Marruecos?',
      '¿Qué requisitos contractuales debe tener un tour privado con clientes?',
      'Estrategia para captar clientes que buscan lunas de miel'
    ],
    welcomeText: '¡Bienvenido colega del sector! Soy **Nexus**, consultor de negocios turísticos de VOYA. ¿Qué paquete, cotización o estrategia comercial analizamos?'
  },
  {
    role: 'translator_agent',
    name: 'Babel',
    title: 'Traductor Políglota y Mediador Cultural',
    badge: 'Traductor Cultural',
    icon: Languages,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    color: 'from-amber-600 to-orange-600',
    quickPrompts: [
      '¿Cómo pedir en japonés comida vegetariana sin caldo de pescado?',
      'Costumbres básicas de propinas y cortesía en restaurantes en EE. UU.',
      'Frases clave para regatear con respeto en Marrakech'
    ],
    welcomeText: '¡Hola! Soy **Babel**. No solo traduzco idiomas, sino que te enseño cortesía local, alérgenos en menús y normas culturales para que nunca tengas un malentendido.'
  },
  {
    role: 'safety_agent',
    name: 'Sentinel',
    title: 'Oficial de Seguridad, Visados y Asistencia',
    badge: 'Seguridad & Visados',
    icon: ShieldCheck,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    color: 'from-rose-600 to-red-600',
    quickPrompts: [
      '¿Necesito pasaporte con 6 meses de vigencia para viajar a Tailandia?',
      'Estafas habituales con taxis en Estambul y cómo evitarlas',
      '¿Es seguro beber agua del grifo en Costa Rica?'
    ],
    welcomeText: '¡Atención viajero! Soy **Sentinel**, el oficial de seguridad y requisitos consulares de VOYA. Pregúntame sobre vacunas, validez de pasaportes o números de emergencia.'
  },
  {
    role: 'deals_agent',
    name: 'Radar',
    title: 'Cazador de Ofertas y Oportunidades Secretas',
    badge: 'Alertas & Chollos',
    icon: Tag,
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    color: 'from-orange-600 to-amber-600',
    quickPrompts: [
      '¿Cuáles son los días gratis de los mejores museos de Madrid?',
      '¿Cuándo bajan de precio los trenes de alta velocidad en Italia?',
      '¿Cómo conseguir upgrade de habitación de hotel al hacer check-in?'
    ],
    welcomeText: '¡Oído atento! Soy **Radar**, cazador de tarifas secretas y promociones en tiempo real. ¿En qué ciudad buscas una oportunidad?'
  },
  {
    role: 'concierge_agent',
    name: 'Voya VIP',
    title: 'Concierge y Asistente Personal Premium',
    badge: 'Concierge 24/7',
    icon: Crown,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    color: 'from-amber-500 via-rose-500 to-indigo-600',
    quickPrompts: [
      'Gestiona reserva en un restaurante con estrellas Michelin en Milán',
      'Servicio de chofer privado con coche premium en Ginebra',
      'Atención prioritaria para cambios urgentes de vuelo por huelga'
    ],
    welcomeText: 'Es un placer servirle. Soy **Voya VIP Concierge**. Estoy a su entera disposición para resolver cualquier solicitud exclusiva o imprevisto de viaje.'
  }
];

export const AssistantView: React.FC = () => {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<AiAgentRole>('travel_planner');
  const activeAgent = AGENT_LIST.find((a) => a.role === selectedRole) || AGENT_LIST[0];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_init',
      role: 'model',
      text: activeAgent.welcomeText,
      timestamp: 'Ahora',
      agentRole: selectedRole
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSelectAgent = (role: AiAgentRole) => {
    setSelectedRole(role);
    const agent = AGENT_LIST.find((a) => a.role === role);
    if (agent) {
      setMessages((prev) => [
        ...prev,
        {
          id: `agent_switch_${Date.now()}`,
          role: 'model',
          text: `Has conectado con **${agent.name}** (${agent.title}).\n\n${agent.welcomeText}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agentRole: role
        }
      ]);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        parts: m.text
      }));

      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          tripContext: `Usuario: ${user?.name || 'Viajero'}, Ciudad: ${user?.homeCity || 'Madrid'}, Plan: ${user?.tier || 'free'}`,
          agentRole: selectedRole
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        const botMsg: ChatMessage = {
          id: `bot_${Date.now()}`,
          role: 'model',
          text: data.data,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agentRole: selectedRole
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg_clear_${Date.now()}`,
        role: 'model',
        text: `Historial reiniciado. Estás conversando con **${activeAgent.name}**. ¿Qué consulta tienes?`,
        timestamp: 'Ahora',
        agentRole: selectedRole
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-6xl mx-auto space-y-3">
      {/* 10-Agent Carousel Selector */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-2.5 backdrop-blur-md">
        <div className="flex items-center justify-between pb-2 px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              VOYA Multi-Agent Brain (10 Agentes Especializados)
            </span>
          </div>
          <span className="text-[10px] text-slate-500 hidden sm:inline">
            Elige un agente según tu necesidad
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {AGENT_LIST.map((agent) => {
            const isSelected = agent.role === selectedRole;
            const Icon = agent.icon;
            return (
              <button
                key={agent.role}
                onClick={() => handleSelectAgent(agent.role)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-600/25 scale-[1.02]'
                    : 'border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="h-6 w-6 rounded-full object-cover ring-1 ring-white/20"
                />
                <div className="text-left">
                  <div className="flex items-center gap-1 leading-tight">
                    <span className="font-bold">{agent.name}</span>
                    <Icon className="h-3 w-3 opacity-80" />
                  </div>
                  <span className="text-[10px] opacity-75 block">{agent.badge}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Agent Banner */}
      <div className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 px-4 py-2 text-xs">
        <div className="flex items-center gap-3">
          <img
            src={activeAgent.avatar}
            alt={activeAgent.name}
            className="h-8 w-8 rounded-full object-cover ring-2 ring-cyan-500/40"
          />
          <div>
            <span className="font-heading font-bold text-white text-sm flex items-center gap-2">
              {activeAgent.name} • {activeAgent.title}
              <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/30">
                {activeAgent.badge}
              </span>
            </span>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-slate-400 hover:text-rose-400 hover:border-slate-700 transition-colors"
          title="Limpiar conversación"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reiniciar chat</span>
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl">
        {messages.map((m) => {
          const isBot = m.role === 'model';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                  isBot
                    ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isBot
                    ? 'bg-slate-950 border border-slate-800 text-slate-200'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
                <div
                  className={`mt-2 text-[10px] ${
                    isBot ? 'text-slate-500' : 'text-cyan-200'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
              <Bot className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              <span>{activeAgent.name} está procesando tu consulta turística...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Dynamic Agent Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {activeAgent.quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="rounded-full border border-slate-800 bg-slate-900/90 px-3 py-1 text-xs text-slate-300 hover:border-cyan-500/40 hover:text-white transition-all whitespace-nowrap cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950 p-2 shadow-xl"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Pregúntale a ${activeAgent.name}...`}
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
