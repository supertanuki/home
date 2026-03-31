const GAME_DATA = {
  initialScores: {
    public: 4,
    political: 3,
    resources: 4
  },

  endConditions: {
    publicZero: {
      title: "Fin de Partie - Soutien du Public à 0",
      subtitle: "La mobilisation citoyenne s'est effondrée",
      description: "Sans soutien populaire, ANTIDOTE n'a plus de poids dans le débat. Les médias ont tourné le dos à la cause, les élus ne voient plus de pression citoyenne suffisante pour résister aux industriels. Le lobby des pesticides a réussi à décrédibiliser la mobilisation et à isoler l'association. La proposition de loi avance sans opposition effective.",
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
      cta: "Même après une défaite, les associations ne s'arrêtent pas. Les recours juridiques, les mobilisations européennes et la pression citoyenne continuent de peser sur les décisions."
    },
    {
      id: "statu_quo",
      icon: "⚖️",
      badgeClass: "badge-statu-quo",
      title: "Statu quo",
      description: "La loi est adoptée, mais fortement limitée. La mobilisation d'ANTIDOTE a suffi à réduire la portée du texte, mais n'a pas permis de le bloquer totalement. Quelques pesticides sont réautorisés, mais les plus dangereux ont été écartés grâce à la pression combinée des scientifiques, des parlementaires alliés et de l'opinion publique.",
      conclusion: "Un statu quo peut ressembler à un échec, mais c'est souvent le résultat réel des batailles politiques. Les associations ont réussi à limiter les dégâts et posé les bases pour les prochains combats.",
      cta: "Les batailles politiques se gagnent rarement d'un coup. Chaque avancée partielle construit la pression pour les réformes suivantes. Restez mobilisés."
    },
    {
      id: "partial_win",
      icon: "🏅",
      badgeClass: "badge-partial-win",
      title: "Victoire partielle d'ANTIDOTE",
      description: "La mobilisation a porté ses fruits. La majorité des pesticides dangereux reste interdite. La loi a été fortement amendée grâce à la coalition que vous avez construite : scientifiques, parlementaires, citoyens et médias ont exercé une pression suffisante pour faire reculer les industriels sur l'essentiel. Une victoire significative.",
      conclusion: "Cette victoire partielle montre qu'une association bien organisée peut peser face à des intérêts industriels puissants. La clé : construire des coalitions larges, mobiliser l'expertise, et maintenir la pression citoyenne.",
      cta: "Ce résultat est possible dans la réalité. Des associations comme celle-ci remportent régulièrement des victoires partielles qui protègent notre santé et notre environnement."
    },
    {
      id: "complete_win",
      icon: "🏆",
      badgeClass: "badge-complete-win",
      title: "Victoire complète d'ANTIDOTE",
      description: "La loi est rejetée. La mobilisation citoyenne et scientifique coordonnée par ANTIDOTE a réussi à faire reculer les décideurs politiques. La coalition construite au fil des tours a rendu politiquement coûteux le soutien à la réautorisation. Les parlementaires n'ont pas pu ignorer la pression populaire, scientifique et médiatique combinée.",
      conclusion: "Mais le lobby des pesticides reste puissant. La bataille continue. Cette victoire démontre qu'une stratégie de plaidoyer bien construite peut contrebalancer des moyens financiers considérables. C'est une leçon précieuse pour toutes les campagnes à venir.",
      cta: "Cette victoire est possible. Elle se construit dans la réalité grâce à des milliers de bénévoles, de scientifiques engagés et de citoyens mobilisés. Rejoignez-les."
    }
  ],

  events: [
    {
      id: "health_data",
      icon: "🔬",
      title: "Publication de nouvelles données sanitaires",
      description: "Une agence publique publie de nouvelles données sur l'exposition aux pesticides dans les zones agricoles. Le débat prend une dimension sanitaire inattendue.",
      outcome: "Les données appuient les arguments d'ANTIDOTE. Les médias s'emparent du sujet, plusieurs parlementaires demandent un moratoire.",
      effects: { public: 2, political: 1, resources: 0 }
    },
    {
      id: "journalism",
      icon: "📰",
      title: "Enquête journalistique",
      description: "Un grand média publie une enquête révélant les liens étroits entre plusieurs responsables de l'industrie des pesticides et des décideurs politiques.",
      outcome: "L'enquête fragilise publiquement la position du lobby. Les parlementaires les plus proches des industriels sont sur la défensive.",
      effects: { public: 2, political: 1, resources: 0 }
    },
    {
      id: "farm_mobilization",
      icon: "🚜",
      title: "Mobilisation agricole nationale",
      description: "Un grand syndicat agricole appelle à soutenir la réautorisation des pesticides et organise une journée nationale de mobilisation.",
      outcome: "La mobilisation met les parlementaires ruraux sous forte pression. Le rapport de force se durcit en faveur du lobby.",
      effects: { public: -1, political: -2, resources: 0 }
    },
    {
      id: "gov_arbitration",
      icon: "🏛️",
      title: "Arbitrage du gouvernement",
      description: "La ministre de l'Agriculture prend position publiquement dans le débat sur la réautorisation des pesticides, invoquant l'intérêt économique du monde agricole.",
      outcome: "La prise de position ministérielle fragilise la coalition parlementaire opposée à la loi. ANTIDOTE doit redoubler d'efforts pour maintenir ses alliés.",
      effects: { public: 0, political: -1, resources: 1 }
    }
  ],

  phases: [
    {
      id: 1,
      tourLabel: "Inscription et désignation du rapporteur",
      tourDescription: "Le texte est inscrit à l'ordre du jour et un rapporteur est désigné pour piloter son examen.",
      tourDate: { day: 2, month: 4, year: 2026 },
      title: "Coalition d'organisations",
      description: "Construire une coalition d'associations est souvent la première étape d'une stratégie de plaidoyer. En unissant leurs forces, les organisations multiplient leur visibilité et leur crédibilité. Mais chaque alliance a ses fragilités - et le lobby s'empressera de les exploiter.",
      actions: [
        {
          label: "Rassembler des associations environnementales",
          description: "Coordonner plusieurs ONG environnementales pour dénoncer publiquement la réautorisation. Un communiqué commun, une prise de parole unitaire - la coalition envoie un signal fort aux médias et aux élus.",
          scenario: "ANTIDOTE rassemble plusieurs associations environnementales pour dénoncer publiquement la réautorisation de pesticides dangereux. La coalition publie un communiqué commun et alerte les médias.",
          effects: { public: 2, political: 0, resources: 0 },
          counterAttack: "Les industriels dénoncent une campagne idéologique menée par des ONG déconnectées de la réalité agricole. Ils multiplient les interventions dans les médias pour défendre les pesticides.",
          counterEffects: { public: -1, political: 0, resources: 0 }
        },
        {
          label: "Alliance avec des associations de santé",
          description: "Nouer une alliance avec des associations de médecins et de patients permet de faire sortir le débat du seul cadre environnemental. Les arguments sanitaires touchent un public plus large et sont plus difficiles à contester politiquement.",
          scenario: "ANTIDOTE travaille avec des associations de médecins et de patients pour mettre en lumière les risques sanitaires des pesticides. Le débat commence à dépasser le cadre strictement environnemental.",
          effects: { public: 1, political: 1, resources: 0 },
          counterAttack: "L'industrie conteste les données scientifiques et affirme que les pesticides sont utilisés en toute sécurité. Elle finance ses propres experts pour contre-attaquer.",
          counterEffects: { public: 0, political: -1, resources: 0 }
        },
        {
          label: "Mobiliser des scientifiques et chercheurs",
          description: "Mobiliser des chercheurs pour soutenir publiquement la position d'ANTIDOTE renforce la légitimité scientifique de la campagne. Une communauté scientifique unie est difficile à ignorer pour les décideurs.",
          scenario: "Des chercheurs et experts scientifiques apportent leur soutien public à ANTIDOTE. La prise de position de la communauté scientifique renforce le poids de l'association dans le débat.",
          effects: { public: 0, political: 1, resources: -1 },
          counterAttack: "Le lobby des pesticides finance rapidement une contre-expertise pour semer le doute sur les conclusions scientifiques. Il s'appuie sur quelques chercheurs dissidents pour brouiller le message.",
          counterEffects: { public: 0, political: -1, resources: 0 }
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
          scenario: "Des députés écologistes et de gauche s'engagent publiquement contre la proposition de loi. Une opposition parlementaire organisée commence à se structurer autour d'ANTIDOTE.",
          effects: { public: 0, political: 2, resources: 0 },
          counterAttack: "Le lobby des pesticides riposte en finançant une campagne accusant ces parlementaires de s'attaquer au monde agricole et à l'emploi rural.",
          counterEffects: { public: 0, political: -2, resources: 0 }
        },
        {
          label: "Construire une coalition transpartisane",
          description: "Une coalition qui dépasse les clivages partisans a beaucoup plus de poids politique. Convaincre des parlementaires de droite, de centre et de gauche de s'unir contre la réautorisation envoie un signal fort - mais cela demande des compromis.",
          scenario: "ANTIDOTE parvient à convaincre des parlementaires de différents bords politiques. Une coalition transpartisane se forme pour bloquer la réautorisation des pesticides.",
          effects: { public: 1, political: 3, resources: 0 },
          counterAttack: "Le lobby des pesticides exerce une pression intense sur les parlementaires du centre et de la droite pour les faire sortir de la coalition. Plusieurs hésitent.",
          counterEffects: { public: 0, political: -2, resources: 0 }
        },
        {
          label: "Obtenir une audition en commission parlementaire",
          description: "Être entendu officiellement en commission parlementaire, c'est être reconnu comme un acteur légitime du débat. ANTIDOTE peut présenter ses arguments directement aux décideurs qui examinent le texte.",
          scenario: "ANTIDOTE obtient une audition officielle lors de l'examen du texte en commission parlementaire. L'association présente ses arguments directement aux élus qui vont voter sur la loi.",
          effects: { public: 0, political: 2, resources: 0 },
          counterAttack: "L'industrie obtient elle aussi une audition et mobilise ses experts pour contrecarrer les arguments d'ANTIDOTE.",
          counterEffects: { public: 0, political: -1, resources: 0 }
        }
      ]
    },
    {
      id: 3,
      tourLabel: "Rédaction du rapport",
      tourDescription: "Le rapporteur rédige son rapport, qui commence à structurer le débat politique.",
      tourDate: { day: 30, month: 4, year: 2026 },
      title: "Expertise scientifique",
      description: "Dans les batailles réglementaires, l'expertise scientifique est un outil clé. Elle permet de contester les arguments des industriels et de donner une légitimité au plaidoyer. Mais l'industrie dispose de moyens considérables pour financer des contre-expertises et semer le doute.",
      actions: [
        {
          label: "Tribune de scientifiques dans la presse",
          description: "Organiser la publication d'une tribune signée par plusieurs chercheurs reconnus permet de donner une visibilité médiatique à l'alerte scientifique sur les risques des pesticides.",
          scenario: "Plusieurs chercheurs publient une tribune dans un grand quotidien national dénonçant les risques des pesticides concernés par la loi. Le sujet gagne en légitimité dans le débat public.",
          effects: { public: 1, political: 1, resources: 0 },
          counterAttack: "Le lobby des industriels finance rapidement une contre-tribune signée par des experts qu'il rémunère pour semer le doute sur les conclusions scientifiques.",
          counterEffects: { public: 0, political: -1, resources: 0 }
        },
        {
          label: "Publier une méta-analyse scientifique",
          description: "Une méta-analyse rassemblant des centaines d'études existantes est un argument scientifique difficile à contester. C'est un travail coûteux mais très solide pour appuyer le plaidoyer.",
          scenario: "ANTIDOTE publie une méta-analyse scientifique compilant l'ensemble des études sur les effets des pesticides concernés. C'est un argument de poids pour les parlementaires et les médias.",
          effects: { public: 1, political: 2, resources: -2 },
          counterAttack: "L'industrie finance immédiatement sa propre étude pour contester les conclusions. Elle soulève des questions méthodologiques pour brouiller le message.",
          counterEffects: { public: 0, political: -2, resources: 0 }
        },
        {
          label: "Prise de position d'une société savante",
          description: "Obtenir la prise de position officielle d'une société savante reconnue - une académie, un collège de médecins - donne un poids institutionnel à la mobilisation scientifique.",
          scenario: "Une société savante de renom prend officiellement position contre la réautorisation des pesticides dangereux. Cette prise de position institutionnelle est difficile à ignorer.",
          effects: { public: 0, political: 2, resources: 0 },
          counterAttack: "Le lobby des pesticides tente de discréditer la société savante en la présentant comme proche des milieux militants. Il finance des tribunes de dissidence.",
          counterEffects: { public: 0, political: -1, resources: 0 }
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
          scenario: "Une tribune d'ANTIDOTE est publiée dans un grand quotidien national. Le sujet des pesticides revient au centre du débat public. Plusieurs parlementaires réagissent.",
          effects: { public: 2, political: 0, resources: 0 },
          counterAttack: "Des représentants de l'industrie publient une tribune concurrente pour défendre la loi et présenter la réautorisation comme une nécessité économique.",
          counterEffects: { public: -2, political: 0, resources: 0 }
        },
        {
          label: "Organiser une conférence de presse",
          description: "Une conférence de presse bien préparée, avec des chiffres solides et des témoignages percutants, peut déclencher une vague d'articles et de reportages favorables à la cause.",
          scenario: "ANTIDOTE organise une conférence de presse réunissant scientifiques, lanceurs d'alerte et victimes de pesticides. Les médias couvrent largement l'événement.",
          effects: { public: 1, political: 1, resources: 0 },
          counterAttack: "L'industrie organise le lendemain sa propre conférence de presse avec ses experts pour tenter de noyer le message.",
          counterEffects: { public: 0, political: -1, resources: 0 }
        },
        {
          label: "Révéler un scandale industriel",
          description: "ANTIDOTE dispose de documents montrant les liens entre certains industriels et des responsables politiques. Les révéler peut provoquer une onde de choc médiatique - mais cela coûte cher en ressources et l'industrie contre-attaquera violemment.",
          scenario: "ANTIDOTE révèle des documents montrant les liens étroits entre l'industrie des pesticides et des responsables politiques. L'affaire fait grand bruit dans les médias. Les parlementaires sont embarrassés.",
          effects: { public: 4, political: 0, resources: -2 },
          counterAttack: "Le lobby industriel accuse ANTIDOTE de manipulation et de faire de la politique. Il tente de décrédibiliser l'enquête et menace l'association de poursuites judiciaires.",
          counterEffects: { public: -2, political: 0, resources: 0 }
        }
      ]
    },
    {
      id: 5,
      tourLabel: "Examen en commission",
      tourDescription: "La commission examine le texte et vote sur les amendements.",
      tourDate: { day: 6, month: 5, year: 2026 },
      title: "Agenda public",
      description: "Mettre un sujet à l'agenda public, c'est le rendre incontournable pour les décideurs. Des citoyens qui signent une pétition, des personnalités qui s'engagent, des campagnes d'interpellation : autant de leviers pour créer une pression politique diffuse mais réelle.",
      actions: [
        {
          label: "Lancer une pétition nationale",
          description: "Une pétition massive est un signal fort envoyé aux parlementaires : des milliers de citoyens regardent comment ils voteront. C'est un outil classique mais toujours efficace pour créer de la pression.",
          scenario: "ANTIDOTE lance une pétition nationale contre la réautorisation des pesticides. Des milliers de citoyens la signent en quelques jours. Le sujet commence à inquiéter certains élus.",
          effects: { public: 2, political: 0, resources: 0 },
          counterAttack: "Les industriels financent un sondage affirmant que la majorité des agriculteurs ont besoin de ces produits. Les médias relaient les deux chiffres.",
          counterEffects: { public: -1, political: 0, resources: 0 }
        },
        {
          label: "Campagne d'interpellation des élus",
          description: "Organiser une campagne où des milliers de citoyens écrivent directement à leurs élus est un outil de pression politique direct. Cela oblige les parlementaires à prendre position.",
          scenario: "Des milliers de citoyens contactent leurs députés pour leur demander de rejeter la loi. Les élus qui hésitaient ressentent la pression dans leurs circonscriptions.",
          effects: { public: 0, political: 2, resources: 0 },
          counterAttack: "Le lobby des pesticides réplique en mobilisant ses réseaux agricoles pour une contre-campagne d'interpellation en sens inverse.",
          counterEffects: { public: 0, political: -2, resources: 0 }
        },
        {
          label: "Lettre ouverte de personnalités publiques",
          description: "Une lettre ouverte signée par des acteurs connus, des sportifs, des artistes engagés peut toucher un public bien au-delà des cercles militants et donner une visibilité nouvelle à la cause.",
          scenario: "Des personnalités publiques signent une lettre ouverte contre la réautorisation des pesticides. La médiatisation de leur engagement touche un large public et crée un effet de légitimité.",
          effects: { public: 1, political: 1, resources: 0 },
          counterAttack: "L'industrie instrumentalise des agriculteurs pour dénoncer l'ingérence des « célébrités parisiennes » dans leurs affaires.",
          counterEffects: { public: -1, political: 0, resources: 0 }
        }
      ]
    },
    {
      id: 6,
      tourLabel: "Dépôt des amendements en séance",
      tourDescription: "De nouveaux amendements sont déposés en vue de la séance publique.",
      tourDate: { day: 12, month: 5, year: 2026 },
      title: "Réseaux sociaux",
      description: "Les réseaux sociaux permettent de toucher des millions de personnes à faible coût. Mais ils sont aussi le terrain favori des contre-offensives industrielles : campagnes sponsorisées, trolls organisés, désinformation ciblée. Une arme à double tranchant.",
      actions: [
        {
          label: "Mobiliser des influenceurs",
          description: "Des créateurs de contenu engagés peuvent toucher des millions de personnes jeunes peu habituées aux canaux traditionnels du militantisme. Mais cette visibilité peut attirer la critique sur le sérieux de la campagne.",
          scenario: "Des influenceurs relaient la campagne d'ANTIDOTE sur les réseaux sociaux. La question des pesticides devient virale et touche un public nouveau, particulièrement les 18-35 ans.",
          effects: { public: 3, political: 0, resources: 0 },
          counterAttack: "L'industrie finance à son tour des campagnes sponsorisées massives pour contrecarrer le message et noyer la visibilité d'ANTIDOTE.",
          counterEffects: { public: -2, political: 0, resources: 0 }
        },
        {
          label: "Lancer une vidéo virale",
          description: "Une vidéo percutante, pédagogique et émotionnellement engageante peut propager la sensibilisation bien au-delà des cercles convaincus. Format idéal pour les réseaux sociaux.",
          scenario: "ANTIDOTE publie une vidéo expliquant simplement les risques liés aux pesticides concernés. Elle est massivement partagée et génère de nombreuses réactions publiques.",
          effects: { public: 2, political: 0, resources: 0 },
          counterAttack: "Le lobby des pesticides produit sa propre vidéo mettant en scène des agriculteurs défendant leur travail et présentant les ONG comme des ennemis du monde rural.",
          counterEffects: { public: -1, political: 0, resources: 0 }
        },
        {
          label: "Campagne pédagogique numérique",
          description: "Diffuser une campagne de fond, factuelle et pédagogique, sur les réseaux sociaux : infographies, fils de discussion, explications scientifiques accessibles. Moins spectaculaire mais plus durable.",
          scenario: "ANTIDOTE diffuse une série de contenus pédagogiques sur les réseaux sociaux. L'audience engagée grandit, la qualité des échanges s'améliore et la campagne gagne en profondeur.",
          effects: { public: 1, political: 1, resources: 0 },
          counterAttack: "L'industrie intensifie sa présence numérique avec des publicités ciblées contredisant les informations d'ANTIDOTE.",
          counterEffects: { public: -1, political: 0, resources: 0 }
        }
      ]
    },
    {
      id: 7,
      tourLabel: "Début de la séance publique",
      tourDescription: "Le texte arrive dans l'hémicycle et les débats commencent.",
      tourDate: { day: 25, month: 5, year: 2026 },
      title: "Actions militantes",
      description: "Les actions militantes - manifestations, actions symboliques, happenings - créent de l'événement médiatique et montrent une mobilisation physique. Elles peuvent galvaniser les soutiens. Mais un incident peut aussi se retourner contre la campagne.",
      actions: [
        {
          label: "Organiser une manifestation nationale",
          description: "Une grande manifestation dans la rue montre la réalité de la mobilisation. Des milliers de personnes dans les rues envoient un signal fort aux décideurs politiques et aux médias.",
          scenario: "Plusieurs milliers de personnes manifestent contre la réautorisation des pesticides. Les images font le tour des médias. Des parlementaires prennent note de l'ampleur de la mobilisation.",
          effects: { public: 3, political: 0, resources: 0 },
          counterAttack: "Le lobby des industriels accuse les ONG de s'attaquer au monde agricole et mobilise des syndicats agricoles pour organiser une contre-manifestation.",
          counterEffects: { public: -1, political: 0, resources: 0 }
        },
        {
          label: "Action symbolique devant l'Assemblée nationale",
          description: "Une action symbolique, bien scénarisée, devant l'Assemblée nationale ou un ministère peut générer des images fortes qui circulent dans les médias. L'objectif : rendre visible l'enjeu politique.",
          scenario: "ANTIDOTE mène une action symbolique percutante devant l'Assemblée nationale. Les images circulent dans la presse et sur les réseaux sociaux, rappelant aux élus que la société civile les observe.",
          effects: { public: 2, political: 0, resources: 0 },
          counterAttack: "L'industrie et ses alliés agricoles dénoncent l'action comme provocatrice et hors-sol. Ils tentent de retourner l'opinion contre les militants.",
          counterEffects: { public: -1, political: 0, resources: 0 }
        },
        {
          label: "Happening médiatique",
          description: "Un happening créatif et surprenant peut créer un buzz médiatique important. Mais son impact dépend beaucoup de l'exécution et du contexte - et la réaction du public peut être imprévisible.",
          scenario: "ANTIDOTE organise un happening médiatique percutant qui dénonce l'influence du lobby des pesticides. L'action est largement commentée sur les réseaux sociaux et dans la presse.",
          effects: { public: 2, political: 0, resources: -2 },
          counterAttack: "Le lobby des pesticides et certains médias ironisent sur l'action, la présentant comme du théâtre militant sans contenu sérieux.",
          counterEffects: { public: -1, political: 0, resources: 0 }
        }
      ]
    },
    {
      id: 8,
      tourLabel: "Suite des débats en séance",
      tourDescription: "Les députés discutent et votent les articles et amendements.",
      tourDate: { day: 1, month: 6, year: 2026 },
      title: "Dialoguer avec les agriculteurs",
      description: "Le lobby des pesticides s'appuie massivement sur la figure de l'agriculteur pour légitimer ses positions. Aller à la rencontre des agriculteurs, notamment ceux qui travaillent sans pesticides dangereux, permet de casser ce monopole de représentation.",
      actions: [
        {
          label: "Témoignages d'agriculteurs bio",
          description: "Mettre en avant des agriculteurs qui travaillent sans pesticides dangereux est un contre-récit puissant face à l'argument que \"les agriculteurs ont besoin de ces produits\". Des voix agricoles dans le débat changent la donne.",
          scenario: "Des agriculteurs expliquent publiquement qu'il est possible et rentable de produire sans pesticides dangereux. Le débat devient plus nuancé et sort du clivage ONG vs. agriculture.",
          effects: { public: 1, political: 0, resources: 0 },
          counterAttack: "Le syndicat agricole majoritaire organise une mobilisation pour défendre les pesticides et présenter les agriculteurs bio comme des exceptions non représentatives.",
          counterEffects: { public: 0, political: -2, resources: 0 }
        },
        {
          label: "Tribune commune d'agriculteurs",
          description: "Une tribune signée par plusieurs dizaines d'agriculteurs opposés à la réautorisation montre que le monde agricole n'est pas monolithique et que Le lobby des pesticides ne parle pas en son nom.",
          scenario: "Des agriculteurs cosignent une tribune publique s'opposant à la réautorisation. Cette prise de parole déstabilise le discours du lobby et oblige les médias à nuancer leur traitement.",
          effects: { public: 0, political: 1, resources: 0 },
          counterAttack: "Le syndicat agricole majoritaire contre-attaque en présentant ces agriculteurs comme des militants déguisés en paysans.",
          counterEffects: { public: 0, political: -2, resources: 0 }
        },
        {
          label: "Rencontres terrain avec les agriculteurs",
          description: "Organiser des rencontres directes sur le terrain permet de construire des relations de confiance avec des agriculteurs qui ne sont pas convaincus par les pesticides. Ce travail de fond prend du temps mais construit des alliances solides.",
          scenario: "ANTIDOTE organise des rencontres sur le terrain avec des agriculteurs en quête d'alternatives aux pesticides dangereux. Des liens se créent qui pourraient devenir de futurs relais.",
          effects: { public: 2, political: 0, resources: 0 },
          counterAttack: "Le syndicat agricole majoritaire mobilise ses réseaux locaux pour dissuader les agriculteurs de participer aux rencontres d'ANTIDOTE.",
          counterEffects: { public: 0, political: -1, resources: 0 }
        }
      ]
    },
    {
      id: 9,
      tourLabel: "Vote solennel",
      tourDescription: "Les députés se prononcent sur l'ensemble du texte.",
      tourDate: { day: 5, month: 6, year: 2026 },
      title: "Bataille juridique",
      locked: true,
      lockedUntil: 5,
      lockedMessage: "Cette action n'est pas encore disponible",
      description: "À mi-parcours du processus législatif, la voie juridique s'ouvre. Les recours, plaintes et stratégies judiciaires permettent de peser sur le débat par un autre canal - parfois le seul restant quand les autres leviers sont bloqués.",
      actions: [
        {
          label: "Déposer un recours juridique",
          description: "Contester juridiquement la réautorisation de certains pesticides devant les tribunaux administratifs peut bloquer ou retarder le processus. C'est coûteux mais potentiellement très efficace.",
          scenario: "ANTIDOTE dépose un recours juridique pour contester la réautorisation de pesticides dont les risques sanitaires sont documentés. Le débat s'installe aussi sur le terrain judiciaire.",
          effects: { public: 0, political: 3, resources: -2 },
          counterAttack: "Les industriels mobilisent leurs propres équipes juridiques pour contester le recours et faire traîner la procédure.",
          counterEffects: { public: 0, political: -1, resources: 0 }
        },
        {
          label: "Déposer une plainte environnementale",
          description: "Une plainte pour atteinte à l'environnement ou mise en danger d'autrui met en lumière la responsabilité des acteurs de l'industrie et peut contraindre des enquêtes officielles.",
          scenario: "ANTIDOTE dépose une plainte environnementale dénonçant les impacts sanitaires des pesticides concernés. L'affaire est prise en charge par la justice et fait l'objet d'une couverture médiatique.",
          effects: { public: 1, political: 1, resources: -1 },
          counterAttack: "L'industrie minimise la portée de la plainte et tente d'intimider l'association avec des menaces de contre-poursuites.",
          counterEffects: { public: 0, political: -1, resources: 0 }
        },
        {
          label: "Mobiliser un collectif d'avocats",
          description: "Rassembler un collectif d'avocats spécialisés en droit de l'environnement permet de construire une stratégie judiciaire robuste sans dépenser immédiatement des ressources importantes.",
          scenario: "ANTIDOTE réunit un collectif d'avocats spécialisés en droit de l'environnement pour préparer une stratégie judiciaire complète. Ce dispositif renforce la crédibilité de l'association dans le débat.",
          effects: { public: 0, political: 2, resources: 0 },
          counterAttack: "L'industrie fait pression sur les cabinets d'avocats pour décourager certains d'entre eux de travailler avec ANTIDOTE.",
          counterEffects: { public: 0, political: -1, resources: 0 }
        }
      ]
    },
    {
      id: 10,
      tourLabel: "Après-vote",
      tourDescription: "Le résultat déclenche des réactions politiques et peut ouvrir une nouvelle phase de bataille.",
      tourDate: { day: 8, month: 6, year: 2026 },
      title: "Action européenne",
      description: "L'Union européenne réglemente les pesticides et peut mettre la pression sur les États membres. Interpeller les institutions européennes permet d'ouvrir un second front dans la bataille politique et d'obtenir des soutiens au-delà des frontières.",
      actions: [
        {
          label: "Saisir la Commission européenne",
          description: "Alerter la Commission européenne sur la réautorisation de pesticides interdits dans d'autres pays européens crée un précédent diplomatique et oblige le gouvernement français à justifier sa position.",
          scenario: "ANTIDOTE saisit la Commission européenne en lui soumettant un dossier documenté sur la réautorisation projetée. La démarche crée une pression diplomatique nouvelle sur le gouvernement.",
          effects: { public: 0, political: 2, resources: 0 },
          counterAttack: "Le lobby des pesticides exerce des pressions auprès de ses relais au Parlement européen pour minimiser la portée de la saisine.",
          counterEffects: { public: 0, political: -1, resources: 0 }
        },
        {
          label: "Coalition d'ONG européennes",
          description: "Construire une coalition d'ONG de plusieurs pays européens amplifie la visibilité de la campagne et montre que l'enjeu dépasse les frontières françaises. Solidarité et force collective.",
          scenario: "Une coalition d'ONG européennes rejoint ANTIDOTE pour dénoncer la réautorisation de pesticides dangereux. L'affaire prend une dimension continentale et les médias européens s'en emparent.",
          effects: { public: 2, political: 1, resources: 0 },
          counterAttack: "L'industrie mobilise ses lobbies européens pour contrer la coalition et tenter d'isoler ANTIDOTE au niveau des instances bruxelloises.",
          counterEffects: { public: -1, political: -1, resources: 0 }
        },
        {
          label: "Interpeller des eurodéputés",
          description: "Contacter directement des eurodéputés, notamment ceux des commissions environnement et santé, pour les inviter à interpeller le gouvernement français est un levier d'influence institutionnel.",
          scenario: "Des eurodéputés interpellent le gouvernement français sur la réautorisation de pesticides dangereux. La question remonte jusqu'aux instances européennes et met le gouvernement en position délicate.",
          effects: { public: 0, political: 2, resources: 0 },
          counterAttack: "Le lobby des industriels exerce des pressions sur ses relais au Parlement européen pour contrecarrer les interpellations des eurodéputés alliés.",
          counterEffects: { public: 0, political: -1, resources: 0 }
        }
      ]
    }
  ]
};
