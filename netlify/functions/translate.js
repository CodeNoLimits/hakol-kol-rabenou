// Fonction Netlify pour traduction sécurisée
// La clé API OpenRouter est stockée comme variable d'environnement

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { text } = JSON.parse(event.body);

        if (!text || typeof text !== 'string') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Text parameter required' })
            };
        }

        const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

        if (!OPENROUTER_API_KEY) {
            console.error('Missing OPENROUTER_API_KEY');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'API key not configured' })
            };
        }

        console.log('Translating:', text.substring(0, 50));

        const apiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://hakol-kol-rabenou.netlify.app',
                'X-Title': 'Hakol Kol Rabenou'
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-3.2-3b-instruct:free',
                messages: [
                    {
                        role: 'system',
                        content: 'Tu es un traducteur expert. Traduis UNIQUEMENT le texte anglais en français, sans commentaire ni explication. Retourne SEULEMENT la traduction.'
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

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error('OpenRouter error:', apiResponse.status, errorText);
            return {
                statusCode: apiResponse.status,
                headers,
                body: JSON.stringify({ error: 'Translation API error' })
            };
        }

        const data = await apiResponse.json();
        const french = data.choices?.[0]?.message?.content?.trim();

        if (!french) {
            console.error('No translation in response');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'No translation returned' })
            };
        }

        console.log('Translation success:', french.substring(0, 50));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ french })
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal error',
                message: error.message 
            })
        };
    }
};
