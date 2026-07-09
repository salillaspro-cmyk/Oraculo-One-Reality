import { useState, useEffect } from "react";
import { 
  Trophy, Skull, Shield, Zap, Search, HelpCircle, X, RotateCcw, 
  Activity, Radio, Compass, Lock, CheckCircle2, Sliders, Layers, Eye, Award, Sparkles
} from "lucide-react";
import { UserProgress, DiscoveredTreasure } from "../data/courses";

// ================= TYPES & INTERFACES =================

export interface ActiveGame {
  id: string;
  name: string;
  type: 'comun' | 'unico';
  topic: string;
  gameType: 'cipher' | 'rotate' | 'sonar' | 'riddle';
  difficulty: 'Fácil' | 'Medio' | 'Difícil' | 'Leyenda';
  points: number;
  payload: any; // Game-specific settings
}

interface OharaMinigamesProps {
  userProgress: UserProgress | null;
  onSaveProgress: (updated: UserProgress) => void;
  activeGame: ActiveGame | null;
  onCloseGame: () => void;
  onOpenRegister: () => void;
}

// ================= PREDEFINED COMMON MINI-GAMES =================

export const COMMON_GAMES: ActiveGame[] = [
  {
    id: "cg_joyboy",
    name: "La Frecuencia de Joy Boy",
    type: "comun",
    topic: "La disculpa del Siglo Vacío",
    gameType: "cipher",
    difficulty: "Medio",
    points: 150,
    payload: {
      ciphertext: "SURPHWR YROYHU SDUD OOHYDU D QRDK D OD VXSHUILFLH",
      plaintext: "PROMETO VOLVER PARA LLEVAR A NOAH A LA SUPERFICIE",
      shift: 3,
      clue: "Desplaza las runas 3 posiciones hacia atrás en el dial para decodificar la promesa rota."
    }
  },
  {
    id: "cg_cland",
    name: "El Pacto del Clan D",
    type: "comun",
    topic: "El testamento de la media luna",
    gameType: "rotate",
    difficulty: "Fácil",
    points: 100,
    payload: {
      initialAngles: [90, 180, 270],
      symbols: ["👒", "🌙", "🌊"],
      meaning: "La alineación de las tres voluntades: la libertad, el amanecer y los océanos libres."
    }
  },
  {
    id: "cg_dragon_triangle",
    name: "Anomalía del Triángulo del Dragón",
    type: "comun",
    topic: "El Florian Triangle del Pacífico",
    gameType: "sonar",
    difficulty: "Difícil",
    points: 200,
    payload: {
      targetRow: 1,
      targetCol: 3,
      targetDepth: 4200, // meters
      clue: "Frecuencia magnética anómala detectada en el abismo del Pacífico Occidental a más de 4,000 metros."
    }
  },
  {
    id: "cg_sun_nika",
    name: "El Jeroglífico de Nika",
    type: "comun",
    topic: "Tambores del Amanecer en la Tierra",
    gameType: "riddle",
    difficulty: "Medio",
    points: 120,
    payload: {
      question: "¿Qué figura mitológica de nuestro mundo resuena con la risa liberadora, los tambores rítmicos y el quiebre de cadenas, similar al Dios del Sol Nika?",
      options: [
        "Apolo, el ordenador solar del Imperio Romano",
        "El dios mítico Bochica y el mito de la música alegre de los Muiscas",
        "Loki, el tramposo de la mitología nórdica",
        "Amaterasu, la deidad recluida en la cueva oscura"
      ],
      correctAnswer: 1,
      explanation: "Bochica y otras deidades de la liberación precolombinas representaban el baile colectivo, la risa sagrada y la sanación musical como resistencia ante dictaduras opresivas."
    }
  },
  {
    id: "cg_yonaguni",
    name: "Las Escaleras Sumergidas de Yonaguni",
    type: "comun",
    topic: "El Wano Hundido Real",
    gameType: "sonar",
    difficulty: "Medio",
    points: 150,
    payload: {
      targetRow: 4,
      targetCol: 2,
      targetDepth: 25,
      clue: "Estructuras megalíticas perfectamente talladas cerca de la costa de Okinawa, sumergidas a escasos metros."
    }
  },
  {
    id: "cg_vegapunk_leak",
    name: "La Frecuencia de Vegapunk",
    type: "comun",
    topic: "El mensaje apocalíptico",
    gameType: "cipher",
    difficulty: "Difícil",
    points: 220,
    payload: {
      ciphertext: "JQ RZSI T XJ JXYF MZSINFSI T JS JQ THJFST",
      plaintext: "EL MUNDO SE ESTA HUNDIENDO EN EL OCEANO",
      shift: 5,
      clue: "Vegapunk interceptó esta frecuencia cifrada con factor 5. Ajusta el decodificador para revelar el destino mundial."
    }
  }
];

