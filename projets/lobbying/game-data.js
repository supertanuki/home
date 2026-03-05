const GAME_DATA = {
  initialScores: {
    public: 3,
    political: 2,
    resources: 3
  },

  endConditions: {
    publicZero: {
      title: "Fin de Partie en Cours de Route – Soutien du Public à 0",
      subtitle: "Échec de la Campagne : Manque de Soutien Public",
      description: "Votre campagne s'arrête ici. Le soutien du public n'a pas été suffisant pour maintenir l'élan nécessaire, et sans une base citoyenne solide, les décideurs ne voient pas de pression suffisante pour avancer avec la loi. En dépit de vos efforts, les industriels ont réussi à convaincre l'opinion que l'interdiction des petites bouteilles plastiques n'est pas prioritaire.",
      conclusion: "Ce résultat montre à quel point le soutien du public est essentiel pour les campagnes environnementales. Rejouez et essayez de faire de nouveaux choix pour maximiser le soutien populaire et contrer les campagnes de désinformation des industriels.",
      cta: "Découvrez les efforts de Zéro Waste France et comment vous pouvez aider à mobiliser le public pour des campagnes contre la pollution plastique."
    },
    politicalZero: {
      title: "Fin de Partie en Cours de Route – Influence Politique à 0",
      subtitle: "Échec de la Campagne : Perte d'Influence Politique",
      description: "La campagne se termine ici, car votre influence politique a été réduite à néant. Malgré vos efforts pour sensibiliser les députés, les pressions industrielles ont pris le dessus, et les décideurs ont cessé de considérer la proposition de loi. Sans soutien politique, il est impossible de faire avancer l'interdiction des petites bouteilles plastiques.",
      conclusion: "Cet échec souligne l'importance du lobbying et des relations avec les décideurs dans les campagnes environnementales. Tentez de rejouer pour explorer des choix stratégiques et ainsi renforcer votre influence auprès des députés.",
      cta: "Découvrez comment vous pouvez vous impliquer dans les actions de plaidoyer en faveur de l'environnement et soutenir Zéro Waste France dans sa mission."
    },
    resourcesZero: {
      title: "Fin de Partie en Cours de Route – Ressources à 0",
      subtitle: "Échec de la Campagne : Manque de Ressources",
      description: "La campagne est interrompue ici, car les ressources de Zéro Waste France sont épuisées. Sans fonds suffisants, il devient impossible de mener des actions significatives pour soutenir la proposition de loi. La lutte contre les petites bouteilles plastiques nécessite des moyens pour contrer les campagnes industrielles, et les ressources manquantes ont freiné votre progression.",
      conclusion: "Cet échec rappelle les contraintes financières auxquelles font face les associations environnementales. Rejouez pour tester une stratégie différente qui permettra de maintenir vos ressources et de prolonger l'impact de vos actions.",
      cta: "Même si la campagne s'arrête ici, votre engagement reste essentiel. Explorez des moyens de contribuer au financement des initiatives écologiques et soutenez Zéro Waste France dans ses efforts contre le plastique."
    }
  },

  finalResults: [
    {
      id: "failure",
      title: "Echec de la campagne",
      condition: "Un ou plusieurs indicateurs ont atteint zéro à la fin.",
      description: "Malheureusement, votre campagne pour interdire les petites bouteilles en plastique n'a pas abouti. Bien que vous ayez mobilisé des efforts considérables, les pressions industrielles et le manque de ressources ont empêché l'adoption de la loi. Les industriels ont conservé leur position dominante, et le projet de loi a été écarté.",
      conclusion: "Cet échec montre la difficulté d'obtenir un changement structurel face à des lobbies puissants et bien financés. Chaque décision et contre-offensive a un impact direct, et cet échec souligne les défis quotidiens auxquels se heurtent les défenseurs de l'environnement.",
      cta: "Même si la campagne n'a pas atteint son but, des actions restent possibles ! Explorez les ressources ci-dessous pour découvrir comment vous pouvez vous impliquer dans la lutte contre le plastique et soutenir les initiatives de Zéro Waste France."
    },
    {
      id: "symbolic",
      title: "Victoire Symbolique",
      condition: "Tous les indicateurs entre 1 et 2.",
      description: "Félicitations, vous avez atteint la fin de la campagne ! Bien que la loi ait été partiellement adoptée, elle est limitée aux petites bouteilles en plastique de moins de 25 cl. Les industriels ont réussi à maintenir la majorité des bouteilles plastiques sur le marché, mais votre mobilisation a créé une prise de conscience. C'est une victoire symbolique qui marque un premier pas vers un changement.",
      conclusion: "Vous avez réussi à naviguer dans les pressions industrielles et les défis politiques, obtenant une avancée pour la cause environnementale. Cette victoire symbolique reflète le parcours semé d'embûches des défenseurs de l'environnement. La prochaine étape consistera à renforcer cette législation pour un impact plus global.",
      cta: "Explorez nos ressources pour en savoir plus sur les actions possibles contre la pollution plastique et comment participer à la sensibilisation."
    },
    {
      id: "national",
      title: "Petite Victoire Nationale",
      condition: "Tous les indicateurs entre 2 et 3.",
      description: "Bravo ! Grâce à vos choix stratégiques et votre détermination, vous avez obtenu une petite victoire. La loi a été adoptée et interdit les petites bouteilles en plastique dans certains lieux publics comme les écoles et les bâtiments administratifs. Bien que la mesure ne soit pas généralisée, elle marque une avancée importante pour la cause écologique et sensibilise de nombreux citoyens.",
      conclusion: "Votre campagne a eu un impact positif et a réussi à passer des mesures concrètes pour limiter la pollution plastique, mais des efforts supplémentaires seront nécessaires pour élargir cette interdiction à d'autres contextes.",
      cta: "Découvrez comment vous pouvez continuer à soutenir la cause, contribuer aux campagnes de Zéro Waste France, et en savoir plus sur la législation environnementale."
    },
    {
      id: "partial",
      title: "Victoire Partielle mais Précaire",
      condition: "Tous les indicateurs à 3 ou plus.",
      description: "Félicitations, vous avez réussi à faire adopter une interdiction étendue des petites bouteilles en plastique ! Cependant, cette loi comporte plusieurs exceptions, et les industriels conservent une certaine influence pour limiter son application. Votre campagne a permis de mobiliser de nombreux acteurs et de changer les mentalités, mais le chemin est encore long pour assurer un impact durable.",
      conclusion: "Cette victoire partielle montre le potentiel des campagnes environnementales à créer de véritables changements, malgré les pressions économiques et politiques. Votre parcours illustre bien la persévérance nécessaire dans la lutte pour la planète.",
      cta: "Retrouvez des informations sur la loi et comment vous impliquer davantage dans les actions pour réduire l'usage du plastique et soutenir la transition écologique."
    }
  ],

  phases: [
    {
      id: 1,
      title: "Préparer la campagne",
      description: "Dans cette première phase, Zéro Waste France met en place sa stratégie pour lancer une campagne percutante contre les bouteilles en plastique. L'association doit choisir comment attirer l'attention du public et obtenir les ressources nécessaires pour se préparer à un combat acharné contre les lobbies industriels.",
      actions: [
        {
          label: "Publier une étude sur les effets environnementaux des petites bouteilles",
          description: "Cette étude apportera des données concrètes pour sensibiliser l'opinion publique et attirer l'attention des médias, mais elle nécessite une partie importante de vos ressources.",
          scenario: "L'étude sensibilise le public, attirant l'attention médiatique, mais elle consomme une partie importante du budget.",
          effects: { public: 2, political: 0, resources: -1 },
          counterAttack: "L'industrie finance une campagne de dénigrement de l'étude, réduisant son impact.",
          counterEffects: { public: 0, political: 0, resources: 0 }
        },
        {
          label: "Mobiliser des associations partenaires",
          description: "S'associer avec d'autres organisations pourrait augmenter votre visibilité et apporter du soutien logistique, mais les résultats dépendront de la fiabilité et de l'engagement de ces partenaires.",
          scenario: "La visibilité et le soutien logistique augmentent, mais l'impact politique reste faible.",
          effects: { public: 1, political: 0, resources: 1 },
          counterAttack: "Certaines associations, influencées par l'industrie, se retirent, limitant le gain de ressources.",
          counterEffects: { public: 0, political: 0, resources: 0 }
        },
        {
          label: "Lancer une pétition citoyenne",
          description: "Une pétition peut être un moyen efficace pour attirer le soutien populaire sans investir de grandes ressources, mais son impact dépendra de votre capacité à la rendre visible.",
          scenario: "La pétition attire quelques signatures et sensibilise le public, mais manque de portée.",
          effects: { public: 1, political: 0, resources: 0 },
          counterAttack: "Le lobby industriel publie un sondage montrant que les consommateurs préfèrent les petites bouteilles.",
          counterEffects: { public: 0, political: 0, resources: 0 }
        }
      ]
    },
    {
      id: 2,
      title: "La Bataille des Médias",
      description: "Alors que la campagne prend de l'ampleur, les lobbies industriels contre-attaquent avec une forte campagne de désinformation. Zéro Waste France doit choisir la meilleure façon de faire passer son message au grand public et de maintenir une image positive face aux critiques et aux fausses informations diffusées par l'industrie.",
      actions: [
        {
          label: "Organiser un événement de nettoyage",
          description: "Cet événement mobilisera des bénévoles et créera une image positive pour la campagne, mais sa portée médiatique dépendra de votre capacité à attirer journalistes et relais d'opinion.",
          scenario: "Impact positif auprès du public, mais l'événement reçoit peu de couverture médiatique.",
          effects: { public: 1, political: 0, resources: 0 },
          counterAttack: "L'industrie publie une campagne affirmant que les bouteilles sont recyclables, réduisant l'impact de l'événement.",
          counterEffects: { public: 0, political: 0, resources: 0 }
        },
        {
          label: "Partenariat avec des influenceurs environnementaux",
          description: "Les influenceurs peuvent toucher un large public en peu de temps et amplifier le message de la campagne, mais leur crédibilité et leur engagement pour la cause sont déterminants.",
          scenario: "Gain de visibilité, mais l'influence politique reste limitée.",
          effects: { public: 2, political: 0, resources: 0 },
          counterAttack: "L'industrie soutient des influenceurs pro-recyclage pour contrer le message.",
          counterEffects: { public: 0, political: 0, resources: 0 }
        },
        {
          label: "Publier un article d'opinion dans un grand journal",
          description: "Un article dans un grand journal national permettra de toucher à la fois le grand public et les décideurs politiques, et d'asseoir la légitimité de Zéro Waste France sur ce sujet.",
          scenario: "Attire l'attention de quelques députés, mais l'industrie publie un article contradictoire.",
          effects: { public: 1, political: 1, resources: 0 },
          counterAttack: "Des experts financés par l'industrie critiquent l'article, réduisant son impact.",
          counterEffects: { public: 0, political: 0, resources: 0 }
        }
      ]
    },
    {
      id: 3,
      title: "Influencer les Décideurs",
      description: "Zéro Waste France intensifie ses efforts pour convaincre les députés de soutenir une proposition de loi visant à interdire les petites bouteilles en plastique. Cette phase implique des actions de lobbying auprès des législateurs pour contrer l'influence des industriels et renforcer la portée de la campagne au niveau politique.",
      actions: [
        {
          label: "Faire appel à un député écologiste",
          description: "Solliciter le soutien d'un député écologiste permettrait d'introduire directement la cause au sein de l'hémicycle, mais ce parlementaire pourrait se retrouver sous forte pression des lobbies industriels.",
          scenario: "Augmente l'influence politique, mais sous la pression des lobbies, le député se retire.",
          effects: { public: 0, political: 1, resources: 0 },
          counterAttack: "L'industrie lance une campagne accusant les députés écologistes de nuire à l'économie.",
          counterEffects: { public: 0, political: -1, resources: 0 }
        },
        {
          label: "Publier un dossier scientifique indépendant",
          description: "Un dossier scientifique rigoureux et indépendant apportera des arguments solides pour convaincre les décideurs, mais sa production est coûteuse et l'industrie tentera de le décrédibiliser.",
          scenario: "Fournit des arguments supplémentaires, mais le coût réduit les ressources.",
          effects: { public: 0, political: 1, resources: -1 },
          counterAttack: "L'industrie finance une étude contradictoire pour décrédibiliser le dossier.",
          counterEffects: { public: 0, political: -1, resources: 0 }
        },
        {
          label: "Organiser une rencontre avec des députés",
          description: "Une rencontre directe avec des députés permettra de présenter vos arguments de façon personnalisée et de tisser des liens durables, bien que l'organisation d'un tel événement mobilise des ressources importantes.",
          scenario: "La rencontre sensibilise plusieurs députés, mais réduit les ressources.",
          effects: { public: 0, political: 2, resources: -1 },
          counterAttack: "Les industriels organisent un événement concurrent pour contrer l'impact.",
          counterEffects: { public: 0, political: -1, resources: 0 }
        }
      ]
    },
    {
      id: 4,
      title: "Mobilisation de la Jeunesse",
      description: "Pour renforcer l'impact de la campagne, Zéro Waste France se tourne vers la jeunesse, souvent plus réceptive aux questions environnementales. En choisissant les bonnes actions pour sensibiliser et mobiliser les jeunes, l'association espère gagner un soutien public massif et rallier des voix influentes pour la cause.",
      actions: [
        {
          label: "Organiser un concours vidéo avec des écoles",
          description: "Ce concours pourrait générer des contenus viraux pour sensibiliser le public, mais il nécessitera des ressources pour son organisation.",
          scenario: "Les vidéos des élèves deviennent virales, mais les coûts sont élevés.",
          effects: { public: 2, political: 0, resources: -1 },
          counterAttack: "L'industrie lance une campagne éducative concurrente dans les écoles.",
          counterEffects: { public: -1, political: 0, resources: 0 }
        },
        {
          label: "Recruter des ambassadeurs jeunesse dans les lycées et universités",
          description: "Les ambassadeurs mènent des actions locales pour renforcer le soutien public sans mobiliser de grands moyens.",
          scenario: "Sensibilisation et collecte de fonds modérées.",
          effects: { public: 1, political: 0, resources: 1 },
          counterAttack: "L'industrie lance une campagne en faveur de la « liberté de choix » des jeunes.",
          counterEffects: { public: -1, political: 0, resources: 0 }
        },
        {
          label: "Organiser une marche symbolique avec les jeunes activistes",
          description: "Cette marche peut attirer l'attention médiatique et politique, mais elle est vulnérable aux contre-manifestations.",
          scenario: "La marche attire des médias et sensibilise les députés.",
          effects: { public: 1, political: 1, resources: 0 },
          counterAttack: "Les lobbies organisent une contre-manifestation.",
          counterEffects: { public: -1, political: -1, resources: 0 }
        }
      ]
    },
    {
      id: 5,
      title: "Collaboration avec des Entreprises Écoresponsables",
      description: "Des entreprises cherchant à promouvoir leur image « verte » voient une opportunité de partenariat avec Zéro Waste France. Cette phase consiste à établir des alliances avec des entreprises écoresponsables pour soutenir la campagne. Zéro Waste France doit cependant veiller à ne pas nuire à sa crédibilité en s'associant avec des intérêts commerciaux.",
      actions: [
        {
          label: "Collaborer avec une entreprise de boissons vendant des alternatives en verre",
          description: "Ce partenariat augmentera vos ressources et votre visibilité, mais risque de susciter des accusations de favoritisme.",
          scenario: "Génère des fonds, mais Zéro Waste est accusé de favoritisme.",
          effects: { public: 1, political: 0, resources: 2 },
          counterAttack: "L'industrie critique le partenariat, qualifiant l'alternative de « luxe ».",
          counterEffects: { public: -1, political: 0, resources: 0 }
        },
        {
          label: "Promouvoir des fontaines d'eau publiques en partenariat avec des municipalités",
          description: "Ce projet peut inciter les citoyens à abandonner le plastique, mais nécessite des ressources pour sa mise en œuvre.",
          scenario: "Les fontaines sensibilisent le public et les élus locaux.",
          effects: { public: 1, political: 1, resources: 0 },
          counterAttack: "Les industriels lancent une campagne critiquant l'hygiène des fontaines.",
          counterEffects: { public: -1, political: -1, resources: 0 }
        },
        {
          label: "S'associer avec une marque d'accessoires réutilisables (gourdes, etc.)",
          description: "Ce partenariat augmente les ressources et promeut une alternative aux bouteilles plastiques, mais peut diviser l'opinion publique.",
          scenario: "Les ventes d'accessoires augmentent les fonds et sensibilisent le public.",
          effects: { public: 1, political: 0, resources: 1 },
          counterAttack: "Les lobbies critiquent le coût élevé des alternatives réutilisables.",
          counterEffects: { public: -1, political: 0, resources: 0 }
        }
      ]
    },
    {
      id: 6,
      title: "Influence à l'International",
      description: "Face aux défis nationaux, Zéro Waste France envisage de s'allier avec des ONG et réseaux européens pour accroître son impact et faire pression sur les législateurs français par des canaux internationaux. Cette phase vise à développer une influence transnationale, attirant une attention européenne pour soutenir l'interdiction des petites bouteilles plastiques.",
      actions: [
        {
          label: "Rejoindre un réseau européen d'associations environnementales",
          description: "Ce réseau renforce votre influence auprès des institutions européennes, mais il peut provoquer des critiques de la part des industriels.",
          scenario: "Le réseau renforce l'influence auprès des institutions européennes.",
          effects: { public: 1, political: 1, resources: 0 },
          counterAttack: "Les industriels accusent Zéro Waste de s'ingérer dans les affaires nationales.",
          counterEffects: { public: -1, political: -1, resources: 0 }
        },
        {
          label: "Participer à une conférence internationale contre la pollution plastique",
          description: "Une conférence offre une audience internationale et des contacts, mais représente un coût significatif.",
          scenario: "Permet d'influencer des décideurs, mais les fonds diminuent.",
          effects: { public: 0, political: 2, resources: -1 },
          counterAttack: "L'industrie finance des panels pro-plastique lors de la conférence.",
          counterEffects: { public: 0, political: -1, resources: 0 }
        },
        {
          label: "Inviter des experts étrangers pour des conférences en France",
          description: "Ces conférences attirent l'attention médiatique et renforcent la légitimité de votre campagne.",
          scenario: "Les experts renforcent la légitimité de Zéro Waste France.",
          effects: { public: 1, political: 1, resources: 0 },
          counterAttack: "L'industrie décrédibilise l'expertise étrangère.",
          counterEffects: { public: -1, political: -1, resources: 0 }
        }
      ]
    },
    {
      id: 7,
      title: "Contre-Offensive Législative",
      description: "Alors que la campagne progresse, l'industrie redouble d'efforts pour influencer les législateurs et bloquer toute tentative de réglementation. Zéro Waste France doit intensifier son lobbying direct auprès des députés et développer des stratégies pour maintenir le soutien politique en faveur de l'interdiction.",
      actions: [
        {
          label: "Faire du porte-à-porte auprès des députés sensibles à l'environnement",
          description: "Approcher directement les députés renforce votre influence, mais cela reste vulnérable aux critiques industrielles.",
          scenario: "Renforce le soutien de certains députés malgré la pression des lobbies.",
          effects: { public: 0, political: 2, resources: 0 },
          counterAttack: "Les industriels critiquent les députés écologistes comme nuisibles à l'économie.",
          counterEffects: { public: 0, political: -1, resources: 0 }
        },
        {
          label: "Organiser une campagne de lettres citoyennes adressées aux députés",
          description: "Une campagne de lettres montre le soutien populaire, mais elle est vulnérable aux réponses automatisées.",
          scenario: "Renforce l'engagement citoyen et l'influence politique.",
          effects: { public: 2, political: 1, resources: 0 },
          counterAttack: "Les industriels lancent une réponse automatisée en opposition.",
          counterEffects: { public: -1, political: -1, resources: 0 }
        },
        {
          label: "Proposer des amendements législatifs en partenariat avec des députés écologistes",
          description: "Ces amendements visent à limiter l'impact des industriels, mais nécessitent des ressources pour les études préalables.",
          scenario: "Renforce la campagne législative mais réduit les ressources.",
          effects: { public: 0, political: 2, resources: -1 },
          counterAttack: "L'industrie fait pression pour retirer les amendements.",
          counterEffects: { public: 0, political: -1, resources: 0 }
        }
      ]
    },
    {
      id: 8,
      title: "Offensive Finale en Justice",
      description: "Face à une probable impasse législative, Zéro Waste France décide de porter l'affaire devant les tribunaux, espérant obtenir une décision de justice favorable à l'interdiction du plastique. Bien que cette option soit coûteuse et risquée, elle représente une ultime tentative pour contrer l'influence des lobbies industriels et instaurer un changement durable.",
      actions: [
        {
          label: "Lancer un recours juridique pour violation des droits environnementaux",
          description: "Cette action symbolique est coûteuse mais pourrait générer du soutien public.",
          scenario: "Mobilise les partisans, mais la procédure est coûteuse.",
          effects: { public: 2, political: 0, resources: -2 },
          counterAttack: "L'industrie engage une équipe juridique puissante pour contester.",
          counterEffects: { public: -1, political: 0, resources: 0 }
        },
        {
          label: "Mobiliser des juristes pro bono pour construire un dossier solide",
          description: "Obtenir des conseils juridiques gratuits pourrait renforcer votre dossier sans affecter le budget.",
          scenario: "Construit un dossier solide, mais avec un impact modéré.",
          effects: { public: 0, political: 1, resources: 1 },
          counterAttack: "L'industrie cherche à décrédibiliser votre recours en insinuant qu'il manque de fondement.",
          counterEffects: { public: 0, political: -1, resources: 0 }
        },
        {
          label: "Déposer une plainte au niveau européen pour forcer une réglementation stricte",
          description: "Cette plainte vise à faire pression sur la France via les institutions européennes.",
          scenario: "Attire l'attention des législateurs européens, mais coûte cher.",
          effects: { public: 0, political: 2, resources: -1 },
          counterAttack: "Les industriels exercent une pression pour ralentir le processus.",
          counterEffects: { public: 0, political: -1, resources: 0 }
        }
      ]
    }
  ]
};
