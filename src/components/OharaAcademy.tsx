import { useState, useEffect, FormEvent } from "react";
import { 
  BookOpen, Skull, Globe, Award, Sparkles, Anchor, Shield, CheckCircle2, 
  Lock, ArrowRight, User, RefreshCw, Trophy, FileText, ChevronRight, HelpCircle, 
  Flame, HelpCircle as HelpIcon, ArrowLeft, Download, Eye, ExternalLink, Calendar
} from "lucide-react";
import { 
  COURSE_CHAPTERS, PLACEMENT_EXAM, CourseChapter, UserProgress, AVATARS, AVATARS as AvatarsList
} from "../data/courses";
import { nodesData, NodeData } from "../data/nodes";

interface OharaAcademyProps {
  onFocusNode: (nodeId: string) => void;
  onClose: () => void;
}

export default function OharaAcademy({ onFocusNode, onClose }: OharaAcademyProps) {
  // --- Profile / Registration State ---
  const [user, setUser] = useState<UserProgress | null>(null);
  const [regName, setRegName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("luffy");
  const [regMode, setRegMode] = useState<'novice' | 'experienced'>('novice');

  // --- Course Navigation ---
  const [activeChapter, setActiveChapter] = useState<CourseChapter | null>(null);
  
  // --- Placement Exam State ---
  const [inPlacementExam, setInPlacementExam] = useState(false);
  const [examIndex, setExamIndex] = useState(0);
  const [examAnswers, setExamAnswers] = useState<number[]>([]);
  const [examFinished, setExamFinished] = useState(false);
  const [placementResultScore, setPlacementResultScore] = useState<number>(0);

  // --- Chapter Quiz State ---
  const [inQuiz, setInQuiz] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizCorrectCount, setQuizCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // --- Certificate Viewer ---
  const [viewingCertificate, setViewingCertificate] = useState<'pirate' | 'archaeologist' | null>(null);

  // --- Load Profile & Sync ---
  useEffect(() => {
    const loadProfile = () => {
      const storedUser = localStorage.getItem("ohara_user_progress");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error parsing progress in Academy", e);
        }
      } else {
        setUser(null);
      }
    };

    loadProfile();

    window.addEventListener("ohara_sync_progress", loadProfile);
    window.addEventListener("storage", loadProfile);
    return () => {
      window.removeEventListener("ohara_sync_progress", loadProfile);
      window.removeEventListener("storage", loadProfile);
    };
  }, []);

  // --- Save Profile Helper ---
  const saveProgress = (newProgress: UserProgress) => {
    setUser(newProgress);
    localStorage.setItem("ohara_user_progress", JSON.stringify(newProgress));
    window.dispatchEvent(new Event("ohara_sync_progress"));
  };

  // --- Handle Registration ---
  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;

    const initialProgress: UserProgress = {
      username: regName.trim(),
      avatar: selectedAvatar,
      mode: regMode,
      currentChapterId: "alabasta",
      completedChapters: [],
      quizScores: {},
      placementScore: null,
      pirateCertified: false,
      archaeologistCertified: false,
      restorationPoints: 50, // Initial points for joining the guild
    };

    if (regMode === 'experienced') {
      // Launch placement exam
      setUser(initialProgress);
      setInPlacementExam(true);
      setExamIndex(0);
      setExamAnswers([]);
      setExamFinished(false);
    } else {
      // Just start novice mode directly
      saveProgress(initialProgress);
      setActiveChapter(COURSE_CHAPTERS[0]);
    }
  };

  // --- Handle Placement Question Selection ---
  const handlePlacementAnswer = (optionIdx: number) => {
    const updatedAnswers = [...examAnswers, optionIdx];
    setExamAnswers(updatedAnswers);

    if (examIndex < PLACEMENT_EXAM.length - 1) {
      setExamIndex(examIndex + 1);
    } else {
      // Finish Exam! Calculate score
      let score = 0;
      PLACEMENT_EXAM.forEach((q, idx) => {
        if (updatedAnswers[idx] === q.correctAnswer) {
          score++;
        }
      });

      setPlacementResultScore(score);
      setExamFinished(true);

      if (user) {
        const isCertified = score >= 8;
        const allChapterIds = COURSE_CHAPTERS.map(c => c.id);
        const updatedUser: UserProgress = {
          ...user,
          placementScore: score,
          completedChapters: isCertified ? allChapterIds : [],
          currentChapterId: isCertified ? "laughtale" : "alabasta",
          archaeologistCertified: isCertified,
          pirateCertified: isCertified,
          restorationPoints: score * 100 + 50,
          certifiedDate: isCertified ? new Date().toLocaleDateString("es-ES") : undefined
        };
        saveProgress(updatedUser);
      }
    }
  };

  // --- Retake Placement Exam or reset ---
  const handleResetProfile = () => {
    if (window.confirm("¿Seguro que deseas reiniciar tu progreso y restaurar la Biblioteca de Ohara desde cero?")) {
      localStorage.removeItem("ohara_user_progress");
      setUser(null);
      setActiveChapter(null);
      setInPlacementExam(false);
      setExamFinished(false);
      setInQuiz(false);
      setViewingCertificate(null);
    }
  };

  // --- Handle Start Chapter Quiz ---
  const startChapterQuiz = () => {
    setInQuiz(true);
    setQuizIndex(0);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    setQuizCorrectCount(0);
    setQuizFinished(false);
  };

  // --- Handle Quiz Option Selection ---
  const handleQuizOptionClick = (idx: number) => {
    if (quizSubmitted) return;
    setSelectedQuizOption(idx);
  };

  // --- Submit Quiz Answer ---
  const submitQuizAnswer = () => {
    if (selectedQuizOption === null || !activeChapter) return;
    setQuizSubmitted(true);
    const currentQuestion = activeChapter.quiz[quizIndex];
    if (selectedQuizOption === currentQuestion.correctAnswer) {
      setQuizCorrectCount(prev => prev + 1);
    }
  };

  // --- Move to Next Quiz Question or Finish ---
  const nextQuizQuestion = () => {
    if (!activeChapter || !user) return;
    
    if (quizIndex < activeChapter.quiz.length - 1) {
      setQuizIndex(quizIndex + 1);
      setSelectedQuizOption(null);
      setQuizSubmitted(false);
    } else {
      // Finished Quiz!
      setQuizFinished(true);
      const wasPerfect = quizCorrectCount + (selectedQuizOption === activeChapter.quiz[quizIndex].correctAnswer ? 1 : 0) === activeChapter.quiz.length;
      const finalCorrect = quizCorrectCount + (selectedQuizOption === activeChapter.quiz[quizIndex].correctAnswer ? 1 : 0);
      
      const chapterCompleted = finalCorrect >= 1; // Need at least 1 correct to pass
      
      if (chapterCompleted) {
        // Unlock next chapter & update completions
        const isAlreadyCompleted = user.completedChapters.includes(activeChapter.id);
        const updatedCompleted = isAlreadyCompleted 
          ? user.completedChapters 
          : [...user.completedChapters, activeChapter.id];
        
        // Find next chapter
        const currentIndex = COURSE_CHAPTERS.findIndex(c => c.id === activeChapter.id);
        let nextChapterId = user.currentChapterId;
        if (currentIndex < COURSE_CHAPTERS.length - 1 && activeChapter.id === user.currentChapterId) {
          nextChapterId = COURSE_CHAPTERS[currentIndex + 1].id;
        }

        // Check overall certification conditions
        const allNormalPassed = COURSE_CHAPTERS.slice(0, 9).every(c => updatedCompleted.includes(c.id));
        const finalPassed = updatedCompleted.includes("laughtale");
        
        const pirateCertified = finalPassed || updatedCompleted.length >= 5;
        const archaeologistCertified = finalPassed || (allNormalPassed && updatedCompleted.includes("laughtale"));

        const bonusPoints = wasPerfect ? 150 : 80;

        const updatedUser: UserProgress = {
          ...user,
          completedChapters: updatedCompleted,
          currentChapterId: nextChapterId,
          restorationPoints: user.restorationPoints + bonusPoints,
          pirateCertified: pirateCertified,
          archaeologistCertified: archaeologistCertified,
          certifiedDate: (pirateCertified || archaeologistCertified) ? new Date().toLocaleDateString("es-ES") : user.certifiedDate
        };
        
        saveProgress(updatedUser);
      }
    }
  };

  // --- Render Avatar Icon ---
  const getAvatarIcon = (avatarId: string) => {
    const match = AVATARS.find(a => a.id === avatarId);
    return match ? match.icon : "🏴‍☠️";
  };

  const getAvatarName = (avatarId: string) => {
    const match = AVATARS.find(a => a.id === avatarId);
    return match ? match.name : "Explorador";
  };

  // --- Calculate restoration status text ---
  const getRestorationStatus = (points: number) => {
    if (points < 100) return { title: "Biblioteca Sumergida", desc: "Los libros permanecen empapados en el lago de Ohara. Se requiere rescate histórico.", color: "text-red-400" };
    if (points < 300) return { title: "Hojas Rescatadas", desc: "Varios volúmenes del Siglo Vacío han sido secados y catalogados en secreto.", color: "text-amber-400" };
    if (points < 600) return { title: "Cúpula de Lectura Reconstruida", desc: "El gran árbol de Ohara retoña hojas verdes. Los sabios vuelven a reunirse.", color: "text-sky-400" };
    if (points < 1000) return { title: "Archivos Sagrados Abiertos", desc: "Los Poneglyphs traducidos decoran las paredes del santuario recuperado.", color: "text-emerald-400" };
    return { title: "Restauración Absoluta de Ohara", desc: "¡El Árbol del Conocimiento brilla en todo su esplendor cósmico! La conspiración ha fracasado.", color: "text-purple-400" };
  };

  const restStatus = getRestorationStatus(user?.restorationPoints || 0);

  return (
    <div className="flex flex-col h-full bg-[#030712] border-l border-slate-800/80 w-full animate-in fade-in duration-300">
      
      {/* HEADER SECTION */}
      <div className="p-4 border-b border-slate-800/60 bg-slate-950/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/30 text-purple-400">
            <BookOpen className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-100 uppercase">
              Academia de Ohara
            </h2>
            <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">
              Restaurador de la Verdad e Historia Prohibida
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user && (
            <button
              onClick={handleResetProfile}
              className="p-1.5 hover:bg-slate-900 border border-transparent hover:border-slate-800 rounded text-slate-400 hover:text-slate-200 text-[10px] font-mono flex items-center gap-1 transition-all"
              title="Reiniciar Progreso de Ohara"
            >
              <RefreshCw className="w-3 h-3" /> Reiniciar
            </button>
          )}
          <button 
            onClick={onClose}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-xs text-slate-300 transition-all cursor-pointer"
          >
            Cerrar Academia
          </button>
        </div>
      </div>

      {/* REGISTRATION ENFORCEMENT */}
      {!user ? (
        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col justify-center items-center max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-block p-4 bg-purple-950/20 border border-purple-900/40 rounded-full text-purple-400">
              <Shield className="w-10 h-10 animate-bounce" style={{ animationDuration: '3s' }} />
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              REGISTRO EN EL GREMIO DE ARQUEÓLOGOS
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              El Gobierno Mundial vigila la red. Para acceder a la verdad prohibida y restaurar la Biblioteca del Conocimiento de Ohara, debes establecer tu perfil de disidente.
            </p>
          </div>

          <form onSubmit={handleRegister} className="w-full space-y-5 bg-slate-950/50 p-6 rounded-xl border border-slate-800/80">
            {/* Nickname */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                Nombre de Aventurero / Investigador
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Ej: Robin de las Ruinas..."
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  maxLength={25}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded text-xs text-slate-100 placeholder-slate-600 outline-none transition-all"
                />
              </div>
            </div>

            {/* Avatar picker */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                Selecciona tu Avatar de la Tripulación
              </label>
              <div className="grid grid-cols-5 gap-2">
                {AVATARS.map((avatar) => {
                  const isSel = selectedAvatar === avatar.id;
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.id)}
                      className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        isSel 
                          ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-950/50 scale-105' 
                          : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-900/80 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl">{avatar.icon}</span>
                      <span className="text-[9px] font-mono text-slate-400 truncate w-full text-center">
                        {avatar.id.toUpperCase()}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500 italic text-center mt-1">
                {AVATARS.find(a => a.id === selectedAvatar)?.description}
              </p>
            </div>

            {/* Starting Mode Selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                Modalidad de Inscripción
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRegMode('novice')}
                  className={`p-3 rounded-lg border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                    regMode === 'novice'
                      ? 'bg-sky-950/20 border-sky-500 text-sky-100'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    👒 Novato: Travesía desde 0
                  </span>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    Inicia el viaje original paso a paso, desbloqueando islas completando lecciones Duolingo.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRegMode('experienced')}
                  className={`p-3 rounded-lg border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                    regMode === 'experienced'
                      ? 'bg-purple-950/20 border-purple-500 text-purple-100'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    🪻 Examen de Ubicación
                  </span>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    Rinde un test global de 10 preguntas arqueológicas. ¡Si apruebas, desbloqueas todo de golpe!
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded text-slate-100 font-bold text-xs uppercase tracking-widest cursor-pointer shadow-lg shadow-purple-950/40 flex items-center justify-center gap-1.5 transition-all"
            >
              Iniciar mi Registro <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : inPlacementExam ? (
        // --- PLACEMENT EXAM UI ---
        <div className="flex-1 overflow-y-auto p-6 flex flex-col max-w-xl mx-auto justify-between h-full">
          {!examFinished ? (
            <div className="space-y-6 my-auto">
              {/* Header progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-purple-400 uppercase tracking-widest">
                  <span>Examen de Aptitud Histórica</span>
                  <span>Pregunta {examIndex + 1} de {PLACEMENT_EXAM.length}</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-300" 
                    style={{ width: `${((examIndex + 1) / PLACEMENT_EXAM.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question card */}
              <div className="bg-slate-950/80 p-6 rounded-xl border border-slate-800 space-y-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Cuestión de Análisis Cruzado</span>
                <h4 className="text-sm font-semibold text-slate-100 leading-relaxed">
                  {PLACEMENT_EXAM[examIndex].question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {PLACEMENT_EXAM[examIndex].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePlacementAnswer(idx)}
                    className="w-full text-left p-4 rounded bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all text-xs text-slate-200 leading-relaxed cursor-pointer flex items-center gap-3 group"
                  >
                    <span className="w-6 h-6 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-mono flex items-center justify-center group-hover:border-purple-500 group-hover:text-purple-400 transition-all">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // --- EXAM FINISHED SCREEN ---
            <div className="space-y-6 my-auto text-center">
              <div className="inline-block p-4 bg-purple-950/20 border border-purple-900/40 rounded-full text-purple-400 mb-2">
                <Trophy className="w-12 h-12 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 uppercase">
                Examen Completado
              </h3>
              
              <div className="bg-slate-950/80 p-6 rounded-xl border border-slate-800 inline-block w-full max-w-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Tu Puntaje Global</div>
                <div className="text-4xl font-extrabold text-purple-400 my-2">
                  {placementResultScore} / {PLACEMENT_EXAM.length}
                </div>
                <div className="text-xs text-slate-300 mt-3 font-medium">
                  {placementResultScore >= 8 
                    ? "¡IMPRESIONANTE! Posees el conocimiento de un Arqueólogo de Nivel Superior. Se te han concedido todos los salvoconductos."
                    : "Un puntaje notable, mas el misterio del Siglo Vacío es profundo. Recomendamos consolidar la verdad histórica viajando con los Sombreros de Paja."}
                </div>
              </div>

              <div className="space-y-2 max-w-sm mx-auto">
                {placementResultScore >= 8 ? (
                  <button
                    onClick={() => {
                      setInPlacementExam(false);
                      setActiveChapter(COURSE_CHAPTERS[9]); // Laugh Tale unlocked!
                    }}
                    className="w-full py-2 bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 rounded text-slate-100 font-bold text-xs uppercase tracking-widest cursor-pointer shadow-lg flex items-center justify-center gap-1.5 transition-all"
                  >
                    Navegar a Laugh Tale <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setInPlacementExam(false);
                      setActiveChapter(COURSE_CHAPTERS[0]); // Start at Alabasta
                    }}
                    className="w-full py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 rounded text-slate-100 font-bold text-xs uppercase tracking-widest cursor-pointer shadow-lg flex items-center justify-center gap-1.5 transition-all"
                  >
                    Empezar la Travesía en Alabasta <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setInPlacementExam(false);
                    setExamFinished(false);
                    // Force novice resetting
                    const resetUser: UserProgress = {
                      ...user!,
                      mode: 'novice',
                      currentChapterId: 'alabasta',
                      completedChapters: [],
                      placementScore: null
                    };
                    saveProgress(resetUser);
                  }}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-400 hover:text-slate-200 text-xs font-mono transition-all"
                >
                  Volver a Modo Novato paso a paso
                </button>
              </div>
            </div>
          )}
        </div>
      ) : activeChapter ? (
        // --- DETAILED LESSON & INTERACTIVE QUIZ VIEW ---
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Back to map button */}
          <button
            onClick={() => setActiveChapter(null)}
            className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-slate-100 uppercase tracking-widest transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Mapa de Cursos
          </button>

          {/* Chapter Intro Banner */}
          <div className="relative p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                Materia del Despertar Arqueológico
              </span>
              <h3 className="text-lg md:text-xl font-bold text-slate-100 flex items-center gap-2">
                Isla {COURSE_CHAPTERS.findIndex(c => c.id === activeChapter.id) + 1}: {activeChapter.title}
              </h3>
              <p className="text-xs text-slate-400 italic">
                "{activeChapter.islandName}"
              </p>
            </div>
            
            {user.completedChapters.includes(activeChapter.id) && (
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono rounded-full flex items-center gap-1.5 uppercase font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Materia Superada
              </span>
            )}
          </div>

          {/* DUAL PERSPECTIVE READING COMPREHENSION */}
          {!inQuiz ? (
            <div className="space-y-6">
              
              {/* Perspective 1: One Piece */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2 pb-1 border-b border-sky-950/50">
                  <Skull className="w-4.5 h-4.5" /> 📖 En el Canon de One Piece (Ficción)
                </h4>
                <div className="bg-sky-950/5 border border-sky-900/20 p-4 rounded-xl text-xs text-slate-300 leading-relaxed shadow-inner">
                  {activeChapter.lesson.onePieceLore}
                </div>
              </div>

              {/* Perspective 2: Our Real World */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 pb-1 border-b border-amber-950/50">
                  <Globe className="w-4.5 h-4.5" /> 🌍 En la Realidad Geopolítica y Arqueológica
                </h4>
                <div className="bg-amber-950/5 border border-amber-900/20 p-4 rounded-xl text-xs text-slate-300 leading-relaxed shadow-inner">
                  {activeChapter.lesson.realWorldAnalogy}
                </div>
              </div>

              {/* Evidences lists */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 pb-1 border-b border-emerald-950/50">
                  <Eye className="w-4.5 h-4.5" /> 🔍 Pruebas del Puente de Ambas Realidades
                </h4>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-2.5">
                  {activeChapter.lesson.keyEvidences.map((evidence, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-900/60 text-[10px] font-mono text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{evidence}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connections of Two Planes */}
              <div className="bg-gradient-to-r from-purple-950/20 to-slate-950 border border-purple-900/30 p-4 rounded-xl space-y-2">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold block">
                  Conexión Hermética
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeChapter.lesson.connectionConcept}
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    Nodos del Oráculo asociados:
                  </span>
                  {activeChapter.unlockedAtNodes.map(nodeId => {
                    const matchedNode = nodesData.find(n => n.id === nodeId);
                    return (
                      <button
                        key={nodeId}
                        onClick={() => onFocusNode(nodeId)}
                        className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[9px] font-mono text-purple-400 rounded hover:text-purple-300 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <ExternalLink className="w-2.5 h-2.5" /> {matchedNode ? matchedNode.title : nodeId}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quiz Invitation Card */}
              <div className="p-6 bg-slate-950 border border-purple-900/30 rounded-xl text-center space-y-4">
                <div className="max-w-md mx-auto space-y-2">
                  <h5 className="text-sm font-bold text-slate-100 uppercase tracking-tight">
                    ¿Estás listo para el Examen de la Materia?
                  </h5>
                  <p className="text-xs text-slate-400">
                    Acepta el desafío del gremio para evaluar tu comprensión. Se requiere superar el test para permitir que el barco de los Sombreros de Paja navegue a la siguiente isla.
                  </p>
                </div>
                <button
                  onClick={startChapterQuiz}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded text-slate-100 font-bold text-xs uppercase tracking-widest cursor-pointer shadow-lg flex items-center justify-center gap-1.5 transition-all mx-auto"
                >
                  Rendir Examen <FileText className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            // --- INSIDE CHAPTER QUIZ ---
            <div className="space-y-6">
              {!quizFinished ? (
                <div className="space-y-6">
                  {/* Header progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono text-purple-400 uppercase tracking-widest">
                      <span>Evaluación de {activeChapter.title}</span>
                      <span>Pregunta {quizIndex + 1} de {activeChapter.quiz.length}</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-purple-500 h-full transition-all duration-300" 
                        style={{ width: `${((quizIndex + 1) / activeChapter.quiz.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-900 space-y-2">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Pregunta del Arqueólogo</span>
                    <h5 className="text-xs font-bold text-slate-200 leading-relaxed">
                      {activeChapter.quiz[quizIndex].question}
                    </h5>
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    {activeChapter.quiz[quizIndex].options.map((option, idx) => {
                      const isSelected = selectedQuizOption === idx;
                      const isCorrect = idx === activeChapter.quiz[quizIndex].correctAnswer;
                      let optionStyle = "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-900";
                      
                      if (quizSubmitted) {
                        if (isCorrect) {
                          optionStyle = "bg-emerald-950/40 border-emerald-500 text-emerald-200";
                        } else if (isSelected) {
                          optionStyle = "bg-red-950/40 border-red-500 text-red-200";
                        } else {
                          optionStyle = "bg-slate-900/20 border-slate-900 text-slate-500 opacity-60";
                        }
                      } else if (isSelected) {
                        optionStyle = "bg-purple-950/40 border-purple-500 text-purple-100 scale-[1.01]";
                      }

                      return (
                        <button
                          key={idx}
                          disabled={quizSubmitted}
                          onClick={() => handleQuizOptionClick(idx)}
                          className={`w-full text-left p-3.5 rounded-lg border text-xs leading-relaxed transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] flex-shrink-0 mt-0.5 ${
                            isSelected ? 'bg-purple-500 text-slate-950' : 'bg-slate-950 text-slate-400'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Explanation */}
                  {quizSubmitted && (
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-1.5 animate-in fade-in">
                      <div className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                        Explicación Histórica de Robin:
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed italic">
                        "{activeChapter.quiz[quizIndex].explanation}"
                      </p>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex justify-end pt-2">
                    {!quizSubmitted ? (
                      <button
                        onClick={submitQuizAnswer}
                        disabled={selectedQuizOption === null}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed rounded text-slate-100 font-bold text-xs uppercase tracking-widest cursor-pointer transition-all shadow-md shadow-purple-950/30"
                      >
                        Enviar Respuesta
                      </button>
                    ) : (
                      <button
                        onClick={nextQuizQuestion}
                        className="px-6 py-2 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 rounded text-slate-100 font-bold text-xs uppercase tracking-widest cursor-pointer transition-all shadow-md"
                      >
                        {quizIndex < activeChapter.quiz.length - 1 ? "Siguiente Pregunta" : "Finalizar Examen"}
                      </button>
                    )}
                  </div>

                </div>
              ) : (
                // --- CHAPTER QUIZ FINISHED ---
                <div className="text-center p-6 space-y-5">
                  <div className="inline-block p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-full text-emerald-400">
                    <Award className="w-10 h-10 animate-bounce" />
                  </div>
                  <div className="space-y-1.5">
                    <h5 className="text-md font-bold text-slate-100 uppercase">
                      Examen de {activeChapter.title} Completado
                    </h5>
                    <p className="text-xs text-slate-400">
                      Has respondido correctamente a {quizCorrectCount} de {activeChapter.quiz.length} preguntas.
                    </p>
                  </div>

                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900 max-w-sm mx-auto">
                    {quizCorrectCount >= 1 ? (
                      <div className="space-y-1">
                        <div className="text-emerald-400 font-bold text-xs">¡APROBADO!</div>
                        <p className="text-[11px] text-slate-400">
                          Se han rescatado valiosos tomos de Ohara. Se te conceden puntos de restauración para reconstruir el gran Árbol del Conocimiento. ¡Tu barco Sunny ya puede navegar!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="text-red-400 font-bold text-xs">NO APROBADO</div>
                        <p className="text-[11px] text-slate-400">
                          No lograste responder correctamente. Te sugerimos repasar las evidencias antes de volver a intentarlo para consolidar el despertar.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center gap-3 max-w-sm mx-auto">
                    {quizCorrectCount >= 1 ? (
                      <button
                        onClick={() => {
                          setInQuiz(false);
                          setActiveChapter(null); // Return to map
                        }}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-100 font-bold text-xs uppercase tracking-widest cursor-pointer rounded transition-all"
                      >
                        Volver al Mapa de Cursos
                      </button>
                    ) : (
                      <button
                        onClick={startChapterQuiz}
                        className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-slate-100 font-bold text-xs uppercase tracking-widest cursor-pointer rounded transition-all"
                      >
                        Reintentar Examen
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : viewingCertificate ? (
        // --- PRINTABLE CERTIFICATE VIEWER ---
        <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col items-center">
          <button
            onClick={() => setViewingCertificate(null)}
            className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-slate-100 uppercase tracking-widest transition-colors cursor-pointer self-start"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a la Academia
          </button>

          {/* Styled Certificate */}
          <div 
            id="printable-certificate" 
            className="w-full max-w-lg bg-[#f4ebd0] text-[#1e293b] p-8 md:p-12 rounded-xl shadow-2xl relative border-8 border-double border-[#8c6d31] space-y-8 select-text font-serif"
            style={{
              backgroundImage: "radial-gradient(circle, #f9f6f0 0%, #ecdcb9 100%)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
            }}
          >
            {/* Compass rose watermark in background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
            </div>

            {/* Seals and Headers */}
            <div className="text-center space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8c6d31] font-bold">
                Alianza Libre de Exploradores y Arqueólogos
              </div>
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#5c3e0b] font-serif">
                {viewingCertificate === 'pirate' ? 'PATENTE DE PIRATA SOBERANO' : 'CÓDICE DE ARQUEÓLOGO DE OHARA'}
              </h2>
              <div className="text-[11px] font-mono italic text-slate-600">
                "Caelum et Terra et Mare Unum Sunt"
              </div>
            </div>

            {/* Certification Body */}
            <div className="text-center space-y-6">
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed max-w-sm mx-auto">
                Por cuanto el portador de esta credencial ha desafiado de forma consciente las corrientes del engaño masivo y completado con valor los hitos geofísicos y cognitivos del Oráculo Oculto.
              </p>

              <div className="space-y-1">
                <div className="text-xs text-slate-500 font-mono uppercase tracking-wider">Se confiere con honor el título de:</div>
                <div className="text-xl md:text-2xl font-bold text-[#8c6d31] font-serif uppercase tracking-wider border-b-2 border-dashed border-[#8c6d31]/40 pb-2 max-w-xs mx-auto">
                  {user.username}
                </div>
                <div className="text-xs font-mono text-slate-600 mt-1">
                  En representación del Avatar: <span className="font-bold">{getAvatarName(user.avatar)}</span> {getAvatarIcon(user.avatar)}
                </div>
              </div>

              <p className="text-xs text-slate-700 max-w-md mx-auto">
                {viewingCertificate === 'pirate' 
                  ? "Reconocido formalmente como un tripulante insumiso que comprende que el One Piece es la desarticulación de todas las fronteras artificiales de la Tierra para dar inicio a la Era de la Libertad."
                  : "Declarado como Custodio Honorario de la Biblioteca de Ohara, con pleno albedrío para interpretar la lengua prohibida de los Poneglyphs y difundir la verdad geofísica y geopolítica en nuestra realidad."}
              </p>
            </div>

            {/* Date and signatures */}
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-[#8c6d31]/30">
              <div className="text-center space-y-1">
                <div className="text-[14px] font-mono italic text-[#8c6d31] font-bold">
                  {user.certifiedDate || new Date().toLocaleDateString("es-ES")}
                </div>
                <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                  Fecha de Consagración
                </div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-[14px] font-serif italic text-slate-800 font-bold font-mono">
                  {viewingCertificate === 'pirate' ? 'Gol D. Roger' : 'Profesor Clover'}
                </div>
                <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                  Firma del Gran Maestre
                </div>
              </div>
            </div>

            {/* Serial code */}
            <div className="text-center text-[8px] font-mono text-slate-400 uppercase tracking-widest pt-4">
              CODICE REGISTRO: OHARA-{user.username.toUpperCase().substring(0, 3)}-{Math.floor(100000 + Math.random() * 900000)}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 rounded text-slate-100 font-bold text-xs uppercase tracking-widest cursor-pointer shadow-lg flex items-center gap-1.5 transition-all"
            >
              <Download className="w-4 h-4" /> Imprimir / PDF
            </button>
            <button
              onClick={() => setViewingCertificate(null)}
              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 text-xs font-mono transition-all"
            >
              Volver
            </button>
          </div>
        </div>
      ) : (
        // --- MAIN ACADEMY MAP & DASHBOARD ---
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          
          {/* USER PROGRESS BANNER & OHARA STATUS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Profile Info */}
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-950/20 border border-purple-500/30 rounded-xl flex items-center justify-center text-4xl shadow-inner relative">
                <span>{getAvatarIcon(user.avatar)}</span>
                <span className="absolute -bottom-1.5 -right-1.5 p-1 bg-purple-600 border border-slate-950 text-[8px] font-mono text-slate-100 uppercase rounded-full">
                  LVL {user.completedChapters.length + 1}
                </span>
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="text-[9px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                  Estudiante de Ohara • {user.mode === 'novice' ? 'Modo Novato' : 'Modo Ubicado'}
                </div>
                <h4 className="text-md font-bold text-slate-100 truncate">
                  {user.username}
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[9px] font-mono text-slate-400 uppercase bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                    Materias: {user.completedChapters.length} / {COURSE_CHAPTERS.length}
                  </span>
                  <span className="text-[9px] font-mono text-amber-400 uppercase bg-amber-950/10 px-1.5 py-0.5 rounded border border-amber-900/20">
                    Puntos: {user.restorationPoints} XP
                  </span>
                </div>
              </div>
            </div>

            {/* Ohara Tree Restoration Status */}
            <div className="p-4 bg-gradient-to-br from-slate-950 to-slate-900/50 rounded-xl border border-slate-850 space-y-2">
              <div className="flex justify-between items-center text-[9px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                <span>Nivel de Restauración de Ohara</span>
                <span>{user.restorationPoints} XP</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${restStatus.color}`}>{restStatus.title}</span>
                  <span className="text-[9px] font-mono text-slate-500">Max: 1000 XP</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-purple-500 via-sky-400 to-emerald-400 h-full transition-all duration-500" 
                    style={{ width: `${Math.min((user.restorationPoints / 1000) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                {restStatus.desc}
              </p>
            </div>

          </div>

          {/* DUAL CERTIFICATION CARD HUB */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" /> Diplomas y Acreditaciones del Despertar
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Pirate Certificate */}
              <div className={`p-3.5 rounded-lg border flex flex-col justify-between gap-3 ${
                user.pirateCertified 
                  ? 'bg-amber-950/10 border-amber-500/40' 
                  : 'bg-slate-900/30 border-slate-800/60 opacity-60'
              }`}>
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold flex items-center gap-1">
                    <Skull className="w-3.5 h-3.5" /> Patente Sinarquista
                  </div>
                  <h5 className="text-xs font-bold text-slate-100 uppercase">Certificado de Pirata Soberano</h5>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Concedido por completar al menos 5 materias del Grand Line histórico.
                  </p>
                </div>
                {user.pirateCertified ? (
                  <button
                    onClick={() => setViewingCertificate('pirate')}
                    className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] font-mono uppercase rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Visualizar Certificado
                  </button>
                ) : (
                  <span className="text-[9px] font-mono text-slate-500 block text-center uppercase tracking-widest bg-slate-900 py-1 rounded border border-slate-850">
                    <Lock className="w-3 h-3 inline mr-1" /> Bloqueado (Sigue navegando)
                  </span>
                )}
              </div>

              {/* Archaeologist Certificate */}
              <div className={`p-3.5 rounded-lg border flex flex-col justify-between gap-3 ${
                user.archaeologistCertified 
                  ? 'bg-purple-950/10 border-purple-500/40' 
                  : 'bg-slate-900/30 border-slate-800/60 opacity-60'
              }`}>
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" /> Cóndice del Siglo Vacío
                  </div>
                  <h5 className="text-xs font-bold text-slate-100 uppercase">Arqueólogo de la Verdad de Ohara</h5>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Concedido al superar el Examen de Ubicación o dominar todas las materias.
                  </p>
                </div>
                {user.archaeologistCertified ? (
                  <button
                    onClick={() => setViewingCertificate('archaeologist')}
                    className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-slate-100 font-bold text-[10px] font-mono uppercase rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Visualizar Cóndice
                  </button>
                ) : (
                  <span className="text-[9px] font-mono text-slate-500 block text-center uppercase tracking-widest bg-slate-900 py-1 rounded border border-slate-850">
                    <Lock className="w-3 h-3 inline mr-1" /> Bloqueado (Domina la historia)
                  </span>
                )}
              </div>

            </div>
          </div>

          {/* DUOLINGO-STYLE INTERACTIVE SVG MAP */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Anchor className="w-4 h-4 text-sky-400" /> Mapa de Navegación del Sunny
                </h4>
                <p className="text-[10px] text-slate-400">
                  Haz clic sobre las islas habilitadas para abrir la lección y rendir examen.
                </p>
              </div>
              <div className="text-[9px] font-mono text-sky-400 bg-sky-950/10 px-2 py-1 rounded border border-sky-900/20 uppercase font-bold flex items-center gap-1">
                <Flame className="w-3 h-3" /> Sunny rumbo a: {COURSE_CHAPTERS.find(c => c.id === user.currentChapterId)?.title || "Laugh Tale"}
              </div>
            </div>

            {/* The Map Stage Canvas */}
            <div className="relative w-full aspect-[16/8] bg-[#02050e] border border-slate-850 rounded-lg overflow-hidden flex items-center justify-center shadow-inner">
              
              {/* Sea Waves / Grid background inside map */}
              <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" style={{
                backgroundImage: "radial-gradient(circle, #0e1e38 1px, transparent 1px)",
                backgroundSize: "15px 15px"
              }}></div>

              {/* Responsive SVG Map */}
              <svg 
                viewBox="0 0 1500 400" 
                className="w-full h-full select-none"
              >
                {/* Dashed Navigation Route connecting all islands */}
                <path 
                  d="M 150 200 C 220 160, 230 160, 300 160 C 370 160, 380 220, 450 220 C 520 220, 510 260, 580 260 C 650 260, 650 190, 720 190 C 790 190, 770 260, 840 260 C 910 260, 890 190, 960 190 C 1030 190, 1010 260, 1080 260 C 1150 260, 1140 190, 1210 190 C 1280 190, 1280 150, 1350 150" 
                  stroke="#38bdf8" 
                  strokeWidth="3" 
                  strokeDasharray="8, 8" 
                  fill="none" 
                  className="opacity-40"
                />

                {/* Render chapter endpoints */}
                {COURSE_CHAPTERS.map((chapter, index) => {
                  const isCompleted = user.completedChapters.includes(chapter.id);
                  const isCurrent = user.currentChapterId === chapter.id;
                  
                  // In novice mode, subsequent islands are locked
                  const isUnlocked = isCompleted || isCurrent || user.completedChapters.length >= index;
                  
                  // Coordinate adjustments based on custom cubic path
                  const coords = [
                    { x: 150, y: 200 }, // Alabasta
                    { x: 300, y: 160 }, // Skypiea
                    { x: 450, y: 220 }, // Water 7
                    { x: 580, y: 260 }, // Thriller Bark
                    { x: 720, y: 190 }, // Sabaody / Marineford
                    { x: 840, y: 260 }, // Fishman Island
                    { x: 960, y: 190 }, // Dressrosa
                    { x: 1080, y: 260 }, // Wano
                    { x: 1210, y: 190 }, // Egghead
                    { x: 1350, y: 150 }, // Laugh Tale
                  ];
                  
                  const pt = coords[index];
                  
                  return (
                    <g key={chapter.id} className="cursor-pointer">
                      
                      {/* Selection Glow Indicator */}
                      {isCurrent && (
                        <circle 
                          cx={pt.x} 
                          cy={pt.y} 
                          r="25" 
                          fill="none" 
                          stroke="#a78bfa" 
                          strokeWidth="2" 
                          className="animate-[ping_2s_infinite]"
                        />
                      )}

                      {/* Main Island Node */}
                      <circle 
                        cx={pt.x} 
                        cy={pt.y} 
                        r="18" 
                        onClick={() => {
                          if (isUnlocked) {
                            setActiveChapter(chapter);
                          } else {
                            alert("¡Esta isla está resguardada por la flota del Gobierno! Debes aprobar los exámenes de las materias anteriores para permitir el zarpe del Sunny.");
                          }
                        }}
                        fill={isCompleted ? "#064e3b" : isCurrent ? "#581c87" : isUnlocked ? "#1e293b" : "#0f172a"}
                        stroke={isCompleted ? "#10b981" : isCurrent ? "#a78bfa" : isUnlocked ? "#38bdf8" : "#334155"}
                        strokeWidth="2.5"
                        className="transition-all duration-300 hover:scale-110"
                      />

                      {/* Completed Badge Indicator */}
                      {isCompleted ? (
                        <circle cx={pt.x + 12} cy={pt.y - 12} r="7" fill="#10b981" />
                      ) : !isUnlocked ? (
                        <circle cx={pt.x + 12} cy={pt.y - 12} r="7" fill="#334155" />
                      ) : null}

                      {/* Completed Check icon or Lock icon */}
                      {isCompleted ? (
                        <text x={pt.x + 12} y={pt.y - 9} textAnchor="middle" fill="#030712" fontSize="8px" fontWeight="bold">✓</text>
                      ) : !isUnlocked ? (
                        <text x={pt.x + 12} y={pt.y - 9} textAnchor="middle" fill="#94a3b8" fontSize="7px" fontWeight="bold">🔒</text>
                      ) : null}

                      {/* Ship Icon overlay (Only if it's the current active island) */}
                      {isCurrent && (
                        <g transform={`translate(${pt.x - 14}, ${pt.y - 40})`} className="animate-bounce">
                          {/* Little ship silhouette */}
                          <path d="M 4 20 L 24 20 L 28 12 L 0 12 Z" fill="#b45309" stroke="#1e293b" strokeWidth="1" />
                          <path d="M 12 12 L 12 2 L 20 6 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
                          {/* Strawhat banner */}
                          <circle cx="15" cy="5" r="1.5" fill="#e11d48" />
                        </g>
                      )}

                      {/* Island label */}
                      <text 
                        x={pt.x} 
                        y={pt.y + 32} 
                        textAnchor="middle" 
                        fill={isCurrent ? "#a78bfa" : isUnlocked ? "#cbd5e1" : "#475569"} 
                        fontSize="9px" 
                        fontWeight="bold"
                        fontFamily="monospace"
                        className="uppercase tracking-wider select-none pointer-events-none"
                      >
                        {chapter.title}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Fleet lock warning overlay */}
              <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded border border-slate-800 text-[8px] font-mono text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
                Mar del Despertar Libre
              </div>
            </div>
          </div>

          {/* LIST OF TOPICS AS ALTERNATIVE VIEW */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Códices Disponibles en la Cúpula de Lectura
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {COURSE_CHAPTERS.map((chapter, index) => {
                const isCompleted = user.completedChapters.includes(chapter.id);
                const isCurrent = user.currentChapterId === chapter.id;
                const isUnlocked = isCompleted || isCurrent || user.completedChapters.length >= index;

                return (
                  <button
                    key={chapter.id}
                    disabled={!isUnlocked}
                    onClick={() => setActiveChapter(chapter)}
                    className={`w-full text-left p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                      isCurrent 
                        ? 'bg-purple-950/20 border-purple-500 shadow-lg shadow-purple-950/40' 
                        : isCompleted
                        ? 'bg-emerald-950/10 border-emerald-900/40 hover:border-emerald-700'
                        : isUnlocked
                        ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-950 border-slate-900 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-lg border flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${
                        isCurrent 
                          ? 'bg-purple-950 text-purple-400 border-purple-800' 
                          : isCompleted
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-900'
                          : 'bg-slate-950 text-slate-400 border-slate-850'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="space-y-0.5 truncate flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-200 uppercase truncate">
                            {chapter.title}
                          </span>
                          {isCompleted && (
                            <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-1 py-0.2 rounded font-mono font-bold uppercase tracking-wider">
                              Aprobada
                            </span>
                          )}
                          {isCurrent && (
                            <span className="text-[8px] bg-purple-500/10 border border-purple-500/30 text-purple-400 px-1 py-0.2 rounded font-mono font-bold uppercase tracking-wider animate-pulse">
                              Actual
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate leading-normal">
                          {chapter.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isUnlocked ? (
                        <ChevronRight className={`w-5 h-5 ${isCurrent ? 'text-purple-400' : 'text-slate-500'}`} />
                      ) : (
                        <Lock className="w-4.5 h-4.5 text-slate-700" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