// ================= PROCEDURAL GENERATOR FOR UNIQUE GAMES =================

export function generateUniqueGame(topic: string): ActiveGame {
  const sanitizedTopic = topic.trim() || "Isla Desconocida";
  const gameTypes: ('cipher' | 'rotate' | 'sonar' | 'riddle')[] = ['cipher', 'rotate', 'sonar', 'riddle'];
  const chosenType = gameTypes[Math.floor(Math.random() * gameTypes.length)];
  const difficultyOptions: ('Fácil' | 'Medio' | 'Difícil' | 'Leyenda')[] = ['Fácil', 'Medio', 'Difícil'];
  const difficulty = difficultyOptions[Math.floor(Math.random() * difficultyOptions.length)];
  
  let points = 150;
  if (difficulty === 'Fácil') points = 100;
  if (difficulty === 'Difícil') points = 250;

  let payload: any = {};

  if (chosenType === 'cipher') {
    const shift = Math.floor(Math.random() * 5) + 2; // Shift of 2 to 6
    const originalText = `EL SECRETO DE ${sanitizedTopic.toUpperCase()} RESUENA HOY`;
    
    // Simple Caesar cipher helper for Spanish characters
    const cipherText = originalText.split('').map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) { // A-Z
        let nextCode = code + shift;
        if (nextCode > 90) nextCode = 65 + (nextCode - 91);
        return String.fromCharCode(nextCode);
      }
      return char;
    }).join('');

    payload = {
      ciphertext: cipherText,
      plaintext: originalText,
      shift: shift,
      clue: `La resonancia magnética de ${sanitizedTopic} requiere un desfase de ${shift} en la frecuencia electromagnética local.`
    };
  } 
  else if (chosenType === 'rotate') {
    const symbols = ["⚓", "👁️", "⚔️", "👑", "🔮"].sort(() => 0.5 - Math.random()).slice(0, 3);
    payload = {
      initialAngles: [45, 135, 225].map(a => a + (Math.floor(Math.random() * 3) * 90)),
      symbols: symbols,
      meaning: `Sincronización de los campos magnéticos y corrientes marinas ocultas que rodean la isla de ${sanitizedTopic}.`
    };
  } 
  else if (chosenType === 'sonar') {
    payload = {
      targetRow: Math.floor(Math.random() * 6),
      targetCol: Math.floor(Math.random() * 6),
      targetDepth: Math.floor(Math.random() * 8000) + 100, // 100m to 8100m
      clue: `Buscador de anomalías acústicas sumergidas en los alrededores arqueológicos de ${sanitizedTopic}.`
    };
  } 
  else { // riddle
    payload = {
      question: `¿Cómo se conecta el misterio de ${sanitizedTopic} con las dinastías del Siglo Vacío de One Piece y los arqueólogos prohibidos de nuestro mundo?`,
      options: [
        `Mediante registros borrados por censura inquisitoria de reyes medievales.`,
        `A través de corrientes electromagnéticas que bloquean brújulas y mapas satelitales.`,
        `Por contener un fragmento de verdad que refuta el origen canónico del poder actual.`,
        `Todas las opciones anteriores son correctas en este plano.`
      ],
      correctAnswer: 3,
      explanation: `Efectivamente, ${sanitizedTopic} comparte con la trama de Eiichiro Oda el patrón universal de censura histórica, perturbaciones geomagnéticas y la conservación obstinada de verdades prohibidas.`
    };
  }

  return {
    id: `ug_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    name: `Misterio Único: ${sanitizedTopic}`,
    type: "unico",
    topic: sanitizedTopic,
    gameType: chosenType,
    difficulty: difficulty,
    points: points,
    payload: payload
  };
}

// ================= COMPONENT IMPLEMENTATION =================

export default function OharaMinigames({ 
  userProgress, 
  onSaveProgress, 
  activeGame, 
  onCloseGame, 
  onOpenRegister 
}: OharaMinigamesProps) {

  // --- STATE FOR GAMEPLAY ---
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // 1. Cipher state
  const [cipherInputShift, setCipherInputShift] = useState<number>(0);
  const [cipherCurrentDecryption, setCipherCurrentDecryption] = useState<string>("");

  // 2. Rotate state
  const [rotateAngles, setRotateAngles] = useState<number[]>([0, 0, 0]);

  // 3. Sonar state
  const [sonarGrid, setSonarGrid] = useState<string[][]>(
    Array(6).fill(null).map(() => Array(6).fill("unknown")) // unknown, cold, warm, hot, success
  );
  const [sonarInputDepth, setSonarInputDepth] = useState<number>(2000);
  const [sonarTries, setSonarTries] = useState<number>(0);
  const [sonarSelectedCell, setSonarSelectedCell] = useState<{r: number, c: number} | null>(null);

  // 4. Riddle state
  const [riddleSelectedOption, setRiddleSelectedOption] = useState<number | null>(null);
  const [riddleIsSubmitted, setRiddleIsSubmitted] = useState<boolean>(false);
  const [riddleIsCorrect, setRiddleIsCorrect] = useState<boolean>(false);

  // Initialize game states when activeGame changes
  useEffect(() => {
    if (!activeGame) return;
    setSuccessMessage(null);

    if (activeGame.gameType === 'cipher') {
      setCipherInputShift(0);
      setCipherCurrentDecryption(activeGame.payload.ciphertext);
    } 
    else if (activeGame.gameType === 'rotate') {
      setRotateAngles([...activeGame.payload.initialAngles]);
    } 
    else if (activeGame.gameType === 'sonar') {
      setSonarGrid(Array(6).fill(null).map(() => Array(6).fill("unknown")));
      setSonarInputDepth(3000);
      setSonarTries(0);
      setSonarSelectedCell(null);
    } 
    else if (activeGame.gameType === 'riddle') {
      setRiddleSelectedOption(null);
      setRiddleIsSubmitted(false);
      setRiddleIsCorrect(false);
    }
  }, [activeGame]);

  // Handle cipher sliding
  useEffect(() => {
    if (!activeGame || activeGame.gameType !== 'cipher') return;
    const shift = cipherInputShift;
    const cipherText = activeGame.payload.ciphertext;

    // Shift back by the selected input factor
    const decoded = cipherText.split('').map((char: string) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        let nextCode = code - shift;
        if (nextCode < 65) nextCode = 91 - (65 - nextCode);
        return String.fromCharCode(nextCode);
      }
      return char;
    }).join('');

    setCipherCurrentDecryption(decoded);
  }, [cipherInputShift, activeGame]);

  // --- SUBMIT GAME SUCCESS ---
  const handleGameComplete = () => {
    if (!activeGame) return;

    // Create treasure item to store
    const newTreasure: DiscoveredTreasure = {
      id: activeGame.id,
      name: activeGame.name,
      type: activeGame.type,
      date: new Date().toLocaleDateString("es-ES"),
      topic: activeGame.topic,
      description: activeGame.gameType === 'cipher' 
        ? `Decodificado: "${activeGame.payload.plaintext}"` 
        : activeGame.gameType === 'sonar' 
        ? `Coordenadas aseguradas a ${activeGame.payload.targetDepth} metros de profundidad.`
        : activeGame.gameType === 'rotate' 
        ? `Runa sincronizada: ${activeGame.payload.meaning}`
        : `Enigma resuelto sobre ${activeGame.topic}.`,
      restorationPointsAwarded: activeGame.points
    };

    let updatedProgress: UserProgress;

    if (userProgress) {
      // Check if already unlocked to prevent duplicate points
      const alreadyHas = userProgress.discoveredTreasures?.some(t => t.id === activeGame.id) || false;
      const currentTreasures = userProgress.discoveredTreasures || [];
      const updatedTreasures = alreadyHas ? currentTreasures : [...currentTreasures, newTreasure];
      
      updatedProgress = {
        ...userProgress,
        restorationPoints: userProgress.restorationPoints + (alreadyHas ? 0 : activeGame.points),
        discoveredTreasures: updatedTreasures
      };
      onSaveProgress(updatedProgress);
    } else {
      // If user has no account, save in a guest temporary storage or state
      // but warn the user that they should create an account to save!
      const tempProgressKey = "ohara_guest_treasures";
      let guestTreasures: DiscoveredTreasure[] = [];
      try {
        guestTreasures = JSON.parse(localStorage.getItem(tempProgressKey) || "[]");
      } catch (e) {}
      if (!guestTreasures.some(t => t.id === activeGame.id)) {
        guestTreasures.push(newTreasure);
        localStorage.setItem(tempProgressKey, JSON.stringify(guestTreasures));
      }
    }

    setSuccessMessage(`¡FELICIDADES! Has descifrado el misterio y añadido el tesoro: "${activeGame.name}" a tu mochila.`);
  };

  // --- CIPHER SUBMIT ---
  const verifyCipher = () => {
    if (!activeGame) return;
    if (cipherCurrentDecryption.trim() === activeGame.payload.plaintext.trim()) {
      handleGameComplete();
    } else {
      // Small feedback
      const alertDiv = document.getElementById("cipher-feedback");
      if (alertDiv) {
        alertDiv.classList.remove("hidden");
        setTimeout(() => alertDiv.classList.add("hidden"), 1500);
      }
    }
  };

  // --- ROTATE SUBMIT ---
  const handleRotateRing = (index: number) => {
    if (successMessage) return;
    const newAngles = [...rotateAngles];
    newAngles[index] = (newAngles[index] + 90) % 360;
    setRotateAngles(newAngles);

    // Check if all are 0 or aligned perfectly
    if (newAngles.every(angle => angle === 0)) {
      setTimeout(() => {
        handleGameComplete();
      }, 500);
    }
  };

  // --- SONAR SUBMIT ---
  const handlePingSonarCell = (row: number, col: number) => {
    if (successMessage || !activeGame) return;
    const targetR = activeGame.payload.targetRow;
    const targetC = activeGame.payload.targetCol;
    const targetD = activeGame.payload.targetDepth;

    setSonarSelectedCell({ r: row, c: col });
    setSonarTries(prev => prev + 1);

    // Calculate Manhattan distance on grid
    const dist = Math.abs(row - targetR) + Math.abs(col - targetC);
    const depthDiff = Math.abs(sonarInputDepth - targetD);

    const newGrid = [...sonarGrid];
    
    if (dist === 0 && depthDiff <= 500) {
      newGrid[row][col] = "success";
      setSonarGrid(newGrid);
      handleGameComplete();
    } else {
      // Determine proximity style
      let cellStatus = "cold";
      if (dist === 0 && depthDiff > 500) {
        cellStatus = "depth_error"; // Correct spot, wrong depth!
      } else if (dist <= 1) {
        cellStatus = "hot";
      } else if (dist <= 2) {
        cellStatus = "warm";
      }
      
      newGrid[row][col] = cellStatus;
      setSonarGrid(newGrid);
    }
  };

  // --- RIDDLE SUBMIT ---
  const submitRiddleAnswer = () => {
    if (riddleSelectedOption === null || !activeGame) return;
    setRiddleIsSubmitted(true);
    const correct = riddleSelectedOption === activeGame.payload.correctAnswer;
    setRiddleIsCorrect(correct);

    if (correct) {
      handleGameComplete();
    }
  };

  if (!activeGame) return null;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#030712] text-slate-100 overflow-y-auto" id="ohara-minigame-container">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-purple-950/40 bg-purple-950/10">
        <div className="flex items-center gap-2">
          <Skull className="w-5 h-5 text-purple-400 animate-pulse" />
          <div>
            <span className="text-[10px] font-mono uppercase text-purple-400 tracking-wider font-semibold">
              Anomalía Detectada ({activeGame.type === 'comun' ? 'Común 60%' : 'Única 30%'})
            </span>
            <h2 className="text-sm font-bold text-slate-200">{activeGame.name}</h2>
          </div>
        </div>
        <button 
          onClick={onCloseGame}
          className="p-1 hover:bg-slate-950/60 text-slate-400 hover:text-slate-100 rounded-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* GAME CONTENT */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        
        {/* SUCCESS STATE OVERLAY */}
        {successMessage ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 bg-purple-950/10 border border-purple-900/40 rounded-lg animate-in fade-in zoom-in-95 duration-300">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full animate-pulse"></div>
              <Award className="w-16 h-16 text-yellow-400 relative z-10" />
            </div>
            <h3 className="text-lg font-bold text-yellow-400 mb-2">¡MISTERIO DEVELADO!</h3>
            <p className="text-sm text-slate-300 max-w-md leading-relaxed mb-6">
              {successMessage}
            </p>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-md mb-6 w-full max-w-sm text-left">
              <span className="text-[10px] font-mono uppercase text-sky-400 block mb-1">Evidencia Arqueológica</span>
              <p className="text-xs text-slate-400 leading-relaxed italic">
                {activeGame.gameType === 'cipher' && activeGame.payload.plaintext}
                {activeGame.gameType === 'riddle' && activeGame.payload.explanation}
                {activeGame.gameType === 'rotate' && activeGame.payload.meaning}
                {activeGame.gameType === 'sonar' && `Señal de sónar confirmada. Anomalía térmica detectada a ${activeGame.payload.targetDepth} metros. Encaja con los templos sumergidos de la civilización perdida.`}
              </p>
            </div>
            
            <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded text-xs font-mono mb-6">
              <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span>+{activeGame.points} Puntos de Restauración</span>
            </div>

            {!userProgress && (
              <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded text-xs max-w-md">
                ⚠️ <strong>Nota de Ohara:</strong> Estás jugando como Arqueólogo Anónimo. Para guardar este tesoro de manera permanente en tu cofre, por favor crea tu Perfil de Disidente.
                <button 
                  onClick={() => {
                    onCloseGame();
                    onOpenRegister();
                  }}
                  className="block mt-2 font-bold underline text-amber-200 hover:text-amber-100"
                >
                  Registrar mi Cuenta de Ohara
                </button>
              </div>
            )}

            <button
              onClick={onCloseGame}
              className="px-6 py-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-slate-100 text-xs font-bold uppercase tracking-wider rounded shadow-md cursor-pointer transition-all"
            >
              Cerrar y Reanudar Viaje
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between">
            
            {/* LORE CLUE BOX */}
            <div className="p-3 bg-slate-950/80 border border-purple-950/30 rounded-md mb-4 text-xs">
              <div className="flex items-center gap-2 mb-1.5">
                <Compass className="w-4 h-4 text-purple-400" />
                <span className="font-semibold text-purple-300">Contexto y Coordenadas del Secreto:</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                {activeGame.payload.clue || `Debes sincronizar las frecuencias perdidas de ${activeGame.topic} para revelar la verdad censurada por el Gobierno Mundial.`}
              </p>
            </div>

            {/* --- GAME INTERFACES --- */}
            
            {/* 1. CIPHER INTERFACE */}
            {activeGame.gameType === 'cipher' && (
              <div className="flex-1 flex flex-col justify-center gap-6 p-2">
                <div className="text-center">
                  <span className="text-[10px] font-mono text-slate-500 block mb-2 uppercase tracking-widest">Texto Criptografiado en Poneglyph</span>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded font-mono text-center select-all tracking-wider text-sm text-purple-400 max-h-24 overflow-y-auto break-all">
                    {activeGame.payload.ciphertext}
                  </div>
                </div>

                <div className="text-center py-2">
                  <span className="text-[10px] font-mono text-slate-500 block mb-2 uppercase tracking-widest">Resultado de la Descompresión Lineal</span>
                  <div className="p-4 bg-purple-950/10 border border-purple-900/30 rounded font-mono text-center select-all tracking-wider text-md text-amber-300 font-bold max-h-24 overflow-y-auto break-all">
                    {cipherCurrentDecryption}
                  </div>
                </div>

                {/* Caesar slider */}
                <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-slate-300">Rotación del Anillo (Cifrado César):</label>
                    <span className="text-xs font-mono font-bold text-sky-400">Factor: {cipherInputShift}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="1"
                    value={cipherInputShift}
                    onChange={(e) => setCipherInputShift(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>Alineado (0)</span>
                    <span>Desfase Máximo (15)</span>
                  </div>
                </div>

                {/* Feedback Error */}
                <div id="cipher-feedback" className="hidden text-center text-xs font-mono text-red-400 animate-pulse">
                  ❌ Error: Interferencia detectada. Ajusta el dial del desfase.
                </div>
              </div>
            )}

            {/* 2. ROTATE INTERFACE */}
            {activeGame.gameType === 'rotate' && (
              <div className="flex-1 flex flex-col items-center justify-center p-4">
                <span className="text-[10px] font-mono text-slate-500 block mb-4 uppercase tracking-widest text-center">
                  Sincroniza los Anillos Rúnicos a la Frecuencia del Amanecer (0°)
                </span>
                
                <div className="flex gap-4 md:gap-6 justify-center items-center py-6">
                  {rotateAngles.map((angle, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <button
                        onClick={() => handleRotateRing(idx)}
                        style={{ transform: `rotate(${angle}deg)` }}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-double border-purple-800 bg-slate-950 hover:bg-purple-950/40 flex items-center justify-center text-3xl transition-transform duration-300 shadow-lg cursor-pointer"
                        title="Haz clic para rotar 90 grados"
                      >
                        {activeGame.payload.symbols[idx] || "📜"}
                      </button>
                      <span className="text-[10px] font-mono text-slate-500 mt-3 uppercase tracking-wider">
                        Anillo {idx + 1}: <span className={angle === 0 ? "text-emerald-400 font-bold" : "text-purple-400"}>{angle}°</span>
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-purple-950/10 border border-purple-900/20 rounded text-[11px] text-center text-slate-400 max-w-sm mt-2">
                  💡 <strong>Ayuda:</strong> Haz clic sobre cada anillo de piedra para rotarlo. Cuando todos los iconos apunten verticalmente (0° de inclinación), el Poneglyph se activará.
                </div>
              </div>
            )}

            {/* 3. SONAR INTERFACE */}
            {activeGame.gameType === 'sonar' && (
              <div className="flex-1 flex flex-col gap-4 p-1 justify-center">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  
                  {/* Radar grid 6x6 */}
                  <div className="flex flex-col items-center bg-slate-950 border border-emerald-950 p-3 rounded-lg shadow-inner">
                    <span className="text-[10px] font-mono text-emerald-500 block mb-2 uppercase tracking-widest text-center animate-pulse">
                      📡 Scanner de Red de Anomalías
                    </span>
                    <div className="grid grid-cols-6 gap-1 w-64 h-64 md:w-72 md:h-72">
                      {sonarGrid.map((row, rIdx) => 
                        row.map((cell, cIdx) => {
                          const isSelected = sonarSelectedCell?.r === rIdx && sonarSelectedCell?.c === cIdx;
                          let bgClass = "bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-700";
                          let symbol = "";
                          
                          if (cell === "cold") {
                            bgClass = "bg-blue-950/50 border-blue-900 text-blue-400";
                            symbol = "❄️";
                          } else if (cell === "warm") {
                            bgClass = "bg-yellow-950/50 border-yellow-800 text-yellow-400";
                            symbol = "🟡";
                          } else if (cell === "hot") {
                            bgClass = "bg-orange-950/60 border-orange-700 text-orange-400 animate-pulse";
                            symbol = "🔥";
                          } else if (cell === "depth_error") {
                            bgClass = "bg-purple-950/60 border-purple-700 text-purple-400 animate-pulse";
                            symbol = "📐";
                          } else if (cell === "success") {
                            bgClass = "bg-emerald-950/80 border-emerald-500 text-emerald-400 animate-bounce";
                            symbol = "🏺";
                          }

                          return (
                            <button
                              key={`${rIdx}-${cIdx}`}
                              onClick={() => handlePingSonarCell(rIdx, cIdx)}
                              className={`w-full h-full border rounded flex items-center justify-center text-xs font-mono transition-all cursor-pointer ${bgClass} ${isSelected ? 'ring-2 ring-sky-400' : ''}`}
                            >
                              {symbol || `${rIdx},${cIdx}`}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Depth and attempts */}
                  <div className="flex-1 w-full space-y-4">
                    <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-md">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-slate-300">Ajustar Profundidad del Hidrófono:</span>
                        <span className="text-xs font-mono font-bold text-sky-400">{sonarInputDepth} m</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="100"
                        value={sonarInputDepth}
                        onChange={(e) => setSonarInputDepth(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-500"
                      />
                      <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                        <span>Superficie (0m)</span>
                        <span>Trinchera (10,000m)</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-md text-xs space-y-1.5">
                      <div className="flex justify-between text-slate-400">
                        <span>Escaneos Emitidos:</span>
                        <span className="font-mono text-slate-200">{sonarTries}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Estado de Señal:</span>
                        <span className="font-mono text-yellow-400">Buscando Eco</span>
                      </div>
                      <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5 leading-relaxed">
                        ⚠️ <strong>Leyenda del Sonar:</strong><br />
                        ❄️ Frío (distancia &gt; 2) | 🟡 Templado (distancia 2)<br />
                        🔥 Caliente (distancia 1) | 📐 Posición exacta, profundidad errónea (¡ajusta tu dial!)
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* 4. RIDDLE INTERFACE */}
            {activeGame.gameType === 'riddle' && (
              <div className="flex-1 flex flex-col justify-center gap-4 py-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1 tracking-widest text-center">Enigma Histórico de Ohara</span>
                <p className="text-sm font-bold text-slate-200 mb-4 text-center leading-relaxed px-2">
                  {activeGame.payload.question}
                </p>

                <div className="space-y-2 max-w-lg mx-auto w-full">
                  {activeGame.payload.options.map((option: string, idx: number) => {
                    const isSelected = riddleSelectedOption === idx;
                    let optionStyle = "border-slate-800 hover:border-purple-500 bg-slate-900/40 hover:bg-slate-900/80 text-slate-300";
                    
                    if (riddleIsSubmitted) {
                      if (idx === activeGame.payload.correctAnswer) {
                        optionStyle = "border-emerald-500 bg-emerald-950/20 text-emerald-300";
                      } else if (isSelected) {
                        optionStyle = "border-red-500 bg-red-950/20 text-red-300";
                      }
                    } else if (isSelected) {
                      optionStyle = "border-sky-500 bg-sky-950/20 text-sky-300 ring-1 ring-sky-500";
                    }

                    return (
                      <button
                        key={idx}
                        disabled={riddleIsSubmitted}
                        onClick={() => setRiddleSelectedOption(idx)}
                        className={`w-full p-3 border rounded-md text-left text-xs transition-all flex items-start gap-2 cursor-pointer ${optionStyle}`}
                      >
                        <span className="font-mono text-slate-500 mt-0.5">{String.fromCharCode(65 + idx)}.</span>
                        <span className="leading-normal">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {riddleIsSubmitted && !riddleIsCorrect && (
                  <div className="text-center text-xs font-mono text-red-400 animate-pulse mt-2">
                    ❌ Respuesta incorrecta. Vuelve a intentar tu descifrado.
                    <button 
                      onClick={() => {
                        setRiddleIsSubmitted(false);
                        setRiddleSelectedOption(null);
                      }}
                      className="block mx-auto mt-1 text-[11px] underline text-sky-400"
                    >
                      Volver a Elegir
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ACTION FOOTER */}
            <div className="flex gap-3 justify-end items-center mt-6 pt-4 border-t border-slate-900">
              <button
                onClick={onCloseGame}
                className="px-4 py-2 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-900 text-xs font-semibold rounded cursor-pointer transition-colors"
              >
                Cerrar
              </button>

              {activeGame.gameType === 'cipher' && (
                <button
                  onClick={verifyCipher}
                  className="px-5 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-slate-100 text-xs font-bold uppercase tracking-wider rounded shadow-md cursor-pointer transition-all"
                >
                  Verificar Frecuencia
                </button>
              )}

              {activeGame.gameType === 'riddle' && !riddleIsSubmitted && (
                <button
                  onClick={submitRiddleAnswer}
                  disabled={riddleSelectedOption === null}
                  className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded shadow-md cursor-pointer transition-all ${
                    riddleSelectedOption === null 
                      ? 'bg-slate-800 text-slate-500 border border-slate-700/30 cursor-not-allowed'
                      : 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-slate-100'
                  }`}
                >
                  Presentar Solución
                </button>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

