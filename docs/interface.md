---
layout: default
title: "Interface de contrôle"
nav_order: 2
---

# 🎛️ Interface de Génération et de Contrôle

Bienvenue sur le centre de contrôle de notre machine. Importez une image, générez le tracé et lancez l'impression directement depuis votre navigateur.

## 1. Préparation de l'image
Sélectionnez le fichier que vous souhaitez dessiner (JPG, PNG).

<div class="control-panel">
  <input type="file" id="imageInput" accept="image/png, image/jpeg">
</div>

## 2. Prévisualisation du tracé
Aperçu de la vectorisation avant génération des instructions pour la machine.

<div class="canvas-container" style="margin-top: 15px; margin-bottom: 15px;">
  <canvas id="previewCanvas" width="600" height="600" style="border: 2px dashed #ccc; max-width: 100%; background: #f9f9f9;"></canvas>
</div>

## 3. Génération du G-Code
Transformez l'image vectorisée en coordonnées (X, Y) et commandes de levée de stylo (Z).

<div class="gcode-actions">
  <button id="generateBtn" class="btn btn-primary">⚙️ Générer le G-Code</button>
  <button id="downloadBtn" class="btn" disabled>💾 Télécharger (.gcode)</button>
</div>

---

## 4. Connexion Machine (Web Serial)
*Connectez votre machine en USB. Compatible uniquement sur les navigateurs basés sur Chromium (Chrome, Edge, Opera).*

<div class="serial-actions" style="margin-top: 15px; padding: 15px; background: #eef7fa; border-radius: 8px;">
  <button id="connectSerialBtn" class="btn btn-outline">🔌 Connecter la machine</button>
  <button id="startDrawingBtn" class="btn btn-success" disabled>▶️ Lancer le dessin</button>
  <p id="serialStatus" style="margin-top: 10px; font-weight: bold; color: #555;">Statut : Déconnecté</p>
</div>

<!-- Importation des bibliothèques de vectorisation et de notre logique applicative -->
<!-- Les balises Liquid s'assurent que les chemins sont corrects après compilation Jekyll -->
<script src="{{ '/assets/js/imagetracer.js' | relative_url }}"></script>
<script src="{{ '/assets/js/converter.js' | relative_url }}"></script>