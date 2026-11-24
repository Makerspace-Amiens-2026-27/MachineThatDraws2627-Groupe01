---
layout: default
nav_order: 2
title: Objectifs du projet
---

# Objectifs du projet

## Contexte

Ce projet s'inscrit dans le cadre de notre deuxième année de cycle pré-ingénieur à **UniLaSalle Amiens**, au sein du MakerSpace, sur les semestres 1 et 2. Mené par une équipe de cinq étudiants (Nathan Baronick, Timothé Lejosne, Archibald Rozie, Lylian Coelho et Romain Magnier), le projet *Machines That Draws* consiste à concevoir, fabriquer et documenter de A à Z une machine capable de dessiner de manière automatisée.

Le projet suit une démarche d'ingénierie découpée en deux grands jalons :
* **Fin du semestre 1 :** valider un premier prototype fonctionnel (*Proof of Concept*) prouvant que la machine sait tracer proprement une forme simple.
* **Semestre 2 :** fiabiliser et finaliser la machine afin de pouvoir la présenter et la faire fonctionner en direct lors de la **Journée des Projets**.

## Problème et public cible

### Le problème à résoudre
Reproduire fidèlement une image numérique sur papier avec un vrai stylo (un logo, un schéma, un dessin au trait ou un texte) est long et imprécis à la main. À l'inverse, les traceurs du commerce sont coûteux, et les machines faites maison demandent souvent des réglages complexes ou l'installation de plusieurs logiciels avant de pouvoir lancer un simple dessin.

Notre objectif est donc de concevoir une machine automatisée **fiable, abordable et simple d'utilisation**, permettant de passer d'un fichier image sur ordinateur à un tracé propre sur papier, sans avoir besoin de connaissances techniques particulières.

