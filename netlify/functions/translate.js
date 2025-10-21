/**
 * 🔐 FONCTION NETLIFY SERVERLESS - TRADUCTION SÉCURISÉE
 *
 * Cette fonction serverless s'exécute sur Netlify avec la clé API sécurisée.
 * Endpoint: /.netlify/functions/translate
 *
 * Configuration requise dans Netlify:
 *   Environment Variables → OPENROUTER_API_KEY = sk-or-v1-...
 */

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // Headers CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Gérer les requêtes OPTIONS (CORS preflight)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Vérifier que c'est une requête POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Méthode non autorisée. Utilisez POST.' })
        };
    }

    try {
        // Parser le body
        const { text } = JSON.parse(event.body);

        if (!text || typeof text !== 'string') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Le champ "text" est requis et doit être une chaîne'
                })
            };
        }

        console.log(\`🔄 Traduction Netlify: \${text.substring(0, 50)}...\`);

        // Récupérer la clé API depuis les variables d'environnement Netlify
        const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

        if (!OPENROUTER_API_KEY) {
            console.error('❌ OPENROUTER_API_KEY manquante dans Netlify env vars');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Configuration serveur manquante (clé API)'
                })
            };
        }

        // Appel à OpenRouter API
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': \`Bearer \${OPENROUTER_API_KEY}\`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://hakol-kol-rabenou.netlify.app',
                'X-Title': 'Hakol Kol Rabenou - Bibliothèque Breslov'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-exp:free',
                messages: [
                    {
                        role: 'system',
                        content: 'Tu es un traducteur expert anglais-français spécialisé dans les textes religieux juifs. Traduis UNIQUEMENT le texte fourni en français, sans ajouter de commentaire, explication ou texte supplémentaire. Préserve le sens spirituel et les termes hébraïques importants.'
                    },
                    {
                        role: 'user',
                        content: text
                    }
                ],
                temperature: 0.3,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error(\`❌ Erreur OpenRouter: \${response.status}\`, errorData);
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({
                    error: \`Erreur API OpenRouter: \${response.status}\`,
                    details: errorData
                })
            };
        }

        const data = await response.json();
        const french = data.choices?.[0]?.message?.content?.trim();

        if (!french) {
            console.error('❌ Pas de traduction dans la réponse:', data);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Pas de traduction dans la réponse API'
                })
            };
        }

        console.log(\`✅ Traduction réussie: \${french.substring(0, 50)}...\`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ french })
        };

    } catch (error) {
        console.error('❌ Erreur fonction Netlify:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Erreur serveur lors de la traduction',
                message: error.message
            })
        };
    }
};
