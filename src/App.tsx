import { useState, useEffect, useRef, MouseEvent, TouchEvent } from "react";
import { 
  Compass, Search, ZoomIn, ZoomOut, RotateCcw, X, Sparkles, 
  Anchor, Link2, Skull, Globe, HelpCircle, AlertTriangle, 
  Tag, Map, Info, ChevronRight, CheckCircle, Award, Zap, HelpCircle as HelpIcon,
  Maximize2, Eye, Compass as CompassIcon, Sliders, Layers, ChevronLeft, BookOpen,
  Radio, Trophy, User, Monitor, Smartphone
} from "lucide-react";
import { nodesData, NodeData } from "./data/nodes";
import OharaAcademy from "./components/OharaAcademy";
import OharaMinigames, { TreasureChestPanel, COMMON_GAMES, generateUniqueGame, ActiveGame } from "./components/OharaMinigames";
import { UserProgress } from "./data/courses";
import OronceFineMap from "./components/OronceFineMap";
import ArchaeologistPortal from "./components/ArchaeologistPortal";

export default function App() {
  // Navigation / View State
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.75);
  const [translate, setTranslate] = useState({ x: 50, y: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<number | "all">("all");

  // Selection state
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [pulseNodeId, setPulseNodeId] = useState<string | null>(null);

  // UI overlays
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAcademy, setShowAcademy] = useState(false);
  const [hasVisited, setHasVisited] = useState(false);

  // Ohara Academy & Gamification State
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [activeGame, setActiveGame] = useState<ActiveGame | null>(null);
  const [showTreasureChest, setShowTreasureChest] = useState(false);
  const [anomalyAlert, setAnomalyAlert] = useState<ActiveGame | null>(null);
  const [showOronceMap, setShowOronceMap] = useState(false);
  const [showPortal, setShowPortal] = useState(false);

  // Detect if running inside Android (Capacitor/WebView) or manual override
  const [isMobileView, setIsMobileView] = useState(() => {
    const isAndroid = typeof (window as any).Capacitor !== 'undefined' || 
                      navigator.userAgent.toLowerCase().includes('android');
    if (isAndroid) return true;
    
    // Check if user is actually on a mobile or tablet device using User Agent
    const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod|Windows Phone|BlackBerry|webOS/i.test(navigator.userAgent);
    
    // On PC/Desktop (not a mobile device), default to computer (desktop) view directly!
    // On mobile/tablet devices, default to mobile view.
    return isMobileDevice;
  });

  const isAndroidApp = typeof (window as any).Capacitor !== 'undefined' || 
                       navigator.userAgent.toLowerCase().includes('android');

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Helper to load progress from localStorage
  const loadProgress = () => {
    const stored = localStorage.getItem("ohara_user_progress");
    if (stored) {
      try {
        setUserProgress(JSON.parse(stored));
      } catch (e) {
        console.error("Error loading progress in map", e);
      }
    } else {
      setUserProgress(null);
    }
  };

  useEffect(() => {
    loadProgress();

    // Listen to custom event to sync when OharaAcademy or Minigames update state
    const handleSync = () => loadProgress();
    window.addEventListener("ohara_sync_progress", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("ohara_sync_progress", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const handleSaveProgress = (updated: UserProgress) => {
    setUserProgress(updated);
    localStorage.setItem("ohara_user_progress", JSON.stringify(updated));
    window.dispatchEvent(new Event("ohara_sync_progress"));
  };

  // --- HIDDEN GAMIFICATION TRIGGER ALGORITHM ---
  const triggerAnomalyCheck = (topicName: string) => {
    if (activeGame || anomalyAlert) return; // Allow only one mystery challenge active at a time

    // 35% chance to trigger an anomaly on interaction
    if (Math.random() > 0.35) return;

    const roll = Math.random();
    let gameToTrigger: ActiveGame | null = null;

    // Filter which common games are not yet completed
    const completedIds = userProgress?.discoveredTreasures?.map(t => t.id) || [];
    
    // Check if guest has completed items in guest storage
    let guestCompletedIds: string[] = [];
    try {
      const storedGuest = localStorage.getItem("ohara_guest_treasures");
      if (storedGuest) {
        guestCompletedIds = JSON.parse(storedGuest).map((t: any) => t.id);
      }
    } catch (e) {}

    const allCompletedIds = [...completedIds, ...guestCompletedIds];
    const availableCommon = COMMON_GAMES.filter(g => !allCompletedIds.includes(g.id));

    // 60% chance for Common Game, 40% for procedurally generated Unique Game
    // If all common games are completed, only unique ones trigger!
    if (roll < 0.6 && availableCommon.length > 0) {
      const randIdx = Math.floor(Math.random() * availableCommon.length);
      gameToTrigger = availableCommon[randIdx];
    } else {
      gameToTrigger = generateUniqueGame(topicName);
    }

    if (gameToTrigger) {
      setAnomalyAlert(gameToTrigger);

      // Dismiss after 15 seconds to avoid breaking user immersion
      setTimeout(() => {
        setAnomalyAlert(prev => prev?.id === gameToTrigger?.id ? null : prev);
      }, 15000);
    }
  };

  // Trigger check whenever searchQuery reaches a stable state (debounced)
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 3) return;
    
    const delayDebounce = setTimeout(() => {
      triggerAnomalyCheck(`Búsqueda: "${trimmed}"`);
    }, 1500); // 1.5 seconds debounce
    
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Stats for the user
  const totalNodes = nodesData.length;
  const level5Count = nodesData.filter(n => n.level === 5).length;

  // Initial welcome message or tour
  useEffect(() => {
    const visited = localStorage.getItem("oraculo_visited");
    if (!visited) {
      setShowHelpModal(true);
      localStorage.setItem("oraculo_visited", "true");
    }
    setHasVisited(true);
  }, []);

  // Listen to Escape key to close panels
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedNode(null);
        setShowHelpModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle Dragging
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    // Only drag if left click and clicking on the map background
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest(".interactive-node") || target.closest(".ui-overlay")) return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX - translate.x, y: e.clientY - translate.y });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setTranslate({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile devices
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest(".interactive-node") || target.closest(".ui-overlay")) return;
    
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - translate.x,
        y: e.touches[0].clientY - translate.y
      });
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    if (e.touches.length === 1) {
      setTranslate({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Wheel Zoom (centered around the mouse pointer or simply scales)
  const handleWheel = (e: any) => {
    e.preventDefault();
    const zoomIntensity = 0.05;
    const scrollDelta = -e.deltaY;
    const newScale = Math.min(Math.max(scale + (scrollDelta > 0 ? zoomIntensity : -zoomIntensity), 0.4), 2.5);
    
    // Zoom towards center of screen to keep it intuitive
    setScale(newScale);
  };

  // Focus and center on a node
  const focusOnNode = (node: NodeData) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Center equation: width/2 - node.x * scale = translate.x
    const targetScale = 1.1; // Zoom in slightly for dramatic focus
    
    // Adjust target coordinates considering sidebar displacement on desktop
    const sidebarWidthOffset = width > 768 ? 200 : 0;
    
    setTranslate({
      x: (width - sidebarWidthOffset) / 2 - node.x * targetScale,
      y: height / 2 - node.y * targetScale
    });
    setScale(targetScale);
    setSelectedNode(node);

    // Trigger visual ripple/pulse on targeted node
    setPulseNodeId(node.id);
    
    // Check for hidden archaeological anomalies
    triggerAnomalyCheck(node.title);

    setTimeout(() => {
      setPulseNodeId(null);
    }, 2000);
  };

  // Zoom controls
  const zoomIn = () => setScale(prev => Math.min(prev + 0.15, 2.5));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.15, 0.4));
  const resetView = () => {
    setScale(isMobileView ? 0.32 : 0.75);
    setTranslate({ x: isMobileView ? 20 : 50, y: isMobileView ? 160 : 30 });
    setSelectedNode(null);
  };

  useEffect(() => {
    resetView();
  }, [isMobileView]);

  const fitToScreen = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mapWidth = 1400;
    const mapHeight = 900;
    const scaleX = rect.width / mapWidth;
    const scaleY = rect.height / mapHeight;
    const idealScale = Math.min(scaleX, scaleY) * 0.9;
    
    setScale(Math.max(Math.min(idealScale, 1.5), 0.4));
    setTranslate({
      x: (rect.width - mapWidth * idealScale) / 2,
      y: (rect.height - mapHeight * idealScale) / 2
    });
  };

  // Search logic: filter nodes by title, tags, content
  const filteredNodes = nodesData.filter(node => {
    // Search input match
    const matchesSearch = searchQuery === "" || 
      node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.inOnePiece.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.inRealWorld.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // Category filter match
    const matchesCategory = selectedCategory === "all" || node.category === selectedCategory;

    // Level filter match
    const matchesLevel = selectedLevel === "all" || node.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Category labels and colors helper
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case "grand_line":
        return { color: "#38bdf8", bg: "bg-sky-500/10", border: "border-sky-500/30", text: "text-sky-400" };
      case "mundo_real":
        return { color: "#fbbf24", bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400" };
      case "puentes":
        return { color: "#34d399", bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" };
      case "cuestiones":
        return { color: "#a78bfa", bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400" };
      default:
        return { color: "#94a3b8", bg: "bg-slate-500/10", border: "border-slate-500/30", text: "text-slate-400" };
    }
  };

  // Count matches helper
  const totalMatches = searchQuery !== "" || selectedCategory !== "all" || selectedLevel !== "all" ? filteredNodes.length : null;

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-[#070b13] text-slate-100 select-none font-sans"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, #0c1527 0%, #050810 100%)`
      }}
    >
      {/* ================= HEADER AND BRANDING ================= */}
      <header className={`absolute top-0 left-0 right-0 z-20 flex flex-col md:flex-row items-center justify-between border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md ui-overlay ${isMobileView ? "px-4 py-2 text-slate-100" : "px-6 py-4"}`}>
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2 md:gap-3">
            <div className={`bg-gradient-to-br from-amber-500 to-sky-600 rounded-lg shadow-lg border border-slate-700/50 shrink-0 ${isMobileView ? "p-1" : "p-2"}`}>
              <Compass className={`${isMobileView ? "w-4.5 h-4.5" : "w-6 h-6"} text-slate-100 animate-slow-spin`} />
            </div>
            <div>
              <h1 className={`font-bold tracking-tight bg-gradient-to-r from-sky-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent leading-tight ${isMobileView ? "text-xs" : "text-md md:text-lg"}`}>
                ORÁCULO OCULTO
              </h1>
              <p className={`font-mono text-slate-400 uppercase tracking-widest ${isMobileView ? "text-[8px]" : "text-[10px] md:text-xs"}`}>
                {isMobileView ? "Árbol de Talentos" : "Árbol de Talentos: One Piece & Realidad Paralela"}
              </p>
            </div>
          </div>

          {/* Collapsible Filters Button on Mobile */}
          {isMobileView && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowMobileFilters(prev => !prev)}
                className={`p-1.5 border rounded-md text-xs transition-all cursor-pointer flex items-center gap-1 ${
                  showMobileFilters 
                    ? "bg-amber-600 border-amber-500 text-slate-100" 
                    : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                }`}
                title="Alternar Filtros"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono">Filtros</span>
              </button>

              <button
                onClick={() => setShowHelpModal(true)}
                className="p-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-md text-slate-300 cursor-pointer"
                title="Manual"
              >
                <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
              </button>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className={`flex flex-wrap items-center gap-2 w-full md:w-auto justify-end ${isMobileView ? (showMobileFilters ? "flex mt-2 pt-2 border-t border-slate-800/60" : "hidden") : "flex mt-3 md:mt-0"}`}>
          {/* Quick Search */}
          <div className="relative w-full sm:w-60 md:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar misterios, tags, evidencias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-md text-xs text-slate-200 placeholder-slate-500 outline-none transition-all duration-200"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex gap-1.5 w-full sm:w-auto justify-end">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-900/90 border border-slate-800 rounded-md text-[11px] font-medium text-slate-300 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">Todas las Islas</option>
              <option value="grand_line">🏴‍☠️ Isla del Grand Line</option>
              <option value="mundo_real">🌍 Isla del Mundo Real</option>
              <option value="puentes">🌉 Archipiélago de los Puentes</option>
              <option value="cuestiones">🔮 Isla de las Cuestiones</option>
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="px-2.5 py-1.5 bg-slate-900/90 border border-slate-800 rounded-md text-[11px] font-medium text-slate-300 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Todos los Niveles</option>
              <option value="1">Nivel 1: Periferia</option>
              <option value="2">Nivel 2: Misterio</option>
              <option value="3">Nivel 3: El Núcleo</option>
              <option value="4">Nivel 4: Maestría</option>
              <option value="5">Nivel 5: Maestría Absoluta ✦</option>
            </select>

            {!isMobileView && (
              <>
                {/* Help Button */}
                <button
                  onClick={() => setShowHelpModal(true)}
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-md text-slate-300 transition-all cursor-pointer"
                  title="Manual del Descubridor"
                >
                  <HelpCircle className="w-4 h-4 text-sky-400" />
                </button>

                {/* Archaeologist Portal Button */}
                <button
                  onClick={() => {
                    setShowPortal(prev => !prev);
                    setSelectedNode(null); // Close active node panel to avoid overlapping
                    setShowAcademy(false); // Close academy to prevent overlap
                    setShowTreasureChest(false); // Close treasure chest
                    setShowOronceMap(false); // Close Oronce map
                  }}
                  className={`px-3 py-1.5 border rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                    showPortal
                      ? 'bg-indigo-600 hover:bg-indigo-500 border-indigo-400 text-slate-100 shadow-indigo-950/40'
                      : 'bg-gradient-to-r from-indigo-950 to-slate-900 hover:from-indigo-900 hover:to-slate-800 border-indigo-500/30 hover:border-indigo-500/50 text-slate-200 shadow-indigo-950/20'
                  }`}
                  title="Bitácora de Ohara: Conexión y Respaldos"
                >
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    {userProgress ? userProgress.username : "Identidad / Sincronización"}
                  </span>
                  {userProgress && (
                    <span className="bg-indigo-500/25 text-indigo-300 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-indigo-500/30">
                      {userProgress.restorationPoints} RP
                    </span>
                  )}
                </button>

                {/* Ohara Academy Button */}
                <button
                  onClick={() => {
                    setShowAcademy(prev => !prev);
                    setSelectedNode(null); // Close active node panel to avoid overlapping
                    setShowTreasureChest(false); // Close treasure chest to prevent overlay overlap
                    setShowOronceMap(false); // Close Oronce map
                    setShowPortal(false); // Close Portal
                  }}
                  className={`px-3 py-1.5 border rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                    showAcademy
                      ? 'bg-purple-600 hover:bg-purple-500 border-purple-400 text-slate-100 shadow-purple-950/40'
                      : 'bg-gradient-to-r from-purple-950 to-indigo-950 hover:from-purple-900 hover:to-indigo-900 border-purple-500/30 hover:border-purple-500/50 text-slate-200 shadow-purple-950/20'
                  }`}
                  title="Academia de Ohara: Cursos de la Verdad"
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                  <span>Academia de Ohara</span>
                </button>

                {/* Cofre de Tesoros Button */}
                <button
                  onClick={() => {
                    setShowTreasureChest(prev => !prev);
                    setSelectedNode(null); // Close active node panel to avoid overlapping
                    setShowAcademy(false); // Close academy to prevent overlap
                    setShowOronceMap(false); // Close Oronce map
                    setShowPortal(false); // Close Portal
                  }}
                  className={`px-3 py-1.5 border rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                    showTreasureChest
                      ? 'bg-amber-600 hover:bg-amber-500 border-amber-400 text-slate-100 shadow-amber-950/40'
                      : 'bg-gradient-to-r from-amber-950 to-amber-900 hover:from-amber-900 hover:to-amber-800 border-amber-500/30 hover:border-amber-500/50 text-slate-200 shadow-amber-950/20'
                  }`}
                  title="Cofre de Tesoros: Logros de Anomalías"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cofre de Tesoros</span>
                  {(userProgress?.discoveredTreasures?.length ?? 0) > 0 && (
                    <span className="bg-amber-500 text-slate-950 font-mono text-[9px] font-extrabold px-1.5 py-0.2 rounded-full leading-none flex items-center justify-center animate-pulse">
                      {userProgress?.discoveredTreasures?.length}
                    </span>
                  )}
                </button>

                {/* Oronce Fine 3D Map Button */}
                <button
                  onClick={() => {
                    setShowOronceMap(prev => !prev);
                    setSelectedNode(null); // Close active node panel to avoid overlapping
                    setShowAcademy(false); // Close academy to prevent overlap
                    setShowTreasureChest(false); // Close treasure chest
                    setShowPortal(false); // Close Portal
                  }}
                  className={`px-3 py-1.5 border rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                    showOronceMap
                      ? 'bg-sky-600 hover:bg-sky-500 border-sky-400 text-slate-100 shadow-sky-950/40'
                      : 'bg-gradient-to-r from-sky-950 to-slate-900 hover:from-sky-900 hover:to-slate-800 border-sky-500/30 hover:border-sky-500/50 text-slate-200 shadow-sky-950/20'
                  }`}
                  title="Proyección de Oronce Fine (1531)"
                >
                  <Globe className="w-3.5 h-3.5 text-sky-400" />
                  <span>Mesa 3D Oronce Fine</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ================= STATS FLOATER PANEL ================= */}
      <div className="absolute top-24 left-6 z-10 hidden lg:flex flex-col gap-2.5 p-4 rounded-lg bg-slate-950/75 backdrop-blur-md border border-slate-800/80 ui-overlay shadow-xl shadow-black/60 max-w-xs">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">Estado de Sincronización</span>
          <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-900/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> CONECTADO
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-1">
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Nodos Revelados</div>
            <div className="text-xl font-bold text-slate-200 mt-0.5">{totalNodes} / 28</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Misterios Maestros</div>
            <div className="text-xl font-bold text-amber-400 mt-0.5">{level5Count} / 5</div>
          </div>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-sky-300">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span> Grand Line
            </span>
            <span className="font-mono text-slate-400">10 Nodos</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Mundo Real
            </span>
            <span className="font-mono text-slate-400">11 Nodos</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Puentes
            </span>
            <span className="font-mono text-slate-400">5 Nodos</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span> Meta
            </span>
            <span className="font-mono text-slate-400">2 Nodos</span>
          </div>
        </div>

        {totalMatches !== null && (
          <div className="mt-2 p-2 bg-slate-900/80 border border-slate-800 rounded text-center text-xs text-sky-300 font-medium">
            🔍 Filtrando: {totalMatches} nodos encontrados
          </div>
        )}
      </div>

      {/* ================= INTERACTIVE MAP VIEWPORT ================= */}
      <div 
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing outline-none overflow-hidden relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        {/* The SVG and zoom transform wrapper */}
        <div 
          className="absolute origin-top-left transition-transform duration-300 ease-out pointer-events-none"
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            width: "1400px",
            height: "900px"
          }}
        >
          {/* ================= MAIN MAP SVG ================= */}
          <svg 
            viewBox="0 0 1400 900" 
            width="1400" 
            height="900" 
            className="w-full h-full pointer-events-auto overflow-visible select-none"
          >
            {/* Definitions for Filters, Gradients, Patters, etc */}
            <defs>
              {/* Grid pattern */}
              <pattern id="cartography-grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.4" />
                <circle cx="0" cy="0" r="1.5" fill="#334155" opacity="0.3" />
              </pattern>

              {/* Wave pattern for ancient maritime map look */}
              <pattern id="sea-waves" width="200" height="40" patternUnits="userSpaceOnUse">
                <path d="M 0 20 Q 25 15, 50 20 T 100 20 T 150 20 T 200 20" fill="none" stroke="#0f172a" strokeWidth="1" opacity="0.4" />
                <path d="M 0 30 Q 25 25, 50 30 T 100 30 T 150 30 T 200 30" fill="none" stroke="#0f172a" strokeWidth="0.75" opacity="0.25" />
              </pattern>

              {/* Radial Gradients for Islands Boundaries */}
              <radialGradient id="grad-island-grandline" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.12" />
                <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="grad-island-mundoreal" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.1" />
                <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="grad-island-puentes" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.11" />
                <stop offset="65%" stopColor="#34d399" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="grad-island-cuestiones" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.13" />
                <stop offset="60%" stopColor="#a78bfa" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
              </radialGradient>

              {/* Soft glows */}
              <filter id="glow-grandline" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow-mundoreal" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow-puentes" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow-cuestiones" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Master level 5 intense glow */}
              <filter id="master-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="12" result="blur1" />
                <feGaussianBlur stdDeviation="6" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur1" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background elements */}
            <rect 
              width="1400" 
              height="900" 
              fill="transparent" 
              className="cursor-crosshair"
              onClick={(e) => {
                e.stopPropagation();
                triggerAnomalyCheck("Fondo Marino (Abisal)");
              }}
            />
            <rect width="1400" height="900" fill="url(#cartography-grid)" pointerEvents="none" />
            <rect width="1400" height="900" fill="url(#sea-waves)" pointerEvents="none" />

            {/* Latitude and Longitude Labels on margins */}
            <g opacity="0.3" className="text-[10px] font-mono fill-slate-500">
              <text x="30" y="40">60° N</text>
              <text x="30" y="860">60° S</text>
              <text x="100" y="880">120° W</text>
              <text x="700" y="880">0° Meridian</text>
              <text x="1300" y="880">120° E</text>
              {/* Border coordinate ruler */}
              <rect x="20" y="20" width="1360" height="860" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="10, 5" />
            </g>

            {/* ================= DECORATIVE SEA ELEMENTS ================= */}
            {/* Sailing Ship Sketch (SVG Vectors) */}
            <g transform="translate(150, 700) scale(0.6)" opacity="0.25" className="animate-wave-float">
              {/* Sea base */}
              <path d="M 0 100 Q 50 95, 100 100 T 200 100" fill="none" stroke="#475569" strokeWidth="2" />
              {/* Hull */}
              <path d="M 40 85 L 160 85 L 140 100 L 60 100 Z" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              {/* Mast 1 */}
              <line x1="80" y1="85" x2="80" y2="20" stroke="#475569" strokeWidth="2" />
              {/* Mast 2 */}
              <line x1="120" y1="85" x2="120" y2="10" stroke="#475569" strokeWidth="2" />
              {/* Sails 1 */}
              <path d="M 80 30 Q 55 45, 80 60 Z" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
              <path d="M 80 65 Q 60 75, 80 82 Z" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
              {/* Sails 2 */}
              <path d="M 120 20 Q 95 35, 120 50 Z" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
              <path d="M 120 55 Q 100 65, 120 75 Z" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
              {/* Flags */}
              <path d="M 80 20 L 90 23 L 80 26 Z" fill="#38bdf8" />
              <path d="M 120 10 L 132 14 L 120 18 Z" fill="#fbbf24" />
              <text x="100" y="118" textAnchor="middle" className="text-[10px] font-mono fill-slate-500 italic">"Going Merry"</text>
            </g>

            {/* Sea Monster Sketch */}
            <g transform="translate(1000, 520) scale(0.5)" opacity="0.15" className="animate-wave-float">
              {/* Waves */}
              <path d="M 50 70 Q 75 40, 100 70 T 150 70" fill="none" stroke="#475569" strokeWidth="2" />
              {/* Serpentine tail peaks */}
              <path d="M 80 70 Q 95 20, 110 70" fill="none" stroke="#475569" strokeWidth="3" />
              <path d="M 130 70 Q 140 30, 150 70" fill="none" stroke="#475569" strokeWidth="3" />
              {/* Dragon head */}
              <path d="M 40 70 Q 30 20, 15 30 Q 5 35, 10 50 Q 20 60, 30 70 Z" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
              <circle cx="20" cy="40" r="1.5" fill="#f87171" />
              <text x="75" y="90" textAnchor="middle" className="text-[10px] font-mono fill-slate-500 italic">"Sea King Territory"</text>
            </g>

            {/* Vintage Compass Rose (Bottom Left) */}
            <g transform="translate(150, 150) scale(0.65)" opacity="0.3">
              <circle cx="0" cy="0" r="80" fill="none" stroke="#334155" strokeWidth="1" />
              <circle cx="0" cy="0" r="75" fill="none" stroke="#334155" strokeWidth="0.5" strokeDasharray="3, 3" />
              <circle cx="0" cy="0" r="40" fill="none" stroke="#334155" strokeWidth="0.5" />
              {/* Compass points */}
              <polygon points="0,-90 6,-15 0,0" fill="#38bdf8" stroke="#1e293b" />
              <polygon points="0,-90 -6,-15 0,0" fill="#0c4a6e" stroke="#1e293b" />
              
              <polygon points="0,90 6,15 0,0" fill="#fbbf24" stroke="#1e293b" />
              <polygon points="0,90 -6,15 0,0" fill="#78350f" stroke="#1e293b" />
              
              <polygon points="90,0 15,6 0,0" fill="#34d399" stroke="#1e293b" />
              <polygon points="90,0 15,-6 0,0" fill="#064e3b" stroke="#1e293b" />

              <polygon points="-90,0 -15,6 0,0" fill="#a78bfa" stroke="#1e293b" />
              <polygon points="-90,0 -15,-6 0,0" fill="#581c87" stroke="#1e293b" />
              {/* Dial markings */}
              <text x="0" y="-100" textAnchor="middle" className="text-xs font-mono font-bold fill-sky-400">N</text>
              <text x="0" y="112" textAnchor="middle" className="text-xs font-mono font-bold fill-amber-400">S</text>
              <text x="105" y="4" textAnchor="middle" className="text-xs font-mono font-bold fill-emerald-400">E</text>
              <text x="-105" y="4" textAnchor="middle" className="text-xs font-mono font-bold fill-purple-400">W</text>
            </g>

            {/* ================= ISLANDS BACKGROUND VISUAL SHAPES ================= */}
            {/* Isla 1 (Grand Line) Anchor Area */}
            <g transform="translate(350, 250)">
              <path d="M -260,0 C -260,-120 -150,-210 0,-210 C 150,-210 260,-120 260,0 C 260,100 170,160 0,160 C -170,160 -260,100 -260,0 Z" fill="url(#grad-island-grandline)" />
              {/* Island Label */}
              <text x="0" y="-160" textAnchor="middle" className="text-[13px] font-mono font-extrabold fill-sky-400/80 tracking-widest uppercase">
                🏴‍☠️ ISLA DEL GRAND LINE
              </text>
              <text x="0" y="-145" textAnchor="middle" className="text-[9px] font-mono fill-sky-500/50 tracking-wider">
                CANON ONE PIECE - CÓDICE ANCESTRAL
              </text>
            </g>

            {/* Isla 2 (Mundo Real) Anchor Area */}
            <g transform="translate(1050, 250)">
              <path d="M -300,0 C -300,-150 -150,-230 0,-230 C 150,-230 300,-150 300,0 C 300,160 170,220 0,220 C -170,220 -300,160 -300,0 Z" fill="url(#grad-island-mundoreal)" />
              {/* Island Label */}
              <text x="0" y="-180" textAnchor="middle" className="text-[13px] font-mono font-extrabold fill-amber-400/80 tracking-widest uppercase">
                🌍 ISLA DEL MUNDO REAL
              </text>
              <text x="0" y="-165" textAnchor="middle" className="text-[9px] font-mono fill-amber-500/50 tracking-wider">
                CONSPIRACIONES, HISTORIA Y CIENCIA OCULTA
              </text>
            </g>

            {/* Isla 3 (Puentes) Anchor Area */}
            <g transform="translate(700, 600)">
              <path d="M -220,0 C -220,-110 -130,-170 0,-170 C 130,-170 220,-110 220,0 C 220,130 130,200 0,200 C -130,200 -220,130 -220,0 Z" fill="url(#grad-island-puentes)" />
              {/* Island Label */}
              <text x="0" y="150" textAnchor="middle" className="text-[13px] font-mono font-extrabold fill-emerald-400/80 tracking-widest uppercase">
                🌉 ARCHIPIÉLAGO DE LOS PUENTES
              </text>
              <text x="0" y="165" textAnchor="middle" className="text-[9px] font-mono fill-emerald-500/50 tracking-wider">
                NEXOS DE UNIFICACIÓN DE NARRATIVAS
              </text>
            </g>

            {/* Isla 4 (Cuestiones) Anchor Area */}
            <g transform="translate(1250, 680)">
              <path d="M -150,0 C -150,-80 -80,-120 0,-120 C 80,-120 150,-80 150,0 C 150,80 80,120 0,120 C -80,120 -150,80 -150,0 Z" fill="url(#grad-island-cuestiones)" />
              {/* Island Label */}
              <text x="0" y="-85" textAnchor="middle" className="text-[12px] font-mono font-extrabold fill-purple-400/80 tracking-widest uppercase">
                🔮 ISLA DE LAS CUESTIONES
              </text>
              <text x="0" y="-70" textAnchor="middle" className="text-[9px] font-mono fill-purple-500/50 tracking-wider">
                META-ANÁLISIS COGNITIVO
              </text>
            </g>

            {/* ================= MARITIME ROUTES (Decorative dashed lines between islands) ================= */}
            {/* Route 1: Isla 1 to Isla 3 */}
            <path d="M 350 250 Q 500 450 700 550" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="5, 10" fill="none" opacity="0.25" />
            
            {/* Route 2: Isla 2 to Isla 3 */}
            <path d="M 1050 250 Q 900 450 700 550" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="5, 10" fill="none" opacity="0.25" />
            
            {/* Route 3: Isla 1 to Isla 2 */}
            <path d="M 350 250 Q 700 80 1050 250" stroke="#a78bfa" strokeWidth="2.5" strokeDasharray="4, 12" fill="none" opacity="0.2" />

            {/* Route 4: Isla 3 to Isla 4 */}
            <path d="M 700 690 Q 950 740 1250 680" stroke="#a78bfa" strokeWidth="2.5" strokeDasharray="4, 12" fill="none" opacity="0.2" />

            {/* ================= INTERACTIVE TALENT NODES ================= */}
            {nodesData.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isHighlighted = filteredNodes.some(fn => fn.id === node.id);
              const hasSearchActive = searchQuery !== "" || selectedCategory !== "all" || selectedLevel !== "all";
              
              // Visual tuning
              const theme = getCategoryTheme(node.category);
              const nodeRadius = node.level === 5 ? 24 : 16;
              const glowFilter = node.level === 5 ? "url(#master-glow)" : "";
              
              // If there's an active search filter, non-matching nodes will be faded
              const opacityClass = !isHighlighted && hasSearchActive 
                ? "opacity-15 transition-opacity duration-300" 
                : "opacity-100 transition-opacity duration-300";

              return (
                <g 
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className={`interactive-node group cursor-pointer ${opacityClass}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    focusOnNode(node);
                  }}
                >
                  {/* Visual trigger target helper for clicks */}
                  <circle cx="0" cy="0" r={nodeRadius + 24} fill="transparent" />

                  {/* Pulsing targeting ring when selected or targeted via connection */}
                  {(isSelected || pulseNodeId === node.id) && (
                    <circle 
                      cx="0" 
                      cy="0" 
                      r={nodeRadius + 15} 
                      fill="none" 
                      stroke={theme.color} 
                      className="animate-target-pulse origin-center" 
                    />
                  )}

                  {/* Node outer mastery ring */}
                  <circle 
                    cx="0" 
                    cy="0" 
                    r={nodeRadius + 6} 
                    fill="none" 
                    stroke={theme.color} 
                    strokeWidth={node.level === 5 ? 2.5 : 1}
                    strokeDasharray={
                      node.level === 5 ? "none" :
                      node.level === 4 ? "8, 3" :
                      node.level === 3 ? "5, 3" :
                      node.level === 2 ? "3, 3" : "1, 4"
                    }
                    className="group-hover:rotate-45 transition-transform duration-700 ease-out origin-center"
                    opacity={isSelected ? 1 : 0.6}
                  />

                  {/* Tiny circular nodes for level counts in the ring */}
                  {node.level < 5 && Array.from({ length: node.level }).map((_, idx) => {
                    const angle = (idx * 360) / node.level - 90;
                    const rad = (angle * Math.PI) / 180;
                    const px = (nodeRadius + 6) * Math.cos(rad);
                    const py = (nodeRadius + 6) * Math.sin(rad);
                    return (
                      <circle 
                        key={idx}
                        cx={px}
                        cy={py}
                        r="2"
                        fill={theme.color}
                        opacity="0.8"
                      />
                    );
                  })}

                  {/* Base glow under the node */}
                  {node.level === 5 && (
                    <circle 
                      cx="0" 
                      cy="0" 
                      r={nodeRadius + 4} 
                      fill="none" 
                      stroke={theme.color} 
                      strokeWidth="6" 
                      opacity="0.25" 
                      filter="url(#master-glow)"
                    />
                  )}

                  {/* Central Talent Node Circle */}
                  <circle 
                    cx="0" 
                    cy="0" 
                    r={nodeRadius} 
                    fill={isSelected ? theme.color : "#0f172a"} 
                    stroke={theme.color} 
                    strokeWidth={isSelected ? 4 : 2.5}
                    filter={glowFilter}
                    className="group-hover:scale-110 transition-all duration-300 origin-center shadow-lg"
                    style={{
                      // Custom inline property for glow keyframe color
                      ["--glow-color" as any]: theme.color
                    }}
                  />

                  {/* Level text inside central circle */}
                  <text 
                    x="0" 
                    y="4.5" 
                    textAnchor="middle" 
                    className={`text-[10px] font-mono font-black select-none pointer-events-none ${isSelected ? 'fill-slate-950' : 'fill-slate-300'}`}
                  >
                    {node.level === 5 ? "✦" : node.level}
                  </text>

                  {/* Talent Title */}
                  <text 
                    x="0" 
                    y={nodeRadius + 20} 
                    textAnchor="middle" 
                    className={`text-[11px] font-bold select-none pointer-events-none transition-colors duration-200 ${
                      isSelected 
                        ? 'fill-slate-100 font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' 
                        : 'fill-slate-300 group-hover:fill-slate-100'
                    }`}
                  >
                    {node.title}
                  </text>

                  {/* Talent Level Subtitle */}
                  <text 
                    x="0" 
                    y={nodeRadius + 32} 
                    textAnchor="middle" 
                    className="text-[9px] font-mono fill-slate-500 uppercase tracking-widest select-none pointer-events-none"
                  >
                    NIVEL {node.level}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ================= MAP CONTROLS OVERLAY (BOTTOM LEFT) ================= */}
      <div className={`absolute z-10 flex flex-col sm:flex-row items-center gap-2 ui-overlay bg-slate-950/80 backdrop-blur-md p-2 rounded-lg border border-slate-800/80 ${isMobileView ? "bottom-18 left-4 right-4 justify-between" : "bottom-6 left-6"}`}>
        <div className="flex items-center gap-1 w-full sm:w-auto justify-between sm:justify-start">
          <button 
            onClick={zoomIn}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded text-slate-300 transition-colors"
            title="Acercar (Rueda del ratón)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            onClick={zoomOut}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded text-slate-300 transition-colors"
            title="Alejar (Rueda del ratón)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button 
            onClick={fitToScreen}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded text-slate-300 transition-colors"
            title="Ajustar Mapa"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button 
            onClick={resetView}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded text-slate-300 transition-colors"
            title="Restaurar Cámara"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
        
        <span className="hidden sm:inline w-[1px] h-4 bg-slate-800"></span>
        
        <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 px-1">
          <CompassIcon className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: "12s" }} />
          <span>Arrastra • Zoom: {Math.round(scale * 100)}%</span>
        </div>
      </div>

      {/* ================= DETAILED SIDE PANEL (DRAWER) ================= */}
      {selectedNode && (
        <aside 
          className={`absolute top-0 right-0 z-30 bg-slate-950/98 md:bg-slate-950/95 border-l border-slate-800/80 backdrop-blur-lg flex flex-col shadow-2xl transition-all duration-300 ui-overlay overflow-hidden animate-in slide-in-from-right ${
            isMobileView ? "bottom-16 left-0 w-full h-[calc(100%-4rem)]" : "h-full w-full md:w-[480px]"
          }`}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-slate-800/80 bg-slate-950/80 flex flex-col gap-2.5">
            {/* Close buttons */}
            <div className="flex items-center justify-between">
              {/* Back button */}
              <button 
                onClick={() => setSelectedNode(null)}
                className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-slate-100 uppercase tracking-widest cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Cerrar Panel
              </button>
              
              <button 
                onClick={() => setSelectedNode(null)}
                className="p-1.5 hover:bg-slate-900 border border-transparent hover:border-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category / Island name */}
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full border ${getCategoryTheme(selectedNode.category).bg} ${getCategoryTheme(selectedNode.category).text} ${getCategoryTheme(selectedNode.category).border}`}>
                {selectedNode.categoryLabel}
              </span>
              <span className="text-[10px] font-mono text-slate-500">•</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                {selectedNode.levelName}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
              {selectedNode.level === 5 && <Award className="w-6 h-6 text-amber-400 animate-pulse" />}
              {selectedNode.title}
            </h2>

            {/* Summary */}
            <p className="text-xs text-slate-400 leading-relaxed italic bg-slate-900/50 p-2.5 rounded border border-slate-850">
              "{selectedNode.summary}"
            </p>

            {/* Mastery Level Progression Indicator */}
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                <span>Progreso de Revelación</span>
                <span className="font-bold text-slate-300">Nivel {selectedNode.level} de 5</span>
              </div>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const isUnlocked = idx < selectedNode.level;
                  const theme = getCategoryTheme(selectedNode.category);
                  return (
                    <div 
                      key={idx}
                      className="flex-1 h-2 rounded transition-all duration-300"
                      style={{
                        backgroundColor: isUnlocked ? theme.color : "#1e293b",
                        boxShadow: isUnlocked && selectedNode.level === 5 ? `0 0 10px ${theme.color}` : "none"
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Tab 1: One Piece Perspective */}
            <section className="space-y-2.5">
              <h3 className="text-xs font-mono font-extrabold tracking-wider text-sky-400 uppercase flex items-center gap-2 pb-1 border-b border-sky-950/50">
                <Skull className="w-4 h-4 text-sky-400" /> 📖 En One Piece (Ficción)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-sky-950/10 p-3 rounded border border-sky-950/30">
                {selectedNode.inOnePiece}
              </p>
            </section>

            {/* Tab 2: Real World Perspective */}
            <section className="space-y-2.5">
              <h3 className="text-xs font-mono font-extrabold tracking-wider text-amber-400 uppercase flex items-center gap-2 pb-1 border-b border-amber-950/50">
                <Globe className="w-4 h-4 text-amber-400" /> 🌍 En el Mundo Real (Historia / Conspiración)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-amber-950/10 p-3 rounded border border-amber-950/30">
                {selectedNode.inRealWorld}
              </p>
            </section>

            {/* Tab 3: Evidences List */}
            <section className="space-y-2.5">
              <h3 className="text-xs font-mono font-extrabold tracking-wider text-emerald-400 uppercase flex items-center gap-2 pb-1 border-b border-emerald-950/50">
                <Eye className="w-4 h-4 text-emerald-400" /> 🔍 Evidencias y Pistas Clave
              </h3>
              <ul className="space-y-2">
                {selectedNode.evidence.map((item, idx) => (
                  <li 
                    key={idx} 
                    className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed"
                  >
                    <span className="p-0.5 bg-emerald-950 text-emerald-400 rounded-full border border-emerald-900 mt-0.5">
                      <CheckCircle className="w-3 h-3 flex-shrink-0" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Tab 4: Cross Connections (INTERACTIVE NAVIGATOR) */}
            <section className="space-y-2.5">
              <h3 className="text-xs font-mono font-extrabold tracking-wider text-purple-400 uppercase flex items-center gap-2 pb-1 border-b border-purple-950/50">
                <Link2 className="w-4 h-4 text-purple-400" /> 🔗 Conexiones Cruzadas (Puente Multidisciplinar)
              </h3>
              {selectedNode.crossConnections.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {selectedNode.crossConnections.map((conn) => {
                    // Find actual node to gather metadata if needed
                    const targetNode = nodesData.find(n => n.id === conn.id);
                    const isTargetFound = !!targetNode;
                    const destTheme = targetNode ? getCategoryTheme(targetNode.category) : { color: "#a78bfa" };
                    
                    return (
                      <button
                        key={conn.id}
                        onClick={() => {
                          if (targetNode) {
                            focusOnNode(targetNode);
                          }
                        }}
                        disabled={!isTargetFound}
                        className="w-full text-left p-3 rounded bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3 group transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-slate-200 group-hover:text-slate-100 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: destTheme.color }}></span>
                            {conn.label}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                            Isla Destino: {conn.family}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-transform group-hover:translate-x-1" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[11px] font-mono text-slate-500 italic">No se registran conexiones cruzadas de nivel inferior para este nodo.</p>
              )}
            </section>

            {/* Critical Speculation Banner */}
            <section className="p-3.5 bg-red-950/20 border border-red-900/40 rounded-lg space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-red-400" /> Nota Crítica de Seguridad
              </div>
              <p className="text-[11px] text-red-200/90 leading-relaxed">
                {selectedNode.criticalNote}
              </p>
            </section>

            {/* Tags Pillbox */}
            <section className="pt-2 flex flex-wrap gap-1.5">
              {selectedNode.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded"
                >
                  <Tag className="w-3 h-3 text-slate-500" />
                  {tag}
                </span>
              ))}
            </section>
          </div>
        </aside>
      )}

      {/* ================= INSTRUCTIONS MANUAL / INTRO MODAL ================= */}
      {showHelpModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-slate-900/95 border border-slate-800 rounded-xl p-6 md:p-8 shadow-2xl shadow-black relative flex flex-col gap-4 overflow-y-auto max-h-[90vh]">
            <button 
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-800 border border-transparent hover:border-slate-700 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 bg-sky-500/10 rounded-lg text-sky-400 border border-sky-500/30">
                <Compass className="w-6 h-6 text-sky-400 animate-slow-spin" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-sky-400 to-amber-300 bg-clip-text text-transparent">
                  MANUAL DEL DESCUBRIDOR
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Guía de navegación del Oráculo de Verdades Paralelas
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs md:text-sm text-slate-300 leading-relaxed">
              <p>
                Bienvenido al <strong>Oráculo Oculto</strong>, un mapa interactivo diseñado estilo árbol de talentos RPG (inspirado en Skyrim y Path of Exile). Este mapa traza un puente reflexivo, histórico y geopolítico entre el canon de misterios del manga <strong>One Piece</strong> (de Eiichiro Oda) y las teorías, enigmas y supresiones arqueológicas de nuestro <strong>Mundo Real</strong>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-lg space-y-2">
                  <h4 className="font-bold text-sky-400 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4" /> Controles del Mapa
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
                    <li>• <strong className="text-slate-300">Arrastrar:</strong> Clic izquierdo + mover ratón para desplazarte.</li>
                    <li>• <strong className="text-slate-300">Zoom:</strong> Usa la rueda del ratón o los botones (+/-) abajo a la izquierda.</li>
                    <li>• <strong className="text-slate-300">Explorar:</strong> Haz clic en cualquier nodo para abrir su panel.</li>
                    <li>• <strong className="text-slate-300">Buscar:</strong> Filtra arriba por palabras clave o categorías.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-lg space-y-2">
                  <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Layers className="w-4 h-4" /> Familias / Islas
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
                    <li>• <span className="text-sky-400">🏴‍☠️ GRAND LINE:</span> Canon, misterios e historia del universo de One Piece.</li>
                    <li>• <span className="text-amber-400">🌍 MUNDO REAL:</span> Hechos geopolíticos, megalitismo e hitos históricos silenciados.</li>
                    <li>• <span className="text-emerald-400">🌉 PUENTES:</span> Nodos de confluencia y unificación cognitiva.</li>
                    <li>• <span className="text-purple-400">🔮 META:</span> Cuestionamiento y sesgo epistemológico de patrones.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-sky-950/10 border border-sky-900/30 rounded-lg space-y-2">
                <h4 className="font-bold text-sky-300 flex items-center gap-1.5">
                  <Link2 className="w-4 h-4" /> Las Conexiones Cruzadas (Vínculo Interactivo)
                </h4>
                <p className="text-xs text-slate-400">
                  Las líneas de conexión <strong>no aparecen en el mapa general</strong> para evitar saturación visual. Sin embargo, al hacer clic en un nodo de conocimiento, se revelarán sus conexiones disciplinares cruzadas en el panel lateral. Al pulsar sobre cualquier conexión, la cámara del Oráculo se trasladará con un vuelo automatizado hasta la isla correspondiente para revelar el nuevo nodo secreto.
                </p>
              </div>

              <div className="p-4 bg-red-950/10 border border-red-900/30 rounded-lg space-y-1">
                <h4 className="font-bold text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Descargo de Responsabilidad Crítica
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Todo el material expuesto en este oráculo (especialmente los nexos entre One Piece y el Mundo Real) se presenta con fines de análisis de narrativas literarias, creatividad artística y entretenimiento. Las notas se marcan explícitamente como <strong>ESPECULATIVAS</strong> y bajo reserva reflexiva individual.
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-6 py-2 bg-gradient-to-r from-sky-600 to-amber-500 hover:from-sky-500 hover:to-amber-400 text-slate-100 font-bold text-xs uppercase tracking-widest rounded shadow-lg shadow-sky-950/40 cursor-pointer transition-all duration-200"
              >
                Iniciar Navegación del Oráculo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= OHARA ACADEMY PANE ================= */}
      {showAcademy && (
        <div className={`absolute right-0 z-40 bg-slate-950/40 backdrop-blur-md flex justify-end animate-in slide-in-from-right duration-300 w-full ${isMobileView ? "bottom-16 top-0 h-[calc(100%-4rem)]" : "inset-y-0 sm:w-auto"}`}>
          <div className={`h-full bg-[#030712] border-l border-slate-800 shadow-2xl flex flex-col ${isMobileView ? "w-full" : "w-full sm:w-[540px] md:w-[640px] lg:w-[680px]"}`}>
            <OharaAcademy 
              onFocusNode={(nodeId) => {
                const node = nodesData.find(n => n.id === nodeId);
                if (node) {
                  focusOnNode(node);
                }
              }} 
              onClose={() => setShowAcademy(false)} 
            />
          </div>
        </div>
      )}

      {/* ================= COFRE DE TESOROS PANE ================= */}
      {showTreasureChest && (
        <div className={`absolute right-0 z-40 bg-slate-950/40 backdrop-blur-md flex justify-end animate-in slide-in-from-right duration-300 w-full ${isMobileView ? "bottom-16 top-0 h-[calc(100%-4rem)]" : "inset-y-0 sm:w-auto"}`}>
          <div className={`h-full bg-[#030712] border-l border-slate-800 shadow-2xl flex flex-col ${isMobileView ? "w-full" : "w-full sm:w-[540px] md:w-[640px] lg:w-[680px]"}`}>
            <TreasureChestPanel
              userProgress={userProgress}
              onOpenRegister={() => {
                setShowTreasureChest(false);
                setShowAcademy(true);
              }}
              onClose={() => setShowTreasureChest(false)}
            />
          </div>
        </div>
      )}

      {/* ================= OHARA MINIGAME OVERLAY ================= */}
      {activeGame && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl h-[90vh] max-h-[700px] bg-[#030712] border border-purple-900/60 rounded-xl shadow-2xl shadow-purple-950/40 overflow-hidden flex flex-col">
            <OharaMinigames
              userProgress={userProgress}
              onSaveProgress={handleSaveProgress}
              activeGame={activeGame}
              onCloseGame={() => setActiveGame(null)}
              onOpenRegister={() => {
                setActiveGame(null);
                setShowAcademy(true);
              }}
            />
          </div>
        </div>
      )}

      {/* ================= ANOMALY DETECTION NOTIFICATION ================= */}
      {anomalyAlert && (
        <div className={`absolute left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-md bg-gradient-to-r from-purple-950 to-indigo-950 border-2 border-purple-500 rounded-lg shadow-2xl shadow-purple-950/80 p-4 animate-bounce md:animate-pulse ${isMobileView ? "bottom-36" : "bottom-24"}`}>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-900/50 border border-purple-400/30 rounded-full animate-pulse text-purple-400">
              <Radio className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block tracking-wider animate-pulse">📡 SEÑAL ELECTROMAGNÉTICA CAPTADA</span>
              <h4 className="text-xs font-bold text-slate-100 truncate mt-0.5">{anomalyAlert.name}</h4>
              <p className="text-[11px] text-purple-300 mt-1 line-clamp-2">
                {anomalyAlert.payload.clue || 'Se ha detectado una fluctuación de frecuencia en este sector. ¿Deseas descifrar el misterio para asegurar el tesoro histórico?'}
              </p>
              <div className="flex gap-2.5 mt-3 justify-end">
                <button
                  onClick={() => setAnomalyAlert(null)}
                  className="px-2.5 py-1 text-[10px] text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded font-semibold cursor-pointer"
                >
                  Ignorar
                </button>
                <button
                  onClick={() => {
                    setActiveGame(anomalyAlert);
                    setAnomalyAlert(null);
                  }}
                  className="px-3.5 py-1 bg-purple-600 hover:bg-purple-500 text-slate-100 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-purple-900/50 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Decodificar</span>
                </button>
              </div>
            </div>
            <button 
              onClick={() => setAnomalyAlert(null)} 
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= ORONCE FINE 3D COLLABORATIVE MAP ================= */}
      {showOronceMap && (
        <div className={`absolute z-40 bg-[#020617] ${isMobileView ? "bottom-16 top-0 left-0 right-0 h-[calc(100%-4rem)] p-2" : "inset-0 p-2 md:p-4"}`}>
          <OronceFineMap
            userProgress={userProgress}
            onClose={() => setShowOronceMap(false)}
            onSaveProgress={handleSaveProgress}
          />
        </div>
      )}

      {/* ================= ARCHAEOLOGIST PORTAL OVERLAY ================= */}
      {showPortal && (
        <div className={`absolute z-40 bg-slate-950/90 backdrop-blur-md ${isMobileView ? "bottom-16 top-0 left-0 right-0 h-[calc(100%-4rem)] flex items-center justify-center p-2" : "inset-0 flex items-center justify-center p-4"}`}>
          <ArchaeologistPortal
            userProgress={userProgress}
            onClose={() => setShowPortal(false)}
            onSaveProgress={handleSaveProgress}
          />
        </div>
      )}

      {/* ================= MOBILE VIEW TOGGLE OVERWRITE ================= */}
      {!isAndroidApp && (
        <button
          onClick={() => setIsMobileView(prev => !prev)}
          className={`absolute ${isMobileView ? "bottom-18 right-4" : "bottom-6 right-6"} z-30 px-2.5 py-1.5 rounded-md border text-[10px] font-bold uppercase tracking-wider font-mono shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
            isMobileView 
              ? "bg-slate-950/90 border-slate-800 text-slate-300 hover:text-slate-100" 
              : "bg-slate-900/90 hover:bg-slate-900 border-slate-800 hover:border-slate-700 text-amber-400"
          }`}
          title="Alternar entre versión móvil y ordenador"
        >
          {isMobileView ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-sky-400" />
              <span>Modo Ordenador</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>Modo Móvil</span>
            </>
          )}
        </button>
      )}

      {/* ================= MOBILE BOTTOM NAVIGATION DOCK ================= */}
      {isMobileView && (
        <nav className="absolute bottom-0 left-0 right-0 h-16 bg-slate-950 border-t border-slate-800/80 flex items-center justify-around px-2 z-40 ui-overlay">
          {/* Tab 1: Árbol */}
          <button
            onClick={() => {
              // Close all overlays to show the talent tree
              setShowAcademy(false);
              setShowTreasureChest(false);
              setShowOronceMap(false);
              setShowPortal(false);
              setSelectedNode(null);
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors cursor-pointer ${
              !showAcademy && !showTreasureChest && !showOronceMap && !showPortal
                ? "text-sky-400"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-semibold tracking-wide">Árbol</span>
          </button>

          {/* Tab 2: Academia */}
          <button
            onClick={() => {
              setShowAcademy(true);
              setShowTreasureChest(false);
              setShowOronceMap(false);
              setShowPortal(false);
              setSelectedNode(null);
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors cursor-pointer ${
              showAcademy ? "text-purple-400" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <BookOpen className="w-5 h-5 mb-0.5 animate-pulse" />
            <span className="text-[9px] font-semibold tracking-wide">Academia</span>
          </button>

          {/* Tab 3: Tesoros */}
          <button
            onClick={() => {
              setShowTreasureChest(true);
              setShowAcademy(false);
              setShowOronceMap(false);
              setShowPortal(false);
              setSelectedNode(null);
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors cursor-pointer relative ${
              showTreasureChest ? "text-amber-400" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <Trophy className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-semibold tracking-wide">Tesoros</span>
            {(userProgress?.discoveredTreasures?.length ?? 0) > 0 && (
              <span className="absolute top-1.5 right-6 bg-amber-500 text-slate-950 font-mono text-[8px] font-extrabold px-1 rounded-full leading-none h-3.5 min-w-3.5 flex items-center justify-center animate-pulse">
                {userProgress?.discoveredTreasures?.length}
              </span>
            )}
          </button>

          {/* Tab 4: Mesa 3D */}
          <button
            onClick={() => {
              setShowOronceMap(true);
              setShowAcademy(false);
              setShowTreasureChest(false);
              setShowPortal(false);
              setSelectedNode(null);
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors cursor-pointer ${
              showOronceMap ? "text-emerald-400" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <Globe className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-semibold tracking-wide">Mesa 3D</span>
          </button>

          {/* Tab 5: Bitácora */}
          <button
            onClick={() => {
              setShowPortal(true);
              setShowAcademy(false);
              setShowTreasureChest(false);
              setShowOronceMap(false);
              setSelectedNode(null);
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center relative transition-colors cursor-pointer ${
              showPortal ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-semibold tracking-wide">Bitácora</span>
            {userProgress && (
              <span className="absolute top-1 right-3 bg-indigo-500/30 text-indigo-300 font-mono text-[7px] font-bold px-0.5 rounded border border-indigo-500/40">
                {userProgress.restorationPoints}
              </span>
            )}
          </button>
        </nav>
      )}
    </div>
  );
}
