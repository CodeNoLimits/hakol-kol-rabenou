// Fonction de debug pour vérifier les variables d'environnement
exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    const apiKey = process.env.OPENROUTER_API_KEY;

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            hasApiKey: !!apiKey,
            apiKeyLength: apiKey?.length || 0,
            apiKeyStart: apiKey?.substring(0, 15) || 'N/A',
            apiKeyEnd: apiKey?.substring(apiKey.length - 4) || 'N/A',
            allEnvKeys: Object.keys(process.env).filter(k => k.includes('OPEN') || k.includes('API'))
        })
    };
};

