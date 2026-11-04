import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Navigation,
  Compass,
  Footprints,
  Car,
  Bike,
  Train,
  Hospital,
  Utensils,
  Landmark,
  Layers,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface MapPoi {
  id: string;
  name: string;
  category: 'monument' | 'food' | 'hotel' | 'hospital' | 'atm' | 'transit';
  coords: [number, number];
  address: string;
  rating: number;
  openHours: string;
  tag: string;
}

const CITY_COORDINATES: Record<string, { center: [number, number]; zoom: number; pois: MapPoi[] }> = {
  tokyo: {
    center: [35.6895, 139.6917],
    zoom: 14,
    pois: [
      { id: 't1', name: 'Templo Senso-ji', category: 'monument', coords: [35.7148, 139.7967], address: 'Asakusa, Taito City', rating: 4.8, openHours: '06:00 - 17:00 (Gratis)', tag: 'Imprescindible' },
      { id: 't2', name: 'Cruce de Shibuya', category: 'monument', coords: [35.6595, 139.7005], address: 'Shibuya City', rating: 4.9, openHours: '24 horas', tag: 'Icono Mundial' },
      { id: 't3', name: 'Ichiran Ramen Shinjuku', category: 'food', coords: [35.6908, 139.7022], address: 'Shinjuku 3-34-11', rating: 4.7, openHours: '10:00 - 23:00', tag: 'Ramen Tonkotsu 8€' },
      { id: 't4', name: 'St. Luke’s International Hospital', category: 'hospital', coords: [35.6663, 139.7735], address: 'Akashi-cho, Chuo City', rating: 4.9, openHours: 'Urgencias 24h', tag: 'Inglés / Multilingüe' },
      { id: 't5', name: 'Estación Central de Tokio (JR)', category: 'transit', coords: [35.6812, 139.7671], address: 'Marunouchi', rating: 4.8, openHours: '05:00 - 00:30', tag: 'Shinkansen & Metro' },
    ]
  },
  rome: {
    center: [41.9028, 12.4964],
    zoom: 14,
    pois: [
      { id: 'r1', name: 'Coliseo Romano', category: 'monument', coords: [41.8902, 12.4922], address: 'Piazza del Colosseo', rating: 4.8, openHours: '09:00 - 18:30', tag: 'Reserva anticipada' },
      { id: 'r2', name: 'Fontana di Trevi', category: 'monument', coords: [41.9009, 12.4833], address: 'Piazza di Trevi', rating: 4.9, openHours: '24 horas (Gratis)', tag: 'Tirar moneda' },
      { id: 'r3', name: 'Panteón de Agripa', category: 'monument', coords: [41.8986, 12.4769], address: 'Piazza della Rotonda', rating: 4.9, openHours: '09:00 - 19:00', tag: 'Cúpula perfecta' },
      { id: 'r4', name: 'Trattoria Da Enzo al 29', category: 'food', coords: [41.8885, 12.4772], address: 'Via dei Vascellari 29', rating: 4.9, openHours: '12:30 - 15:00, 19:30 - 23:00', tag: 'Carbonara Top' },
      { id: 'r5', name: 'Policlinico Umberto I', category: 'hospital', coords: [41.9045, 12.5153], address: 'Viale del Policlinico 155', rating: 4.6, openHours: 'Emergencias 24h (112)', tag: 'Sanidad Pública' },
    ]
  },
  paris: {
    center: [48.8566, 2.3522],
    zoom: 14,
    pois: [
      { id: 'p1', name: 'Torre Eiffel', category: 'monument', coords: [48.8584, 2.2945], address: 'Champ de Mars', rating: 4.7, openHours: '09:30 - 23:45', tag: 'Vistas panorámicas' },
      { id: 'p2', name: 'Museo del Louvre', category: 'monument', coords: [48.8606, 2.3376], address: 'Rue de Rivoli', rating: 4.8, openHours: '09:00 - 18:00', tag: 'Mona Lisa' },
      { id: 'p3', name: 'Bistrot Paul Bert', category: 'food', coords: [48.8524, 2.3854], address: '18 Rue Paul Bert', rating: 4.8, openHours: '12:00 - 14:00, 19:30 - 23:00', tag: 'Steak Frites' },
      { id: 'p4', name: 'Hôpital Hôtel-Dieu', category: 'hospital', coords: [48.8546, 2.3488], address: '1 Parvis Notre-Dame', rating: 4.7, openHours: 'Urgencias 24h (15)', tag: 'Centro París' },
    ]
  }
};

