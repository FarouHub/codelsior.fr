---
layout: ../../layouts/post.astro
title: "Durcir un serveur Debian sous Docker, Traefik et Coolify"
description: "Mises à jour, SSH par clé, firewall face à Docker qui contourne UFW, hardening du daemon, et la vraie question : votre base de données est-elle exposée sur internet ? Retour sur une session de durcissement, corrections de terrain incluses."
dateFormatted: Aug 1st, 2026
draft: true
---

Un serveur qui tourne bien n'est pas un serveur sécurisé. Le mien fonctionnait :
Debian, Docker en mode Swarm, Traefik en reverse proxy pour tout le trafic 80/443,
PostgreSQL géré par Coolify. Rien ne cassait. Mais je n'aurais pas su répondre à
une question simple : qu'est-ce qui, exactement, est joignable depuis internet ?

Cet article retrace une session de durcissement complète, avec ses recommandations
génériques — et surtout le moment où un simple `docker ps` a montré que la réalité
du serveur était différente de ce que je croyais. C'est souvent là que ces exercices
deviennent intéressants.

---

## Le socle : mises à jour et maintenance

Le point de départ le moins glamour, et le plus rentable. Une remise à niveau
manuelle d'abord :

```bash
apt update && apt full-upgrade -y
apt autoremove --purge -y
reboot
```

Puis l'automatisation des correctifs de sécurité avec `unattended-upgrades`.

Une décision mérite réflexion : `Automatic-Reboot`. En production, je le laisse à
`false`. Un redémarrage automatique à 3 h du matin sur un serveur qui porte du
trafic client, c'est troquer un risque de sécurité contre un risque de
disponibilité. Je préfère lire le changelog et redémarrer quand je regarde. Sur les
serveurs moins critiques — préproduction, outils internes — l'activer fait gagner du
temps sans conséquence.

## SSH : clé uniquement, et un détail qui coûte cher

La partie connue. On pousse sa clé publique :

```bash
ssh-copy-id -p <port> utilisateur@serveur
```

Puis on durcit `/etc/ssh/sshd_config` :

```
PermitRootLogin no
PasswordAuthentication no
Port <port-non-standard>
MaxAuthTries 3
LoginGraceTime 30
ClientAliveInterval 300
AllowUsers <compte-autorise>
```

Deux points que j'aurais pu rater.

**`AllowTcpForwarding` doit rester actif.** Beaucoup de guides de durcissement
recommandent de le passer à `no`. Sauf que le tunnel SSH est précisément ce qui va
permettre d'administrer la base de données sans l'exposer. Le désactiver casse
DBeaver et pousse à rouvrir un port — l'inverse de l'effet recherché. La valeur
`local` suffit si on veut limiter la portée.

**Toujours tester dans un second terminal.** On garde la session en cours ouverte,
on ouvre une deuxième connexion, on vérifie qu'elle passe. Un `PermitRootLogin no`
sur un serveur où root est le seul compte, et on est dehors. Cette règle a l'air
évidente jusqu'au jour où on ferme le terminal par réflexe.

## Le firewall, ou pourquoi UFW ne protège pas ce que vous croyez

C'est le point le plus contre-intuitif de tout l'exercice.

**Docker écrit directement dans `iptables` et court-circuite UFW.** Un port publié
avec `-p` dans un `docker-compose.yml` reste joignable depuis internet même si votre
firewall affiche fièrement une règle qui devrait le bloquer. Les règles de Docker
sont évaluées avant celles d'UFW. Vous croyez avoir un mur ; vous avez un mur avec
une porte que Docker a percée derrière votre dos.

Deux façons de s'en sortir.

**Approche 1 — reprendre la main.** On coupe la gestion iptables de Docker avec
`"iptables": false` dans `/etc/docker/daemon.json`, et on écrit toutes les règles à
la main en nftables. Plus robuste, mais on récupère aussi la charge : NAT, routage
inter-containers, résolution DNS interne. C'est un vrai projet, pas une case à cocher.

**Approche 2 — s'appuyer sur l'architecture.** Retenue ici. Docker garde sa gestion
du NAT, et on tire parti du fait que Traefik est le seul point d'entrée du trafic
web. nftables ne s'occupe alors que de la chain `input` : SSH, ICMP, et les ports
Swarm (`2377/tcp` pour le control plane, `7946` en TCP et UDP pour la découverte,
`4789/udp` pour le réseau overlay). Le reste, c'est-à-dire tout le trafic applicatif,
passe par le NAT de Docker vers Traefik.

Cette approche ne vaut que si l'hypothèse tient. D'où la vérification qui suit.

