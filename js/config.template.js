// Configuration de l'API de traduction
// COPIEZ ce fichier en "config.js" et ajoutez votre clé API

const API_CONFIG = {
    // Clé OpenRouter (obtenir sur https://openrouter.ai/)
    OPENROUTER_API_KEY: 'VOTRE_CLE_API_ICI',
    
    // Modèle GRATUIT pour la traduction (économique)
    MODEL: 'google/gemini-2.0-flash-exp:free',
    
    // URL de l'API
    API_URL: 'https://openrouter.ai/api/v1/chat/completions'
};

// Exporter pour utilisation dans sefaria.js
window.API_CONFIG = API_CONFIG;

