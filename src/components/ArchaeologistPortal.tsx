import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import { 
  User, Key, Shield, Download, Upload, RefreshCw, Trophy, BookOpen, Globe, 
  Settings, CheckCircle2, AlertCircle, Trash2, Copy, Check, Info, Award, Cloud, FileCode, CheckSquare, X
} from "lucide-react";
import { UserProgress, AVATARS } from "../data/courses";

// Predefined NPC scholars for the leaderboard to make the experience rich
const PREDEFINED_SCHOLARS = [
  { username: "Nico_Robin", avatar: "robin", role: "Arqueóloga Mayor", points: 2850, country: "Ohara" },
  { username: "Prof_Clover", avatar: "luffy", role: "Director de la Biblioteca", points: 2400, country: "Ohara" },
  { username: "Dr_Vegapunk", avatar: "chopper", role: "Científico Jefe", points: 1950, country: "Egghead" },
  { username: "Olvia_Nico", avatar: "robin", role: "Exploradora del Vacío", points: 1800, country: "Ohara" },
  { username: "Cartógrafo_Koby", avatar: "zoro", role: "Navegante Real", points: 950, country: "SWORD" },
];

interface ArchaeologistPortalProps {
  userProgress: UserProgress | null;
  onClose: () => void;
  onSaveProgress: (updated: UserProgress) => void;
}

interface LocalBackupSlot {
  id: string;
  timestamp: string;
  username: string;
  points: number;
  data: UserProgress;
}

