// Les services du site. Chaque service génère sa landing page
// /services/<slug> et alimente la home, le menu, le footer et le sitemap.
//
// `aliases` liste les anciens slugs d'un service (fusions successives) :
// ils servent à la fois aux redirections (astro.config.mjs et nginx) et au
// rattachement des projets et des articles déjà taggés avec l'ancien slug.

export interface Item {
	title: string;
	text: string;
}

export interface Offer {
	name: string;
	duration: string;
	price: string;
	launchPrice?: string;
	priceDetail?: string;
	includes: string[];
	note?: string;
}

export interface ComparisonRow {
	label: string;
	agency: string;
	me: string;
}

export interface Service {
	slug: string;
	aliases?: string[];
	// Service de second plan : présenté en carte compacte sous la grille
	// principale, et en fin de liste dans le menu et le footer.
	secondary?: boolean;
	// Service mis en avant : bloc dédié sur la home (`pme-highlight.astro`)
	// et carte pleine largeur en tête de la page /services.
	featured?: boolean;
	menuLabel: string;
	cardText: string;
	icon: string;
	seoTitle: string;
	metaDescription: string;
	headline: string;
	subheadline: string;
	audience: string;
	pains: Item[];
	deliverables: Item[];
	process: Item[];
	// Paragraphes libres insérés après les livrables (ex. « pourquoi sur
	// site », « sortir des licences propriétaires »).
	prose?: Item[];
	// Une offre de démarrage unique, ou plusieurs offres à prix fixe
	// présentées en grille (`offer-grid.astro`).
	offer?: Offer;
	offers?: Offer[];
	availability?: string[];
	comparison?: { rows: ComparisonRow[]; method: string };
	showMaintenance?: boolean;
	why: string[];
	faq: { q: string; a: string }[];
	calEvent: string;
	ctaTitle: string;
}

// Chemins d'icônes Heroicons (outline, 24px).
const icons = {
	sparkles:
		"M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z",
	bolt: "m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z",
	shield:
		"M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z",
	users:
		"M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z",
	server:
		"M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 0 1 .9 2.7m0 0a3 3 0 0 1-3 3m0 3h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Zm-3 6h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Z",
};

const discoveryCall: Item = {
	title: "Appel découverte (30 min, gratuit)",
	text: "Vous m'expliquez votre besoin, je vous dis franchement si je peux vous aider et à quel ordre de prix.",
};

