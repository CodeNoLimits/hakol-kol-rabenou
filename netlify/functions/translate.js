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

        console.log('🔄 MyMemory Translate:', text.substring(0, 50) + '...');

        // MyMemory API - Gratuit et fiable, pas de clé requise
        const apiResponse = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|fr`);

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error('MyMemory error:', apiResponse.status, errorText);
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
        const french = data.responseData?.translatedText;

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
