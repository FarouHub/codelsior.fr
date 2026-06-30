---
name: chat-to-blog
description: Transforme un transcript de chat Claude en article de blog Astro. Anonymise les données sensibles en deux passes (déterministe puis sémantique), réécrit la conversation en article éditorial structuré, puis génère un fichier markdown dans la content collection Astro avec draft:true. Déclencher quand l'utilisateur veut convertir une session/conversation/chat en post de blog, ou mentionne "transformer ma session en article".
---

# Chat to Blog

Convertit un transcript de conversation Claude en article de blog Astro publiable,
en garantissant l'anonymisation des données sensibles.

## Principe

Trois garde-fous non négociables :
1. Anonymisation déterministe (regex) AVANT toute lecture sémantique.
2. Validation humaine obligatoire après le rapport d'anonymisation.
3. Jamais de commit automatique. Le fichier sort toujours en `draft: true`.

## Étapes (dans l'ordre, ne sauter aucune)

### 1. Récupérer le transcript
L'utilisateur fournit un chemin (`transcript.md`) ou colle le contenu.
Si le contenu est collé, l'écrire dans `transcript.md` dans le répertoire courant.

### 2. Anonymisation — passe déterministe
Lancer le script regex en premier :
```bash
docker compose exec astro node .claude/skills/chat-to-blog/anonymize.mjs < transcript.md > clean.md
```
Le script écrit aussi `anonymize_report.json` listant les remplacements.

### 3. Anonymisation — passe sémantique
Lire `clean.md` et masquer manuellement ce que les regex ne peuvent pas attraper :
- Noms de clients, prestataires, partenaires, personnes → `[CLIENT]`, `[PRESTATAIRE]`, `[PERSONNE]`
- Identifiants Stripe : `acct_*`, `cus_*`, `pi_*`, `sub_*`, `price_*` → `[STRIPE_ID]`
- Noms d'hôtes, chemins serveurs, IPs internes, noms de VPS → `[HOST]`, `[PATH]`
- Données métier confidentielles (CA, marges, volumes, noms de domaines internes)
- Tout secret partiel résiduel → suppression totale

Règles :
- En cas de doute, masquer.
- Ne jamais inventer de valeur pour "remplir" un placeholder.
- Garder la cohérence : la même entité reçoit toujours le même placeholder.

### 4. Rapport d'anonymisation — STOP
Produire un rapport lisible listant TOUT ce qui a été masqué (regex + sémantique),
groupé par catégorie. Puis **s'arrêter et demander validation explicite** à
l'utilisateur avant de rédiger. Ne pas continuer sans un "ok / valide / continue".

### 5. Rédaction éditoriale
Après validation, transformer `clean.md` en article :
- Titre accrocheur + slug
- Introduction qui pose le problème/contexte
- Corps structuré en sections `##` (pas une transcription Q/R brute)
- Code blocks nettoyés et commentés si pertinent
- Conclusion / takeaways

C'est une réécriture, pas un copier-coller du chat. Supprimer les digressions,
les faux départs, les "merci"/"parfait", garder la substance technique.

### 6. Génération du fichier Astro
Écrire dans `src/content/blog/<slug>.md` (adapter le chemin à la content
collection réelle — vérifier `src/content/config.ts` ou `src/content.config.ts`).
Utiliser le template `templates/frontmatter.md` et adapter les champs au schéma
Zod existant. Toujours `draft: true`.

### 7. Fin
Annoncer le chemin du fichier créé. Ne PAS committer.
Rappeler à l'utilisateur de relire avant de passer `draft: false`.

## Schéma de frontmatter
Avant d'écrire, lire le schéma de la content collection Astro pour respecter
exactement les champs requis (certains projets utilisent `pubDate`, d'autres
`date`; `tags` vs `categories`; etc.). Ne pas supposer.