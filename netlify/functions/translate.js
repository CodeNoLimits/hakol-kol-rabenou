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

        const GOOGLE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY?.trim();

        if (!GOOGLE_API_KEY) {
            console.error('❌ Missing GOOGLE_TRANSLATE_API_KEY');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'API key not configured'
                })
            };
        }

        console.log('🔄 Google Translate:', text.substring(0, 50) + '...');

        // Google Translate API
        const apiResponse = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: text,
                source: 'en',
                target: 'fr',
                format: 'text'
            })
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error('Google Translate error:', apiResponse.status, errorText);
            return {
                statusCode: apiResponse.status,
                headers,
                body: JSON.stringify({ 
                    error: 'Translation API error',
                    details: errorText.substring(0, 200),
                    status: apiResponse.status
                })
            };
        }

        const data = await apiResponse.json();
        const french = data.data?.translations?.[0]?.translatedText;

        if (!french) {
            console.error('No translation in response');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'No translation returned' })
            };
        }

        console.log('✅ Translation success:', french.substring(0, 50) + '...');

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
