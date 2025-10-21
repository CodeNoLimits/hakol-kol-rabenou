// Netlify Function pour la traduction sécurisée
// La clé API est stockée comme variable d'environnement

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse request body
        const { text } = JSON.parse(event.body);

        if (!text || typeof text !== 'string') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Text parameter is required' })
            };
        }

        // Get API key from environment variable
        const apiKey = process.env.OPENROUTER_API_KEY;
        
        if (!apiKey) {
            console.error('OPENROUTER_API_KEY not configured');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'API key not configured' })
            };
        }

        // Call OpenRouter API
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://hakol-kol-rabenou.netlify.app',
                'X-Title': 'Hakol Kol Rabenou - Breslov Texts'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-exp:free',
                messages: [
                    {
                        role: 'system',
                        content: 'Tu es un traducteur expert. Traduis UNIQUEMENT le texte anglais suivant en français, sans ajouter de commentaires, d\'explications ou de texte supplémentaire. Retourne SEULEMENT la traduction française.'
                    },
                    {
                        role: 'user',
                        content: text
                    }
                ],
                temperature: 0.3,
                max_tokens: Math.min(text.length * 3, 4000)
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('OpenRouter API error:', response.status, errorData);
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ 
                    error: 'Translation API error',
                    details: errorData 
                })
            };
        }

        const data = await response.json();
        const translatedText = data.choices?.[0]?.message?.content?.trim();

        if (!translatedText) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'No translation returned' })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                translation: translatedText,
                usage: data.usage 
            })
        };

    } catch (error) {
        console.error('Translation function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message 
            })
        };
    }
};

