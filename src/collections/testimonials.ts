// Témoignages clients. La section reste masquée tant que la liste est vide.
// `services` limite un témoignage à certaines landings (slugs) ; vide, il
// s'affiche partout.

export interface Testimonial {
	quote: string;
	name: string;
	role: string;
	photo?: string;
	services: string[];
}

export const testimonials: Testimonial[] = [];
