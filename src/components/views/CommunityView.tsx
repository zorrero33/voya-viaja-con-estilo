import React, { useState, useEffect } from 'react';
import {
  Award,
  Globe2,
  Heart,
  Bookmark,
  Share2,
  Plus,
  Compass,
  Star,
  Camera,
  MapPin,
  CheckCircle2,
  Flame,
  Send,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CommunityPost } from '../../types';

export const CommunityView: React.FC = () => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'passport' | 'feed'>('passport');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddPostOpen, setIsAddPostOpen] = useState(false);

  // New post form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newDestination, setNewDestination] = useState('Tokio, Japón');
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    fetch('/api/community/posts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPosts(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: user?.name || 'Alejandro Morales',
          authorAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          authorCountry: 'España',
          destination: newDestination,
          title: newTitle,
          content: newContent,
          images: ['https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80'],
          tags: ['Experiencia', 'Consejo', 'Voya'],
          rating: Number(newRating)
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setPosts((prev) => [data.data, ...prev]);
        setIsAddPostOpen(false);
        setNewTitle('');
        setNewContent('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const passportStamps = [
    { country: 'Japón', code: 'JP', flag: '🇯🇵', date: 'Oct 2026', city: 'Tokio & Kioto', stampColor: 'border-rose-500 text-rose-400' },
    { country: 'Italia', code: 'IT', flag: '🇮🇹', date: 'Jul 2026', city: 'Roma & Florencia', stampColor: 'border-emerald-500 text-emerald-400' },
    { country: 'Francia', code: 'FR', flag: '🇫🇷', date: 'Abr 2026', city: 'París & Niza', stampColor: 'border-blue-500 text-blue-400' },
    { country: 'Marruecos', code: 'MA', flag: '🇲🇦', date: 'Ene 2026', city: 'Marrakech', stampColor: 'border-amber-500 text-amber-400' },
    { country: 'Portugal', code: 'PT', flag: '🇵🇹', date: 'Nov 2025', city: 'Lisboa & Oporto', stampColor: 'border-cyan-500 text-cyan-400' },
    { country: 'España', code: 'ES', flag: '🇪🇸', date: 'Nativo', city: 'Madrid & Barcelona', stampColor: 'border-red-500 text-red-400' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header and SubTab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20 mb-2">
            <Award className="h-3.5 w-3.5" />
            <span>PASAPORTE DIGITAL & RED DE VIAJEROS</span>
          </div>
          <h1 className="font-heading text-3xl font-black text-white">
            Comunidad VOYA & Pasaporte
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tus sellos oficiales, insignias desbloqueadas, relatos contrastados de otros viajeros y joyas ocultas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-2xl bg-slate-900 p-1 border border-slate-800">
            <button
              onClick={() => setActiveSubTab('passport')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'passport'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mi Pasaporte Digital
            </button>
            <button
              onClick={() => setActiveSubTab('feed')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'feed'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Muro de Viajeros
            </button>
          </div>

          {activeSubTab === 'feed' && (
            <button
              onClick={() => setIsAddPostOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-500 transition-colors shadow cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Publicar</span>
            </button>
          )}
        </div>
      </div>

      {activeSubTab === 'passport' ? (
        /* Passport Digital View */
        <div className="space-y-6">
          {/* User Passport ID Card */}
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt={user?.name}
                  className="h-24 w-24 rounded-2xl object-cover ring-2 ring-amber-400/40 shadow-xl"
                />
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-0.5 text-[11px] font-bold text-amber-300 border border-amber-500/30 uppercase tracking-widest">
                    <span>PASAPORTE DIGITAL VOYA • Nº VY-884920</span>
                  </div>
                  <h2 className="font-heading text-2xl font-black text-white">
                    {user?.name || 'Alejandro Morales'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Nacionalidad: España • Origen: {user?.homeCity} • Plan {user?.tier?.toUpperCase()}
                  </p>
                  <p className="text-xs font-mono text-cyan-400 pt-1">
                    Código Referido: {user?.referralCode} ({user?.referralCredits}€ créditos acumulados)
                  </p>
                </div>
              </div>

              {/* World Exploration Metric */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-center min-w-[140px]">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">
                  Planeta Descubierto
                </span>
                <span className="font-heading text-3xl font-black text-cyan-400 mt-1 block">
                  3.2%
                </span>
                <span className="text-[11px] text-slate-400">
                  {passportStamps.length} países sellados
                </span>
              </div>
            </div>

            {/* Badges Earned */}
            <div className="mt-6 border-t border-slate-800/80 pt-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Insignias Desbloqueadas:
              </span>
              <div className="flex flex-wrap gap-2">
                {user?.badges?.map((badge, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-700 px-3 py-1 text-xs font-bold text-white shadow-sm"
                  >
                    <Flame className="h-3.5 w-3.5 text-amber-400" />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stamps Collection Grid */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
            <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-cyan-400" />
              <span>Sellos Oficiales de Entrada en Pasaporte</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {passportStamps.map((st, idx) => (
                <div
                  key={idx}
                  className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed ${st.stampColor} p-4 text-center bg-slate-950/60 shadow-md transform hover:scale-105 transition-transform`}
                >
                  <span className="text-2xl mb-1">{st.flag}</span>
                  <span className="font-heading text-xs font-black uppercase tracking-wider">
                    {st.country}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 mt-0.5">
                    {st.city}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">
                    {st.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Community Feed */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md transition-all hover:border-slate-700"
              >
                <div>
                  {/* Author Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="h-10 w-10 rounded-full object-cover ring-1 ring-cyan-500/30"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">
                          {post.authorName}
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          {post.authorCountry} • {post.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5 text-xs font-bold text-amber-400">
                      <Star className="h-3 w-3 fill-amber-400" />
                      <span>{post.rating}</span>
                    </div>
                  </div>

                  {/* Post Image */}
                  {post.images?.[0] && (
                    <div className="h-44 w-full rounded-2xl overflow-hidden mb-3">
                      <img
                        src={post.images[0]}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 mb-1">
                    <MapPin className="h-3 w-3" />
                    <span>{post.destination}</span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-white mb-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {post.content}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {post.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Likes & Saves */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-3">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                  >
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </button>

                  <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors">
                    <Bookmark className="h-4 w-4" />
                    <span>Guardar consejo</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Post Modal */}
      {isAddPostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleCreatePost}
            className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-white">
                Compartir Relato o Consejo de Viaje
              </h3>
              <button
                type="button"
                onClick={() => setIsAddPostOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Destino:</label>
              <input
                type="text"
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Título del relato o consejo:</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ej. El mejor mirador gratuito de Roma..."
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Experiencia / Consejo:</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={4}
                placeholder="Cuenta tu experiencia, precios reales o cómo evitar colas..."
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddPostOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-xl bg-cyan-600 px-5 py-2 text-xs font-bold text-white hover:bg-cyan-500 shadow"
              >
                Publicar Relato
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
