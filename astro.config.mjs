import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { serviceRedirects } from "./src/collections/services";

// https://astro.build/config
export default defineConfig({
	site: "https://www.codelsior.fr",
	// URLs sans slash final : le build génère /blog.html au lieu de
	// /blog/index.html, servi tel quel par nginx sur /blog.
	trailingSlash: "never",
	build: {
		format: "file",
	},
	// Anciens slugs de services (champ `aliases` de la collection). En sortie
	// statique, Astro génère une page de redirection meta-refresh : c'est le
	// filet pour `astro dev` et `astro preview`. En production, nginx répond
	// avant, en vrai 301 (voir nginx.prod.conf).
	redirects: serviceRedirects,
	vite: {
		plugins: [tailwindcss()],
	},
});
