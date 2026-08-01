import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	site: "https://www.codelsior.fr",
	// URLs sans slash final : le build génère /blog.html au lieu de
	// /blog/index.html, servi tel quel par nginx sur /blog.
	trailingSlash: "never",
	build: {
		format: "file",
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
