export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation: string;
}

export interface LessonContent {
  onePieceLore: string;
  realWorldAnalogy: string;
  keyEvidences: string[];
  connectionConcept: string;
}

export interface CourseChapter {
  id: string;
  title: string;
  islandName: string;
  description: string;
  coordinates: { x: number; y: number }; // Relative coordinates for the 2D Duolingo-style map
  lesson: LessonContent;
  quiz: Question[];
  unlockedAtNodes: string[]; // Associated nodes from nodesData
}

export interface DiscoveredTreasure {
  id: string;
  name: string;
  type: 'comun' | 'unico';
  date: string;
  topic: string;
  description: string;
  restorationPointsAwarded: number;
}

export interface UserProgress {
  username: string;
  avatar: string; // 'luffy' | 'robin' | 'zoro' | 'nami' | 'chopper'
  mode: 'novice' | 'experienced';
  currentChapterId: string;
  completedChapters: string[];
  quizScores: Record<string, number>;
  placementScore: number | null;
  pirateCertified: boolean;
  archaeologistCertified: boolean;
  certifiedDate?: string;
  restorationPoints: number; // Points to visually rebuild the Tree of Ohara
  discoveredTreasures?: DiscoveredTreasure[];
}

export const AVATARS = [
  { id: "luffy", name: "Monkey D. Luffy", role: "Capitán", icon: "👒", description: "Guiado por su instinto insaciable de libertad. No quiere dominar nada, solo ser libre." },
  { id: "robin", name: "Nico Robin", role: "Arqueóloga", icon: "🪻", description: "Única superviviente del Árbol del Conocimiento. Descifradora de verdades prohibidas." },
  { id: "zoro", name: "Roronoa Zoro", role: "Espadachín", icon: "⚔️", description: "Disciplina férrea y honor indomable. Corta las mentiras de raíz." },
  { id: "nami", name: "Nami", role: "Navegante", icon: "🍊", description: "Cartógrafa astuta. Entiende que el clima y las corrientes ocultan rutas secretas." },
  { id: "chopper", name: "Tony Tony Chopper", role: "Médico", icon: "🌸", description: "Buscador de la panacea. Sana la ceguera cognitiva que sufre el mundo." },
];

