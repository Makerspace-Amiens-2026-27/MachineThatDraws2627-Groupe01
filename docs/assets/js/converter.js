console.log("🚀 Lancement de converter.js v3 (Parser SVG & Simulateur Actif)");

// === Variables globales ===
let port;
let writer;
let reader;
let keepReading = true;
let gcodeLines = [];
let currentLine = 0;

document.addEventListener("DOMContentLoaded", () => {
    try {
        const imageInput = document.getElementById("imageInput");
        const canvas = document.getElementById("previewCanvas");
        const ctx = canvas ? canvas.getContext("2d") : null;
        const generateBtn = document.getElementById("generateBtn");
        const downloadBtn = document.getElementById("downloadBtn");
        const connectSerialBtn = document.getElementById("connectSerialBtn");
        const startDrawingBtn = document.getElementById("startDrawingBtn");
        const serialStatus = document.getElementById("serialStatus");

        if (!imageInput || !canvas || !ctx) {
            console.error("❌ ERREUR : Éléments introuvables.");
            return;
        }

        // 1. Écouteur d'importation d'image
        imageInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    
                    const ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
                    const newWidth = img.width * ratio;
                    const newHeight = img.height * ratio;
                    const offsetX = (canvas.width - newWidth) / 2;
                    const offsetY = (canvas.height - newHeight) / 2;

                    ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
                    if (generateBtn) generateBtn.disabled = false;
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });

        // 2. Action du bouton Générer (Seuillage -> SVG -> GCode -> Simulateur)
        if (generateBtn) {
            generateBtn.addEventListener("click", () => {
                console.log("⚙️ 1. Seuillage en cours...");
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                const seuil = 128; 
                
                for (let i = 0; i < data.length; i += 4) {
                    const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                    const couleur = luminance > seuil ? 255 : 0;
                    data[i] = couleur; data[i + 1] = couleur; data[i + 2] = couleur; data[i + 3] = 255;
                }
                ctx.putImageData(imageData, 0, 0);

                console.log("🔍 2. Vectorisation (ImageTracer)...");
                const options = {
                    strokewidth: 1, colorsampling: 0, numberofcolors: 2, 
                    mincolorratio: 0, colorquantcycles: 1, ltres: 0.5, qtres: 1, pathomit: 8
                };
                const svgString = ImageTracer.imagedataToSVG(imageData, options);
                
                console.log("🧠 3. Parser SVG -> G-Code...");
                gcodeLines = ["G21", "G90"]; // Initialisation (Millimètres, absolu)
                
                const parser = new DOMParser();
                const doc = parser.parseFromString(svgString, "image/svg+xml");
                const paths = doc.querySelectorAll("path");
                
                paths.forEach(path => {
                    const d = path.getAttribute("d");
                    if (!d) return;
                    
                    // Regex plus permissive pour récupérer toutes les commandes
                    const commands = d.match(/[a-zA-Z][^a-zA-Z]*/g); 
                    if(!commands) return;

                    commands.forEach(cmd => {
                        const type = cmd[0].toUpperCase();
                        const coords = cmd.slice(1).trim().split(/[\s,]+/);
                        
                        if (type === 'M' && coords.length >= 2) {
                            gcodeLines.push(`G0 X${parseFloat(coords[0]).toFixed(2)} Y${parseFloat(coords[1]).toFixed(2)}`);
                        } 
                        else if (type === 'L' && coords.length >= 2) {
                            gcodeLines.push(`G1 X${parseFloat(coords[0]).toFixed(2)} Y${parseFloat(coords[1]).toFixed(2)} F500`);
                        }
                    });
                });

                console.log(`✅ ${gcodeLines.length} lignes générées.`);
                
                if (downloadBtn) downloadBtn.disabled = false;
                
                // On efface le canvas pour voir l'animation propre
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                console.log("🎬 4. Lancement du simulateur !");
                currentLine = 0;
                simulateGCode(gcodeLines);
            });
        }

        // 3. Connexion et Envoi au Port Série (Le vrai tracé sur la CNC)
        if (connectSerialBtn && startDrawingBtn) {
            connectSerialBtn.addEventListener("click", async () => {
                try {
                    port = await navigator.serial.requestPort();
                    await port.open({ baudRate: 115200 });
                    serialStatus.innerText = "Statut : Connecté 🟢";
                    serialStatus.style.color = "green";
                    
                    const textEncoder = new TextEncoderStream();
                    textEncoder.readable.pipeTo(port.writable);
                    writer = textEncoder.writable.getWriter();
                    
                    const textDecoder = new TextDecoderStream();
                    port.readable.pipeTo(textDecoder.writable);
                    reader = textDecoder.readable.getReader();
                    
                    readUntilClosed();
                    startDrawingBtn.disabled = false;
                } catch (error) {
                    console.error("❌ Erreur série :", error);
                }
            });

            async function readUntilClosed() {
                while (port && port.readable && keepReading) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    if (value && value.includes("ok") && currentLine < gcodeLines.length) {
                        sendNextGcodeLine();
                    }
                }
            }

            startDrawingBtn.addEventListener("click", () => {
                startDrawingBtn.disabled = true; 
                currentLine = 0; // On reprend au début du G-Code
                if (writer) {
                    writer.write("\n\n");
                    setTimeout(sendNextGcodeLine, 1500); 
                }
            });

            function sendNextGcodeLine() {
                if (currentLine < gcodeLines.length && writer) {
                    writer.write(gcodeLines[currentLine] + "\n");
                    currentLine++;
                }
            }
        }

        // 4. La fonction Simulateur réparée
        function simulateGCode(gcodeArray) {
            ctx.beginPath();
            ctx.strokeStyle = "#007BFF";
            ctx.lineWidth = 2;
            
            let i = 0;
            let currentX = 0;
            let currentY = 0;
            const scale = 1; // On garde 1 pour être raccord avec l'image SVG
            
            function drawNextLine() {
                if (i >= gcodeArray.length) {
                    console.log("🏁 Animation terminée.");
                    return;
                }

                const line = gcodeArray[i];
                const matchX = line.match(/X([\d\.-]+)/); // Ajout du tiret pour les coordonnées négatives
                const matchY = line.match(/Y([\d\.-]+)/);
                
                if (matchX) currentX = parseFloat(matchX[1]) * scale;
                if (matchY) currentY = parseFloat(matchY[1]) * scale;

                if (line.startsWith("G0")) {
                    ctx.moveTo(currentX, currentY);
                } else if (line.startsWith("G1")) {
                    ctx.lineTo(currentX, currentY);
                    ctx.stroke(); 
                }
                
                i++;
                // Remplacement de requestAnimationFrame par setTimeout pour ralentir et mieux voir l'animation
                setTimeout(drawNextLine, 10); 
            }
            drawNextLine();
        }

    } catch (error) {
        console.error("💥 ERREUR CRITIQUE D'EXÉCUTION :", error);
    }
});