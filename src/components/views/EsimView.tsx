import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Signal,
  Smartphone,
  QrCode,
  CheckCircle2,
  Zap,
  Globe2,
  TrendingDown,
  Info,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { EsimPackage } from '../../types';

export const EsimView: React.FC = () => {
  const { formatMoney } = useLanguage();
  const [packages, setPackages] = useState<EsimPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<EsimPackage | null>(null);
  const [activeTabGuide, setActiveTabGuide] = useState<'ios' | 'android'>('ios');

  useEffect(() => {
    fetch('/api/connectivity/esim')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPackages(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20 mb-2">
          <Wifi className="h-3.5 w-3.5" />
          <span>VOYA CONNECT • CONECTIVIDAD GLOBAL</span>
        </div>
        <h1 className="font-heading text-3xl font-black text-white">
          eSIM Internacional de Datos Alta Velocidad
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Internet sin sorpresas de roaming. Activación digital instantánea por código QR en más de 140 países con redes 5G y 4G LTE
        </p>
      </div>

      {/* Comparison Packages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl transition-all hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  {pkg.region}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                  <Signal className="h-3 w-3" />
                  <span>5G / 4G</span>
                </span>
              </div>

              <h3 className="font-heading text-xl font-bold text-white mt-2">
                {pkg.country}
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Operador: {pkg.provider}
              </p>

              <div className="mt-4 rounded-2xl bg-slate-950 p-3 border border-slate-800/80">
                <span className="text-xs text-slate-400 block">Datos incluidos:</span>
                <span className="font-heading text-xl font-black text-white">
                  {pkg.dataAllowance}
                </span>
                <p className="text-[11px] text-cyan-400 mt-0.5">
                  Validez: {pkg.validityDays} días
                </p>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Compartir datos (Hotspot) activado</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Activación en menos de 2 minutos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Mantén tu número de WhatsApp español</span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-800 pt-4">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-xs text-slate-400">Precio neto:</span>
                <span className="font-heading text-2xl font-black text-white">
                  {formatMoney(pkg.price)}
                </span>
              </div>

              <button
                onClick={() => setSelectedPackage(pkg)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-600 py-2.5 text-xs font-bold text-white hover:bg-cyan-500 transition-colors shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                <QrCode className="h-4 w-4" />
                <span>Obtener eSIM & QR</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Installation Guide for iOS & Android */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-cyan-400" />
              <span>Guía de Instalación Paso a Paso</span>
            </h3>
            <p className="text-xs text-slate-400">
              Compatible con iPhone XS o posterior, Google Pixel 3 o posterior, y Samsung Galaxy S20 o posterior
            </p>
          </div>

          <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setActiveTabGuide('ios')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTabGuide === 'ios'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              iPhone / iOS
            </button>
            <button
              onClick={() => setActiveTabGuide('android')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTabGuide === 'android'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Android (Samsung / Pixel / Xiaomi)
            </button>
          </div>
        </div>

        {activeTabGuide === 'ios' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-1">
              <span className="h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs mb-2">1</span>
              <h4 className="font-bold text-white">Ajustes &gt; Datos Móviles</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Abre Ajustes en tu iPhone, pulsa en "Datos Móviles" y selecciona "Añadir eSIM".
              </p>
            </div>
            <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-1">
              <span className="h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs mb-2">2</span>
              <h4 className="font-bold text-white">Escanear el Código QR</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Apunta con la cámara al código QR generado por VOYA Connect y pulsa "Continuar".
              </p>
            </div>
            <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-1">
              <span className="h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs mb-2">3</span>
              <h4 className="font-bold text-white">Activar al aterrizar</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Al llegar a tu destino, activa la línea de VOYA como línea para datos móviles e itinerancia. ¡Conectado al instante!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-1">
              <span className="h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs mb-2">1</span>
              <h4 className="font-bold text-white">Ajustes &gt; Conexiones</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Ve a Ajustes &gt; Administrador de SIM o Redes móviles y pulsa en "Añadir plan móvil eSIM".
              </p>
            </div>
            <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-1">
              <span className="h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs mb-2">2</span>
              <h4 className="font-bold text-white">Escanear QR de VOYA</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Escanea el código QR desde tu pantalla o introduce el código de activación manual.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-1">
              <span className="h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs mb-2">3</span>
              <h4 className="font-bold text-white">Activar Roaming de Datos</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Asegúrate de marcar "Itinerancia de datos" activada únicamente para la eSIM VOYA instalada.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal QR Simulation */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-center space-y-4">
            <h3 className="font-heading text-lg font-bold text-white">
              Tu eSIM: {selectedPackage.country}
            </h3>
            <p className="text-xs text-slate-400">
              Escanea este código con la cámara de tu teléfono para descargar el perfil eSIM.
            </p>

            <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl bg-white p-4 shadow-xl">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <rect width="100" height="100" fill="white" />
                <rect x="10" y="10" width="25" height="25" fill="#0f172a" />
                <rect x="15" y="15" width="15" height="15" fill="white" />
                <rect x="18" y="18" width="9" height="9" fill="#0f172a" />
                <rect x="65" y="10" width="25" height="25" fill="#0f172a" />
                <rect x="70" y="15" width="15" height="15" fill="white" />
                <rect x="73" y="18" width="9" height="9" fill="#0f172a" />
                <rect x="10" y="65" width="25" height="25" fill="#0f172a" />
                <rect x="15" y="70" width="15" height="15" fill="white" />
                <rect x="18" y="73" width="9" height="9" fill="#0f172a" />
                <rect x="45" y="45" width="10" height="10" fill="#0f172a" />
                <rect x="65" y="45" width="8" height="8" fill="#0f172a" />
                <rect x="40" y="65" width="12" height="12" fill="#0f172a" />
              </svg>
            </div>

            <p className="text-[11px] font-mono text-cyan-400">
              LPA:1$voya.esim.global$ACT-79812-VOYA
            </p>

            <button
              onClick={() => setSelectedPackage(null)}
              className="w-full rounded-xl bg-cyan-600 py-2.5 text-xs font-bold text-white hover:bg-cyan-500 transition-colors"
            >
              Listo, Perfil Instalado
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
