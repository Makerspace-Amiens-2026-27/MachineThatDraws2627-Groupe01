---
layout: default
title: Boîtier
parent: Mécanique
grand_parent: Conception
nav_order: 1
---

# Boîtier

{: .a_modifier }
> Page d'exemple pour **un** sous-ensemble mécanique : dupliquez-la pour chaque
> sous-ensemble et renommez-la.

## Rôle

À quoi sert ce sous-ensemble ? Quelles contraintes du cahier des charges concerne-t-il ?

## Conception

{% include model3d.html src="assets/models/Otto.glb" alt="Modèle 3D du boîtier" %}

Choix de forme, de matériau, d'assemblage (vis, clips, collage…). Montrez les
itérations : ce qui n'a pas marché sur la version 1 et ce que vous avez changé.

## Fabrication

Procédé, réglages, temps de fabrication. Les fichiers sont dans le repo :
[impression 3D]({{ site.gh_edit_repository }}/tree/main/project/mcad/3d-print),
[découpe laser]({{ site.gh_edit_repository }}/tree/main/project/mcad/laser-cutting).
