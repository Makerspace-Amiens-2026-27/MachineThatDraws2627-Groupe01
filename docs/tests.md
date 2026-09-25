---
layout: default
nav_order: 7
title: Tests et résultats
---

# Tests et résultats

{: .a_supprimer }
> Cette page apporte la **preuve** que votre projet répond au cahier des charges.
> Reprenez les critères de la page **Objectifs du projet** et écrivez un protocole
> de test pour chacun, puis notez les résultats, **y compris les échecs**.
> Voir [Documenter les tests et résultats](https://doc.makerspace-amiens.fr/workshops/methodologie-de-projet/tutorials/documenter-tests-resultats/).

## Synthèse

{: .a_modifier }
> Un tableau récapitulatif des critères testés. Exemple :

| Critère | Attendu | Mesuré | Validé |
|---|---|---|---|
| Taux de tri correct | ≥ 80 % sur 20 essais | 85 % | ✅ |
| Autonomie sur batterie | ≥ 4 h | 3 h 30 | ❌ |

## Test : taux de tri correct

{: .a_modifier }
> Exemple de protocole : dupliquez cette section pour chaque critère testé.

**Critère visé :** ≥ 80 % sur 20 essais (voir le cahier des charges).

**Méthode :** déposer 20 déchets connus un par un, noter la catégorie détectée.

**Conditions :** éclairage de la salle d'exposition, température ambiante.

| Essai | Déchet réel | Détection | Correct ? |
|---|---|---|---|
| 1 | Plastique | Plastique | ✅ |
| 2 | Verre | Métal | ❌ |
| … | … | … | … |

**Résultat :**

$$
\tau = \frac{n_{\text{corrects}}}{n_{\text{essais}}} = \frac{17}{20} = 85\,\%
$$

Critère atteint. Les 3 erreurs concernent des bouteilles en verre teinté.

## Test : autonomie sur batterie

{: .a_modifier }
> Les formules s'écrivent en LaTeX entre `$$` : seules sur leur ligne (avec une
> ligne vide avant et après) elles sont centrées, dans une phrase elles restent
> dans le texte. Le `$` simple ne fonctionne **pas** sur le site.

Avec une batterie de capacité $$C = 2000\ \text{mAh}$$ et un courant moyen
mesuré de $$I_{\text{moy}} = 570\ \text{mA}$$, l'autonomie théorique vaut :

$$
t = \frac{C}{I_{\text{moy}}} = \frac{2000}{570} \approx 3{,}5\ \text{h}
$$

Mesurée : 3 h 30, critère non atteint (≥ 4 h). Piste : mise en veille du capteur
entre deux déchets.

{% include graphique.html csv="assets/data/decharge-batterie.csv" titre="Décharge de la batterie" y="Tension (V)" %}

{: .a_modifier }
> Le graphique est tracé à partir du fichier `docs/assets/data/decharge-batterie.csv` :
> première colonne pour l'axe X, une colonne par courbe, les noms des colonnes
> servent de légende. Exportez vos mesures en CSV (tableur, moniteur série…),
> placez le fichier dans `docs/assets/data/` et changez le nom dans l'include.
> Options : `type="bar"` pour un histogramme, `type="scatter"` pour des points seuls.