### Le public cible
* **Les visiteurs, enseignants et futurs étudiants** lors des démonstrations (Journée des Projets, journées portes ouvertes d'UniLaSalle), qui doivent pouvoir tester la machine facilement.
* **Les étudiants et utilisateurs du MakerSpace** souhaitant réaliser rapidement des tracés précis sur papier avec différents stylos ou feutres du quotidien.

### Conditions d'utilisation
* **Environnement :** utilisation en intérieur, posée sur une table plane (atelier du MakerSpace, salle de cours ou stand de démonstration), avec accès à une prise secteur standard et à un ordinateur.
* **Prise en main :** un utilisateur novice doit pouvoir importer une image, installer sa feuille de papier et lancer un dessin en quelques minutes, en toute sécurité.
* **Mobilité :** la machine doit rester suffisamment compacte et légère pour être déplacée facilement entre le MakerSpace et les lieux de démonstration.

## Cahier des charges

Ce cahier des charges pose nos besoins par **ensembles** et **sous-ensembles**, sans imposer de solution technique. Chaque fonction part d'un verbe d'action et distingue deux objectifs : le **POC (S1)** et la **machine finale (S2)**.

> **Niveaux de flexibilité :**
> - **F0** : Obligatoire
> - **F1** : Peu négociable
> - **F2** : Négociable / Bonus S2

### Ensemble 0 : Objectif principal

| Code | Fonction | Critères | Niveau attendu (POC S1 → Final S2) | Flex. |
| :--- | :--- | :--- | :--- | :---: |
| **FP1** | **Reproduire** une image numérique sur papier avec un stylo | Rendu visuel<br>Continuité du trait | Forme simple ou logo reconnaissable (S1) → Dessin détaillé ou portrait fidèle (S2) | F0 |

### Ensemble 1 : Mécanique

#### Sous-ensemble 1.1 : Déplacements X et Y

| Code | Fonction | Critères | Niveau attendu | Flex. |
| :--- | :--- | :--- | :--- | :---: |
| **F1.1.1** | **Couvrir** une zone de dessin définie | Surface utile (X × Y) | Min. `[150 × 150 mm]` (S1) → `[A4 : 210 × 297 mm]` (S2) | F1 |
| **F1.1.2** | **Guider** le stylo sans jeu ni blocage | Fluidité<br>Jeu latéral | Aucun blocage sur toute la course<br>Jeu < `[0,5 mm]` | F0 |
| **F1.1.3** | **Positionner** le stylo avec précision sur deux axes perpendiculaires | Précision<br>Répétabilité<br>Équerrage | `± 0,5 mm` (S1) → `± 0,2 mm` (S2)<br>Écart en fermeture de boucle < `0,3 mm`<br>Angle `90° ± 0,5°` | F1 |
| **F1.1.4** | **Déplacer** le stylo à une vitesse maîtrisée | Vitesse de tracé et à vide | `[300 à 600 mm/min]` (S1) → `[1000 à 2000 mm/min]` (S2) | F2 |

#### Sous-ensemble 1.2 : Porte-stylo (Axe Z)

| Code | Fonction | Critères | Niveau attendu | Flex. |
| :--- | :--- | :--- | :--- | :---: |
| **F1.2.1** | **Lever et poser** le stylo sur la feuille | Hauteur de levée<br>Temps de bascule | Min. `5 mm` au-dessus du papier<br>< `0,3 s`, sans bavure | F0 |
| **F1.2.2** | **Maintenir** le stylo sans qu'il glisse | Diamètres acceptés<br>Temps de changement | Stylos / feutres de `[8 à 12 mm]`<br>Changement en < `[30 s]` | F1 |
| **F1.2.3** | **Appuyer** régulièrement sur le papier | Constance du trait<br>Planéité | Trait net sans déchirer la feuille<br>Tolère `± 1 mm` de défaut de planéité (S2) | F2 |

#### Sous-ensemble 1.3 : Châssis et feuille

| Code | Fonction | Critères | Niveau attendu | Flex. |
| :--- | :--- | :--- | :--- | :---: |
| **F1.3.1** | **Supporter** la mécanique et l'électronique | Rigidité<br>Stabilité sur table | Ne se déforme pas et ne glisse pas pendant le tracé | F0 |
| **F1.3.2** | **Bloquer** la feuille dans la zone de dessin | Maintien<br>Mise en place | La feuille ne bouge pas pendant le tracé<br>Installation en < `[15 s]` | F1 |
| **F1.3.3** | **Rester** compact et transportable | Encombrement<br>Masse | < `[500 × 500 × 250 mm]`<br>< `[5 kg]` (portable par une personne) | F2 |

### Ensemble 2 : Électronique et commande

#### Sous-ensemble 2.1 : Alimentation

| Code | Fonction | Critères | Niveau attendu | Flex. |
| :--- | :--- | :--- | :--- | :---: |
| **F2.1.1** | **Alimenter** la machine sur une prise classique | Source<br>Stabilité | Secteur `230 V / 50 Hz` converti en tensions continues stables (puissance et logique) | F0 |
| **F2.1.2** | **Distribuer** le courant aux moteurs et à la carte | Stabilité<br>Chauffe | Pas de coupure ni redémarrage en charge<br>Composants < `[70 °C]` | F0 |
| **F2.1.3** | **Protéger** le circuit électrique | Courant max<br>Câblage | Courant moteurs limité<br>Fils isolés et rangés, aucun conducteur nu accessible | F0 |

#### Sous-ensemble 2.2 : Commande des moteurs

| Code | Fonction | Critères | Niveau attendu | Flex. |
| :--- | :--- | :--- | :--- | :---: |
| **F2.2.1** | **Recevoir** les ordres de mouvement depuis un PC | Connexion<br>Fiabilité | Liaison filaire stable, sans perte de données ni saturation | F0 |
| **F2.2.2** | **Synchroniser** les mouvements des axes X et Y | Interpolation | Déplacements simultanés fluides (lignes droites et courbes) | F0 |
| **F2.2.3** | **Piloter** les moteurs avec précision | Résolution<br>Couple | Pas < `0,1 mm`<br>Assez de couple pour ne pas sauter de pas | F0 |

#### Sous-ensemble 2.3 : Origine et sécurité

| Code | Fonction | Critères | Niveau attendu | Flex. |
| :--- | :--- | :--- | :--- | :---: |
| **F2.3.1** | **Définir** le point zéro (origine) | Mode de mise à zéro | Manuel (S1) → Automatique / Homing (S2) | F1 |
| **F2.3.2** | **Limiter** la course pour éviter les chocs | Butées | Limites logicielles (S1) → Capteurs de fin de course (S2) | F1 |
| **F2.3.3** | **Couper** la machine en urgence | Temps d'arrêt<br>Accès | Coupure physique accessible en < `1 s` | F0 |

### Ensemble 3 : Logiciel et interface

#### Sous-ensemble 3.1 : Traitement d'image

| Code | Fonction | Critères | Niveau attendu | Flex. |
| :--- | :--- | :--- | :--- | :---: |
| **F3.1.1** | **Importer** une image depuis l'ordinateur | Formats | `PNG`, `JPG` | F0 |
| **F3.1.2** | **Adapter** l'image au dessin au stylo | Échelle<br>Simplification | Redimensionnement auto sans déformation<br>Passage en traits exploitables (seuillage / contours) | F1 |
| **F3.1.3** | **Vectoriser** l'image en tracés | Propreté<br>Bruit | Extraction des contours principaux<br>Suppression des micro-traits < `[1 mm]` | F1 |

#### Sous-ensemble 3.2 : Trajectoires et prévisualisation

| Code | Fonction | Critères | Niveau attendu | Flex. |
| :--- | :--- | :--- | :--- | :---: |
| **F3.2.1** | **Traduire** les tracés en commandes machine | Format<br>Levées de stylo | Instructions standardisées (déplacements à vide, tracés, levées/descentes) | F0 |
| **F3.2.2** | **Afficher** un aperçu du tracé avant lancement | Fidélité | Prévisualisation du parcours à l'écran avant de lancer la machine | F1 |
| **F3.2.3** | **Optimiser** l'ordre des traits | Déplacements à vide | Regroupement des tracés proches pour limiter les allers-retours (S2) | F2 |

#### Sous-ensemble 3.3 : Interface utilisateur

| Code | Fonction | Critères | Niveau attendu | Flex. |
| :--- | :--- | :--- | :--- | :---: |
| **F3.3.1** | **Permettre** une prise en main rapide | Installation<br>Simplicité | Aucune installation lourde<br>Utilisable par un novice en < `[2 min]` | F1 |
| **F3.3.2** | **Envoyer** les commandes à la machine en direct | Flux<br>Export | Envoi ligne par ligne synchronisé avec la machine<br>Téléchargement local du fichier possible | F1 |
| **F3.3.3** | **Suivre** l'avancement du dessin | Retour d'état<br>Contrôle | État affiché (connecté, en cours, terminé), pause et arrêt logiciel | F2 |

### Ensemble 4 : Sécurité et contraintes projet

#### Sous-ensemble 4.1 : Sécurité et maintenance

| Code | Fonction | Critères | Niveau attendu | Flex. |
| :--- | :--- | :--- | :--- | :---: |
| **F4.1.1** | **Protéger** l'utilisateur | Risques mécaniques et électriques | Pas de pièce coupante exposée<br>Basse tension côté machine, câbles hors des zones mobiles | F0 |
| **F4.1.2** | **Faciliter** les réglages et la maintenance | Accès | Accès aux vis de tension et aux branchements sans tout démonter | F1 |

#### Sous-ensemble 4.2 : Contraintes projet

| Code | Fonction | Critères | Niveau attendu | Flex. |
| :--- | :--- | :--- | :--- | :---: |
| **F4.2.1** | **Fabriquer** les pièces avec les moyens du MakerSpace | Procédés | Impression 3D, découpe et visserie standard | F0 |
| **F4.2.2** | **Utiliser** le matériel prévu | Matériel | Kit fourni en priorité + stock du MakerSpace | F0 |
| **F4.2.3** | **Tenir** le planning | Jalons | POC qui tourne en fin de S1 · Machine finie pour la Journée des Projets (S2) | F0 |
| **F4.2.4** | **Documenter** tout le projet | Suivi | Dépôt public à jour (journal de bord, CdCF, plans, code, notice) | F0 |