### La commande qui répond à la vraie question

```bash
docker ps --format "table {{.Names}}\t{{.Ports}}" | grep "0.0.0.0"
```

Elle liste les containers dont un port est publié sur toutes les interfaces,
c'est-à-dire ouverts sur internet. **Si une base de données apparaît dans cette
liste, elle est exposée.** Pas « potentiellement exposée » : accessible depuis
n'importe quelle IP de la planète, et les scanners la trouveront en quelques heures.

C'est la première chose à lancer sur n'importe quel serveur Docker dont on hérite.

## Hardening du daemon Docker

Le fichier `/etc/docker/daemon.json` :

```json
{
  "no-new-privileges": true,
  "icc": false,
  "live-restore": true,
  "userland-proxy": false,
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "3" }
}
```

- `no-new-privileges` bloque l'escalade de privilèges à l'intérieur des containers.
- `icc: false` coupe la communication inter-container. Attention à la portée : cette
  option ne concerne que le bridge par défaut. Les réseaux définis par l'utilisateur
  — donc ceux que crée Coolify — ne sont pas affectés. C'est utile, mais ce n'est pas
  l'isolation totale que le nom laisse croire.
- `live-restore` permet aux containers de survivre à un redémarrage du daemon.
- Les `log-opts` évitent qu'un container bavard remplisse le disque. Un incident
  bête, mais un incident quand même.

Côté `docker-compose.yml`, service par service :

```yaml
services:
  app:
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE   # uniquement ce dont le service a besoin
    read_only: true         # quand le service le supporte
```

Le principe : tout retirer, puis rajouter au cas par cas ce qui est nécessaire.
L'inverse — retirer ce qui semble dangereux — laisse toujours des trous.

## Adminer, phpMyAdmin et les interfaces d'admin exposées

La recommandation générique est directe : ces containers ne doivent pas être
joignables depuis internet. Une interface web d'administration de base de données
exposée publiquement, c'est une porte d'entrée qui n'attend que la bonne CVE ou le
bon mot de passe.

On les retire, et on s'assure que la base n'écoute que sur la loopback :

```yaml
ports:
  - "127.0.0.1:5432:5432"   # et non "5432:5432"
```

L'administration passe alors par un tunnel SSH et un client local comme DBeaver.

Sauf que dans mon cas, cette recommandation n'était pas la bonne.

## Le moment où le terrain corrige la théorie

En inspectant le container PostgreSQL géré par Coolify, la colonne `PORTS`
affichait :

```
5432/tcp
```

Et rien d'autre. Pas de `0.0.0.0:5432->5432/tcp`, pas de mapping du tout.

**Coolify ne publie pas le port sur le host.** La base n'est joignable que depuis le
réseau Docker interne. Aucun socket n'est ouvert sur la machine, ni sur une interface
publique, ni sur la loopback. C'est plus strict que le `127.0.0.1:5432:5432` que je
m'apprêtais à appliquer — appliquer la recommandation générique aurait *dégradé* la
posture de sécurité.

Ce qui amène à la clarification la plus utile de toute la session.

## Les trois niveaux d'exposition d'un port Docker

La question qui a débloqué ma compréhension : si l'accès au réseau Docker interne
suffit pour DBeaver, pourquoi recommander `127.0.0.1:5432:5432` ?

Parce que ce conseil s'adresse à une situation différente. Il vise le cas où le port
est **déjà** publié sur le host — typiquement un `docker-compose.yml` écrit à la main
où `"5432:5432"` bind sur `0.0.0.0` par défaut. Là, restreindre à `127.0.0.1` est le
correctif minimal et immédiat. Ce n'est pas l'optimum, c'est le premier pas.

| Configuration | Écoute sur le host ? | Depuis internet | Via tunnel SSH + DBeaver |
|---|---|---|---|
| `0.0.0.0:5432:5432` | Oui, toutes interfaces | **Oui — dangereux** | Oui |
| `127.0.0.1:5432:5432` | Oui, loopback seulement | Non | Oui, sur `localhost:5432` |
| Pas de publish (Coolify) | Non, aucun socket host | Non | Oui, via l'IP interne Docker |

Pour se connecter dans le troisième cas : tunnel SSH vers le serveur, puis connexion
à l'IP interne du container, que l'on récupère avec :

```bash
docker inspect <container> --format '{{json .NetworkSettings.Networks}}'
```

Le host fait office de routeur vers le réseau Docker, et la connexion passe.

### Le compromis à assumer

L'absence de publish est plus sûre, mais l'IP interne Docker n'est pas stable : elle
change quand le container est recréé, donc à chaque redéploiement Coolify. Il faut la
retrouver à chaque fois.

