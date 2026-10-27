// Les 5 services (pivots) du site, regroupés en 3 familles. Chaque service
// génère sa landing page /services/<slug> et alimente la home, le menu, le
// footer et le sitemap.

export type FamilyId = "construire" | "liberer" | "renforcer";

export interface Family {
	id: FamilyId;
	name: string;
	tagline: string;
}

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
	family: FamilyId;
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
	offer?: Offer;
	availability?: string[];
	comparison?: { rows: ComparisonRow[]; method: string };
	showMaintenance?: boolean;
	why: string[];
	faq: { q: string; a: string }[];
	calEvent: string;
	ctaTitle: string;
}

export const families: Family[] = [
	{
		id: "construire",
		name: "Construire",
		tagline: "Donnez vie aux outils qui vous manquent.",
	},
	{
		id: "liberer",
		name: "Libérer",
		tagline: "Reprenez le contrôle de vos données et de vos licences.",
	},
	{
		id: "renforcer",
		name: "Renforcer",
		tagline: "Un senior de plus dans votre équipe ou sur votre infra.",
	},
];

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
		slug: "projet-sur-mesure-ia",
		family: "construire",
		menuLabel: "Projet sur mesure avec l'IA",
		cardText:
			"Back-office, portail client, outil métier : le projet que vous repoussez depuis des années, enfin à votre portée.",
		icon: icons.sparkles,
		seoTitle: "Logiciel sur mesure développé avec l'IA pour PME | Codelsior",
		metaDescription:
			"Back-office, portail client, outil métier : faites développer le projet que vous repoussez depuis des années, jusqu'à 10× moins cher qu'une agence grâce à l'IA. Freelance en Alsace, partout en France.",
		headline: "Le projet que vous n'avez jamais osé lancer.",
		subheadline:
			"Back-office, portail client, outil de devis, application métier… Grâce au développement assisté par l'IA, je livre des outils sur mesure en quelques semaines, jusqu'à 10× moins cher qu'une agence.",
		audience: "Dirigeants de PME, responsables métier, porteurs de projet",
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
				title: "Un SaaS cher qui ne colle pas",
				text: "Vous payez des licences chaque mois pour un outil que vos équipes contournent au quotidien.",
			},
		],
		deliverables: [
			{
				title: "Outils métier et back-offices",
				text: "Stocks, planning, suivi de production, CRM maison : un outil taillé pour vos process, pas l'inverse.",
			},
			{
				title: "Portails clients et extranets",
				text: "Commandes, documents, suivi de dossier : vos clients se servent seuls, 24 h/24.",
			},
			{
				title: "MVP de SaaS",
				text: "Une idée de produit ? Je construis une première version solide, prête pour vos premiers utilisateurs.",
			},
			{
				title: "Remplacement d'Excel, Access ou d'un vieux logiciel",
				text: "Je reprends l'existant, migre les données et livre un outil web moderne et maintenable.",
			},
		],
		process: [
			discoveryCall,
			{
				title: "Cadrage + prototype en 5 jours",
				text: "Vous voyez et cliquez sur votre futur outil avant d'engager le budget de développement.",
			},
			{
				title: "Développement par itérations",
				text: "Une livraison chaque semaine, testée par vous. L'IA accélère, je garde la main sur l'architecture et la qualité.",
			},
			{
				title: "Mise en production et suivi",
				text: "Hébergement en France ou en Europe, puis maintenance et évolutions si vous le souhaitez.",
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
		slug: "automatisation-ia",
		family: "construire",
		menuLabel: "Automatisation de processus par l'IA",
		cardText:
			"Saisie, tri, relances, ressaisies entre logiciels : je repère les tâches répétitives et je les automatise.",
		icon: icons.bolt,
		seoTitle: "Automatisation des processus par l'IA pour PME | Codelsior",
		metaDescription:
			"Factures, emails, synchronisation entre logiciels, assistants internes : j'automatise les tâches répétitives de vos équipes avec l'IA, en gardant vos données en Europe. Audit d'une demi-journée pour démarrer.",
		headline: "Arrêtez de faire à la main ce qu'une machine fait mieux.",
		subheadline:
			"Saisie de factures, tri des emails, relances, copier-coller entre logiciels… J'identifie les tâches répétitives de vos équipes et je les automatise avec l'IA, sans faire sortir vos données d'Europe.",
		audience: "Dirigeants, DAF, responsables des opérations",
		pains: [
			{
				title: "Des heures perdues en saisie",
				text: "Vos équipes recopient des factures, des bons de commande et des emails au lieu de faire leur vrai métier.",
			},
			{
				title: "Des outils qui ne se parlent pas",
				text: "Exports, ressaisies, erreurs de copier-coller : chaque logiciel est une île.",
			},
			{
				title: "L'IA, mais par où commencer ?",
				text: "ChatGPT utilisé en vrac, des données qui partent on ne sait où, et aucun gain mesurable.",
			},
		],
		deliverables: [
			{
				title: "Traitement des documents",
				text: "Factures, bons de commande, contrats : extraction automatique et intégration dans vos outils.",
			},
			{
				title: "Emails et demandes clients",
				text: "Tri, routage et réponses préparées : votre équipe valide au lieu de rédiger.",
			},
			{
				title: "Synchronisation entre outils",
				text: "CRM, ERP, e-commerce, comptabilité : les données circulent seules, sans ressaisie.",
			},
			{
				title: "Assistants internes",
				text: "Un assistant qui répond à partir de vos procédures, de vos documents et de vos données.",
			},
			{
				title: "IA souveraine",
				text: "Modèles européens ou open source hébergés en Europe pour vos données sensibles.",
			},
			{
				title: "Formation de vos équipes",
				text: "Les bons usages de l'IA au quotidien, adaptés à vos métiers et à vos règles de confidentialité.",
			},
		],
		process: [
			discoveryCall,
			{
				title: "Audit automatisation (½ journée)",
				text: "On passe en revue vos processus, je repère les gains rapides et je chiffre le temps économisé.",
			},
			{
				title: "Mise en place",
				text: "Je construis les automatisations prioritaires, en commençant par celle qui rapporte le plus.",
			},
			{
				title: "Mesure et extension",
				text: "On mesure les heures gagnées, puis on étend aux processus suivants.",
			},
		],
		offer: {
			name: "Audit automatisation IA",
			duration: "½ journée",
			price: "590 €",
			launchPrice: "450 €",
			includes: [
				"Revue de vos processus avec vos équipes, sur site ou en visio",
				"3 à 5 automatisations identifiées et classées par impact",
				"1 à 2 gains rapides chiffrés en heures économisées",
				"Recommandations d'outils, options souveraines incluses",
			],
			note: "Montant déduit de la mise en place si vous me confiez le projet.",
		},
		showMaintenance: true,
		why: [
			"J'utilise l'IA tous les jours pour développer et opérer Bonjour Fun : je sais ce qui marche vraiment, et ce qui relève du gadget.",
			"Ancien pilote d'application chez PSA : je parle processus et métier, pas seulement technique.",
			"Vos données restent sous contrôle : hébergement en France ou en Europe, modèles souverains possibles.",
		],
		faq: [
			{
				q: "Faut-il changer nos logiciels ?",
				a: "Non. Les automatisations se branchent sur vos outils existants (messagerie, ERP, CRM, e-commerce, tableurs) dès qu'ils le permettent.",
			},
			{
				q: "Nos données vont-elles partir chez OpenAI ?",
				a: "Seulement si vous le choisissez. Pour les données sensibles, je propose des modèles européens ou open source hébergés en Europe.",
			},
			{
				q: "Combien de temps pour voir un résultat ?",
				a: "Les gains rapides identifiés pendant l'audit se mettent généralement en place en quelques jours.",
			},
			{
				q: "Et si l'IA se trompe ?",
				a: "Je prévois une validation humaine là où une erreur coûte cher. L'IA prépare, votre équipe valide.",
			},
		],
		calEvent: "automatisation-ia",
		ctaTitle: "Quelles tâches pourriez-vous ne plus jamais faire ?",
	},
	{
		slug: "souverainete-open-source",
		family: "liberer",
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
		slug: "renfort-developpeur",
		family: "renforcer",
		menuLabel: "Renfort développeur senior",
		cardText:
			"PHP/Symfony, e-commerce, ERP : un senior qui rejoint votre équipe 2 à 3 jours par semaine, dès maintenant.",
		icon: icons.users,
		seoTitle:
			"Développeur freelance senior PHP/Symfony et e-commerce en renfort | Codelsior",
		metaDescription:
			"Développeur freelance senior (15 ans) en renfort de votre équipe : PHP/Symfony, Sylius, Magento, Java, ERP. 2 à 3 jours par semaine, remote ou sur site en Alsace. Disponible immédiatement.",
		headline: "Un développeur senior dans votre équipe, dès cette semaine.",
		subheadline:
			"Roadmap qui glisse, migration à mener, départ à compenser ? Je rejoins votre équipe en régie, 2 à 3 jours par semaine, avec 15 ans d'expérience en PHP/Symfony, e-commerce et ERP, et l'IA comme accélérateur.",
		audience: "CTO, lead devs, DSI de PME et de scale-ups",
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
				title: "Une migration que personne n'ose toucher",
				text: "Montée de version Symfony ou Magento, changement de plateforme e-commerce : le sujet est repoussé depuis trop longtemps.",
			},
		],
		deliverables: [
			{
				title: "PHP et Symfony",
				text: "API, back-offices, refontes et montées de version, avec des tests.",
			},
			{
				title: "E-commerce",
				text: "Sylius, Magento, migrations de plateforme, connecteurs ERP et paiement.",
			},
			{
				title: "ERP et logiciels métier",
				text: "Java, intégrations entre systèmes, migrations de données.",
			},
			{
				title: "Développement accéléré par l'IA",
				text: "Je partage avec votre équipe les pratiques que j'utilise au quotidien pour livrer plus vite.",
			},
			{
				title: "Architecture et revue de code",
				text: "Un regard senior sur vos choix techniques et votre dette.",
			},
			{
				title: "Infra si besoin",
				text: "Docker, CI/CD et déploiement : je ne m'arrête pas au merge.",
			},
		],
		process: [
			discoveryCall,
			{
				title: "Onboarding",
				text: "Accès, lecture du code, premier ticket livré dès la première semaine.",
			},
			{
				title: "Intégration à vos rituels",
				text: "Sprints, revues, points d'équipe : en remote ou sur site en Alsace.",
			},
			{
				title: "Passation",
				text: "Documentation et transmission : rien ne repart avec moi.",
			},
		],
		availability: [
			"2 à 3 jours par semaine",
			"Remote, ou sur site en Alsace, à Bâle et à Fribourg-en-Brisgau",
			"Régie au TJM, communiqué lors de l'appel découverte",
		],
		why: [
			"Senior PHP/Symfony, Java et e-commerce : 15 ans de projets en production.",
			"Migrations réalisées : Shopware vers Sylius (Tune), montée de version Magento (Lightweight).",
			"CTO de Bonjour Fun : je comprends les contraintes produit, pas seulement les tickets.",
		],
		faq: [
			{
				q: "Pourquoi 2 à 3 jours par semaine ?",
				a: "Je reste CTO de Bonjour Fun, ce qui me garde au contact de la production au quotidien. Ce rythme convient à un renfort durable comme à une migration ciblée.",
			},
			{
				q: "Remote ou sur site ?",
				a: "Principalement en remote, avec des déplacements possibles en Alsace, à Bâle ou à Fribourg-en-Brisgau.",
			},
			{
				q: "Quel est votre TJM ?",
				a: "Il dépend de la durée et du périmètre de la mission. Je vous le communique dès l'appel découverte, sans détour.",
			},
			{
				q: "Et si notre stack est différente ?",
				a: "Mon cœur de métier est PHP/Symfony, l'e-commerce et l'ERP, et je m'adapte vite aux stacks voisines. Si ce n'est pas le bon fit, je vous le dirai dès l'appel.",
			},
		],
		calEvent: "renfort",
		ctaTitle: "Besoin d'un senior dès la semaine prochaine ?",
	},
	{
		slug: "hebergement-devops",
		family: "renforcer",
		menuLabel: "Hébergement et DevOps",
		cardText:
			"Serveurs sécurisés, déploiements automatisés, sauvegardes testées, en France ou en Europe.",
		icon: icons.server,
		seoTitle:
			"Hébergement, DevOps et sécurité serveur en France et en Europe | Codelsior",
		metaDescription:
			"Durcissement de serveurs, Docker, Traefik, CI/CD, sauvegardes et migration d'hébergement vers la France ou l'Europe. Audit infra et sécurité d'une journée pour démarrer.",
		headline: "Une infra solide, sécurisée, et que vous comprenez.",
		subheadline:
			"Serveurs jamais mis à jour, déploiements à la main, sauvegardes jamais testées ? Je sécurise, automatise et documente votre hébergement, en France ou en Europe.",
		audience:
			"Équipes tech, éditeurs SaaS, PME qui hébergent leurs applications",
		pains: [
			{
				title: "Des déploiements qui font peur",
				text: "À la main, le vendredi soir, en croisant les doigts.",
			},
			{
				title: "Une sécurité au petit bonheur",
				text: "Ports ouverts, base de données exposée sur internet, mises à jour en retard.",
			},
			{
				title: "Des sauvegardes jamais testées",
				text: "Elles existent sans doute. Mais le jour où il faudra restaurer…",
			},
		],
		deliverables: [
			{
				title: "Audit et durcissement",
				text: "SSH, pare-feu, mises à jour, exposition des services : les failles fermées une par une.",
			},
			{
				title: "Conteneurisation",
				text: "Docker et Traefik, des environnements reproductibles du poste de dev à la production.",
			},
			{
				title: "CI/CD",
				text: "Déploiements automatisés, tests et retour arrière sans stress.",
			},
			{
				title: "Sauvegardes et reprise",
				text: "Sauvegardes externalisées et restaurations réellement testées.",
			},
			{
				title: "Supervision",
				text: "Monitoring et alertes : vous êtes prévenu avant vos clients.",
			},
			{
				title: "Migration d'hébergement",
				text: "Vers un VPS ou un cloud européen, sans coupure de service.",
			},
		],
		process: [
			discoveryCall,
			{
				title: "Audit infra et sécurité (1 jour)",
				text: "Revue complète de votre hébergement, rapport priorisé et restitution.",
			},
			{
				title: "Plan d'action",
				text: "Les risques critiques d'abord, puis l'automatisation et la supervision.",
			},
			{
				title: "Mise en œuvre et documentation",
				text: "Vous devenez autonomes, et je reste joignable en cas de besoin.",
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
		why: [
			"J'opère au quotidien l'infrastructure multi-tenant de Bonjour Fun : 10 marketplaces, domaines personnalisés et SSL automatisé.",
			"Ancien responsable de l'infrastructure informatique de Tune (Allemagne).",
			"J'écris sur le sujet : durcissement Debian, Traefik, multi-tenant. Les articles sont plus bas.",
		],
		faq: [
			{
				q: "Faites-vous de l'infogérance ?",
				a: "Pour les applications que je développe, oui, via un forfait mensuel. Pour le reste de votre parc, cela dépend du périmètre : parlons-en.",
			},
			{
				q: "Sur quels hébergeurs ?",
				a: "OVHcloud, Scaleway, Hetzner, Infomaniak ou votre cloud actuel. Je privilégie les hébergeurs européens.",
			},
			{
				q: "Faut-il tout passer sous Docker ?",
				a: "Non. Je pars de votre existant et je ne conteneurise que ce qui apporte un vrai gain.",
			},
		],
		calEvent: "devops",
		ctaTitle: "Votre infra passerait-elle un audit demain ?",
	},
];

// Hébergement et maintenance des applications livrées (pages « Construire »).
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

export function servicesOf(family: FamilyId) {
	return services.filter((service) => service.family === family);
}

export function serviceUrl(service: Service) {
	return `/services/${service.slug}`;
}
