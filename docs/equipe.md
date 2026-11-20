---
layout: default
nav_order: 3
title: Équipe et rôles
---

# Équipe et rôles

## Membres

| Membre | Formation | Compte GitHub |
|---|---|---|
| Timothé LEJOSNE | 2e année pré-ingénieur — UniLaSalle Amiens | [@timothe-lejosne](https://github.com/timothe-lejosne) |
| Nathan BARONICK | 2e année pré-ingénieur — UniLaSalle Amiens | [@Nayhyx](https://github.com/Nayhyx) |
| Archibald ROZIE | 2e année pré-ingénieur — UniLaSalle Amiens | [@pseudo](https://github.com/pseudo) |
| Lylian COELHO | 2e année pré-ingénieur — UniLaSalle Amiens | [@lylianoman](https://github.com/lylianoman) |
| Romain MAGNIER | 2e année pré-ingénieur — UniLaSalle Amiens | [@pseudo](https://github.com/pseudo) |

## Rôles

La répartition suit directement le découpage de notre [Cahier des Charges Fonctionnel](etudes.html#cahier-des-charges-fonctionnel-cdcf). Chaque sous-ensemble dispose d'un responsable (qui pilote l'avancement et valide les choix techniques) et d'un backup (qui prend le relais en cas d'absence ou de surcharge).

| Rôle / Sous-ensemble | Responsable | Backup | Ce qu'il couvre |
|---|---|---|---|
| **Déplacement planaire X/Y** (`F1.1.1` à `F1.1.4`) | Lylian COELHO | Romain MAGNIER | CAO OnShape du portique mobile, chariots latéraux, supports moteurs NEMA 17, guidages lisses/PTFE sans arc-boutement et tension des courroies GT2 |
| **Effecteur & Axe Z** (`F1.2.1` à `F1.2.3`) | Timothé LEJOSNE | Nathan BARONICK | CAO OnShape du chariot central, système de levée par gravité + support servomoteur Fitec, maintien des stylos (`8 à 12 mm`) et accroche de la courroie X |
| **Structure porteuse, maintien papier & sécurité mécanique** (`F1.3.1` à `F1.3.3`, `F4.1.1` à `F4.1.2`) | Romain MAGNIER | Lylian COELHO | Châssis fixe et stabilité sur table, système d'immobilisation rapide de la feuille (`< 15 s`), encombrement/masse, intégration finale et ergonomie |
| **Énergie, électronique, firmware GRBL & sécurité** (`F2.1.1` à `F2.3.3`) | Archibald ROZIE | Romain MAGNIER | Alimentation 12 V, câblage Arduino Uno + CNC Shield V3, réglage `Vref` des drivers, flash et config de GRBL-servo, arrêt d'urgence (`< 1 s`) et fins de course (S2) |
| **Chaîne logicielle & IHM Web** (`F3.1.1` à `F3.3.3`) | Nathan BARONICK | Archibald ROZIE | Tests initiaux (Inkscape / GRBL-Plotter), puis développement du site web maison : import/vectorisation (`ImageTracerJS`), conversion SVG → G-code, prévisualisation et envoi via `Web Serial API` |
| **Coordination & planning** (`F4.2.1` à `F4.2.3`) | Romain MAGNIER | Timothé LEJOSNE | Suivi des jalons (POC S1 / Journée des Projets S2), gestion des fabrications au MakerSpace et animation des points d'équipe |
| **Coordination documentation & GitHub** (`F4.2.4`) | Timothé LEJOSNE | Lylian COELHO | Cohérence du dépôt et du site GitHub Pages, traçabilité CdCF/études, suivi des journaux de bord et relecture croisée |

### Responsables d'interfaces critiques

| Interface (entre sous-ensembles) | Responsable | Points de vigilance (liés au CdCF) |
|---|---|---|
| **Axes X/Y ↔ Effecteur Z** (`1.1 ↔ 1.2`) | Timothé LEJOSNE | Entraxe exact des arbres de l'axe X, tolérances des logements PTFE (`12,2 mm`) et passage de la courroie GT2 (`F1.1.2`) |
| **Axes X/Y ↔ Structure porteuse** (`1.1 ↔ 1.3`) | Lylian COELHO | Fixation des arbres Y sur le bâti et respect de l'orthogonalité `90° ± 0,5°` (`F1.1.3`, `F1.3.1`) |
| **Électronique ↔ Mécanique** (`2.x ↔ 1.x`) | Archibald ROZIE | Implantation physique des fins de course (`F2.3.2`), accessibilité de l'arrêt d'urgence (`F2.3.3`) et guidage des câbles hors zone mobile (`F4.1.1`) |
| **IHM Web ↔ Firmware GRBL** (`3.x ↔ 2.2`) | Nathan BARONICK | Compatibilité du flux G-code via `Web Serial API`, gestion des buffers série (`F2.2.1`, `F3.3.2`) et commandes PWM de levée/baisse du servo (`F1.2.1`) |

## Fonctionnement

* **Réunions :** Un point rapide de 10 minutes en début de chaque séance au MakerSpace pour synchroniser l'avancement et lever les blocages, complété par un bilan en fin de séance pour fixer les objectifs suivants.
* **Communication :** Échanges rapides sur notre groupe de messagerie pour la coordination entre les séances, et utilisation de GitHub pour centraliser la documentation, le code et les décisions techniques.
* **Prise de décision :** Recherche du consensus lors des points d'équipe. En cas de désaccord technique, le responsable du sous-ensemble concerné tranche en s'appuyant sur les critères du CdCF ; si le choix impacte une interface entre plusieurs sous-ensembles, la décision est prise par vote à la majorité ou arbitrée avec l'encadrant du MakerSpace.

### Suivi des tâches

L'avancement des sous-ensembles et le suivi des jalons S1/S2 sont pilotés via les **Issues** et le tableau **GitHub Projects** du dépôt.

[📋 Tableau de suivi du projet]({{ site.gh_edit_repository }}/projects){: .btn }