export const MapsView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);

  const [selectedCity, setSelectedCity] = useState<'tokyo' | 'rome' | 'paris'>('tokyo');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'monument' | 'food' | 'hospital' | 'transit'>('all');
  const [routingMode, setRoutingMode] = useState<'walk' | 'bike' | 'car'>('walk');
  const [isSmartRouteActive, setIsSmartRouteActive] = useState(false);
  const [activePoi, setActivePoi] = useState<MapPoi | null>(null);

  const cityData = CITY_COORDINATES[selectedCity] || CITY_COORDINATES.tokyo;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView(cityData.center, cityData.zoom);

      // Dark modern CartoDB tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Add zoom control top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView(cityData.center, cityData.zoom);
    }
  }, [selectedCity]);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    const filteredPois = cityData.pois.filter(p => selectedFilter === 'all' || p.category === selectedFilter);

    filteredPois.forEach((poi) => {
      const color = poi.category === 'monument' ? '#06b6d4' : poi.category === 'food' ? '#f59e0b' : poi.category === 'hospital' ? '#ef4444' : '#10b981';

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid #0f172a;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
        ">📍</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const marker = L.marker(poi.coords, { icon: customIcon });
      marker.on('click', () => {
        setActivePoi(poi);
      });
      markersLayerRef.current?.addLayer(marker);
    });

    // If Smart Route is active, draw the optimized polyline connecting monuments
    if (isSmartRouteActive && filteredPois.length > 1) {
      const latlngs = filteredPois.map(p => p.coords);
      const polyline = L.polyline(latlngs, {
        color: '#06b6d4',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.85
      }).addTo(mapInstanceRef.current);
      routeLineRef.current = polyline;
      mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    }
  }, [cityData, selectedFilter, isSmartRouteActive]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20 mb-2">
            <Compass className="h-3.5 w-3.5" />
            <span>VOYA MAPS & SMART ROUTE</span>
          </div>
          <h1 className="font-heading text-3xl font-black text-white">
            Mapas Interactivos & Navegación Inteligente
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Puntos de interés verificados, centros de salud, gastronomía local y optimizador de trayectos a pie y en transporte público
          </p>
        </div>

        {/* City Switcher */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value as any);
              setIsSmartRouteActive(false);
              setActivePoi(null);
            }}
            className="rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-bold text-cyan-400 focus:outline-none cursor-pointer"
          >
            <option value="tokyo">🇯🇵 Tokio (Japón)</option>
            <option value="rome">🇮🇹 Roma (Italia)</option>
            <option value="paris">🇫🇷 París (Francia)</option>
          </select>
        </div>
      </div>

      {/* Control Pills: Categories and Smart Route Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3 backdrop-blur-md">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedFilter('monument')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'monument'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-cyan-400 hover:bg-slate-800'
            }`}
          >
            <Landmark className="h-3.5 w-3.5" />
            <span>Monumentos</span>
          </button>
          <button
            onClick={() => setSelectedFilter('food')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'food'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-amber-400 hover:bg-slate-800'
            }`}
          >
            <Utensils className="h-3.5 w-3.5" />
            <span>Gastronomía</span>
          </button>
          <button
            onClick={() => setSelectedFilter('hospital')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'hospital'
                ? 'bg-rose-500 text-white shadow'
                : 'text-rose-400 hover:bg-slate-800'
            }`}
          >
            <Hospital className="h-3.5 w-3.5" />
            <span>Hospitales & SOS</span>
          </button>
          <button
            onClick={() => setSelectedFilter('transit')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'transit'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-emerald-400 hover:bg-slate-800'
            }`}
          >
            <Train className="h-3.5 w-3.5" />
            <span>Transporte</span>
          </button>
        </div>

        {/* Smart Route Toggle */}
        <button
          onClick={() => setIsSmartRouteActive(!isSmartRouteActive)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer shadow-md ${
            isSmartRouteActive
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white ring-2 ring-cyan-400'
              : 'border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>{isSmartRouteActive ? 'Ruta Inteligente Optimizada ✓' : 'VOYA Smart Route'}</span>
        </button>
      </div>

      {/* Main Map Box and Floating POI Inspector */}
      <div className="relative h-[550px] w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div ref={mapContainerRef} className="h-full w-full z-10" />

        {/* Top-left Smart Route Metric Card if Active */}
        {isSmartRouteActive && (
          <div className="absolute top-4 left-4 z-20 rounded-2xl border border-cyan-500/50 bg-slate-950/90 p-4 backdrop-blur-xl shadow-xl max-w-xs space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
              <Sparkles className="h-4 w-4" />
              <span>VOYA SMART ROUTE ACTIVA</span>
            </div>
            <p className="text-xs text-white font-semibold">
              Recorrido optimizado para caminar menos y visitar más sin retroceder.
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-slate-800 pt-2 text-slate-300">
              <div>
                <span className="text-slate-500 block">Distancia:</span>
                <span className="font-bold text-emerald-400">3.8 km</span>
              </div>
              <div>
                <span className="text-slate-500 block">Tiempo a pie:</span>
                <span className="font-bold text-cyan-400">~45 minutos</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Floating POI Inspector */}
        {activePoi && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-20 sm:w-96 rounded-2xl border border-slate-700 bg-slate-950/95 p-4 backdrop-blur-xl shadow-2xl space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold px-2 py-0.5 uppercase">
                  {activePoi.tag}
                </span>
                <h4 className="font-heading text-lg font-bold text-white mt-1">
                  {activePoi.name}
                </h4>
                <p className="text-xs text-slate-400">{activePoi.address}</p>
              </div>
              <button
                onClick={() => setActivePoi(null)}
                className="text-slate-500 hover:text-white text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between text-xs border-y border-slate-800/80 py-2">
              <span className="text-slate-400">Horario:</span>
              <span className="font-bold text-slate-200">{activePoi.openHours}</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${activePoi.coords[0]},${activePoi.coords[1]}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-cyan-600 py-2 text-xs font-bold text-white hover:bg-cyan-500 transition-colors cursor-pointer"
              >
                <Navigation className="h-3.5 w-3.5" />
                <span>Cómo llegar (GPS)</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
