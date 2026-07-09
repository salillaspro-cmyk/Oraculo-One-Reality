import { useState, useEffect, useRef, FormEvent } from "react";
import { 
  Compass, HelpCircle, Trophy, X, RotateCcw, ZoomIn, ZoomOut, Eye, 
  Sparkles, Globe, Users, MessageSquare, Send, Layers, Sliders, Anchor, 
  AlertTriangle, ChevronRight, CheckCircle2, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProgress } from "../data/courses";
import OrbisTerrarumMap from "./OrbisTerrarumMap";

export interface OronceLegend {
  id: string;
  title: string;
  coordinates: string;
  region: string;
  myth: string;
  truth: string;
  hemisphere: "norte" | "sur";
  // SVG relative mapping: x & y percentage coordinates for plotting inside the Oronce Fine double-heart frame
  mapX: number; // 0 to 100 on the cartographic canvas
  mapY: number; // 0 to 100 on the cartographic canvas
  level: number;
}

export interface CollaborativeLog {
  id: string;
  locationId: string;
  locationName: string;
  author: string;
  role: "Arqueólogo" | "Navegante" | "Erudito" | "Cartógrafo" | "Disidente";
  text: string;
  timestamp: string;
  verified: boolean;
}

// Simulated active online researchers roaming around the map in 3D
export interface SimulatedResearcher {
  id: string;
  name: string;
  role: string;
  color: string;
  currentLocationId: string;
  targetX: number;
  targetY: number;
  currentX: number;
  currentY: number;
}

const PREDEFINED_LEGENDS: OronceLegend[] = [
  {
    id: "hyperborea",
    title: "Hiperbórea (Rupes Nigra)",
    coordinates: "90° 00' N, 00° 00' E",
    region: "Polo Norte Ártico",
    myth: "La legendaria isla soleada más allá del viento del norte, habitada por gigantes inmortales libres de enfermedades. En su centro exacto se yergue la 'Rupes Nigra', una colosal montaña de magnetita negra de 33 leguas de circunferencia que atrae de forma irreversible todas las agujas imantadas y brújulas del planeta, rodeada por cuatro grandes canales fluviales que drenan los océanos hacia el interior de la Tierra.",
    truth: "Muchos mapas renacentistas y cordiformes (incluyendo los de Mercator y Oronce Fine) representaban el Ártico libre de hielo con un canal hidrográfico simétrico. Geológicamente, la región polar experimenta desviaciones periódicas del norte magnético y contiene anomalías gravitatorias significativas debido a la concentración de masa en el manto. La 'isla polar' sugiere un conocimiento de épocas climáticas cálidas preglaciales.",
    hemisphere: "norte",
    mapX: 25,
    mapY: 28,
    level: 3
  },
  {
    id: "tartaria",
    title: "Imperio de la Gran Tartaria",
    coordinates: "58° 40' N, 105° 15' E",
    region: "Eurasia Septentrional / Siberia",
    myth: "Un majestuoso y olvidado imperio euroasiático borrado intencionadamente de la historia convencional. Se cuenta que poseían tecnología avanzada de energía libre atmosférica de éter, canalizada a través de las cúpulas metálicas y obeliscos de sus colosales catedrales grecorromanas, y que su civilización fue sepultada repentinamente bajo un cataclísmico 'diluvio de barro' mundial.",
    truth: "Hasta finales del siglo XVIII, los atlas de Europa y Asia rotulaban la inmensa zona siberiana como 'Grand Tartary', detallándola con sus propios reyes, dinastías, escudos de armas y ciudades interconectadas. La caída y fragmentación geopolítica de este territorio dio paso al surgimiento del Imperio Ruso controlado por dinastías occidentales, promoviendo una reescritura masiva de la geografía histórica asiática.",
    hemisphere: "norte",
    mapX: 38,
    mapY: 34,
    level: 2
  },
  {
    id: "doggerland",
    title: "Doggerland & Avalon",
    coordinates: "55° 10' N, 04° 25' E",
    region: "Mar del Norte / Islas Británicas",
    myth: "La mística isla de Avalon, envuelta perpetuamente por brumas mágicas, donde reposaba la Hermandad de la Diosa Madre, se forjó la espada Excalibur y fue llevado el cuerpo moribundo del Rey Arturo. Un santuario sagrado fuera del tiempo ordinario inaccesible para los profanos.",
    truth: "Doggerland fue un vasto territorio mesolítico, extremadamente fértil y densamente poblado, que conectaba de forma terrestre la actual Gran Bretaña con Europa central. Alrededor del año 6200 a.C., el colapso masivo del glaciar Storegga en Noruega provocó un megatsunami devastador que, sumado al rápido ascenso del nivel del mar, sumergió toda la planicie. Esta dramática inundación se grabó en la memoria colectiva europea como reinos hundidos en la niebla.",
    hemisphere: "norte",
    mapX: 21,
    mapY: 42,
    level: 1
  },
  {
    id: "atlantida",
    title: "Atlántida (Plataforma Mesoatlántica)",
    coordinates: "32° 15' N, 35° 40' W",
    region: "Océano Atlántico Central",
    myth: "El imperio marítimo más colosal descrito por Platón, dispuesto en anillos concéntricos alternos de agua y tierra, gobernado por reyes descendientes de Poseidón. Estaba revestido de oricalco, poseía barcos de propulsión prodigiosa y un poder militar que conquistó el Mediterráneo antes de hundirse bajo las olas en un solo día y una noche de cataclismo.",
    truth: "La dorsal mesoatlántica posee mesetas marinas y microcontinentes sumergidos como la Dorsal de las Azores. Al término de la última glaciación, se produjeron vaciados masivos de lagos glaciares norteamericanos (episodio de descarga de Meltwater Pulse 1A) que causaron un ascenso súbito de los océanos de más de 100 metros en la escala temporal exacta narrada por Platón (9600 a.C.), provocando el colapso y hundimiento de archipiélagos intermedios.",
    hemisphere: "norte",
    mapX: 12,
    mapY: 52,
    level: 4
  },
  {
    id: "shambhala",
    title: "Shambhala & Red de Agartha",
    coordinates: "31° 12' N, 88° 30' E",
    region: "Meseta del Tíbet / Cordillera del Himalaya",
    myth: "El místico reino secreto donde reside el Rey del Mundo, oculto en los valles inexplorados del Tíbet. Su capital, Shambhala, es un faro espiritual de pura luz y conocimiento divino que guía a la humanidad en las sombras. Este reino se conecta con una red planetaria de túneles y cavernas conocida como la Red de Agartha.",
    truth: "Estudios sismológicos recientes de alta resolución bajo la colosal placa tectónica del Himalaya y el Tíbet han revelado una inmensa fractura geológica con cuevas de presión de proporciones nunca antes vistas, así como 'acuíferos fantasmas' gigantescos a kilómetros de profundidad. Las ondas de sonido geofísicas detectadas en el Tíbet sugieren vibraciones de resonancia que alimentaron las leyendas de cámaras subterráneas infinitas.",
    hemisphere: "norte",
    mapX: 35,
    mapY: 56,
    level: 5
  },
  {
    id: "terra_australis",
    title: "Terra Australis Recens (Antártida Sin Hielo)",
    coordinates: "75° 20' S, 45° 10' W",
    region: "Polo Sur / Hemisferio Austral",
    myth: "El colosal continente austral postulado por astrónomos antiguos bajo el principio de simetría física de la Esfera Terrestre. Considerado por los geógrafos de los siglos XV y XVI como una tierra templada rebosante de fauna exótica, oro, árboles gigantescos y custodiada por temibles imperios de gigantes antárticos.",
    truth: "En su mapamundi de 1531, Oronce Fine dibujó la costa antártica con asombrosa precisión cartográfica mucho antes de su descubrimiento oficial en 1820. El contorno representado muestra bahías libres de hielo, ríos y montañas interiores que coinciden al milímetro con el mapa de relieve topográfico subglacial (roca madre) de la Antártida obtenido por radar de satélites modernos, confirmando que se basó en fuentes que registraron el polo antes de la glaciación.",
    hemisphere: "sur",
    mapX: 74,
    mapY: 65,
    level: 5
  },
  {
    id: "el_dorado",
    title: "El Dorado (Lago Parime y Manoa)",
    coordinates: "03° 10' S, 60° 15' W",
    region: "Cuenca del Amazonas / Guayana",
    myth: "La mítica metrópolis dorada de Manoa a orillas del inmenso lago Parime, donde el oro era tan abundante que los nativos lo trataban como barro común. Su monarca, el Hombre Dorado, se cubría diariamente el cuerpo con resinas aromáticas y polvo de oro molido fino, sumergiéndose en las aguas rituales del lago.",
    truth: "Imágenes de satélite y tecnología LiDAR han descubierto colosales complejos urbanos precolombinos interconectados por calzadas de cientos de kilómetros enterrados bajo la selva del Amazonas. Asimismo, la presencia de la fértil 'Terra Preta do Indio' (tierra negra rica cultivada artificialmente por milenios) prueba que el Amazonas albergó una civilización agraria e industrial inmensa capaz de alimentar a decenas de millones de personas.",
    hemisphere: "sur",
    mapX: 62,
    mapY: 48,
    level: 3
  },
  {
    id: "regio_patalis",
    title: "Regio Patalis",
    coordinates: "22° 15' S, 120° 30' E",
    region: "Norte de Australia / Océano Índico Oriental",
    myth: "La indómita y peligrosa península de las tinieblas de la que hablaban los antiguos navegantes persas y portugueses. Considerada una tierra desértica plagada de serpientes voladoras gigantes, abismos magnéticos marinos que devoraban barcos enteros y el misterioso portal al 'Fin de las Aguas'.",
    truth: "Regio Patalis figura en mapas cordiformes de la escuela cartográfica francesa de Dieppe en el siglo XVI. Es el reflejo silenciado de las primeras exploraciones portuguesas de las costas del norte de Australia y la actual Indonesia. El Gobierno portugués mantuvo en absoluto secreto de Estado estas coordenadas marítimas para conservar el monopolio comercial de las islas de las especias, disfrazando la ruta bajo mitos terroríficos.",
    hemisphere: "sur",
    mapX: 86,
    mapY: 52,
    level: 2
  },
  {
    id: "lemuria",
    title: "Lemuria / Mu (Océano Pacífico Sur)",
    coordinates: "15° 30' S, 150° 20' W",
    region: "Polinesia / Océano Pacífico Central",
    myth: "El gigantesco continente hundido del Pacífico que albergó la mítica cultura de Mu. Sus habitantes dominaban una avanzada ciencia holística basada en la vibración acústica de cuarzo y el magnetismo terrestre. Se dice que el continente se sumergió pacíficamente por terremotos volcánicos en serie, quedando solo las cimas de las montañas como las actuales islas de la Polinesia.",
    truth: "En 2017, geólogos confirmaron oficialmente la existencia de 'Zealandia', un continente sumergido casi en su totalidad (94%) de unos 5 millones de kilómetros cuadrados en el Pacífico Sur. La dispersión homogénea del ADN polinesio y sus colosales estelas megalíticas idénticas en islas aisladas separadas por miles de millas náuticas confirman la existencia de conexiones continentales terrestres previas al cataclismo del deshielo global.",
    hemisphere: "sur",
    mapX: 52,
    mapY: 50,
    level: 4
  }
];

