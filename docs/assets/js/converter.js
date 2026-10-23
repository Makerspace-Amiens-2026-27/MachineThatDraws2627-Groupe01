document.addEventListener("DOMContentLoaded", () => {
    // Récupération des éléments de l'interface
    const imageInput = document.getElementById("imageInput");
    const canvas = document.getElementById("previewCanvas");
    const ctx = canvas.getContext("2d");
    const generateBtn = document.getElementById("generateBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    // 1. Écouter l'importation d'une nouvelle image
    imageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // Nettoyer l'ancien dessin du canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Calculer le ratio pour redimensionner l'image sans la déformer
                const ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
                const newWidth = img.width * ratio;
                const newHeight = img.height * ratio;
                
                // Centrer l'image dans le canvas
                const offsetX = (canvas.width - newWidth) / 2;
                const offsetY = (canvas.height - newHeight) / 2;

                // Dessiner l'image redimensionnée
                ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
                
                // Activer le bouton de génération
                generateBtn.disabled = false;
            };
            img.src = event.target.result;
        };
        // Lire le fichier comme une URL de données (Base64)
        reader.readAsDataURL(file);
    });

    // 2. Action du bouton Générer (À compléter)
    generateBtn.addEventListener("click", () => {
        // C'est ici que nous ferons appel à imagetracer.js à la prochaine étape
        // pour transformer les pixels du canvas en vecteurs SVG.
        console.log("Image prête pour la vectorisation !");
        alert("L'image est chargée dans le canvas. Prêt à intégrer l'algorithme de vectorisation.");
    });
});