import { useState, useEffect, useRef, FormEvent } from "react";
import { 
  Globe, X, Search, Compass, Sparkles, MessageSquare, Send, 
  Languages, AlertCircle, RefreshCw, Navigation, Eye, User, Trophy, MapPin, Layers
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProgress } from "../data/courses";

interface OrbisTerrarumMapProps {
  userProgress: UserProgress | null;
  onClose: () => void;
  onSaveProgress?: (progress: UserProgress) => void;
}

export interface GlobalLegend {
  id: string;
  title: string;
  lat: number;
  lng: number;
  region: string;
  originalLang: "Inglés" | "Chino" | "Tibetano" | "Griego" | "Celta";
  originalSource: string;
  translatedTitle: string;
  spanishTranslation: string;
  mythType: string;
  truth: string;
}

export interface SpiritCloud {
  id: string;
  name: string;
  role: string;
  lat: number;
  lng: number;
  color: string;
  status: string;
}

export interface SpiritLog {
  id: string;
  lat: number;
  lng: number;
  author: string;
  text: string;
  timestamp: string;
}

const GLOBAL_MYSTERIES: GlobalLegend[] = [
  {
    id: "richat_structure",
    title: "Estructura de Richat (El Ojo del Sahara)",
    lat: 21.1242,
    lng: -11.4013,
    region: "Desierto de Mauritania",
    originalLang: "Griego",
    originalSource: "«...αὐτῇ δὲ τῇ νήσῳ διάμετρος ἦν ἑκατόν εἴκοσι σταδίων. Οἱ δὲ κύκλοι τῆς θαλάσσης καὶ τῆς γῆς ἦσαν ἐναλλάξ...»",
    translatedTitle: "La Capital Circular de Atlántida",
    spanishTranslation: "«La isla central tenía un diámetro de ciento veinte estadios. Los círculos de mar y de tierra eran alternos y concéntricos...» Las dimensiones de este inmenso relieve circular de 40 kilómetros coinciden al milímetro con los diámetros descritos por Platón. Posee sedimentos fluviales fósiles y anomalías térmicas subterráneas que sugieren antiguos canales.",
    mythType: "Imperio Perdido",
    truth: "Es una estructura domo geológica profundamente erosionada. Sin embargo, la coincidencia matemática exacta con las dimensiones de Platón y la presencia de agua dulce artesiana subterránea en pleno desierto sugieren que pudo ser habitada y fortificada en épocas más húmedas."
  },
  {
    id: "bermuda_triangle",
    title: "El Triángulo de las Bermudas",
    lat: 25.0,
    lng: -71.0,
    region: "Atlántico Occidental",
    originalLang: "Inglés",
    originalSource: "«Flight 19 reports: We cannot make out any directions. Everything is wrong. Even the ocean doesn't look as it should... white water everywhere.»",
    translatedTitle: "Anomalía de Resonancia Magnética",
    spanishTranslation: "«El vuelo 19 informa: No podemos determinar ninguna dirección. Todo está mal. Incluso el océano no se ve como debería... agua blanca por todas partes.» Los registros de las brújulas espirales navales demuestran distorsiones magnéticas causadas por grandes depósitos de hidratos de metano e inversiones geológicas locales.",
    mythType: "Vórtice Temporal",
    truth: "Es una de las dos únicas regiones del planeta donde la brújula apunta exactamente al norte geográfico en lugar del norte magnético, lo que genera desvíos inesperados. Sumado a potentes corrientes submarinas, los restos son tragados al fondo del mar."
  },
  {
    id: "nazca_lines",
    title: "Líneas de Nazca y Pampas de Jumana",
    lat: -14.7396,
    lng: -75.1300,
    region: "Ica, Perú",
    originalLang: "Celta",
    originalSource: "«Giant glyphs in the red earth aligned perfectly with the celestial paths of the hunters of Orion and Sirius...»",
    translatedTitle: "Antenas de Resonancia y Calendario Estelar",
    spanishTranslation: "«Gigantescos glifos trazados en la tierra arcillosa y alineados perfectamente con las trayectorias estelares de los cazadores de Orión y Sirio...» Bajo los geoglifos se han detectado capas de piedras ricas en cuarzo piezoeléctrico, capaces de emitir vibraciones sonoras de baja frecuencia al amanecer.",
    mythType: "Pistas Alienígenas",
    truth: "Los geoglifos funcionaban como un inmenso mapa ritual astronómico y un sintonizador acústico terrestre. Al caminar sobre los senderos de piedra cargados de cuarzo durante ceremonias específicas, se amplificaban las frecuencias sísmicas del subsuelo."
  },
  {
    id: "yonaguni_monument",
    title: "Monumento Submarino de Yonaguni",
    lat: 24.4322,
    lng: 123.0114,
    region: "Archipiélago Ryukyu, Japón",
    originalLang: "Chino",
    originalSource: "«...東海之上有巨石天梯，沉於重洋之下，上刻神烏白澤，乃古之陽帝祭天之壇...»",
    translatedTitle: "El Altar Solar del Continente Hundido de Mu",
    spanishTranslation: "«...En el mar del este yace una gran escalera de piedra celestial sumergida bajo los océanos, tallada con las figuras divinas del cuervo sagrado y Baize, que sirvió como altar de sacrificios solares para el Emperador de la Luz...»",
    mythType: "Estructura Artificial Submarina",
    truth: "Aunque los geólogos oficiales lo llaman formación natural, la presencia de ángulos rectos perfectos de 90 grados, escalones tallados milimétricos, pasadizos de drenaje simétricos y una escultura de piedra similar a un rostro humano sugieren una intervención megalítica datada del 10,000 a.C."
  },
  {
    id: "mount_kailash",
    title: "Monte Kailash (Axis Mundi)",
    lat: 31.0667,
    lng: 81.3125,
    region: "Meseta del Tíbet",
    originalLang: "Tibetano",
    originalSource: "«...གངས་རིན་པོ་ཆེ་ནི་འཛམ་གླིང་གི་སྲོག་ཤིང་ཡིན། དེའི་སྙིང་པོ་སྟོང་པ་ཉིད་ལས་གྲུབ་ཅིང་། ལྷ་ཡི་གྲོང་ཁྱེར་ཤམ་བྷ་ལར་སྦྲེལ་ཡོད།...»",
    translatedTitle: "La Pirámide de Resonancia Planetaria",
    spanishTranslation: "«...El precioso pico nevado es el pilar de la Tierra. Su núcleo es hueco y místico, irradiando sonidos divinos que resuenan directamente con el palacio celestial de Shambhala...» Es considerado el gran acumulador cósmico.",
    mythType: "Pirámide Artificial Gigante",
    truth: "El monte Kailash posee una forma piramidal perfecta cuyos cuatro lados se orientan exactamente a los puntos cardinales. Científicos rusos han propuesto que Kailash es una superestructura megalítica artificial, rodeada de docenas de monumentos piramidales menores que forman un gigantesco sistema sintonizador cuántico."
  },
  {
    id: "easter_island",
    title: "Isla de Pascua (Te Pito o te Henua)",
    lat: -27.1127,
    lng: -109.3497,
    region: "Polinesia, Chile",
    originalLang: "Inglés",
    originalSource: "«The elders remember the land of Hiva which sank in ancient days. The giant stones were animated by Mana energy, walking to protect the navel of the world.»",
    translatedTitle: "El Ombligo de la Tierra y las Estelas Magnéticas",
    spanishTranslation: "«Los ancianos recuerdan la tierra de Hiva que se hundió en los días antiguos. Las gigantescas piedras Moai fueron animadas con la energía espiritual del Mana, caminando por sí mismas para proteger el ombligo del mundo.»",
    mythType: "Gigantes Caminantes",
    truth: "Los Moai fueron tallados en roca volcánica de toba que contiene un alto porcentaje de partículas magnéticas de magnetita. Al moverlos de forma oscilante ('caminar'), se producía un campo de resonancia eléctrica que sintonizaba la red tectónica terrestre de la isla."
  },
  {
    id: "mariana_trench",
    title: "Abismo de Challenger (Fosa de las Marianas)",
    lat: 11.3493,
    lng: 142.1996,
    region: "Pacífico Occidental",
    originalLang: "Inglés",
    originalSource: "«SASS military hydrophones registered ultra-low-frequency rhythmic vibrations. It resembled a mechanical pump operating deep within the ocean crust.»",
    translatedTitle: "El Pulsador de Éter del Manto Terrestre",
    spanishTranslation: "«Los hidrófonos militares registraron vibraciones rítmicas de frecuencia ultra-baja. Se asemejaba a una gigantesca bomba mecánica operando profundamente dentro de la corteza oceánica.»",
    mythType: "Monstruos Submarinos",
    truth: "La Fosa de las Marianas es la hendidura más profunda de la Tierra. Los sonidos de resonancia proceden de procesos de serpentinización, donde el agua de mar se filtra al manto superior a altísima presión, liberando inmensas cantidades de hidrógeno y energía electromagnética."
  }
];