Deux options, selon ce qu'on privilégie :

- **Option A** — ne rien changer, garder le comportement par défaut de Coolify, et
  relancer un `docker inspect` après un redéploiement. C'est celle que j'ai retenue :
  la friction est réelle mais faible, et elle ne se paie qu'au moment où on
  administre la base à la main, c'est-à-dire rarement.
- **Option B** — forcer un publish sur `127.0.0.1:5432:5432` pour obtenir une adresse
  stable, au prix d'un socket supplémentaire sur le host. Défendable si on ouvre
  DBeaver tous les jours.

## Points spécifiques à Coolify

Coolify simplifie beaucoup de choses, ce qui veut dire qu'il prend aussi des
décisions à votre place. Quelques vérifications :

- **Désactiver l'Adminer intégré** depuis le dashboard, s'il est activé.
- **Vérifier l'exposition publique de la base** dans les paramètres. Si Coolify
  publie un port, le couper ou le restreindre à la loopback.
- **Si l'option n'existe pas dans l'UI**, passer par la chain `DOCKER-USER`
  d'iptables. C'est le point d'entrée que Docker évalue avant ses propres règles et
  qu'il ne réécrit pas — on peut y bloquer l'accès externe à un port précis sans
  casser la gestion interne de Docker.
- **Ne jamais exposer Coolify sur son port brut** (`8000`). Seulement via son domaine,
  derrière Traefik et HTTPS. Avec la 2FA activée sur le compte, et si l'IP source est
  prévisible, une restriction par middleware Traefik. Attention à la version :
  le middleware s'appelle `ipWhiteList` en Traefik v2 et `ipAllowList` en v3.

L'interface d'administration qui pilote tous vos déploiements mérite au moins autant
d'attention que les applications qu'elle déploie.

## Le reste du durcissement

Les chantiers qui n'ont pas de rapport direct avec la base mais complètent le tableau :

- **Fail2ban** contre les scans SSH et HTTP, avec une jail dédiée aux tentatives
  d'authentification sur Traefik.
- **auditd** pour tracer les accès à `sshd_config`, `sudoers` et au dossier `.ssh` de
  root. On ne détecte que ce qu'on observe.
- **sysctl** : protection SYN flood, désactivation des redirections IP, restriction de
  `ptrace`, masquage des informations kernel (`kptr_restrict`, `dmesg_restrict`).
- **Secrets** : auditer les variables d'environnement des containers, et préférer les
  secrets Docker/Swarm aux fichiers `.env` en clair.
- **Scan d'images** avec un outil type Trivy, pour ne pas déployer une CVE connue.
- **Services systemd inutiles** désactivés — moins de surface, moins de mises à jour à
  suivre.
- **Alertes de monitoring** proactives : connexions SSH, pics CPU anormaux, processus
  inattendus, modification de fichiers système critiques.

## Par où commencer

Tout faire d'un coup est le meilleur moyen de ne rien faire. L'ordre compte plus que
l'exhaustivité :

| Quand | Action |
|---|---|
| Maintenant | SSH par clé, authentification par mot de passe désactivée |
| Maintenant | Vérifier qu'aucune base n'écoute sur `0.0.0.0` |
| Maintenant | Retirer les Adminer/phpMyAdmin exposés |
| Cette semaine | Fail2ban |
| Cette semaine | nftables configuré autour de Traefik |
| Ce mois | Hardening du daemon Docker et des `docker-compose.yml` |
| Ce mois | sysctl et auditd |
| En continu | Mises à jour automatiques et monitoring |

Les trois premières lignes couvrent l'essentiel du risque réel. Le reste réduit la
surface et améliore la détection, mais ne remplace pas un port de base de données
fermé.

## Ce que je retiens

**Docker rend les firewalls trompeurs.** Une règle UFW qui a l'air correcte ne prouve
rien tant qu'on n'a pas vérifié ce que Docker a publié. Le `docker ps | grep 0.0.0.0`
vaut mieux qu'un `ufw status` rassurant.

**Les recommandations génériques sont des planchers, pas des cibles.** Appliquer
`127.0.0.1:5432:5432` là où Coolify ne publiait rien du tout aurait ouvert un socket
pour rien. Vérifier l'état réel avant d'appliquer un conseil — même un bon conseil.

**Le durcissement se mesure à ce qui est joignable, pas à la longueur de la
checklist.** Un serveur avec vingt options de sysctl bien réglées et un Postgres sur
`0.0.0.0` est moins sûr qu'un serveur nu dont rien ne dépasse.
