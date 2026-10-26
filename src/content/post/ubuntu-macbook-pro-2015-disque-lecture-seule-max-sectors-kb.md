---
layout: ../../layouts/post.astro
title: "Ubuntu sur un MacBook Pro 2015 : le disque qui passait en lecture seule à cause d'écritures de 4 Mo"
description: "Diagnostic pas à pas d'un emergency_ro causé par un host bus error du contrôleur SATA, les fausses pistes NCQ, et le contournement qui a marché : limiter max_sectors_kb."
dateFormatted: Oct 26th, 2026
draft: false
---

Tout a commencé par un message banal : `Read-only file system` en essayant
d'écrire un fichier dans mon dossier personnel. Peu après, Firefox (en snap)
refusait de démarrer. La machine : un MacBook Pro mi-2015 avec son SSD Apple
d'origine (`APPLE SSD SM0128G`, SATA, 128 Go), sous Ubuntu 26.04 et un
noyau 7.0.0-38.

Un disque qui passe tout seul en lecture seule, ça ressemble à une panne
matérielle. Ici ce n'était pas si simple. Cet article reprend le diagnostic
dans l'ordre, avec la fausse piste classique sur ce type de Mac, et le réglage
qui a fini par contourner le problème.

---

## Savoir qui est vraiment en lecture seule

Premier réflexe : ne pas se fier à la première sortie de `mount`, noyée sous
les montages snap. On filtre :

```bash
# Montages en lecture seule, sans les snaps ni les tmpfs
findmnt -O ro | grep -vE 'squashfs|tmpfs'

# État de la racine et de /home
mount | grep -E ' / | /home '
```

Quelques montages `ro` sont parfaitement normaux. Les `squashfs` des snaps et
les `tmpfs` de credentials de systemd le sont toujours. Au démarrage, `/` est
aussi monté en `ro` avant d'être remonté en `rw` par `systemd-remount-fs`.

Au moment du bug, la racine affichait ceci :

```
/dev/sda2 on / type ext4 (rw,relatime,emergency_ro)
```

C'est l'option **`emergency_ro`** qui compte. `mount` dit `rw`, mais le noyau
a bloqué toutes les écritures après une erreur grave. Ce n'est donc pas un
problème de configuration : il faut aller voir ce que le noyau a vu.

## Lire le journal noyau : la première erreur est la cause

```bash
sudo dmesg -T | grep -iE 'EXT4-fs|I/O error|ata1|blk_update|Buffer I/O|aborted|reset' | head -40
```

Deux détails. `sudo` est nécessaire, sinon `dmesg` répond « Opération non
permise ». Et on prend `head`, pas `tail` : les dernières lignes ne sont que
des conséquences en cascade, la cause est au début.

Ce qui en ressortait :

```
ata1.00: exception Emask 0x20 ... frozen
ata1.00: irq_stat 0x20000000, host bus error
ata1.00: failed command: WRITE FPDMA QUEUED
```

Comment le lire :

- **`host bus error` avec `SErr 0x0`** : c'est le contrôleur AHCI qui signale
  une erreur de DMA. Ce n'est ni une erreur de lien SATA, ni un secteur
  défectueux.
- Le port est gelé (`frozen`), les écritures échouent, et ext4 se protège en
  passant en `emergency_ro`.
- Un détail qui servira plus tard : toutes les commandes en échec
  transféraient **4 194 304 octets**, soit 4 Mo d'un coup.

## Écarter la panne matérielle évidente

Avant d'aller plus loin, on vérifie l'état du SSD avec SMART :

```bash
sudo apt install -y smartmontools
sudo smartctl -a /dev/sda | grep -iE 'overall|Reallocated|Pending|CRC'
```

Résultat : `PASSED`, `Current_Pending_Sector` à 0, `UDMA_CRC_Error_Count`
à 0, mais `Reallocated_Sector_Ct` à 22. Le SSD n'est pas mort, mais il a déjà
réalloué des secteurs. Il est à surveiller.

## La fausse piste : NCQ et gestion d'énergie

Sur ces Mac, le réflexe classique est de désactiver NCQ et la gestion
d'énergie du lien SATA. Ça se fait dans `/etc/default/grub` :

```
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash libata.force=noncq ahci.mobile_lpm_policy=0"
```

```bash
sudo update-grub
# Après redémarrage, vérifier que les paramètres sont bien actifs
cat /proc/cmdline
```

