// ===================================
// SYSTÈME DE TRADUCTION FRANÇAIS INTELLIGENT
// Version corrigée - Fix erreur 414 URI Too Long
// ===================================

console.log('🔧 Système de traduction français chargé');

// ===================================
// CHUNKING INTELLIGENT
// ===================================

/**
 * Découpe un texte en morceaux intelligents
 * @param {string} text - Texte à découper
 * @param {number} maxLength - Taille maximale par morceau (défaut: 400)
 * @returns {string[]} - Tableau de morceaux
 */
function splitTextIntelligent(text, maxLength = 400) {
    if (!text || text.length <= maxLength) {
        return [text];
    }

    console.log(`✂️ Découpage texte (${text.length} car.) en morceaux de ${maxLength} car. max`);

    const chunks = [];
    const sentences = text.split(/(?<=[.!?])\s+/); // Découper par phrases
    let currentChunk = '';

    for (const sentence of sentences) {
        // Si une phrase est trop longue, la découper par mots
        if (sentence.length > maxLength) {
            if (currentChunk) {
                chunks.push(currentChunk.trim());
                currentChunk = '';
            }

            const words = sentence.split(' ');
            for (const word of words) {
                if ((currentChunk + ' ' + word).length > maxLength) {
                    if (currentChunk) {
                        chunks.push(currentChunk.trim());
                    }
                    currentChunk = word;
                } else {
                    currentChunk += (currentChunk ? ' ' : '') + word;
                }
            }
        } else {
            // Ajouter la phrase au chunk actuel si ça rentre
            if ((currentChunk + ' ' + sentence).length > maxLength) {
                chunks.push(currentChunk.trim());
                currentChunk = sentence;
            } else {
                currentChunk += (currentChunk ? ' ' : '') + sentence;
            }
        }
    }

    if (currentChunk) {
        chunks.push(currentChunk.trim());
    }

    const finalChunks = chunks.filter(c => c.length > 0);
    console.log(`✅ ${finalChunks.length} morceaux créés`);

    return finalChunks;
}

// ===================================
// TRADUCTION D'UN SEUL MORCEAU
// ===================================

/**
 * Traduit un seul morceau de texte via la fonction Netlify
 * Utilise POST pour éviter l'erreur 414
 */
async function translateSingleChunk(chunk) {
    if (!chunk || chunk.trim() === '') {
        console.warn('⚠️ Chunk vide ignoré');
        return null;
    }

    try {
        console.log(`🔄 Traduction chunk (${chunk.length} car.): "${chunk.substring(0, 50)}..."`);

        // Essayer d'abord translate-ultimate (5 APIs), fallback sur translate
        let response;
        try {
            response = await fetch('/.netlify/functions/translate-ultimate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: chunk })
            });
        } catch (err) {
            console.warn('⚠️ translate-ultimate failed, trying translate...', err.message);
            response = await fetch('/.netlify/functions/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: chunk })
            });
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ HTTP ${response.status}:`, errorText);
            return null;
        }

        const data = await response.json();

        if (!data || !data.french) {
            console.error('❌ Pas de champ "french" dans la réponse:', data);
            return null;
        }

        const french = data.french.trim();

        // Vérifier que c'est une vraie traduction
        if (french.toLowerCase() === chunk.toLowerCase()) {
            console.warn('⚠️ Traduction identique à l\'original (pas vraiment traduit)');
            return null;
        }

        console.log(`✅ Succès: "${french.substring(0, 50)}..."`);
        return french;

    } catch (error) {
        console.error('❌ Erreur traduction chunk:', error);
        return null;
    }
}

// ===================================
// TRADUCTION AVEC CHUNKING
// ===================================

/**
 * Traduit un texte long en le découpant en morceaux
 */
async function translateTextWithChunking(text) {
    const chunks = splitTextIntelligent(text, 400);

    if (chunks.length === 0) {
        console.error('❌ Aucun chunk créé');
        return null;
    }

    console.log(`🔄 Traduction de ${chunks.length} morceaux...`);

    const translatedChunks = [];
    let successCount = 0;

    for (let i = 0; i < chunks.length; i++) {
        console.log(`[${i + 1}/${chunks.length}] Traduction en cours...`);

        const translated = await translateSingleChunk(chunks[i]);

        if (translated) {
            translatedChunks.push(translated);
            successCount++;
        } else {
            console.warn(`⚠️ Échec chunk ${i + 1}, conservation de l'original`);
            translatedChunks.push(chunks[i]); // Garder l'original si échec
        }

        // Petite pause entre chunks pour éviter rate limiting
        if (i < chunks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }

    console.log(`✅ Traduction terminée: ${successCount}/${chunks.length} morceaux traduits`);

    // Exiger au moins 50% de succès
    if (successCount < chunks.length * 0.5) {
        console.error(`❌ Trop d'échecs: ${successCount}/${chunks.length}`);
        return null;
    }

    return translatedChunks.join(' ');
}

