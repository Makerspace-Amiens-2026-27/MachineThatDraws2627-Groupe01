---
layout: default
title: Firmware
parent: Conception
nav_order: 3
---

# Firmware

{: .a_supprimer }
> Le **firmware** est le code qui tourne sur la carte électronique (Arduino, ESP32,
> Raspberry Pi Pico…) : il lit les capteurs, pilote les actionneurs, gère les
> communications. Supprimez cette page si votre projet n'en a pas.
> Si le code est conséquent, faites une sous-page par fonction (par exemple
> « Asservissement moteur », « Communication Bluetooth »).
> Voir [Documenter son code et son firmware](https://doc.makerspace-amiens.fr/workshops/methodologie-de-projet/tutorials/documenter-code-firmware/).

## Architecture du code

{: .a_modifier }
> Fonctionnement général : boucle principale, machine à états, interruptions.
> Un schéma (diagramme d'états, organigramme) aide beaucoup.

## Environnement

{: .a_modifier }
> Carte cible, framework (Arduino, ESP-IDF…), bibliothèques principales et leur rôle.
> Le projet se développe avec VSCode et PlatformIO : la procédure pour compiler
> et téléverser est dans le README du dossier firmware.

[📁 Code du firmware]({{ site.gh_edit_repository }}/tree/main/project/firmware){: .btn }
