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


    // 2. Action du bouton Générer (Vectorisation)
    generateBtn.addEventListener("click", () => {
        console.log("Lancement de la vectorisation...");
        
        // Récupérer les pixels actuels du canvas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Options de vectorisation (réglées pour une machine à dessiner : noir et blanc, ligne fine)
        const options = {
            strokewidth: 1,
            colorsampling: 0,
            numberofcolors: 2, // Limiter au noir et blanc
            mincolorratio: 0,
            colorquantcycles: 1,
            ltres: 0.1, // Précision des lignes droites
            qtres: 1    // Précision des courbes
        };

        // Utiliser la librairie imagetracer.js pour générer le code SVG
        // Attention : il faut que imagetracer.js soit bien présent dans assets/js/
        const svgString = ImageTracer.imagedataToSVG(imageData, options);

        // --- Affichage du tracé (SVG) sur le canvas ---
        
        // Créer un fichier virtuel avec le code SVG
        const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(svgBlob);
        
        const tracedImg = new Image();
        tracedImg.onload = () => {
            // Effacer l'image pixelisée d'origine
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Dessiner le nouveau tracé vectoriel à la place
            ctx.drawImage(tracedImg, 0, 0);
            
            // Nettoyer la mémoire
            URL.revokeObjectURL(url);
            
            // Débloquer l'étape suivante : le téléchargement du G-Code
            downloadBtn.disabled = false;
            console.log("Vectorisation terminée !");
        };
        tracedImg.src = url;
        
        // (Optionnel) Sauvegarder la chaîne SVG en variable globale pour la future génération G-Code
        window.lastGeneratedSVG = svgString; 
    });
});