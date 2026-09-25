# Conception mécanique

> [!IMPORTANT]
> **À modifier** : renseignez le lien Onshape et la date du dernier export.

- **Document Onshape :** [lien de partage](https://cad.onshape.com/)
- **Dernier export :** AAAA-MM-JJ

## Contenu

| Fichier / dossier | Contenu |
|---|---|
| `projet.step` | Export STEP de l'assemblage complet (lisible par tous les logiciels de CAO) |
| [`3d-print/`](3d-print/) | Fichiers pour l'impression 3D |
| [`laser-cutting/`](laser-cutting/) | Fichiers pour la découpe laser |

Le modèle 3D affiché sur le site (`.glb`) ne va pas ici mais dans `docs/assets/models/`.

## Exporter depuis Onshape

- **STEP :** clic droit sur l'onglet de l'assemblage > Exporter > format STEP, à enregistrer ici sous `projet.step`.
- **GLB (pour le site) :** même menu, format GLB, à enregistrer dans `docs/assets/models/`.

Réexportez à chaque version importante : Onshape garde l'historique, mais le repo
doit contenir une version utilisable sans compte Onshape.

## Autre logiciel (Fusion, SolidWorks, FreeCAD…)

Déposez ici les fichiers natifs **en plus** de l'export STEP : contrairement à
Onshape, ils ne sont sauvegardés nulle part ailleurs.
