export interface CrossConnection {
  id: string;
  label: string;
  family: string;
}

export interface NodeData {
  id: string;
  title: string;
  category: "grand_line" | "mundo_real" | "puentes" | "cuestiones";
  categoryLabel: string;
  categoryColor: string;
  level: number;
  levelName: string;
  summary: string;
  inOnePiece: string;
  inRealWorld: string;
  evidence: string[];
  crossConnections: CrossConnection[];
  criticalNote: string;
  tags: string[];
  x: number;
  y: number;
}

export const nodesData: NodeData[] = [
  // ================= ISLAND 1: GRAND LINE (One Piece) =================
  {
    id: "gobierno_mundial",
    title: "Gobierno Mundial",
    category: "grand_line",
    categoryLabel: "GRAND LINE",
    categoryColor: "#38bdf8",
    level: 1,
    levelName: "Nivel 1: Periferia Externa",
    summary: "La coalición de 170 naciones gobernada en las sombras por el Gorosei e Imu-sama, que mantiene un control absoluto sobre la información y la historia.",
    inOnePiece: "Institución central que erradica cualquier investigación del Siglo Vacío. Borraron el nombre del Reino Antiguo y ejecutan 'Buster Calls' de forma implacable contra los disidentes.",
    inRealWorld: "Se asemeja a las teorías de un gobierno global en la sombra, agencias de inteligencia internacionales, logias selectas y organismos no electos que moldean la historia oficial para mantener el statu quo.",
    evidence: [
      "La censura inmediata del nombre del Reino Antiguo por parte del Gorosei en el caso del profesor Clover.",
      "La existencia del Trono Vacío en Mary Geoise, ocupado en secreto por la entidad divina Imu-sama.",
      "El control absoluto de la prensa y las comunicaciones mundiales a través del presidente de los periódicos, Morgans."
    ],
    crossConnections: [
      { id: "elite_global", label: "Élite Global", family: "MUNDO REAL" },
      { id: "control_narrativa", label: "Control de la Narrativa", family: "PUENTES" }
    ],
    criticalNote: "ESPECULATIVO: Imu representa la personificación de la cúspide piramidal que las élites reales aspiran a consolidar de manera silenciosa, usando ejércitos títeres para ocultar el mando absoluto.",
    tags: ["Poder", "Censura", "Gorosei", "Imu"],
    x: 140,
    y: 150
  },
  {
    id: "siglo_vacio",
    title: "Siglo Vacío",
    category: "grand_line",
    categoryLabel: "GRAND LINE",
    categoryColor: "#38bdf8",
    level: 1,
    levelName: "Nivel 1: Periferia Externa",
    summary: "Un vacío de 100 años en la historia (hace 800-900 años) completamente borrado de los registros oficiales por el Gobierno Mundial.",
    inOnePiece: "El periodo donde ocurrió la gran guerra de escala planetaria que dio origen al orden mundial actual. Toda mención, registro o estudio de esta era está penada con la pena de muerte.",
    inRealWorld: "Vinculado a la hipótesis del tiempo fantasma o a los periodos oscuros y cataclísmicos de la historia humana donde grandes imperios y civilizaciones enteras desaparecieron de los registros convencionales sin dejar rastro directo.",
    evidence: [
      "La ausencia total de documentos escritos de esta era en cualquier biblioteca tradicional del mundo.",
      "La política de exterminio inmediato contra arqueólogos independientes en cualquier mar.",
      "La prohibición global impuesta bajo amenaza militar de descifrar o estudiar la escritura antigua."
    ],
    crossConnections: [
      { id: "censura_arqueologica", label: "Censura Arqueológica", family: "MUNDO REAL" },
      { id: "ocultamiento_conocimiento", label: "Ocultamiento del Conocimiento", family: "PUENTES" }
    ],
    criticalNote: "ESPECULATIVO: El olvido no fue un accidente de la erosión histórica, sino una erradicación sistemática mediante fuego, sangre y mitos para legitimar el derecho divino de los vencedores.",
    tags: ["Historia", "Tabú", "Gran Guerra"],
    x: 560,
    y: 140
  },
  {
    id: "poneglyph",
    title: "Poneglyphs",
    category: "grand_line",
    categoryLabel: "GRAND LINE",
    categoryColor: "#38bdf8",
    level: 2,
    levelName: "Nivel 2: Misterio Desvelado",
    summary: "Monolitos de piedra indestructibles creados por el clan Kozuki de Wano que contienen la verdadera historia del mundo en una escritura prohibida.",
    inOnePiece: "Existen tres tipos: históricos (información del pasado), de ruta/Road (coordenadas para Laugh Tale) e instructivos. Son el único testimonio físico incorruptible del Siglo Vacío.",
    inRealWorld: "Comparables a la Piedra de Rosetta, las tablillas de arcilla sumerias o las estelas egipcias grabadas en granito y basalto, diseñadas para preservar registros dinásticos o astronómicos a través de catástrofes.",
    evidence: [
      "Su manufactura con una aleación mineral de extrema dureza que ninguna tecnología metalúrgica actual de la Marina puede rayar o erosionar.",
      "Escritos en un idioma ideográfico que solo unos pocos eruditos perseguidos logran interpretar."
    ],
    crossConnections: [
      { id: "monolitos", label: "Monolitos Ancestrales", family: "MUNDO REAL" },
      { id: "tecnologia_perdida", label: "Tecnología Perdida", family: "PUENTES" }
    ],
    criticalNote: "ESPECULATIVO: La inscripción de verdades en piedra indestructible sugiere que los soberanos antiguos sabían que la inundación de su mundo era inminente e irreversible.",
    tags: ["Piedra", "Wano", "Criptografía"],
    x: 220,
    y: 290
  },
  {
    id: "ohara",
    title: "Ohara",
    category: "grand_line",
    categoryLabel: "GRAND LINE",
    categoryColor: "#38bdf8",
    level: 2,
    levelName: "Nivel 2: Misterio Desvelado",
    summary: "La isla de arqueólogos que albergaba el legendario Árbol del Conocimiento, destruida hasta los cimientos mediante una Buster Call.",
    inOnePiece: "Ohara poseía la mayor concentración de eruditos históricos del mundo. El profesor Clover y su equipo lograron deducir el nombre del Reino Antiguo justo antes de ser bombardeados.",
    inRealWorld: "Evoca la trágica quema de la Biblioteca de Alejandría, la destrucción de la Casa de la Sabiduría de Bagdad o la quema de códices mayas por la Inquisición, erradicando siglos de memoria colectiva.",
    evidence: [
      "El acto desesperado de los arqueólogos arrojando los libros antiguos al lago en el centro de la isla mientras los barcos cañoneaban.",
      "La supervivencia de Nico Robin como la única portadora viva de las técnicas arqueológicas prohibidas."
    ],
    crossConnections: [
      { id: "censura_arqueologica", label: "Censura Arqueológica", family: "MUNDO REAL" },
      { id: "control_narrativa", label: "Control de la Narrativa", family: "PUENTES" }
    ],
    criticalNote: "ESPECULATIVO: El conocimiento no compartido es inofensivo; pero en el momento en que se intenta descifrar el origen del poder soberano, el estado responde con fuerza letal.",
    tags: ["Biblioteca", "Buster Call", "Eruditos"],
    x: 480,
    y: 290
  },
  {
    id: "reino_antiguo",
    title: "Reino Antiguo",
    category: "grand_line",
    categoryLabel: "GRAND LINE",
    categoryColor: "#38bdf8",
    level: 3,
    levelName: "Nivel 3: El Núcleo del Pasado",
    summary: "Una civilización extremadamente avanzada y próspera que existió durante el Siglo Vacío y fue borrada por la alianza de los 20 reinos fundadores.",
    inOnePiece: "Poseían un entendimiento científico fabuloso, capaz de manipular la gravedad, crear robots autónomos y canalizar recursos infinitos. Su doctrina de libertad amenazaba la soberanía absolutista.",
    inRealWorld: "Representa el mito clásico y universal de la Edad de Oro, la civilización primigenia de gran avance tecnológico que precedió a nuestra era y es tachada de mito por la arqueología dogmática.",
    evidence: [
      "La tecnología de la isla científica de Egghead, la cual Vegapunk confiesa que es solo un intento primitivo de emular el pasado.",
      "El gigante de hierro ancestral que asaltó Mary Geoise hace 200 años, impulsado por una energía desconocida imposible de replicar hoy."
    ],
    crossConnections: [
      { id: "atlantida", label: "Atlántida", family: "MUNDO REAL" },
      { id: "tecnologia_perdida", label: "Tecnología Perdida", family: "PUENTES" }
    ],
    criticalNote: "ESPECULATIVO: El Reino Antiguo no era un reino en el sentido convencional, sino una confederación pacífica de pueblos libres que compartían recursos globales.",
    tags: ["Egghead", "Tecnología", "Utopía"],
    x: 260,
    y: 190
  },
  {
    id: "ancient_weapons",
    title: "Armas Ancestrales",
    category: "grand_line",
    categoryLabel: "GRAND LINE",
    categoryColor: "#38bdf8",
    level: 3,
    levelName: "Nivel 3: El Núcleo del Pasado",
    summary: "Tres armas de inmenso poder de destrucción masiva capaces de asolar el planeta: Plutón, Poseidón y Urano.",
    inOnePiece: "Diseñadas o domesticadas por el Reino Antiguo. Plutón es un barco de guerra colosal acorazado; Poseidón es la habilidad heredada de comandar reyes marinos; Urano permanece bajo misterio total.",
    inRealWorld: "Un paralelo directo a las descripciones mitológicas de tecnologías destructivas celestiales (los Vimanas hindúes, el arca de la alianza, el rayo de Tesla) o el equilibrio geopolítico por armas nucleares de disuasión.",
    evidence: [
      "Los planos de Plutón custodiados celosamente por los constructores navales de Water 7 durante siglos.",
      "La princesa Shirahoshi manifestando la habilidad de comunicarse con las bestias del abismo marino bajo una firma genética predeterminada."
    ],
    crossConnections: [
      { id: "tesla", label: "Nikola Tesla", family: "MUNDO REAL" },
      { id: "energia_libre", label: "Energía Libre", family: "PUENTES" }
    ],
    criticalNote: "ESPECULATIVO: Las armas no fueron creadas originalmente para hacer la guerra, sino como herramientas masivas de terraformación geofísica para desmantelar barreras oceánicas.",
    tags: ["Plutón", "Poseidón", "Urano"],
    x: 440,
    y: 190
  },
  {
    id: "joy_boy",
    title: "Joy Boy",
    category: "grand_line",
    categoryLabel: "GRAND LINE",
    categoryColor: "#38bdf8",
    level: 4,
    levelName: "Nivel 4: Maestría Inicial",
    summary: "Figura legendaria del Siglo Vacío, primer usuario de la fruta Gomu Gomu despertada en su forma de Dios del Sol Nika, heraldo de la liberación.",
    inOnePiece: "Dejó un testimonio de disculpa en la Isla Gyojin por romper su promesa de elevar el arca Noah. Prometió regresar al cabo de 800 años, cuando el mundo esté listo.",
    inRealWorld: "Encarna el arquetipo mesiánico y solar del libertador presente en múltiples mitologías paganas y tradiciones religiosas de redención social (como el rey Arturo, Quetzalcóatl o divinidades solares de la libertad).",
    evidence: [
      "El Poneglyph de disculpa dirigido a la antigua princesa sirena en las profundidades oceánicas.",
      "Los cantos rítmicos de los tambores de la liberación que resuenan en los corazones de los pueblos oprimidos."
    ],
    crossConnections: [
      { id: "unificacion_humanidad", label: "Unificación de la Humanidad", family: "PUENTES" },
      { id: "oda_insider", label: "¿Oda es un insider?", family: "META" }
    ],
    criticalNote: "ESPECULATIVO: Joy Boy no representa un linaje genético selecto, sino un estado de consciencia indomable que se activa en momentos de máxima opresión sistémica.",
    tags: ["Nika", "Mesías", "Profecía", "Liberación"],
    x: 290,
    y: 250
  },
  {
    id: "will_of_d",
    title: "La Voluntad de D.",
    category: "grand_line",
    categoryLabel: "GRAND LINE",
    categoryColor: "#38bdf8",
    level: 4,
    levelName: "Nivel 4: Maestría Inicial",
    summary: "Un misterioso linaje o voluntad heredada compartida por individuos catalogados por los autoproclamados Dioses como 'Enemigos Naturales'.",
    inOnePiece: "Los portadores de la letra 'D' causan grandes tempestades políticas allá donde van. El Gobierno se encarga de censurar el nombre del Rey de los Piratas (Gold Roger en lugar de Gol D. Roger) para silenciar la marca.",
    inRealWorld: "Asimilable a las teorías sobre dinastías disidentes, herejías proscritas por las iglesias del poder o líneas sanguíneas revolucionarias destinadas a quebrantar la servidumbre de las masas.",
    evidence: [
      "La inusual reacción de los portadores (Luffy, Ace, Saul, Roger) sonriendo con paz absoluta ante la inminencia de su ejecución.",
      "Las revelaciones crípticas de Rosinante sobre el pánico que causa la mención de la 'D' en la nobleza de Mary Geoise."
    ],
    crossConnections: [
      { id: "elite_global", label: "Élite Global", family: "MUNDO REAL" },
      { id: "ocultamiento_conocimiento", label: "Ocultamiento del Conocimiento", family: "PUENTES" }
    ],
    criticalNote: "ESPECULATIVO: La 'D' podría simbolizar la palabra Dawn (Amanecer) u Half-circle (La Luna que brilla en la noche), un recordatorio genético de desobediencia al orden solar corrupto del Gobierno Mundial.",
    tags: ["Linaje", "Destino", "Rebelión"],
    x: 410,
    y: 250
  },
  {
    id: "raftel",
    title: "Raftel / Laugh Tale",
    category: "grand_line",
    categoryLabel: "GRAND LINE",
    categoryColor: "#38bdf8",
    level: 5,
    levelName: "Nivel 5: Maestría Absoluta",
    summary: "La mítica y esquiva última isla del Grand Line, inaccesible mediante cartas de navegación estándar o brújulas de aguja magnética.",
    inOnePiece: "Bautizada por Gol D. Roger tras arribar a su costa y estallar en risas frente al registro completo del Siglo Vacío, el origen de los mares y el destino inexorable de la humanidad.",
    inRealWorld: "Equivale a los reinos legendarios de Agartha, Shambhala o las tierras boreales libres de invierno, descritos como refugios de altísimo conocimiento resguardados por anomalías meteorológicas y magnéticas de la Tierra.",
    evidence: [
      "La imposibilidad física de localizar la isla usando los Log Pose convencionales; requiere de la intersección exacta dibujada por los cuatro Road Poneglyphs.",
      "La risa desconcertante de la tripulación de Roger, que prefirió callar antes que iniciar una revolución prematura."
    ],
    crossConnections: [
      { id: "antartida", label: "Antártida", family: "MUNDO REAL" },
      { id: "unificacion_humanidad", label: "Unificación de la Humanidad", family: "PUENTES" }
    ],
    criticalNote: "ESPECULATIVO: Laugh Tale no es un trozo de tierra seco convencional, sino una coordenada geofísica resguardada por un torbellino magnético que se abre solo en conjunciones estelares específicas.",
    tags: ["Roger", "Fin del Camino", "Última Isla"],
    x: 320,
    y: 210
  },
  {
    id: "one_piece",
    title: "El One Piece",
    category: "grand_line",
    categoryLabel: "GRAND LINE",
    categoryColor: "#38bdf8",
    level: 5,
    levelName: "Nivel 5: Maestría Absoluta",
    summary: "El tesoro material definitivo dejado por Joy Boy en Laugh Tale, cuya futura revelación desatará una catástrofe bélica terminal.",
    inOnePiece: "Vegapunk confirmó públicamente al planeta que el One Piece es real, físico, y que su adquisición determinará si la corteza terrestre remanente se hunde por completo o emerge de las aguas.",
    inRealWorld: "Representa el catalizador del despertar colectivo: la revelación de una verdad de tal envergadura que volatiliza de forma instantánea el valor del dinero fiducitario y las estructuras gubernamentales.",
    evidence: [
      "La confesión de Barbablanca antes de su muerte, asegurando que el hallazgo del tesoro pondrá al mundo entero patas arriba.",
      "La desesperación de los Dragones Celestiales por movilizar sus flotas para impedir que cualquier pirata acceda a la verdad última."
    ],
    crossConnections: [
      { id: "energia_libre", label: "Energía Libre", family: "PUENTES" },
      { id: "tratado_antartico", label: "Tratado Antártico", family: "MUNDO REAL" }
    ],
    criticalNote: "ESPECULATIVO: El tesoro no es oro ni joyas, sino un mecanismo tecnológico ancestral capaz de drenar o unificar los océanos rompiendo el muro de la Red Line.",
    tags: ["Tesoro", "Fin de la Era", "Gran Guerra"],
    x: 380,
    y: 210
  },

  // ================= ISLAND 2: REAL WORLD (Conspiracies & History) =================
  {
    id: "elite_global",
    title: "Élite Global",
    category: "mundo_real",
    categoryLabel: "MUNDO REAL",
    categoryColor: "#fbbf24",
    level: 1,
    levelName: "Nivel 1: Periferia Externa",
    summary: "Cabal financiero, corporativo y dinástico que dicta la geopolítica, el flujo bancario centralizado y las políticas sanitarias globales tras bambalinas.",
    inOnePiece: "La viva representación de los Dragones Celestiales (Tenryubito) de Mary Geoise, quienes dominan el mundo considerándose dioses inalcanzables, inmunes a los delitos y ajenos al sufrimiento ordinario.",
    inRealWorld: "Familias dinásticas interconectadas, fundaciones billonarias libres de impuestos y comités privados no electos (Bilderberg, WEF) que guían de forma hermética la marcha económica y moral de las naciones.",
    evidence: [
      "La unificación de políticas bancarias a través del Banco de Pagos Internacionales (BPI) de Basilea.",
      "El monopolio de fondos de inversión como Vanguard y BlackRock en la estructura accionaria de casi todas las multinacionales farmacéuticas y de prensa masiva."
    ],
    crossConnections: [
      { id: "gobierno_mundial", label: "Gobierno Mundial", family: "GRAND LINE" },
      { id: "control_narrativa", label: "Control de la Narrativa", family: "PUENTES" }
    ],
    criticalNote: "ESPECULATIVO: La élite global no compite entre naciones; las guerras geopolíticas visibles son espectáculos teatrales para justificar el endeudamiento y el control ciudadano.",
    tags: ["Cabal", "Dinastías", "Mary Geoise"],
    x: 740,
    y: 150
  },
  {
    id: "censura_arqueologica",
    title: "Censura Arqueológica",
    category: "mundo_real",
    categoryLabel: "MUNDO REAL",
    categoryColor: "#fbbf24",
    level: 1,
    levelName: "Nivel 1: Periferia Externa",
    summary: "La desacreditación e incautación sistemática por parte de la academia oficial de vestigios físicos que amenazan el paradigma lineal evolutivo humano.",
    inOnePiece: "El aniquilamiento del Árbol del Conocimiento de Ohara y el borrado cartográfico de la isla para erradicar cualquier registro físico no aprobado del pasado común.",
    inRealWorld: "La desaparición u ocultación en sótanos inaccesibles de osamentas de proporciones gigantescas, escrituras anómalas e inventos tecnológicos pre-históricos incómodos para la antropología clásica.",
    evidence: [
      "Casos judiciales documentados contra museos nacionales estadounidenses forzados a admitir la destrucción de cráneos gigantes en el siglo XIX.",
      "La sistemática exclusión y bloqueo de fondos de investigación a geólogos que exponen evidencia de desgaste hidráulico en la Esfinge de Giza anterior al desierto."
    ],
    crossConnections: [
      { id: "siglo_vacio", label: "Siglo Vacío", family: "GRAND LINE" },
      { id: "ocultamiento_conocimiento", label: "Ocultamiento del Conocimiento", family: "PUENTES" }
    ],
    criticalNote: "ESPECULATIVO: Quien controla el origen y la antigüedad de la especie humana impone las pautas del comportamiento espiritual e intelectual moderno.",
    tags: ["Academia", "Dogma", "Supresión"],
    x: 1260,
    y: 150
  },
  {
    id: "piramides",
    title: "Pirámides Globales",
    category: "mundo_real",
    categoryLabel: "MUNDO REAL",
    categoryColor: "#fbbf24",
    level: 2,
    levelName: "Nivel 2: Misterio Desvelado",
    summary: "Complejos piramidales construidos con proporciones matemáticas avanzadas, alineación estelar perfecta y sillería ciclópea en continentes supuestamente incomunicados.",
    inOnePiece: "Se relaciona con el diseño arquitectónico imponente y misterioso de la ciudad santa de Mary Geoise o los palacios dinásticos que resistieron el gran cataclismo del Siglo Vacío.",
    inRealWorld: "La presencia inexplicable de pirámides orientadas astronómicamente en Egipto, México, China, Bosnia, Perú, Sudán e India, compartiendo técnicas constructivas con cortes milimétricos que impiden meter un papel entre bloques.",
    evidence: [
      "Alineaciones de la Gran Pirámide de Giza con la constelación de Orión y una desviación de apenas fracciones de grado del norte magnético real.",
      "El uso masivo de granito rico en cristales de cuarzo, cuyas propiedades piezoeléctricas sugieren funciones de transmisión de señales u oscilación de resonancia planetaria."
    ],
    crossConnections: [
      { id: "reino_antiguo", label: "Reino Antiguo", family: "GRAND LINE" },
      { id: "tecnologia_perdida", label: "Tecnología Perdida", family: "PUENTES" }
    ],
    criticalNote: "ESPECULATIVO: Las grandes pirámides no eran mausoleos funerarios primitivos, sino las plantas generadoras e intercomunicadoras de la red electromagnética terrestre de la civilización madre.",
    tags: ["Megalitismo", "Física Antigua", "Giza", "Orión"],
    x: 800,
    y: 280
  },
  {
    id: "monolitos",
    title: "Monolitos Ancestrales",
    category: "mundo_real",
    categoryLabel: "MUNDO REAL",
    categoryColor: "#fbbf24",
    level: 2,
    levelName: "Nivel 2: Misterio Desvelado",
    summary: "Rocas masivas talladas de una sola pieza que superan las 500 toneladas, transportadas a kilómetros de distancia y erigidas sin maquinaria aparente.",
    inOnePiece: "El origen de los Poneglyphs: rocas colosales moldeadas de forma inalterable y distribuidas por todo el globo terráqueo como marcas del pasado.",
    inRealWorld: "Ejemplos de ingeniería imposible como las piedras de cimiento de Baalbek en el Líbano, la roca de Sacsayhuamán en Cuzco, el obelisco inacabado de Asuán o la trilogía de estelas en Yangshan, China.",
    evidence: [
      "El Trilithon de Baalbek, tres bloques de granito tallado de 800 toneladas cada uno situados a gran altura sobre el templo de Júpiter.",
      "Cortes tridimensionales precisos en diorita y basalto con surcos microscópicos que delatan herramientas de rotación o fundición sónica."
    ],
    crossConnections: [
      { id: "poneglyph", label: "Poneglyphs", family: "GRAND LINE" },
      { id: "tecnologia_perdida", label: "Tecnología Perdida", family: "PUENTES" }
    ],
    criticalNote: "ESPECULATIVO: Los bloques monumentales de piedra no eran arrastrados por miles de esclavos con cuerdas de cáñamo; se utilizaba resonancia sónica localizada para neutralizar temporalmente la gravedad de la masa mineral.",
    tags: ["Baalbek", "Sónica", "Arquitectura Antigua"],
    x: 1200,
    y: 280
  },
  {
    id: "mito_diluvio",
    title: "Mito del Diluvio",
    category: "mundo_real",
    categoryLabel: "MUNDO REAL",
    categoryColor: "#fbbf24",
    level: 3,
    levelName: "Nivel 3: El Núcleo del Pasado",
    summary: "El testimonio unificado en la mitología de cientos de culturas originarias acerca de una catástrofe acuática que ahogó la geografía terrestre y extinguió a los gigantes.",
    inOnePiece: "La demoledora filtración científica de Vegapunk: el mar actual es el cementerio del Siglo Vacío; el nivel de las aguas subió 200 metros por el uso de armamento antiguo.",
    inRealWorld: "Cuentos populares idénticos sobre una inundación apocalíptica descrita por sumerios (Ziusudra), babilonios (Utnapishtim), hebreos (Noé), aztecas (Nata), griegos (Deucalión) e incas.",
    evidence: [
      "La coincidencia literaria y teológica de los textos sumerios y semitas tallados en cuneiforme miles de años antes de la compilación de la Biblia.",
      "La presencia de fósiles marinos frescos y gruesas capas de sedimentos aluviales en cordilleras de gran altitud como los Andes o el Himalaya."
    ],
    crossConnections: [
      { id: "siglo_vacio", label: "Siglo Vacío", family: "GRAND LINE" },
      { id: "unificacion_humanidad", label: "Unificación de la Humanidad", family: "PUENTES" }
    ],
    criticalNote: "ESPECULATIVO: El diluvio no fue un castigo divino moral, sino el resultado geofísico del colapso del dosel de vapor atmosférico o la fractura intencionada de acuíferos subterráneos hiperbáricos.",
    tags: ["Hundimiento", "Cataclismo", "Vegapunk", "Hancock"],
    x: 850,
    y: 190
  },
  {
    id: "younger_dryas",
    title: "El Younger Dryas",
    category: "mundo_real",
    categoryLabel: "MUNDO REAL",
    categoryColor: "#fbbf24",
    level: 3,
    levelName: "Nivel 3: El Núcleo del Pasado",
    summary: "Intervalo de cambio climático extremo y catastrófico hace 12,800 años que puso un abrupto fin a la última glaciación y reconfiguró los continentes.",
    inOnePiece: "El periodo turbulento de guerras mecánicas y reajustes continentales del Siglo Vacío que transformó un planeta de grandes masas continentales en un mar de archipiélagos aislados.",
    inRealWorld: "El súbito calentamiento seguido de un congelamiento glaciar express, provocado presuntamente por el impacto de múltiples fragmentos de un cometa contra el casquete polar norte, desencadenando inundaciones masivas.",
    evidence: [
      "La 'capa de límite del Younger Dryas', un estrato geológico mundial rico en platino, microesférulas de hierro y nanodiamantes de impacto espacial.",
      "El repentino colapso de la megafauna pleistocena y la súbita desaparición de la cultura arqueológica Clovis."
    ],
    crossConnections: [
      { id: "reino_antiguo", label: "Reino Antiguo", family: "GRAND LINE" },
      { id: "atlantida", label: "Atlántida", family: "MUNDO REAL" }
    ],
    criticalNote: "ESPECULATIVO: Este impacto fue la fuerza destructiva física que sumergió las redes de transmisión de energía inalámbrica globales, sumiendo al planeta en el lodo y la amnesia de la Edad de Piedra.",
    tags: ["Glaciación", "Impacto Espacial", "Geología"],
    x: 1150,
    y: 190
  },
  {
    id: "atlantida",
    title: "Atlántida",
    category: "mundo_real",
    categoryLabel: "MUNDO REAL",
    categoryColor: "#fbbf24",
    level: 4,
    levelName: "Nivel 4: Maestría Inicial",
    summary: "La célebre isla concéntrica descrita por Platón en sus diálogos de Timeo y Critias, poseedora de un imperio marítimo formidable y tecnologías místicas de aleación de metales.",
    inOnePiece: "La encarnación del Reino Antiguo gobernado por la dinastía D., cuyos restos sumergidos bajo el agua salada constituyen el verdadero lecho marino del Grand Line actual.",
    inRealWorld: "La narración platónica que sitúa a la Atlántida más allá de las Columnas de Hércules, organizada en tres anillos de agua y dos de tierra, con riquezas basadas en el Oricalco.",
    evidence: [
      "La Estructura de Richat en Mauritania (el Ojo del Sahara), cuyas dimensiones exactas (127 estadios), coloración mineral de rocas y manantiales térmicos concuerdan con la descripción de Platón.",
      "Las anomalías sumergidas de la carretera de Bimini y el triángulo de las Bermudas, que exhiben murallas pavimentadas regulares."
    ],
    crossConnections: [
      { id: "reino_antiguo", label: "Reino Antiguo", family: "GRAND LINE" },
      { id: "tecnologia_perdida", label: "Tecnología Perdida", family: "PUENTES" }
    ],
    criticalNote: "ESPECULATIVO: Atlántida no yace bajo el cieno del Océano Atlántico; su centro administrativo colapsó en África Occidental cuando el Sahara sufrió el reflujo violento del océano provocado por el Younger Dryas.",
    tags: ["Platón", "Richat", "Utopía", "Mitología"],
    x: 890,
    y: 250
  },
  {
    id: "antartida",
    title: "Secretos de la Antártida",
    category: "mundo_real",
    categoryLabel: "MUNDO REAL",
    categoryColor: "#fbbf24",
    level: 4,
    levelName: "Nivel 4: Maestría Inicial",
    summary: "El misterioso continente congelado en el extremo sur, el cual permanece sujeto a la mayor censura militar, científica y cartográfica de la era moderna.",
    inOnePiece: "El cinturón de calma (Calm Belt) poblado por titánicos reyes marinos que resguarda de forma impenetrable el mar interior del Grand Line.",
    inRealWorld: "Las declaraciones del almirante Richard Byrd sobre tierras inmensas sin explorar ricas en carbón y uranio más allá del polo, y el inmediato cerrojazo diplomático de las potencias mundiales tras su viaje.",
    evidence: [
      "Los mapas renacentistas como el de Piri Reis u Oronce Fine, que cartografían la geografía fluvial y montañosa de la Antártida libre de hielo milenios antes de su supuesto descubrimiento oficial.",
      "Las extrañas estructuras geométricas piramidales que sobresalen de las cordilleras heladas Shackleton analizadas por geólogos alternativos."
    ],
    crossConnections: [
      { id: "raftel", label: "Raftel / Laugh Tale", family: "GRAND LINE" },
      { id: "tratado_antartico", label: "Tratado Antártico", family: "MUNDO REAL" }
    ],
    criticalNote: "ESPECULATIVO: La Antártida no es un continente en la base esférica de la tierra, sino un monumental anillo exterior de hielo que retiene la masa hidráulica de nuestro plano oceánico.",
    tags: ["Hielo", "Byrd", "Anomalías", "Expedición"],
    x: 1110,
    y: 250
  },
  {
    id: "tratado_antartico",
    title: "Tratado Antártico",
    category: "mundo_real",
    categoryLabel: "MUNDO REAL",
    categoryColor: "#fbbf24",
    level: 5,
    levelName: "Nivel 5: Maestría Absoluta",
    summary: "Tratado internacional firmado en plena Guerra Fría que restringe permanentemente toda actividad militar o explotación civil autónoma en el polo sur.",
    inOnePiece: "La estricta prohibición impuesta por el Gobierno de navegar libremente por los confines del Calm Belt, manteniendo el monopolio de paso mediante tecnología de piedra marina (Kairoseki).",
    inRealWorld: "Un blindaje legal inaudito firmado por rivales nucleares (EE.UU., URSS) en 1959. Prohíbe de facto a particulares cruzar el paralelo 60 sur de manera independiente, so pena de incautación y prisión militar.",
    evidence: [
      "El desmantelamiento forzado e interceptación de expediciones de veleros civiles independientes que intentaron navegar las aguas antárticas sin escolta o permisos estatales especiales.",
      "La nula soberanía nacional declarada en el continente helado, el único territorio terrestre sin bandera civil oficial."
    ],
    crossConnections: [
      { id: "one_piece", label: "El One Piece", family: "GRAND LINE" },
      { id: "ocultamiento_conocimiento", label: "Ocultamiento del Conocimiento", family: "PUENTES" }
    ],
    criticalNote: "ESPECULATIVO: El Tratado Antártico fue diseñado para custodiar las fronteras de nuestro domo energético e impedir que la humanidad descubra que existen otros soles y civilizaciones florecientes en la corteza terrestre extendida.",
    tags: ["Leyes Polares", "Guerra Fría", "Censura Militar"],
    x: 970,
    y: 210
  },
  {
    id: "supresion_patentes",
    title: "Supresión de Patentes",
    category: "mundo_real",
    categoryLabel: "MUNDO REAL",
    categoryColor: "#fbbf24",
    level: 5,
    levelName: "Nivel 5: Maestría Absoluta",
    summary: "Mecanismo burocrático de defensa nacional que permite incautar inventos revolucionarios que devalúen el mercado de hidrocarburos o la red eléctrica nacional.",
    inOnePiece: "El complot del CP0 para silenciar la 'Madre Llama' de Vegapunk, erradicando al inventor para conservar la hegemonía de los Dragones Celestiales sobre los recursos del mundo.",
    inRealWorld: "La ley del Acta de Secreto de Invención (Invention Secrecy Act) de 1951 en los Estados Unidos, que clasifica de inmediato y archiva de por vida patentes de energía inalámbrica, motores autónomos o curas médicas disruptivas.",
    evidence: [
      "La clasificación activa por agencias de inteligencia de más de 6,200 patentes tecnológicas por 'amenazas directas a la seguridad económica e industrial'.",
      "Los misteriosos decesos o juicios por fraude sufridos por inventores que anunciaron plantas de electrólisis de agua de alta eficiencia (como Stanley Meyer)."
    ],
    crossConnections: [
      { id: "ancient_weapons", label: "Armas Ancestrales", family: "GRAND LINE" },
      { id: "energia_libre", label: "Energía Libre", family: "PUENTES" }
    ],
    criticalNote: "ESPECULATIVO: La escasez energética es un dogma inducido. La tecnología de la sobre-unidad y la energía libre ya existen en laboratorios subterráneos del consorcio militar global.",
    tags: ["Secreto", "Patentes", "Monopolios", "Banca"],
    x: 1030,
    y: 210
  },
  {
    id: "tesla",
    title: "Nikola Tesla",
    category: "mundo_real",
    categoryLabel: "MUNDO REAL",
    categoryColor: "#fbbf24",
    level: 5,
    levelName: "Nivel 5: Maestría Absoluta",
    summary: "Genio incomprendido de la electricidad que descubrió la forma de transmitir corriente inalámbrica ilimitada aprovechando el magnetismo y la ionosfera de la Tierra.",
    inOnePiece: "El alter ego histórico del Doctor Vegapunk y su red cerebral descentralizada Punk Records, diseñando una antena mundial para erradicar las guerras por recursos.",
    inRealWorld: "La construcción de la gigantesca torre de transmisión Wardenclyffe en Long Island, boicoteada y dinamitada por orden directa de la banca Morgan tras enterarse de que el aire no se podía privatizar con contadores.",
    evidence: [
      "La requisa masiva de todos los documentos, diarios íntimos y bobinas de Nikola Tesla tras su solitaria muerte en la habitación 3327 por la Oficina de Propiedades Extranjeras.",
      "La posterior desaparición de los archivos relacionados con el 'Rayo de la Muerte' de la órbita pública, quedando clasificados para el complejo aeroespacial."
    ],
    crossConnections: [
      { id: "ancient_weapons", label: "Armas Ancestrales", family: "GRAND LINE" },
      { id: "energia_libre", label: "Energía Libre", family: "PUENTES" }
    ],
    criticalNote: "ESPECULATIVO: Tesla redescubrió los secretos de resonancia armónica empleados en el antiguo Egipto. No inventó nada nuevo; simplemente decodificó la red del Reino Antiguo terrestre.",
    tags: ["Wardenclyffe", "Éter", "Magnetismo", "Corriente Alterna"],
    x: 1000,
    y: 250
  },

  // ================= ISLAND 3: BRIDGE ARCHIPELAGO (Connecting Islands) =================
  {
    id: "ocultamiento_conocimiento",
    title: "Ocultamiento del Conocimiento",
    category: "puentes",
    categoryLabel: "PUENTES",
    categoryColor: "#34d399",
    level: 3,
    levelName: "Nivel 3: El Núcleo de la Unión",
    summary: "Estrategia de compartimentación de datos históricos y científicos para mantener a la población esclava de una realidad fragmentada y falsa.",
    inOnePiece: "La separación intencionada de los textos históricos del Siglo Vacío por todo el mundo para evitar que un solo investigador ate cabos y amenace la monarquía papal.",
    inRealWorld: "La organización jerárquica de sociedades iniciáticas y agencias de inteligencia donde la información está sellada por grados, impidiendo que el eslabón de abajo sepa qué construye el de arriba.",
    evidence: [
      "El juramento de silencio exigido bajo amenaza física en ritos masónicos de alto rango y departamentos del Pentágono.",
      "La estricta catalogación por agencias de seguridad nacional que clasifica expedientes arqueológicos bajo el rotulo de seguridad diplomática."
    ],
    crossConnections: [
      { id: "siglo_vacio", label: "Siglo Vacío", family: "GRAND LINE" },
      { id: "censura_arqueologica", label: "Censura Arqueológica", family: "MUNDO REAL" }
    ],
    criticalNote: "ESPECULATIVO: No hay complots aislados; la supresión de la historia prohibida y la confiscación de energía libre son la misma agenda ejecutada por diferentes departamentos de la pirámide.",
    tags: ["Hermetismo", "Control", "Compartimentación"],
    x: 700,
    y: 550
  },
  {
    id: "control_narrativa",
    title: "Control de la Narrativa",
    category: "puentes",
    categoryLabel: "PUENTES",
    categoryColor: "#34d399",
    level: 3,
    levelName: "Nivel 3: El Núcleo de la Unión",
    summary: "El condicionamiento cognitivo de masas a través de los medios hegemónicos de entretenimiento y educación académica para ridiculizar de forma inmediata la verdad.",
    inOnePiece: "Morgans manipulando las portadas del diario oficial, convirtiendo al libertador Monkey D. Luffy en un despiadado demonio devorador de reinos ante los ojos del civil asustado.",
    inRealWorld: "El despliegue sistemático del término de descrédito 'Teórico de la Conspiración' diseñado originalmente por la división de guerra psicológica de la CIA en los años 60.",
    evidence: [
      "El memorando desclasificado de la CIA CIA-1035-960 que instruía a periodistas aliados a catalogar de maniáticos a quienes cuestionaran el informe de la comisión Warren.",
      "La homogeneidad editorial de las agencias de prensa mundiales (Reuters, AP) que distribuyen idénticos libretos a todos los telediarios del planeta."
    ],
    crossConnections: [
      { id: "gobierno_mundial", label: "Gobierno Mundial", family: "GRAND LINE" },
      { id: "elite_global", label: "Élite Global", family: "MUNDO REAL" }
    ],
    criticalNote: "ESPECULATIVO: La jaula más perfecta es aquella cuyos barrotes son invisibles, confeccionados con las mismas series de televisión, noticias de pánico y redes que la víctima consume con placer.",
    tags: ["Propaganda", "CIA", "Medios", "Desinformación"],
    x: 550,
    y: 590
  },
  {
    id: "tecnologia_perdida",
    title: "Tecnología Perdida",
    category: "puentes",
    categoryLabel: "PUENTES",
    categoryColor: "#34d399",
    level: 3,
    levelName: "Nivel 3: El Núcleo de la Unión",
    summary: "Conocimientos mecánicos, energéticos y biológicos de civilizaciones antediluvianas colapsadas que desafían el dogma de la evolución tecnológica humana.",
    inOnePiece: "Vegapunk admitiendo con amargura que su laboratorio flotante es una recreación torpe y rudimentaria de las maravillas científicas del Siglo Vacío de hace 900 años.",
    inRealWorld: "El hallazgo de artefactos mecánicos sofisticados, lentes ópticas microscópicas y fundición de metales inmunes a la corrosión enterrados bajo estratos de épocas pre-tecnológicas.",
    evidence: [
      "El mecanismo de Anticitera (siglo I a.C.), un ordenador de bronce de engranajes diferenciales capaz de rastrear tránsitos lunares y eclipses solares con precisión milimétrica.",
      "El pilar de hierro puro de Delhi, India, de más de 7 toneladas, que no ha presentado rastro de corrosión a la intemperie en más de 1,600 años."
    ],
    crossConnections: [
      { id: "reino_antiguo", label: "Reino Antiguo", family: "GRAND LINE" },
      { id: "piramides", label: "Pirámides Globales", family: "MUNDO REAL" }
    ],
    criticalNote: "ESPECULATIVO: La humanidad no avanza en línea recta; atravesamos periodos cíclicos de apogeo e involución inducida tras los cuales las dinastías reinantes resetean la tecnología disponible.",
    tags: ["Anacronismo", "Anticitera", "Arqueología Técnica"],
    x: 850,
    y: 590
  },
  {
    id: "energia_libre",
    title: "Energía Libre",
    category: "puentes",
    categoryLabel: "PUENTES",
    categoryColor: "#34d399",
    level: 4,
    levelName: "Nivel 4: Maestría Inicial",
    summary: "El concepto físico del éter universal, un mar inagotable de radiación de fondo del que se puede extraer electricidad infinita y limpia sin requerir la combustión fósil.",
    inOnePiece: "La 'Madre Llama' (Mother Flame) del Reino Antiguo, un sol artificial de energía inextinguible codiciado por el Gobierno Mundial para alimentar sus fortalezas voladoras.",
    inRealWorld: "La física éterica defendida por Tesla y Faraday, que contempla el universo como un sistema dinámico abierto lleno de potencial dieléctrico aprovechable mediante inductores de alta frecuencia.",
    evidence: [
      "Los planos y el prototipo funcional de la torre de energía inalámbrica Wardenclyffe de Tesla en Long Island.",
      "La exclusión sistemática del concepto del Éter de los libros de texto escolares oficiales tras el experimento Michelson-Morley para dar paso a la relatividad restrictiva."
    ],
    crossConnections: [
      { id: "one_piece", label: "El One Piece", family: "GRAND LINE" },
      { id: "tesla", label: "Nikola Tesla", family: "MUNDO REAL" }
    ],
    criticalNote: "ESPECULATIVO: La erradicación del éter en la física oficial no fue un avance de la ciencia pura, sino una maniobra bancaria para que toda la tecnología humana dependiese de recursos medibles e hidrocarburos.",
    tags: ["Bobinas", "Éter", "Vegapunk", "Abundancia"],
    x: 700,
    y: 460
  },
  {
    id: "unificacion_humanidad",
    title: "Unificación de la Humanidad",
    category: "puentes",
    categoryLabel: "PUENTES",
    categoryColor: "#34d399",
    level: 5,
    levelName: "Nivel 5: Maestría Absoluta",
    summary: "El romper definitivo de las murallas físicas, ideológicas y económicas impuestas por el sistema hegemónico para devolver a la especie a su equilibrio universal.",
    inOnePiece: "La demolición de la Línea Roja (Red Line), el muro continental artificial que segrega los mares, creando el 'All Blue' y permitiendo la unión de todas las razas de la Tierra.",
    inRealWorld: "El despertar espiritual colectivo de la humanidad, rebasando las falsas banderas políticas e identitarias nacionales para constituir una civilización soberana verdaderamente libre de deudas fiducitarias.",
    evidence: [
      "La profecía recurrente grabada en Wano y la isla Gyojin sobre el fin de los cielos oscuros y el retorno del gran sol que cobijará a todos los pueblos.",
      "El desmoronamiento paulatino del dogma mediático tradicional gracias a la interconexión directa de la conciencia humana digitalizada."
    ],
    crossConnections: [
      { id: "joy_boy", label: "Joy Boy", family: "GRAND LINE" },
      { id: "mito_diluvio", label: "Mito del Diluvio", family: "MUNDO REAL" }
    ],
    criticalNote: "ESPECULATIVO: La Red Line en One Piece es una gigantesca presa hidráulica y de control magnético. Desmantelarla es el fin geofísico de la escasez inducida en el globo terráqueo.",
    tags: ["All Blue", "Red Line", "Liberación", "Unión"],
    x: 700,
    y: 690
  },

  // ================= ISLAND 4: QUESTIONS & META-ANALYSIS =================
  {
    id: "oda_insider",
    title: "¿Eiichiro Oda es un Insider?",
    category: "cuestiones",
    categoryLabel: "META-CUESTIONES",
    categoryColor: "#a78bfa",
    level: 1,
    levelName: "Nivel 1: Periferia Externa",
    summary: "La asombrosa posibilidad de que el autor de One Piece pertenezca a círculos herméticos de revelación o disponga de documentos prohibidos de la historia oculta planetaria.",
    inOnePiece: "El manga ha plasmado con precisión casi quirúrgica anomalías geofísicas reales, dinámicas masónicas de poder y la supresión arqueológica de gigantes décadas antes de que fuesen debatidas abiertamente en foros alternativos.",
    inRealWorld: "La doctrina del 'Predictive Programming' o revelación por goteo en la literatura y el entretenimiento masivo, donde las corporaciones exponen trozos de verdades incómodas bajo el amparo de la ficción inofensiva.",
    evidence: [
      "La impresionante concordancia de la geografía circular del Grand Line con las anomalías magnéticas del ecuador terrestre.",
      "El uso preciso de simbología oculta masónica, cábala hebrea y mitología hermética egipcia plasmados en los estandartes del Gobierno Mundial."
    ],
    crossConnections: [
      { id: "joy_boy", label: "Joy Boy", family: "GRAND LINE" },
      { id: "control_narrativa", label: "Control de la Narrativa", family: "PUENTES" }
    ],
    criticalNote: "ESPECULATIVO: Oda actúa como un bardo de la era moderna: filtra la historia prohibida de nuestro plano terrestre para que millones de mentes despierten inconscientemente mediante el poder del mito de Nika.",
    tags: ["Oda", "Ficción Real", "Simbología", "Revelación"],
    x: 1220,
    y: 550
  },
  {
    id: "apofenia_patron",
    title: "Apofenia vs Patrón Real",
    category: "cuestiones",
    categoryLabel: "META-CUESTIONES",
    categoryColor: "#a78bfa",
    level: 2,
    levelName: "Nivel 2: Misterio Desvelado",
    summary: "El desafío psicológico de discernir entre la conexión fantasiosa de datos aislados y el descubrimiento de un patrón real silenciado por la academia dominante.",
    inOnePiece: "El pánico del Gobierno de que Clover unifique los puntos aislados del pasado; en el momento en que se conectan los Poneglyphs, la farsa de la Marina cae al instante.",
    inRealWorld: "La propensión humana al reconocimiento de patrones (apofenia). Al entrelazar la geología catastrófica, los monolitos imposibles y la geopolítica bancaria, emerge una red lógica ineludible.",
    evidence: [
      "El sesgo de confirmación donde el cerebro tiende a ignorar las anomalías que arruinan su hipótesis preferida.",
      "El desprecio sistemático de la antropología clásica que cataloga de locura cualquier puente interdisciplinario entre mitología antigua y astrofísica dura."
    ],
    crossConnections: [
      { id: "ocultamiento_conocimiento", label: "Ocultamiento del Conocimiento", family: "PUENTES" },
      { id: "siglo_vacio", label: "Siglo Vacío", family: "GRAND LINE" }
    ],
    criticalNote: "ESPECULATIVO: Atribuir a la mera casualidad o invención literaria el paralelismo milimétrico de la historia sumergida con la geofísica planetaria real es la verdadera psicosis inducida por el sistema educativo.",
    tags: ["Psicología", "Patrón", "Clover", "Materia Gris"],
    x: 1330,
    y: 640
  }
];
