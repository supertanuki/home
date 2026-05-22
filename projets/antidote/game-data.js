const GAME_DATA = {
  initialScores: { public: 40, political: 60, resources: 100, score: 0 },

  endConditions: {
    publicZero: {
      title: "Fin de Partie - Soutien du public à 0",
      subtitle: "La mobilisation citoyenne s'est effondrée",
      description: "Sans soutien populaire, ANTIDOTE n'a plus de poids dans le débat. Les médias ont tourné le dos à la cause, les élus ne voient plus de pression citoyenne suffisante pour résister aux industriels. L'AIPP a réussi à décrédibiliser la mobilisation et à isoler l'association. La proposition de loi avance sans opposition effective.",
      conclusion: "Ce résultat montre à quel point le soutien du public est le carburant des campagnes de plaidoyer. Rejouez en privilégiant les actions qui renforcent la mobilisation citoyenne et en contrant les offensives médiatiques du lobby.",
      cta: "La bataille contre les pesticides est réelle. Informez-vous sur les actions des associations environnementales et comment vous pouvez les soutenir."
    },
    politicalZero: {
      title: "Fin de Partie - Influence politique à 0",
      subtitle: "ANTIDOTE n'a plus aucun relais dans les institutions",
      description: "La pression du lobby a fini par isoler ANTIDOTE de toute la sphère politique. Les parlementaires qui soutenaient la cause ont reculé sous la pression des industriels. Sans alliés au sein des institutions, il est impossible de peser sur le vote. La proposition de loi est sur le point d'être adoptée sans opposition.",
      conclusion: "Cet échec illustre l'importance du plaidoyer institutionnel. Les associations doivent cultiver des relais politiques solides pour faire contrepoids aux lobbies industriels qui ont un accès privilégié aux décideurs.",
      cta: "Pour peser sur les décisions politiques, il est essentiel de connaître les mécanismes du lobbying. Explorez comment les associations environnementales travaillent avec les institutions."
    },
    resourcesZero: {
      title: "Fin de Partie - Ressources à 0",
      subtitle: "ANTIDOTE n'a plus les moyens de continuer",
      description: "Les ressources d'ANTIDOTE sont épuisées. Sans financement, impossible de mener des expertises scientifiques, de financer des actions juridiques ou de maintenir la campagne médiatique. L'asymétrie des moyens entre une association et un lobby industriel a eu raison de la campagne. L'examen de la proposition de loi avancera sans opposition organisée.",
      conclusion: "Cette situation reflète une réalité que vivent de nombreuses associations : la guerre des ressources. Les industriels peuvent mobiliser des moyens considérables quand les ONG doivent compter chaque euro. Rejouez en gérant plus soigneusement vos ressources.",
      cta: "Soutenir financièrement les associations environnementales est un acte politique. Chaque don permet de maintenir une veille et une capacité de plaidoyer face aux lobbies industriels."
    }
  },

  finalResults: [
    {
      id: "lobby_win",
      icon: "❌",
      badgeClass: "badge-lobby-win",
      title: "Victoire du lobby",
      description: "La loi est adoptée. Plusieurs pesticides dangereux sont réautorisés. Les industriels ont réussi à convaincre les décideurs politiques grâce à leur accès privilégié aux institutions et à leurs ressources considérables. ANTIDOTE n'a pas réussi à construire un rapport de force suffisant pour faire reculer les parlementaires.",
      conclusion: "Ce résultat illustre la difficulté réelle des batailles contre des lobbies puissants et bien financés. La mobilisation d'ANTIDOTE n'est pas terminée pour autant - la bataille continue dans d'autres arènes.",
      cta: "Même après une défaite, les associations ne s'arrêtent pas. Les recours juridiques, les mobilisations européennes et la pression citoyenne continuent de peser sur les décisions.",
      threshold: { max: 14 }
    },
    {
      id: "statu_quo",
      icon: "⚖️",
      badgeClass: "badge-statu-quo",
      title: "Statu quo",
      description: "La loi est adoptée, mais fortement limitée. La mobilisation d'ANTIDOTE a suffi à réduire la portée du texte, mais n'a pas permis de le bloquer totalement. Quelques pesticides sont réautorisés, mais les plus dangereux ont été écartés grâce à la pression combinée des scientifiques, des parlementaires alliés et de l'opinion publique.",
      conclusion: "Un statu quo peut ressembler à un échec, mais c'est souvent le résultat réel des batailles politiques. Les associations ont réussi à limiter les dégâts et posé les bases pour les prochains combats.",
      cta: "Les batailles politiques se gagnent rarement d'un coup. Chaque avancée partielle construit la pression pour les réformes suivantes. Restez mobilisés.",
      threshold: { min: 15, max: 24 }
    },
    {
      id: "partial_win",
      icon: "🏅",
      badgeClass: "badge-partial-win",
      title: "Victoire partielle d'ANTIDOTE",
      description: "La mobilisation a porté ses fruits. La majorité des pesticides dangereux reste interdite. La loi a été fortement amendée grâce à la coalition que vous avez construite : scientifiques, parlementaires, citoyens et médias ont exercé une pression suffisante pour faire reculer les industriels sur l'essentiel.",
      conclusion: "Cette victoire partielle montre qu'une association bien organisée peut peser face à des intérêts industriels puissants. La clé : construire des coalitions larges, mobiliser l'expertise, et maintenir la pression citoyenne.",
      cta: "Ce résultat est possible dans la réalité. Des associations comme celle-ci remportent régulièrement des victoires partielles qui protègent notre santé et notre environnement.",
      threshold: { min: 25, max: 39 }
    },
    {
      id: "complete_win",
      icon: "🏆",
      badgeClass: "badge-complete-win",
      title: "Victoire complète d'ANTIDOTE",
      description: "La loi est rejetée. La mobilisation citoyenne et scientifique coordonnée par ANTIDOTE a réussi à faire reculer les décideurs politiques. La coalition construite au fil des tours a rendu politiquement coûteux le soutien à la réautorisation. Les parlementaires n'ont pas pu ignorer la pression populaire, scientifique et médiatique combinée.",
      conclusion: "Mais l'AIPP reste puissant. La bataille continue. Cette victoire démontre qu'une stratégie de plaidoyer bien construite peut contrebalancer des moyens financiers considérables. Elle se construit dans la réalité grâce à des milliers de bénévoles, de scientifiques engagés et de citoyens mobilisés. Rejoignez-les.",
      cta: "Cette victoire est possible. Elle se construit dans la réalité grâce à des milliers de bénévoles, de scientifiques engagés et de citoyens mobilisés. Rejoignez-les.",
      threshold: { min: 40 }
    }
  ],

  events: [
    {
      id: "health_data",
      icon: "🔬",
      title: "Nouvelles données choc sur les pesticides",
      description: "Une agence publique publie de nouvelles données sur l'exposition aux pesticides dans les zones agricoles. Le débat prend une dimension sanitaire inattendue.",
      outcome: "Les données appuient les arguments d'ANTIDOTE.<br>Les médias s'emparent du sujet, plusieurs parlementaires se mobilisent dans la presse contre la proposition de loi.",
      effects: { public: 10, political: 10, resources: 0, score: 10 }
    },
    {
      id: "journalism",
      icon: "📰",
      title: "Pesticides : notre enquête sur les liens entre lobby et politique",
      description: "Publication d'une enquête révélant les liens étroits entre plusieurs responsables de l'industrie des pesticides et des décideurs politiques. En effet, l'ancien collaborateur parlementaire du rapporteur du texte vient de rejoindre l'équipe affaires publiques de l'AIPP.",
      outcome: "L'enquête fragilise publiquement la position du lobby.<br>Les parlementaires les plus proches des industriels sont sur la défensive.",
      effects: { public: 15, political: 10, resources: 0, score: 15 }
    },
    {
      id: "farm_mobilization",
      icon: "🚜",
      title: "Pesticides : forte mobilisation agricole",
      description: "Le syndicat agricole majoritaire appelle à soutenir la réautorisation des pesticides et organise une journée nationale de mobilisation.",
      outcome: "La mobilisation des agriculteurs met les parlementaires ruraux sous forte pression.<br>Le rapport de force se durcit en faveur du lobby.",
      effects: { public: -15, political: -5, resources: 0, score: -10 }
    },
    {
      id: "gov_arbitration",
      icon: "🏛️",
      title: "La ministre soutient la réautorisation",
      description: "La ministre de l'Agriculture prend position publiquement dans le débat sur la réautorisation des pesticides, invoquant les difficultés économiques du monde agricole.",
      outcome: "La prise de position de la ministre fragilise la coalition parlementaire opposée à la loi.<br>Nous devons redoubler d'efforts pour maintenir nos alliés.",
      effects: { public: -5, political: -15, resources: 0, score: -15 }
    }
  ],

  phases: [
    {
      id: 1,
      tourLabel: "Inscription et désignation du rapporteur",
      tourDescription: "Le texte est inscrit à l'ordre du jour et un rapporteur est désigné pour piloter son examen.",
      tourDate: { day: 2, month: 6, year: 2026 },
      title: "Construire une coalition",
      description: "Construire une coalition d'associations est souvent la première étape d'une stratégie de plaidoyer. En unissant leurs forces, les organisations multiplient leur visibilité et leur crédibilité. Mais chaque alliance a ses fragilités et le lobby s'empressera de les exploiter.",
      actions: [
        {
          label: "Rassembler des associations environnementales",
          description: "Coordonner plusieurs ONG environnementales pour dénoncer publiquement la réautorisation. Un communiqué commun, une prise de parole unitaire, la coalition envoie un signal fort aux médias et aux élus.",
          naomiMessages: [
            "OK. On active notre réseau.",
            "On a réussi à rassembler plusieurs ONG environnementales.<br>On sort une note de position commune.<br>Ça donne du poids à notre position… mais on reste entre convaincus."
          ],
          effectsByTour: [
            { resources: -10, political: 10, public: 10, score: 10 },
            { resources: -10, political: 10, public: 5,  score: 10 },
            { resources: -10, political: 5,  public: 10, score: 10 },
          ],
          naomiCounterMessages: [
            "Tu as vu le communiqué de l'AIPP ? Il évoque une \"offensive idéologique des ONG\".<br>L'info est reprise dans plusieurs médias.<br><img src=\"images/image17.png\" class=\"chat-img\">",
            "Ça fragilise un peu notre crédibilité auprès de certains décideurs."
          ],
          counterEffectsByTour: [
            { political: -5, public: -5, score: -10 },
            { political: -5, public: -5, score: -10 },
            { political: -10, public: -10, score: -10 },
          ]
        },
        {
          label: "Nouer une alliance avec des associations de santé",
          description: "Nouer une alliance avec des associations de médecins et de patients permet de faire sortir le débat du seul cadre environnemental.<br>Les arguments liés à la santé publique touchent un public plus large et sont plus difficiles à contester politiquement.",
          naomiMessages: [
            "Bravo !<br>Je viens de recevoir la confirmation : on a réussi à embarquer des associations de médecins et de patients.<br>On change complètement le cadre du débat : on ne parle plus seulement d'environnement, mais de santé publique."
          ],
          effectsByTour: [
            { resources: -10, political: 20, public: 10, score: 15 },
            { resources: -10, political: 15, public: 10, score: 15 },
            { resources: -10, political: 10, public: 10, score: 15 },
          ],
          naomiCounterMessages: [
            "L'AIPP vient de contester les données et met en avant ses propres experts.<br>C'est classique : ils créent du doute pour ralentir le débat.<br>Espérons que ces chiffres biaisés ne circulent pas trop."
          ],
          counterEffectsByTour: [
            { political: -10, public: -10, score: -10 },
            { political: -10, public: -10, score: -10 },
            { political: -15, public: -10, score: -15 },
          ]
        },
        {
          label: "Organiser un forum citoyen",
          description: "Organiser un événement public réunissant associations, citoyens et experts permet de donner une visibilité concrète à la mobilisation. Un forum citoyen crée de l'événement, fédère les énergies et envoie un signal fort aux médias et aux décideurs.",
          naomiMessages: [
            "Bonne idée. On organise un forum citoyen ouvert au public.<br>Associations, chercheurs, agriculteurs bio, représentants de patients…<br>On met tout le monde dans la même pièce.",
            "C'est une réussite ! La salle est pleine, les échanges sont riches.<br>Et surtout, ça donne une image unitaire de notre mobilisation."
          ],
          effectsByTour: [
            { resources: -20, political: 10, public: 15, score: 10 },
            { resources: -20, political: 10, public: 10, score: 10 },
            { resources: -20, political: 5,  public: 10, score: 10 },
          ],
          naomiCounterMessages: [
            "L'AIPP vient de qualifier notre forum de \"grand-messe idéologique\" dans un communiqué.<br>Repris par plusieurs médias proches du lobby.<br>Ils essaient de réduire ça à du militantisme.<br>On va devoir tenir le cap."
          ],
          counterEffectsByTour: [
            { public: -5,  score: -10 },
            { public: -5,  score: -10 },
            { public: -10, score: -10 },
          ]
        }
      ]
    },
    {
      id: 2,
      tourLabel: "Auditions",
      tourDescription: "Le rapporteur lance ses auditions et consulte les différents acteurs concernés.",
      tourDate: { day: 8, month: 6, year: 2026 },
      title: "Sensibiliser les parlementaires",
      description: "Sans relais au sein des institutions, une association ne peut peser sur les votes. Construire une coalition parlementaire est l'un des leviers les plus puissants - mais aussi l'un des plus difficiles à maintenir face aux pressions des lobbies industriels.",
      actions: [
        {
          label: "Convaincre des députés écologistes et de gauche",
          description: "Les groupes écologistes et de gauche sont souvent les alliés naturels des associations environnementales. Les convaincre d'entrer dans la bataille permet d'organiser une opposition structurée à la proposition de loi.",
          naomiMessages: [
            "OK, tu as raison. Il faut d'abord s'assurer que les députés écologistes et de gauche, les plus favorables naturellement à nos propositions, vont bien se mobiliser.",
            "Notes transmises aux députés !"
          ],
          effectsByTour: [
            { resources: -10, political: 10, score: 5 },
            { resources: -10, political: 15, score: 10 },
            { resources: -10, political: 10, score: 5 },
          ],
          naomiCounterMessages: [
            "Mauvaise nouvelle : l'AIPP a transmis une note aux députés du centre, de la droite et de l'extrême droite.<br>Elle présente notre sujet comme un clivage classique : écologie contre agriculture.<br>On va avoir du mal à convaincre de façon transpartisane.<br><img src=\"images/image2.png\" class=\"chat-img\">"
          ],
          counterEffectsByTour: [
            { political: -5,  score: -10 },
            { political: -10, score: -10 },
            { political: -10, score: -10 },
          ]
        },
        {
          label: "Construire une coalition transpartisane",
          description: "Une coalition qui dépasse les clivages partisans a beaucoup plus de poids politique. Convaincre des parlementaires de droite, de centre et de gauche de s'unir contre la réautorisation envoie un signal fort - mais cela demande des compromis.",
          naomiMessages: [
            "C'est ambitieux, mais tu as raison.<br>Il ne faut pas que seuls les députés écologistes et de gauche se sentent concernés.<br>On a réussi à convaincre quelques députés hors de notre camp habituel.",
            "Centre, majorité, parfois même des profils inattendus.<br>Ça change la donne : le sujet devient politique… pas seulement idéologique."
          ],
          effectsByTour: [
            { resources: -20, political: 20, score: 15 },
            { resources: -20, political: 25, score: 20 },
            { resources: -20, political: 15, public: 5, score: 15 },
          ],
          naomiCounterMessages: [
            "Réaction rapide du lobby.<br>L'AIPP active ses relais pour casser notre coalition.<br>Ils ont mobilisé leurs cabinets de conseil en affaires publiques pour multiplier les échanges avec les parlementaires.",
            "Je viens d'avoir au téléphone l'un des députés du centre qu'on avait réussi à convaincre.<br>Il renonce désormais à rejoindre la coalition…"
          ],
          counterEffectsByTour: [
            { political: -10, score: -10 },
            { political: -15, score: -15 },
            { political: -15, score: -15 },
          ]
        },
        {
          label: "Obtenir une audition en commission parlementaire",
          description: "Être entendu officiellement en commission parlementaire, c'est être reconnu comme un acteur légitime du débat. ANTIDOTE peut présenter ses arguments directement aux décideurs qui examinent le texte.",
          naomiMessages: [
            "Tu as raison, il faut qu'on sollicite une audition auprès du rapporteur.",
            "Bonne nouvelle !<br>On sera auditionné par les parlementaires dès la semaine prochaine.<br>On va pouvoir présenter directement nos arguments aux députés."
          ],
          effectsByTour: [
            { resources: -10, political: 15, score: 10 },
            { resources: -10, political: 20, score: 15 },
            { resources: -10, political: 10, score: 5 },
          ],
          naomiCounterMessages: [
            "Évidemment, on ne sera pas les seuls.<br>L'AIPP est auditionné aussi.<br>Juste après nous !"
          ],
          counterEffectsByTour: [
            { political: -10, score: -10 },
            { political: -15, score: -10 },
            { political: -10, score: -10 },
          ]
        }
      ]
    },
    {
      id: 3,
      tourLabel: "Dépôt des amendements en commission",
      tourDescription: "Les députés déposent leurs premiers amendements pour modifier le texte.",
      tourDate: { day: 11, month: 6, year: 2026 },
      title: "Mobiliser l'expertise scientifique",
      description: "Dans les batailles réglementaires, l'expertise scientifique est un outil clé. Elle permet de contester les arguments des industriels et de donner une légitimité au plaidoyer. Mais l'industrie dispose de moyens considérables pour financer des contre-expertises et semer le doute.",
      actions: [
        {
          label: "Tribune de scientifiques dans la presse",
          description: "Organiser la publication d'une tribune signée par plusieurs chercheurs reconnus permet de donner une visibilité médiatique à l'alerte scientifique sur les risques des pesticides.",
          naomiMessages: [
            "Plusieurs chercheurs se mobilisent.<br>Je te tiens au courant.",
            "Les chercheurs viennent de cosigner et publier une tribune qui alerte sur les risques des pesticides.<br>Ça crédibilise clairement notre position, surtout auprès des médias et des députés.<br>Bravo !<br><img src=\"images/image14.png\" class=\"chat-img\">"
          ],
          effectsByTour: [
            { resources: -10, political: 15, public: 5,  score: 10 },
            { resources: -10, political: 10, public: 5,  score: 10 },
            { resources: -10, political: 10, public: 10, score: 10 },
          ],
          naomiCounterMessages: [
            "On vient de m'envoyer ça ! Une tribune \"concurrente\" est sortie dans la foulée.<br>Avec d'autres scientifiques… ou présentés comme tels.<br><img src=\"images/image8.png\" class=\"chat-img\">",
            "Le débat devient technique.<br>Et surtout, il devient confus."
          ],
          counterEffectsByTour: [
            { political: -10, score: -10 },
            { political: -10, score: -10 },
            { political: -10, public: -5, score: -10 },
          ]
        },
        {
          label: "Publier une méta-analyse scientifique",
          description: "Une méta-analyse rassemblant des centaines d'études existantes est un argument scientifique difficile à contester. C'est un travail coûteux mais très solide pour appuyer le plaidoyer.",
          naomiMessages: [
            "Tu as raison, il faut qu'on rassemble les données scientifiques dont on dispose et qu'on produise une analyse solide.<br>Ce sera difficilement attaquable frontalement.",
            "La méta-analyse est publiée !"
          ],
          effectsByTour: [
            { resources: -20, political: 25, score: 15 },
            { resources: -20, political: 20, score: 15 },
            { resources: -10, political: 15, public: 5, score: 15 },
          ],
          naomiCounterMessages: [
            "L'AIPP vient de contre-attaquer.<br>Dans une note publiée sur son blog, le lobby attaque la méthodologie…"
          ],
          counterEffectsByTour: [
            { political: -10, score: -10 },
            { political: -10, score: -10 },
            { political: -10, score: -10 },
          ]
        },
        {
          label: "Prise de position d'une société savante",
          description: "Obtenir la prise de position officielle d'une société savante reconnue - une académie, un collège de médecins - donne un poids institutionnel à la mobilisation scientifique.",
          naomiMessages: [
            "Très bon levier.<br>Une société savante prend rarement position publiquement.<br>Si on y arrive, on gagnera en crédibilité.<br>Ils seront plus difficilement contestables que nous.",
            "Bravo !<br>J'ai eu un échange avec la présidente de la société savante sur le Cancer.<br>Ils devraient prendre position publiquement.",
            "Voilà leur communiqué officiel.<br><img src=\"images/image11.png\" class=\"chat-img\">"
          ],
          effectsByTour: [
            { resources: -10, political: 20, score: 10 },
            { resources: -10, political: 15, score: 10 },
            { resources: -10, political: 15, public: 5, score: 10 },
          ],
          naomiCounterMessages: [
            "Comme par hasard, une réaction de pseudo-institutions vient de tomber…"
          ],
          counterEffectsByTour: [
            { political: -10, score: -10 },
            { political: -10, score: -10 },
            { political: -10, score: -10 },
          ]
        }
      ]
    },
    {
      id: 4,
      tourLabel: "Examen en commission",
      tourDescription: "La commission examine le texte et vote sur les amendements.",
      tourDate: { day: 17, month: 6, year: 2026 },
      title: "Sensibiliser les journalistes",
      description: "Les médias sont un terrain de bataille essentiel. La visibilité médiatique permet de peser sur l'opinion publique et d'exercer une pression indirecte sur les décideurs politiques. Mais l'industrie dispose de budgets de communication bien supérieurs à ceux d'une association.",
      actions: [
        {
          label: "Tribune dans un grand journal national",
          description: "Publier une tribune dans un quotidien national permet de toucher à la fois le grand public et les décideurs. Un texte bien argumenté peut avoir un impact durable sur le débat.",
          naomiMessages: [
            "Bonne idée !",
            "C'est bon, j'ai Le Monde d'Aujourd'hui.<br>Notre tribune va être publiée dans les colonnes du journal.<br>La rédaction devrait par ailleurs en profiter pour consacrer la Une du journal à notre sujet !<br>C'est dingue !",
            "Et voilà !<br><img src=\"images/image13.png\" class=\"chat-img\">"
          ],
          effectsByTour: [
            { resources: -10, public: 10, score: 10 },
            { resources: -10, public: 15, score: 10 },
            { resources: -10, public: 20, score: 15 },
          ],
          naomiCounterMessages: [
            "Une tribune concurrente vient de sortir dans les médias détenus par Vincent Bolloray, le multipropriétaire des médias privés.<br>On se demande bien qui est derrière…<br>On est en train de rentrer dans une bataille d'opinion."
          ],
          counterEffectsByTour: [
            { public: -10, score: -10 },
            { public: -10, score: -10 },
            { public: -15, score: -15 },
          ]
        },
        {
          label: "Organiser une conférence de presse",
          description: "Une conférence de presse bien préparée, avec des chiffres solides et des témoignages percutants, peut déclencher une vague d'articles et de reportages favorables à la cause.",
          naomiMessages: [
            "OK, on passe en mode offensif.<br>On organise une conférence de presse.",
            "Les journalistes sont là, les prises de parole s'enchaînent.<br>Tu viens ?<br><img src=\"images/image24.png\" class=\"chat-img\">",
            "J'ai eu un échange avec l'Agence des Français de la Presse.<br>Une dépêche va sortir demain, avec nos chiffres et nos analyses.<br>Ça devrait être repris dans plusieurs médias.<br>Bien joué !"
          ],
          effectsByTour: [
            { resources: -20, public: 15, score: 10 },
            { resources: -20, public: 20, score: 15 },
            { resources: -20, public: 25, score: 20 },
          ],
          naomiCounterMessages: [
            "Regarde !<br>Il y a une grosse campagne de communication menée par l'AIPP.<br>Leurs représentants sont partout sur les plateaux des chaînes et radios privées…<br>Le directeur général de l'AIPP était ce matin sur CNAZE.<br><img src=\"images/image7.png\" class=\"chat-img\">"
          ],
          counterEffectsByTour: [
            { public: -10, score: -10 },
            { public: -15, score: -15 },
            { public: -20, score: -20 },
          ]
        },
        {
          label: "Révéler un scandale industriel",
          description: "ANTIDOTE dispose de documents montrant les liens entre certains industriels et des responsables politiques. Les révéler peut provoquer une onde de choc médiatique - mais cela coûte cher en ressources et l'industrie contre-attaquera violemment.",
          naomiMessages: [
            "Tu es sûr·e de vouloir aller sur ce terrain ? Ok.<br>On a des éléments solides.<br>On sait de source sûre que le nouveau conseiller de la ministre est l'ancien chargé des relations institutionnelles de l'AIPP.<br>On va rendre ça public, je transmets l'info à Mediapote.",
            "Et voilà !<br><img src=\"images/image16.png\" class=\"chat-img\">"
          ],
          effectsByTour: [
            { resources: -20, political: -10, public: 10 },
            { resources: -20, political: 10,  public: 20, score: 20 },
            { resources: -20, political: 5,   public: 25, score: 20 },
          ],
          naomiCounterMessages: [
            "Les chaînes d'infos continues privées qui appartiennent à Vincent Bolloray tournent en boucle sur cette affaire pour dénoncer \"une manipulation politique\"….",
            "L'édito de Pascal Prout ce matin parlait même de \"grand n'importe quoi de la presse indépendante\"....."
          ],
          counterEffectsByTour: [
            { political: -10, score: -10 },
            { political: -15, score: -15 },
            { political: -20, score: -20 },
          ]
        }
      ]
    },
    {
      id: 5,
      tourLabel: "Dépôt des amendements en séance",
      tourDescription: "De nouveaux amendements sont déposés en vue de la séance publique.",
      tourDate: { day: 26, month: 6, year: 2026 },
      title: "Dialoguer avec les agriculteurs",
      description: "L'AIPP s'appuie massivement sur la figure de l'agriculteur pour légitimer ses positions. Aller à la rencontre des agriculteurs, notamment ceux qui travaillent sans pesticides dangereux, permet de casser ce monopole de représentation.",
      actions: [
        {
          label: "Témoignages d'agriculteurs bio",
          description: "Mettre en avant des agriculteurs qui travaillent sans pesticides dangereux est un contre-récit puissant face à l'argument que \"les agriculteurs ont besoin de ces produits\". Des voix agricoles dans le débat changent la donne.",
          naomiMessages: [
            "Tu as raison.<br>Il faut éviter que notre mobilisation soit perçue comme une mobilisation contre les agriculteurs.<br>On ne s'oppose pas à l'agriculture, mais à certaines pratiques.<br>On publie des témoignages d'agriculteurs qui travaillent au contact des pesticides dangereux. Ce sont eux les premières victimes.",
            "Et voilà !<br><img src=\"images/image23.png\" class=\"chat-img\">"
          ],
          effectsByTour: [
            { resources: -10, political: 10, public: 10, score: 10 },
            { resources: -10, political: 10, public: 10, score: 10 },
            { resources: -10, political: 5,  public: 10, score: 10 },
          ],
          naomiCounterMessages: [
            "L'AIPP vient de convaincre le syndicat agricole majoritaire d'entrer dans la danse.<br>D'après mes infos, ils vont faire intervenir plusieurs de leurs représentants sur les plateaux télés…",
            "Regarde le cadrage…<br>Ils parlent de contraintes, de rendements, de survie économique.<br><img src=\"images/image19.png\" class=\"chat-img\">"
          ],
          counterEffectsByTour: [
            { public: -5,  score: -10 },
            { public: -10, score: -10 },
            { public: -10, score: -10 },
          ]
        },
        {
          label: "Tribune commune d'agriculteurs",
          description: "Une tribune signée par plusieurs dizaines d'agriculteurs opposés à la réautorisation montre que le monde agricole n'est pas monolithique et que le lobby des pesticides ne parle pas en son nom.",
          naomiMessages: [
            "Bonne idée.<br>Je vais proposer la tribune à co-signature auprès de plusieurs paysans et agriculteurs en agriculture biologique.",
            "Bonne nouvelle !<br>On a plus de 100 co-signatures !<br>La tribune sera publiée demain.<br>Ça montre qu'il n'y a pas qu'une seule agriculture mais \"des\" agricultures et ça compte."
          ],
          effectsByTour: [
            { resources: -10, political: 10, public: 10, score: 10 },
            { resources: -10, political: 10, public: 15, score: 10 },
            { resources: -10, political: 5,  public: 15, score: 10 },
          ],
          naomiCounterMessages: [
            "L'AIPP, en lien avec le syndicat majoritaire, a réagi vite !<br>Leurs représentants font le tour des plateaux pour continuer à défendre la proposition de loi.<br>On ne va plus parler de la tribune…"
          ],
          counterEffectsByTour: [
            { public: -10, score: -10 },
            { public: -10, score: -10 },
            { public: -15, score: -10 },
          ]
        },
        {
          label: "Rencontres terrain avec les agriculteurs",
          description: "Organiser des rencontres directes sur le terrain permet de construire des relations de confiance avec des agriculteurs qui ne sont pas convaincus par les pesticides. Ce travail de fond prend du temps mais construit des alliances solides.",
          naomiMessages: [
            "Tu as raison, se rencontrer c'est toujours plus solide.<br>On organise des échanges sur le terrain avec des agriculteurs et on travaille sur des pistes de collaboration.",
            "Bon, c'est passé inaperçu pour l'instant."
          ],
          effectsByTour: [
            { resources: -20, political: 15, public: 10, score: 10 },
            { resources: -20, political: 15, public: 10, score: 10 },
            { resources: -20, political: 10, public: 10, score: 10 },
          ],
          naomiCounterMessages: [
            "L'AIPP, en lien avec le syndicat agricole majoritaire, continue de conduire des actions de communication à destination de la presse et des chambres d'agriculture au niveau local.<br>On est invisibilisés !"
          ],
          counterEffectsByTour: [
            { political: -5,  public: -5,  score: -10 },
            { political: -5,  public: -10, score: -10 },
            { political: -10, public: -10, score: -10 },
          ]
        }
      ]
    },
    {
      id: 6,
      tourLabel: "Début de la séance publique",
      tourDescription: "Le texte arrive dans l'hémicycle et les débats commencent.",
      tourDate: { day: 29, month: 6, year: 2026 },
      title: "Mobiliser les réseaux sociaux",
      lockedUntil: 4,
      description: "Les réseaux sociaux permettent de toucher des millions de personnes à faible coût. Mais ils sont aussi le terrain favori des contre-offensives industrielles : campagnes sponsorisées, trolls organisés, désinformation ciblée. Une arme à double tranchant.",
      actions: [
        {
          label: "Mobiliser des influenceurs",
          description: "Des créateurs de contenu engagés peuvent toucher des millions de personnes jeunes peu habituées aux canaux traditionnels du militantisme. Mais cette visibilité peut attirer la critique sur le sérieux de la campagne.",
          naomiMessages: [
            "OK, on propose à plusieurs influenceurs de diffuser du contenu.",
            "Bonne nouvelle !<br>Le Trauma accepte de relayer notre campagne.<br>Il est quand même suivi par 500k followers sur Instagram !<br><img src=\"images/image10.png\" class=\"chat-img\">"
          ],
          effectsByTour: [
            { resources: -10, public: 20, score: 10 },
            { resources: -10, public: 20, score: 10 },
            { resources: -10, public: 25, score: 15 },
          ],
          naomiCounterMessages: [
            "Je suis dégoûtée, regarde ça.<br>Brout vient de publier une vidéo \"reportage\"… sponsorisée par l'AIPP.<br><img src=\"images/image12.png\" class=\"chat-img\">",
            "Un \"reportage vrai/faux\" sur les \"caricatures\" autour des pesticides. Ils se moquent vraiment du monde."
          ],
          counterEffectsByTour: [
            { public: -10, score: -10 },
            { public: -10, score: -10 },
            { public: -20, score: -15 },
          ]
        },
        {
          label: "Lancer une vidéo virale",
          description: "Une vidéo percutante, pédagogique et émotionnellement engageante peut propager la sensibilisation bien au-delà des cercles convaincus. Format idéal pour les réseaux sociaux.",
          naomiMessages: [
            "Bonne idée.<br>Ça va nous prendre du temps mais c'est efficace.<br>On publie une vidéo courte et pédagogique.",
            "La vidéo commence à circuler rapidement.<br>Les vues montent, les partages aussi.<br>C'est bien qu'on arrive à rendre le sujet accessible."
          ],
          effectsByTour: [
            { resources: -10, public: 20, score: 10 },
            { resources: -10, public: 20, score: 10 },
            { resources: -10, public: 25, score: 15 },
          ],
          naomiCounterMessages: [
            "Des centaines de contenus en faveur de la loi circulent sur les réseaux.<br>Ce sont des contenus générés avec l'IA.<br>Regarde ce faux podcast…<br><img src=\"images/image1.png\" class=\"chat-img\">"
          ],
          counterEffectsByTour: [
            { public: -10, score: -10 },
            { public: -10, score: -10 },
            { public: -20, score: -15 },
          ]
        },
        {
          label: "Campagne pédagogique numérique",
          description: "Diffuser une campagne de fond, factuelle et pédagogique, sur les réseaux sociaux : infographies, fils de discussion, explications scientifiques accessibles. Moins spectaculaire mais plus durable.",
          naomiMessages: [
            "On part sur quelque chose de plus structuré.<br>Une série de contenus pédagogiques : explications, chiffres, visuels…<br>C'est moins spectaculaire, mais plus solide.",
            "C'est en ligne !"
          ],
          effectsByTour: [
            { resources: -10, political: 5, public: 10, score: 10 },
            { resources: -10, political: 5, public: 10, score: 10 },
            { resources: -10, political: 5, public: 15, score: 10 },
          ],
          naomiCounterMessages: [
            "Des centaines de contenus en faveur de la loi circulent sur les réseaux.<br>Ce sont des contenus générés avec l'IA.<br>Nos messages sont complètement dilués.<br>Regarde ce faux podcast…<br><img src=\"images/image1.png\" class=\"chat-img\">"
          ],
          counterEffectsByTour: [
            { public: -5,  score: -10 },
            { public: -5,  score: -10 },
            { public: -10, score: -10 },
          ]
        }
      ]
    },
    {
      id: 7,
      tourLabel: "Suite des débats en séance",
      tourDescription: "Les députés discutent et votent les articles et amendements.",
      tourDate: { day: 1, month: 7, year: 2026 },
      title: "Actions militantes",
      lockedUntil: 4,
      description: "Les actions militantes, pétitions, manifestations, happenings... créent de l'événement médiatique et montrent une mobilisation concrète. Elles peuvent galvaniser les soutiens. Mais un incident peut aussi se retourner contre la campagne.",
      actions: [
        {
          label: "Lancer une pétition nationale",
          description: "Une pétition massive est un signal fort envoyé aux parlementaires : des milliers de citoyens regardent comment ils voteront. C'est un outil classique mais toujours efficace pour créer de la pression.",
          naomiMessages: [
            "Bonne idée.<br>On lance une pétition nationale.",
            "Les signatures montent rapidement.<br>Le sujet parle aux gens.",
            "1 million de signatures !<br>C'est dingue !<br><img src=\"images/image3.png\" class=\"chat-img\">"
          ],
          effectsByTour: [
            { resources: -10, public: 20, score: 10 },
            { resources: -10, public: 20, score: 10 },
            { resources: -10, public: 20, score: 10 },
          ],
          naomiCounterMessages: [
            "Un sondage vient d'être publié : \"78% des Français soutiennent les agriculteurs et sont favorables à la simplification des normes\".<br>Devine qui est derrière cette opération…<br>C'est une façon de décrédibiliser la pétition.<br><img src=\"images/image20.png\" class=\"chat-img\">"
          ],
          counterEffectsByTour: [
            { public: -10, score: -10 },
            { public: -10, score: -10 },
            { public: -15, score: -15 },
          ]
        },
        {
          label: "Organiser une manifestation devant l'Assemblée nationale",
          description: "Une grande manifestation dans la rue montre la réalité de la mobilisation. Des milliers de personnes devant l'Assemblée nationale envoient un signal fort aux décideurs politiques et aux médias.",
          naomiMessages: [
            "On mobilise nos militants.<br>J'envoie un appel à manifestation sur notre newsletter et nos réseaux sociaux.",
            "Autorisation obtenue en préfecture !<br>Rendez-vous confirmé pour la manifestation près de l'Assemblée nationale.",
            "On est plein !<br>Ça fait plaisir !<br><img src=\"images/image4.png\" class=\"chat-img\">"
          ],
          effectsByTour: [
            { resources: -20, political: -10, public: 20, score: 10 },
            { resources: -20, political: -10, public: 20, score: 10 },
            { resources: -20, political: -5,  public: 20, score: 10 },
          ],
          naomiCounterMessages: [
            "Une partie des médias privés reprennent les éléments de langage de l'AIPP et parlent d'une mobilisation \"idéologique\".<br>Certains éditos insistent sur le fait qu'on s'attaque aux agriculteurs.<br>Ça me rend dingue !"
          ],
          counterEffectsByTour: [
            { political: -10, score: -10 },
            { political: -10, score: -10 },
            { political: -10, public: -10, score: -15 },
          ]
        },
        {
          label: "Organiser un happening médiatique",
          description: "Un happening créatif et surprenant peut créer un buzz médiatique important. Son impact dépend beaucoup de l'exécution et du contexte - et la réaction du public peut être imprévisible.",
          naomiMessages: [
            "C'est ambitieux, mais d'accord !<br>On tente quelque chose de plus marquant.<br>Je propose qu'on manifeste avec des faux cercueils devant le siège de l'AIPP.<br>Ça va attirer l'attention.",
            "Elle claque cette opération !<br><img src=\"images/image6.png\" class=\"chat-img\">"
          ],
          effectsByTour: [
            { resources: -20, political: -10, public: 20, score: 10 },
            { resources: -20, political: -10, public: 20, score: 10 },
            { resources: -20, political: -5,  public: 20, score: 10 },
          ],
          naomiCounterMessages: [
            "L'AIPP n'a pas apprécié.<br>Ils viennent de publier un communiqué pour dénoncer une \"manipulation émotionnelle\" de la part de \"dangereux écologistes qui ont mis en danger l'intégrité physique du siège\"…"
          ],
          counterEffectsByTour: [
            { political: -10, score: -10 },
            { political: -10, score: -10 },
            { political: -10, public: -10, score: -15 },
          ]
        }
      ]
    },
    {
      id: 8,
      tourLabel: "Vote solennel",
      tourDescription: "Les députés se prononcent sur l'ensemble du texte.",
      tourDate: { day: 8, month: 7, year: 2026 },
      title: "Travail légistique",
      lockedUntil: 3,
      description: "Avec le dépôt des amendements en commission, le travail légistique prend toute son importance. Rédiger des amendements précis, transmettre des analyses aux cabinets : ce sont les leviers les plus directs pour modifier le texte - et les plus difficiles à contrer pour les industriels.",
      actions: [
        {
          label: "Rédiger et transmettre un amendement de suppression",
          description: "Rédiger un amendement de suppression totale du texte en collaboration avec des parlementaires alliés et le transmettre officiellement. Si cet amendement est adopté, la proposition de loi tombe.",
          naomiMessages: [
            "Bonne idée.<br>Je te suggère de rédiger un amendement précis de suppression.<br>S'il est adopté, la proposition de loi tombe assez rapidement.",
            "Le voici, on le transmet ensemble directement à plusieurs députés.<br><img src=\"images/image5.png\" class=\"chat-img\">"
          ],
          effectsByTour: [
            { resources: -10, political: 20, score: 15 },
            { resources: -10, political: 20, score: 15 },
            { resources: -10, political: 20, score: 20 },
          ],
          naomiCounterMessages: [
            "Tu as regardé la liasse des amendements qui circulent ?<br>Beaucoup viennent de l'AIPP… mais très peu sont sourcés, comme d'habitude.<br>Au moins 7 députés ont déposé le même amendement pour soutenir et renforcer le texte.<br>C'est dingue !<br>Le rapport de force n'est pas bon pour nous."
          ],
          counterEffectsByTour: [
            { political: -10, score: -10 },
            { political: -10, score: -10 },
            { political: -15, score: -15 },
          ]
        },
        {
          label: "Rédiger des amendements de repli",
          description: "Si la suppression totale n'est pas obtenue, des amendements de repli permettent de limiter les effets du texte : encadrement plus strict, conditions supplémentaires d'usage, clauses de révision, exclusions de certaines substances. Moins spectaculaire, mais souvent décisif.",
          naomiMessages: [
            "Bonne approche.<br>Si on ne peut pas tout bloquer, autant s'assurer qu'on limite les dégâts au maximum.<br>On prépare plusieurs amendements de repli avec nos partenaires juridiques.",
            "Les amendements sont rédigés et transmis.<br>Certains parlementaires les ont déjà déposés.<br>Ça réduit la portée du texte même si on ne l'arrête pas totalement."
          ],
          effectsByTour: [
            { resources: -10, political: 15, score: 10 },
            { resources: -10, political: 15, score: 15 },
            { resources: -10, political: 15, score: 15 },
          ],
          naomiCounterMessages: [
            "L'AIPP a vu nos amendements.<br>Ils mobilisent leurs propres juristes pour déposer des contre-amendements.<br>Ça va être du détail contre détail dans l'hémicycle.<br>Le rapport de force va se jouer dans les couloirs."
          ],
          counterEffectsByTour: [
            { political: -10, score: -10 },
            { political: -10, score: -10 },
            { political: -10, score: -10 },
          ]
        },
        {
          label: "Transmettre des notes d'analyse aux cabinets ministériels",
          description: "Préparer et transmettre des notes de synthèse factuelles aux cabinets ministériels et à l'administration pour alimenter leur réflexion avec une expertise indépendante. Influencer l'administration, c'est influencer les arbitrages en amont du vote.",
          naomiMessages: [
            "Tu as raison, on peut aussi tenter de convaincre l'administration et les différents cabinets ministériels.<br>Il doit y avoir une note dans le drive commun.<br>Je te laisse la mettre à jour, ensuite, on l'envoie au ministère de la Transition écologique et au ministère de l'Agriculture.",
            "Notes transmises."
          ],
          effectsByTour: [
            { resources: -10, political: 10, score: 10 },
            { resources: -10, political: 10, score: 10 },
            { resources: -10, political: 15, score: 15 },
          ],
          naomiCounterMessages: [
            "L'AIPP a fait la même chose, appuyé par une \"note économique sur l'impact sur les filières\" produite par un grand cabinet de conseil…<br>Apparemment, le ministre de l'Économie et des Finances pousse en faveur du texte auprès des parlementaires.<br><img src=\"images/image15.png\" class=\"chat-img\">"
          ],
          counterEffectsByTour: [
            { political: -5, score: -10 },
            { political: -5, score: -10 },
            { political: -10, score: -10 },
          ]
        }
      ]
    }
  ]
};