export const PLACEMENT_EXAM: Question[] = [
  {
    id: "p1",
    question: "¿Qué representa el Siglo Vacío de One Piece en el marco histórico del Mundo Real?",
    options: [
      "La desaparición fortuita de registros durante la Edad de Bronce sin intencionalidad alguna.",
      "La supresión sistemática de imperios altamente avanzados y periodos históricos 'fantasma' por las narrativas vencedoras.",
      "Un invento netamente de ciencia ficción sin ningún paralelismo con la censura de textos antiguos.",
      "La caída del Imperio Romano explicada de forma alegórica."
    ],
    correctAnswer: 1,
    explanation: "El Siglo Vacío resuena con la hipótesis de periodos censurados de la historia humana, donde grandes cataclismos o purgas políticas de los conquistadores eliminaron bibliotecas enteras para reescribir el origen del poder."
  },
  {
    id: "p2",
    question: "La 'Voluntad de D.' se describe en el oráculo como el enemigo natural de los Dioses. En nuestra realidad, ¿a qué se asimila?",
    options: [
      "A una corporación transnacional que controla el mercado de valores.",
      "A dinastías de pensamiento libre, escuelas de misterios y herejías históricas proscritas por las iglesias del poder.",
      "A un gen letal que se hereda y acorta la vida del portador.",
      "A los descendientes directos de los caballeros templarios franceses únicamente."
    ],
    correctAnswer: 1,
    explanation: "La Voluntad de D. encarna el hilo conductor de la desobediencia civil y los linajes gnósticos/libertarios que desafían permanentemente las estructuras absolutistas y el dogmatismo oficial."
  },
  {
    id: "p3",
    question: "¿Cuál es el paralelo geopolítico del Gobierno Mundial en nuestro mundo real?",
    options: [
      "Un comité de aficionados a los cómics.",
      "El Fondo Monetario Internacional operando solo como asesor comercial.",
      "Organizaciones supranacionales, cabales dinásticos ocultos (estilo WEF o Bilderberg) que imponen directrices a naciones subordinadas.",
      "La Liga de Naciones de la Antigua Grecia."
    ],
    correctAnswer: 2,
    explanation: "El Gobierno Mundial, con el Gorosei a la cabeza, representa el control piramidal no electo donde 170 naciones ceden su soberanía real ante mandatos e hilos oligárquicos invisibles."
  },
  {
    id: "p4",
    question: "¿Qué tecnología científica en One Piece representa la 'Energía Infinita' de Tesla o el Éter?",
    options: [
      "La energía de combustión de carbón de Water 7.",
      "La energía del Reino Antiguo (como la fuente inagotable que alimenta a Egghead y al Gigante de Hierro).",
      "Las Frutas del Diablo artificiales creadas por Caesar Clown.",
      "La fuerza muscular de los Gyojin."
    ],
    correctAnswer: 1,
    explanation: "La energía del Reino Antiguo, descubierta por Vegapunk, es una analogía directa a la energía libre del éter teorizada por Nikola Tesla, que buscaba proveer electricidad ilimitada a toda la humanidad de forma gratuita."
  },
  {
    id: "p5",
    question: "Los Poneglyphs de piedra indestructible fueron fabricados por el Clan Kozuki. ¿Con qué enigma arquitectónico real se conectan?",
    options: [
      "Con los edificios de ladrillo de la Revolución Industrial.",
      "Con los monolitos megalíticos de extrema dureza (basalto, granito) tallados con precisión milimétrica imposibles de replicar con herramientas de cobre.",
      "Con esculturas románticas europeas de mármol pulido a mano.",
      "Con las tablillas de madera pintada de la Polinesia."
    ],
    correctAnswer: 1,
    explanation: "La extrema dureza y la inmortalidad de los Poneglyphs reflejan el misterio de los templos megalíticos (Sacsayhuamán, Ollantaytambo, Keops) tallados en diorita o granito, diseñados para resistir milenios y transmitir un mensaje petrificado."
  },
  {
    id: "p6",
    question: "La destrucción de Ohara representa el mayor golpe a la arqueología independiente en One Piece. ¿Qué tragedia real refleja?",
    options: [
      "La invasión normanda de Inglaterra.",
      "La pérdida de las bibliotecas de Alejandría, de los códices mayas por Diego de Landa y la Casa de la Sabiduría de Bagdad.",
      "La desaparición del teatro clásico de Shakespeare.",
      "La privatización de museos locales modernos."
    ],
    correctAnswer: 1,
    explanation: "La quema del Árbol del Conocimiento de Ohara emula perfectamente la quema sistemática de archivos históricos de civilizaciones derrotadas para imponer una sola verdad oficial, de la cual Nico Robin es la custodia solitaria."
  },
  {
    id: "p7",
    question: "El hundimiento global profetizado por Vegapunk (donde el nivel del mar subirá 200 metros) es un paralelismo con:",
    options: [
      "La sequía de lagos interiores en Asia central.",
      "La marea alta diaria de las islas del Pacífico.",
      "El cataclismo del Diluvio Universal y las teorías de deshielo abrupto al final del Joven Dryas (hace 11,600 años).",
      "La formación del mar Mediterráneo por erosión volcánica."
    ],
    correctAnswer: 2,
    explanation: "El gran cataclismo que hundió el Reino Antiguo y dejó al mundo de One Piece fragmentado en islas es un espejo del Diluvio de los mitos ancestrales mundiales y la elevación repentina del nivel del mar post-glaciación."
  },
  {
    id: "p8",
    question: "El Arca de Noah en las profundidades de la Isla Gyojin aguarda el día de la promesa. ¿Cuál es su correlato en nuestro planeta?",
    options: [
      "El Titanic hundido en el Atlántico Norte.",
      "El mito universal del Arca de Noé, Gilgamesh y Manu, que describe naves de rescate genético preservadas para repoblar el mundo tras inundaciones.",
      "Los submarinos nucleares modernos.",
      "Las flotas pesqueras de la antigua civilización fenicia."
    ],
    correctAnswer: 1,
    explanation: "El Arca Noah, construida por orden de Joy Boy, replica el arquetipo mitológico del arca de salvamento construida por mandato divino para resistir un cataclismo geofísico masivo."
  },
  {
    id: "p9",
    question: "¿Qué es el 'Tratado Antártico' según la interpretación de verdades cruzadas de Laugh Tale?",
    options: [
      "Un acuerdo comercial de exportación de hielo.",
      "La muralla militar real que impide el libre acceso y exploración del anillo polar más allá del paralelo 60, resguardando posibles secretos de continentes periféricos.",
      "Un tratado que obliga al uso de trajes térmicos obligatorios en los polos.",
      "Un acuerdo para evitar la caza de ballenas jorobadas."
    ],
    correctAnswer: 1,
    explanation: "En la especulación cognitiva, el Tratado Antártico actúa como el 'Red Line' o los guardianes de la Marina, bloqueando el tránsito civil libre hacia zonas que podrían contradecir el mapa oficial de la Tierra."
  },
  {
    id: "p10",
    question: "Para ser un verdadero Arqueólogo de Ohara en el mundo real, uno debe comprender que el 'One Piece' real es:",
    options: [
      "Un cofre con lingotes de oro fiduciario escondido en Suiza.",
      "La revelación de la historia prohibida, la energía libre y la unificación de los pueblos contra la tiranía invisible.",
      "Un cómic exclusivo firmado por Eiichiro Oda.",
      "Un pasaporte diplomático que permite viajar gratis por aeropuertos mundiales."
    ],
    correctAnswer: 1,
    explanation: "El One Piece es el catalizador del despertar colectivo: la unificación física y mental de la humanidad al desmantelar las fronteras artificiales, revelando que la energía infinita y la verdadera historia nos pertenecen a todos."
  }
];