const INITIAL_SIMULATED_LOGS: CollaborativeLog[] = [
  {
    id: "log_1",
    locationId: "hyperborea",
    locationName: "Hiperbórea (Rupes Nigra)",
    author: "Nico Robin",
    role: "Arqueólogo",
    text: "El patrón de los ríos que fluyen de forma simétrica desde el polo se repite de manera exacta en la descripción de las corrientes circundantes de Laugh Tale. ¿Acaso el Siglo Vacío poseía un eje polar alterno?",
    timestamp: "Hace 5 min",
    verified: true
  },
  {
    id: "log_2",
    locationId: "terra_australis",
    locationName: "Terra Australis Recens",
    author: "Profesor Clover",
    role: "Erudito",
    text: "He comparado el trazo de Oronce Fine de 1531 con los mapas ocultos de la Biblioteca de Ohara. La concordancia es del 98.7%. Los cartógrafos antiguos de Wano tuvieron acceso a este atlas.",
    timestamp: "Hace 12 min",
    verified: true
  },
  {
    id: "log_3",
    locationId: "tartaria",
    locationName: "Imperio de la Gran Tartaria",
    author: "Disidente_300",
    role: "Disidente",
    text: "La supresión sistemática de Tartaria en los textos del siglo XIX es idéntica a cómo el Gobierno Mundial borró el nombre del Reino Antiguo. Es el mismo modus operandi de censura global.",
    timestamp: "Hace 24 min",
    verified: false
  },
  {
    id: "log_4",
    locationId: "atlantida",
    locationName: "Atlántida",
    author: "Navegante_Nami",
    role: "Navegante",
    text: "Las lecturas de presión submarina en la fosa atlántica indican anomalías magnéticas circulares idénticas a los canales que describía Platón. Hay algo inmenso abajo.",
    timestamp: "Hace 40 min",
    verified: true
  },
  {
    id: "log_5",
    locationId: "el_dorado",
    locationName: "El Dorado",
    author: "Cartógrafo_Koby",
    role: "Cartógrafo",
    text: "La 'Terra Preta' no es un fenómeno natural. Contiene biochar y fósforo dosificados artificialmente que tardan milenios en degradarse. El Amazonas entero es un jardín botánico precolombino planificado.",
    timestamp: "Hace 1 hora",
    verified: true
  }
];

const RESEARCH_ROLES = ["Arqueólogo", "Navegante", "Erudito", "Cartógrafo", "Disidente"] as const;

