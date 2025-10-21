// =====================================
// 🎯 ULTIMATE TRANSLATION FUNCTION
// Cascade de 5 APIs pour garantir succès
// =====================================

const GOOGLE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

// =====================================
// API #1: Google Cloud Translation
// =====================================

async function translateWithGoogle(text) {
    if (!GOOGLE_API_KEY) throw new Error('No Google API key');

    console.log(`🔵 Google Translate (${text.length} chars)...`);

    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            q: text,
            source: 'en',
            target: 'fr',
            format: 'text'
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Google API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    if (data.data && data.data.translations && data.data.translations[0]) {
        const translation = data.data.translations[0].translatedText;
        console.log(`✅ Google success: "${translation.substring(0, 50)}..."`);
        return translation;
    }

    throw new Error('No translation from Google');
}

// =====================================
// API #2: DeepL
// =====================================

async function translateWithDeepL(text) {
    if (!DEEPL_API_KEY) throw new Error('No DeepL API key');

    console.log(`🟣 DeepL (${text.length} chars)...`);

    const response = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
            'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: [text],
            target_lang: 'FR',
            source_lang: 'EN'
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`DeepL error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    if (data.translations && data.translations[0]) {
        const translation = data.translations[0].text;
        console.log(`✅ DeepL success: "${translation.substring(0, 50)}..."`);
        return translation;
    }

    throw new Error('No translation from DeepL');
}

// =====================================
// API #3: LibreTranslate (Gratuit)
// =====================================

async function translateWithLibre(text) {
    console.log(`🟢 LibreTranslate (${text.length} chars)...`);

    const response = await fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            q: text,
            source: 'en',
            target: 'fr',
            format: 'text'
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`LibreTranslate error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    if (data.translatedText) {
        const translation = data.translatedText;
        console.log(`✅ Libre success: "${translation.substring(0, 50)}..."`);
        return translation;
    }

    throw new Error('No translation from LibreTranslate');
}

// =====================================
// API #4: MyMemory (Gratuit - 10,000 chars/jour)
// =====================================

async function translateWithMyMemory(text) {
    console.log(`🟡 MyMemory (${text.length} chars)...`);

    const encodedText = encodeURIComponent(text);
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|fr`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`MyMemory error: ${response.status}`);
    }

    const data = await response.json();

    if (data.responseData && data.responseData.translatedText) {
        const translation = data.responseData.translatedText;
        console.log(`✅ MyMemory success: "${translation.substring(0, 50)}..."`);
        return translation;
    }

    throw new Error('No translation from MyMemory');
}

// =====================================
// API #5: Lingva Translate (Gratuit, miroir Google)
// =====================================

async function translateWithLingva(text) {
    console.log(`🔴 Lingva (${text.length} chars)...`);

    const response = await fetch('https://lingva.ml/api/v1/en/fr/' + encodeURIComponent(text));

    if (!response.ok) {
        throw new Error(`Lingva error: ${response.status}`);
    }

    const data = await response.json();

    if (data.translation) {
        const translation = data.translation;
        console.log(`✅ Lingva success: "${translation.substring(0, 50)}..."`);
        return translation;
    }

    throw new Error('No translation from Lingva');
}

// =====================================
// VALIDATION DE TRADUCTION
// =====================================

function isValidFrenchTranslation(translation, originalText) {
    if (!translation || translation.length < 10) return false;
    if (translation === originalText) return false;
    if (translation.toLowerCase() === originalText.toLowerCase()) return false;

    // Vérifier présence de caractères français
    const hasFrenchChars = /[àâäéèêëïîôöùûüÿç]/i.test(translation);

    // Vérifier que ce n'est pas juste de l'anglais
    const commonFrenchWords = /(le|la|les|un|une|des|est|sont|dans|pour|avec|sur)/i;
    const hasFrenchWords = commonFrenchWords.test(translation);

    return hasFrenchChars || hasFrenchWords;
}

// =====================================
// CASCADE TRANSLATION
// Essaie toutes les APIs jusqu'au succès
// =====================================

async function cascadeTranslate(text) {
    const apis = [
        { name: 'Google', fn: translateWithGoogle },
        { name: 'DeepL', fn: translateWithDeepL },
        { name: 'LibreTranslate', fn: translateWithLibre },
        { name: 'MyMemory', fn: translateWithMyMemory },
        { name: 'Lingva', fn: translateWithLingva }
    ];

    const errors = [];

    for (const api of apis) {
        try {
            console.log(`\n🔄 Trying ${api.name}...`);
            const translation = await api.fn(text);

            if (isValidFrenchTranslation(translation, text)) {
                console.log(`\n✅ SUCCESS with ${api.name}!`);
                return {
                    french: translation,
                    api: api.name,
                    success: true
                };
            } else {
                console.log(`⚠️ ${api.name} returned invalid translation`);
                errors.push(`${api.name}: Invalid translation`);
            }
        } catch (error) {
            console.error(`❌ ${api.name} failed:`, error.message);
            errors.push(`${api.name}: ${error.message}`);
        }
    }

    // Toutes les APIs ont échoué
    throw new Error(`All APIs failed:\n${errors.join('\n')}`);
}

// =====================================
// HANDLER PRINCIPAL
// =====================================

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // CORS
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // Seulement POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { text } = body;

        if (!text || typeof text !== 'string') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Text parameter required' })
            };
        }

        console.log(`\n🎯 ========================================`);
        console.log(`🎯 ULTIMATE TRANSLATION REQUEST`);
        console.log(`🎯 Length: ${text.length} characters`);
        console.log(`🎯 Preview: "${text.substring(0, 100)}..."`);
        console.log(`🎯 ========================================\n`);

        const result = await cascadeTranslate(text);

        console.log(`\n🎉 ========================================`);
        console.log(`🎉 TRANSLATION COMPLETE`);
        console.log(`🎉 API Used: ${result.api}`);
        console.log(`🎉 Length: ${result.french.length} characters`);
        console.log(`🎉 Preview: "${result.french.substring(0, 100)}..."`);
        console.log(`🎉 ========================================\n`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                french: result.french,
                model: result.api,
                method: 'Cascade Translation',
                success: true
            })
        };

    } catch (error) {
        console.error(`\n❌ ULTIMATE TRANSLATION FAILED:`, error.message);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'All translation services failed',
                message: error.message,
                apis: {
                    google: !!GOOGLE_API_KEY,
                    deepl: !!DEEPL_API_KEY,
                    libre: true,
                    mymemory: true,
                    lingva: true
                }
            })
        };
    }
};
