// ===================================
// SYSTÈME DE TRADUCTION INTELLIGENT - VERSION FIXÉE
// ===================================

// Fonction de traduction qui FORCE le chunking pour éviter les erreurs 414
async function translateTextIntelligent(text) {
    if (!text || text.trim() === '') {
        console.warn('⚠️ Texte vide');
        return null;
    }
    
    console.log(`🔄 Traduction intelligente (${text.length} caractères)...`);
    
    // FORCER le chunking même pour les textes courts si > 400 caractères
    if (text.length > 400) {
        console.log(`📏 Texte long détecté - Découpage forcé...`);
        return await translateTextWithChunking(text);
    } else {
        // Texte court - traduction directe
        return await translateSingleChunk(text);
    }
}

// Découpe un texte en chunks intelligents
function splitTextIntelligent(text, maxLength = 400) {
    if (text.length <= maxLength) return [text];
    
    const chunks = [];
    const sentences = text.split(/(?<=[.!?])\s+/);
    let currentChunk = '';
    
    for (const sentence of sentences) {
        if (sentence.length > maxLength) {
            // Phrase trop longue - découper par mots
            if (currentChunk) {
                chunks.push(currentChunk.trim());
                currentChunk = '';
            }
            
            const words = sentence.split(' ');
            for (const word of words) {
                if ((currentChunk + ' ' + word).length > maxLength) {
                    if (currentChunk) chunks.push(currentChunk.trim());
                    currentChunk = word;
                } else {
                    currentChunk += (currentChunk ? ' ' : '') + word;
                }
            }
        } else {
            if ((currentChunk + ' ' + sentence).length > maxLength) {
                chunks.push(currentChunk.trim());
                currentChunk = sentence;
            } else {
                currentChunk += (currentChunk ? ' ' : '') + sentence;
            }
        }
    }
    
    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks.filter(c => c.length > 0);
}

// Traduit un seul chunk
async function translateSingleChunk(chunk) {
    try {
        console.log(`🔄 Traduction chunk (${chunk.length} caractères)...`);
        
        const response = await fetch('/.netlify/functions/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: chunk })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error(`❌ HTTP ${response.status}:`, errorData);
            return null;
        }
        
        const data = await response.json();
        const french = data.french;
        
        if (!french || typeof french !== 'string') {
            console.error('❌ Pas de traduction dans la réponse');
            return null;
        }
        
        const cleanFrench = french.trim();
        
        if (cleanFrench.toLowerCase() === chunk.toLowerCase()) {
            console.warn('⚠️ Traduction identique à l\'original');
            return null;
        }
        
        console.log(`✅ SUCCÈS: "${cleanFrench.substring(0, 50)}..."`);
        return cleanFrench;
        
    } catch (error) {
        console.error('❌ Erreur:', error);
        return null;
    }
}

// Traduit un texte avec chunking
async function translateTextWithChunking(text) {
    const chunks = splitTextIntelligent(text, 400);
    console.log(`✂️ ${chunks.length} morceaux créés`);
    
    const translatedChunks = [];
    let successCount = 0;
    
    for (let i = 0; i < chunks.length; i++) {
        console.log(`🔄 Traduction morceau ${i + 1}/${chunks.length}...`);
        
        const translated = await translateSingleChunk(chunks[i]);
        
        if (translated) {
            translatedChunks.push(translated);
            successCount++;
        } else {
            translatedChunks.push(''); // Vide si échec
        }
        
        // Pause entre chunks
        if (i < chunks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }
    
    console.log(`✅ Traduction terminée: ${successCount}/${chunks.length} morceaux traduits`);
    
    if (successCount < chunks.length * 0.5) {
        console.warn(`❌ Échec de traduction: seulement ${successCount}/${chunks.length} morceaux traduits`);
        return null;
    }
    
    return translatedChunks.filter(c => c.length > 0).join(' ');
}

// ===================================
// FONCTION PRINCIPALE DE TRADUCTION
// ===================================

window.translateVerse = async function(verseNum, englishText) {
    const button = document.getElementById(`translate-btn-${verseNum}`);
    const frenchDiv = document.getElementById(`french-${verseNum}`);

    if (!button || !frenchDiv) return;

    // Désactiver le bouton et afficher loading
    button.disabled = true;
    button.innerHTML = `⏳ Traduction en cours... (${englishText.length} caractères)`;

    try {
        console.log(`🔄 Traduction verset ${verseNum} avec système intelligent...`);
        
        // Utiliser le système de traduction intelligent
        const french = await translateTextIntelligent(englishText);

        if (french && french !== englishText) {
            // Succès - afficher la traduction complète
            frenchDiv.innerHTML = french;
            frenchDiv.style.display = 'block';

            // Afficher un badge
            const badge = document.createElement('div');
            badge.className = 'translation-badge french';
            badge.textContent = 'Français (Traduit)';
            frenchDiv.parentNode.insertBefore(badge, frenchDiv);

            // Remplacer le bouton par un badge de succès
            button.outerHTML = '<div class="translation-badge success">✅ Traduction complète</div>';
            console.log(`✅ Verset ${verseNum} entièrement traduit !`);
        } else {
            // Échec de traduction
            button.disabled = false;
            button.innerHTML = '⚠️ Réessayer';
            button.title = 'La traduction a échoué, cliquez pour réessayer';

            console.warn(`❌ Échec traduction verset ${verseNum}`);
        }
    } catch (error) {
        console.error(`Erreur traduction verset ${verseNum}:`, error);

        // Afficher erreur
        button.disabled = false;
        button.innerHTML = '❌ Erreur - Réessayer';
        button.title = error.message;
    }
}

// Version avec décodage base64
window.translateVerseB64 = async function(verseNum, englishB64) {
    const englishText = decodeURIComponent(escape(atob(englishB64)));
    return window.translateVerse(verseNum, englishText);
}
