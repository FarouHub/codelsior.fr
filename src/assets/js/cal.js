// Prise de RDV Cal.com en popup sur les liens [data-cal-link].
//
// embed.js ouvre la popup au clic mais n'annule pas la navigation du lien :
// on ne l'annule que si le script a bien été exécuté (Cal.instance existe).
// S'il est bloqué ou pas encore chargé, le lien ouvre Cal.com dans un nouvel
// onglet comme avant.

const EMBED_SRC = "https://app.cal.com/embed/embed.js";

function loadCalEmbed() {
	if (window.Cal) return;

	// File d'attente lue par embed.js à son chargement (équivalent du snippet
	// officiel, sans gestion des namespaces).
	const cal = (...args) => {
		cal.q.push(args);
	};
	cal.q = [];
	cal.ns = {};
	cal.loaded = true;
	window.Cal = cal;
	cal("init", { origin: "https://cal.com" });

	const script = document.createElement("script");
	script.src = EMBED_SRC;
	script.async = true;
	document.head.appendChild(script);
}

document.addEventListener("click", (event) => {
	const link = event.target.closest?.("[data-cal-link]");
	if (link && window.Cal?.instance) event.preventDefault();
});

// Chargé une fois la page affichée, pour ne pas ralentir le premier rendu.
window.addEventListener("load", () => {
	if ("requestIdleCallback" in window) {
		requestIdleCallback(loadCalEmbed, { timeout: 3000 });
	} else {
		setTimeout(loadCalEmbed, 1000);
	}
});