export default function ArchaeologistPortal({ userProgress, onClose, onSaveProgress }: ArchaeologistPortalProps) {
  // --- Tab State ---
  const [activeTab, setActiveTab] = useState<"perfil" | "guardado" | "gremio">("perfil");

  // --- Login / Registration State ---
  const [usernameInput, setUsernameInput] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("robin");
  const [selectedRole, setSelectedRole] = useState("Arqueólogo");
  const [loginMode, setLoginMode] = useState<"register" | "login">("register");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // --- Sync & Granular Options State ---
  const [syncAcademy, setSyncAcademy] = useState(true);
  const [syncAchievements, setSyncAchievements] = useState(true);
  const [syncOronceLogs, setSyncOronceLogs] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(() => {
    return localStorage.getItem("ohara_autosync") !== "false";
  });

  // --- Cloud Sync Simulation ---
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [cloudSyncLogs, setCloudSyncLogs] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);

  // --- Backup Slots ---
  const [backupSlots, setBackupSlots] = useState<LocalBackupSlot[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Roles List ---
  const ROLES_LIST = [
    "Arqueólogo",
    "Erudito de Ohara",
    "Descifrador de Poneglyphs",
    "Cartógrafo de la Verdad",
    "Cronista del Siglo Vacío",
    "Explorador de Ruinas",
  ];

  // Load existing accounts and local backups
  useEffect(() => {
    loadLocalBackups();
  }, []);

  const loadLocalBackups = () => {
    try {
      const stored = localStorage.getItem("ohara_local_backups");
      if (stored) {
        setBackupSlots(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error loading local backups", e);
    }
  };

  // --- Handlers for Login / Register ---
  const handleAuthSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const name = usernameInput.trim();
    if (!name) {
      setErrorMessage("Por favor, introduce un nombre de arqueólogo válido.");
      return;
    }

    if (name.length < 3) {
      setErrorMessage("El nombre de arqueólogo debe tener al menos 3 caracteres.");
      return;
    }

    // Get all registered accounts
    let accounts: Record<string, { key: string; progress: UserProgress }> = {};
    try {
      const stored = localStorage.getItem("ohara_registered_users");
      if (stored) accounts = JSON.parse(stored);
    } catch (e) {}

    const normalizedName = name.toLowerCase();

    if (loginMode === "register") {
      if (accounts[normalizedName]) {
        setErrorMessage("Este nombre de arqueólogo ya está registrado en los Archivos de Ohara.");
        return;
      }

      // Create new progress object
      const initialProgress: UserProgress = {
        username: name,
        avatar: selectedAvatar,
        mode: "novice",
        currentChapterId: "alabasta",
        completedChapters: [],
        quizScores: {},
        placementScore: null,
        pirateCertified: false,
        archaeologistCertified: false,
        restorationPoints: 50, // Starter bonus points
        discoveredTreasures: [],
      };

      // Save user with key
      accounts[normalizedName] = {
        key: accessKey || "1531", // Default year of Oronce Fine Map
        progress: initialProgress,
      };

      localStorage.setItem("ohara_registered_users", JSON.stringify(accounts));
      onSaveProgress(initialProgress);
      setSuccessMessage("¡Identidad de arqueólogo creada con éxito en el Registro de Ohara!");
      setUsernameInput("");
      setAccessKey("");
    } else {
      // Login mode
      const userAccount = accounts[normalizedName];
      if (!userAccount) {
        setErrorMessage("No se encontró ningún arqueólogo con ese nombre.");
        return;
      }

      const providedKey = accessKey || "1531";
      if (userAccount.key !== providedKey) {
        setErrorMessage("Clave de acceso incorrecta para esta bitácora.");
        return;
      }

      // Load progress
      onSaveProgress(userAccount.progress);
      setSuccessMessage(`¡Bienvenido de vuelta, ${userAccount.progress.username}! Sincronizando datos...`);
      setUsernameInput("");
      setAccessKey("");
    }
  };

  // --- Change Avatar / Specialty Role ---
  const handleUpdateMeta = (avatarId: string, role: string) => {
    if (!userProgress) return;
    const updated: UserProgress = {
      ...userProgress,
      avatar: avatarId,
    };
    onSaveProgress(updated);

    // Update inside stored accounts as well
    updateStoredAccount(updated);
    setSuccessMessage("Perfil actualizado con éxito.");
  };

  const updateStoredAccount = (updated: UserProgress) => {
    try {
      let accounts: Record<string, { key: string; progress: UserProgress }> = {};
      const stored = localStorage.getItem("ohara_registered_users");
      if (stored) accounts = JSON.parse(stored);
      
      const normalized = updated.username.toLowerCase();
      if (accounts[normalized]) {
        accounts[normalized].progress = updated;
        localStorage.setItem("ohara_registered_users", JSON.stringify(accounts));
      }
    } catch (e) {}
  };

  // --- Cloud Sync Simulation ---
  const handleCloudSync = () => {
    if (!userProgress) return;
    setIsCloudSyncing(true);
    setCloudSyncLogs(["Estableciendo túnel cuántico seguro con el Archivo de Ohara...", "Autenticando credenciales del Arqueólogo..."]);

    let step = 0;
    const logs = [
      "Verificando integridad del árbol de directorios...",
      syncAcademy ? `[OK] Analizando progreso de la Academia (${userProgress.completedChapters?.length || 0} capítulos resueltos)` : "[OMITIDO] Progreso de la Academia excluido de la sincronización.",
      syncAchievements ? `[OK] Recopilando logros de tesoros (${userProgress.discoveredTreasures?.length || 0} reliquias encontradas)` : "[OMITIDO] Cofre de Tesoros excluido de la sincronización.",
      syncOronceLogs ? `[OK] Empaquetando registros cartográficos aportados a la Mesa 3D Oronce Fine` : "[OMITIDO] Registros Oronce excluidos.",
      `Compilando datos a enviar. Puntos de restauración acumulados: ${userProgress.restorationPoints} RP`,
      "Enviando paquete cifrado de bitácoras...",
      "Sincronizando con base de datos del Árbol del Conocimiento de Ohara...",
      "Sincronización completada con éxito. Base de datos global actualizada de forma segura.",
    ];

    const timer = setInterval(() => {
      if (step < logs.length) {
        setCloudSyncLogs(prev => [...prev, logs[step]]);
        step++;
      } else {
        clearInterval(timer);
        setIsCloudSyncing(false);
        // Save current progress under global cloud registry backup
        let cloudDb: Record<string, UserProgress> = {};
        try {
          const stored = localStorage.getItem("ohara_cloud_simulated_db");
          if (stored) cloudDb = JSON.parse(stored);
        } catch (e) {}

        cloudDb[userProgress.username.toLowerCase()] = userProgress;
        localStorage.setItem("ohara_cloud_simulated_db", JSON.stringify(cloudDb));

        // Sync with accounts
        updateStoredAccount(userProgress);

        setSuccessMessage("¡Tu progreso ha sido salvado de forma segura en la Nube de Ohara!");
      }
    }, 400);
  };

  // --- Export Profile to JSON File ---
  const handleExportJSON = () => {
    if (!userProgress) return;

    // Filter properties based on user granular sync options
    const exportData: Partial<UserProgress> & { exportedAt: string } = {
      username: userProgress.username,
      avatar: userProgress.avatar,
      mode: userProgress.mode,
      restorationPoints: userProgress.restorationPoints,
      exportedAt: new Date().toISOString(),
    };

    if (syncAcademy) {
      exportData.currentChapterId = userProgress.currentChapterId;
      exportData.completedChapters = userProgress.completedChapters;
      exportData.quizScores = userProgress.quizScores;
      exportData.placementScore = userProgress.placementScore;
      exportData.pirateCertified = userProgress.pirateCertified;
      exportData.archaeologistCertified = userProgress.archaeologistCertified;
      exportData.certifiedDate = userProgress.certifiedDate;
    }

    if (syncAchievements) {
      exportData.discoveredTreasures = userProgress.discoveredTreasures;
    }

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(exportData, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `ohara_bitacora_${userProgress.username.toLowerCase()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setSuccessMessage("Bitácora exportada correctamente como archivo JSON.");
  };

  // --- Import Profile from JSON File ---
  const handleImportJSON = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.username) {
          setErrorMessage("Archivo de bitácora no válido. Falta el nombre del arqueólogo.");
          return;
        }

        // Merge or create progress
        const restoredProgress: UserProgress = {
          username: parsed.username,
          avatar: parsed.avatar || "robin",
          mode: parsed.mode || "novice",
          currentChapterId: parsed.currentChapterId || "alabasta",
          completedChapters: parsed.completedChapters || [],
          quizScores: parsed.quizScores || {},
          placementScore: parsed.placementScore !== undefined ? parsed.placementScore : null,
          pirateCertified: !!parsed.pirateCertified,
          archaeologistCertified: !!parsed.archaeologistCertified,
          certifiedDate: parsed.certifiedDate,
          restorationPoints: parsed.restorationPoints || 50,
          discoveredTreasures: parsed.discoveredTreasures || [],
        };

        onSaveProgress(restoredProgress);
        updateStoredAccount(restoredProgress);
        setSuccessMessage(`¡Bitácora importada correctamente! Bienvenido, ${restoredProgress.username}.`);
        
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err) {
        setErrorMessage("Error al procesar el archivo JSON. Asegúrate de que es una copia de seguridad válida.");
      }
    };
    reader.readAsText(file);
  };

  // --- Local Snapshot Backups ---
  const handleCreateLocalBackup = () => {
    if (!userProgress) return;

    const newBackup: LocalBackupSlot = {
      id: "backup_" + Date.now(),
      timestamp: new Date().toLocaleString("es-ES"),
      username: userProgress.username,
      points: userProgress.restorationPoints,
      data: JSON.parse(JSON.stringify(userProgress)),
    };

    const updated = [newBackup, ...backupSlots];
    setBackupSlots(updated);
    localStorage.setItem("ohara_local_backups", JSON.stringify(updated));
    setSuccessMessage("Copia de seguridad local guardada en la caja fuerte del navegador.");
  };

  const handleRestoreBackup = (backup: LocalBackupSlot) => {
    if (!window.confirm(`¿Estás seguro de que deseas cargar la bitácora de "${backup.username}" del ${backup.timestamp}? Sobrescribirá tu progreso actual.`)) {
      return;
    }
    onSaveProgress(backup.data);
    setSuccessMessage(`Progreso restaurado con éxito a la versión de ${backup.username} (${backup.timestamp}).`);
  };

  const handleDeleteBackup = (backupId: string) => {
    const updated = backupSlots.filter(b => b.id !== backupId);
    setBackupSlots(updated);
    localStorage.setItem("ohara_local_backups", JSON.stringify(updated));
    setSuccessMessage("Copia de seguridad eliminada.");
  };

  // --- Auto-sync Toggle ---
  const handleToggleAutoSync = () => {
    const nextVal = !autoSyncEnabled;
    setAutoSyncEnabled(nextVal);
    localStorage.setItem("ohara_autosync", String(nextVal));
  };

  // --- Logout ---
  const handleLogout = () => {
    if (window.confirm("¿Seguro que deseas cerrar tu sesión cartográfica actual? Tu progreso local permanece guardado.")) {
      localStorage.removeItem("ohara_user_progress");
      // Trigger a sync event
      window.dispatchEvent(new Event("ohara_sync_progress"));
      setSuccessMessage("Sesión cerrada. Puedes volver a identificarte cuando quieras.");
      onClose();
    }
  };

  // --- Copy cloud code ---
  const handleCopyCode = () => {
    if (!userProgress) return;
    const code = `OHARA-CART-${userProgress.username.toUpperCase()}-${userProgress.restorationPoints}`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Gather leaderboard list
  const getLeaderboard = () => {
    const activeUsers: { username: string; avatar: string; role: string; points: number; country: string }[] = [];
    
    // Read registered accounts
    try {
      const stored = localStorage.getItem("ohara_registered_users");
      if (stored) {
        const accounts = JSON.parse(stored);
        Object.values(accounts).forEach((acc: any) => {
          activeUsers.push({
            username: acc.progress.username,
            avatar: acc.progress.avatar,
            role: "Erudito",
            points: acc.progress.restorationPoints || 0,
            country: "Mesa Local",
          });
        });
      }
    } catch (e) {}

    // Add current user if not yet in list
    if (userProgress && !activeUsers.some(u => u.username.toLowerCase() === userProgress.username.toLowerCase())) {
      activeUsers.push({
        username: userProgress.username,
        avatar: userProgress.avatar,
        role: "Explorador Activo",
        points: userProgress.restorationPoints || 0,
        country: "Sesión Actual",
      });
    }

    // Merge NPCs and Users, sort descending
    const merged = [...activeUsers, ...PREDEFINED_SCHOLARS];
    
    // Remove duplicates by lowercase username
    const seen = new Set();
    const unique = merged.filter(el => {
      const duplicate = seen.has(el.username.toLowerCase());
      seen.add(el.username.toLowerCase());
      return !duplicate;
    });

    return unique.sort((a, b) => b.points - a.points);
  };

  const getLevelInfo = (points: number) => {
    if (points >= 1500) return { level: 5, title: "Maestro Historiador ✦", color: "text-amber-400 border-amber-500/30 bg-amber-500/5" };
    if (points >= 800) return { level: 4, title: "Gran Arqueólogo", color: "text-purple-400 border-purple-500/30 bg-purple-500/5" };
    if (points >= 400) return { level: 3, title: "Descifrador de Tablillas", color: "text-sky-400 border-sky-500/30 bg-sky-500/5" };
    if (points >= 150) return { level: 2, title: "Explorador de Ohara", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5" };
    return { level: 1, title: "Iniciado de Ohara", color: "text-slate-400 border-slate-700 bg-slate-800/20" };
  };

  const levelDetails = userProgress ? getLevelInfo(userProgress.restorationPoints) : null;

  // Let's get active user 3D map contribution count
  const getOronceMapLogsCount = () => {
    if (!userProgress) return 0;
    try {
      const stored = localStorage.getItem("oronce_fine_logs");
      if (stored) {
        const logs = JSON.parse(stored);
        return logs.filter((l: any) => l.author.toLowerCase() === userProgress.username.toLowerCase()).length;
      }
    } catch (e) {}
    return 0;
  };

  const mapLogsCount = getOronceMapLogsCount();

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div 
        id="archaeologist-portal-panel"
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 bg-gradient-to-r from-slate-950 to-slate-900 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400">
              <Shield className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-100 flex items-center gap-2">
                Centro de Bitácoras de Ohara
              </h2>
              <p className="text-[11px] text-slate-400">
                Garantía de persistencia, sincronización híbrida y mesa colaborativa
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800/50 bg-slate-950/55 px-4 gap-1">
          <button
            onClick={() => setActiveTab("perfil")}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "perfil"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Perfil de Arqueólogo</span>
          </button>
          <button
            onClick={() => setActiveTab("guardado")}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "guardado"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Respaldos y Guardado</span>
          </button>
          <button
            onClick={() => setActiveTab("gremio")}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "gremio"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Gremio y Clasificación</span>
          </button>
        </div>

        {/* Messages Feedback banner */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-rose-950/30 border border-rose-500/20 text-rose-300 rounded-lg flex items-start gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 rounded-lg flex items-start gap-2.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* ==================== TAB: PROFILE / ARCHEOLOGIST ==================== */}
          {activeTab === "perfil" && (
            <div className="space-y-6">
              {!userProgress ? (
                // NOT LOGGED IN / REGISTER FORM
                <div className="grid md:grid-cols-5 gap-6">
                  {/* Explanatory intro */}
                  <div className="md:col-span-2 space-y-4 pr-2">
                    <div className="bg-slate-950/40 border border-slate-800/60 p-4 rounded-xl space-y-3">
                      <h3 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wide">
                        <Info className="w-3.5 h-3.5" /> Bitácora Unificada
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Al registrar tu bitácora de Ohara, podrás asegurar tu aprendizaje científico:
                      </p>
                      <ul className="text-[11px] text-slate-400 space-y-2 list-disc list-inside">
                        <li>Suma <b className="text-amber-500">Puntos de Restauración</b>.</li>
                        <li>Salva cuestionarios y exámenes de la <b className="text-purple-400">Academia</b>.</li>
                        <li>Registra tesoros del <b className="text-teal-400">Cofre del Descubridor</b>.</li>
                        <li>Firma tus observaciones cartográficas en la <b className="text-sky-400">Mesa 3D</b>.</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-indigo-950/10 border border-indigo-500/10 rounded-lg text-[11px] text-slate-400 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-indigo-400" />
                      <span>Los datos se respaldan localmente y son compatibles con descargas JSON.</span>
                    </div>
                  </div>

                  {/* Auth Form */}
                  <div className="md:col-span-3 bg-slate-950/30 border border-slate-800/80 p-5 rounded-xl space-y-4">
                    <div className="flex border-b border-slate-800 pb-2 mb-2 gap-4">
                      <button
                        onClick={() => { setLoginMode("register"); setErrorMessage(""); setSuccessMessage(""); }}
                        className={`text-xs font-bold pb-2 border-b-2 transition-all ${
                          loginMode === "register" ? "border-indigo-500 text-indigo-400" : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        Crear Bitácora
                      </button>
                      <button
                        onClick={() => { setLoginMode("login"); setErrorMessage(""); setSuccessMessage(""); }}
                        className={`text-xs font-bold pb-2 border-b-2 transition-all ${
                          loginMode === "login" ? "border-indigo-500 text-indigo-400" : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        Identificarse
                      </button>
                    </div>

                    <form onSubmit={handleAuthSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nombre del Arqueólogo</label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            placeholder="Ej. Clover, Olvia, Vegapunk..."
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex justify-between items-center">
                          <span>Clave de Acceso Secreta</span>
                          <span className="text-[9px] text-slate-600 lowercase">(Opcional, por defecto "1531")</span>
                        </label>
                        <div className="relative">
                          <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                          <input
                            type="password"
                            placeholder="Introduce un PIN o clave privada"
                            value={accessKey}
                            onChange={(e) => setAccessKey(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      {loginMode === "register" && (
                        <>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Selecciona tu Avatar de Ohara</label>
                            <div className="grid grid-cols-5 gap-2">
                              {AVATARS.map((av) => (
                                <button
                                  key={av.id}
                                  type="button"
                                  onClick={() => setSelectedAvatar(av.id)}
                                  className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                                    selectedAvatar === av.id
                                      ? "bg-indigo-950/40 border-indigo-500 text-slate-200"
                                      : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700"
                                  }`}
                                  title={av.name}
                                >
                                  <span className="text-xl">{av.icon}</span>
                                  <span className="text-[9px] truncate w-full text-center">{av.name.split(" ")[0]}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Especialización Cartográfica</label>
                            <select
                              value={selectedRole}
                              onChange={(e) => setSelectedRole(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-100 outline-none focus:border-indigo-500"
                            >
                              {ROLES_LIST.map((role) => (
                                <option key={role} value={role}>{role}</option>
                              ))}
                            </select>
                          </div>
                        </>
                      )}

                      <button
                        type="submit"
                        className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-slate-100 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-950/50 flex justify-center items-center gap-2 cursor-pointer"
                      >
                        {loginMode === "register" ? "Registrar Nueva Bitácora" : "Iniciar Sesión en Ohara"}
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                // LOGGED IN DASHBOARD
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Cartographer Passport ID Card */}
                  <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/20 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
                    
                    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                      {/* Left: Avatar & Nickname info */}
                      <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full border-2 border-indigo-500/40 bg-slate-800 flex items-center justify-center text-3.5xl shadow-lg">
                            {AVATARS.find(a => a.id === userProgress.avatar)?.icon || "📖"}
                          </div>
                          <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-indigo-600 text-[8px] font-bold text-slate-100 rounded-md uppercase border border-indigo-400">
                            Rango {levelDetails?.level}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 justify-center sm:justify-start">
                            <h3 className="text-base font-bold text-slate-100">{userProgress.username}</h3>
                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded-md text-slate-300">
                              Activo
                            </span>
                          </div>
                          
                          <p className="text-xs text-indigo-400 font-medium">
                            {AVATARS.find(a => a.id === userProgress.avatar)?.role || "Arqueólogo"} de Ohara
                          </p>

                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Globe className="w-3.5 h-3.5 text-sky-500" /> {userProgress.mode === "experienced" ? "Examen Concluido" : "Modo Aprendiz"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Restoration Points Badge */}
                      <div className="flex flex-col items-center sm:items-end gap-1.5 self-center sm:self-auto bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 min-w-[140px]">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-amber-500">Puntos de Restauración</span>
                        <div className="flex items-center gap-1.5">
                          <Trophy className="w-4 h-4 text-amber-400" />
                          <span className="text-lg font-black text-amber-300">{userProgress.restorationPoints}</span>
                          <span className="text-[10px] text-slate-500">RP</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${levelDetails?.color}`}>
                          {levelDetails?.title}
                        </span>
                      </div>
                    </div>

                    {/* Progress details container */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-800/80">
                      
                      {/* Academy completion */}
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/40 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-purple-400" /> Academia
                          </span>
                          <span className="text-xs font-bold text-purple-300">
                            {userProgress.completedChapters?.length || 0} / 5
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-purple-500 h-full rounded-full transition-all"
                            style={{ width: `${((userProgress.completedChapters?.length || 0) / 5) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-[9px] text-slate-500">Capítulos de la verdad estudiados</p>
                      </div>

                      {/* Achievements completion */}
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/40 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                            <Award className="w-3 h-3 text-emerald-400" /> Logros Hallados
                          </span>
                          <span className="text-xs font-bold text-emerald-300">
                            {userProgress.discoveredTreasures?.length || 0} encontrados
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full transition-all"
                            style={{ width: `${Math.min(((userProgress.discoveredTreasures?.length || 0) / 8) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-[9px] text-slate-500">Tesoros y anomalías resueltas</p>
                      </div>

                      {/* 3D Map Log Contributions */}
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/40 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                            <FileCode className="w-3 h-3 text-sky-400" /> Mesa 3D Oronce
                          </span>
                          <span className="text-xs font-bold text-sky-300">
                            {mapLogsCount} registros
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-sky-500 h-full rounded-full transition-all"
                            style={{ width: `${Math.min((mapLogsCount / 6) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-[9px] text-slate-500">Aportaciones de investigación firmadas</p>
                      </div>

                    </div>
                  </div>

                  {/* Actions & Settings Preview */}
                  <div className="flex flex-wrap gap-3 items-center justify-between p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-200">Sincronización Automática Activa</p>
                      <p className="text-[10px] text-slate-400">Los cambios se guardan automáticamente en este navegador.</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyCode}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-300 hover:text-slate-100 flex items-center gap-1.5 cursor-pointer"
                        title="Copiar código de cartógrafo"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                        <span>Código Cartógrafo</span>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="px-3 py-1.5 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-500/20 hover:border-rose-500/40 rounded-lg text-xs text-rose-300 hover:text-rose-200 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB: BACKUP & SAVE OPTIONS ==================== */}
          {activeTab === "guardado" && (
            <div className="space-y-6">
              
              {/* Granular Sync Option Selectors */}
              <div className="bg-slate-950/30 border border-slate-800/80 p-4 rounded-xl space-y-4">
                <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-indigo-400" />
                  ¿Qué deseas incluir en tus copias de seguridad?
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Configura de manera granular qué módulos de investigación quieres sincronizar o exportar. Tus opciones se aplicarán tanto a las descargas JSON como a los guardados locales en la bóveda.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className={`p-3 rounded-lg border flex items-start gap-3 cursor-pointer transition-all ${
                    syncAcademy ? "bg-indigo-950/20 border-indigo-500/50" : "bg-slate-900/30 border-slate-800 hover:border-slate-700"
                  }`}>
                    <input
                      type="checkbox"
                      checked={syncAcademy}
                      onChange={(e) => setSyncAcademy(e.target.checked)}
                      className="mt-0.5 rounded border-slate-800 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-200">Academia de Ohara</p>
                      <p className="text-[10px] text-slate-400">Lecciones, exámenes y certificados arqueológicos.</p>
                    </div>
                  </label>

                  <label className={`p-3 rounded-lg border flex items-start gap-3 cursor-pointer transition-all ${
                    syncAchievements ? "bg-indigo-950/20 border-indigo-500/50" : "bg-slate-900/30 border-slate-800 hover:border-slate-700"
                  }`}>
                    <input
                      type="checkbox"
                      checked={syncAchievements}
                      onChange={(e) => setSyncAchievements(e.target.checked)}
                      className="mt-0.5 rounded border-slate-800 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-200">Cofre de Logros</p>
                      <p className="text-[10px] text-slate-400">Anomalías históricas completadas y tesoros únicos hallados.</p>
                    </div>
                  </label>

                  <label className={`p-3 rounded-lg border flex items-start gap-3 cursor-pointer transition-all ${
                    syncOronceLogs ? "bg-indigo-950/20 border-indigo-500/50" : "bg-slate-900/30 border-slate-800 hover:border-slate-700"
                  }`}>
                    <input
                      type="checkbox"
                      checked={syncOronceLogs}
                      onChange={(e) => setSyncOronceLogs(e.target.checked)}
                      className="mt-0.5 rounded border-slate-800 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-200">Aportaciones Mesa 3D</p>
                      <p className="text-[10px] text-slate-400">Tus firmas y registros científicos escritos en Oronce Fine.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Physical Backup Operations (Export & Import) */}
              <div className="grid md:grid-cols-2 gap-4">
                
                {/* JSON File Manager */}
                <div className="bg-slate-950/30 border border-slate-800/80 p-5 rounded-xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-emerald-400" /> Exportar / Importar Archivo
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Lleva tu progreso a cualquier navegador o compártelo. Genera un archivo cifrado compatible con el Árbol del Conocimiento de Ohara.
                    </p>
                  </div>

                  <div className="pt-2 space-y-2.5">
                    <button
                      onClick={handleExportJSON}
                      disabled={!userProgress}
                      className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-emerald-400 hover:text-emerald-300 py-2 px-3 rounded-lg text-xs font-bold flex justify-center items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar Bitácora (.json)</span>
                    </button>

                    <div className="relative">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImportJSON}
                        accept=".json"
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-indigo-400 hover:text-indigo-300 py-2 px-3 rounded-lg text-xs font-bold flex justify-center items-center gap-2 transition-all cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Cargar Bitácora (.json)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Simulated Secure Cloud Sync */}
                <div className="bg-slate-950/30 border border-slate-800/80 p-5 rounded-xl space-y-4 relative flex flex-col justify-between overflow-hidden">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Cloud className="w-4 h-4 text-sky-400 animate-pulse" /> Sincronizar con Archivo Central
                      </h3>
                      <label className="relative inline-flex items-center cursor-pointer scale-90">
                        <input 
                          type="checkbox" 
                          checked={autoSyncEnabled} 
                          onChange={handleToggleAutoSync} 
                          className="sr-only peer" 
                        />
                        <div className="w-7 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-sky-600 peer-checked:after:bg-slate-100"></div>
                        <span className="ml-1.5 text-[9px] font-bold text-slate-400 uppercase">Auto</span>
                      </label>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Sincroniza tus hallazgos con el Archivo de Ohara. Al hacerlo, permites que arqueólogos de otros mundos localicen tus aportaciones de la mesa en tiempo real.
                    </p>
                  </div>

                  <div className="pt-2">
                    {isCloudSyncing ? (
                      <div className="bg-slate-950 p-2 border border-slate-800 rounded-lg text-[9px] font-mono text-sky-400 space-y-0.5 h-[65px] overflow-y-auto">
                        {cloudSyncLogs.map((log, i) => (
                          <div key={i} className="truncate">🤖 {log}</div>
                        ))}
                      </div>
                    ) : (
                      <button
                        onClick={handleCloudSync}
                        disabled={!userProgress}
                        className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-slate-100 py-2 px-3 rounded-lg text-xs font-bold flex justify-center items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-100" />
                        <span>Sincronizar Ahora</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Local Safe Box (Saves multiple snapshots in browser) */}
              <div className="bg-slate-950/30 border border-slate-800/80 p-5 rounded-xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-slate-200">
                      Bóveda de Respaldos de Ohara
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      Guarda capturas estáticas e históricas de tus avances para restaurarlas en un clic
                    </p>
                  </div>
                  <button
                    onClick={handleCreateLocalBackup}
                    disabled={!userProgress}
                    className="bg-indigo-600 hover:bg-indigo-500 text-slate-100 text-[10px] font-bold py-1 px-3 rounded-lg border border-indigo-400 flex items-center gap-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Crear Respaldo
                  </button>
                </div>

                {backupSlots.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-slate-800 rounded-lg">
                    <p className="text-[11px] text-slate-500">No hay respaldos guardados en esta bóveda local.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    {backupSlots.map((backup) => (
                      <div 
                        key={backup.id}
                        className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex justify-between items-center text-xs transition-all hover:border-slate-700"
                      >
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-300">{backup.username}</p>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1">
                            {backup.timestamp} • <b className="text-amber-500">{backup.points} RP</b>
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleRestoreBackup(backup)}
                            className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold py-1 px-2.5 rounded text-indigo-400 hover:text-indigo-300 cursor-pointer"
                          >
                            Cargar
                          </button>
                          <button
                            onClick={() => handleDeleteBackup(backup.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-950 rounded transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ==================== TAB: GUILD LEADERBOARD ==================== */}
          {activeTab === "gremio" && (
            <div className="space-y-4">
              <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl">
                <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2 mb-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  El Gremio de Cartógrafos de Ohara
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Lista de clasificación unificada que registra a los arqueólogos que más Puntos de Restauración han aportado a la restauración científica del Árbol del Conocimiento de Ohara y a la resolución de anomalías.
                </p>
              </div>

              {/* Leaderboard Table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/20">
                <div className="grid grid-cols-12 bg-slate-950 px-4 py-2 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  <div className="col-span-1">Puesto</div>
                  <div className="col-span-6">Arqueólogo</div>
                  <div className="col-span-3 text-right">Mundo / Región</div>
                  <div className="col-span-2 text-right">Puntos (RP)</div>
                </div>

                <div className="divide-y divide-slate-800 max-h-[250px] overflow-y-auto">
                  {getLeaderboard().map((scholar, idx) => {
                    const isCurrentUser = userProgress && scholar.username.toLowerCase() === userProgress.username.toLowerCase();
                    const avIcon = AVATARS.find(a => a.id === scholar.avatar)?.icon || "📖";
                    
                    return (
                      <div 
                        key={scholar.username}
                        className={`grid grid-cols-12 px-4 py-3 items-center text-xs transition-all ${
                          isCurrentUser 
                            ? "bg-indigo-950/20 border-l-4 border-l-indigo-500 font-bold" 
                            : "hover:bg-slate-900/40"
                        }`}
                      >
                        <div className="col-span-1 flex items-center gap-1 text-slate-400 font-bold">
                          {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}.`}
                        </div>
                        
                        <div className="col-span-6 flex items-center gap-3">
                          <span className="text-lg bg-slate-900 p-1 rounded-full w-7 h-7 flex items-center justify-center border border-slate-800">
                            {avIcon}
                          </span>
                          <div>
                            <span className={`block font-semibold ${isCurrentUser ? "text-indigo-400" : "text-slate-200"}`}>
                              {scholar.username}
                            </span>
                            <span className="text-[9px] text-slate-500">{scholar.role || "Arqueólogo"}</span>
                          </div>
                        </div>

                        <div className="col-span-3 text-right text-[11px] text-slate-400">
                          {scholar.country}
                        </div>

                        <div className="col-span-2 text-right font-black text-amber-400">
                          {scholar.points} <span className="text-[8px] text-slate-500 font-normal">RP</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Leaderboard CTA */}
              <div className="p-3 bg-indigo-950/10 border border-indigo-500/10 rounded-xl text-[10px] text-slate-400 flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>
                  <b>¿Cómo ascender en la clasificación?</b> Resuelve los cuestionarios de la Academia, descubre tesoros del cofre resolviendo juegos y anomalies, y redacta descubrimientos científicos en la Mesa 3D de Oronce Fine.
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-950/80 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <p className="text-[10px] text-slate-500">
            © 1531 - 2026 Gremio Cartográfico del Árbol de Ohara. Libre acceso al conocimiento.
          </p>
          <div className="flex gap-2">
            <button 
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Cerrar Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
