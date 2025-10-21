// ===================================
// SERVICE DE TRADUCTION QUI MARCHE VRAIMENT - DeepL API
// ===================================

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

async function translateWithDeepL(text, targetLang = 'FR') {
    console.log(`🔄 DeepL Translation (${text.length} chars):`, text.substring(0, 50) + '...');

    const response = await fetch(DEEPL_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: [text],
            target_lang: targetLang,
            source_lang: 'EN'
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DeepL API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (data.translations && data.translations[0]) {
        const translation = data.translations[0].text;
        console.log(`✅ DeepL Success:`, translation.substring(0, 50) + '...');
        return translation;
    }

    throw new Error('No translation returned from DeepL');
}

// ===================================
// BACKUP: LibreTranslate (gratuit)
// ===================================

const LIBRETRANSLATE_API_URL = 'https://libretranslate.com/translate';

async function translateWithLibreTranslate(text, targetLang = 'fr') {
    console.log(`🔄 LibreTranslate (${text.length} chars):`, text.substring(0, 50) + '...');

    const response = await fetch(LIBRETRANSLATE_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            q: text,
            source: 'en',
            target: targetLang,
            format: 'text'
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`LibreTranslate API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (data.translatedText) {
        const translation = data.translatedText;
        console.log(`✅ LibreTranslate Success:`, translation.substring(0, 50) + '...');
        return translation;
    }

    throw new Error('No translation returned from LibreTranslate');
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
        const body = JSON.parse(event.body || '{}');
        const { text, instruction } = body;

        if (!text || typeof text !== 'string') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Text parameter required' })
            };
        }

        console.log(`🚀 Translation request: ${text.length} chars`);
        console.log(`📝 Text: "${text.substring(0, 100)}..."`);

        // 1. Essayer DeepL en premier (meilleur qualité)
        if (DEEPL_API_KEY) {
            try {
                const translation = await translateWithDeepL(text, 'FR');

                // Vérifier que c'est une vraie traduction française
                if (translation && translation !== text && translation.length > 10) {
                    // Vérifier si c'est vraiment du français (pas de l'anglais avec accents)
                    const hasFrenchChars = /[àâäéèêëïîôöùûüÿç]/i.test(translation);
                    const isNotEnglish = translation.toLowerCase() !== text.toLowerCase();

                    if (hasFrenchChars && isNotEnglish) {
                        console.log(`✅ DeepL SUCCESS: "${translation.substring(0, 50)}..."`);

                        return {
                            statusCode: 200,
                            headers,
                            body: JSON.stringify({
                                french: translation,
                                model: 'DeepL',
                                method: 'DeepL API'
                            })
                        };
                    }
                }
            } catch (error) {
                console.error('❌ DeepL failed:', error.message);
            }
        }

        // 2. Fallback sur LibreTranslate (gratuit)
        try {
            const translation = await translateWithLibreTranslate(text, 'fr');

            // Vérifier que c'est une vraie traduction française
            if (translation && translation !== text && translation.length > 10) {
                const hasFrenchChars = /[àâäéèêëïîôöùûüÿç]/i.test(translation);
                const isNotEnglish = translation.toLowerCase() !== text.toLowerCase();

                if (hasFrenchChars && isNotEnglish) {
                    console.log(`✅ LibreTranslate SUCCESS: "${translation.substring(0, 50)}..."`);

                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({
                            french: translation,
                            model: 'LibreTranslate',
                            method: 'LibreTranslate API'
                        })
                    };
                }
            }
        } catch (error) {
            console.error('❌ LibreTranslate failed:', error.message);
        }

        // 3. Si tout échoue, retourner une erreur
        console.error('❌ TOUS LES SERVICES DE TRADUCTION ONT ÉCHOUÉ');

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'All translation services failed',
                text: text.substring(0, 100),
                available: {
                    deepl: !!DEEPL_API_KEY,
                    libretranslate: true
                }
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