// ===================================
// TRADUCTION INTELLIGENTE (POINT D'ENTRÉE)
// ===================================

/**
 * Point d'entrée principal pour la traduction
 * Décide automatiquement si chunking nécessaire
 */
async function translateTextIntelligent(text) {
    if (!text || text.trim() === '') {
        console.warn('⚠️ Texte vide');
        return null;
    }

    console.log(`📝 Traduction intelligente demandée (${text.length} caractères)`);

    // Toujours utiliser chunking pour textes > 400 caractères
    if (text.length > 400) {
        console.log('📏 Texte long → Chunking activé');
        return await translateTextWithChunking(text);
    } else {
        console.log('📄 Texte court → Traduction directe');
        return await translateSingleChunk(text);
    }
}

// ===================================
// FONCTION PRINCIPALE - TRADUCTION VERSET
// ===================================

/**
 * Traduit un verset et met à jour l'interface
 * Appelée par les boutons "Traduire en français"
 */
window.translateVerse = async function(verseNum, englishText) {
    console.log(`\n🎯 === TRADUCTION VERSET ${verseNum} ===`);

    const button = document.getElementById(`translate-btn-${verseNum}`);
    const frenchDiv = document.getElementById(`french-${verseNum}`);

    if (!button || !frenchDiv) {
        console.error(`❌ Éléments introuvables: btn=${!!button}, div=${!!frenchDiv}`);
        return;
    }

    // Décoder si c'est du base64
    let textToTranslate = englishText;

    // Afficher état "en cours"
    button.disabled = true;
    button.innerHTML = `⏳ Traduction... (${textToTranslate.length} car.)`;

    try {
        const french = await translateTextIntelligent(textToTranslate);

        if (french && french !== textToTranslate) {
            // ✅ SUCCÈS
            console.log(`✅ Verset ${verseNum} traduit avec succès !`);

            frenchDiv.innerHTML = french;
            frenchDiv.style.display = 'block';

            // Ajouter badge
            const badge = document.createElement('div');
            badge.className = 'translation-badge french';
            badge.textContent = 'Français (Traduit)';
            badge.style.cssText = 'background: #4CAF50; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-bottom: 8px; display: inline-block;';

            if (frenchDiv.previousElementSibling?.className !== 'translation-badge french') {
                frenchDiv.parentNode.insertBefore(badge, frenchDiv);
            }

            // Remplacer bouton par badge succès
            button.outerHTML = '<div class="translation-badge success" style="background: #2196F3; color: white; padding: 8px 12px; border-radius: 4px; font-size: 14px;">✅ Traduit</div>';

        } else {
            // ❌ ÉCHEC
            console.error(`❌ Échec traduction verset ${verseNum}`);

            button.disabled = false;
            button.innerHTML = '⚠️ Réessayer';
            button.title = 'La traduction a échoué, cliquez pour réessayer';
        }

    } catch (error) {
        console.error(`❌ Erreur critique verset ${verseNum}:`, error);

        button.disabled = false;
        button.innerHTML = '❌ Erreur';
        button.title = error.message;
    }

    console.log(`🏁 === FIN TRADUCTION VERSET ${verseNum} ===\n`);
}

// ===================================
// VERSION AVEC DÉCODAGE BASE64
// ===================================

/**
 * Version avec décodage base64 pour gérer caractères spéciaux
 * Appelée par onclick="translateVerseB64(...)"
 */
window.translateVerseB64 = async function(verseNum, englishB64) {
    console.log(`🔓 Décodage base64 pour verset ${verseNum}...`);

    try {
        const englishText = decodeURIComponent(escape(atob(englishB64)));
        console.log(`✅ Décodé: "${englishText.substring(0, 50)}..."`);

        return await window.translateVerse(verseNum, englishText);
    } catch (error) {
        console.error('❌ Erreur décodage base64:', error);
        alert('Erreur de décodage du texte');
    }
}

// ===================================
// INITIALISATION
// ===================================

console.log('✅ Système de traduction français prêt !');
console.log('📌 Fonctions disponibles:');
console.log('   - translateVerse(verseNum, englishText)');
console.log('   - translateVerseB64(verseNum, englishB64)');
console.log('   - translateTextIntelligent(text)');
