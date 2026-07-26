/**
 * Asistente de Voz Inteligente para Ganadería Pro
 * Optimizado para usuarios con baja alfabetización digital.
 */

const DICCIONARIO_GANADERO = {
    // Especies
    "baca": "Bovino",
    "vaca": "Bovino",
    "toro": "Bovino",
    "ganado": "Bovino",
    "caballo": "Equino",
    "yegua": "Equino",
    "burro": "Equino",
    "mula": "Equino",
    "oveja": "Ovino",
    "cabra": "Caprino",

    // Sexo
    "macho": "Macho",
    "hembra": "Hembra",
    "baca hembra": "Hembra",
    "toro macho": "Macho",

    // Categorías
    "ternero": "Cría (0-12m)",
    "ternera": "Cría (0-12m)",
    "novilla": "Levante (1-2a)",
    "novillo": "Levante (1-2a)",
    "adulto": "Adulto (>2a)",
    "vieja": "Adulto (>2a)",

    // Razas comunes
    "briman": "Brahman",
    "bramán": "Brahman",
    "guzera": "Guzerá",
    "guserá": "Guzerá",
    "holsten": "Holstein",
    "jolsten": "Holstein",
    "jersey": "Jersey",
    "llersi": "Jersey"
};

class VoiceAssistant {
    constructor() {
        this.recognition = null;
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'es-CO';
            this.recognition.interimResults = false;
            this.recognition.maxAlternatives = 1;
        }
    }

    start(onResult, onError) {
        if (!this.recognition) {
            alert("El reconocimiento de voz no es compatible con este navegador.");
            return;
        }

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            console.log("Escuchado:", transcript);
            const corrected = this.correctTerm(transcript);
            onResult(corrected, transcript);
        };

        this.recognition.onerror = (event) => {
            console.error("Error de voz:", event.error);
            if (onError) onError(event.error);
        };

        this.recognition.start();
    }

    correctTerm(text) {
        // Limpiar el texto de palabras de relleno
        const cleanText = text.replace("registrar", "").replace("es un", "").trim();

        // Buscar coincidencia exacta en diccionario
        if (DICCIONARIO_GANADERO[cleanText]) {
            return DICCIONARIO_GANADERO[cleanText];
        }

        // Búsqueda por palabras contenidas
        for (const key in DICCIONARIO_GANADERO) {
            if (cleanText.includes(key)) {
                return DICCIONARIO_GANADERO[key];
            }
        }

        // Si es un número (ej. para peso o edad), extraerlo
        const matchNumber = cleanText.match(/\d+/);
        if (matchNumber) return matchNumber[0];

        return text; // Devolver original si no hay regla
    }
}

const voiceAssistant = new VoiceAssistant();
