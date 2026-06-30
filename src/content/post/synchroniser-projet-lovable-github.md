---
layout: ../../layouts/post.astro
title: Synchroniser un projet Lovable avec GitHub (et pousser ses modifs locales)
description: Comprendre le two-way sync de Lovable, gérer le cas tordu de deux repos séparés, et savoir quoi faire quand la synchronisation se bloque.
dateFormatted: Jun 30th, 2026
draft: false
---

Quand on commence à travailler sérieusement avec [Lovable](https://lovable.dev),
on tombe vite sur la même question : j'ai fait des modifications en local dans
mon éditeur, comment les répercuter dans Lovable ? Et l'inverse — comment
récupérer en local ce que Lovable a généré ?

La réponse tient en une idée : **le repo GitHub créé par Lovable est la source de
vérité**. Tout passe par lui. Voici comment câbler tout ça proprement, et
comment se sortir des deux ou trois pièges classiques.

## 1. Connecter Lovable à GitHub

Avant de synchroniser quoi que ce soit, il faut relier son compte Lovable à
GitHub. Depuis le dashboard :

1. Cliquer sur l'**icône de profil** (panneau gauche)
2. Aller dans **Settings → Connectors → GitHub**
3. **Connect to GitHub** et autoriser l'accès à son compte
4. **Connect project → Add organizations** pour installer l'app GitHub de Lovable
5. Depuis **All Projects**, sélectionner son projet et cliquer sur **Sync Your
   Project to GitHub**
6. Dérouler les étapes : **Connect Project → Install & Authorize → Connect →
   Transfer Anyway**

> ⚠️ Point important : Lovable **crée lui-même un nouveau repo GitHub**. Il ne se
> branche pas sur un repo existant. On y revient plus bas, car c'est la source de
> la plupart des galères.

## 2. Comprendre la logique de sync

Lovable fonctionne en **two-way sync automatique** avec GitHub :

- Chaque modification dans l'éditeur Lovable → commit automatique sur `main`
- Chaque `git push` depuis le terminal local → sync automatique côté Lovable

Il n'y a **pas de bouton « Push manuel »** dans l'interface. La synchronisation
se déclenche toute seule, dans les deux sens. C'est confortable une fois qu'on
l'a intégré, mais déroutant au début quand on cherche le bouton qui n'existe pas.

> 💡 Si une modif locale n'apparaît pas dans Lovable après quelques minutes, il
> suffit souvent de faire une petite modification anodine dans l'éditeur Lovable
> (ajouter un commentaire, par exemple) pour réamorcer une sync.

## 3. Le cas tordu : deux repos séparés

C'est le scénario le plus fréquent dès qu'on a commencé à coder en local **avant**
de connecter GitHub. On se retrouve avec deux dépôts :

- `mon-org/projet-lovable` — créé automatiquement par Lovable
- `mon-org/projet-local` — créé à la main, qui contient les modifications faites
  en local

Et là, le réflexe « je vais juste connecter Lovable à mon repo local » ne marche
pas : Lovable **ne supporte pas le Bring Your Own Repository**. Impossible de le
pointer vers un dépôt existant — il crée toujours le sien.

La bonne approche est donc de **rapatrier les modifications du repo manuel vers le
repo Lovable**, puis de pousser :

```bash
# 1. Cloner le repo créé par Lovable
git clone https://github.com/mon-org/projet-lovable.git
cd projet-lovable

# 2. Récupérer ses modifications depuis l'autre repo
#    (en bloc, ou fichier par fichier selon les changements)
cp -r ../projet-local/src ./src

# 3. Vérifier que tout tourne avant de pousser
npm install
npm run dev

# 4. Commiter et pousser
git add .
git commit -m "feat: apply local modifications"
git push origin main
```

Lovable détecte le push et se met à jour automatiquement. ✅

### Alternative plus propre : un patch Git

Si les changements sont éparpillés dans plusieurs fichiers, copier des dossiers
entiers est risqué (on écrase, on oublie). Générer un patch est plus chirurgical :

```bash
# Dans le repo source (projet-local)
git diff > ../mes-modifs.patch

# Dans le repo Lovable (projet-lovable)
git apply ../mes-modifs.patch
```

On relit, on teste, on commit, on push.

## Points clés à retenir

| Situation | Solution |
|-----------|----------|
| Pousser des modifs locales vers Lovable | `git push origin main` sur le repo Lovable |
| Sync apparemment bloquée | Faire une petite modif dans l'éditeur Lovable |
| Deux repos séparés | Copier les fichiers (ou appliquer un patch) vers le repo Lovable, puis pusher |
| Renommer / supprimer le repo Lovable | ❌ Casse la sync définitivement |
| Connecter Lovable à un repo existant | ❌ Non supporté — Lovable crée toujours son propre repo |

## En résumé

Tout devient simple dès qu'on accepte le principe de base : **le repo GitHub
généré par Lovable fait foi**. Toute modification venue d'ailleurs — locale, autre
dépôt — doit transiter par un `git push` vers ce repo pour exister aux yeux de
Lovable.

Une fois ce réflexe pris, le workflow est fluide : l'éditeur Lovable pour les
itérations rapides, son IDE local pour les changements plus lourds, et GitHub
comme point de rendez-vous entre les deux.