Verdict : **ça n'a rien résolu.** Les commandes en échec sont passées de
`WRITE FPDMA QUEUED` (la variante NCQ) à `WRITE DMA EXT`, mais l'erreur était
strictement la même. NCQ n'était pas en cause.

## Le vrai déclencheur : la taille des écritures

Ce qui ne changeait jamais, c'était la taille : 4 Mo par commande en échec.
L'idée suivante a donc été de limiter la taille maximale d'une requête envoyée
au disque :

```bash
# Valeur actuelle
cat /sys/block/sda/queue/max_sectors_kb

# Limiter à 128 Ko par requête
echo 128 | sudo tee /sys/block/sda/queue/max_sectors_kb
```

Puis un vrai test d'écriture, synchrone, en contournant le cache :

```bash
# 1 Go écrit en direct, avec fsync à la fin
dd if=/dev/zero of=~/ddtest bs=1M count=1000 oflag=direct conv=fsync status=progress; rm -f ~/ddtest

# Nouvelles erreurs ata1 depuis le test ?
sudo dmesg -T | grep -E 'ata1.00: (exception|failed)' | tail -3
```

Un piège au passage : un premier test affichait **3 Go/s**. C'est impossible
sur un SSD SATA, plafonné à environ 550 Mo/s. Et effectivement, des erreurs
`ata1` sont apparues juste après. Le test valide a donné un débit réaliste,
**546 Mo/s**, sans aucune nouvelle erreur.

> Un débit supérieur au plafond du bus veut dire que le test ne mesure pas ce
> que vous croyez.

Avec `max_sectors_kb=128`, les écritures de 1 Go passent sans erreur. La
limite contourne le bug.

## Rendre le contournement permanent

La valeur écrite dans `/sys` est perdue au redémarrage. Une règle udev la
rétablit à chaque détection du disque :

```bash
echo 'ACTION=="add|change", SUBSYSTEM=="block", KERNEL=="sda", ATTR{queue/max_sectors_kb}="128"' | sudo tee /etc/udev/rules.d/60-sda-maxsectors.rules
sudo udevadm control --reload && sudo udevadm trigger --subsystem-match=block
```

Après le redémarrage suivant, vérifiez que
`cat /sys/block/sda/queue/max_sectors_kb` renvoie bien `128` **avant** toute
grosse écriture : mise à jour du noyau, installation de snaps, etc. C'est
exactement le genre d'opération qui déclenche le bug.

## Réparer les dégâts

Un plantage en pleine écriture peut laisser le système de fichiers incohérent.
Le `clean` affiché au démarrage par `systemd-fsck-root` ne prouve rien : ce
n'est qu'un contrôle rapide du journal. Pour un vrai contrôle, deux options.

Forcer un `fsck` au prochain démarrage, en ajoutant dans GRUB (touche `e`, à
la fin de la ligne `linux`) :

```
fsck.mode=force fsck.repair=yes
```

Ou lancer le contrôle depuis un live USB :

```bash
sudo fsck.ext4 -f /dev/sda2
```

Ne lancez jamais `fsck` sur une partition montée. `e2fsck` refuse de toute
façon, et il a raison.

Côté Firefox, le symptôme était `desktop-launch not found: ensure slot is
connected`, lié au snap `gnome-46-2404`. Un `snap connect` ou une
réinstallation du snap règle en général ce genre de problème. Ici, c'était
marginal : Firefox est reparti sans autre intervention.

## Ce que je retiens

1. **`emergency_ro` dans `mount`** signale une vraie erreur noyau, pas un
   réglage. C'est `dmesg` qu'il faut lire, pas `fstab`.
2. **Dans `dmesg`, cherchez la première erreur**, et notez la taille des
   commandes en échec. C'est ce détail qui a débloqué le diagnostic.
3. **Un SMART « PASSED » n'exclut rien** côté contrôleur ou pilote.
4. **`max_sectors_kb=128` est un contournement**, pas une explication. La
   cause reste ouverte : contrôleur AHCI, noyau 7.0 sur du matériel de 2015,
   ou SSD vieillissant.
5. **Surveillez `Reallocated_Sector_Ct`** (22 au départ) et faites des
   sauvegardes. Si le bug revient, testez un noyau plus ancien (GRUB,
   « Options avancées ») ou remplacez le SSD.
