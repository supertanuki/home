const GAME_DATA = {
  initialScores: { public: 40, political: 60, resources: 100, score: 0 },

  endConditions: {
    publicZero: {
      title: "Fin de Partie - Soutien du Public à 0",
      subtitle: "La mobilisation citoyenne s'est effondrée",
      description: "Sans soutien populaire, ANTIDOTE n'a plus de poids dans le débat. Les médias ont tourné le dos à la cause, les élus ne voient plus de pression citoyenne suffisante pour résister aux industriels. L'AIPP, le lobby des pesticides a réussi à décrédibiliser la mobilisation et à isoler l'association. La proposition de loi avance sans opposition effective.",
      conclusion: "Ce résultat montre à quel point le soutien du public est le carburant des campagnes de plaidoyer. Rejouez en privilégiant les actions qui renforcent la mobilisation citoyenne et en contrant les offensives médiatiques du lobby.",
      cta: "La bataille contre les pesticides est réelle. Informez-vous sur les actions des associations environnementales et comment vous pouvez les soutenir."
    },
    politicalZero: {
      title: "Fin de Partie - Influence Politique à 0",
      subtitle: "ANTIDOTE n'a plus aucun relais dans les institutions",
      description: "La pression du lobby a fini par isoler ANTIDOTE de toute la sphère politique. Les parlementaires qui soutenaient la cause ont reculé sous la pression des industriels. Sans alliés au sein des institutions, il est impossible de peser sur le vote. La proposition de loi est sur le point d'être adoptée sans opposition.",
      conclusion: "Cet échec illustre l'importance du plaidoyer institutionnel. Les associations doivent cultiver des relais politiques solides pour faire contrepoids aux lobbies industriels qui ont un accès privilégié aux décideurs.",
      cta: "Pour peser sur les décisions politiques, il est essentiel de connaître les mécanismes du lobbying. Explorez comment les associations environnementales travaillent avec les institutions."
    },
    resourcesZero: {
      title: "Fin de Partie - Ressources à 0",
      subtitle: "ANTIDOTE n'a plus les moyens de continuer",
      description: "Les ressources d'ANTIDOTE sont épuisées. Sans financement, impossible de mener des expertises scientifiques, de financer des actions juridiques ou de maintenir la campagne médiatique. L'asymétrie des moyens entre une association et un lobby industriel milliardaire a eu raison de la campagne. La loi avancera sans opposition organisée.",
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
      threshold: { max: 19 }
    },
    {
      id: "statu_quo",
      icon: "⚖️",
      badgeClass: "badge-statu-quo",
      title: "Statu quo",
      description: "La loi est adoptée, mais fortement limitée. La mobilisation d'ANTIDOTE a suffi à réduire la portée du texte, mais n'a pas permis de le bloquer totalement. Quelques pesticides sont réautorisés, mais les plus dangereux ont été écartés grâce à la pression combinée des scientifiques, des parlementaires alliés et de l'opinion publique.",
      conclusion: "Un statu quo peut ressembler à un échec, mais c'est souvent le résultat réel des batailles politiques. Les associations ont réussi à limiter les dégâts et posé les bases pour les prochains combats.",
      cta: "Les batailles politiques se gagnent rarement d'un coup. Chaque avancée partielle construit la pression pour les réformes suivantes. Restez mobilisés.",
      threshold: { min: 20, max: 49 }
    },
    {
      id: "partial_win",
      icon: "🏅",
      badgeClass: "badge-partial-win",
      title: "Victoire partielle d'ANTIDOTE",
      description: "La mobilisation a porté ses fruits. La majorité des pesticides dangereux reste interdite. La loi a été fortement amendée grâce à la coalition que vous avez construite : scientifiques, parlementaires, citoyens et médias ont exercé une pression suffisante pour faire reculer les industriels sur l'essentiel. Une victoire significative.",
      conclusion: "Cette victoire partielle montre qu'une association bien organisée peut peser face à des intérêts industriels puissants. La clé : construire des coalitions larges, mobiliser l'expertise, et maintenir la pression citoyenne.",
      cta: "Ce résultat est possible dans la réalité. Des associations comme celle-ci remportent régulièrement des victoires partielles qui protègent notre santé et notre environnement.",
      threshold: { min: 50, max: 89 }
    },
    {
      id: "complete_win",
      icon: "🏆",
      badgeClass: "badge-complete-win",
      title: "Victoire complète d'ANTIDOTE",
      description: "La loi est rejetée. La mobilisation citoyenne et scientifique coordonnée par ANTIDOTE a réussi à faire reculer les décideurs politiques. La coalition construite au fil des tours a rendu politiquement coûteux le soutien à la réautorisation. Les parlementaires n'ont pas pu ignorer la pression populaire, scientifique et médiatique combinée.",
      conclusion: "Mais l'AIPP, le lobby des pesticides reste puissant. La bataille continue. Cette victoire démontre qu'une stratégie de plaidoyer bien construite peut contrebalancer des moyens financiers considérables. C'est une leçon précieuse pour toutes les campagnes à venir.",
      cta: "Cette victoire est possible. Elle se construit dans la réalité grâce à des milliers de bénévoles, de scientifiques engagés et de citoyens mobilisés. Rejoignez-les.",
      threshold: { min: 90 }
    }
  ],

  events: [
    {
      id: "health_data",
      icon: "🔬",
      title: "Publication de nouvelles données sanitaires",
      description: "Une agence publique publie de nouvelles données sur l'exposition aux pesticides dans les zones agricoles. Le débat prend une dimension sanitaire inattendue.",
      outcome: "Les données appuient les arguments d'ANTIDOTE.<br>Les médias s'emparent du sujet, plusieurs parlementaires demandent un moratoire.",
      effects: { public: 10, political: 10, resources: 0, score: 12 }
    },
    {
      id: "journalism",
      icon: "📰",
      title: "Enquête journalistique",
      description: "Publication d'une enquête révélant les liens étroits entre plusieurs responsables de l'industrie des pesticides et des décideurs politiques.",
      outcome: "L'enquête publiée fragilise publiquement la position du lobby.<br>Les parlementaires les plus proches des industriels sont sur la défensive.",
      effects: { public: 15, political: 10, resources: 0, score: 17 }
    },
    {
      id: "farm_mobilization",
      icon: "🚜",
      title: "Mobilisation agricole nationale",
      description: "Un grand syndicat agricole appelle à soutenir la réautorisation des pesticides et organise une journée nationale de mobilisation.",
      outcome: "La mobilisation des agriculteurs met les parlementaires ruraux sous forte pression.<br>Le rapport de force se durcit en faveur du lobby.",
      effects: { public: -15, political: -5, resources: 0, score: -8 }
    },
    {
      id: "gov_arbitration",
      icon: "🏛️",
      title: "Arbitrage du gouvernement",
      description: "La ministre de l'Agriculture prend position publiquement dans le débat sur la réautorisation des pesticides, invoquant l'intérêt économique du monde agricole.",
      outcome: "La prise de position de la ministre fragilise la coalition parlementaire opposée à la loi.<br>Nous devons redoubler d'efforts pour maintenir nos alliés.",
      effects: { public: -5, political: -15, resources: 0, score: -12 }
    }
  ],

  phases: [
    {
      id: 1,
      tourLabel: "Inscription et désignation du rapporteur",
      tourDescription: "Le texte est inscrit à l'ordre du jour et un rapporteur est désigné pour piloter son examen.",
      tourDate: { day: 2, month: 4, year: 2026 },
      title: "Construire une coalition d'organisations",
      description: "Construire une coalition d'associations est souvent la première étape d'une stratégie de plaidoyer. En unissant leurs forces, les organisations multiplient leur visibilité et leur crédibilité. Mais chaque alliance a ses fragilités - et le lobby s'empressera de les exploiter.",
      actions: [
        {
          label: "Rassembler des associations environnementales",
          description: "Coordonner plusieurs ONG environnementales pour dénoncer publiquement la réautorisation. Un communiqué commun, une prise de parole unitaire - la coalition envoie un signal fort aux médias et aux élus.",
          naomiMessages: [
            "OK. On active notre réseau.",
            "On a réussi à rassembler plusieurs ONG environnementales.<br>On sort une note de position commune.<br>Ça donne du poids à notre position… mais on reste entre convaincus."
          ],
          effectsByTour: [
            { resources: -7, political: 10, public: 10, score: 12 },
            { resources: -7, political: 10, public: 5,  score: 12 },
            { resources: -7, political: 5,  public: 10, score: 12 },
          ],
          naomiCounterMessages: [
            "Wow, tu as vu le communiqué de l'AIPP\u00a0?<br>Il évoque une \"offensive idéologique des ONG\".<br>L'info est reprise dans plusieurs médias.<br><img src=\"images/image17.png\" class=\"chat-img\">",
            "Ça affaiblit un peu notre crédibilité auprès de certains décideurs."
          ],
          counterEffectsByTour: [
            { political: -5, public: -5, score: -9 },
            { political: -5, public: -5, score: -9 },
            { political: -10, public: -10, score: -9 },
          ]
        },
        {
          label: "Alliance avec des associations de santé",
          description: "Nouer une alliance avec des associations de médecins et de patients permet de faire sortir le débat du seul cadre environnemental. Les arguments sanitaires touchent un public plus large et sont plus difficiles à contester politiquement.",
          naomiMessages: [
            "Bravo\u00a0!<br>Je viens de recevoir la confirmation\u00a0: on a réussi à embarquer des associations de médecins et de patients.<br>On change complètement le cadre du débat\u00a0: on ne parle plus seulement d'environnement, mais de santé publique."
          ],
          effectsByTour: [
            { resources: -7, political: 20, public: 10, score: 17 },
            { resources: -7, political: 15, public: 10, score: 17 },
            { resources: -7, political: 10, public: 10, score: 17 },
          ],
          naomiCounterMessages: [
            "Bon. L'AIPP, le lobby des pesticides vient de contester les données et mettent en avant leurs propres experts.",
            "C'est assez classique\u00a0: ils créent du doute pour ralentir le débat.<br>Espérons que ces chiffres biaisés ne circulent pas trop."
          ],
          counterEffectsByTour: [
            { political: -10, public: -10, score: -9 },
            { political: -10, public: -10, score: -9 },
            { political: -15, public: -10, score: -14 },
          ]
        },
        {
          label: "Mobiliser des scientifiques et chercheurs",
          description: "Mobiliser des chercheurs pour soutenir publiquement la position d'ANTIDOTE renforce la légitimité scientifique de la campagne. Une communauté scientifique unie est difficile à ignorer pour les décideurs.",
          naomiMessages: [
            "Bonne nouvelle\u00a0!<br>Les chercheurs acceptent de soutenir publiquement notre position.<br>Une tribune est en cours de préparation.<br>Ça renforce clairement notre crédibilité, surtout côté parlementaire.",
            "Ah, on vient de m'envoyer la tribune.<br>Bravo\u00a0!<br><img src=\"images/image14.png\" class=\"chat-img\">"
          ],
          effectsByTour: [
            { resources: -7, political: 20, score: 12 },
            { resources: -7, political: 15, score: 12 },
            { resources: -7, political: 10, public: 5, score: 12 },
          ],
          naomiCounterMessages: [
            "Ils ne vont jamais nous lâcher.<br>Le lobby des pesticides vient de produire une contre-expertise.<br>Une étude publiée par un \"cabinet indépendant\" (alors que l'étude est financée par l'industrie…) vient de sortir.",
            "Elle montre que les pesticides concernés ne présentent pas de risque significatif dans les conditions d'utilisation prévue par le texte actuel.<br>Et que leur interdiction fragiliserait fortement certaines filières agricoles.<br><img src=\"images/image18.png\" class=\"chat-img\">"
          ],
          counterEffectsByTour: [
            { political: -10, score: -9 },
            { political: -10, score: -9 },
            { political: -10, public: -5, score: -9 },
          ]
        }
      ]
    },
    {
      id: 2,
      tourLabel: "Auditions",
      tourDescription: "Le rapporteur lance ses auditions et consulte les différents acteurs concernés.",
      tourDate: { day: 12, month: 4, year: 2026 },
      title: "Coalition parlementaire",
      description: "Sans relais au sein des institutions, une association ne peut peser sur les votes. Construire une coalition parlementaire est l'un des leviers les plus puissants - mais aussi l'un des plus difficiles à maintenir face aux pressions des lobbies industriels.",
      actions: [
        {
          label: "Convaincre des députés écologistes et de gauche",
          description: "Les groupes écologistes et de gauche sont souvent les alliés naturels des associations environnementales. Les convaincre d'entrer dans la bataille permet d'organiser une opposition structurée à la proposition de loi.",
          naomiMessages: [
            "OK, tu as raison<br>Il faut déjà s'assurer que les députés écologistes et de gauche qui sont les plus favorables naturellement à nos propositions, vont bien se mobiliser.",
            "Notes transmises aux députés !"
          ],
          effectsByTour: [
            { resources: -7, political: 10, score: 7 },
            { resources: -7, political: 15, score: 12 },
            { resources: -7, political: 10, score: 7 },
          ],
          naomiCounterMessages: [
            "Arg.<br>Mauvaise nouvelle\u00a0: le lobby des pesticides AIPP a transmis une note aux députés du centre, de la droite et de l'extrême droite.",
            "J'ai récupérée cette note.<br>Elle présente notre sujet comme un clivage classique\u00a0: écologie contre agriculture.<br>On va avoir du mal à convaincre de façon transpartisane en dehors de la gauche.<br><img src=\"images/image2.png\" class=\"chat-img\">"
          ],
          counterEffectsByTour: [
            { political: -5, score: -9 },
            { political: -10, score: -9 },
            { political: -10, score: -9 },
          ]
        },
        {
          label: "Construire une coalition transpartisane",
          description: "Une coalition qui dépasse les clivages partisans a beaucoup plus de poids politique. Convaincre des parlementaires de droite, de centre et de gauche de s'unir contre la réautorisation envoie un signal fort - mais cela demande des compromis.",
          naomiMessages: [
            "C'est ambitieux, mais tu as raison.<br>Il ne faut pas que seuls les députés écologistes et de gauche se sentent concernés par le sujet.<br>Plusieurs parlementaires ont répondu à notre sollicitation et on a réussi à convaincre quelques députés hors de notre camp habituel.",
            "Centre, majorité, parfois même des profils inattendus.<br>Les députés sont prêts à faire une coalition.<br>Bravo\u00a0!<br>Ça change la donne\u00a0: le sujet devient politique… pas seulement idéologique."
          ],
          effectsByTour: [
            { resources: -13, political: 20, score: 17 },
            { resources: -13, political: 25, score: 22 },
            { resources: -13, political: 15, public: 5, score: 17 },
          ],
          naomiCounterMessages: [
            "Réaction rapide du lobby.",
            "Pour info, l'AIPP active ses relais pour casser notre coalition.<br>Je viens d'apprendre qu'ils avaient mobilisé leurs cabinets de conseil en affaires publiques pour multiplier les échanges avec les parlementaires.",
            "Je viens d'avoir au téléphone l'un des députés du centre que nous avions réussi à convaincre.<br>Il hésite désormais à rejoindre la coalition…"
          ],
          counterEffectsByTour: [
            { political: -10, score: -9 },
            { political: -15, score: -14 },
            { political: -15, score: -14 },
          ]
        },
        {
          label: "Obtenir une audition en commission parlementaire",
          description: "Être entendu officiellement en commission parlementaire, c'est être reconnu comme un acteur légitime du débat. ANTIDOTE peut présenter ses arguments directement aux décideurs qui examinent le texte.",
          naomiMessages: [
            "Tu as raison, il faut qu'on sollicite une audition auprès du rapporteur.",
            "Bonne nouvelle\u00a0!<br>On sera auditionné par les parlementaires dès demain\u00a0!<br>On va pouvoir présenter directement nos arguments aux députés."
          ],
          effectsByTour: [
            { resources: -7, political: 15, score: 12 },
            { resources: -7, political: 20, score: 17 },
            { resources: -7, political: 10, score: 7 },
          ],
          naomiCounterMessages: [
            "Évidemment, on ne sera pas les seuls.",
            "L'AIPP est auditionné aussi.",
          ],
          counterEffectsByTour: [
            { political: -10, score: -9 },
            { political: -15, score: -9 },
            { political: -10, score: -9 },
          ]
        }
      ]
    },
    {
      id: 3,
      tourLabel: "Rédaction du rapport",
      tourDescription: "Le rapporteur rédige son rapport, qui commence à structurer le débat politique.",
      tourDate: { day: 30, month: 4, year: 2026 },
      title: "Mobiliser l'expertise scientifique",
      description: "Dans les batailles réglementaires, l'expertise scientifique est un outil clé. Elle permet de contester les arguments des industriels et de donner une légitimité au plaidoyer. Mais l'industrie dispose de moyens considérables pour financer des contre-expertises et semer le doute.",
      actions: [
        {
          label: "Tribune de scientifiques dans la presse",
          description: "Organiser la publication d'une tribune signée par plusieurs chercheurs reconnus permet de donner une visibilité médiatique à l'alerte scientifique sur les risques des pesticides.",
          naomiMessages: [
            "Plusieurs chercheurs se mobilisent. Je te tiens au courant.",
            "Les chercheurs viennent de cosigner et publier une tribune qui alerte sur les risques des pesticides.<br>Ça crédibilise clairement notre position, surtout auprès des médias et des députés.<br>Bravo pour ton travail de mobilisation et de coordination\u00a0!<br><img src=\"images/image14.png\" class=\"chat-img\">"
          ],
          effectsByTour: [
            { resources: -7, political: 15, public: 5,  score: 12 },
            { resources: -7, political: 10, public: 5,  score: 12 },
            { resources: -7, political: 10, public: 10, score: 12 },
          ],
          naomiCounterMessages: [
            "On vient de m'envoyer ça\u00a0!<br>Une tribune \"concurrente\" est sortie dans la foulée.<br>Avec d'autres scientifiques… ou présentés comme tels.<br><img src=\"images/image8.png\" class=\"chat-img\">",
            "Le débat devient technique.<br>Et surtout, il devient confus."
          ],
          counterEffectsByTour: [
            { political: -10, score: -9 },
            { political: -10, score: -9 },
            { political: -10, public: -5, score: -9 },
          ]
        },
        {
          label: "Publier une méta-analyse scientifique",
          description: "Une méta-analyse rassemblant des centaines d'études existantes est un argument scientifique difficile à contester. C'est un travail coûteux mais très solide pour appuyer le plaidoyer.",
          naomiMessages: [
            "Tu as raison, il faut qu'on rassemble les données scientifiques dont on dispose et qu'on produise une analyse solide.<br>Ce sera difficilement attaquable frontalement.",
            "La méta-analyse est publiée !",
          ],
          effectsByTour: [
            { resources: -13, political: 25, score: 17 },
            { resources: -13, political: 20, score: 17 },
            { resources: -7,  political: 15, public: 5, score: 17 },
          ],
          naomiCounterMessages: [
            "L'AIPP vient de contre-attaquer.",
            "Dans une note d'analyse publié sur son blog, le lobby attaque la méthodologie…"
          ],
          counterEffectsByTour: [
            { political: -10, score: -9 },
            { political: -10, score: -9 },
            { political: -10, score: -9 },
          ]
        },
        {
          label: "Prise de position d'une société savante",
          description: "Obtenir la prise de position officielle d'une société savante reconnue - une académie, un collège de médecins - donne un poids institutionnel à la mobilisation scientifique.",
          naomiMessages: [
            "Très bon levier.<br>Une société savante prend rarement position publiquement.<br>Si on y arrive, on gagnera en crédibilité.<br>Car ils seront plus difficilement contestables que nous.",
            "Bravo\u00a0!<br>J'ai eu un échange avec la présidente de la société savante sur le Cancer.<br>Ils devraient prendre position publiquement.",
            "Voilà leur communiqué officiel.<br>Bravo\u00a0!<br><img src=\"images/image11.png\" class=\"chat-img\">"
          ],
          effectsByTour: [
            { resources: -7, political: 20, score: 12 },
            { resources: -7, political: 15, score: 12 },
            { resources: -7, political: 15, public: 5, score: 12 },
          ],
          naomiCounterMessages: [
            "Et voilà, comme par hasard, on vient d'avoir une autre réaction de pseudos autres institutions…"
          ],
          counterEffectsByTour: [
            { political: -10, score: -9 },
            { political: -10, score: -9 },
            { political: -10, score: -9 },
          ]
        }
      ]
    },
    {
      id: 4,
      tourLabel: "Dépôt des amendements en commission",
      tourDescription: "Les députés déposent leurs premiers amendements pour modifier le texte.",
      tourDate: { day: 4, month: 5, year: 2026 },
      title: "Utiliser les médias",
      description: "Les médias sont un terrain de bataille essentiel. La visibilité médiatique permet de peser sur l'opinion publique et d'exercer une pression indirecte sur les décideurs politiques. Mais l'industrie dispose de budgets de communication bien supérieurs à ceux d'une association.",
      actions: [
        {
          label: "Tribune dans un grand journal national",
          description: "Publier une tribune dans un quotidien national permet de toucher à la fois le grand public et les décideurs. Un texte bien argumenté peut avoir un impact durable sur le débat.",
          naomiMessages: [
            "Bonne idée\u00a0!",
            "C'est bon, j'ai Le Monde d'Aujourd'hui.<br>Notre tribune va être publiée dans les colonnes du journal.<br>La rédaction devrait par ailleurs en profiter pour consacrer la Une du journal à notre sujet\u00a0!<br>C'est dingue\u00a0!",
            "Et voilà\u00a0!<br><img src=\"images/image13.png\" class=\"chat-img\">"
          ],
          effectsByTour: [
            { resources: -7, public: 10, score: 12 },
            { resources: -7, public: 15, score: 12 },
            { resources: -7, public: 20, score: 17 },
          ],
          naomiCounterMessages: [
            "Une tribune concurrente vient de sortir dans les médias détenus par Vincent Bolloray, le multipropriétaire des médias privés.<br>On se demande bien qui est derrière…",
            "On est en train de rentrer dans une bataille d'opinion."
          ],
          counterEffectsByTour: [
            { public: -10, score: -9 },
            { public: -10, score: -9 },
            { public: -15, score: -14 },
          ]
        },
        {
          label: "Organiser une conférence de presse",
          description: "Une conférence de presse bien préparée, avec des chiffres solides et des témoignages percutants, peut déclencher une vague d'articles et de reportages favorables à la cause.",
          naomiMessages: [
            "OK, on passe en mode offensif.<br>On organise une conférence de presse avec nos partenaires.",
            "Les journalistes sont là, les prises de parole s'enchaînent.<br>Tu viens\u00a0?<br><img src=\"images/image24.png\" class=\"chat-img\">",
            "J'ai eu un échange avec L'Agence des Français de la Presse.<br>Une dépêche va sortir demain, avec nos chiffres et nos analyses.<br>Ca devrait être repris dans plusieurs médias.<br>Bien joué\u00a0!"
          ],
          effectsByTour: [
            { resources: -13, public: 15, score: 12 },
            { resources: -13, public: 20, score: 17 },
            { resources: -13, public: 25, score: 22 },
          ],
          naomiCounterMessages: [
            "Regarde\u00a0!<br>Y'a une grosse campagne de communication menée par l'AIPP.<br>Leurs représentants sont partout sur les plateaux des chaînes et radios privées…<br>Le directeur général de l'AIPP était ce matin sur CNAZE.<br><img src=\"images/image7.png\" class=\"chat-img\">"
          ],
          counterEffectsByTour: [
            { public: -10, score: -9 },
            { public: -15, score: -14 },
            { public: -20, score: -19 },
          ]
        },
        {
          label: "Révéler un scandale industriel",
          description: "ANTIDOTE dispose de documents montrant les liens entre certains industriels et des responsables politiques. Les révéler peut provoquer une onde de choc médiatique - mais cela coûte cher en ressources et l'industrie contre-attaquera violemment.",
          naomiMessages: [
            "Tu es sur.e que tu veux aller sur ce terrain\u00a0?<br>Ok.<br>On a des éléments solides.<br>Ce n'est pas encore officiel, mais on sait de source sûre que le nouveau conseiller de la ministre est l'ancien…<br>chargé des relations institutionnelles de l'AIPP.",
            "On va rendre ça public, je transmets l'info à Mediapote.",
            "Et voilà\u00a0!<br><img src=\"images/image16.png\" class=\"chat-img\">"
          ],
          effectsByTour: [
            { resources: -13, political: -10, public: 10 },
            { resources: -13, political: 10,  public: 20, score: 22 },
            { resources: -13, political: 5,   public: 25, score: 22 },
          ],
          naomiCounterMessages: [
            "Ça sent pas bon.<br>Les chaînes d'infos continues privées qui appartiennent à Vincent Bolloray,<br>tu sais, le multipropriétaire des médias privées,<br>tournent en boucle sur cette affaire pour dénoncer \"une manipulation politique\"....",
            "L'édito de Pascal Prout ce matin parlait même de \"grand n'importe quoi de la presse indépendante\"....."
          ],
          counterEffectsByTour: [
            { political: -10, score: -9 },
            { political: -15, score: -14 },
            { political: -20, score: -19 },
          ]
        }
      ]
    },
    {
      id: 5,
      tourLabel: "Examen en commission",
      tourDescription: "La commission examine le texte et vote sur les amendements.",
      tourDate: { day: 6, month: 5, year: 2026 },
      title: "Dialoguer avec les agriculteurs",
      description: "L'AIPP, le lobby des pesticides s'appuie massivement sur la figure de l'agriculteur pour légitimer ses positions. Aller à la rencontre des agriculteurs, notamment ceux qui travaillent sans pesticides dangereux, permet de casser ce monopole de représentation.",
      actions: [
        {
          label: "Témoignages d'agriculteurs bio",
          description: "Mettre en avant des agriculteurs qui travaillent sans pesticides dangereux est un contre-récit puissant face à l'argument que \"les agriculteurs ont besoin de ces produits\". Des voix agricoles dans le débat changent la donne.",
          naomiMessages: [
            "Tu as raison.<br>Il faut absolument éviter que notre mobilisation \"contre\" la réintroduction des pesticides interdits soit perçue comme une mobilisation \"contre\" les agriculteurs.<br>D'ailleurs nous ne sommes pas contre l'agriculture mais contre une forme d'agriculture intensive.<br>On va publier des témoignages d'agriculteurs qui travaillent au contact des pesticides dangereux.<br>Après tout, ce sont eux les premières victimes.",
            "Et voilà<br><img src=\"images/image23.png\" class=\"chat-img\">",
          ],
          effectsByTour: [
            { resources: -7, political: 10, public: 10, score: 12 },
            { resources: -7, political: 10, public: 10, score: 12 },
            { resources: -7, political: 5,  public: 10, score: 12 },
          ],
          naomiCounterMessages: [
            "L'AIPP vient de convaincre à priori le syndicat agricole majoritaire qui va entrer dans la danse.",
            "D'après mes infos, ils vont faire intervenir plusieurs de leurs représentants et agriculteurs sur les plateaux télés…",
            "Bah voilà, regarde le cadrage…<br>Ils parlent de contraintes, de rendements, de survie économique.<br><img src=\"images/image19.png\" class=\"chat-img\">"
          ],
          counterEffectsByTour: [
            { public: -5,  score: -9 },
            { public: -10, score: -9 },
            { public: -10, score: -9 },
          ]
        },
        {
          label: "Tribune commune d'agriculteurs",
          description: "Une tribune signée par plusieurs dizaines d'agriculteurs opposés à la réautorisation montre que le monde agricole n'est pas monolithique et que le lobby des pesticides ne parle pas en son nom.",
          naomiMessages: [
            "Ok bonne idée.<br>Je vais proposer la tribune que tu as rédigée à co-signature auprès de plusieurs paysans et agriculteurs en agriculture biologique.",
            "Bonne nouvelle\u00a0!<br>On a plus de 100 co-signatures\u00a0!<br>La tribune sera publiée demain.<br>Ça montre qu'il y a pas qu'une seule agriculture mais \"des\" agricultures, et ça compte."
          ],
          effectsByTour: [
            { resources: -7, political: 10, public: 10, score: 12 },
            { resources: -7, political: 10, public: 15, score: 12 },
            { resources: -7, political: 5,  public: 15, score: 12 },
          ],
          naomiCounterMessages: [
            "L'AIPP, en lien avec le syndicat majoritaire, a réagi vite\u00a0!",
            "Leurs représentants font le tour des plateaux pour continuer à défendre la proposition de loi.<br>On ne va plus parler de la tribune…"
          ],
          counterEffectsByTour: [
            { public: -10, score: -9 },
            { public: -10, score: -9 },
            { public: -15, score: -9 },
          ]
        },
        {
          label: "Rencontres terrain avec les agriculteurs",
          description: "Organiser des rencontres directes sur le terrain permet de construire des relations de confiance avec des agriculteurs qui ne sont pas convaincus par les pesticides. Ce travail de fond prend du temps mais construit des alliances solides.",
          naomiMessages: [
            "Tu as raison, se rencontrer c'est toujours bien.<br>C'est plus long… mais plus solide.<br>On organise des échanges sur le terrain avec des agriculteurs et on travaille sur des pistes de collaboration.",
            "Bon, c'est complètement passé inaperçu.",
          ],
          effectsByTour: [
            { resources: -13, political: 15, public: 10, score: 12 },
            { resources: -13, political: 15, public: 10, score: 12 },
            { resources: -13, political: 10, public: 10, score: 12 },
          ],
          naomiCounterMessages: [
            "L'AIPP en lien avec le syndicat agricole majoritaire continue de conduire des actions de communication à destination de la presse et des chambres d'agriculture au niveau local.",
            "On est invisibilisé\u00a0!"
          ],
          counterEffectsByTour: [
            { political: -5,  public: -5,  score: -9 },
            { political: -5,  public: -10, score: -9 },
            { political: -10, public: -10, score: -9 },
          ]
        }
      ]
    },
    {
      id: 6,
      tourLabel: "Dépôt des amendements en séance",
      tourDescription: "De nouveaux amendements sont déposés en vue de la séance publique.",
      tourDate: { day: 12, month: 5, year: 2026 },
      title: "Mettre le sujet à l'agenda public",
      lockedUntil: 4,
      description: "Mettre un sujet à l'agenda public, c'est le rendre incontournable pour les décideurs. Des citoyens qui signent une pétition, des personnalités qui s'engagent, des campagnes d'interpellation : autant de leviers pour créer une pression politique diffuse mais réelle.",
      actions: [
        {
          label: "Lancer une pétition nationale",
          description: "Une pétition massive est un signal fort envoyé aux parlementaires : des milliers de citoyens regardent comment ils voteront. C'est un outil classique mais toujours efficace pour créer de la pression.",
          naomiMessages: [
            "Bonne idée.<br>On lance une pétition nationale.",
            "Wow\u00a0!<br>Les signatures commencent à monter rapidement.<br>On voit que le sujet parle aux gens.",
            "1 million de signatures\u00a0!<br>C'est dingue\u00a0!<br><img src=\"images/image3.png\" class=\"chat-img\">"
          ],
          effectsByTour: [
            { resources: -7, public: 20, score: 12 },
            { resources: -7, public: 20, score: 12 },
            { resources: -7, public: 20, score: 12 },
          ],
          naomiCounterMessages: [
            "Un sondage vient d'être publié et montre que \"78% Français soutiennent les agriculteurs et sont favorables à la simplification des normes\".",
            "Devine qui est derrière cette opération…<br>C'est une façon de décrédibiliser la pétition.<br><img src=\"images/image20.png\" class=\"chat-img\">"
          ],
          counterEffectsByTour: [
            { public: -10, score: -9 },
            { public: -10, score: -9 },
            { public: -15, score: -14 },
          ]
        },
        {
          label: "Campagne d'interpellation des élus",
          description: "Organiser une campagne où des milliers de citoyens écrivent directement à leurs élus est un outil de pression politique direct. Cela oblige les parlementaires à prendre position.",
          naomiMessages: [
            "Bonne idée\u00a0!<br>On va mettre en place une plateforme d'interpellations des élus.<br>Les personnes qui le souhaitent pourront directement envoyer un message à leurs parlementaires avec un message type.",
            "Les parlementaires commencent à recevoir des dizaines de messages.<br>Certains reviennent vers nous.",
            "On sent que ça bouge.<br><img src=\"images/image25.png\" class=\"chat-img\">"
          ],
          effectsByTour: [
            { resources: -7, political: 10, public: 10, score: 12 },
            { resources: -7, political: 10, public: 10, score: 12 },
            { resources: -7, political: 10, public: 15, score: 17 },
          ],
          naomiCounterMessages: [
            "Une attachée parlementaire que je connais bien vient de m'appeler.<br>Apparemment beaucoup de députés reçoivent des sollicitations pour des demandes d'entretiens avec les représentants de l'AIPP.<br>Ils recevaient aussi des demandes de la part du cabinet de conseil en affaires publiques qui travaille pour eux.",
            "Ils ont sorti l'artillerie lourde."
          ],
          counterEffectsByTour: [
            { political: -10, score: -9 },
            { political: -10, score: -9 },
            { political: -10, public: -10, score: -14 },
          ]
        },
        {
          label: "Lettre ouverte de personnalités publiques",
          description: "Une lettre ouverte signée par des acteurs connus, des sportifs, des artistes engagés peut toucher un public bien au-delà des cercles militants et donner une visibilité nouvelle à la cause.",
          naomiMessages: [
            "Bonne stratégie.",
            "On a réussi à mobiliser plusieurs personnalités.<br>Artistes, scientifiques, figures publiques…<br>Y'a notamment Pierre Ninais qui a signé\u00a0!",
            "Ca y est, la lettre est publiée et reprise dans les médias.<br>Bravo pour ton travail de coordination, ça donne une visibilité supplémentaire au sujet.<br><img src=\"images/image21.png\" class=\"chat-img\">"
          ],
          effectsByTour: [
            { resources: -7, public: 15, score: 12 },
            { resources: -7, public: 15, score: 12 },
            { resources: -7, public: 20, score: 17 },
          ],
          naomiCounterMessages: [
            "Bon… Karine Lamarchande, la célèbre présentatrice de \"L'amour est prêt\" vient de prendre position en faveur du texte.",
            "<img src=\"images/image22.png\" class=\"chat-img\">"
          ],
          counterEffectsByTour: [
            { public: -10, score: -9 },
            { public: -10, score: -9 },
            { public: -15, score: -14 },
          ]
        }
      ]
    },
    {
      id: 7,
      tourLabel: "Début de la séance publique",
      tourDescription: "Le texte arrive dans l'hémicycle et les débats commencent.",
      tourDate: { day: 25, month: 5, year: 2026 },
      title: "Mobiliser les réseaux sociaux",
      lockedUntil: 4,
      description: "Les réseaux sociaux permettent de toucher des millions de personnes à faible coût. Mais ils sont aussi le terrain favori des contre-offensives industrielles : campagnes sponsorisées, trolls organisés, désinformation ciblée. Une arme à double tranchant.",
      actions: [
        {
          label: "Mobiliser des influenceurs",
          description: "Des créateurs de contenu engagés peuvent toucher des millions de personnes jeunes peu habituées aux canaux traditionnels du militantisme. Mais cette visibilité peut attirer la critique sur le sérieux de la campagne.",
          naomiMessages: [
            "OK, on propose à plusieurs \"influ\" de diffuser du contenu.",
            "Bonne nouvelle\u00a0!<br>Le trauma accepte de relayer notre campagne.<br>Il est quand même suivi par 500k followers sur insta\u00a0!<br><img src=\"images/image10.png\" class=\"chat-img\">"
          ],
          effectsByTour: [
            { resources: -7, public: 20, score: 12 },
            { resources: -7, public: 20, score: 12 },
            { resources: -7, public: 25, score: 17 },
          ],
          naomiCounterMessages: [
            "Je suis dégoûtée, regarde ça",
            "Brout vient de publier une vidéo \"reportage\".... sponsorisée par l'AIPP.<br><img src=\"images/image12.png\" class=\"chat-img\">",
            "Ils se moquent vraiment du monde.<br>Un \"reportage vrai / faux\" sur les \"caricatures\" autour des pesticides.<br>Je rêve."
          ],
          counterEffectsByTour: [
            { public: -10, score: -9 },
            { public: -10, score: -9 },
            { public: -20, score: -14 },
          ]
        },
        {
          label: "Lancer une vidéo virale",
          description: "Une vidéo percutante, pédagogique et émotionnellement engageante peut propager la sensibilisation bien au-delà des cercles convaincus. Format idéal pour les réseaux sociaux.",
          naomiMessages: [
            "Bonne idée.<br>Ça va nous prendre du temps mais c'est efficace.<br>On publie une vidéo courte, pédagogique.",
            "La vidéo commence à circuler rapidement.<br>Les vues montent, les partages aussi.<br>C'est bien qu'on arrive à rendre le sujet accessible."
          ],
          effectsByTour: [
            { resources: -7, public: 20, score: 12 },
            { resources: -7, public: 20, score: 12 },
            { resources: -7, public: 25, score: 17 },
          ],
          naomiCounterMessages: [
            "C'est dingue\u00a0!<br>Y'a des centaines de contenus en faveur de la loi qui circulent sur les réseaux.",
            "Ce sont des contenus générés avec l'IA.<br>Regarde ce faux podcast…<br><img src=\"images/image1.png\" class=\"chat-img\">"
          ],
          counterEffectsByTour: [
            { public: -10, score: -9 },
            { public: -10, score: -9 },
            { public: -20, score: -14 },
          ]
        },
        {
          label: "Campagne pédagogique numérique",
          description: "Diffuser une campagne de fond, factuelle et pédagogique, sur les réseaux sociaux : infographies, fils de discussion, explications scientifiques accessibles. Moins spectaculaire mais plus durable.",
          naomiMessages: [
            "On part sur quelque chose de plus structuré.<br>On publie une série de contenus pédagogiques.<br>Explications, chiffres, visuels…<br>C'est moins spectaculaire, mais plus solide.",
            "C'est en ligne !",
          ],
          effectsByTour: [
            { resources: -7, political: 5, public: 10, score: 12 },
            { resources: -7, political: 5, public: 10, score: 12 },
            { resources: -7, political: 5, public: 15, score: 12 },
          ],
          naomiCounterMessages: [
            "C'est dingue\u00a0!",
            "Y'a des centaines de contenus en faveur de la loi qui circulent sur les réseaux.",
            "Ce sont des contenus générés avec l'IA.<br>Nos messages sont complètement dilués.",
            "Regarde ce faux podcast…<br><img src=\"images/image1.png\" class=\"chat-img\">"
          ],
          counterEffectsByTour: [
            { public: -5,  score: -9 },
            { public: -5,  score: -9 },
            { public: -10, score: -9 },
          ]
        }
      ]
    },
    {
      id: 8,
      tourLabel: "Suite des débats en séance",
      tourDescription: "Les députés discutent et votent les articles et amendements.",
      tourDate: { day: 1, month: 6, year: 2026 },
      title: "Actions militantes",
      lockedUntil: 4,
      description: "Les actions militantes - manifestations, actions symboliques, happenings - créent de l'événement médiatique et montrent une mobilisation physique. Elles peuvent galvaniser les soutiens. Mais un incident peut aussi se retourner contre la campagne.",
      actions: [
        {
          label: "Organiser une manifestation nationale",
          description: "Une grande manifestation dans la rue montre la réalité de la mobilisation. Des milliers de personnes dans les rues envoient un signal fort aux décideurs politiques et aux médias.",
          naomiMessages: [
            "Ok. On va mobiliser nos militants.<br>J'envoie un message d'appel à manifestation.<br>Et à relayer l'information, sur notre newsletter et sur nos réseaux sociaux.",
            "On vient d'obtenir l'autorisation en préfecture\u00a0!<br>Rendez-vous confirmé pour la manifestation près de l'Assemblée nationale.",
            "On est plein\u00a0!<br>Ça fait plaisir\u00a0!<br><img src=\"images/image4.png\" class=\"chat-img\">"
          ],
          effectsByTour: [
            { resources: -13, political: -10, public: 20, score: 12 },
            { resources: -13, political: -10, public: 20, score: 12 },
            { resources: -13, political: -5,  public: 20, score: 12 },
          ],
          naomiCounterMessages: [
            "Une partie des médias privés reprennent les éléments de langage de l'AIPP et parlent d'une mobilisation \"idéologique\".",
            "Certains éditos insistent sur le fait qu'on s'attaque aux agriculteurs.<br>Ca me rend dingue\u00a0!"
          ],
          counterEffectsByTour: [
            { political: -10, score: -9 },
            { political: -10, score: -9 },
            { political: -10, public: -10, score: -14 },
          ]
        },
        {
          label: "Action symbolique devant l'Assemblée nationale",
          description: "Une action symbolique, bien scénarisée, devant l'Assemblée nationale ou un ministère peut générer des images fortes qui circulent dans les médias. L'objectif : rendre visible l'enjeu politique.",
          naomiMessages: [
            "Ok. On va mobiliser nos militants.<br>J'envoie un message d'appel à manifestation, et à relayer l'information, sur notre newsletter et sur nos réseaux sociaux.",
            "On vient d'obtenir l'autorisation en préfecture\u00a0!<br>Rendez-vous confirmé pour la manifestation près de l'Assemblée nationale.",
            "On est plein\u00a0!<br>Ça fait plaisir\u00a0!<br><img src=\"images/image4.png\" class=\"chat-img\">"
          ],
          effectsByTour: [
            { resources: -7, public: 15, score: 12 },
            { resources: -7, public: 15, score: 12 },
            { resources: -7, public: 20, score: 12 },
          ],
          naomiCounterMessages: [
            "Bon… j'ai eu au téléphone une copine attachée parlementaire.<br>Elle a entendu dire de la bouche d'un député que les parlementaires parlaient d'une \"manifestation symbolique\".<br>Quand ils en ont entendu parler…"
          ],
          counterEffectsByTour: [
            { public: -5,  score: -9 },
            { public: -5,  score: -9 },
            { public: -10, score: -9 },
          ]
        },
        {
          label: "Happening médiatique",
          description: "Un happening créatif et surprenant peut créer un buzz médiatique important. Mais son impact dépend beaucoup de l'exécution et du contexte - et la réaction du public peut être imprévisible.",
          naomiMessages: [
            "C'est ambitieux, mais d'accord\u00a0!<br>On tente quelque chose de plus marquant.<br>On va mettre en scène une action rigolote pensée pour les médias.<br>Je propose qu'on manifeste avec des faux cercueils devant le siège de l'AIPP\u00a0!<br>C'est bien, cela va attirer l'attention.",
            "Elle claque cette opération\u00a0!<br><img src=\"images/image6.png\" class=\"chat-img\">"
          ],
          effectsByTour: [
            { resources: -13, political: -10, public: 20, score: 12 },
            { resources: -13, political: -10, public: 20, score: 12 },
            { resources: -13, political: -5,  public: 20, score: 12 },
          ],
          naomiCounterMessages: [
            "Bon l'AIPP n'a pas apprécié.",
            "Ils viennent de publier un communiqué pour dénoncer une \"manipulation émotionnelle\" faite par, tiens toi bien...<br>de \"dangereux écologistes qui ont mis en danger l'intégrité physique du siège\"..."
          ],
          counterEffectsByTour: [
            { political: -10, score: -9 },
            { political: -10, score: -9 },
            { political: -10, public: -10, score: -14 },
          ]
        }
      ]
    },
    {
      id: 9,
      tourLabel: "Vote solennel",
      tourDescription: "Les députés se prononcent sur l'ensemble du texte.",
      tourDate: { day: 5, month: 6, year: 2026 },
      title: "Lobbying Direct",
      lockedUntil: 5,
      description: "Avec l'ouverture des débats en séance publique, le lobbying direct prend toute son importance. Rencontrer les parlementaires en face à face, leur transmettre des analyses précises et déposer des amendements sont les leviers les plus efficaces pour modifier le texte - et les plus difficiles à contrer pour les industriels.",
      actions: [
        {
          label: "Rédiger et transmettre des amendements",
          description: "Rédiger des amendements techniques en collaboration avec des parlementaires alliés et les transmettre officiellement avant la séance publique. Modifier le texte directement est l'objectif final de tout plaidoyer législatif.",
          naomiMessages: [
            "Bonne idée.<br>Je te suggère de rédiger un amendement précis de suppression pour la proposition de loi tombe assez rapidement, s'il était adopté.",
            "Le voici, on les transmet ensemble directement à plusieurs députés.<br><img src=\"images/image5.png\" class=\"chat-img\">"
          ],
          effectsByTour: [
            { resources: -7, political: 20, score: 17 },
            { resources: -7, political: 20, score: 17 },
            { resources: -7, political: 20, score: 22 },
          ],
          naomiCounterMessages: [
            "Tu as regardé la liasse des amendements qui circulent\u00a0?<br>Beaucoup proviennent de l'AIPP…<br>Mais très peu sont \"sourcés\", comme d'habitude.",
            "Au moins 7 députés ont déposé le même amendement pour soutenir et renforcer le texte.<br>C'est dingue\u00a0!",
            "Le rapport de force n'est pas bon pour nous."
          ],
          counterEffectsByTour: [
            { political: -10, score: -9 },
            { political: -10, score: -9 },
            { political: -15, score: -14 },
          ]
        },
        {
          label: "Rencontrer directement des parlementaires clés",
          description: "Rencontrer en face à face les parlementaires indécis ou influents dans les commissions pour les convaincre de voter contre la réautorisation. Un échange direct permet de lever les doutes et de bâtir une confiance que les courriers ne permettent pas.",
          naomiMessages: [
            "Bonne approche.<br>Je t'aide à organiser des rendez-vous ciblés avec les principaux responsables de textes\u00a0: rapporteur, responsables du texte…<br>On ne pourra pas faire tellement plus, on manque de temps pour aller les voir.",
            "Bon… Voici le message de la collaboratrice parlementaire du rapporteur du texte.<br>Je pense que c'est assez explicite. <br><img src=\"images/image9.png\" class=\"chat-img\">",
          ],
          effectsByTour: [
            { resources: -7, political: 15, score: 17 },
            { resources: -7, political: 15, score: 17 },
            { resources: -7, political: 15, score: 22 },
          ],
          naomiCounterMessages: [
            "L'AIPP a bien fait le travail en lien avec son cabinet de conseil en affaires publiques.",
            "J'ai l'impression qu'ils ont eu le temps de rencontrer déjà tout le monde\u00a0!"
          ],
          counterEffectsByTour: [
            { political: -10, score: -9 },
            { political: -10, score: -9 },
            { political: -10, score: -14 },
          ]
        },
        {
          label: "Transmettre des notes d'analyse aux cabinets",
          description: "Préparer et transmettre des notes de synthèse factuelles aux cabinets ministériels et à l'administration pour alimenter leur réflexion avec une expertise indépendante. Influencer l'administration, c'est influencer les arbitrages en amont du vote.",
          naomiMessages: [
            "Tu as raison, on peut aussi tenter de convaincre l'administration et les différents cabinets ministériels concernés.<br>Il doit y avoir une note dans le drive commun.<br>Je te laisse la mettre à jour et ensuite, on l'enverra au ministère de la Transition écologique ainsi qu'au Ministère de l'agriculture et leurs administrations.",
            "Bon…",
          ],
          effectsByTour: [
            { resources: -7, political: 10, score: 12 },
            { resources: -7, political: 10, score: 12 },
            { resources: -7, political: 15, score: 17 },
          ],
          naomiCounterMessages: [
            "L'AIPP a fait la même chose, appuyé par une \"note économique sur l'impact sur les filières\" produite par un grand cabinet de conseil…",
            "Apparemment, le ministre de l'Economie et des Finances pousse en faveur du texte auprès des parlementaires…<br><img src=\"images/image15.png\" class=\"chat-img\">"
          ],
          counterEffectsByTour: [
            { political: -5, score: -9 },
            { political: -5, score: -9 },
            { political: -10, score: -9 },
          ]
        }
      ]
    },
    {
      id: 10,
      tourLabel: "Après-vote",
      tourDescription: "Le résultat déclenche des réactions politiques et peut ouvrir une nouvelle phase de bataille.",
      tourDate: { day: 8, month: 6, year: 2026 },
      title: "Bataille juridique",
      lockedUntil: 8,
      description: "En fin de processus législatif, la voie juridique s'ouvre comme dernier levier. Les recours, plaintes et stratégies judiciaires permettent de peser sur le débat par un autre canal - parfois le seul restant quand les autres leviers sont bloqués.",
      actions: [
        {
          label: "Déposer un recours juridique",
          description: "Contester juridiquement la réautorisation de certains pesticides devant les tribunaux administratifs peut bloquer ou retarder le processus. C'est coûteux mais potentiellement très efficace.",
          naomiMessages: [
            "Tu as raison.<br>On dépose un recours.<br>On conteste la réautorisation sur des bases juridiques solides auprès du Conseil constitutionnel.",
            "Ça ne fera pas la une, mais ça pèse.<br>On ouvre un nouveau front."
          ],
          effectsByTour: [
            { resources: -13, political: 20, score: 22 },
            { resources: -13, political: 20, score: 22 },
            { resources: -13, political: 20, score: 22 },
          ],
          naomiCounterMessages: [
            "Mais l'AIPP ne va pas se laisser faire.<br>D'après les informations de notre avocate, ils mobilisent leurs équipes juridiques et font appel à un cabinet d'expert.",
            "Ils sont bien équipés désormais… et vont chercher à ralentir la procédure… et à la décrédibiliser."
          ],
          counterEffectsByTour: [
            { resources: -5, political: -10, score: -9 },
            { resources: -5, political: -10, score: -9 },
            { resources: -5, political: -10, score: -9 },
          ]
        },
        {
          label: "Déposer une plainte environnementale",
          description: "Une plainte pour atteinte à l'environnement ou mise en danger d'autrui met en lumière la responsabilité des acteurs de l'industrie et peut contraindre des enquêtes officielles.",
          naomiMessages: [
            "Bonne idée\u00a0!<br>On porte plainte contre X en lien avec Notre Affaire à Toutes et tous.<br>Ça peut créer une pression supplémentaire.<br>Et alimenter le débat public en parallèle.",
            "Notre plainte a bien été transmise.",
          ],
          effectsByTour: [
            { resources: -13, political: 15, public: 5, score: 17 },
            { resources: -13, political: 15, public: 5, score: 17 },
            { resources: -13, political: 15, public: 5, score: 17 },
          ],
          naomiCounterMessages: [
            "L'AIPP ne va pas se laisser faire.<br>D'après les informations de notre avocate, ils mobilisent leurs équipes juridiques et font appel à un cabinet d'expert.",
            "Ils sont bien équipés désormais…<br>et vont chercher à ralentir la procédure…<br>et à la décrédibiliser.",
            "Et surtout, ça va prendre des années avant que le dossier ne soit instruit…"
          ],
          counterEffectsByTour: [
            { resources: -5, political: -10, score: -9 },
            { resources: -5, political: -10, score: -9 },
            { resources: -5, political: -10, score: -9 },
          ]
        },
        {
          label: "Mobiliser un collectif d'avocats",
          description: "Rassembler un collectif d'avocats spécialisés en droit de l'environnement permet de construire une stratégie judiciaire robuste sans dépenser immédiatement des ressources importantes.",
          naomiMessages: [
            "Bonne stratégie.<br>On va structurer une réponse juridique solide auprès du conseil constitutionnel.",
            "J'ai contacté notre avocate qui doit consulter plusieurs de ses confrères et sœurs sur ce sujet."
          ],
          effectsByTour: [
            { resources: -13, political: 20, score: 17 },
            { resources: -13, political: 20, score: 17 },
            { resources: -13, political: 20, score: 17 },
          ],
          naomiCounterMessages: [
            "Nos observations ont été bien transmises.",
            "Mais l'AIPP ne va pas se laisser faire.<br>D'après les informations de notre avocate, ils mobilisent leurs équipes juridiques et font appel à un cabinet d'expert.",
            "Ils sont bien équipés désormais…<br>et vont chercher à ralentir la procédure…<br>et à la décrédibiliser."
          ],
          counterEffectsByTour: [
            { resources: -5, political: -10, score: -9 },
            { resources: -5, political: -10, score: -9 },
            { resources: -5, political: -10, score: -9 },
          ]
        }
      ]
    }
  ]
};