// ================= COFRE DE TESOROS VIEW PANEL =================

interface TreasureChestPanelProps {
  userProgress: UserProgress | null;
  onOpenRegister: () => void;
  onClose: () => void;
}

export function TreasureChestPanel({ userProgress, onOpenRegister, onClose }: TreasureChestPanelProps) {
  const [guestTreasures, setGuestTreasures] = useState<DiscoveredTreasure[]>([]);
  const [expandedTreasureId, setExpandedTreasureId] = useState<string | null>(null);

  // Load guest treasures if not logged in
  useEffect(() => {
    if (!userProgress) {
      try {
        const stored = localStorage.getItem("ohara_guest_treasures");
        if (stored) {
          setGuestTreasures(JSON.parse(stored));
        }
      } catch (e) {}
    }
  }, [userProgress]);

  const treasures = userProgress ? (userProgress.discoveredTreasures || []) : guestTreasures;
  const totalPoints = userProgress 
    ? treasures.reduce((sum, t) => sum + t.restorationPointsAwarded, 0)
    : treasures.reduce((sum, t) => sum + t.restorationPointsAwarded, 0);

  return (
    <div className="flex flex-col h-full bg-[#030712] text-slate-100" id="treasure-chest-panel">
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/30 bg-purple-950/20">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-purple-950/60 border border-purple-500/30 rounded-md">
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">Mochila de Arqueólogo: Cofre de Tesoros</h2>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Tus logros de anomalías decodificadas</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-slate-900 text-slate-400 hover:text-slate-100 rounded-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* CONTENT BODY */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* ACCOUNT WARNING */}
        {!userProgress && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold font-mono uppercase tracking-wide">Cofre de Invitado No Sincronizado</span>
            </div>
            <p className="text-xs leading-relaxed text-amber-400/90">
              Estás guardando descubrimientos en la memoria temporal del navegador. Si vacías tu historial o cookies en este dispositivo, podrías perder tu colección de tesoros prohibidos.
            </p>
            <button
              onClick={onOpenRegister}
              className="px-3 py-1.5 bg-amber-500 text-slate-950 text-[10px] font-bold uppercase rounded hover:bg-amber-400 transition-colors cursor-pointer"
            >
              Registrar Perfil en la Academia de Ohara
            </button>
          </div>
        )}

        {/* STATUS BAR */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-md text-center">
            <span className="text-[9px] font-mono uppercase text-slate-500 block">Tesoros Asegurados</span>
            <span className="text-lg font-bold font-mono text-sky-400">{treasures.length} / 12</span>
          </div>
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-md text-center">
            <span className="text-[9px] font-mono uppercase text-slate-500 block">Puntos Acumulados</span>
            <span className="text-lg font-bold font-mono text-yellow-400">+{totalPoints} XP</span>
          </div>
        </div>

        {/* LIST OF TREASURES */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-purple-400 tracking-wider">Tesoros y Anomalías Históricas</h3>
          
          {treasures.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-800 rounded-lg text-center space-y-2 text-slate-500">
              <Skull className="w-8 h-8 mx-auto opacity-30 animate-pulse" />
              <p className="text-xs">Aún no has descubierto ninguna anomalía o tesoro oculto.</p>
              <p className="text-[10px] italic">
                Sugerencia: Explora e interactúa con el mapa, haz clic en las islas o realiza búsquedas en el buscador para captar señales electromagnéticas.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {treasures.map((treasure) => {
                const isExpanded = expandedTreasureId === treasure.id;
                
                return (
                  <div 
                    key={treasure.id}
                    className={`border rounded-lg transition-all ${
                      isExpanded 
                        ? 'border-purple-600/50 bg-purple-950/10' 
                        : 'border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/70'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedTreasureId(isExpanded ? null : treasure.id)}
                      className="w-full p-3.5 text-left flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-md ${treasure.type === 'unico' ? 'bg-purple-950/80 text-purple-400' : 'bg-sky-950/80 text-sky-400'}`}>
                          {treasure.type === 'unico' ? <Sparkles className="w-4 h-4 animate-pulse" /> : <Award className="w-4 h-4" />}
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-slate-500 uppercase block">{treasure.date} • {treasure.type === 'unico' ? 'Misterio Único' : 'Misterio Común'}</span>
                          <h4 className="text-xs font-bold text-slate-200">{treasure.name}</h4>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                        +{treasure.restorationPointsAwarded} XP
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-slate-800/60 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="space-y-2.5">
                          <div>
                            <span className="text-[9px] font-mono uppercase text-sky-400 block">Tema o Búsqueda:</span>
                            <span className="text-xs font-semibold text-slate-300">{treasure.topic}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-mono uppercase text-sky-400 block">Verdad Asegurada:</span>
                            <p className="text-xs text-slate-400 leading-relaxed italic">
                              {treasure.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* HINT BANNER */}
        <div className="p-3 bg-slate-950 border border-slate-800/50 rounded-lg text-center text-[10px] text-slate-500">
          💡 Las anomalías se captan por pura curiosidad: clica en distintos continentes, lee las descripciones de los nodos o busca en la barra para generar nuevos enigmas únicos y comunes de forma espontánea.
        </div>
      </div>
    </div>
  );
}
