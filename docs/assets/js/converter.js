console.log("🚀 Fichier converter.js chargé !");
// === Variables globales pour le Web Serial et la simulation ===
let port;
let writer;
let reader;
let keepReading = true;
let gcodeLines = [];
let currentLine = 0;

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ La page est prête, les boutons sont actifs !");
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

    // 2. Écouteur du bouton Générer (Vectorisation + Parser G-Code)
        if (generateBtn) {
            generateBtn.addEventListener("click", () => {
                console.log("⚙️ Bouton Générer cliqué. Lancement du seuillage...");
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                const seuil = 128; 
                
                for (let i = 0; i < data.length; i += 4) {
                    const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                    const couleur = luminance > seuil ? 255 : 0;
                    data[i] = couleur; data[i + 1] = couleur; data[i + 2] = couleur; data[i + 3] = 255;
                }
                
                ctx.putImageData(imageData, 0, 0);
                
                const options = {
                    strokewidth: 1, colorsampling: 0, numberofcolors: 2, 
                    mincolorratio: 0, colorquantcycles: 1, ltres: 0.5, qtres: 1, pathomit: 8
                };

                const svgString = ImageTracer.imagedataToSVG(imageData, options);
                
                // --- LE PARSER SVG VERS G-CODE ---
                console.log("🧠 Démarrage du Parser SVG vers G-Code...");
                gcodeLines = ["G21", "G90"]; // Initialisation (Millimètres et coordonnées absolues)
                
                const parser = new DOMParser();
                const doc = parser.parseFromString(svgString, "image/svg+xml");
                const paths = doc.querySelectorAll("path");
                
                paths.forEach(path => {
                    const d = path.getAttribute("d");
                    if (!d) return;
                    
                    // Découpage des commandes du tracé vectoriel (M = Move, L = Line)
                    const commands = d.match(/[A-Z][^A-Z]*/ig); 
                    if(!commands) return;

                    commands.forEach(cmd => {
                        const type = cmd[0].toUpperCase();
                        // Extraction des coordonnées numériques
                        const coords = cmd.slice(1).trim().split(/[\s,]+/);
                        
                        if (type === 'M' && coords.length >= 2) {
                            // M = Déplacement rapide (Stylo levé sur la machine)
                            gcodeLines.push(`G0 X${parseFloat(coords[0]).toFixed(2)} Y${parseFloat(coords[1]).toFixed(2)}`);
                        } 
                        else if (type === 'L' && coords.length >= 2) {
                            // L = Tracé continu (Stylo baissé)
                            gcodeLines.push(`G1 X${parseFloat(coords[0]).toFixed(2)} Y${parseFloat(coords[1]).toFixed(2)} F500`);
                        }
                    });
                });

                console.log(`✅ Parser terminé : ${gcodeLines.length} lignes de G-Code générées !`);
                
                if (downloadBtn) downloadBtn.disabled = false;
                
                // On efface l'image pour laisser place à l'animation
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Lancement de notre fonction d'animation visuelle
                currentLine = 0;
                simulateGCode(gcodeLines);
            });
        }

    // 3. Connexion à la carte MakerUno
    connectSerialBtn.addEventListener("click", async () => {
        try {
            port = await navigator.serial.requestPort();
            await port.open({ baudRate: 115200 });
            
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
            "G21",             
            "G90",             
            "G0 X0 Y0",        
            "G1 X10 Y0 F500",  
            "G1 X10 Y10 F500", 
            "G1 X0 Y10 F500",  
            "G1 X0 Y0 F500"    
        ];
        
        gcodeLines = testGcode;
        currentLine = 0;
        
        serialStatus.innerText = "Statut : Moteurs en action... ⚙️";
        startDrawingBtn.disabled = true; 
        
        // 1. Simuler sur le canvas avant d'envoyer
        simulateGCode(gcodeLines);

        // 2. Réveiller GRBL et lancer l'envoi physique
        if (writer) {
            writer.write("\n\n");
            setTimeout(sendNextGcodeLine, 1500); 
        }
    });

    // 6. Fonction d'envoi ligne par ligne à la machine
    function sendNextGcodeLine() {
        if (currentLine < gcodeLines.length && writer) {
            const line = gcodeLines[currentLine];
            console.log("Envoi G-Code : " + line);
            writer.write(line + "\n");
            currentLine++;
        }
    }

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
        
        const scale = 1; 

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