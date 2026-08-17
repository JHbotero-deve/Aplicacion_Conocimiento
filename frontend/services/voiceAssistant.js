/**
 * Asistente de Voz Ultra-Inteligente para Ganadería Pro
 * Incluye Corrección Difusa (Levenshtein) y Prevención de Desvío a Cuarentena.
 */

const DICCIONARIO_CATEGORIZADO = {
    especies: {
        "baca": "Bovino", "vaca": "Bovino", "toro": "Bovino", "ganado": "Bovino",
        "caballo": "Equino", "yegua": "Equino", "burro": "Equino", "mula": "Equino",
        "oveja": "Ovino", "cabra": "Caprino"
    },
    razas: {
        "briman": "Brahman", "bramán": "Brahman", "guzera": "Guzerá", "guserá": "Guzerá",
        "holsten": "Holstein", "jolsten": "Holstein", "jersey": "Jersey", "llersi": "Jersey",
        "normando": "Normando", "girolando": "Girolando"
    },
    etaria: {
        "ternero": "Cría (0-12m)", "ternera": "Cría (0-12m)", "novilla": "Levante (1-2a)",
        "novillo": "Levante (1-2a)", "adulto": "Adulto (>2a)", "vieja": "Adulto (>2a)"
    },
    tratamientos: {
        "fiebre": "Fiebre", "mastitis": "Mastitis", "antibiotico": "Antibiótico",
        "vacuna": "Vacunación", "purga": "Desparasitación", "herida": "Herida",
        "cojera": "Cojera", "inyeccion": "Inyectable", "tomado": "Oral"
    },
    produccion: {
        "leche": "Leche", "pesaje": "Pesaje (Carne)", "litros": "Litros", "kilos": "Kilos"
    },
    generales: {
        "macho": "Macho", "hembra": "Hembra", "si": "Sí", "no": "No",
        "parto": "Parto", "muerte": "Muerte", "venta": "Venta", "traslado": "Traslado"
    }
};

class VoiceAssistant {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'es-CO';
            this.recognition.interimResults = false;
            this.recognition.maxAlternatives = 1;
        }
    }

    /**
     * Hace que el celular hable (TTS)
     */
    speak(text, onEnd) {
        if (!this.synthesis) return;
        this.synthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-CO';
        utterance.rate = 1.0;
        if (onEnd) utterance.onend = onEnd;
        this.synthesis.speak(utterance);
    }

    start(onResult, onError, category = null) {
        if (!this.recognition) {
            alert("El reconocimiento de voz no es compatible con este navegador.");
            return;
        }

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            console.log(`🎤 Escuchado [${category || 'Gral'}]:`, transcript);
            const corrected = this.smartCorrect(transcript, category);

            // Validación de Anomalías Local (Anti-Desvío)
            const anomaly = this.checkLocalAnomaly(corrected, category);

            if (anomaly) this.speak(`Atención: ${anomaly}`);

            onResult(corrected, transcript, anomaly);
        };

        this.recognition.onerror = (event) => {
            console.error("Error de voz:", event.error);
            if (onError) onError(event.error);
        };

        this.recognition.start();
    }

    /**
     * Guía al usuario por voz para llenar un formulario completo.
     */
    async startSequence(fields, onComplete) {
        let index = 0;
        const processNext = () => {
            if (index >= fields.length) {
                this.speak("Formulario completo. ¿Desea guardar?", () => onComplete());
                return;
            }

            const field = fields[index];
            this.speak(`Diga ${field.label}`, () => {
                setTimeout(() => {
                    this.start((corrected, original, anomaly) => {
                        const input = document.getElementById(field.id);
                        if (input) {
                            input.value = corrected;
                            input.dispatchEvent(new Event('change'));
                        }
                        if (anomaly) {
                            this.speak(anomaly, () => {
                                index++;
                                processNext();
                            });
                        } else {
                            index++;
                            processNext();
                        }
                    }, (err) => {
                        this.speak("No entendí, repita por favor", () => processNext());
                    }, field.category);
                }, 500);
            });
        };
        processNext();
    }

    /**
     * Algoritmo de Levenshtein para medir distancia entre palabras.
     */
    levenshtein(a, b) {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
                else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
            }
        }
        return matrix[b.length][a.length];
    }

    smartCorrect(text, category) {
        const cleanText = text.replace(/registrar|es un|es una|el|la/g, "").trim();

        // 1. Si es un número puro, devolverlo
        if (!isNaN(cleanText.replace(",", "."))) return cleanText.replace(",", ".");

        // 2. Buscar en la categoría específica o en todo el diccionario
        let bestMatch = cleanText;
        let minDistance = 3; // Umbral de error (máx 2 cambios)

        const pools = category && DICCIONARIO_CATEGORIZADO[category]
            ? [DICCIONARIO_CATEGORIZADO[category], DICCIONARIO_CATEGORIZADO.generales]
            : Object.values(DICCIONARIO_CATEGORIZADO);

        for (const pool of pools) {
            for (const [key, val] of Object.entries(pool)) {
                if (cleanText === key) return val; // Match exacto
                const dist = this.levenshtein(cleanText, key);
                if (dist < minDistance) {
                    minDistance = dist;
                    bestMatch = val;
                }
            }
        }

        return bestMatch;
    }

    /**
     * Motor de Guardia Local (Anti-Cuarentena)
     * Advierte antes de que el servidor desvíe los datos.
     */
    checkLocalAnomaly(value, category) {
        const num = parseFloat(value);
        if (isNaN(num)) return null;

        if (category === 'peso' || category === 'produccion') {
            if (num > 1500) return "Valor extremo (>1500kg). ¿Es correcto?";
            if (num < 5 && category === 'peso') return "Peso muy bajo (<5kg). Verifique.";
        }

        if (category === 'leche' && num > 45) {
            return "Producción inusual (>45L). ¿Seguro?";
        }

        return null;
    }
}

const voiceAssistant = new VoiceAssistant();
