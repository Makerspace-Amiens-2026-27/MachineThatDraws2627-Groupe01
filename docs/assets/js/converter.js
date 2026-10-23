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
        console.log("Lancement du traitement d'image...");
        
        // 1. Récupérer les pixels actuels du canvas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // 2. Appliquer un filtre de Seuillage (Threshold)
        const seuil = 128; // Valeur entre 0 (noir) et 255 (blanc). Tu pourras en faire un slider plus tard !
        
        for (let i = 0; i < data.length; i += 4) {
            // Calculer la luminosité du pixel
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
            
            // Si la luminosité est au-dessus du seuil, on met blanc, sinon noir
            const couleur = luminance > seuil ? 255 : 0;
            
            data[i] = couleur;     // Rouge
            data[i + 1] = couleur; // Vert
            data[i + 2] = couleur; // Bleu
            data[i + 3] = 255;     // Alpha (Opacité max)
        }
        
        // Mettre à jour le canvas avec l'image en noir et blanc pur
        ctx.putImageData(imageData, 0, 0);

        // 3. Options de vectorisation pour la machine
        const options = {
            strokewidth: 1,
            colorsampling: 0,
            numberofcolors: 2, 
            mincolorratio: 0,
            colorquantcycles: 1,
            ltres: 0.5, // Augmenté pour lisser les lignes droites
            qtres: 1,   // Tolérance des courbes
            pathomit: 8 // Ignore les tout petits points parasites (bruit)
        };

        // 4. Lancer la vectorisation sur l'image nettoyée
        const svgString = ImageTracer.imagedataToSVG(imageData, options);

        // 5. Affichage du tracé sur le canvas
        const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(svgBlob);
        
        const tracedImg = new Image();
        tracedImg.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(tracedImg, 0, 0);
            URL.revokeObjectURL(url);
            
            downloadBtn.disabled = false;
            console.log("Vectorisation terminée !");
        };
        tracedImg.src = url;
        // (Optionnel) Sauvegarder la chaîne SVG en variable globale pour la future génération G-Code
        window.lastGeneratedSVG = svgString; 
    });
});