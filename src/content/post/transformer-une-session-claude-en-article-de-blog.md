---
layout: ../../layouts/post.astro
title: Transformer une session Claude en article de blog (sans fuiter de données)
description: Un workflow reproductible pour convertir une conversation Claude en post Astro, avec une anonymisation en deux passes et une validation humaine avant publication.
dateFormatted: Jun 30th, 2026
draft: true
---

J'ai un blog sous Astro et j'utilise Claude au quotidien. Beaucoup de mes
conversations méritent de devenir des articles : un problème résolu, une astuce,
un bout d'architecture. Le copier-coller brut ne suffit pas — il faut réécrire,
structurer, et surtout **ne jamais publier par accident une clé d'API ou un nom
de client**.

Voici le workflow que j'ai mis en place pour automatiser tout ça, de la session
de chat jusqu'au fichier markdown prêt à relire.

## Un skill local plutôt que Cowork

La première décision, c'est l'outil. Pour de l'usage ponctuel, une approche
« one-shot » suffirait. Mais dès que la tâche devient récurrente et qu'elle doit
**écrire dans mon repo Astro**, committer et me laisser la main sur
l'anonymisation, le bon choix est un **skill Claude Code versionné dans le repo**.

Les avantages :

- il est reproductible et évolue avec le blog ;
- il se déclenche en une phrase à la racine du projet ;
- il écrit directement dans la content collection ;
- je garde le contrôle total sur le commit.

La structure tient en trois fichiers :

```
.claude/skills/chat-to-blog/
  SKILL.md                 # orchestration des étapes
  anonymize.mjs            # passe d'anonymisation déterministe
  templates/frontmatter.md # gabarit du frontmatter Astro
```

Le `SKILL.md` enchaîne trois étapes : **anonymisation → rédaction → génération
du fichier Astro**.

## L'anonymisation : deux couches, jamais une seule

C'est le point critique du workflow. **Ne jamais se reposer uniquement sur le
LLM** pour masquer des secrets. La règle est de faire une passe déterministe
*avant* d'envoyer quoi que ce soit au modèle.

### Couche 1 — regex déterministe

Un script sans dépendance qui lit le transcript sur `stdin`, écrit la version
masquée sur `stdout`, et produit un rapport JSON des remplacements. Il attrape
tout ce qui a une forme reconnaissable : clés d'API, tokens GitHub/Slack, JWT,
identifiants Stripe, IP, MAC, IBAN, emails, numéros de téléphone…

```js
// Ordre important : motifs les plus spécifiques d'abord.
const PATTERNS = [
  [/sk-ant-[A-Za-z0-9_-]{20,}/g, "[ANTHROPIC_KEY]"],
  [/sk-[A-Za-z0-9]{20,}/g, "[API_KEY]"],
  [/\bghp_[A-Za-z0-9]{30,}\b/g, "[GITHUB_TOKEN]"],
  [/(?:password|secret|token|bearer|api[_-]?key)\s*[:=]\s*[^\s'"]+/gi, "[SECRET]"],
  [/\b(?:acct|cus|pi|sub|price|prod)_[A-Za-z0-9]{10,}\b/g, "[STRIPE_ID]"],
  [/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g, "[IP]"],
  [/\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g, "[EMAIL]"],
  // … et tes domaines d'infra spécifiques, à ne jamais voir fuiter :
  [/\b(?:[a-zA-Z0-9-]+\.)+(?:mon-projet\.fr)\b/g, "[INTERNAL_HOST]"],
];
```

Le détail qui compte : **ajouter ses propres domaines internes** à la liste.
Les patterns génériques ne connaissent pas tes sous-domaines de VPS ou tes noms
d'hôtes privés — c'est à toi de les déclarer.

### Couche 2 — passe sémantique par le LLM

Les regex ratent tout ce qui n'a pas de forme fixe : noms de clients, de
prestataires, chemins serveurs, données métier (CA, marges, volumes), noms de
domaines internes oubliés. C'est là qu'intervient Claude, avec une consigne
explicite : **en cas de doute, masquer**, et remplacer par des placeholders
génériques cohérents (`[CLIENT]`, `[PRESTATAIRE]`, `[HOST]`…).

### Couche 3 (humaine) — la validation