export const services: Service[] = [
	{
		slug: "pme-alsace",
		featured: true,
		menuLabel: "Pour les TPE et PME d'Alsace",
		cardText:
			"Je viens dans vos locaux une demi-journée, je repère ce qui vous fait perdre du temps, et je l'automatise. Prix fixes, annoncés d'avance.",
		icon: icons.bolt,
		seoTitle:
			"Automatisation et formation IA pour les TPE et PME d'Alsace | Codelsior",
		metaDescription:
			"Diagnostic IA sur site à 450 € HT, formation d'une journée à 900 € HT, chantier d'automatisation de 1 500 à 3 000 € HT. Je me déplace à Mulhouse, dans le Haut-Rhin et partout en Alsace pour automatiser ce qui vous fait perdre du temps.",
		headline:
			"Je viens chez vous, je repère ce qui vous fait perdre du temps, et je l'automatise.",
		subheadline:
			"Vos équipes passent des heures sur des tâches que personne n'aime faire : ressaisir des devis, relancer des factures impayées, trier des mails, recopier les mêmes informations d'un logiciel à l'autre. Je me déplace à Mulhouse, dans le Haut-Rhin et partout en Alsace, une demi-journée, et je vous dis exactement quoi automatiser en premier — avec un prix fixe, annoncé d'avance.",
		audience: "Dirigeants de TPE et de PME d'Alsace, de 3 à 50 salariés",
		pains: [
			{
				title: "Tout le monde est débordé",
				text: "Vos équipes travaillent beaucoup, mais une partie de leur journée part dans des tâches qui n'apportent rien à personne.",
			},
			{
				title: "L'IA, tout le monde en parle",
				text: "On vous répète que ça fait gagner du temps, sans jamais vous montrer ce que ça donnerait chez vous, concrètement.",
			},
			{
				title: "Les devis informatiques font peur",
				text: "Vous avez déjà reçu une proposition à 20 000 € pour un projet que personne ne vous a vraiment expliqué.",
			},
			{
				title: "Les logiciels coûtent de plus en plus cher",
				text: "Chaque année les abonnements augmentent, et vous payez des fonctions que personne n'utilise.",
			},
		],
		deliverables: [
			{
				title: "Les devis et les commandes",
				text: "Un mail ou un PDF arrive, les informations se retrouvent dans votre outil de gestion, sans que personne ne les recopie.",
			},
			{
				title: "Les relances de factures impayées",
				text: "Les retards sont repérés, les relances préparées et envoyées au bon moment. Vous validez, c'est tout.",
			},
			{
				title: "Le tri des mails et des demandes",
				text: "Les demandes clients sont classées et une réponse est préparée. Votre équipe relit au lieu de rédiger.",
			},
			{
				title: "Les ressaisies entre logiciels",
				text: "Devis, comptabilité, boutique en ligne, tableur : les informations circulent seules, sans export ni copier-coller.",
			},
		],
		process: [
			{
				title: "Un appel de 30 minutes, gratuit",
				text: "Vous me racontez votre quotidien. Si je ne peux rien vous apporter, je vous le dis tout de suite.",
			},
			{
				title: "Une demi-journée dans vos locaux",
				text: "Je regarde travailler vos équipes, je note ce qui se répète et je compte les heures que ça coûte.",
			},
			{
				title: "Une liste de priorités chiffrée",
				text: "Trois à cinq pistes classées par temps gagné, avec un prix fixe pour chacune. Vous décidez ensuite, ou pas.",
			},
			{
				title: "On automatise, en 2 à 4 jours",
				text: "Un processus à la fois, livré et réellement utilisé par vos équipes, avec un mois de suivi.",
			},
		],
		prose: [
			{
				title: "Pourquoi je viens sur site",
				text: "Une visio ne montre pas votre réalité. Dans vos locaux, je vois les vrais gestes : le classeur à côté de l'écran, le tableur que l'on garde « parce que le logiciel ne sait pas le faire », les trois outils ouverts en même temps, la personne qui recopie à la main ce qu'une autre a déjà saisi. En une demi-journée sur place, je repère des choses que personne ne m'aurait décrites au téléphone — tout simplement parce qu'elles sont devenues normales. Et vos équipes me parlent plus librement devant leur écran que dans une réunion.",
			},
			{
				title: "Payer moins de licences, avec de l'open source",
				text: "Beaucoup de TPE et de PME paient chaque mois des abonnements pour des logiciels qu'elles utilisent à 20 %. Quand c'est pertinent, je vous montre l'équivalent open source : gestion, boutique en ligne, partage de fichiers, messagerie d'équipe. Les logiciels sont sans licence, il reste à les héberger et à les maintenir — je chiffre le coût réel pour que vous compariez honnêtement, plutôt que de remplacer un abonnement par un autre. Vos données restent en France ou en Europe.",
			},
		],
		offers: [
			{
				name: "Diagnostic IA sur site",
				duration: "½ journée",
				price: "450 €",
				includes: [
					"Une demi-journée dans vos locaux, en Alsace",
					"Observation de vos tâches répétitives, avec vos équipes",
					"Liste de 3 à 5 priorités chiffrées en heures gagnées",
					"Un prix fixe annoncé pour chaque automatisation proposée",
				],
				note: "Montant déduit si vous me confiez le premier chantier d'automatisation.",
			},
			{
				name: "Formation IA sur site",
				duration: "1 journée",
				price: "900 €",
				includes: [
					"Une journée sur site, pour 4 à 8 personnes",
					"Des cas concrets tirés de votre métier, pas des exemples génériques",
					"Les bons usages, et ce qu'il ne faut jamais confier à une IA",
					"Un mémo écrit remis à chaque participant",
				],
			},
			{
				name: "Chantier d'automatisation",
				duration: "2 à 4 jours",
				price: "1 500 à 3 000 €",
				priceDetail: "selon la complexité du processus",
				includes: [
					"Un processus ciblé : saisie, relances, ressaisies entre logiciels",
					"Livré en 2 à 4 jours",
					"Vos équipes formées à l'utiliser",
					"Un mois de suivi inclus",
				],
			},
		],
		why: [
			"15 ans d'expérience en développement logiciel, dont un ERP déployé en usine chez PSA.",
			"Le code livré vous appartient : vous n'êtes prisonnier d'aucun prestataire.",
			"Hébergement en France ou en Europe, et vos données ne partent pas ailleurs.",
			"Un interlocuteur unique, installé en Alsace, qui se déplace chez vous.",
		],
		faq: [
			{
				q: "Je ne suis pas du tout technique, c'est un problème ?",
				a: "Non, c'est même le cas le plus fréquent. Je parle de votre métier et de votre temps, pas de technique. Vous n'avez rien à préparer avant ma visite.",
			},
			{
				q: "Vous vous déplacez où ?",
				a: "À Mulhouse et dans tout le Haut-Rhin sans frais de déplacement, et partout en Alsace (Colmar, Strasbourg) ainsi qu'à Bâle et Fribourg-en-Brisgau.",
			},
			{
				q: "Combien de temps avant de voir un gain ?",
				a: "Le diagnostic vous donne des priorités chiffrées le jour même. Le premier chantier d'automatisation est livré en 2 à 4 jours.",
			},
			{
				q: "Est-ce que l'IA va remplacer mes salariés ?",
				a: "Ce n'est pas l'objectif, et ce n'est pas ce que je vends. J'enlève les tâches ingrates — la saisie, la recopie, les relances — pour que vos équipes passent leur temps sur le client et le métier.",
			},
			{
				q: "Nos données sont-elles en sécurité ?",
				a: "Rien ne part sans votre accord. Pour les informations sensibles, j'utilise des modèles européens ou open source hébergés en Europe, et je prévois une validation humaine là où une erreur coûte cher.",
			},
			{
				q: "Et si on a besoin d'un vrai logiciel, pas juste d'automatisation ?",
				a: "C'est possible aussi : back-office, portail client, remplacement d'un vieux tableur. C'est l'objet de mon service « logiciel sur mesure et automatisation IA ».",
			},
		],
		calEvent: "diagnostic-pme",
		ctaTitle: "Une demi-journée pour savoir quoi automatiser.",
	},
	{
		slug: "logiciel-sur-mesure-automatisation-ia",
		aliases: ["projet-sur-mesure-ia", "automatisation-ia"],
		menuLabel: "Logiciel sur mesure et automatisation IA",
		cardText:
			"Back-office, portail client, outil métier, ou les saisies répétitives de vos équipes : je construis ce qui vous manque et j'automatise le reste.",
		icon: icons.sparkles,
		seoTitle: "Logiciel sur mesure et automatisation IA pour PME | Codelsior",
		metaDescription:
			"Back-office, portail client, outil métier, automatisation des tâches répétitives : je développe avec l'IA les outils qui vous manquent, jusqu'à 10× moins cher qu'une agence. Freelance en Alsace, partout en France.",
		headline:
			"Le projet que vous repoussez, les tâches que vous ne ferez plus.",
		subheadline:
			"Back-office, portail client, outil de devis, saisie de factures, relances, ressaisies entre logiciels… Grâce au développement assisté par l'IA, je livre des outils sur mesure et des automatisations en quelques semaines, jusqu'à 10× moins cher qu'une agence.",
		audience:
			"Dirigeants de PME, responsables métier, DAF et responsables des opérations",
		pains: [
			{
				title: "Un devis d'agence à 50 000 €",
				text: "Le projet est utile, tout le monde le sait. Mais le budget l'a enterré avant même qu'il démarre.",
			},
			{
				title: "Le fichier Excel qui fait tourner l'entreprise",
				text: "Une seule personne le comprend, tout le monde le redoute, et il casse toujours au pire moment.",
			},
			{
				title: "Des heures perdues en saisie",
				text: "Vos équipes recopient des factures, des bons de commande et des emails au lieu de faire leur vrai métier.",
			},
			{
				title: "Des outils qui ne se parlent pas",
				text: "Exports, ressaisies, erreurs de copier-coller : chaque logiciel est une île.",
			},
		],
		deliverables: [
			{
				title: "Outils métier et back-offices",
				text: "Stocks, planning, suivi de production, CRM maison, MVP de SaaS : un outil taillé pour vos process, pas l'inverse.",
			},
			{
				title: "Portails clients et extranets",
				text: "Commandes, documents, suivi de dossier : vos clients se servent seuls, 24 h/24.",
			},
			{
				title: "Remplacement d'Excel, d'Access ou d'un vieux logiciel",
				text: "Je reprends l'existant, migre les données et livre un outil web moderne et maintenable.",
			},
			{
				title: "Traitement automatique des documents",
				text: "Factures, bons de commande, contrats : extraction automatique et intégration dans vos outils.",
			},
			{
				title: "Synchronisation entre vos outils",
				text: "CRM, ERP, e-commerce, comptabilité, messagerie : les données circulent seules, sans ressaisie.",
			},
			{
				title: "Assistants internes et IA souveraine",
				text: "Un assistant qui répond à partir de vos procédures et de vos données, avec des modèles européens ou open source si elles sont sensibles.",
			},
		],
		process: [
			discoveryCall,
			{
				title: "Cadrage + prototype en 5 jours",
				text: "Vous voyez et cliquez sur votre futur outil avant d'engager le budget de développement. Pour une TPE ou une PME, l'entrée peut aussi être un diagnostic d'une demi-journée sur site.",
			},
			{
				title: "Développement et automatisations par itérations",
				text: "Une livraison chaque semaine, testée par vous, en commençant par ce qui rapporte le plus. L'IA accélère, je garde la main sur l'architecture et la qualité.",
			},
			{
				title: "Mise en production et suivi",
				text: "Hébergement en France ou en Europe, mesure des heures gagnées, puis maintenance et évolutions si vous le souhaitez.",
			},
		],
		offer: {
			name: "Cadrage + prototype cliquable",
			duration: "5 jours",
			price: "3 500 €",
			launchPrice: "2 900 €",
			includes: [
				"Atelier de cadrage (½ journée) avec vos équipes",
				"Maquette cliquable des écrans clés",
				"Backlog priorisé et chiffrage du MVP",
				"Automatisations identifiées et chiffrées en heures gagnées",
				"Recommandations d'architecture et d'hébergement",
			],
			note: "Montant intégralement déduit si vous lancez le développement avec moi.",
		},
		comparison: {
			rows: [
				{
					label: "Budget",
					agency: "15 000 à 45 000 € HT",
					me: "À partir de 6 000 € HT",
				},
				{
					label: "Délai",
					agency: "8 à 16 semaines",
					me: "2 à 3 semaines",
				},
				{
					label: "Interlocuteur",
					agency: "Commercial, chef de projet, développeurs",
					me: "Le développeur senior qui code votre outil",
				},
			],
			method:
				"Comparaison pour un back-office ou un portail client en version MVP. Fourchettes agence : tarifs publics 2026 d'agences françaises en région. L'écart vient de deux leviers : pas de structure à financer, et l'IA qui prend en charge les parties répétitives du développement.",
		},
		showMaintenance: true,
		why: [
			"Je développe aujourd'hui Bonjour Fun avec l'IA : une plateforme SaaS qui fait tourner 10 marketplaces en production.",
			"15 ans d'expérience, dont un ERP logistique chez PSA : je sais ce qu'est un logiciel métier qui doit tenir dans la durée.",
			"Ancien pilote d'application chez PSA : je parle processus et métier, pas seulement technique.",
			"Vous êtes propriétaire du code, hébergé où vous voulez. Aucun verrouillage.",
		],
		faq: [
			{
				q: "Un outil développé avec l'IA, c'est fiable ?",
				a: "L'IA écrit vite, mais c'est moi qui conçois l'architecture, relis le code et teste. C'est la méthode que j'applique tous les jours sur Bonjour Fun, en production. Vous obtenez un code standard, documenté et maintenable par n'importe quel développeur.",
			},
			{
				q: "Comment pouvez-vous être autant moins cher qu'une agence ?",
				a: "Pas de structure à financer (commercial, chef de projet, locaux), et l'IA qui prend en charge les parties répétitives du développement. Vous payez l'expertise, pas les heures de saisie.",
			},
			{
				q: "Faut-il changer nos logiciels pour automatiser ?",
				a: "Non. Les automatisations se branchent sur vos outils existants (messagerie, ERP, CRM, e-commerce, tableurs) dès qu'ils le permettent. Je ne remplace un logiciel que si c'est lui le problème.",
			},
			{
				q: "Nos données vont-elles partir chez OpenAI ?",
				a: "Seulement si vous le choisissez. Pour les données sensibles, je propose des modèles européens ou open source hébergés en Europe.",
			},
			{
				q: "Et si l'IA se trompe ?",
				a: "Je prévois une validation humaine là où une erreur coûte cher. L'IA prépare, votre équipe valide.",
			},
			{
				q: "À qui appartient le code ?",
				a: "À vous, intégralement. Il est livré sur votre dépôt et peut être repris par une autre équipe.",
			},
			{
				q: "Et après la livraison ?",
				a: "Je peux héberger et maintenir l'outil via un forfait mensuel, ou former votre équipe pour qu'elle soit autonome.",
			},
		],
		calEvent: "projet-sur-mesure",
		ctaTitle: "Parlons du projet que vous repoussez.",
	},
	{
		slug: "souverainete-open-source",
		menuLabel: "Souveraineté et open source",
		cardText:
			"Hébergement en France ou en Europe, sortie des licences propriétaires, à commencer par votre e-commerce et votre ERP.",
		icon: icons.shield,
		seoTitle:
			"Souveraineté numérique et migration open source (e-commerce, ERP) | Codelsior",
		metaDescription:
			"Licences qui explosent, données hors d'Europe, dépendance à un éditeur : je vous aide à migrer vers l'open source et un hébergement en France ou en Europe, e-commerce et ERP en tête. Diagnostic dès 1 200 € HT.",
		headline: "Reprenez le contrôle de vos données et de vos licences.",
		subheadline:
			"Données hébergées hors d'Europe, abonnements qui augmentent chaque année, éditeur qui décide à votre place… Je vous accompagne vers l'open source et un hébergement en France ou en Europe, à commencer par votre e-commerce et votre ERP.",
		audience: "PME, ETI, collectivités et acteurs publics",
		pains: [
			{
				title: "Des licences qui explosent",
				text: "Hausses annuelles, facturation par utilisateur, options devenues payantes : la facture ne fait que grimper.",
			},
			{
				title: "Des données soumises au Cloud Act",
				text: "Hébergées chez des acteurs américains, vos données peuvent être réclamées par une autorité étrangère.",
			},
			{
				title: "Prisonnier de votre éditeur",
				text: "Export impossible, fonctionnalités imposées, fin de support annoncée : vous subissez sa feuille de route.",
			},
		],
		deliverables: [
			{
				title: "Diagnostic de dépendances",
				text: "Où sont vos données, combien coûtent vos licences, quels risques vous courez : tout est cartographié.",
			},
			{
				title: "E-commerce open source",
				text: "Migration vers Sylius, Magento Open Source ou PrestaShop : catalogue, clients, commandes et référencement repris.",
			},
			{
				title: "ERP et gestion",
				text: "Odoo ou Dolibarr à la place d'un ERP sous licence, connecté à votre e-commerce.",
			},
			{
				title: "Hébergement en France ou en Europe",
				text: "OVHcloud, Scaleway, Hetzner, Infomaniak… selon vos contraintes de coût et de conformité.",
			},
			{
				title: "Outils collaboratifs libres",
				text: "Nextcloud, OnlyOffice, Mattermost, n8n : des alternatives crédibles aux suites américaines.",
			},
			{
				title: "Un outil sur mesure à la place d'un SaaS",
				text: "Parfois, le plus économique est de remplacer un abonnement coûteux par un outil développé pour vous, avec l'IA.",
			},
		],
		process: [
			discoveryCall,
			{
				title: "Diagnostic souveraineté et licences",
				text: "Cartographie de vos outils et de vos données, coûts actuels et économies possibles.",
			},
			{
				title: "Plan de migration en 3 horizons",
				text: "Les gains rapides d'abord, puis les chantiers structurants, jusqu'à la cible.",
			},
			{
				title: "Migration accompagnée",
				text: "Sans coupure de service, données reprises, équipes formées et documentation livrée.",
			},
		],
		offer: {
			name: "Diagnostic souveraineté et licences",
			duration: "2 à 4 jours",
			price: "1 500 €",
			launchPrice: "1 200 €",
			priceDetail:
				"pour une TPE (moins de 10 postes) · 2 400 € HT pour une PME ou une collectivité (10 à 50 postes)",
			includes: [
				"Inventaire de vos logiciels, SaaS et licences",
				"Carte des dépendances hors Europe et des risques associés",
				"Coûts actuels et économies possibles",
				"Alternatives open source ou européennes adaptées",
				"Plan de migration en 3 horizons",
			],
		},
		why: [
			"Migration d'une boutique Shopware vers Sylius menée pour Tune (Allemagne).",
			"Responsable de la migration des données lors des déploiements de l'ERP de PSA en usine.",
			"J'héberge mes propres projets sur des serveurs européens, durcis et maintenus.",
		],
		faq: [
			{
				q: "L'open source, c'est gratuit ?",
				a: "Les logiciels sont sans licence, mais il faut les héberger et les maintenir. Le diagnostic chiffre le coût total réel pour que vous décidiez en connaissance de cause.",
			},
			{
				q: "Faut-il tout migrer d'un coup ?",
				a: "Non. Le plan en 3 horizons commence par les gains rapides et les données les plus sensibles.",
			},
			{
				q: "Qui maintient les outils après la migration ?",
				a: "Je documente et je forme vos équipes ou votre prestataire. Pour les applications que je livre, je propose aussi un forfait d'hébergement et de maintenance.",
			},
			{
				q: "Travaillez-vous avec les collectivités ?",
				a: "Oui. Le montant d'un diagnostic reste très en dessous des seuils de procédure, ce qui permet un achat direct simple.",
			},
		],
		calEvent: "souverainete",
		ctaTitle: "Combien vous coûte votre dépendance ?",
	},
	{
		slug: "renfort-et-infrastructure",
		aliases: ["renfort-developpeur", "hebergement-devops"],
		secondary: true,
		menuLabel: "Renfort et infrastructure",
		cardText:
			"Pour les équipes tech : un développeur senior en renfort 2 à 3 jours par semaine, et une infra sécurisée, automatisée, documentée.",
		icon: icons.users,
		seoTitle:
			"Renfort développeur senior et infrastructure (DevOps, hébergement) | Codelsior",
		metaDescription:
			"Développeur freelance senior (15 ans) en renfort de votre équipe — PHP/Symfony, Sylius, Magento, ERP — et mise en sécurité de votre hébergement : Docker, Traefik, CI/CD, sauvegardes, serveurs en France ou en Europe.",
		headline: "Un senior de plus dans votre équipe, ou sur votre infra.",
		subheadline:
			"Roadmap qui glisse, migration à mener, déploiements à la main, sauvegardes jamais testées ? Je rejoins votre équipe en régie 2 à 3 jours par semaine, et je sécurise, automatise et documente votre hébergement, en France ou en Europe.",
		audience: "CTO, lead devs, DSI de PME et de scale-ups, éditeurs SaaS",
		pains: [
			{
				title: "Une roadmap qui glisse",
				text: "Les priorités s'empilent, l'équipe est saturée et les clients attendent.",
			},
			{
				title: "Un recrutement qui prend 6 mois",
				text: "Et pendant ce temps, le projet n'avance pas.",
			},
			{
				title: "Des déploiements qui font peur",
				text: "À la main, le vendredi soir, en croisant les doigts.",
			},
			{
				title: "Des sauvegardes jamais testées",
				text: "Elles existent sans doute. Mais le jour où il faudra restaurer…",
			},
		],
		deliverables: [
			{
				title: "PHP et Symfony",
				text: "API, back-offices, refontes et montées de version, avec des tests.",
			},
			{
				title: "E-commerce et ERP",
				text: "Sylius, Magento, migrations de plateforme, Java, connecteurs ERP et paiement, migrations de données.",
			},
			{
				title: "Architecture, revue de code et IA",
				text: "Un regard senior sur vos choix techniques et votre dette, et les pratiques de développement assisté par l'IA partagées avec votre équipe.",
			},
			{
				title: "Audit et durcissement",
				text: "SSH, pare-feu, mises à jour, exposition des services : les failles fermées une par une.",
			},
			{
				title: "Docker, Traefik et CI/CD",
				text: "Des environnements reproductibles et des déploiements automatisés, avec retour arrière sans stress.",
			},
			{
				title: "Sauvegardes, supervision et migration",
				text: "Sauvegardes réellement testées, alertes avant vos clients, et migration vers un cloud européen sans coupure.",
			},
		],
		process: [
			discoveryCall,
			{
				title: "Onboarding, ou audit infra (1 jour)",
				text: "Pour un renfort : accès, lecture du code, premier ticket livré dès la première semaine. Pour une infra : revue complète, rapport priorisé et restitution.",
			},
			{
				title: "Intégration à vos rituels",
				text: "Sprints, revues, points d'équipe : en remote ou sur site en Alsace. Côté infra, les risques critiques d'abord, puis l'automatisation et la supervision.",
			},
			{
				title: "Passation et documentation",
				text: "Vous devenez autonomes, rien ne repart avec moi, et je reste joignable en cas de besoin.",
			},
		],
		offer: {
			name: "Audit infra et sécurité",
			duration: "1 jour",
			price: "1 190 €",
			launchPrice: "950 €",
			priceDetail:
				"pour 1 serveur ou 1 stack · +450 € HT par serveur supplémentaire",
			includes: [
				"Revue SSH, pare-feu et mises à jour",
				"Analyse Docker, Traefik et certificats TLS",
				"Vérification des sauvegardes et de l'exposition aux CVE",
				"Rapport priorisé et restitution d'une heure",
			],
		},
		availability: [
			"2 à 3 jours par semaine",
			"Remote, ou sur site en Alsace, à Bâle et à Fribourg-en-Brisgau",
			"Régie au TJM, communiqué lors de l'appel découverte",
		],
		why: [
			"Senior PHP/Symfony, Java et e-commerce : 15 ans de projets en production.",
			"Migrations réalisées : Shopware vers Sylius (Tune), montée de version Magento (Lightweight).",
			"J'opère au quotidien l'infrastructure multi-tenant de Bonjour Fun : 10 marketplaces, domaines personnalisés et SSL automatisé.",
			"Ancien responsable de l'infrastructure informatique de Tune (Allemagne).",
		],
		faq: [
			{
				q: "Pourquoi 2 à 3 jours par semaine ?",
				a: "Je reste CTO de Bonjour Fun, ce qui me garde au contact de la production au quotidien. Ce rythme convient à un renfort durable comme à une migration ciblée.",
			},
			{
				q: "Quel est votre TJM ?",
				a: "Il dépend de la durée et du périmètre de la mission. Je vous le communique dès l'appel découverte, sans détour.",
			},
			{
				q: "Et si notre stack est différente ?",
				a: "Mon cœur de métier est PHP/Symfony, l'e-commerce et l'ERP, et je m'adapte vite aux stacks voisines. Si ce n'est pas le bon fit, je vous le dirai dès l'appel.",
			},
			{
				q: "Faites-vous de l'infogérance ?",
				a: "Pour les applications que je développe, oui, via un forfait mensuel. Pour le reste de votre parc, cela dépend du périmètre : parlons-en.",
			},
			{
				q: "Faut-il tout passer sous Docker ?",
				a: "Non. Je pars de votre existant et je ne conteneurise que ce qui apporte un vrai gain.",
			},
		],
		calEvent: "renfort",
		ctaTitle: "Besoin d'un senior dès la semaine prochaine ?",
	},
];

