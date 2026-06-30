---
layout: ../../layouts/post.astro
title: "Mini-sites multi-tenant : sous-domaines wildcard, domaines custom et SSL avec Traefik + Coolify"
description: "Retour d'expérience sur une architecture multi-tenant SaaS : routing par sous-domaine, domaines personnalisés clients, et émission automatique des certificats SSL — jusqu'au débogage en production."
dateFormatted: Jun 30th, 2026
draft: true
---

Sur un SaaS de réservation d'activités, je voulais offrir à chaque client
prestataire son propre mini-site public : une vitrine regroupant ses activités,
accessible via un sous-domaine dynamique, et — pour les abonnés premium — via son
propre nom de domaine. La stack : Next.js côté logiciel, Symfony côté back, le tout
déployé sur OVH via Coolify et Traefik.

L'idée semble simple. La réalité l'est moins : entre le routing multi-tenant, la
gestion des domaines personnalisés et surtout l'émission des certificats SSL, chaque
couche réserve ses pièges. Cet article retrace le cheminement complet, des choix
d'architecture jusqu'au débogage SSL en conditions réelles.

---

## Le routing multi-tenant par sous-domaine

### Le DNS : un wildcard plutôt que des enregistrements manuels

Impossible de créer un enregistrement DNS à la main pour chaque nouveau client.
La solution est le wildcard :

```
*.mondomaine.fr   → serveur applicatif
```

Deux règles fondamentales encadrent ce wildcard, et il faut les graver dès le départ
car elles ressurgiront plus tard :

- **Les enregistrements DNS explicites priment toujours sur le wildcard.** Les
  sous-domaines réservés (`app`, `www`, `logiciel`…) continuent de pointer où on le
  souhaite ; tout le reste tombe dans le wildcard.
- **Un wildcard DNS ne couvre qu'un seul niveau.** `*.mondomaine.fr` ne couvre pas
  `service.qualif.mondomaine.fr`, qui est deux niveaux en dessous.

### Résoudre le tenant dans Next.js

Le tenant se résout depuis le header `Host`, dans le middleware. La logique tient en
trois temps : extraire le sous-domaine et le domaine racine, exclure les sous-domaines
réservés et l'apex nu, puis réécrire l'URL vers une route tenant interne.