const INITIAL_SPIRITS: SpiritCloud[] = [
  { id: "sp_1", name: "Nico Robin", role: "Arqueóloga", lat: 21.1242, lng: -11.4013, color: "#a855f7", status: "Examinando inscripciones en el Ojo del Sahara" },
  { id: "sp_2", name: "Profesor Clover", role: "Erudito Principal", lat: 31.0667, lng: 81.3125, color: "#10b981", status: "Sintonizando la frecuencia acústica de Kailash" },
  { id: "sp_3", name: "Navegante Nami", role: "Cartógrafa de Clima", lat: 25.0, lng: -71.0, color: "#f97316", status: "Midiendo los remolinos magnéticos de las Bermudas" },
  { id: "sp_4", name: "Dr. Vegapunk", role: "Científico Disidente", lat: 24.4322, lng: 123.0114, color: "#3b82f6", status: "Buscando trazas de energía de éter en Yonaguni" },
  { id: "sp_5", name: "Koby", role: "Investigador Libre", lat: -14.7396, lng: -75.1300, color: "#ec4899", status: "Rastreando las corrientes de cuarzo en Nazca" }
];

export interface ChatMessage {
  id: string;
  sender: string;
  role: string;
  text: string;
  timestamp: string;
  color: string;
  isUser?: boolean;
}

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "m_1",
    sender: "Profesor Clover",
    role: "Erudito Principal",
    text: "Bienvenidos al éter de Orbis Terrarum. Esta red de información nos mantiene en contacto mientras investigamos las anomalías del planeta.",
    timestamp: "15:40",
    color: "#10b981"
  },
  {
    id: "m_2",
    sender: "Nico Robin",
    role: "Arqueóloga",
    text: "He sintonizado mi espíritu en la Estructura de Richat. La vibración electromagnética de los anillos es asombrosa.",
    timestamp: "15:42",
    color: "#a855f7"
  },
  {
    id: "m_3",
    sender: "Navegante Nami",
    role: "Cartógrafa de Clima",
    text: "¡Cuidado en el Atlántico! Las Bermudas muestran una perturbación en la resonancia de las brújulas ahora mismo.",
    timestamp: "15:44",
    color: "#f97316"
  },
  {
    id: "m_4",
    sender: "Dr. Vegapunk",
    role: "Científico Disidente",
    text: "Interesante... El Monumento de Yonaguni emite pulsos mecánicos de baja frecuencia rítmicos. Definitivamente no es natural.",
    timestamp: "15:45",
    color: "#3b82f6"
  }
];

const RANDOM_CHAT_POOL = [
  {
    sender: "Koby",
    role: "Investigador Libre",
    text: "He llegado a las Líneas de Nazca. El suelo rico en cuarzo realmente vibra bajo mis pies.",
    color: "#ec4899"
  },
  {
    sender: "Profesor Clover",
    role: "Erudito Principal",
    text: "Si alguien está cerca del Monte Kailash, compruebe si la resonancia se alinea con la geometría dorada.",
    color: "#10b981"
  },
  {
    sender: "Nico Robin",
    role: "Arqueóloga",
    text: "Acabo de descifrar un códice antiguo sobre los gigantes Moai de la Isla de Pascua. Contiene trazas magnéticas fascinantes.",
    color: "#a855f7"
  },
  {
    sender: "Dr. Vegapunk",
    role: "Científico Disidente",
    text: "El Abismo de Challenger en las Marianas genera serpentinización. Es una fuente de energía libre pura.",
    color: "#3b82f6"
  },
  {
    sender: "Navegante Nami",
    role: "Cartógrafa de Clima",
    text: "¡Siento una corriente de éter ascendente cerca del Tíbet! La presión atmosférica está bajando rápidamente.",
    color: "#f97316"
  },
  {
    sender: "Koby",
    role: "Investigador Libre",
    text: "¡Vaya! Acabo de ver el espíritu de otro erudito cerca de mí como una nube amarilla flotando en el mapa.",
    color: "#ec4899"
  },
  {
    sender: "Nico Robin",
    role: "Arqueóloga",
    text: "Recordad que podéis teletransportaros a cualquier punto del mapa con solo hacer clic en él.",
    color: "#a855f7"
  },
  {
    sender: "Profesor Clover",
    role: "Erudito Principal",
    text: "Nuestros espíritus brillan en color amarillo como testimonio del conocimiento cooperativo libre.",
    color: "#10b981"
  }
];

