import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Download,
  Star,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Info,
  Package
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ShopProduct } from '../../types';

export const ShopView: React.FC = () => {
  const { formatMoney } = useLanguage();
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'physical' | 'digital'>('all');
  const [downloadModalItem, setDownloadModalItem] = useState<ShopProduct | null>(null);

  useEffect(() => {
    fetch('/api/shop')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((p) => {
    if (filterType === 'all') return true;
    return p.type === filterType;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20 mb-2">
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>VOYA GEAR & DIGITAL STORE</span>
        </div>
        <h1 className="font-heading text-3xl font-black text-white">
          Tienda de Viajes & Productos Digitales
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Equipamiento imprescindible seleccionado por viajeros expertos y guías digitales descargables creadas por la comunidad
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setFilterType('all')}
          className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
            filterType === 'all'
              ? 'bg-cyan-500 text-slate-950 shadow'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Todo el Catálogo
        </button>
        <button
          onClick={() => setFilterType('physical')}
          className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
            filterType === 'physical'
              ? 'bg-cyan-500 text-slate-950 shadow'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Equipamiento Físico
        </button>
        <button
          onClick={() => setFilterType('digital')}
          className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
            filterType === 'digital'
              ? 'bg-cyan-500 text-slate-950 shadow'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Guías & Plantillas Digitales
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-md transition-all hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10"
          >
            <div>
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {prod.badge && (
                  <span className="absolute top-3 left-3 rounded-full bg-slate-950/80 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 backdrop-blur-md border border-cyan-500/30">
                    {prod.badge}
                  </span>
                )}
                <span className="absolute top-3 right-3 rounded-full bg-slate-950/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  {prod.type === 'digital' ? 'Digital' : 'Físico'}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    <span>{prod.rating}</span>
                    <span className="text-slate-500 font-normal">({prod.reviewsCount})</span>
                  </div>
                  {prod.isCreatorItem && (
                    <span className="text-[10px] font-bold text-cyan-400">
                      Por {prod.creatorName}
                    </span>
                  )}
                </div>

                <h3 className="font-heading text-base font-bold text-white line-clamp-2">
                  {prod.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {prod.description}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="flex items-baseline justify-between border-t border-slate-800/80 pt-3 mb-3">
                <span className="text-xs text-slate-400">Precio oficial:</span>
                <div className="flex items-baseline gap-2">
                  {prod.originalPrice && (
                    <span className="text-xs line-through text-slate-500">
                      {formatMoney(prod.originalPrice)}
                    </span>
                  )}
                  <span className="font-heading text-xl font-black text-white">
                    {formatMoney(prod.price)}
                  </span>
                </div>
              </div>

              {prod.type === 'digital' ? (
                <button
                  onClick={() => setDownloadModalItem(prod)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-xs font-bold text-white hover:opacity-95 shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Descargar Guía Digital</span>
                </button>
              ) : (
                <a
                  href="https://amazon.es"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                >
                  <span>Comprar con Descuento</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Commercial Affiliate Transparency Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-center">
        <p className="text-xs text-slate-400">
          <strong>Aviso de Comercio & Afiliación:</strong> Los enlaces de compra de productos físicos dirigen a distribuidores certificados. VOYA puede recibir una pequeña comisión por compras elegibles, sin que ello incremente en ningún céntimo el precio final para el comprador. Las ventas de creadores digitales aportan el 85% directamente al autor del contenido.
        </p>
      </div>

      {/* Download Modal Simulation */}
      {downloadModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-center space-y-4">
            <h3 className="font-heading text-xl font-bold text-white">
              Descarga Inmediata de Producto Digital
            </h3>
            <p className="text-xs text-slate-300">
              {downloadModalItem.title}
            </p>
            <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 text-xs text-slate-400 text-left space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Archivo KML y PDF con mapas offline listo</span>
              </div>
              <p className="text-[11px]">
                Enviado a tu correo electrónico y guardado en tu Wallet de VOYA.
              </p>
            </div>
            <button
              onClick={() => setDownloadModalItem(null)}
              className="w-full rounded-xl bg-cyan-600 py-2.5 text-xs font-bold text-white hover:bg-cyan-500 shadow"
            >
              Completar y Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
