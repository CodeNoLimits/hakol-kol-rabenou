// Fonction Netlify pour traduction sécurisée avec OpenRouter
// La clé API OpenRouter est stockée comme variable d'environnement: OPENROUTER_API_KEY

const FREE_MODELS = [
    {
        name: 'Gemma 7B IT',
        id: 'google/gemma-7b-it:free',
        prompt: (text) => `Translate this English text to French. Only output the French translation, nothing else:\n\n${text}`
    },
    {
        name: 'Llama 3 8B',
        id: 'meta-llama/llama-3-8b-instruct:free',
        prompt: (text) => `<|begin_of_text|><|start_header_id|>user<|end_header_id|>\n\nTranslate to French:\n${text}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`
    },
    {
        name: 'Mistral 7B',
        id: 'mistralai/mistral-7b-instruct:free',
        prompt: (text) => `[INST] Translate this to French:\n${text} [/INST]`
    },
    {
        name: 'Nous Capybara 7B',
        id: 'nousresearch/nous-capybara-7b:free',
        prompt: (text) => `USER: Translate to French:\n${text}\n\nASSISTANT:`
    },
    {
        name: 'Zephyr 7B Beta',
        id: 'huggingfaceh4/zephyr-7b-beta:free',
        prompt: (text) => `<|user|>\nTranslate to French:\n${text}</s>\n<|assistant|>\n`
    }
];

async function callOpenRouter(apiKey, model, text) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://hakolkolrabenou.com',
            'X-Title': 'Hakol Kol Rabenou',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: model.id,
            messages: [{
                role: 'user',
                content: model.prompt(text)
            }],
            max_tokens: 1000,
            temperature: 0.3
        })
    });
    
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`HTTP ${response.status}: ${error}`);
    }
    
    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim();
}

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

        // Limiter à 500 caractères pour traduction progressive
        const textToTranslate = text.length > 500 ? text.substring(0, 500) : text;
        
        console.log(`🔄 OpenRouter Multi-Model Translate (${textToTranslate.length} chars):`, textToTranslate.substring(0, 50) + '...');

        const apiKey = process.env.OPENROUTER_API_KEY;
        
        if (!apiKey) {
            console.error('❌ OPENROUTER_API_KEY not configured');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'API key not configured' })
            };
        }

        // Essayer chaque modèle dans l'ordre jusqu'à ce qu'un fonctionne
        let lastError = null;
        
        for (let i = 0; i < FREE_MODELS.length; i++) {
            const model = FREE_MODELS[i];
            console.log(`🔌 Trying model ${i+1}/${FREE_MODELS.length}: ${model.name}...`);
            
            try {
                const translation = await callOpenRouter(apiKey, model, textToTranslate);
                
                if (translation && translation.length > 10 && translation !== textToTranslate) {
                    console.log(`✅ Success with ${model.name}:`, translation.substring(0, 50) + '...');
                    
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({ 
                            french: translation,
                            model: model.name 
                        })
                    };
                } else {
                    console.log(`⚠️ ${model.name}: Invalid response`);
                }
                
            } catch (error) {
                console.error(`❌ ${model.name} failed:`, error.message);
                lastError = error;
            }
        }

        // Si tous les modèles ont échoué
        console.error('❌ All models failed');
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'All translation models failed',
                details: lastError?.message 
            })
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
