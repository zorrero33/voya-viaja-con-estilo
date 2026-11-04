import React, { useState } from 'react';
import {
  Languages,
  Mic,
  Camera,
  Volume2,
  Copy,
  Check,
  Sparkles,
  ArrowRightLeft,
  BookOpen,
  Image as ImageIcon,
  AlertCircle,
  Share2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const TranslatorView: React.FC = () => {
  const [inputText, setInputText] = useState('¿Tiene opciones sin marisco ni frutos secos?');
  const [sourceLang, setSourceLang] = useState('Español');
  const [targetLang, setTargetLang] = useState('Japonés');
  const [contextMode, setContextMode] = useState<'general' | 'restaurant' | 'hotel' | 'emergency' | 'transport'>('restaurant');
  const [loading, setLoading] = useState(false);
  const [translatedResult, setTranslatedResult] = useState<{
    translatedText: string;
    phoneticGuide?: string;
    politeAlternative?: string;
    detectedSourceLang?: string;
    culturalTips?: string;
  }>({
    translatedText: '甲殻類やナッツ類を使用していないメニューはありますか？',
    phoneticGuide: 'Kōkakurui ya nattsu-rui o shiyō shite inai menyū wa arimasu ka?',
    politeAlternative: 'Sumimasen, arerugī ga arimasu node kakunin shite itadakemasu ka?',
  });

  const [copied, setCopied] = useState(false);
  const [isPhotoScanning, setIsPhotoScanning] = useState(false);
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<string | null>(null);

  const phrasebook = [
    {
      category: 'restaurant',
      label: 'Restaurante',
      items: [
        { orig: 'La cuenta, por favor', trans: 'O-kaikei o onegaishimasu / L’addition s’il vous plaît' },
        { orig: '¿Qué plato típico me recomienda?', trans: 'Osusume wa nan desu ka? / Quel est le plat du jour?' },
        { orig: 'Agua del grifo, por favor', trans: 'O-hiya o onegaishimasu / Une carafe d’eau, s’il vous plaît' }
      ]
    },
    {
      category: 'emergency',
      label: 'Emergencias',
      items: [
        { orig: '¡Necesito ayuda médica urgente!', trans: 'Kyūkyūsha o yonde kudasai! / J’ai besoin d’un médecin!' },
        { orig: 'He perdido mi pasaporte', trans: 'Pasupōto o nakushimashita / J’ai perdu mon passeport' },
        { orig: '¿Dónde está la farmacia más cercana?', trans: 'Moyori no yakkyoku wa doko desu ka?' }
      ]
    },
    {
      category: 'transport',
      label: 'Transporte & Taxi',
      items: [
        { orig: '¿Cuánto cuesta ir a la estación central?', trans: 'Eki made ikura desu ka? / Combien pour la gare?' },
        { orig: 'Por favor, encienda el taxímetro', trans: 'Mētā o tsukatte kudasai / Mettez le compteur svp' },
        { orig: '¿Este tren para en mi destino?', trans: 'Kono densha wa tomari masu ka?' }
      ]
    }
  ];

  const handleTranslate = async () => {
    if (!inputText) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          sourceLang,
          targetLang,
          contextMode
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setTranslatedResult(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setSelectedPhotoPreview(dataUrl);
      const base64 = dataUrl.split(',')[1];
      const mimeType = file.type || 'image/jpeg';

      setIsPhotoScanning(true);
      try {
        const res = await fetch('/api/ai/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: '',
            sourceLang: 'Auto',
            targetLang,
            contextMode,
            imageBase64: base64,
            imageMimeType: mimeType
          })
        });
        const data = await res.json();
        if (data.success && data.data) {
          setTranslatedResult(data.data);
        }
      } catch (err) {
        console.error('Photo translate error:', err);
      } finally {
        setIsPhotoScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const playVoice = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = () => {
    if (!translatedResult.translatedText) return;
    navigator.clipboard.writeText(translatedResult.translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20 mb-2">
          <Languages className="h-3.5 w-3.5" />
          <span>TRADUCTOR UNIVERSAL CONTEXTUAL & FOTO MENÚ</span>
        </div>
        <h1 className="font-heading text-3xl font-black text-white">
          Traductor de Viaje VOYA
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Traducción en vivo por texto, voz y fotografía de menús o carteles con pronunciación fonética y cortesía local
        </p>
      </div>

      {/* Language Bar & Context Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="Español">🇪🇸 Español</option>
            <option value="Inglés">🇬🇧 Inglés</option>
            <option value="Francés">🇫🇷 Francés</option>
            <option value="Alemán">🇩🇪 Alemán</option>
            <option value="Italiano">🇮🇹 Italiano</option>
            <option value="Portugués">🇵🇹 Portugués</option>
            <option value="Árabe">🇦🇪 Árabe</option>
          </select>

          <button
            onClick={() => {
              const temp = sourceLang;
              setSourceLang(targetLang);
              setTargetLang(temp);
            }}
            className="rounded-lg p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </button>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-bold text-cyan-400 focus:outline-none cursor-pointer"
          >
            <option value="Japonés">🇯🇵 Japonés</option>
            <option value="Árabe">🇦🇪 Árabe</option>
            <option value="Chino Simplificado">🇨🇳 Chino</option>
            <option value="Inglés">🇬🇧 Inglés</option>
            <option value="Francés">🇫🇷 Francés</option>
            <option value="Italiano">🇮🇹 Italiano</option>
            <option value="Alemán">🇩🇪 Alemán</option>
            <option value="Español">🇪🇸 Español</option>
          </select>
        </div>

        {/* Situational Context Mode */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">
            Modo:
          </span>
          {(['restaurant', 'hotel', 'emergency', 'transport', 'general'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setContextMode(mode)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition-all cursor-pointer ${
                contextMode === mode
                  ? 'bg-cyan-500 text-slate-950 shadow font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {mode === 'restaurant' ? 'Restaurante' : mode === 'hotel' ? 'Hotel' : mode === 'emergency' ? 'Emergencias' : mode === 'transport' ? 'Taxi/Tren' : 'General'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Translation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Box */}
        <div className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {sourceLang}
              </span>
              <div className="flex items-center gap-1">
                {/* Photo scanner upload trigger */}
                <label className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-slate-700 cursor-pointer transition-colors">
                  <Camera className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Foto Menú</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={5}
              placeholder="Escribe aquí lo que necesitas decir o traduce..."
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
            />

            {selectedPhotoPreview && (
              <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-950 p-2 border border-slate-800">
                <img
                  src={selectedPhotoPreview}
                  alt="Previsualización"
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="text-xs">
                  <p className="font-bold text-slate-200">Foto de Menú Cargada</p>
                  <p className="text-[10px] text-cyan-400">
                    {isPhotoScanning ? 'Escaneando platos con Gemini...' : 'Listo'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3">
            <button
              onClick={() => playVoice(inputText)}
              className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Escuchar texto original"
            >
              <Volume2 className="h-4 w-4" />
            </button>

            <button
              onClick={handleTranslate}
              disabled={loading || isPhotoScanning}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all cursor-pointer"
            >
              {loading || isPhotoScanning ? (
                <span>Traduciendo...</span>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Traducir con IA</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Target Translation Result Box */}
        <div className="flex flex-col justify-between rounded-3xl border border-cyan-500/30 bg-slate-900/90 p-5 backdrop-blur-md shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                {targetLang} (Traducción Verificada)
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            <div className="font-heading text-lg font-bold text-white leading-relaxed">
              {translatedResult.translatedText}
            </div>

            {translatedResult.phoneticGuide && (
              <div className="mt-3 rounded-xl bg-slate-950/80 p-3 border border-slate-800 text-xs">
                <span className="text-[10px] font-bold text-cyan-400 uppercase block mb-1">
                  🗣️ Pronunciación Fonética:
                </span>
                <p className="text-slate-300 italic">
                  "{translatedResult.phoneticGuide}"
                </p>
              </div>
            )}

            {translatedResult.culturalTips && (
              <div className="mt-3 rounded-xl bg-amber-500/10 p-3 border border-amber-500/30 text-xs text-amber-200">
                <span className="font-bold block mb-1">💡 Nota cultural o de ingredientes:</span>
                <p>{translatedResult.culturalTips}</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3">
            <button
              onClick={() => playVoice(translatedResult.translatedText)}
              className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
            >
              <Volume2 className="h-4 w-4" />
              <span>Reproducir Voz</span>
            </button>

            <span className="text-[10px] font-semibold text-slate-500">
              Modo {contextMode} activo
            </span>
          </div>
        </div>
      </div>

      {/* Travel Phrasebook Drawer */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-cyan-400" />
          <h3 className="font-heading text-xl font-bold text-white">
            Guía Rápida de Frases Imprescindibles
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {phrasebook.map((sec, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                {sec.label}
              </h4>
              <div className="space-y-2">
                {sec.items.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setInputText(item.orig);
                      handleTranslate();
                    }}
                    className="p-2 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition-all"
                  >
                    <p className="text-xs font-semibold text-white">{item.orig}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">{item.trans}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
