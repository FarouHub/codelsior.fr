// Réglages commerciaux du site, centralisés ici pour être modifiés sans
// toucher aux pages.

export const site = {
	name: "Codelsior",
	owner: "Nicolas Sittler",
	url: "https://www.codelsior.fr",
	email: "contact@codelsior.fr",
	availability: "Disponible immédiatement",
	area: "Freelance en Alsace · Remote partout en France",
	// Allégation affichée sur la home et la landing « projet sur mesure ».
	// Elle doit rester justifiable par la comparaison chiffrée de la landing.
	savingsClaim: "jusqu'à 10× moins cher qu'une agence",
	// Nombre de clients éligibles aux prix de lancement.
	launchSlots: 3,
};

// Prise de RDV : un type d'événement Cal.com par service. Remplacer
// `base` par l'URL du compte Cal.com une fois créé, et garder des slugs
// d'événements identiques à ceux configurés dans Cal.com.
//
// Événements attendus côté Cal.com (le `calEvent` d'un service doit porter
// le même slug) :
//   decouverte        Appel découverte · 30 min
//   diagnostic-pme    Diagnostic PME – échange de 30 min · offre TPE/PME
//                     d'Alsace (à créer dans Cal.com)
//   projet-sur-mesure Logiciel sur mesure et automatisation IA · 30 min
//   souverainete      Souveraineté et open source · 30 min
//   renfort           Renfort et infrastructure · 30 min
export const booking = {
	base: "https://cal.com/codelsior",
	defaultEvent: "decouverte",
};

export function bookingUrl(event: string = booking.defaultEvent) {
	return `${booking.base}/${event}`;
}

// Chemin attendu par l'embed Cal.com (data-cal-link), ex. "codelsior/renfort".
export function bookingCalLink(event: string = booking.defaultEvent) {
	return new URL(bookingUrl(event)).pathname.slice(1);
}

// Mesure d'audience Umami auto-hébergée. Le script n'est injecté que si les
// deux valeurs sont renseignées.
export const umami = {
	src: "",
	websiteId: "",
};