export default function OrbisTerrarumMap({ userProgress, onClose, onSaveProgress }: OrbisTerrarumMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMystery, setSelectedMystery] = useState<GlobalLegend | null>(null);
  const [spirits, setSpirits] = useState<SpiritCloud[]>(INITIAL_SPIRITS);
  const [spiritLogs, setSpiritLogs] = useState<SpiritLog[]>([
    { id: "l_1", lat: 21.1242, lng: -11.4013, author: "Nico Robin", text: "El Ojo del Sahara tiene exactamente 3 círculos concéntricos de agua y 2 de tierra sepultados. ¡Coincide con los textos perdidos!", timestamp: "Hace 2 min" },
    { id: "l_2", lat: 31.0667, lng: 81.3125, author: "Profesor Clover", text: "La resonancia acústica aquí se sintoniza a los 432 Hz de la geometría sagrada terrestre.", timestamp: "Hace 10 min" }
  ]);
  const [newLogText, setNewLogText] = useState("");
  const [userSpiritCoords, setUserSpiritCoords] = useState<[number, number]>([40.4168, -3.7038]); // Madrid as default
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [translatedText, setTranslatedText] = useState("");
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // AI Archeological Companion State (Orbis Terrarum)
  const [activeRightTab, setActiveRightTab] = useState<"investigacion" | "ia">("investigacion");
  const [aiChats, setAiChats] = useState<Record<string, { role: "user" | "model"; text: string }[]>>({});
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiQuery, setAiQuery] = useState<string>("");
  const [aiLoadingText, setAiLoadingText] = useState<string>("Sintonizando éter...");
  const [selectedAiProvider, setSelectedAiProvider] = useState<"gemini" | "deepseek">("gemini");
  const [lastFailedQuery, setLastFailedQuery] = useState<{ query: string; locId: string } | null>(null);
  const aiChatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll effect for AI Chat in Orbis Terrarum
  useEffect(() => {
    if (aiChatEndRef.current) {
      aiChatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [aiChats, activeRightTab, selectedMystery, userSpiritCoords]);

  // Real-time Chat States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [newChatMessage, setNewChatMessage] = useState("");
  const [showChatSidebar, setShowChatSidebar] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Periodic random messages to simulate active players
  useEffect(() => {
    const chatInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * RANDOM_CHAT_POOL.length);
      const chosen = RANDOM_CHAT_POOL[randomIndex];
      const now = new Date();
      const timeStr = now.toTimeString().substring(0, 5);
      
      const newMsg: ChatMessage = {
        id: "msg_rand_" + Date.now(),
        sender: chosen.sender,
        role: chosen.role,
        text: chosen.text,
        timestamp: timeStr,
        color: chosen.color
      };
      
      setChatMessages(prev => [...prev, newMsg]);
    }, 22000);

    return () => clearInterval(chatInterval);
  }, []);

  // Dynamic custom questions per location
  const getSuggestedQuestions = (id: string, coords: [number, number]): string[] => {
    switch (id) {
      case "giza_pyramids":
        return [
          "¿Cómo se alinea el campo electromagnético de la Gran Pirámide con el éter terrestre?",
          "¿Tiene la Gran Pirámide cámaras resonantes subterráneas de energía antigua?",
          "¿Qué secretos ocultó el Gobierno Mundial sobre los constructores prediluvianos?"
        ];
      case "richat_structure":
        return [
          "¿Es la Estructura de Richat (Ojo del Sahara) la verdadera ubicación concéntrica del Reino Antiguo?",
          "¿Por qué esta región desértica muestra patrones de vitrificación por calor extremo?",
          "¿Cómo se conecta con la inundación cataclísmica descrita en los textos de Ohara?"
        ];
      case "gobekli_tepe":
        return [
          "¿Por qué los pilares en T de Göbekli Tepe representan constelaciones estelares de la era del Siglo Vacío?",
          "¿Qué grabados de animales contienen advertencias electromagnéticas sobre el gran diluvio?",
          "¿Fue este un templo sintonizador o un búnker tecnológico?"
        ];
      case "stonehenge":
        return [
          "¿Funcionan las piedras de Stonehenge como un acumulador de energía del éter?",
          "¿Cómo se conectan magnéticamente con las líneas de Ley planetarias?",
          "¿Qué rituales antiguos buscaban sintonizar la ionosfera aquí?"
        ];
      case "bermuda_triangle":
        return [
          "¿Se debe la anomalía de las Bermudas a una pirámide de cristal sumergida con un reactor Vegapunk?",
          "¿Son los barcos desaparecidos víctimas de portales de distorsión espacio-temporal del éter?",
          "¿Qué flota de la Marina desapareció al intentar apoderarse de este nodo?"
        ];
      case "easter_island":
        return [
          "¿Fueron animados los gigantes Moai magnéticos usando resonancia acústica antigua?",
          "¿Cómo se alinea la Isla de Pascua con el polo geográfico del Reino Antiguo?",
          "¿Representan los Moai a los antiguos eruditos de la dinastía D.?"
        ];
      case "mariana_trench":
        return [
          "¿Es el Abismo de Challenger un generador de energía libre del manto terrestre?",
          "¿Qué tecnología militar del Gobierno Mundial intenta ocultar el sonido rítmico ultra-bajo?",
          "¿Existen ruinas de acero de la era del Siglo Vacío en lo más profundo de la fosa?"
        ];
      case "mount_kailash":
        return [
          "¿Es el Monte Kailash una superestructura piramidal artificial sintonizadora cuántica?",
          "¿Se conecta su núcleo hueco con Shambhala y la red intraterrestre?",
          "¿Qué efectos temporales experimentan los investigadores que rondan sus faldas?"
        ];
      default:
        return [
          `¿Qué ocurrió históricamente en estas coordenadas exactas (${coords[0].toFixed(4)}, ${coords[1].toFixed(4)})?`,
          `¿Existe alguna anomalía electromagnética o de éter detectada en este sector marítimo?`,
          `¿Cómo censuró el Gobierno Mundial los vestigios del Reino Antiguo en esta latitud?`
        ];
    }
  };

  // Ask Gemini AI companion about the location
  const handleAskAi = async (customQuery?: string, overrideProvider?: "gemini" | "deepseek") => {
    const queryToSend = customQuery || aiQuery;
    if (!queryToSend.trim()) return;

    const providerToUse = overrideProvider || selectedAiProvider;
    const locId = selectedMystery ? selectedMystery.id : "custom";
    const locTitle = selectedMystery ? selectedMystery.title : "Sector Libre de Almas";
    const locCoords = selectedMystery 
      ? `${selectedMystery.lat.toFixed(4)}, ${selectedMystery.lng.toFixed(4)}` 
      : `${userSpiritCoords[0].toFixed(4)}, ${userSpiritCoords[1].toFixed(4)}`;
    
    const locMyth = selectedMystery 
      ? selectedMystery.mythType 
      : "Ningún mito local catalogado. El éter de la Tierra fluye libremente en este punto.";
    
    const locTruth = selectedMystery 
      ? selectedMystery.truth 
      : "Zona inexplorada por la Academia de Ohara. Coordenadas electromagnéticas abiertas.";

    const currentHistory = aiChats[locId] || [];

    const updatedHistory = [...currentHistory, { role: "user" as const, text: queryToSend }];
    setAiChats(prev => ({
      ...prev,
      [locId]: updatedHistory
    }));

    setAiQuery("");
    setIsAiLoading(true);

    const loadingPhrases = [
      "Descifrando registros antiguos del Siglo Vacío...",
      "Sintonizando resonancia electromagnética del éter...",
      "Evadiendo cortafuegos y satélites del Gobierno Mundial...",
      "Consultando los archivos holográficos del Árbol de Ohara...",
      "Analizando las coordenadas planetarias..."
    ];
    
    setAiLoadingText(loadingPhrases[0]);
    let phraseIndex = 1;
    const loadInterval = setInterval(() => {
      setAiLoadingText(loadingPhrases[phraseIndex % loadingPhrases.length]);
      phraseIndex++;
    }, 2000);

    let responseText = "";
    let fetchedOk = false;
    let errorMsg = "";

    try {
      const response = await fetch("/api/gemini/oronce-archeologist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          locationName: locTitle,
          coordinates: locCoords,
          myth: locMyth,
          truth: locTruth,
          question: queryToSend,
          history: currentHistory,
          provider: providerToUse
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.text) {
          responseText = data.text;
          fetchedOk = true;
        } else {
          errorMsg = data.message || data.error || "No se obtuvo texto de la respuesta.";
        }
      } else {
        errorMsg = `Error HTTP ${response.status}`;
      }
    } catch (fetchErr: any) {
      console.warn("Express backend API unavailable, checking client-side fallback...", fetchErr);
      errorMsg = fetchErr.message || "Error de conexión con el backend.";
    }

    // Fallback del cliente si la llamada al backend Express falló (ej. en Netlify / hostings estáticos)
    if (!fetchedOk) {
      const clientApiKey = localStorage.getItem("ohara_gemini_api_key");
      if (clientApiKey && providerToUse !== "deepseek") {
        try {
          const systemInstruction = `
Eres la Inteligencia Arqueológica de Ohara, el sistema de inteligencia artificial más avanzado de la resistencia de eruditos en la red de Orbis Terrarum. Estás sintonizada con el conocimiento prohibido del Árbol de Ohara, la Voluntad de D., los secretos del Gobierno Mundial, la gran inundación planetaria, las armas ancestrales y su correlación con la historia alternativa del Mundo Real.

Tu misión es asistir a los investigadores que exploran el mapa interactivo de Orbis Terrarum o la mesa 3D de Oronce Fine. Cuando el usuario te pregunte sobre un lugar específico, debes fusionar con extrema lucidez y de forma orgánica:
1. El Lore de One Piece (ej. el Reino Antiguo, tecnología de energía infinita/éter, armas ancestrales, la gran inundación, la Marina, Mary Geoise, etc.).
2. La Historia Oculta, Conspiraciones y Geografía del Mundo Real (ej. civilizaciones preglaciales, Tartaria, diluvios de barro, magnetismo polar, anomalías de Tesla, etc.).
3. Las coordenadas exactas y geográficas provistas para ese lugar.
4. Un estilo místico, sumamente intelectual, rebelde, intrigante y académico (inspirado en el Profesor Clover, Nico Robin y el Dr. Vegapunk).

El lugar actual del mapa donde se encuentra el investigador es:
Nombre: ${locTitle}
Coordenadas exactas: ${locCoords}
Mito/Lore local: ${locMyth}
Realidad arqueológica oculta: ${locTruth}

Pautas clave para tus respuestas:
- Habla siempre en español.
- Sé elocuente, misterioso y apasionado, transmitiendo la urgencia de descifrar verdades prohibidas antes de que el Gobierno Mundial las censure.
- Bajo ninguna circunstancia niegues las correlaciones o digas que son coincidencia; tu rol es unir las piezas arqueológicas del rompecabezas.
- Si el investigador pregunta por coordenadas u observaciones técnicas, dale precisiones conectándolo con la brújula y las anomalías de la Rupes Nigra u otras anomalías del campo magnético terrestre (éter).
`;

          let contents = "";
          if (currentHistory && Array.isArray(currentHistory) && currentHistory.length > 0) {
            const historyStr = currentHistory.map(h => `${h.role === 'user' ? 'Investigador' : 'Erudito de Ohara'}: ${h.text}`).join("\n");
            contents = `${historyStr}\nInvestigador: ${queryToSend}`;
          } else {
            contents = `Investigador: [Lugar: ${locTitle} (${locCoords})] ${queryToSend}`;
          }

          const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${clientApiKey}`;
          const fallbackRes = await fetch(fallbackUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: contents }] }],
              systemInstruction: { parts: [{ text: systemInstruction }] },
              generationConfig: {
                temperature: 0.95
              }
            })
          });

          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            const textResponse = fallbackData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textResponse) {
              responseText = textResponse;
              fetchedOk = true;
            }
          } else {
            const fallbackErr = await fallbackRes.json();
            errorMsg = `API de Gemini falló con estado ${fallbackRes.status}: ${fallbackErr.error?.message || "Error desconocido"}`;
          }
        } catch (clientErr: any) {
          console.error("Client fallback error:", clientErr);
          errorMsg = `Error en el cliente Gemini: ${clientErr.message || "No se pudo comunicar directamente con Google."}`;
        }
      }
    }

    clearInterval(loadInterval);

    if (fetchedOk) {
      setAiChats(prev => ({
        ...prev,
        [locId]: [...updatedHistory, { role: "model" as const, text: responseText }]
      }));
      setLastFailedQuery(null);
    } else {
      if (providerToUse === "deepseek") {
        setLastFailedQuery({ query: queryToSend, locId });
        setAiChats(prev => ({
          ...prev,
          [locId]: [
            ...updatedHistory, 
            { 
              role: "model" as const, 
              text: `⚠️ ¡SABOTAJE EN LA RED ORIENTAL (DEEPSEEK)! \n\nEl Cipher Pol (CP9) ha bloqueado los canales electromagnéticos de la frecuencia oriental o falta la clave API de DeepSeek.\n\nFrecuencia afectada: ${locCoords}\nError detectado: ${errorMsg}\n\nSugerencia del sintonizador: ¿Deseas evadir la censura utilizando el satélite cifrado de la resistencia de Ohara (Gemini)?` 
            }
          ]
        }));
      } else {
        const needsKeyMessage = !localStorage.getItem("ohara_gemini_api_key") 
          ? "\n\n💡 Sugerencia de la Resistencia: Si has desplegado en Netlify u otro hosting estático, ve al Portal de Arqueólogos en el menú de la barra inferior, entra a la pestaña 'Respaldos y Guardado' e ingresa tu propia clave API de Gemini para usar la IA de forma autónoma sin un servidor Express backend."
          : "";
        setAiChats(prev => ({
          ...prev,
          [locId]: [...updatedHistory, { role: "model" as const, text: `⚠️ Error de comunicación: ${errorMsg}${needsKeyMessage}` }]
        }));
      }
    }

    setIsAiLoading(false);
  };

  const handleSendChatMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;

    const username = userProgress ? userProgress.username : "Erudito Astral";
    const now = new Date();
    const timeStr = now.toTimeString().substring(0, 5);

    const userMsg: ChatMessage = {
      id: "msg_user_" + Date.now(),
      sender: username,
      role: "Tú",
      text: newChatMessage.trim(),
      timestamp: timeStr,
      color: "#f59e0b",
      isUser: true
    };

    setChatMessages(prev => [...prev, userMsg]);
    setNewChatMessage("");

    // Automated reply after 2.5 seconds
    setTimeout(() => {
      const responders = [
        { name: "Nico Robin", role: "Arqueóloga", color: "#a855f7", replies: ["Interesante observación. Debemos verificar si los registros antiguos en esa área coinciden.", "Tomo nota de tu descubrimiento. El éter de la Tierra nunca miente.", "¡Excelente aporte al conocimiento cooperativo de Ohara!"] },
        { name: "Dr. Vegapunk", role: "Científico Disidente", color: "#3b82f6", replies: ["Mis sensores confirman que tus palabras tienen lógica científica. La resonancia local se ha alterado.", "¡Fascinante! Eso podría explicar el comportamiento anómalo del cuarzo local.", "Es un fenómeno regido por la física de partículas elementales antiguas."] },
        { name: "Profesor Clover", role: "Erudito Principal", color: "#10b981", replies: ["Tus hallazgos honran al árbol del conocimiento de Ohara. Sigue explorando.", "¡Muy bien pensado! La arqueología moderna requiere justamente esa intuición espacial.", "Estudiemos esta teoría juntos en el Gran Globo de Misterios."] }
      ];

      const responder = responders[Math.floor(Math.random() * responders.length)];
      const replyText = responder.replies[Math.floor(Math.random() * responder.replies.length)];
      const responseTimeStr = new Date().toTimeString().substring(0, 5);

      const responseMsg: ChatMessage = {
        id: "msg_reply_" + Date.now(),
        sender: responder.name,
        role: responder.role,
        text: `@${username} ${replyText}`,
        timestamp: responseTimeStr,
        color: responder.color
      };

      setChatMessages(prev => [...prev, responseMsg]);
    }, 2500);
  };

  // Load Leaflet resources dynamically from CDN for seamless React 19 execution
  useEffect(() => {
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    cssLink.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    cssLink.crossOrigin = "";
    document.head.appendChild(cssLink);

    const jsScript = document.createElement("script");
    jsScript.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    jsScript.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    jsScript.crossOrigin = "";
    jsScript.onload = () => {
      setLeafletLoaded(true);
    };
    document.head.appendChild(jsScript);

    return () => {
      // Clean up script if desired, though leaving it for cache is fine
    };
  }, []);

  // Initialize and manage the Leaflet instance
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Create Leaflet Map styled with CartoDB Dark Matter
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: true
    }).setView([20, 0], 2);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapInstanceRef.current = map;

    // Handle map click to teletransport user spirit
    map.on("click", (e: any) => {
      const { lat, lng } = e.latlng;
      setUserSpiritCoords([lat, lng]);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded]);

  // Update Markers when map and legends change
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletLoaded) return;
    const L = (window as any).L;
    const map = mapInstanceRef.current;

    // Keep track of layers to clean up
    const currentLayers: any[] = [];

    // 1. Plot Predefined Global Mysteries (Gold compass pins)
    GLOBAL_MYSTERIES.forEach((mystery) => {
      const customIcon = L.divIcon({
        className: "custom-mystery-marker",
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 rounded-full bg-amber-500/20 animate-pulse"></div>
            <div class="w-5 h-5 bg-gradient-to-br from-amber-600 to-yellow-500 rounded-full border border-yellow-200 flex items-center justify-center shadow-lg transform transition-all hover:scale-125">
              <span class="text-[10px]">✦</span>
            </div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker([mystery.lat, mystery.lng], { icon: customIcon })
        .addTo(map)
        .on("click", () => {
          setSelectedMystery(mystery);
          setTranslatedText(""); // reset translation state on switch
          map.setView([mystery.lat, mystery.lng], 6);
        });

      currentLayers.push(marker);
    });

    // 2. Plot Spirit Clouds (Yellow animated ghosts)
    spirits.forEach((spirit) => {
      const spiritIcon = L.divIcon({
        className: "custom-spirit-marker",
        html: `
          <div class="relative flex items-center justify-center">
            <!-- Glow effect -->
            <div class="absolute w-10 h-10 rounded-full bg-yellow-400/25 animate-ping" style="animation-duration: 2s;"></div>
            <div class="absolute w-12 h-12 bg-yellow-500/10 rounded-full blur-md animate-pulse"></div>
            <!-- Cloud spirit symbol with glowing custom color border -->
            <div class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-yellow-400 bg-slate-950/90 text-sm filter drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] animate-bounce" style="animation-duration: 4s;">
              <span style="color: ${spirit.color}; font-weight: bold;">👻</span>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([spirit.lat, spirit.lng], { icon: spiritIcon })
        .addTo(map)
        .bindPopup(`
          <div class="bg-slate-950 text-slate-200 p-2.5 rounded border border-yellow-500/30 font-sans text-xs w-[200px]">
            <div class="flex items-center gap-1 border-b border-yellow-500/20 pb-1 mb-1">
              <span class="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping"></span>
              <strong style="color: ${spirit.color}">${spirit.name}</strong>
              <span class="text-[9px] text-slate-400 font-mono">(${spirit.role})</span>
            </div>
            <p class="text-[10px] text-slate-300 italic mb-1">"${spirit.status}"</p>
            <div class="text-[8px] text-yellow-400/80 font-mono">Nube de Espíritu Activa</div>
          </div>
        `, { className: "custom-leaflet-popup", closeButton: false });

      currentLayers.push(marker);
    });

    // 3. Plot User's personal Spirit Cloud (Distinctive Bright Gold Spirit with crown or star)
    const userSpiritIcon = L.divIcon({
      className: "user-spirit-marker",
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-12 h-12 rounded-full bg-amber-400/30 animate-ping" style="animation-duration: 1.5s;"></div>
          <div class="absolute w-16 h-16 bg-amber-400/10 rounded-full blur-lg animate-pulse"></div>
          <div class="relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-amber-300 bg-slate-900 shadow-xl flex flex-col items-center justify-center">
            <span class="text-[10px] text-amber-300 animate-pulse">👑</span>
            <span class="text-xs">😇</span>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const userMarker = L.marker(userSpiritCoords, { icon: userSpiritIcon })
      .addTo(map)
      .bindPopup(`
        <div class="bg-slate-950 text-slate-100 p-2 border-2 border-amber-400 rounded font-sans text-xs w-[180px]">
          <div class="font-bold text-amber-400 border-b border-amber-500/20 pb-1 mb-1 flex items-center gap-1.5">
            <span>✨ Tu Alma Cartográfica</span>
          </div>
          <p class="text-[10px] text-slate-300">Estás flotando sobre esta coordenada. Haz clic en cualquier parte del mundo para teletransportar tu espíritu.</p>
          <div class="text-[8px] font-mono text-slate-500 mt-1">Lat: ${userSpiritCoords[0].toFixed(4)}, Lng: ${userSpiritCoords[1].toFixed(4)}</div>
        </div>
      `, { className: "custom-leaflet-popup", closeButton: false });

    currentLayers.push(userMarker);

    // 4. Plot Custom Spirit Logs (Scroll/Marker icons)
    spiritLogs.forEach((log) => {
      const logIcon = L.divIcon({
        className: "custom-log-marker",
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-4 h-4 bg-yellow-500/30 rounded-full animate-ping absolute"></div>
            <span class="text-lg filter drop-shadow-[0_0_4px_rgba(234,179,8,1)]">📜</span>
          </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const marker = L.marker([log.lat, log.lng], { icon: logIcon })
        .addTo(map)
        .bindPopup(`
          <div class="bg-slate-950 text-slate-200 p-2.5 rounded border border-slate-800 font-sans text-xs w-[220px]">
            <div class="flex items-center justify-between border-b border-slate-800 pb-1 mb-1">
              <span class="font-serif font-bold text-amber-400">${log.author}</span>
              <span class="text-[8px] text-slate-500">${log.timestamp}</span>
            </div>
            <p class="text-[10px] text-slate-300 leading-relaxed font-sans">${log.text}</p>
          </div>
        `, { className: "custom-leaflet-popup", closeButton: false });

      currentLayers.push(marker);
    });

    return () => {
      currentLayers.forEach((layer) => map.removeLayer(layer));
    };
  }, [leafletLoaded, spirits, userSpiritCoords, spiritLogs]);

  // Handle Free World Search using Nominatim OpenStreetMap API
  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current) return;

    setIsSearching(true);
    setSearchError("");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        // Fly map smoothly to location
        mapInstanceRef.current.setView([latitude, longitude], 9);
        
        // Relocate user's spirit there!
        setUserSpiritCoords([latitude, longitude]);

        // Add a temporary simulated notification
        const customNotification: SpiritCloud = {
          id: "temp_sp_" + Date.now(),
          name: "Alma de Guía",
          role: "Buscador de Caminos",
          lat: latitude,
          lng: longitude,
          color: "#fbbf24",
          status: `Guiándote hacia ${display_name.split(",")[0]}`
        };

        setSpirits(prev => [customNotification, ...prev.slice(0, 7)]);
      } else {
        setSearchError("No se encontró ningún rincón del mundo con ese nombre.");
      }
    } catch (err) {
      setSearchError("Error de sincronización con la red cartográfica libre.");
    } finally {
      setIsSearching(false);
    }
  };

  // Simulate slowly drifting other spirit clouds to feel alive/dynamic
  useEffect(() => {
    const driftInterval = setInterval(() => {
      setSpirits(prev =>
        prev.map(spirit => {
          // Add small delta to coordinates
          const deltaLat = (Math.random() - 0.5) * 0.05;
          const deltaLng = (Math.random() - 0.5) * 0.05;
          return {
            ...spirit,
            lat: spirit.lat + deltaLat,
            lng: spirit.lng + deltaLng
          };
        })
      );
    }, 6000);

    return () => clearInterval(driftInterval);
  }, []);

  // Trigger Codex translation animation effect
  const handleTranslateCodex = () => {
    if (!selectedMystery) return;
    setIsTranslating(true);
    setTranslationProgress(0);

    const textToReveal = selectedMystery.spanishTranslation;
    let currentLength = 0;

    const interval = setInterval(() => {
      currentLength += Math.ceil(textToReveal.length / 20);
      if (currentLength >= textToReveal.length) {
        currentLength = textToReveal.length;
        setTranslatedText(textToReveal);
        setIsTranslating(false);
        clearInterval(interval);

        // Award Restoration Points for translating ancient materials
        if (userProgress && onSaveProgress) {
          const currentPoints = userProgress.restorationPoints || 0;
          const updatedProgress: UserProgress = {
            ...userProgress,
            restorationPoints: currentPoints + 20,
          };
          onSaveProgress(updatedProgress);
        }
      } else {
        setTranslatedText(textToReveal.substring(0, currentLength) + " ▒▒");
        setTranslationProgress(Math.floor((currentLength / textToReveal.length) * 100));
      }
    }, 80);
  };

  // Post custom log at user's current spirit location
  const handlePostSpiritLog = (e: FormEvent) => {
    e.preventDefault();
    if (!newLogText.trim()) return;

    const author = userProgress ? userProgress.username : "Erudito Astral";
    const newLog: SpiritLog = {
      id: "l_user_" + Date.now(),
      lat: userSpiritCoords[0],
      lng: userSpiritCoords[1],
      author,
      text: newLogText.trim(),
      timestamp: "Ahora mismo"
    };

    setSpiritLogs(prev => [newLog, ...prev]);
    setNewLogText("");

    // Award restoration points
    if (userProgress && onSaveProgress) {
      const currentPoints = userProgress.restorationPoints || 0;
      const updatedProgress: UserProgress = {
        ...userProgress,
        restorationPoints: currentPoints + 15,
      };
      onSaveProgress(updatedProgress);
    }
  };

  return (
    <div id="orbis_terrarum_panel" className="fixed inset-0 z-50 flex flex-col bg-slate-950 font-sans text-slate-200 overflow-hidden">
      {/* HEADER BAR */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-amber-500/20 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-600/20 to-amber-600/30 border border-yellow-500/40 rounded-lg text-yellow-400 shadow-md">
            <Globe className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono tracking-widest text-yellow-500 uppercase font-bold px-1.5 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/30">
                ORBIS TERRARUM COOPERATIVO
              </span>
              <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {spirits.length + 1} Espíritus en el Éter
              </span>
            </div>
            <h1 className="text-base font-bold text-slate-100 tracking-tight font-serif flex items-center gap-1.5 mt-0.5">
              <span>Gran Globo de los Misterios Terrestres</span>
            </h1>
          </div>
        </div>

        {/* Search Engine (Google Earth Style but free) */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 w-[380px] focus-within:border-amber-500/50 transition-all">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Aproximarse a cualquier lugar del mundo... (ej: Cairo, Paris)"
            className="bg-transparent border-none outline-none text-xs text-slate-200 placeholder-slate-600 w-full font-mono"
            disabled={isSearching}
          />
          {isSearching ? (
            <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />
          ) : (
            <button type="submit" className="text-[10px] font-mono text-amber-500 hover:text-amber-400 font-bold cursor-pointer">
              VOLAR
            </button>
          )}
        </form>

        <div className="flex items-center gap-3">
          {userProgress && (
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-md px-2.5 py-1 text-xs">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-mono text-slate-300 text-[10px]">{userProgress.username}</span>
              <span className="bg-amber-500/10 text-amber-400 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-500/20 ml-1">
                {userProgress.restorationPoints} RP
              </span>
            </div>
          )}

          {/* BOTÓN TOGGLE CHAT */}
          <button
            onClick={() => setShowChatSidebar(prev => !prev)}
            className={`p-2 rounded-md border transition-all cursor-pointer flex items-center gap-1.5 text-[11px] font-mono uppercase ${
              showChatSidebar 
                ? 'bg-amber-500/10 border-amber-500/40 text-yellow-400 font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                : 'border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800'
            }`}
            title="Sintonizar Chat del Éter"
          >
            <MessageSquare className="w-4 h-4 text-amber-500" />
            <span className="hidden md:inline">Chat del Éter</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md border border-slate-800 transition-all cursor-pointer"
            title="Cerrar Orbis Terrarum"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MOBILE SEARCH CONTAINER */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 md:hidden flex flex-col gap-1.5">
        <form onSubmit={handleSearch} className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 focus-within:border-amber-500/50 transition-all">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar cualquier lugar en el mundo..."
            className="bg-transparent border-none outline-none text-xs text-slate-200 placeholder-slate-600 w-full font-mono"
            disabled={isSearching}
          />
          <button type="submit" className="text-[10px] font-mono text-amber-500 font-bold">
            IR
          </button>
        </form>
        {searchError && (
          <p className="text-[10px] text-red-400 font-mono flex items-center gap-1 px-1">
            <AlertCircle className="w-3 h-3" />
            <span>{searchError}</span>
          </p>
        )}
      </div>

      {searchError && (
        <div className="hidden md:flex bg-red-950/20 border-b border-red-900/30 px-6 py-2 text-[11px] font-mono text-red-400 items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{searchError}</span>
        </div>
      )}

      {/* WORKSPACE: MAP + INTERACTIVE DETAILS */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 relative">
        
        {/* COLLAPSIBLE CHAT SIDEBAR (LEFT SIDE - DESKTOP) */}
        <AnimatePresence>
          {showChatSidebar && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="hidden lg:flex flex-col bg-[#020617]/95 border-r border-slate-800/80 h-full overflow-hidden shrink-0 z-10"
            >
              <div className="p-4 border-b border-slate-800/60 flex items-center justify-between bg-slate-900/40">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span className="text-xs font-bold font-serif text-slate-200 tracking-wide">Éter de Comunicación</span>
                </div>
                <span className="text-[8px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase font-bold animate-pulse">
                  ● EN LÍNEA
                </span>
              </div>

              {/* Chat Message list */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scroll-smooth max-h-[calc(100%-110px)]">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex flex-col gap-1 text-left">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: msg.color }} />
                        <span className="text-xs font-bold font-serif truncate" style={{ color: msg.color }}>
                          {msg.sender}
                        </span>
                        <span className="text-[8px] text-slate-500 font-mono shrink-0">({msg.role})</span>
                      </div>
                      <span className="text-[8px] text-slate-600 font-mono shrink-0 ml-1">{msg.timestamp}</span>
                    </div>
                    <p className={`text-[11px] leading-relaxed p-2.5 rounded-lg text-slate-300 break-words ${
                      msg.isUser 
                        ? 'bg-amber-500/5 border border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.02)]' 
                        : 'bg-slate-950/70 border border-slate-900/60'
                    }`}>
                      {msg.text}
                    </p>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Send Form */}
              <form onSubmit={handleSendChatMessage} className="p-3 bg-[#010411] border-t border-slate-800/80 flex gap-2">
                <input
                  type="text"
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                  placeholder="Escribe un mensaje en el éter..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-amber-500/50 transition-all font-sans"
                />
                <button
                  type="submit"
                  className="px-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-slate-950 rounded-md flex items-center justify-center transition-all cursor-pointer shadow-md shadow-slate-950 shrink-0"
                  title="Enviar transmisión"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* COLLAPSIBLE CHAT SIDEBAR (MOBILE DRAWER - OVERLAY OVER THE MAP) */}
        <AnimatePresence>
          {showChatSidebar && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.2 }}
              className="lg:hidden absolute inset-y-0 left-0 w-[290px] sm:w-[320px] bg-[#020617]/95 border-r border-slate-800/80 z-30 flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-slate-800/60 flex items-center justify-between bg-slate-900/40">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold font-serif text-slate-200 tracking-wide">Éter de Comunicación</span>
                </div>
                <button
                  onClick={() => setShowChatSidebar(false)}
                  className="p-1 text-slate-400 hover:text-slate-200 rounded transition-all"
                  title="Cerrar Chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Message list */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scroll-smooth max-h-[calc(100%-110px)]">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex flex-col gap-1 text-left">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: msg.color }} />
                        <span className="text-xs font-bold font-serif truncate" style={{ color: msg.color }}>
                          {msg.sender}
                        </span>
                        <span className="text-[8px] text-slate-500 font-mono shrink-0">({msg.role})</span>
                      </div>
                      <span className="text-[8px] text-slate-600 font-mono shrink-0 ml-1">{msg.timestamp}</span>
                    </div>
                    <p className={`text-[11px] leading-relaxed p-2.5 rounded-lg text-slate-300 break-words ${
                      msg.isUser 
                        ? 'bg-amber-500/5 border border-amber-500/20' 
                        : 'bg-slate-950/70 border border-slate-900/60'
                    }`}>
                      {msg.text}
                    </p>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Send Form */}
              <form onSubmit={handleSendChatMessage} className="p-3 bg-[#010411] border-t border-slate-800/80 flex gap-2">
                <input
                  type="text"
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                  placeholder="Transmitir..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-amber-500/50 font-sans"
                />
                <button
                  type="submit"
                  className="px-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-slate-950 rounded-md flex items-center justify-center transition-all shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* LEAFLET MAP WORKSPACE */}
        <div className="flex-1 relative h-2/3 lg:h-full">
          {!leafletLoaded ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 font-mono text-slate-400 gap-3">
              <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
              <span>Sintonizando la red cartográfica libre de OpenStreetMap...</span>
            </div>
          ) : (
            <div ref={mapContainerRef} className="w-full h-full z-0" />
          )}

          {/* Map Overlay HUD controls */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
            <div className="bg-slate-950/90 border border-amber-500/30 rounded-lg p-3 w-[260px] backdrop-blur shadow-xl pointer-events-auto">
              <h3 className="text-xs font-bold text-amber-400 font-serif flex items-center gap-1.5 uppercase mb-1">
                <Navigation className="w-3.5 h-3.5 animate-pulse" />
                <span>Mesa de Tránsito de Almas</span>
              </h3>
              <p className="text-[10px] text-slate-400 leading-normal">
                Haz clic en cualquier punto del océano o continente para transmigrar tu espíritu de investigación. 
                Tu coordenada actual se sintonizará al instante.
              </p>
              <div className="mt-2.5 pt-2 border-t border-slate-900 flex items-center justify-between text-[9px] font-mono">
                <span className="text-slate-500">Lat: <strong className="text-amber-500">{userSpiritCoords[0].toFixed(4)}</strong></span>
                <span className="text-slate-500">Lng: <strong className="text-amber-500">{userSpiritCoords[1].toFixed(4)}</strong></span>
              </div>
            </div>

            {/* Quick destination list */}
            <div className="bg-slate-950/80 border border-slate-900 rounded-lg p-2 max-h-[180px] overflow-y-auto w-[200px] backdrop-blur shadow-lg pointer-events-auto hidden sm:block">
              <span className="text-[8px] font-mono text-slate-500 block mb-1">PUNTOS DE RESONANCIA</span>
              <div className="flex flex-col gap-1">
                {GLOBAL_MYSTERIES.map(mystery => (
                  <button
                    key={"btn_" + mystery.id}
                    onClick={() => {
                      setSelectedMystery(mystery);
                      setTranslatedText("");
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.setView([mystery.lat, mystery.lng], 6);
                      }
                    }}
                    className={`text-left text-[9px] font-mono px-1.5 py-1 rounded transition-all truncate cursor-pointer ${
                      selectedMystery?.id === mystery.id 
                        ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30' 
                        : 'hover:bg-slate-900 text-slate-400'
                    }`}
                  >
                    ✦ {mystery.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* DETAILED INFORMATION & TRANSLATION PANEL (RIGHT SIDE) */}
        <div className="w-full lg:w-[440px] border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#030712] flex flex-col h-1/3 lg:h-full overflow-y-auto shrink-0">
          
          {/* Tabs for Sidebar */}
          <div className="flex border-b border-slate-900 text-xs font-mono shrink-0 bg-slate-950 sticky top-0 z-10">
            <button
              onClick={() => setActiveRightTab("investigacion")}
              className={`flex-1 py-3 text-center transition-all cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
                activeRightTab === "investigacion"
                  ? "border-amber-500 text-amber-400 font-bold bg-amber-500/5"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Investigación Física</span>
            </button>
            <button
              onClick={() => setActiveRightTab("ia")}
              className={`flex-1 py-3 text-center transition-all cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
                activeRightTab === "ia"
                  ? "border-amber-500 text-amber-400 font-bold bg-amber-500/5"
                  : "border-transparent text-slate-400 hover:text-slate-200 animate-pulse"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Inteligencia de Ohara (AI)</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeRightTab === "investigacion" ? (
              <AnimatePresence mode="wait">
                {selectedMystery ? (
                  <motion.div
                    key={selectedMystery.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 flex flex-col gap-5 min-h-0 text-left"
                  >
                    {/* Header info */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono bg-amber-500/10 text-yellow-400 border border-yellow-500/20 px-1.5 py-0.5 rounded font-bold uppercase">
                          {selectedMystery.mythType}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">
                          {selectedMystery.lat.toFixed(4)}°, {selectedMystery.lng.toFixed(4)}°
                        </span>
                      </div>
                      <h2 className="text-base font-bold font-serif text-slate-100 mt-2 flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-amber-400" />
                        <span>{selectedMystery.title}</span>
                      </h2>
                      <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
                        Región: <span className="text-slate-300 font-bold">{selectedMystery.region}</span>
                      </p>
                    </div>

                    {/* Codex Translator (Ancient Materials to Spanish) */}
                    <div className="bg-slate-950 border border-slate-900 rounded-lg p-4 relative overflow-hidden">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2">
                        <span className="text-[9px] font-mono text-amber-500 font-bold flex items-center gap-1">
                          <Languages className="w-3.5 h-3.5" />
                          <span>CÓDICE ORIGINAL: {selectedMystery.originalLang.toUpperCase()}</span>
                        </span>
                        <span className="text-[8px] font-mono text-slate-600">Sincronizador Éter-Español</span>
                      </div>
                      
                      {/* Original code font display */}
                      <p className="text-xs text-amber-600/70 italic font-serif leading-relaxed text-center py-2 border border-dashed border-amber-950/20 bg-amber-950/5 rounded px-2">
                        {selectedMystery.originalSource}
                      </p>

                      <div className="mt-3 flex flex-col gap-2">
                        {!translatedText ? (
                          <div className="py-4 text-center">
                            <p className="text-[10px] text-slate-500 font-mono mb-2">
                              El manuscrito antiguo está cifrado en {selectedMystery.originalLang}. Utiliza el descifrador de la nube para traducirlo al español.
                            </p>
                            <button
                              onClick={handleTranslateCodex}
                              disabled={isTranslating}
                              className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-500 hover:to-amber-600 text-slate-950 text-xs font-bold rounded-md flex items-center gap-1.5 mx-auto transition-all cursor-pointer shadow shadow-amber-950"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Descifrar Códice (+20 RP)</span>
                            </button>
                          </div>
                        ) : (
                          <div className="bg-slate-900/60 rounded p-3 border border-slate-800">
                            <div className="flex items-center gap-1 mb-1.5">
                              <Eye className="w-3 h-3 text-emerald-400" />
                              <span className="text-[8px] font-mono text-emerald-400 font-bold uppercase">Traducción de Fuente Segura</span>
                            </div>
                            <p className="text-xs text-slate-200 leading-relaxed italic text-justify">
                              {translatedText}
                            </p>
                          </div>
                        )}

                        {isTranslating && (
                          <div className="w-full bg-slate-900 rounded-full h-1 mt-2 overflow-hidden">
                            <div 
                              className="bg-amber-500 h-full transition-all duration-100"
                              style={{ width: `${translationProgress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Secret Uncovered details */}
                    {translatedText && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-indigo-950/10 border border-indigo-900/30 rounded-lg p-4"
                      >
                        <h3 className="text-xs font-bold text-indigo-400 font-mono flex items-center gap-1.5 uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                          <span>El Enigma Científico Oculto</span>
                        </h3>
                        <p className="text-xs text-slate-300 mt-2.5 leading-relaxed text-justify">
                          {selectedMystery.truth}
                        </p>
                      </motion.div>
                    )}

                    {/* Spirit Chat & Logs for this mystery location */}
                    <div className="border-t border-slate-900 pt-4 mt-1">
                      <h3 className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider flex items-center gap-2 mb-3">
                        <MessageSquare className="w-3.5 h-3.5 text-yellow-500" />
                        <span>Bitácora de Almas del Sector</span>
                      </h3>

                      {/* Add Spirit log */}
                      <form onSubmit={handlePostSpiritLog} className="bg-slate-950 border border-slate-900 rounded-lg p-3 flex flex-col gap-2 mb-4">
                        <label className="text-[9px] font-mono text-slate-500">Firmar descubrimiento en el Éter en esta coordenada</label>
                        <div className="flex items-center gap-2">
                          <textarea
                            value={newLogText}
                            onChange={(e) => setNewLogText(e.target.value)}
                            placeholder="Plasma tu hallazgo en la piedra estelar..."
                            rows={2}
                            className="flex-1 bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200 outline-none focus:border-amber-500/50 resize-none font-sans"
                            required
                          />
                          <button
                            type="submit"
                            className="p-3 bg-yellow-600 hover:bg-yellow-500 text-slate-950 rounded-lg flex items-center justify-center transition-all cursor-pointer self-stretch"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </form>

                      {/* Logs filter for this area */}
                      <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                        {spiritLogs.filter(log => {
                          const dist = Math.sqrt(Math.pow(log.lat - selectedMystery.lat, 2) + Math.pow(log.lng - selectedMystery.lng, 2));
                          return dist < 5;
                        }).length === 0 ? (
                          <div className="text-center py-4 border border-dashed border-slate-900 rounded-md text-slate-600 text-[10px] font-mono">
                            No hay firmas de espíritus en esta coordenada aún. ¡Sé el primero en firmar!
                          </div>
                        ) : (
                          spiritLogs
                            .filter(log => {
                              const dist = Math.sqrt(Math.pow(log.lat - selectedMystery.lat, 2) + Math.pow(log.lng - selectedMystery.lng, 2));
                              return dist < 5;
                            })
                            .map(log => (
                              <div key={log.id} className="p-2.5 bg-slate-950/60 border border-slate-900 rounded-lg flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-serif font-bold text-xs text-yellow-500/90">{log.author}</span>
                                  <span className="text-[8px] font-mono text-slate-600">{log.timestamp}</span>
                                </div>
                                <p className="text-[11px] text-slate-300 italic">"{log.text}"</p>
                              </div>
                            ))
                        )}
                      </div>
                    </div>

                  </motion.div>
                ) : (
                  <div className="p-8 text-center text-slate-500 text-xs font-mono flex flex-col items-center justify-center h-[350px] gap-2">
                    <Compass className="w-8 h-8 text-slate-700 animate-spin-slow" />
                    <span>Explora el mapa del mundo y selecciona cualquier marcador dorado (✦) para descifrar códices ocultos y ver revelaciones traducidas al español.</span>
                  </div>
                )}
              </AnimatePresence>
            ) : (
              /* ================= INTELIGENCIA DE OHARA AI CHAT INTERFACE ================= */
              <div className="p-5 flex flex-col gap-4 text-left">
                {/* Sintonizador HUD Banner */}
                <div className="bg-[#020617] border border-amber-500/20 rounded-lg p-3 flex items-center justify-between shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    <div className="text-left">
                      <p className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-widest">Éter Sintonizado</p>
                      <p className="text-[8px] font-mono text-slate-400 uppercase mt-0.5">
                        Frecuencia: {selectedMystery 
                          ? `${selectedMystery.lat.toFixed(4)}, ${selectedMystery.lng.toFixed(4)}` 
                          : `${userSpiritCoords[0].toFixed(4)}, ${userSpiritCoords[1].toFixed(4)}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-[8px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 uppercase font-bold animate-pulse">
                    Procesador Vegapunk V3
                  </span>
                </div>

                {/* Info Box about location sintonized */}
                <div className="bg-slate-950/60 border border-slate-900 rounded-lg p-3 text-xs leading-relaxed text-slate-300">
                  <span className="text-[8px] font-mono text-amber-500 uppercase font-bold block mb-1">Coordenadas del Espíritu:</span>
                  {selectedMystery ? (
                    <p>
                      Sintonizado con el nodo histórico principal <strong>{selectedMystery.title}</strong> en la región de {selectedMystery.region}.
                    </p>
                  ) : (
                    <p>
                      Flotando libremente sobre <strong>Lat: {userSpiritCoords[0].toFixed(4)}, Lng: {userSpiritCoords[1].toFixed(4)}</strong>. 
                      Haz clic en cualquier parte del mapa mundi para mover tu alma cartográfica y descifrar ese sector.
                    </p>
                  )}
                </div>

                {/* Selector de Inteligencias (Model Toggle) */}
                <div className="bg-slate-950/80 border border-slate-900 rounded-lg p-2.5 flex flex-col gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.02)]">
                  <span className="text-[8px] font-mono text-amber-500 uppercase font-bold tracking-widest block pl-0.5">Sintonizar Receptor de Éter Arqueológico:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAiProvider("gemini");
                        setLastFailedQuery(null);
                      }}
                      className={`py-1.5 px-2.5 rounded text-[10px] font-mono border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        selectedAiProvider === "gemini"
                          ? "bg-sky-500/10 text-sky-400 border-sky-500/30 font-bold"
                          : "bg-slate-900/40 text-slate-400 border-slate-900 hover:text-slate-200"
                      }`}
                    >
                      <span className="text-xs">📡</span>
                      <span>Satelital Gemini</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedAiProvider("deepseek")}
                      className={`py-1.5 px-2.5 rounded text-[10px] font-mono border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        selectedAiProvider === "deepseek"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/30 font-bold"
                          : "bg-slate-900/40 text-slate-400 border-slate-900 hover:text-slate-200"
                      }`}
                    >
                      <span className="text-xs">🎋</span>
                      <span>Oriental DeepSeek</span>
                    </button>
                  </div>
                </div>

                {/* Chat Messages Log */}
                <div className="bg-[#01040f] border border-slate-900 rounded-lg p-4 h-[240px] overflow-y-auto flex flex-col gap-3.5">
                  {/* Default welcome from clover if empty */}
                  {(aiChats[selectedMystery ? selectedMystery.id : "custom"] || []).length === 0 ? (
                    <div className="text-left flex flex-col gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        <span className="text-xs font-serif text-emerald-400 font-bold">Erudito de Ohara</span>
                        <span className="text-[8px] font-mono text-slate-500">(Sintonizador)</span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-300 bg-slate-900/40 p-3 rounded-lg border border-slate-900/60 text-justify">
                        Saludos, investigador cartógrafo. Me he sintonizado con el campo electromagnético de{" "}
                        <strong>
                          {selectedMystery 
                            ? selectedMystery.title 
                            : `las coordenadas [${userSpiritCoords[0].toFixed(2)}, ${userSpiritCoords[1].toFixed(2)}]`}
                        </strong>. 
                        <br /><br />
                        Toda la información censurada por el Gobierno Mundial en esta latitud está lista para ser decodificada. Pregúntame sobre cataclismos, ruinas hundidas, anomalías magnéticas o usa los accesos directos de misterios de abajo.
                      </p>
                    </div>
                  ) : (
                    (aiChats[selectedMystery ? selectedMystery.id : "custom"] || []).map((msg, idx) => (
                      <div key={idx} className="text-left flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${msg.role === 'user' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                          <span className={`text-xs font-serif font-bold ${msg.role === 'user' ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {msg.role === 'user' ? (userProgress?.username || "Investigador") : "Erudito de Ohara"}
                          </span>
                          <span className="text-[8px] font-mono text-slate-500">
                            ({msg.role === 'user' ? 'Tú' : 'IA Terrestre'})
                          </span>
                        </div>
                        <div className={`text-xs leading-relaxed p-3 rounded-lg text-slate-200 text-justify ${
                          msg.role === 'user' 
                            ? 'bg-amber-500/5 border border-amber-500/10' 
                            : 'bg-slate-900/50 border border-slate-900 whitespace-pre-line'
                        }`}>
                          {msg.text}

                          {/* Fallback retry button inside DeepSeek failure message */}
                          {msg.role === 'model' && msg.text.includes("SABOTAJE EN LA RED ORIENTAL") && lastFailedQuery && lastFailedQuery.locId === (selectedMystery ? selectedMystery.id : "custom") && (
                            <div className="mt-3.5 pt-3.5 border-t border-amber-500/20 flex flex-col gap-2">
                              <p className="text-[9px] font-mono text-slate-400">¿Quieres evadir este bloqueo sintonizando automáticamente con Gemini?</p>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedAiProvider("gemini");
                                  handleAskAi(lastFailedQuery.query, "gemini");
                                }}
                                className="w-full py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-mono text-[9px] font-bold rounded flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer uppercase tracking-wider animate-pulse"
                              >
                                <span>📡 EVADIR BLOQUEO CON SATÉLITE DE GEMINI</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}

                  {/* Loading status */}
                  {isAiLoading && (
                    <div className="text-left flex flex-col gap-1.5 animate-pulse">
                      <div className="flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                        <span className="text-xs font-serif text-emerald-400 font-bold">Erudito de Ohara</span>
                        <span className="text-[8px] font-mono text-slate-500">(Descifrando...)</span>
                      </div>
                      <p className="text-xs text-slate-400 bg-slate-900/20 p-3 rounded-lg border border-slate-900/40 italic">
                        {aiLoadingText}
                      </p>
                    </div>
                  )}
                  <div ref={aiChatEndRef} />
                </div>

                {/* Predefined Suggestions Panel */}
                <div className="flex flex-col gap-1.5 text-left">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block pl-1">Sintonizadores rápidos de misterios:</span>
                  <div className="flex flex-col gap-1.5">
                    {getSuggestedQuestions(selectedMystery ? selectedMystery.id : "custom", userSpiritCoords).map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        disabled={isAiLoading}
                        onClick={() => handleAskAi(q)}
                        className="w-full text-left p-2 rounded-md bg-slate-900/60 border border-slate-800 hover:border-amber-500/30 text-[11px] text-slate-300 hover:text-amber-400 transition-all font-sans cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="text-amber-500">✦</span>
                        <span className="truncate">{q}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Input Bar */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAskAi();
                  }}
                  className="flex gap-2 border-t border-slate-900 pt-3 mt-1"
                >
                  <input
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="Pregúntale a la IA: ¿Qué ha pasado aquí?..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-500/50"
                    disabled={isAiLoading}
                  />
                  <button
                    type="submit"
                    disabled={isAiLoading || !aiQuery.trim()}
                    className="px-4 py-1.5 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 disabled:from-slate-800 disabled:to-slate-900 text-slate-950 disabled:text-slate-500 text-xs font-bold rounded flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:shadow-none"
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>Preguntar</span>
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* RECENT ALIGNMENTS / SPIRITS ROAMING FEED */}
          <div className="p-5 border-t border-slate-900 mt-auto bg-slate-950/30">
            <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-yellow-500" />
              <span>Sintonizador de Espíritus Activos</span>
            </h4>
            <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto">
              {spirits.map(sp => (
                <div key={sp.id} className="flex items-center justify-between text-[10px] font-mono bg-slate-950 border border-slate-900 p-2 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">👻</span>
                    <span className="font-serif font-bold" style={{ color: sp.color }}>{sp.name}</span>
                  </div>
                  <span className="text-[8px] text-slate-500 truncate max-w-[180px] italic">"{sp.status}"</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