Le skill produit un **rapport listant tout ce qui a été masqué**, groupé par
catégorie, puis **s'arrête**. Aucune rédaction, aucun commit tant que je n'ai pas
relu et validé. Sur ce type de contenu, l'auto-commit est proscrit.

## Pas de Python : tout passe par Docker

Mon environnement Astro tourne dans un conteneur `node:20-alpine`. Pas de Python
en local, et pas l'envie d'en installer. Première idée : ajouter un service
Python. Mais lancer un conteneur qui tourne en permanence pour un script
ponctuel, c'est du gaspillage.

Deux options propres existent.

**Option A — un conteneur Python à la demande.** La clé est le profil `tools`,
qui empêche le service de démarrer avec un `up` normal. On l'invoque seulement
quand on en a besoin :

```bash
docker compose run --rm anonymize < transcript.md > clean.md
```

Le `--rm` détruit le conteneur après usage. C'est du pur pipe Unix, rien qui
traîne.

**Option B (recommandée) — zéro service en plus.** Le conteneur Astro a déjà
Node, et l'anonymiseur ne fait que du regex. Autant le porter en Node et
l'exécuter dans le conteneur existant :

```bash
docker compose exec astro node .claude/skills/chat-to-blog/anonymize.mjs \
  < transcript.md > clean.md
```

Résultat identique au Python, aucune image supplémentaire, rien qui tourne pour
rien. C'est l'option que j'ai retenue.

Un piège Docker à connaître : comme le compose monte `.:/app`, les fichiers
`clean.md` et `anonymize_report.json` écrits dans le conteneur apparaissent dans
le repo local — c'est voulu. Mais il faut **ajouter le `transcript.md` brut (non
masqué) au `.gitignore`** pour ne jamais committer la version non anonymisée.

## Récupérer le transcript : le maillon le moins automatisé

C'est la limite réelle du workflow. L'interface chat de Claude n'a pas de bouton
« exporter en markdown ». Les options, de la plus simple à la plus propre :

1. **Bouton « copier » natif sur chaque message** — produit un markdown fidèle
   (tableaux, formatage complexe préservés). Pour une conversation entière, on
   copie message par message. Le plus fiable.
2. **Ctrl+A / copier-coller global** — rapide, mais casse souvent la structure.
   Bon pour un brouillon.
3. **Export officiel des données** (Réglages → Confidentialité) — exhaustif mais
   surdimensionné : c'est *tout* l'historique dans un ZIP JSON, reçu par email,
   qu'il faut ensuite filtrer pour retrouver la bonne conversation.
4. **Scripts exportateurs communautaires** — pratiques mais non officiels, ils
   s'appuient sur les sélecteurs CSS de l'interface et cassent à chaque refonte.
   Jamais sur une conversation contenant des secrets non encore anonymisés.

Pour un usage ponctuel, la méthode 1 reste la meilleure. Et de toute façon, **la
vraie protection sur les données sensibles, c'est la passe d'anonymisation + la
relecture du rapport**, pas la méthode d'export.

> À noter : si on bascule ces conversations sur **Claude Code** plutôt que le
> chat, `/export session.md` écrit le transcript directement sur disque, et le
> skill peut enchaîner sans aucun copier-coller. C'est l'alternative qui supprime
> totalement cette friction.

## Le résultat

Une fois le transcript récupéré, une seule phrase à la racine du repo déclenche
toute la chaîne :

```
> transforme ce transcript en article de blog : @transcript.md
```

Le skill lance la passe regex, fait la passe sémantique, présente le rapport
d'anonymisation, **s'arrête pour validation**, puis écrit un `.md` en
`draft: true` dans la content collection. Aucun commit automatique.

## Les takeaways

- **Skill versionné > one-shot** dès que la tâche est récurrente et touche au repo.
- **Anonymisation en deux passes** : déterministe d'abord, sémantique ensuite.
  Jamais le LLM seul pour les secrets.
- **Validation humaine obligatoire** avant rédaction, et `draft: true` par défaut.
- **Pas besoin de Python** : un script Node dans le conteneur Astro existant fait
  le travail.
- **`.gitignore` le transcript brut** pour ne jamais committer la version non masquée.
- Le seul vrai point de friction restant, c'est l'export du transcript depuis le
  chat — une limite de l'interface, pas du workflow.