interface OronceFineMapProps {
  userProgress: UserProgress | null;
  onClose: () => void;
  onSaveProgress?: (updated: UserProgress) => void;
}

export default function OronceFineMap({ userProgress, onClose, onSaveProgress }: OronceFineMapProps) {
  // 3D Table Transformation State
  const [rotateX, setRotateX] = useState<number>(-12);
  const [rotateY, setRotateY] = useState<number>(5);
  const [zoom, setZoom] = useState<number>(1.0);
  const [isRotatingAutomatically, setIsRotatingAutomatically] = useState<boolean>(true);
  
  // Orbis Terrarum Interactive Fullscreen Map State
  const [showOrbisTerrarum, setShowOrbisTerrarum] = useState<boolean>(false);
  
  // Selection State
  const [selectedLegend, setSelectedLegend] = useState<OronceLegend | null>(PREDEFINED_LEGENDS[0]);
  
  // Tab / Filter State
  const [activeHemisphere, setActiveHemisphere] = useState<"todos" | "norte" | "sur">("todos");

  // AI Archeological Companion State
  const [activeRightTab, setActiveRightTab] = useState<"arqueologia" | "ia">("arqueologia");
  const [aiChats, setAiChats] = useState<Record<string, { role: "user" | "model"; text: string }[]>>({});
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiQuery, setAiQuery] = useState<string>("");
  const [aiLoadingText, setAiLoadingText] = useState<string>("Sintonizando éter...");
  const [selectedAiProvider, setSelectedAiProvider] = useState<"gemini" | "deepseek">("gemini");
  const [lastFailedQuery, setLastFailedQuery] = useState<{ query: string; locId: string } | null>(null);
  const aiChatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll effect for AI Chat
  useEffect(() => {
    if (aiChatEndRef.current) {
      aiChatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [aiChats, activeRightTab, selectedLegend]);
  
  // Collaboration Logs State
  const [collaborativeLogs, setCollaborativeLogs] = useState<CollaborativeLog[]>(() => {
    const stored = localStorage.getItem("oronce_fine_logs");
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { return INITIAL_SIMULATED_LOGS; }
    }
    return INITIAL_SIMULATED_LOGS;
  });

  // Simulated active researchers state
  const [researchers, setResearchers] = useState<SimulatedResearcher[]>([]);

  // Form State
  const [newLogText, setNewLogText] = useState("");
  const [authorName, setAuthorName] = useState(() => {
    return userProgress?.username || "Erudito_Anónimo";
  });
  const [authorRole, setAuthorRole] = useState<typeof RESEARCH_ROLES[number]>("Arqueólogo");

  // Auto-rotation effect
  useEffect(() => {
    if (!isRotatingAutomatically) return;
    const interval = setInterval(() => {
      setRotateY(prev => {
        const next = prev + 0.15;
        return next > 360 ? next - 360 : next;
      });
    }, 45);
    return () => clearInterval(interval);
  }, [isRotatingAutomatically]);

  // Generate simulated researchers initially and move them
  useEffect(() => {
    const initialResearchers: SimulatedResearcher[] = [
      { id: "res_1", name: "Nico_Robin_Ohara", role: "Arqueóloga", color: "#a855f7", currentLocationId: "hyperborea", targetX: 25, targetY: 28, currentX: 25, currentY: 28 },
      { id: "res_2", name: "Prof_Charles_M", role: "Erudito", color: "#3b82f6", currentLocationId: "terra_australis", targetX: 74, targetY: 65, currentX: 74, currentY: 65 },
      { id: "res_3", name: "Navegante_Atlas", role: "Cartógrafo", color: "#eab308", currentLocationId: "atlantida", targetX: 12, targetY: 52, currentX: 12, currentY: 52 },
      { id: "res_4", name: "Nami_Gata_Clima", role: "Navegante", color: "#f97316", currentLocationId: "lemuria", targetX: 52, targetY: 50, currentX: 52, currentY: 50 }
    ];
    setResearchers(initialResearchers);

    const interval = setInterval(() => {
      setResearchers(prev => prev.map(res => {
        // 10% chance to pick a new destination
        let nextTargetX = res.targetX;
        let nextTargetY = res.targetY;
        let nextLocId = res.currentLocationId;

        if (Math.random() < 0.1) {
          const randLegend = PREDEFINED_LEGENDS[Math.floor(Math.random() * PREDEFINED_LEGENDS.length)];
          nextTargetX = randLegend.mapX;
          nextTargetY = randLegend.mapY;
          nextLocId = randLegend.id;
        }

        // Interpolate position towards target slowly for smooth real-time wandering effect
        const dx = nextTargetX - res.currentX;
        const dy = nextTargetY - res.currentY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let newX = res.currentX;
        let newY = res.currentY;

        if (distance > 1) {
          newX += (dx / distance) * 0.8;
          newY += (dy / distance) * 0.8;
        } else {
          newX = nextTargetX;
          newY = nextTargetY;
        }

        return {
          ...res,
          targetX: nextTargetX,
          targetY: nextTargetY,
          currentLocationId: nextLocId,
          currentX: newX,
          currentY: newY
        };
      }));
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // Periodic researcher log simulator to give real "colaborativo" vibe
  useEffect(() => {
    const simulatorInterval = setInterval(() => {
      // 25% chance of spawning a live simulated discovery log from researchers
      if (Math.random() > 0.25) return;

      const randomLegend = PREDEFINED_LEGENDS[Math.floor(Math.random() * PREDEFINED_LEGENDS.length)];
      const names = ["Dr_Vegapunk", "Huston_C", "Sabo_Rebel", "Professor_Clover", "Archaeology_Vibe", "Nico_Robin", "Koby_SWORD", "Tashigi_Sword"];
      const roles = RESEARCH_ROLES;
      const textTemplates = [
        `He contrastado el relieve topográfico de ${randomLegend.title} con las anomalías gravimétricas continentales. Los datos confirman estructuras simétricas pre-glaciación.`,
        `¡Alerta de fluctuación electromagnética en la región de ${randomLegend.title}! El magnetómetro de la brújula se desvía en un factor de 3.2.`,
        `Hemos localizado manuscritos del siglo XV que validan la existencia de rutas comerciales directas hacia ${randomLegend.title} antes de que los mapas oficiales borraran el archipiélago.`,
        `Interesante correlación: la ubicación de ${randomLegend.title} se alinea armónicamente con la red de corrientes de agua templada que fluyen bajo los casquetes.`,
        `Los registros del Siglo Vacío hacen referencia a un 'Santuario de Oro y Piedra' en este cuadrante exacto de ${randomLegend.title}. Las coordenadas coinciden.`,
        `¿Será posible que la tecnología electromagnética inalámbrica descrita aquí sea el origen de los tambores de la liberación de Nika?`,
      ];

      const simulatedAuthor = names[Math.floor(Math.random() * names.length)];
      const simulatedRole = roles[Math.floor(Math.random() * roles.length)];
      const simulatedText = textTemplates[Math.floor(Math.random() * textTemplates.length)];

      const newSimLog: CollaborativeLog = {
        id: "sim_log_" + Date.now(),
        locationId: randomLegend.id,
        locationName: randomLegend.title,
        author: simulatedAuthor,
        role: simulatedRole,
        text: simulatedText,
        timestamp: "Ahora mismo",
        verified: Math.random() > 0.3 // Some are verified
      };

      setCollaborativeLogs(prev => {
        const updated = [newSimLog, ...prev.slice(0, 19)]; // Limit to last 20 logs
        localStorage.setItem("oronce_fine_logs", JSON.stringify(updated));
        return updated;
      });
    }, 18000); // Trigger check every 18 seconds

    return () => clearInterval(simulatorInterval);
  }, []);

  // Dynamic custom questions per location
  const getSuggestedQuestions = (id: string): string[] => {
    switch (id) {
      case "hyperborea":
        return [
          "¿Cómo se conecta la montaña Rupes Nigra con el magnetismo del Reino Antiguo?",
          "¿Hay indicios de que el Gobierno Mundial inundó deliberadamente este polo cálido?",
          "¿Qué secretos del Siglo Vacío ocultan los cuatro canales simétricos?"
        ];
      case "tartaria":
        return [
          "¿Es la energía libre de Tartaria la misma que Vegapunk intentó recrear?",
          "¿Fue el 'diluvio de barro' un cataclismo provocado por un Arma Ancestral?",
          "¿Qué registros de Mary Geoise mencionan la anexión siberiana?"
        ];
      case "doggerland":
        return [
          "¿Se hundió Doggerland por el aumento del nivel del mar tras la gran guerra antigua?",
          "¿Es la mística Avalon una isla del éter similar a Skypiea?",
          "¿Qué tecnologías neolíticas se perdieron en este cataclismo?"
        ];
      case "atlantida":
        return [
          "¿Representa la Atlántida los anillos concéntricos del Reino Antiguo?",
          "¿Fue el aumento de 100 metros en el nivel del mar provocado por el arma Urano?",
          "¿Qué aleaciones de oricalco equivalen al mineral indestructible de los Poneglyphs?"
        ];
      case "shambhala":
        return [
          "¿Se conecta la red intraterrestre de Agartha con las cavernas del Árbol de Ohara?",
          "¿Oculta Shambhala una de las Armas Ancestrales en su centro geomagnético?",
          "¿Qué secretos del espacio exterior resuena con el Monte Kailash?"
        ];
      case "lemuria":
        return [
          "¿Cómo se relaciona la inundación de Lemuria y Mu con el continente hundido de One Piece?",
          "¿Eran los lemurianos gigantes psíquicos emparentados con la dinastía D.?",
          "¿Hay inscripciones grabadas bajo las ruinas submarinas de Yonaguni?"
        ];
      case "terra_australis":
        return [
          "¿Oculta la Antártida la frontera física o el muro de hielo que rodea el Grand Line?",
          "¿Se guardan allí los gigantes congelados de la era del Siglo Vacío?",
          "¿Qué anomalías gravitacionales impiden a los satélites cartografiar el polo sur?"
        ];
      default:
        return [
          "¿Cuál es el secreto arqueológico oculto en estas coordenadas?",
          "¿Cómo censuró el Gobierno Mundial la historia de esta región?",
          "¿Qué vínculos energéticos de éter tiene este lugar con el resto del mapa?"
        ];
    }
  };

  // Ask Gemini AI companion about the location
  const handleAskAi = async (customQuery?: string, overrideProvider?: "gemini" | "deepseek") => {
    const queryToSend = customQuery || aiQuery;
    if (!queryToSend.trim() || !selectedLegend) return;

    const providerToUse = overrideProvider || selectedAiProvider;
    const locId = selectedLegend.id;
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
      "Analizando las coordenadas de Oronce Fine..."
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
          locationName: selectedLegend.title,
          coordinates: selectedLegend.coordinates,
          myth: selectedLegend.myth,
          truth: selectedLegend.truth,
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
Nombre: ${selectedLegend.title}
Coordenadas exactas: ${selectedLegend.coordinates}
Mito/Lore local: ${selectedLegend.myth}
Realidad arqueológica oculta: ${selectedLegend.truth}

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
            contents = `Investigador: [Lugar: ${selectedLegend.title} (${selectedLegend.coordinates})] ${queryToSend}`;
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
              text: `⚠️ ¡SABOTAJE EN LA RED ORIENTAL (DEEPSEEK)! \n\nEl Cipher Pol (CP9) ha bloqueado los canales electromagnéticos de la frecuencia oriental o falta la clave API de DeepSeek.\n\nFrecuencia afectada: ${selectedLegend.coordinates}\nError detectado: ${errorMsg}\n\nSugerencia del sintonizador: ¿Deseas evadir la censura utilizando el satélite cifrado de la resistencia de Ohara (Gemini)?` 
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

  // Handle Log Submission
  const handleSubmitLog = (e: FormEvent) => {
    e.preventDefault();
    if (!newLogText.trim() || !selectedLegend) return;

    const userLog: CollaborativeLog = {
      id: "user_log_" + Date.now(),
      locationId: selectedLegend.id,
      locationName: selectedLegend.title,
      author: authorName.trim() || "Investigador",
      role: authorRole,
      text: newLogText.trim(),
      timestamp: "Ahora mismo",
      verified: true
    };

    const updated = [userLog, ...collaborativeLogs];
    setCollaborativeLogs(updated);
    localStorage.setItem("oronce_fine_logs", JSON.stringify(updated));
    setNewLogText("");

    // Reward user progress if active and save achievements
    if (userProgress && onSaveProgress) {
      // Add custom action/finding
      const currentPoints = userProgress.restorationPoints || 0;
      
      // Let's award 15 Restoration Points for collaborative contribution
      const updatedProgress: UserProgress = {
        ...userProgress,
        restorationPoints: currentPoints + 15,
      };
      onSaveProgress(updatedProgress);
    }
  };

  const filteredLegends = PREDEFINED_LEGENDS.filter(legend => {
    if (activeHemisphere === "todos") return true;
    return legend.hemisphere === activeHemisphere;
  });

  // Calculate coordinates in SVG coordinate system (width: 800, height: 400)
  const getCoordinatesOnSVG = (legend: OronceLegend) => {
    // Canvas dimensions: width=800, height=400
    // We can distribute left hemisphere (North) on left side, right hemisphere (South) on right side
    const width = 800;
    const height = 400;

    let x = 0;
    let y = 0;

    // Use predefined percentages mapped elegantly onto our custom coordinates
    x = (legend.mapX / 100) * width;
    y = (legend.mapY / 100) * height;

    return { x, y };
  };

  return (
    <div id="oronce_3d_panel" className="relative flex flex-col h-full text-slate-200 overflow-hidden font-sans select-none bg-radial from-slate-900 via-slate-950 to-black border-2 border-amber-500/20 rounded-xl shadow-2xl">
      {/* Background Cartography Accents */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      {/* HEADER SECTION */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-amber-500/10 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-950 to-amber-900 border border-amber-500/30 rounded-lg text-amber-400 shadow-md">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono tracking-widest text-amber-500 uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">CARTA DE 1531</span>
              <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Sincronización Cooperativa
              </span>
            </div>
            <h1 className="text-sm font-bold text-slate-100 tracking-tight font-serif flex items-center gap-1.5 mt-0.5">
              <span>Mesa Cartográfica 3D: Oronce Fine</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Legend Toggle Controls */}
          <div className="flex rounded-md p-0.5 bg-slate-900 border border-slate-800 text-[10px] font-semibold text-slate-400">
            <button
              onClick={() => setActiveHemisphere("todos")}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer ${activeHemisphere === "todos" ? "bg-amber-600 text-slate-50 font-bold" : "hover:text-slate-200"}`}
            >
              Globo Completo
            </button>
            <button
              onClick={() => setActiveHemisphere("norte")}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer ${activeHemisphere === "norte" ? "bg-amber-600 text-slate-50 font-bold" : "hover:text-slate-200"}`}
            >
              H. Norte (Septentrio)
            </button>
            <button
              onClick={() => setActiveHemisphere("sur")}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer ${activeHemisphere === "sur" ? "bg-amber-600 text-slate-50 font-bold" : "hover:text-slate-200"}`}
            >
              H. Sur (Austrinus)
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-md border border-slate-800 transition-all cursor-pointer"
            title="Cerrar Mesa de Trabajo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* WORKSPACE AREA */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        
        {/* LEFT COLUMN: 3D CARTOGRAPHY TABLE */}
        <div className="flex-1 flex flex-col justify-between p-6 relative overflow-hidden bg-gradient-to-b from-slate-950 to-[#020617] border-r border-slate-900">
          
          {/* Simulated Active Collaborators Counter */}
          <div className="absolute top-4 left-6 z-10 flex items-center gap-2 bg-slate-900/80 border border-slate-800/60 rounded-full px-3 py-1 text-[10px] font-mono text-slate-300 backdrop-blur">
            <Users className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>Eruditos en línea: <strong className="text-emerald-400">{researchers.length + 1}</strong></span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          </div>

          {/* Perspective/Transform Settings Controller in Map */}
          <div className="absolute top-4 right-6 z-10 flex items-center gap-3 bg-slate-900/80 border border-slate-800/60 rounded-lg p-2 text-[10px] font-mono text-slate-300 backdrop-blur">
            <div className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-500" />
              <span>Giro 3D:</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setRotateX(-12);
                  setRotateY(5);
                  setZoom(1.0);
                }}
                className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-amber-400 hover:text-amber-300 cursor-pointer"
                title="Restablecer perspectivas 3D"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
              <button
                onClick={() => setIsRotatingAutomatically(!isRotatingAutomatically)}
                className={`px-1.5 py-0.5 rounded cursor-pointer transition-all flex items-center gap-1 ${isRotatingAutomatically ? 'bg-amber-600 text-slate-50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                title={isRotatingAutomatically ? "Pausar rotación autónoma" : "Activar rotación autónoma"}
              >
                <RefreshCw className={`w-2.5 h-2.5 ${isRotatingAutomatically ? 'animate-spin' : ''}`} />
                <span>{isRotatingAutomatically ? "Auto" : "Manual"}</span>
              </button>
            </div>
          </div>

          {/* THE 3D CANVAS PLATFORM */}
          <div 
            className="flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing perspective-1000 mt-6"
            onMouseDown={(e) => {
              // Handle manual dragging to rotate
              if (isRotatingAutomatically) return;
              const startX = e.clientX;
              const startY = e.clientY;
              const initialRX = rotateX;
              const initialRY = rotateY;
              
              const handleMouseMove = (moveEvent: MouseEvent) => {
                const dx = moveEvent.clientX - startX;
                const dy = moveEvent.clientY - startY;
                setRotateY(initialRY + dx * 0.4);
                setRotateX(Math.max(-45, Math.min(45, initialRX - dy * 0.4)));
              };
              
              const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove as any);
                document.removeEventListener("mouseup", handleMouseUp);
              };
              
              document.addEventListener("mousemove", handleMouseMove as any);
              document.addEventListener("mouseup", handleMouseUp);
            }}
          >
            {/* The 3D Rotating Map Plate */}
            <div
              className="relative transition-transform duration-300 ease-out preserve-3d"
              style={{
                transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${zoom})`,
                transformStyle: "preserve-3d"
              }}
            >
              {/* Outer Cartography Desk Tray Shadow */}
              <div className="absolute -inset-6 bg-amber-950/20 border-2 border-amber-900/30 rounded-2xl blur-xl -z-10 transform translate-z-[-30px]"></div>

              {/* The Parchment/Slate Board Plate */}
              <div className="relative w-[800px] h-[400px] bg-gradient-to-br from-slate-950 via-[#0b0f19] to-slate-950 border-4 border-amber-500/40 rounded-xl p-4 overflow-hidden shadow-2xl preserve-3d">
                
                {/* Vintage Card Grid Patterns and Latitudes */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.18]" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="map-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#d97706" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#000" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#map-glow)" />

                  {/* Lat/Long Rings representing Double Cordiform frame */}
                  {/* Left Heart (North) Grid lines */}
                  <path d="M 200,200 C 200,50 50,50 50,200 C 50,320 200,390 200,390 C 200,390 350,320 350,200 C 350,50 200,50 200,200 Z" fill="none" stroke="#d97706" strokeWidth="0.75" strokeDasharray="3,3" />
                  <path d="M 200,200 C 200,100 100,100 100,200 C 100,270 200,310 200,310 C 200,310 300,270 300,200 C 300,100 200,100 200,200 Z" fill="none" stroke="#d97706" strokeWidth="0.5" strokeDasharray="2,2" />
                  
                  {/* Right Heart (South) Grid lines */}
                  <path d="M 600,200 C 600,50 450,50 450,200 C 450,320 600,390 600,390 C 600,390 750,320 750,200 C 750,50 600,50 600,200 Z" fill="none" stroke="#d97706" strokeWidth="0.75" strokeDasharray="3,3" />
                  <path d="M 600,200 C 600,100 500,100 500,200 C 500,270 600,310 600,310 C 600,310 700,270 700,200 C 700,100 600,100 600,200 Z" fill="none" stroke="#d97706" strokeWidth="0.5" strokeDasharray="2,2" />

                  {/* Nautical Rhumb Lines radiating from decorative Compass Roses */}
                  <g stroke="#3b82f6" strokeWidth="0.5" opacity="0.4">
                    <circle cx="200" cy="200" r="1.5" fill="#f59e0b" />
                    <line x1="200" y1="200" x2="40" y2="40" strokeDasharray="4,4" />
                    <line x1="200" y1="200" x2="360" y2="40" strokeDasharray="4,4" />
                    <line x1="200" y1="200" x2="100" y2="350" />
                    <line x1="200" y1="200" x2="300" y2="350" />

                    <circle cx="600" cy="200" r="1.5" fill="#f59e0b" />
                    <line x1="600" y1="200" x2="440" y2="40" strokeDasharray="4,4" />
                    <line x1="600" y1="200" x2="760" y2="40" strokeDasharray="4,4" />
                    <line x1="600" y1="200" x2="500" y2="350" />
                    <line x1="600" y1="200" x2="700" y2="350" />
                  </g>

                  {/* Compass roses text */}
                  <text x="200" y="190" fill="#f59e0b" fontSize="8" fontFamily="serif" textAnchor="middle">SEPTENTRIO</text>
                  <text x="600" y="190" fill="#f59e0b" fontSize="8" fontFamily="serif" textAnchor="middle">MERIDIES</text>
                </svg>

                {/* THE 1531 DOUBLE-HEART MAP GRAPHIC */}
                <div className="absolute inset-0 flex items-center justify-between px-10 pointer-events-none">
                  
                  {/* LEFT HEART: HEMISFERIO NORTE (Eurasia, North America, North Africa) */}
                  <div className="relative w-[320px] h-[320px] flex items-center justify-center">
                    {/* Double-heart border overlay */}
                    <div className="absolute inset-0 border-2 border-dashed border-amber-600/30 rounded-full scale-[0.9] opacity-75"></div>
                    <div className="absolute text-[8px] font-mono text-amber-500/60 top-1 left-2">LONGITVDO REGIONVM</div>
                    
                    {/* Stylized contour drawings inside the heart */}
                    <div className="absolute w-[220px] h-[220px] opacity-[0.25] text-amber-500/40 pointer-events-none select-none text-center flex flex-col justify-center">
                      <Globe className="w-16 h-16 mx-auto stroke-[0.75] animate-spin-slow text-amber-400/50 mb-2" />
                      <span className="font-serif italic text-xs">REGIO BOREALIS</span>
                      <span className="text-[9px] mt-1">Scythia, Tartaria, Hyperborea, Gallia, Hispania</span>
                    </div>

                    {/* Wind cherub blowing air decoration */}
                    <div className="absolute top-1 right-2 w-10 h-10 flex flex-col items-center justify-center opacity-40">
                      <span className="text-[14px]">🌬️</span>
                      <span className="text-[7px] font-mono text-slate-400">BOREAS</span>
                    </div>
                  </div>

                  {/* RIGHT HEART: HEMISFERIO SUR (South America, Southern Africa, Terra Australis) */}
                  <div className="relative w-[320px] h-[320px] flex items-center justify-center">
                    {/* Double-heart border overlay */}
                    <div className="absolute inset-0 border-2 border-dashed border-amber-600/30 rounded-full scale-[0.9] opacity-75"></div>
                    <div className="absolute text-[8px] font-mono text-amber-500/60 top-1 right-2">TERRA AVSTRALIS COGNITA</div>

                    {/* Stylized contour drawings inside the heart */}
                    <div className="absolute w-[220px] h-[220px] opacity-[0.25] text-amber-500/40 pointer-events-none select-none text-center flex flex-col justify-center">
                      <Anchor className="w-16 h-16 mx-auto stroke-[0.75] text-amber-400/50 mb-2" />
                      <span className="font-serif italic text-xs">TERRA AVSTRALIS</span>
                      <span className="text-[9px] mt-1">Patagonia, Regio Patalis, Lemuria, Atlantis</span>
                    </div>

                    {/* Sea monster icon drawing */}
                    <div className="absolute bottom-1 left-2 w-10 h-10 flex flex-col items-center justify-center opacity-40 animate-pulse">
                      <span className="text-[16px]">🐉</span>
                      <span className="text-[6px] font-mono text-slate-400">LEVIATHAN</span>
                    </div>
                  </div>
                </div>

                {/* THE MAP PINS / INTERACTIVE HOTSPOTS (Absolutely positioned over coordinates) */}
                {PREDEFINED_LEGENDS.map((legend) => {
                  const coords = getCoordinatesOnSVG(legend);
                  const isSelected = selectedLegend?.id === legend.id;
                  const isFilteredOut = activeHemisphere !== "todos" && legend.hemisphere !== activeHemisphere;

                  if (isFilteredOut) return null;

                  return (
                    <button
                      key={legend.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLegend(legend);
                      }}
                      className="absolute group z-20 cursor-pointer transform translate-x-[-50%] translate-y-[-50%] preserve-3d"
                      style={{
                        left: `${coords.x}px`,
                        top: `${coords.y}px`,
                        transform: "translate(-50%, -50%) translateZ(15px)"
                      }}
                    >
                      {/* Interactive Pulse Halo */}
                      <span className={`absolute -inset-3 rounded-full blur-sm transition-colors ${
                        isSelected 
                          ? "bg-amber-400/40 animate-ping duration-1000" 
                          : "bg-sky-400/10 group-hover:bg-sky-400/30"
                      }`}></span>

                      {/* Concentric rings */}
                      <span className={`block w-4 h-4 rounded-full border-2 shadow-lg transition-all ${
                        isSelected
                          ? "bg-amber-400 border-amber-200 scale-125 shadow-amber-500/60"
                          : "bg-slate-900 border-amber-500/70 group-hover:bg-amber-600 group-hover:border-amber-300"
                      }`}>
                        <span className={`block w-1.5 h-1.5 mx-auto mt-0.5 rounded-full ${isSelected ? "bg-slate-950 animate-pulse" : "bg-amber-400"}`}></span>
                      </span>

                      {/* Tooltip on Hover */}
                      <span className="absolute left-1/2 -translate-x-1/2 bottom-5 hidden group-hover:flex bg-slate-950 border border-amber-500/40 px-2 py-1 rounded text-[9px] font-mono font-bold text-slate-200 whitespace-nowrap z-30 shadow-md">
                        {legend.title}
                      </span>
                    </button>
                  );
                })}

                {/* LIVE RESEARCHERS' SIMULATED AVATARS */}
                {researchers.map((res) => {
                  // Mapped to map coordinate
                  const x = (res.currentX / 100) * 800;
                  const y = (res.currentY / 100) * 400;

                  return (
                    <div
                      key={res.id}
                      className="absolute pointer-events-none transition-all duration-300 ease-out z-30 transform translate-x-[-50%] translate-y-[-50%]"
                      style={{
                        left: `${x}px`,
                        top: `${y}px`,
                        transform: "translate(-50%, -50%) translateZ(25px)"
                      }}
                    >
                      {/* Cursor Glow */}
                      <span 
                        className="absolute w-2 h-2 rounded-full animate-ping opacity-60"
                        style={{ backgroundColor: res.color }}
                      ></span>
                      <span 
                        className="block w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: res.color }}
                      ></span>

                      {/* Small Active User Tag */}
                      <div 
                        className="absolute left-2 top-1 flex items-center gap-1 border border-slate-800/40 bg-slate-950/90 text-[7px] font-mono rounded px-1 py-0.2 text-slate-300 whitespace-nowrap shadow-sm font-bold"
                        style={{ borderLeft: `2px solid ${res.color}` }}
                      >
                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>{res.name}</span>
                      </div>
                    </div>
                  );
                })}

                {/* 3D FLOATING ENTRAR BUTTON inside the 3D table */}
                <div 
                  className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40 pointer-events-auto"
                  style={{ transform: "translateX(-50%) translateZ(40px)" }}
                >
                  <button
                    onClick={() => setShowOrbisTerrarum(true)}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-serif font-bold text-xs tracking-wider border-2 border-yellow-200/60 shadow-[0_0_15px_rgba(234,179,8,0.6)] hover:shadow-[0_0_25px_rgba(234,179,8,0.9)] transition-all cursor-pointer flex items-center gap-2 animate-pulse"
                    title="Ingresar al Orbis Terrarum (Mapa Terrestre Global)"
                  >
                    <Globe className="w-3.5 h-3.5 animate-spin-slow text-slate-950" />
                    <span>✦ ENTRAR AL ORBIS TERRARUM (MAPA GIGANTE) ✦</span>
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* LOWER SECTION OF CANVAS PANEL: TILT CONTROLLER & TIPS */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4 bg-slate-950/50 border border-slate-900 p-3.5 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-400">Perspectiva 3D:</span>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300">
                <span>Inclinación X:</span>
                <input 
                  type="range" 
                  min="-45" 
                  max="45" 
                  value={rotateX} 
                  onChange={(e) => {
                    setIsRotatingAutomatically(false);
                    setRotateX(Number(e.target.value));
                  }}
                  className="w-20 accent-amber-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-amber-500 w-6 text-right">{rotateX}°</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300">
                <span>Rotación Y:</span>
                <input 
                  type="range" 
                  min="-180" 
                  max="180" 
                  value={rotateY} 
                  onChange={(e) => {
                    setIsRotatingAutomatically(false);
                    setRotateY(Number(e.target.value));
                  }}
                  className="w-20 accent-amber-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-amber-500 w-8 text-right">{Math.round(rotateY)}°</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono text-slate-300">
                <span>Zoom:</span>
                <button 
                  onClick={() => setZoom(prev => Math.max(0.7, prev - 0.1))}
                  className="p-1 bg-slate-900 rounded border border-slate-800 hover:text-amber-400 cursor-pointer"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <span className="text-amber-500 px-1">{Math.round(zoom * 100)}%</span>
                <button 
                  onClick={() => setZoom(prev => Math.min(1.5, prev + 0.1))}
                  className="p-1 bg-slate-900 rounded border border-slate-800 hover:text-amber-400 cursor-pointer"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Arrastra con el ratón sobre el mapa para rotar el tablero 3D manualmente.</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ANOMALY DETAILS & COLLABORATIVE LOGS */}
        <div className="w-full lg:w-[480px] flex flex-col h-full bg-[#030712] overflow-y-auto">
          
          <AnimatePresence mode="wait">
            {selectedLegend ? (
              <motion.div
                key={selectedLegend.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 flex flex-col gap-6"
              >
                {/* Location Title Block */}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${selectedLegend.hemisphere === "norte" ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" : "bg-purple-500/10 text-purple-400 border border-purple-500/20"}`}>
                      Hemisferio {selectedLegend.hemisphere === "norte" ? "Norte (Boreal)" : "Sur (Austral)"}
                    </span>
                    <span className="text-[9px] font-mono text-amber-500 font-semibold">{selectedLegend.coordinates}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-100 font-serif mt-1 border-b border-amber-500/10 pb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>{selectedLegend.title}</span>
                  </h2>
                  <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-wider">Subdivisión: <span className="text-slate-300 font-bold">{selectedLegend.region}</span></p>
                </div>

                {/* Tabs for Sidebar */}
                <div className="flex border-b border-slate-900 text-xs font-mono">
                  <button
                    onClick={() => setActiveRightTab("arqueologia")}
                    className={`flex-1 py-2.5 text-center transition-all cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
                      activeRightTab === "arqueologia"
                        ? "border-amber-500 text-amber-400 font-bold bg-amber-500/5"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Investigación Física</span>
                  </button>
                  <button
                    onClick={() => setActiveRightTab("ia")}
                    className={`flex-1 py-2.5 text-center transition-all cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
                      activeRightTab === "ia"
                        ? "border-amber-500 text-amber-400 font-bold bg-amber-500/5"
                        : "border-transparent text-slate-400 hover:text-slate-200 animate-pulse"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Inteligencia de Ohara (AI)</span>
                  </button>
                </div>

                {activeRightTab === "arqueologia" ? (
                  <>
                    {/* Myth & Legend */}
                    <div className="bg-amber-950/10 border border-amber-950/40 rounded-lg p-4">
                      <h3 className="text-xs font-bold text-amber-500 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>El Mito y la Leyenda</span>
                      </h3>
                      <p className="text-xs text-slate-300 mt-2.5 leading-relaxed text-justify italic">
                        "{selectedLegend.myth}"
                      </p>
                    </div>

                    {/* Historical Hidden Truth */}
                    <div className="bg-indigo-950/10 border border-indigo-950/40 rounded-lg p-4">
                      <h3 className="text-xs font-bold text-sky-400 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                        <Eye className="w-3.5 h-3.5 text-sky-400" />
                        <span>La Verdad Oculta Revelada</span>
                      </h3>
                      <p className="text-xs text-slate-300 mt-2.5 leading-relaxed text-justify">
                        {selectedLegend.truth}
                      </p>
                    </div>

                    {/* COLLABORATIVE LOGS FEED ON THIS SPECIFIC ANOMALY */}
                    <div className="border-t border-slate-900 pt-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                          <span>Análisis Cooperativo</span>
                        </h3>
                        <span className="text-[9px] font-mono text-slate-500">Filtrado por ubicación</span>
                      </div>

                      {/* Add Log Form */}
                      <form onSubmit={handleSubmitLog} className="bg-slate-950/60 border border-slate-900 rounded-lg p-3.5 mb-5 flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] font-mono text-slate-500 block mb-1">Tu Identidad</label>
                            <input
                              type="text"
                              value={authorName}
                              onChange={(e) => setAuthorName(e.target.value)}
                              placeholder="Firma arqueológica"
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 outline-none focus:border-amber-500/50 font-mono"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-mono text-slate-500 block mb-1">Disciplina Académica</label>
                            <select
                              value={authorRole}
                              onChange={(e) => setAuthorRole(e.target.value as any)}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 outline-none focus:border-amber-500/50 font-mono cursor-pointer"
                            >
                              {RESEARCH_ROLES.map(role => (
                                <option key={role} value={role}>{role}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] font-mono text-slate-500 block mb-1">Anotar Hallazgo o Hipótesis en el Registro</label>
                          <textarea
                            value={newLogText}
                            onChange={(e) => setNewLogText(e.target.value)}
                            placeholder="Escribe tu hipótesis histórica o mito asociado de esta región..."
                            rows={2}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-500/50 leading-normal resize-none"
                            required
                          />
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[8px] font-mono text-slate-500 flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-amber-500" />
                            <span>Aportación premiada con +15 XP</span>
                          </span>
                          <button
                            type="submit"
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-slate-50 text-[10px] font-bold rounded flex items-center gap-1 transition-all cursor-pointer shadow shadow-amber-950"
                          >
                            <Send className="w-3 h-3" />
                            <span>Registrar Hallazgo</span>
                          </button>
                        </div>
                      </form>

                      {/* Logs list */}
                      <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                        {collaborativeLogs.filter(log => log.locationId === selectedLegend.id).length === 0 ? (
                          <div className="text-center py-6 border border-dashed border-slate-900 rounded-lg text-slate-500 text-xs font-mono">
                            No hay anotaciones previas en este sector. ¡Sé el primero en firmar el registro!
                          </div>
                        ) : (
                          collaborativeLogs
                            .filter(log => log.locationId === selectedLegend.id)
                            .map((log) => (
                              <div 
                                key={log.id} 
                                className="p-3 bg-slate-950/40 border border-slate-900 hover:border-slate-800/80 rounded-lg transition-all flex flex-col gap-1.5"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-serif font-bold text-xs text-slate-200">{log.author}</span>
                                    <span className="text-[8px] font-mono px-1.5 py-0.2 bg-slate-900 border border-slate-800/80 rounded-full text-sky-400 font-bold uppercase tracking-wider">
                                      {log.role}
                                    </span>
                                  </div>
                                  <span className="text-[9px] font-mono text-slate-600">{log.timestamp}</span>
                                </div>
                                <p className="text-[11px] text-slate-400 leading-relaxed text-justify font-sans">
                                  {log.text}
                                </p>
                                {log.verified && (
                                  <div className="flex items-center gap-1 text-[8px] font-mono text-emerald-400 self-end mt-0.5">
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    <span>Verificado por la Academia Ohara</span>
                                  </div>
                                )}
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  /* ================= INTELIGENCIA DE OHARA AI CHAT INTERFACE ================= */
                  <div className="flex flex-col gap-4">
                    {/* Sintonizador HUD Banner */}
                    <div className="bg-[#020617] border border-amber-500/20 rounded-lg p-3 flex items-center justify-between shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        <div className="text-left">
                          <p className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-widest">Éter Sintonizado</p>
                          <p className="text-[8px] font-mono text-slate-400 uppercase mt-0.5">Frecuencia: {selectedLegend.coordinates}</p>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 uppercase font-bold animate-pulse">
                        Procesador Vegapunk V3
                      </span>
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
                    <div className="bg-slate-950/80 border border-slate-900 rounded-lg p-4 h-[280px] overflow-y-auto flex flex-col gap-3.5">
                      {/* Default welcome from clover if empty */}
                      {(aiChats[selectedLegend.id] || []).length === 0 ? (
                        <div className="text-left flex flex-col gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                            <span className="text-xs font-serif text-emerald-400 font-bold">Erudito Holográfico de Ohara</span>
                            <span className="text-[8px] font-mono text-slate-500">(Sintonizador)</span>
                          </div>
                          <p className="text-xs leading-relaxed text-slate-300 bg-slate-900/40 p-3 rounded-lg border border-slate-900/60 text-justify">
                            Saludos, investigador. Me he sintonizado con el campo de éter de <strong>{selectedLegend.title}</strong> en las coordenadas <strong>{selectedLegend.coordinates}</strong>. 
                            <br /><br />
                            Toda la información del <strong>Siglo Vacío</strong> y la tecnología prohibida ha sido compilada. Hazme cualquier pregunta sobre este sector o utiliza los sintonizadores rápidos a continuación para revelar lo censurado.
                          </p>
                        </div>
                      ) : (
                        (aiChats[selectedLegend.id] || []).map((msg, idx) => (
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
                              {msg.role === 'model' && msg.text.includes("SABOTAJE EN LA RED ORIENTAL") && lastFailedQuery && lastFailedQuery.locId === selectedLegend.id && (
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
                        {getSuggestedQuestions(selectedLegend.id).map((q, idx) => (
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
                      className="flex gap-2 border-t border-slate-900 pt-3"
                    >
                      <input
                        type="text"
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        placeholder="Escribe tu hipótesis histórica o coordenadas..."
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

              </motion.div>
            ) : (
              <div className="p-12 text-center text-slate-500 text-xs font-mono flex flex-col items-center justify-center h-full">
                <Compass className="w-8 h-8 text-slate-600 mb-2 animate-pulse" />
                <span>Selecciona una anomalía en la mesa de mapas 3D para revelar los mitos, leyendas y registros arqueológicos cooperativos.</span>
              </div>
            )}
          </AnimatePresence>

          {/* ALL REAL-TIME LOGS RECENT FEED LIST AT THE BOTTOM OF THE SIDEBAR */}
          <div className="p-6 border-t border-slate-900 bg-slate-950/30">
            <h3 className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider mb-4 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-emerald-500" />
              <span>Descubrimientos Recientes (Mundial)</span>
            </h3>

            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
              {collaborativeLogs.slice(0, 7).map((log) => (
                <div 
                  key={"feed_" + log.id}
                  onClick={() => {
                    const matchedLegend = PREDEFINED_LEGENDS.find(l => l.id === log.locationId);
                    if (matchedLegend) setSelectedLegend(matchedLegend);
                  }}
                  className={`p-2 bg-slate-950/80 border rounded text-[10px] cursor-pointer transition-all flex items-start gap-2 ${
                    selectedLegend?.id === log.locationId ? 'border-amber-500/50 bg-amber-950/5' : 'border-slate-900 hover:border-slate-800'
                  }`}
                >
                  <div className="p-1 bg-slate-900 rounded text-amber-500 shrink-0 mt-0.5">
                    <Compass className="w-3 h-3 animate-spin-slow" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-slate-500 truncate mr-1">
                        <strong className="text-slate-300 font-serif font-bold">{log.author}</strong> en <span className="text-amber-500 font-bold">{log.locationName}</span>
                      </span>
                      <span className="text-[8px] font-mono text-slate-600 shrink-0">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-400 line-clamp-1 mt-0.5 italic">"{log.text}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ================= ORBIS TERRARUM MAP OVERLAY ================= */}
      {showOrbisTerrarum && (
        <OrbisTerrarumMap
          userProgress={userProgress}
          onClose={() => setShowOrbisTerrarum(false)}
          onSaveProgress={onSaveProgress}
        />
      )}
    </div>
  );
}