// Hébergement et maintenance des applications livrées.
export const maintenancePlans = [
	{
		name: "Essentiel",
		price: "190 €",
		features: [
			"Hébergement en Europe",
			"Sauvegardes quotidiennes",
			"Mises à jour de sécurité",
			"Supervision",
			"1 h de support par mois",
		],
	},
	{
		name: "Standard",
		price: "390 €",
		features: [
			"Tout Essentiel",
			"3 h d'évolutions par mois",
			"Réponse le jour ouvré suivant",
		],
	},
	{
		name: "Pro",
		price: "790 €",
		features: [
			"Tout Standard",
			"1 jour d'évolutions par mois",
			"Réponse sous 4 h ouvrées",
		],
	},
];

export function serviceUrl(service: Service) {
	return `/services/${service.slug}`;
}

export const featuredService = services.find((service) => service.featured);

export const primaryServices = services.filter(
	(service) => !service.secondary && !service.featured,
);

export const secondaryServices = services.filter(
	(service) => service.secondary,
);

// Tags (projets, articles, témoignages) rattachés à un service : son slug
// actuel et tous ses anciens slugs.
export function serviceTags(service: Service) {
	return [service.slug, ...(service.aliases ?? [])];
}

export function matchesService(service: Service, tags: string[] = []) {
	const slugs = serviceTags(service);
	return tags.some((tag) => slugs.includes(tag));
}

// Redirections des anciennes URLs de services, consommées par
// astro.config.mjs. Les mêmes règles sont servies en 301 par nginx en prod.
export const serviceRedirects: Record<string, string> = Object.fromEntries(
	services.flatMap((service) =>
		(service.aliases ?? []).map((alias) => [
			`/services/${alias}`,
			serviceUrl(service),
		]),
	),
);
