import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

// Slash final : le build Astro génère des dossiers (/blog/index.html), donc
// c'est l'URL qui répond 200 directement, sans passer par une redirection.
const staticPages = ["/", "/blog/", "/projets/", "/a-propos/"];

function parseDate(dateStr: string) {
	const [month, day, year] = dateStr.split(" ");
	return new Date(`${month} ${Number.parseInt(day, 10)}, ${year}`);
}

// Format local (pas d'UTC) pour éviter un décalage d'un jour sur la date.
function formatDate(date: Date) {
	const month = `${date.getMonth() + 1}`.padStart(2, "0");
	const day = `${date.getDate()}`.padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
}

export const GET: APIRoute = async ({ site }) => {
	const posts = await getCollection("post");

	const urls = [
		...staticPages.map((path) => ({ loc: path, lastmod: null })),
		...posts.map((post) => ({
			loc: `/post/${post.id}/`,
			lastmod: parseDate(post.data.dateFormatted),
		})),
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(({ loc, lastmod }) => {
		const url = new URL(loc, site).href;
		const lastmodTag =
			lastmod && !Number.isNaN(lastmod.getTime())
				? `\n    <lastmod>${formatDate(lastmod)}</lastmod>`
				: "";
		return `  <url>\n    <loc>${url}</loc>${lastmodTag}\n  </url>`;
	})
	.join("\n")}
</urlset>
`;

	return new Response(body, {
		headers: { "Content-Type": "application/xml; charset=utf-8" },
	});
};
