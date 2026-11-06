document.addEventListener("DOMContentLoaded", () => {
    // Récupération des éléments de l'interface
   // === Variables globales pour le Web Serial et la simulation ===
let port;
let writer;
let reader;
let keepReading = true;
let gcodeLines = [];
let currentLine = 0;

document.addEventListener("DOMContentLoaded", () => {
    // Récupération des éléments de l'interface
    const imageInput = document.getElementById("imageInput");
    const canvas = document.getElementById("previewCanvas");
    const ctx = canvas.getContext("2d");
    const generateBtn = document.getElementById("generateBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    
    // Nouveaux boutons pour le contrôle série
    const connectSerialBtn = document.getElementById("connectSerialBtn");
    const startDrawingBtn = document.getElementById("startDrawingBtn");
    const serialStatus = document.getElementById("serialStatus");

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

    // 2. Action du bouton Générer (Vectorisation et Seuillage)
    generateBtn.addEventListener("click", () => {
        console.log("Lancement du traitement d'image...");
        
        // Récupérer les pixels actuels du canvas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Appliquer un filtre de Seuillage (Threshold)
        const seuil = 128; // Valeur entre 0 (noir) et 255 (blanc)
        
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

        // Options de vectorisation pour la machine
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

        // Lancer la vectorisation sur l'image nettoyée
        const svgString = ImageTracer.imagedataToSVG(imageData, options);

        // Affichage du tracé sur le canvas
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
        
        // Sauvegarder la chaîne SVG en variable globale pour le futur parser
        window.lastGeneratedSVG = svgString; 
    });

    // --- NOUVEAU CODE : COMMUNICATION WEB SERIAL ---

    // 3. Connexion à la carte MakerUno
    connectSerialBtn.addEventListener("click", async () => {
        try {
            port = await navigator.serial.requestPort();
            await port.open({ baudRate: 115200 }); // Vitesse standard de GRBL
            
            serialStatus.innerText = "Statut : Connecté à GRBL 🟢";
            serialStatus.style.color = "green";
            
            const textEncoder = new TextEncoderStream();
            const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
            writer = textEncoder.writable.getWriter();
            
            const textDecoder = new TextDecoderStream();
            const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
            reader = textDecoder.readable.getReader();
            
            readUntilClosed();
            
            startDrawingBtn.disabled = false;
            
        } catch (error) {
            console.error("Erreur de connexion série :", error);
            serialStatus.innerText = "Statut : Erreur de connexion 🔴";
            serialStatus.style.color = "red";
        }
    });

    // 4. Boucle de lecture asynchrone (écoute le "ok" de GRBL)
    async function readUntilClosed() {
        while (port && port.readable && keepReading) {
            try {
                const { value, done } = await reader.read();
                if (done) break;
                
                if (value) {
                    console.log("MakerUno dit :", value.trim());
                    
                    if (value.includes("ok") && currentLine < gcodeLines.length) {
                        sendNextGcodeLine();
                    } else if (currentLine >= gcodeLines.length && gcodeLines.length > 0) {
                        serialStatus.innerText = "Statut : Dessin terminé ! ✅";
                        startDrawingBtn.disabled = false; 
                    }
                }
            } catch (error) {
                console.error("Erreur de lecture série :", error);
                break;
            }
        }
    }

    // 5. Lancement du POC (Carré magique de test)
    startDrawingBtn.addEventListener("click", () => {
        const testGcode = [
            "G21",             // Unités en millimètres
            "G90",             // Coordonnées absolues
            "G0 X0 Y0",        // Point d'origine rapide
            "G1 X10 Y0 F500",  // Trace bas (vitesse 500)
            "G1 X10 Y10 F500", // Trace droite
            "G1 X0 Y10 F500",  // Trace haut
            "G1 X0 Y0 F500"    // Trace gauche (retour origine)
        ];
        
        gcodeLines = testGcode;
        currentLine = 0;
        
        serialStatus.innerText = "Statut : Moteurs en action... ⚙️";
        startDrawingBtn.disabled = true; 
        
        // 1. Simuler sur le canvas avant d'envoyer
        simulateGCode(gcodeLines);

        // 2. Réveiller GRBL et lancer l'envoi physique après une courte pause
        writer.write("\n\n");
        setTimeout(sendNextGcodeLine, 1500); 
    });

    // 6. Fonction d'envoi ligne par ligne à la machine
    function sendNextGcodeLine() {
        if (currentLine < gcodeLines.length) {
            const line = gcodeLines[currentLine];
            console.log("Envoi G-Code : " + line);
            writer.write(line + "\n");
            currentLine++;
        }
    }

    // --- NOUVEAU CODE : SIMULATEUR DE TRACÉ G-CODE ---

    // 7. Fonction de simulation visuelle sur le Canvas
    function simulateGCode(gcodeArray) {
        console.log("Début de la simulation du tracé...");
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        
        ctx.strokeStyle = "#007BFF";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        let i = 0;
        let currentX = 0;
        let currentY = 0;
        
        const scale = 5; 

        function drawNextLine() {
            if (i >= gcodeArray.length) {
                console.log("Simulation terminée !");
                return;
            }

            const line = gcodeArray[i];
            
            const matchX = line.match(/X([\d\.]+)/);
            const matchY = line.match(/Y([\d\.]+)/);
            
            if (matchX) currentX = parseFloat(matchX[1]) * scale;
            if (matchY) currentY = parseFloat(matchY[1]) * scale;

            if (line.startsWith("G0")) {
                ctx.moveTo(currentX, currentY);
            } else if (line.startsWith("G1")) {
                ctx.lineTo(currentX, currentY);
                ctx.stroke(); 
            }

            i++;
            
            requestAnimationFrame(drawNextLine); 
        }

        drawNextLine();
    }
});
})