export const COURSE_CHAPTERS: CourseChapter[] = [
  {
    id: "alabasta",
    title: "Alabasta",
    islandName: "Reino de la Arena y Tablillas Ocultas",
    description: "Inicia la travesía original del Grand Line siguiendo el desierto de Alabasta. Descubre la historia enterrada bajo la arena egipcia y las primeras pistas del arma Plutón.",
    coordinates: { x: 150, y: 150 },
    unlockedAtNodes: ["poneglyph", "ancient_weapons"],
    lesson: {
      onePieceLore: "En Alabasta, Crocodile intenta derrocar al rey Nefertari Cobra para localizar el Poneglyph real que revela la ubicación de Plutón, el barco acorazado de destrucción masiva. Cobra custodia este monolito en la tumba real, sabiendo que la revelación de este secreto destrozaría el equilibrio mundial.",
      realWorldAnalogy: "Al igual que Alabasta, el desierto de Egipto y el Medio Oriente custodian las mayores estructuras megalíticas del planeta. Los textos cuneiformes y las estelas de granito de la meseta de Giza sugieren un conocimiento astronómico y tecnológico colosal que los imperios posteriores ocultaron bajo leyendas, monopolizando el sacerdocio del saber histórico.",
      keyEvidences: [
        "Las estelas de basalto imposibles de desgastar por el viento del desierto.",
        "La dinastía Nefertari permaneciendo en la tierra en vez de ascender como Dragones Celestiales (Soberanos disidentes reales).",
        "La supresión de textos herméticos que datan de antes de las dinastías faraónicas oficiales."
      ],
      connectionConcept: "Egipto, al igual que Alabasta, es el guardián de una biblioteca de piedra que la arqueología oficial intenta etiquetar como mera ornamentación funeraria."
    },
    quiz: [
      {
        id: "q_ala_1",
        question: "¿Qué buscaba codiciosamente Crocodile en las ruinas de Alabasta?",
        options: [
          "Un tesoro de monedas de oro acumuladas en el casino Rain Dinners.",
          "El Poneglyph oculto en el mausoleo real que detalla la ubicación del arma Plutón.",
          "El secreto para controlar la fruta de arena de forma permanente.",
          "Un pacto secreto con el Ejército Revolucionario."
        ],
        correctAnswer: 1,
        explanation: "Crocodile conspiró para desatar una guerra civil solo para leer el Poneglyph que resguarda la ubicación de Plutón, demostrando cómo los cabales buscan apropiarse de tecnologías ancestrales silenciadas."
      },
      {
        id: "q_ala_2",
        question: "En nuestra realidad, ¿cuál es el paralelismo con la realeza disidente de los Nefertari, quienes no se mudaron a Mary Geoise?",
        options: [
          "Casas nobles que renunciaron al trono absoluto para proteger verdades sagradas junto a sus pueblos.",
          "Políticos modernos que olvidan sus promesas tras las elecciones.",
          "Líderes militares que organizan golpes de estado desde el extranjero.",
          "Comerciantes medievales que compraron títulos nobiliarios."
        ],
        correctAnswer: 0,
        explanation: "La familia de Vivi (Nefertari) fue la única de las 20 dinastías que rechazó el poder divino de Mary Geoise, simbolizando los linajes soberanos que eligieron el resguardo ético de la verdad en lugar de la tiranía global."
      }
    ]
  },
  {
    id: "skypiea",
    title: "Skypiea",
    islandName: "La Isla del Cielo y el Campanario Dorado",
    description: "Sube a través de la corriente Knock Up hacia las nubes de Skypiea. Investiga las civilizaciones devoradas por los cielos y los mitos de ciudades doradas ocultas.",
    coordinates: { x: 300, y: 120 },
    unlockedAtNodes: ["reino_antiguo", "atlantida"],
    lesson: {
      onePieceLore: "En Skypiea, los exploradores descubren Shandora, la ciudad de oro que fue lanzada al cielo por una corriente de presión geofísica masiva. Enel gobierna como un dios implacable gracias a su fruta eléctrica, planeando emigrar a la Luna (Fairy Vearth) con el Arca Maxim, destruyendo la civilización remanente.",
      realWorldAnalogy: "Shandora es el reflejo del mito de El Dorado, Paititi o las ciudades flotantes de los textos védicos. En nuestro mundo, existen rastros de sofisticación tecnológica aérea y astronómica en civilizaciones de alta montaña (los Andes, el Tíbet), cuyas obras megalíticas desafían la física de su tiempo e insinúan contacto con conocimientos celestes.",
      keyEvidences: [
        "El mapa de Jaya que encaja con la silueta de una calavera dividida (islas rotas por cataclismos terrestres).",
        "El Campanario de Oro cuya resonancia acústica servía para guiar a los navegantes en la niebla.",
        "Los petroglifos lunares de Skypiea que detallan la procedencia espacial de los autómatas y los recursos inagotables."
      ],
      connectionConcept: "Las nubes de Skypiea representan el velo de incredulidad de la masa humana: aquello que la ciencia declara imposible ('islas flotantes') es real, y requiere de una gran corriente de fe (Knock Up Stream) para ser presenciado."
    },
    quiz: [
      {
        id: "q_sky_1",
        question: "¿Por qué Shandora, la Ciudad de Oro, estaba en el cielo en lugar del océano?",
        options: [
          "Fue construida allí usando globos aerostáticos gigantes.",
          "Fue arrojada por una violenta erupción geofísica y corriente ascendente (Knock Up Stream) junto a la isla de Jaya.",
          "Es una ilusión óptica generada por el magnetismo de las nubes.",
          "Fue construida por el Dios Enel usando su poder eléctrico."
        ],
        correctAnswer: 1,
        explanation: "La mitad de la isla de Jaya fue eyectada al cielo por causas geofísicas anómalas, simbolizando cómo cataclismos masivos fracturan continentes e imperios, separando la verdad del mapa oficial."
      },
      {
        id: "q_sky_2",
        question: "¿Qué representa el viaje de Enel a la Luna (Fairy Vearth) en el arca tecnológica?",
        options: [
          "Un viaje de vacaciones ordinario.",
          "El escape de las élites corruptas (Dragones Celestiales) hacia refugios o bases fuera del alcance planetario de las masas, usando tecnología excluida al público.",
          "El final definitivo de la historia de One Piece.",
          "Una metáfora sobre los satélites de televisión."
        ],
        correctAnswer: 1,
        explanation: "Enel construyendo el Arca Maxim para viajar a la Luna con recursos expoliados representa el afán transhumanista de las élites corporativas reales de colonizar el espacio exterior abandonando la biosfera devastada."
      }
    ]
  },
  {
    id: "water7",
    title: "Water 7",
    islandName: "Metrópolis Fluvial y Diseños Perdidos",
    description: "Sigue la vía del tren marítimo Puffing Tom hasta la hermosa Water 7. Estudia los planos de ingeniería prohibidos y la lucha por evitar el hundimiento de la ciudad.",
    coordinates: { x: 450, y: 180 },
    unlockedAtNodes: ["ancient_weapons", "tesla"],
    lesson: {
      onePieceLore: "Water 7 es una ciudad que se hunde lentamente debido a la marea Aqua Laguna. Su historia está ligada a Tom, el legendario carpintero gyojin que guardó los planos secretos de Plutón y construyó el tren marítimo para reactivar la economía y romper el aislamiento marítimo impuesto por las flotas del Gobierno.",
      realWorldAnalogy: "Water 7 refleja a Venecia o la mítica Ámsterdam, enfrentando batallas continuas contra la inundación sistemática. Los planos secretos de Plutón custodiados por carpinteros representan los planos de patentes revolucionarias retenidas por la seguridad nacional o monopolios de energía para impedir que la sociedad construya su propio transporte soberano.",
      keyEvidences: [
        "El tren marítimo que corre sobre rieles acuáticos flotantes desafiando la geografía hostil del Grand Line.",
        "La existencia del CP9, el escuadrón secreto de inteligencia del Gobierno encargado de robar planos industriales mediante infiltración masiva."
      ],
      connectionConcept: "El gremio de constructores de Galley-La demuestra que la maestría técnica y la organización gremial libre son la mayor defensa contra el chantaje estatal."
    },
    quiz: [
      {
        id: "q_wat_1",
        question: "¿Qué organización clandestina gubernamental se infiltra en Water 7 durante cinco años para robar planos industriales?",
        options: [
          "El ejército revolucionario de Monkey D. Dragon.",
          "La tripulación de los piratas de Sombrero de Paja.",
          "El CP9 (Cipher Pol No. 9), la agencia de inteligencia oculta del Gobierno.",
          "La guardia real del Reino de Alabasta."
        ],
        correctAnswer: 2,
        explanation: "El CP9 operó bajo identidades falsas en el gremio de carpintería para apoderarse de planos militares, reflejando cómo agencias de espionaje del mundo real vigilan e incautan inventos tecnológicos revolucionarios."
      },
      {
        id: "q_wat_2",
        question: "¿Cuál es el paralelismo real de la marea destructiva anual 'Aqua Laguna'?",
        options: [
          "El cambio climático estándar de verano.",
          "El hundimiento paulatino de plataformas terrestres continentales e inundación provocada por manipulación geofísica deliberada.",
          "La evaporación estacional de los lagos de montaña.",
          "Los tifones comunes que ocurren en el sudeste asiático."
        ],
        correctAnswer: 1,
        explanation: "El Aqua Laguna que eleva gradualmente el nivel del mar ahogando a Water 7 es un reflejo de los cambios periódicos del nivel del océano provocados o acelerados por reajustes tectónicos sistémicos que inundan las costas del planeta."
      }
    ]
  },
  {
    id: "thrillerbark",
    title: "Thriller Bark",
    islandName: "Navío Fantasma y Cosecha de Almas",
    description: "Navega a través del Triángulo de Florian. Investiga las sombras robadas por Gecko Moria y cómo la deshumanización colectiva de las masas se asemeja al robo de almas.",
    coordinates: { x: 580, y: 220 },
    unlockedAtNodes: ["control_narrativa", "elite_global"],
    lesson: {
      onePieceLore: "En el Triángulo de Florian, el barco gigantesco Thriller Bark atrapa piratas para robar sus sombras y colocarlas en cuerpos inertes creados por el doctor Hogback. Moria extrae el 'poder motor' de la sombra humana para crear un ejército de zombies esclavos que no pueden tocar la luz solar sin desvanecerse.",
      realWorldAnalogy: "Esta es una representación del control mental y social, la desmoralización masiva donde se despoja al ciudadano de su identidad (su 'sombra' o alma) para transformarlo en un zombie productivo del sistema laboral. Al perder la luz de la consciencia crítica, el individuo actúa mecánicamente conforme a los algoritmos dictados por los arquitectos de masas.",
      keyEvidences: [
        "Las nieblas perpetuas del Triángulo de Florian que ocultan gigantescas sombras monstruosas mucho mayores que el propio Thriller Bark.",
        "Los zombies perdiendo todo recuerdo y voluntad original pero conservando sus habilidades mecánicas de combate al servicio del Amo."
      ],
      connectionConcept: "El despertar de la sombra requiere purificación con sal marina (símbolo universal del conocimiento depurado y la pureza química de la verdad)."
    },
    quiz: [
      {
        id: "q_thr_1",
        question: "¿Cómo utiliza Gecko Moria el poder de las sombras robadas?",
        options: [
          "Las vende a cambio de Berry en el mercado negro de Mary Geoise.",
          "Las implanta en zombies inertes para crear un ejército obrero/militar leal y sin voluntad propia.",
          "Las convierte en pociones de eterna juventud.",
          "Las devuelve a cambio de que se unan a su tripulación pacíficamente."
        ],
        correctAnswer: 1,
        explanation: "Al igual que el control mental televisivo y digital despoja de pensamiento crítico al individuo convirtiéndolo en un engranaje sumiso, Moria arrebata la sombra para instrumentalizar los cuerpos sin alma."
      },
      {
        id: "q_thr_2",
        question: "¿Qué elemento es capaz de purificar a los zombies y liberar las sombras de vuelta a sus dueños legítimos?",
        options: [
          "El fuego sagrado de Shandora.",
          "La sal marina (que purifica la mentira y rompe el contrato espiritual artificial).",
          "Un rayo directo del Dios Enel.",
          "Las espadas sagradas de Roronoa Zoro."
        ],
        correctAnswer: 1,
        explanation: "La sal marina, con sus propiedades alquímicas e iónicas de pureza terrestre, disuelve el lazo antinatural del contrato espiritual de Moria, representando cómo la verdad pura disuelve el velo ilusorio."
      }
    ]
  },
  {
    id: "sabaody_marineford",
    title: "Sabaody y Marineford",
    islandName: "Archipiélago de Burbujas y el Cénit de la Guerra",
    description: "Cruza Sabaody y vive el estallido de la cumbre en Marineford. Analiza el mercado de esclavos bajo burbujas de los nobles y la falsedad del veredicto militar.",
    coordinates: { x: 720, y: 150 },
    unlockedAtNodes: ["gobierno_mundial", "will_of_d"],
    lesson: {
      onePieceLore: "En Sabaody, los Tenryubito compran seres de distintas razas en subastas públicas con impunidad absoluta, respirando a través de burbujas para no mezclarse con el aire común. Poco después, Luffy ataca a un noble desatando la mayor crisis bélica en Marineford, donde el almirante Sengoku anuncia ejecuciones públicas televisadas bajo el lema de una 'Justicia Absoluta' que en realidad encubre el sacrificio de la verdad.",
      realWorldAnalogy: "Sabaody refleja la impunidad y aberración oligárquica, las redes de tráfico humano bajo el velo del silencio corporativo mundial. Por su parte, la Guerra de Marineford representa las operaciones militares televisadas que saturan el espectro mediático (teatro de guerra geopolítico) diseñadas para sembrar trauma masivo, consolidar presupuestos bélicos y distraer a las masas de la caída del orden global.",
      keyEvidences: [
        "El collar detonador de esclavos que estalla ante cualquier intento de fuga del perímetro divino.",
        "La manipulación de la transmisión de video por den-den mushi durante la guerra de Marineford para que el público civil solo vea lo que el Gobierno quiere justificar."
      ],
      connectionConcept: "La ejecución de Ace y la muerte de Barbablanca marcan el final de una era y revelan que la censura se agrieta cuando el propio rey de los piratas proclama la verdad al morir."
    },
    quiz: [
      {
        id: "q_sab_1",
        question: "¿Por qué los Dragones Celestiales (Tenryubito) usan cascos esféricos transparentes con aire purificado?",
        options: [
          "Sufren de alergias severas al polen de los manglares de Sabaody.",
          "Se consideran divinos y rechazan respirar el mismo aire contaminado por los humanos comunes (plebeyos).",
          "Para comunicarse directamente con el Gorosei de forma satelital.",
          "Como parte de un uniforme espacial militar obligatorio."
        ],
        correctAnswer: 1,
        explanation: "Esta burbuja representa el total divorcio cognitivo de las élites respecto de la humanidad, a la cual desprecian y consideran simples recursos de servidumbre."
      },
      {
        id: "q_sab_2",
        question: "Durante la Guerra de Marineford, ¿cuál fue la última y rotunda declaración de Barbablanca que aterrorizó al Gobierno Mundial?",
        options: [
          "¡La era de los piratas ha llegado a su fin!",
          "¡El One Piece existe realmente! (Despertando la voluntad global y agrietando el control de la información).",
          "¡La Marina ganará siempre esta guerra!",
          "¡He enterrado mi tesoro en el desierto de Alabasta!"
        ],
        correctAnswer: 1,
        explanation: "Su grito antes de morir desarmó décadas de propaganda de censura militar, reactivando la era pirata y obligando a miles a salir al mar a reclamar la soberanía del saber."
      }
    ]
  },
  {
    id: "gyojin",
    title: "Isla Gyojin",
    islandName: "Abismo Oceánico y el Voto Sagrado",
    description: "Desciende 10,000 metros bajo el mar. Estudia la xenofobia, los traumas transgeneracionales y la carta de disculpa del libertador Joy Boy.",
    coordinates: { x: 840, y: 220 },
    unlockedAtNodes: ["joy_boy", "one_piece"],
    lesson: {
      onePieceLore: "En la Isla Gyojin, en lo profundo del foso marino, los piratas encuentran una civilización discriminada de hombres-pez. En el Bosque del Mar descansa el Poneglyph de disculpa de Joy Boy escrito a Poseidón (la princesa sirena de hace 800 años) por no poder cumplir la promesa de guiar el Arca Noah a la superficie.",
      realWorldAnalogy: "Representa a los pueblos indígenas, razas marginadas y culturas ancestrales segregadas en reservas por los imperios dominantes. El foso de la Isla Gyojin encierra la memoria del trauma histórico y los pactos rotos por gobernantes del pasado, quienes mantuvieron a civilizaciones enteras confinadas tecnológicamente bajo el pretexto de su 'incompatibilidad'.",
      keyEvidences: [
        "El Árbol de Luz Solar Eva que transmite luz y aire directo desde la superficie hasta las profundidades abisales.",
        "El Arca colosal Noah diseñada con ingeniería naval prehistórica capaz de transportar a toda una civilización mediante reyes marinos."
      ],
      connectionConcept: "La emancipación de los pueblos oprimidos requiere el cumplimiento de las profecías de cooperación transcultural, representadas por el despertar de la princesa sirena."
    },
    quiz: [
      {
        id: "q_gyo_1",
        question: "¿A quién iba dirigida la única carta de disculpa escrita en piedra por Joy Boy hace 800 años?",
        options: [
          "Al profesor Clover del Árbol de Ohara.",
          "A la antigua princesa sirena Poseidón (por no poder elevar el Arca Noah a la superficie).",
          "Al monarca de Alabasta por la sequía masiva.",
          "Al rey de la dinastía de Wano."
        ],
        correctAnswer: 1,
        explanation: "Joy Boy grabó su arrepentimiento por haber fallado en el plan de unificación y liberación debido al asedio de la gran coalición totalitaria fundadora."
      },
      {
        id: "q_gyo_2",
        question: "El Arca Noah permanece inerte en el fondo. Alquímicamente, ¿con qué hito terrestre se asimila?",
        options: [
          "Los vestigios de la mitológica Arca de Noé y barcos colosales prehistóricos descritos en códices antediluvianos.",
          "La flota mercante del siglo XVII.",
          "Los arrecifes artificiales hechos de barcos petroleros desmantelados.",
          "Las góndolas fluviales de Venecia."
        ],
        correctAnswer: 0,
        explanation: "El Arca Noah es el arquetipo de la embarcación de rescate diseñada para sobrellevar la elevación cataclísmica de los océanos, preservando las especies vivientes de la catástrofe del pasado."
      }
    ]
  },
  {
    id: "dressrosa",
    title: "Dressrosa",
    islandName: "Reino de Juguetes y el Tirano de Hilos",
    description: "Entra al vibrante reino de Dressrosa. Investiga la doble realidad de juguetes vivientes y humanos felices gobernados bajo los hilos invisibles de Doflamingo.",
    coordinates: { x: 960, y: 150 },
    unlockedAtNodes: ["control_narrativa", "elite_global"],
    lesson: {
      onePieceLore: "Doflamingo gobierna Dressrosa enmascarando su crueldad bajo un circo de prosperidad artificial. Mediante el poder de la fruta de Sugar (Hobby-Hobby), borra la existencia y memoria de los ciudadanos rebeldes convirtiéndolos en juguetes de hojalata que trabajan gratis de noche, obligando a los humanos restantes a vivir en una felicidad superficial libre de recuerdos.",
      realWorldAnalogy: "Dressrosa es la representación perfecta de la disonancia cognitiva, la posverdad y los algoritmos de entretenimiento de Silicon Valley. Al ciudadano contemporáneo se le distrae con comodidades mientras se anestesia y borra su memoria histórica real. Quienes cuestionan las directrices oficiales son 'borrados cognitivamente' (cancelados socialmente) convirtiéndose en juguetes del sistema mediático.",
      keyEvidences: [
        "El coliseo Corrida que funciona como pan y circo para mantener a la población entretenida mientras la disidencia es encerrada.",
        "La fábrica de SMILE artificial oculta bajo tierra que produce falsos poderes acosta del sufrimiento biológico de los enanos Tontatta."
      ],
      connectionConcept: "El despertar ocurre cuando el titiritero es derrotado y las mentiras de hojalata caen, devolviendo de forma instantánea el recuerdo de todos los seres queridos que habían sido olvidados por decreto estatal."
    },
    quiz: [
      {
        id: "q_dre_1",
        question: "¿Qué ocurría con las personas convertidas en juguetes por la subordinada Sugar de Doflamingo?",
        options: [
          "Eran trasladados de vacaciones permanentes a otra isla.",
          "Se convertían en guerreros gigantes bajo el mando de los piratas Donquixote.",
          "Su existencia y recuerdos eran borrados por completo de la mente de todos sus amigos y familiares vivos.",
          "Se les daba un sueldo exorbitante para trabajar en el palacio real."
        ],
        correctAnswer: 2,
        explanation: "Sugar borraba el registro mental del disidente de la memoria de la sociedad, un paralelo brutal con la manipulación histórica y la cancelación sistémica que elimina voces incómodas de los motores de búsqueda modernos."
      },
      {
        id: "q_dre_2",
        question: "En Dressrosa, el Coliseo de Gladiadores sirve como distracción social masiva. En nuestro mundo esto equivale a:",
        options: [
          "La educación universitaria científica.",
          "El entretenimiento de masas, pan y circo, espectáculos vacíos diseñados para mantener dopada la atención colectiva.",
          "La práctica obligatoria de deportes de montaña.",
          "Los desfiles militares patrióticos organizados anualmente."
        ],
        correctAnswer: 1,
        explanation: "Doflamingo mantenía entretenido al pueblo con combates sangrientos en el coliseo para que no viesen el contrabando de armas de destrucción masiva y el sufrimiento de la mitad esclava de la isla."
      }
    ]
  },
  {
    id: "wano",
    title: "Wano",
    islandName: "Tierra de Samuráis y Forjadores Ancestrales",
    description: "Sube las cataratas de carpas gigantes hacia el cerrado reino de Wano. Estudia la herencia de los Kozuki, los canteros de los Poneglyphs y el aislacionismo político.",
    coordinates: { x: 1080, y: 220 },
    unlockedAtNodes: ["poneglyph", "monolitos"],
    lesson: {
      onePieceLore: "Wano es una nación protegida por barreras naturales geofísicas que se cerró al exterior hace 800 años para resguardar su saber del asedio del Gobierno. El clan Kozuki forjó los Poneglyphs grabándolos en basalto indestructible. El samurái Oden descubrió la verdad de la historia junto a Roger pero fue ejecutado por Kaido antes de poder cumplir el sueño de 'abrir las fronteras'.",
      realWorldAnalogy: "Wano representa la cultura tradicional, el conocimiento místico y las civilizaciones del Extremo Oriente (Japón imperial, China dinástica) que mantuvieron un hermetismo sagrado contra la penetración mercantil occidental. Los forjadores de espadas y grabadores de piedra de Wano reflejan los secretos perdidos de las escuelas de constructores de catedrales, quienes plasmaban códigos de geometría sagrada e ingeniería indestructible en roca sólida para burlar el paso de las eras oscuras.",
      keyEvidences: [
        "Las fronteras físicas cerradas por gigantescas murallas artificiales de piedra que inundaron el Wano antiguo bajo agua de lluvia.",
        "La maestría de herrería capaz de crear espadas de grado supremo que acumulan el haki espiritual del usuario a través de generaciones."
      ],
      connectionConcept: "Abrir las fronteras de Wano es un acto geopolítico y geofísico: requiere drenar el agua atrapada por las murallas y revelar el arma Plutón oculta en sus profundidades."
    },
    quiz: [
      {
        id: "q_wan_1",
        question: "¿Por qué el clan Kozuki de Wano decidió cerrar las fronteras de su país hace 800 años?",
        options: [
          "Para evitar pagar aranceles comerciales en el Grand Line.",
          "Para proteger a la nación y resguardar su conocimiento y sus armas ancestrales del asedio expansionista del Gobierno Mundial.",
          "Por temor a una epidemia de fiebre de la jungla.",
          "A petición expresa de los Piratas de las Bestias de Kaido."
        ],
        correctAnswer: 1,
        explanation: "Oden descubrió en Laugh Tale que Wano se cerró como un búnker de piedra para salvaguardar secretos clave de los invasores que fundaron el Gobierno."
      },
      {
        id: "q_wan_2",
        question: "¿Cuál es la aleación e ingeniería real equivalente a las espadas forjadas en Wano que absorben la energía 'Haki'?",
        options: [
          "Las espadas de juguete vendidas en mercados asiáticos.",
          "El acero templado industrial moderno sin ningún templado sagrado.",
          "El misterio del Acero de Damasco, espadas de Toledo y el forjado ceremonial cargado con electromagnetismo de herrerías de templos orientales.",
          "Las aleaciones plásticas de los laboratorios aeroespaciales convencionales."
        ],
        correctAnswer: 2,
        explanation: "La forja tradicional de Wano resuena con la metalurgia secreta de espadas sagradas reales, donde el forjador meditaba e imbuía una firma armónica espiritual en el hierro que afectaba la bioquímica del portador."
      }
    ]
  },
  {
    id: "egghead",
    title: "Egghead",
    islandName: "La Isla del Futuro Pasado y el Gran Hundimiento",
    description: "Desembarca en la isla de Vegapunk. Investiga los ordenadores cuánticos biológicos, la energía infinita robada al éter y la terrible revelación del hundimiento terrestre.",
    coordinates: { x: 1210, y: 150 },
    unlockedAtNodes: ["tecnologia_perdida", "energia_libre"],
    lesson: {
      onePieceLore: "En Egghead, el doctor Vegapunk divide su cerebro biológico en Punk Records conectándose a un servidor global de información. Vegapunk revela mediante un video póstumo que el mundo actual es solo el remanente inundado de un cataclismo antiguo provocado por armas nucleares de agua (Urano) accionadas por la élite divina de Mary Geoise, y profetiza que el nivel del océano subirá pronto de forma catastrófica si el One Piece es reclamado por manos belicosas.",
      realWorldAnalogy: "Egghead refleja nuestra actual era de transhumanismo, Internet (Punk Records), inteligencia artificial y la censura científica de la energía libre (la bobina de Tesla o fusión fría). El gran hundimiento profetizado de One Piece refleja las hipótesis de inundaciones geofísicas masivas y reseteos tectónicos documentados al final de eras climáticas antiguas, donde las cúpulas gobernantes se refugian bajo tierra o en búnkeres de alta montaña mientras se reestructura la faz del globo.",
      keyEvidences: [
        "El robot ancestral gigante guardado bajo tierra que funciona con el fuego original (fusión cuántica del éter) que Vegapunk no logró duplicar.",
        "La existencia del arma 'Mother Flame' (Llama Madre) capaz de evaporar islas completas y subir el nivel del mar global un metro de forma inmediata."
      ],
      connectionConcept: "Egghead une el pasado tecnológico con el futuro digital: la verdad del Reino Antiguo ya no es arqueología teórica, sino un hecho de ingeniería que el Gorosei busca erradicar con una Buster Call definitiva."
    },
    quiz: [
      {
        id: "q_egg_1",
        question: "¿Cuál es el núcleo del gran mensaje póstumo que el Doctor Vegapunk retransmite a todo el planeta?",
        options: [
          "¡Las frutas del diablo se originan de la energía solar ordinaria!",
          "¡Nuestros continentes están hundiéndose en el océano debido a una inundación planetaria ancestral provocada por armas soberanas!",
          "¡Se debe nombrar a un nuevo almirante de la marina inmediatamente!",
          "¡La isla de Egghead es completamente indestructible frente al Gorosei!"
        ],
        correctAnswer: 1,
        explanation: "Vegapunk expuso que la geografía de islas de One Piece es artificial: el planeta se inundó 200 metros en la gran guerra del Siglo Vacío y la Marina manipula la historia para que nadie intente reunificar los continentes."
      },
      {
        id: "q_egg_2",
        question: "Punk Records representa la mente de Vegapunk conectada a la red. ¿Con qué hito biotecnológico se asimila hoy?",
        options: [
          "Con los diccionarios de papel encuadernados.",
          "Con la Noosfera cuántica, la digitalización de la consciencia, el transhumanismo (Neuralink) y el control algorítmico centralizado de los datos públicos.",
          "Con los telescopios de observación espacial profunda.",
          "Con las patentes de motores diesel tradicionales."
        ],
        correctAnswer: 1,
        explanation: "Punk Records representa la red de información unificada o la nube biológica, la cual las élites intentan monopolizar para dictaminar qué es verdad y censurar el acceso al registro prohibido del pasado."
      }
    ]
  },
  {
    id: "laughtale",
    title: "Laugh Tale",
    islandName: "El Destino Final de Roger",
    description: "Reúne las coordenadas de los cuatro Road Poneglyphs para navegar al fin del mar. Descubre el One Piece y conéctalo con nuestra realidad para activar el Gran Despertar.",
    coordinates: { x: 1350, y: 110 },
    unlockedAtNodes: ["raftel", "one_piece"],
    lesson: {
      onePieceLore: "Laugh Tale es la isla donde Gol D. Roger descubrió la historia completa del Reino Antiguo, la Voluntad de D., el origen de las frutas y el plan inconcluso de Joy Boy. Al ver la magnitud de la verdad, Roger y sus compañeros simplemente se echaron a reír, dándose cuenta de que habían llegado demasiado pronto, pues el heraldo mesiánico de la libertad nacería 20 años más tarde.",
      realWorldAnalogy: "Laugh Tale representa el punto de inflexión del despertar espiritual y mental. Al presenciar la ridícula falsedad de las murallas diplomáticas, el sistema financiero de dinero ficticio y el control geofísico en el que vivimos, el buscador libre no cae en la ira, sino en una risa liberadora (The Laugh Tale). Comprende que la verdadera matriz de control es tan gigantesca y absurda que el simple hecho de revelarla desmantela su poder para siempre, dando inicio a una Nueva Era Dorada.",
      keyEvidences: [
        "La risa colectiva e inmortal de la tripulación de Roger plasmada en las crónicas de Oden.",
        "El One Piece real actuando como el desmantelador definitivo de la Red Line y el All Blue: un mar sin muros donde todos los pescadores, marineros y librepensadores pueden navegar sin pasaportes estatales."
      ],
      connectionConcept: "El descubrimiento del One Piece une las dos realidades en una sola: somos nosotros, los arqueólogos modernos y piratas de la mente, quienes desenterraremos los planos de una civilización soberana y libre."
    },
    quiz: [
      {
        id: "q_lau_1",
        question: "¿Por qué se rieron Gol D. Roger y su tripulación al pisar el suelo de la última isla?",
        options: [
          "Encontraron un cofre lleno de historietas cómicas ordinarias.",
          "Comprendieron el absurdo de la mentira que gobierna el mundo y la tremenda simplicidad del plan de libertad ineludible que Joy Boy dejó trazado.",
          "Se dieron cuenta de que se habían equivocado de isla por un error de navegación.",
          "Recibieron gas de la risa de un dispositivo de trampa del Gobierno."
        ],
        correctAnswer: 1,
        explanation: "Roger se rió de la ridícula ceguera sistémica del Gobierno Mundial frente al destino de liberación irreversible, un alivio cognitivo absoluto que disuelve todo miedo."
      },
      {
        id: "q_lau_2",
        question: "Para restaurar el legado de la Biblioteca de Ohara y ser arqueólogo supremo, ¿cuál es tu misión final?",
        options: [
          "Comprar acciones de corporaciones armamentísticas globales.",
          "Conectar los misterios de One Piece con los registros de nuestro mundo para despertar mentes, liberando la energía, el saber soberano y forjando una nueva era pirata de libre albedrío.",
          "Memorizar los nombres de todos los barcos de la Marina oficial.",
          "Permanecer callado y obedecer las directrices académicas por seguridad personal."
        ],
        correctAnswer: 1,
        explanation: "El verdadero arqueólogo no archiva teorías muertas, sino que activa el conocimiento prohibido para derribar las murallas de control cognitivo y geofísico de nuestra propia realidad."
      }
    ]
  }
];
