# VOYA — Superapp Internacional de Viajes

> **"Descubre el mundo. Viaja más. Gasta menos."**

VOYA es una plataforma digital internacional de turismo, inteligencia artificial y comercio que reúne en un único ecosistema todo lo necesario para planificar, viajar, ahorrar y mantenerse seguro en cualquier destino del planeta.

---

## 🌟 Características Principales

1. **Voya Discovery**: Algoritmo con IA para encontrar destinos ideales por presupuesto (ej. "viajar con 200€", "playa económica", "sin coger avión", "en familia").
2. **Voya Cheap Travel**: Buscador multimodal transparente que compara en tiempo real vuelos, trenes de alta velocidad, autobuses interurbanos, coches compartidos y ferris, calculando tasas, equipaje y transfer al centro.
3. **AI Trip Planner (Gemini 3.8 Flash)**: Generador de itinerarios día por día completos con horarios lógicos, costes detallados, rutas y alternativas gratuitas.
4. **Voya Maps & Smart Route**: Mapa interactivo mundial (Leaflet & OpenStreetMap) con POIs verificados (monumentos, gastronomía, hospitales 24h, transporte) y optimizador de trayectos a pie y en transporte público.
5. **Traductor Universal & Menús**: Traducción por texto, voz (*Web Speech API*) y escáner fotográfico de cartas de restaurante con transcripción y pronunciación fonética.
6. **Voya Assistant 24/7**: Asistente conversacional contextualizado que diferencia entre datos confirmados, estimaciones y recomendaciones locales.
7. **Wallet de Billetes & Reservas**: Gestor de tarjetas de embarque, vouchers de hotel y excursiones con códigos QR accesibles sin conexión.
8. **Voya Money & Split**: Calculadora integral de presupuesto con margen de imprevistos, división de gastos de grupo y conversor de tipos de cambio.
9. **Seguridad SOS & Conectividad**: Directorio de emergencias (112, 911, 110, 119), embajadas oficiales, avisos de estafas, comprobador de agua potable y catálogo de eSIM 5G.
10. **Comunidad & Pasaporte Digital**: Registro de países visitados con sellos oficiales, insignias desbloqueadas y porcentaje de planeta explorado.
11. **Planes & Suscripciones**: Tiers Free, Plus (4,99 €/mes), Premium (9,99 €/mes) y Family (14,99 €/mes).
12. **Master Admin Console**: Panel administrativo privado con métricas de facturación, MRR, monitorización de API Gemini, toggles de módulos comerciales y editor de precios.

---

## 🚀 Arquitectura Tecnológica

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons, Leaflet.
- **Backend**: Node.js & Express con soporte dual (servidor continuo y Serverless Functions en Vercel).
- **Inteligencia Artificial**: `@google/genai` (SDK oficial con modelo `gemini-3.8-flash`).
- **Persistencia**: Base de datos JSON estructurada con persistencia continua y migrable a Cloud SQL / Firestore.
- **i18n**: Internacionalización nativa en 9 idiomas (Español, Inglés, Francés, Árabe RTL, Alemán, Italiano, Portugués, Chino Simplificado, Japonés).

---

## 🛠️ Instalación y Ejecución Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/voya.git
cd voya

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Añade tu clave de Gemini API en .env:
# GEMINI_API_KEY="tu_clave_aqui"

# 4. Iniciar en modo desarrollo (Frontend + Backend en puerto 3000)
npm run dev

# 5. Compilar para producción
npm run build
```

---

## ☁️ Guía de Despliegue en Vercel (.vercel.app)

VOYA está preconfigurada con `vercel.json` y `/api/index.ts` para despliegue sin configuración adicional:

1. Ve a [Vercel](https://vercel.com/) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **"Add New..." > "Project"** y selecciona el repositorio `voya`.
3. Vercel detectará automáticamente:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. En la sección **Environment Variables**, añade:
   - `GEMINI_API_KEY`: Tu clave de Google AI Studio.
5. Haz clic en **Deploy**.
6. En **Settings > Domains**, puedes asignar el subdominio gratuito:
   `https://voya-travel.vercel.app` (o alternativas como `voya-app.vercel.app`).

---

## 🔒 Seguridad y Privacidad

- Las llamadas a la API de Gemini se realizan de forma 100% segura desde el servidor (`/api/ai/*`), protegiendo `GEMINI_API_KEY`.
- Cabeceras de seguridad HTTP configuradas (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`).
- Conforme a la normativa RGPD: exportación de datos en formato JSON y opción de revocación de cuenta en 1 clic.