```ts
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const RESERVED = new Set(['app', 'logiciel', 'www', 'en'])
const ROOT_DOMAINS = ['mondomaine.fr', 'autredomaine.fr']

export function middleware(req: NextRequest) {
  const host = req.headers.get('host')?.split(':')[0] ?? ''
  const root = ROOT_DOMAINS.find(d => host === d || host.endsWith('.' + d))
  if (!root) return NextResponse.next()

  const sub = host === root ? '' : host.slice(0, -(root.length + 1))

  if (RESERVED.has(sub) || sub === '') return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = `/site/${root}/${sub}${url.pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
}
```

Le détail à ne pas rater : **le lookup en base doit se faire sur le couple
`(sous-domaine, domaine racine)`**, jamais sur le seul sous-domaine.
`presta1.mondomaine.fr` et `presta1.autredomaine.fr` peuvent être deux entités
distinctes — un cas très réel en white-label multi-domaines.

---

## Modéliser le mini-site proprement

Le mini-site n'est pas une brique technique à réinventer : c'est une **composition de
widgets existants** (liste d'activités, page détail + tunnel de réservation,
calendrier) sous une enveloppe — un sous-domaine et un thème.

D'où une décision de produit avant d'écrire la moindre ligne : **où le placer dans
l'UI ?** Surtout pas dans la section « widgets unitaires » (qui sert à embarquer des
modules sur un site tiers). Le mini-site est un objet de niveau supérieur, un **canal
de distribution** à part entière. Il mérite sa propre entrée de navigation.

Côté données, un seul nouvel objet, `Storefront` :

- `subdomain` + `rootDomain` (le couple unique)
- `status` (draft / published)
- `theme` : `primaryColor`, `secondaryColor` — un simple JSON, sans sur-structurer
- par défaut, **toutes les activités actives** du prestataire (le filtrage manuel
  viendra plus tard si le besoin se confirme)

Le theming passe par des **CSS variables** (`--color-primary`, `--color-secondary`)
injectées sur le layout. Avantage décisif : le mini-site ET les widgets embarqués
partagent le même système de thème — une seule source de vérité.

Le point à ne pas bâcler, c'est la **validation du sous-domaine** : unicité contrainte
sur le couple `(subdomain, rootDomain)`, slug normalisé (`[a-z0-9-]`, lowercase), et
refus de la liste réservée. Sans ça, collisions garanties avec `app`, `www` et
compagnie.

---

## Les domaines personnalisés (custom domains)

Passer du sous-domaine sur son propre apex au **domaine custom du client** est la
fonctionnalité classique des SaaS — Vercel, Shopify, Webflow fonctionnent tous de la
même manière. Deux défis : router une requête vers le bon tenant, et émettre un
certificat TLS pour un domaine qu'on ne contrôle pas.

**Ce que le client configure**, selon le cas :

- **Sous-domaine** (`resa.client.fr`) : un simple `CNAME` vers une cible chez nous.
  C'est le cas propre, à recommander.
- **Apex / domaine nu** (`client.fr`) : pas de CNAME possible sur un apex (RFC). Il
  faut un enregistrement `A` vers l'IP du serveur (plus fragile : si l'IP change, tout
  casse), ou un CNAME flattening / ALIAS si le DNS du client le supporte.

**La vérification de propriété** vient avant toute émission de certificat : on prouve
que le client contrôle bien le domaine via un **enregistrement TXT**
(`_verify.client.fr = <token>`), résolu côté serveur avant activation.

**Le routing applicatif**, lui, n'a rien de neuf : on ajoute une colonne
`customDomain` (+ `customDomainStatus`) au `Storefront`. Le middleware tranche : domaine
custom connu → tenant, sinon logique wildcard existante.

Enfin, **réserver la fonctionnalité au tier payant** : la colonne `customDomain` ne
s'active que si l'abonnement est sur le bon plan, et se désactive proprement en cas de
downgrade.

---

## Le SSL : la vraie difficulté

C'est ici que tout se joue. Deux types de challenges Let's Encrypt cohabitent, et
c'est **voulu** :

- **Mes domaines** (`*.mondomaine.fr`) → **DNS challenge**. Un certificat wildcard ne
  peut PAS être émis via HTTP challenge : Let's Encrypt ne peut pas vérifier un fichier
  sur un sous-domaine qui n'existe pas encore.
- **Les domaines custom des clients** (`resa.client.fr`) → **HTTP challenge**. Le
  domaine est connu au moment de la demande (le client le fournit), donc pas besoin de
  wildcard — et on n'a de toute façon pas accès à son DNS.

Les deux resolvers vivent dans le même Traefik, chacun avec son propre fichier de
stockage ACME.

### Configurer le DNS challenge dans Coolify (provider OVH)

**Étape 1 — Token API DNS OVH.** Créer un token avec droits d'écriture sur
`/domain/zone/*`. Lego (la lib ACME de Traefik) supporte OVH nativement via les
variables `OVH_ENDPOINT`, `OVH_APPLICATION_KEY`, `OVH_APPLICATION_SECRET`,
`OVH_CONSUMER_KEY`.

**Étape 2 — Ajouter le resolver DNS** dans la config du proxy (Servers → serveur →
Proxy), en gardant le resolver HTTP existant :

```yaml
environment:
  - OVH_ENDPOINT=ovh-eu
  - OVH_APPLICATION_KEY=xxx
  - OVH_APPLICATION_SECRET=xxx
  - OVH_CONSUMER_KEY=xxx

command:
  - '--certificatesresolvers.letsencrypt-dns.acme.dnschallenge=true'
  - '--certificatesresolvers.letsencrypt-dns.acme.dnschallenge.provider=ovh'
  - '--certificatesresolvers.letsencrypt-dns.acme.dnschallenge.resolvers=1.1.1.1:53,8.8.8.8:53'
  - '--certificatesresolvers.letsencrypt-dns.acme.email=contact@mondomaine.fr'
  - '--certificatesresolvers.letsencrypt-dns.acme.storage=/traefik/acme-dns.json'
```

Préciser des `resolvers` DNS publics (ici Cloudflare et Google) évite que Lego
interroge un resolver local incapable de voir la propagation du TXT.

**Étape 3 — Le certificat wildcard** sur le routeur du dashboard Traefik. Un bloc
`domains[n]` par apex — souvenez-vous, un wildcard ne couvre qu'un niveau, et
`*.mondomaine.fr` ne couvre même pas `mondomaine.fr` :

```yaml
  - traefik.http.routers.traefik.tls.certresolver=letsencrypt-dns
  - traefik.http.routers.traefik.tls.domains[0].main=mondomaine.fr
  - traefik.http.routers.traefik.tls.domains[0].sans=*.mondomaine.fr
```

**Étape 4 — Les domaines custom via le file provider.** Coolify active par défaut les
dynamic configurations : on dépose un fichier `.yml` par domaine client, Traefik le
détecte à chaud et déclenche le HTTP challenge.

```yaml
# /data/coolify/proxy/dynamic/client.yml
http:
  routers:
    client:
      rule: "Host(`resa.client.fr`)"
      entryPoints:
        - https
      service: <service-app>
      tls:
        certresolver: letsencrypt   # resolver HTTP par défaut
```

### Le piège majeur : deux resolvers distincts, pas un seul avec deux challenges

Mélanger HTTP et DNS dans un **même** resolver provoque des comportements erratiques et
des échecs d'émission répétés. La bonne pratique tient en une phrase : **deux resolvers
nommés distincts, chacun avec un seul type de challenge.**

---

## Le débogage en conditions réelles

C'est là que la théorie rencontre la production. Voici les problèmes rencontrés, dans
l'ordre où ils sont tombés.

### La boîte à outils de diagnostic SSL

```bash
# 1. Logs ACME de Traefik (réflexe n°1)
docker logs coolify-proxy --tail 200 -f 2>&1 | grep -i acme

# 2. Quel certificat est réellement servi ?
echo | openssl s_client -connect sousdomaine.mondomaine.fr:443 \
  -servername sousdomaine.mondomaine.fr 2>/dev/null \
  | openssl x509 -noout -issuer -subject -dates

# 3. Contenu du fichier ACME
docker exec coolify-proxy cat /traefik/acme-dns.json | grep -i -A2 '"main"'

# 4. Variables OVH bien injectées ?
docker exec coolify-proxy env | grep OVH
```

L'issuer servi raconte déjà toute l'histoire :

- `TRAEFIK DEFAULT CERT` → aucun cert valide émis, Traefik sert son fallback
  auto-signé.
- `Let's Encrypt` mais SAN qui ne matche pas → mauvais resolver appliqué.
- `(STAGING) Let's Encrypt` → flag `caserver` staging oublié.

### Problème n°1 : Traefik refuse de démarrer

```
ERR Command error error="command traefik error: unable to initialize
certificates resolver \"letsencrypt\", as all ACME resolvers must use
the same email"
```

**Cause** : Traefik impose que **tous les resolvers ACME partagent le même email**. Le
resolver HTTP par défaut (`letsencrypt`) n'avait aucune ligne `.acme.email`, alors que
le nouveau `letsencrypt-dns` en avait une.

Le diagnostic se fait en une commande :

```bash
docker inspect coolify-proxy | grep -i 'certificatesresolvers'
```

Pour `letsencrypt`, on voyait bien `httpchallenge`, `httpchallenge.entrypoint`,
`storage`… mais **pas d'email**. La correction : ajouter la ligne manquante, identique
à l'autre resolver.

```yaml
  - '--certificatesresolvers.letsencrypt.acme.email=contact@mondomaine.fr'
```

À noter : Coolify gère normalement cet email via son UI. S'il est absent du `command:`,
c'est que le champ email est vide côté Coolify — il faut le renseigner dans les
settings pour que la valeur survive aux régénérations de config.

### Problème n°2 : `DNS_PROBE_FINISHED_NXDOMAIN`

Après le redémarrage de Traefik, le navigateur affichait `DNS_PROBE_FINISHED_NXDOMAIN`.
Réflexe à avoir : **ce n'est pas une erreur de certificat**, c'est une erreur de
résolution DNS pure. Le domaine ne pointe vers aucune IP — on n'atteint même pas
Traefik.

Une résolution DNS ciblée (ici sur `service.qualif.mondomaine-test.fr`) a tout
expliqué :

| Requête | Résultat |
|---|---|
| `service.qualif.mondomaine-test.fr` | **NXDOMAIN** |
| `autre.qualif.mondomaine-test.fr` | **NXDOMAIN** |
| `qualif.mondomaine-test.fr` | ✅ pointe vers l'IP serveur |
| NS du domaine | ✅ bien délégué chez OVH |

**Cause** : il existait un enregistrement pour `qualif.mondomaine-test.fr`, mais
**aucun wildcard sur le niveau `qualif`**. Et la règle fondamentale du tout début
ressurgit : **un `*` DNS ne couvre qu'un seul niveau.** Un `*.mondomaine-test.fr` ne
couvre PAS `service.qualif.mondomaine-test.fr`, deux niveaux plus bas.

La correction côté OVH — ajouter un wildcard au bon niveau :

```
*.qualif   IN   A   <IP_serveur>
```

Et la conséquence directe sur le SSL : un certificat wildcard
`*.qualif.mondomaine-test.fr` est distinct de `*.mondomaine-test.fr`. Il faut donc un
bloc Traefik dédié :

```yaml
  - traefik.http.routers.traefik.tls.domains[0].main=qualif.mondomaine-test.fr
  - traefik.http.routers.traefik.tls.domains[0].sans=*.qualif.mondomaine-test.fr
```

L'ordre des opérations est non négociable : créer le wildcard DNS **d'abord**, attendre
la propagation, vérifier la résolution, et **ensuite seulement** Traefik peut faire son
DNS challenge.

---

## Les enseignements à retenir

1. **Un wildcard DNS (et un wildcard TLS) ne couvre qu'un seul niveau.** C'est la cause
   racine de la moitié des problèmes rencontrés. Pour un sous-domaine multi-niveaux
   (`service.qualif.domaine`), il faut un wildcard explicite à ce niveau.

2. **Deux types de challenges, deux resolvers distincts.** DNS challenge pour les
   wildcards de ses propres domaines, HTTP challenge pour les domaines custom des
   clients. Jamais les deux dans un même resolver.

3. **Tous les resolvers ACME doivent partager le même email.** Contrainte stricte de
   Traefik, et source d'un refus de démarrage silencieux si on l'ignore.

4. **`NXDOMAIN` n'est jamais un problème de certificat.** C'est du DNS pur — toujours
   commencer le diagnostic par la résolution avant de soupçonner le SSL.

5. **Toujours débuter le débogage par les logs ACME et `openssl s_client`.** À eux
   deux, ils distinguent un problème d'émission (logs) d'un problème d'application du
   certificat (openssl montrant le fallback).

6. **Résoudre le tenant sur le couple `(sous-domaine, domaine racine)`**, jamais sur le
   seul sous-domaine — indispensable en multi-domaines white-label.
