---
layout: default
title: Carte principale
parent: Électronique
grand_parent: Conception
nav_order: 1
---

# Carte principale

{: .a_modifier }
> Page d'exemple pour **une** carte électronique : dupliquez-la pour chaque carte
> ou module et renommez-la.

## Rôle

Que fait cette carte ? À quoi est-elle reliée ?

## Schéma

{% include kicad.html src="assets/kicad/Otto-ESP32-XIAO-REFEREE.kicad_sch" %}

## PCB

{% include kicad.html src="assets/kicad/Otto-ESP32-XIAO-REFEREE.kicad_pcb" %}

{: .a_modifier }
> Exemple : la carte du robot Otto du MakerSpace. Copiez vos fichiers `.kicad_sch`
> et `.kicad_pcb` dans `docs/assets/kicad/`, remplacez les noms de fichiers
> ci-dessus et supprimez les fichiers `Otto-ESP32-XIAO-REFEREE`. Pensez à recopier les fichiers
> quand la carte évolue : les originaux restent dans `project/ecad/`.

## Nomenclature

| Référence | Composant | Valeur / réf. exacte | Quantité | Source |
|---|---|---|---|---|
| U1 | Microcontrôleur | ESP32-S3-DevKitC-1 | 1 | … |
| R1-R4 | Résistance | 10 kΩ, 1/4 W | 4 | … |
