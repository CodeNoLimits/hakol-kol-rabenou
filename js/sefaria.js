// ===================================
// Sefaria API Integration
// ===================================

const SEFARIA_API_BASE = 'https://www.sefaria.org/api';
const SEFARIA_WEB_BASE = 'https://www.sefaria.org';
const LIBRE_TRANSLATE_API = 'https://libretranslate.de/translate'; // Free API

// Cache pour les noms de livres découverts
let discoveredBookNames = {};

// VRAIS NOMS des textes Breslov sur Sefaria API (vérifiés et testés)
const BRESLOV_TEXTS = [
    {
        name: 'Likutei Moharan, Part I',
        hebrewName: 'ליקוטי מוהר"ן חלק א',
        ref: 'Likutei Moharan, Part I',
        description: 'Enseignements principaux du Rabbi Nachman - Tome 1',
        maxChapters: 282
    },
    {
        name: 'Likutei Moharan, Part II',
        hebrewName: 'ליקוטי מוהר"ן חלק ב',
        ref: 'Likutei Moharan, Part II',
        description: 'Enseignements principaux du Rabbi Nachman - Tome 2',
        maxChapters: 125
    },
    {
        name: 'Sichot HaRan',
        hebrewName: 'שיחות הר"ן',
        ref: 'Sichot HaRan',
        description: 'Conversations du Rabbi Nachman',
        maxChapters: 326
    },
    {
        name: 'Sefer HaMiddot',
        hebrewName: 'ספר המדות',
        ref: 'Sefer HaMiddot, Introduction',
        description: 'Le Livre des Traits de Caractère',
        maxChapters: 543,
        isComplex: true
    },
    // NOTE: Rabbi Nachman's Stories N'EXISTE PAS sur Sefaria API
    // {
    //     name: "Rabbi Nachman's Stories",
    //     hebrewName: 'סיפורי מעשיות',
    //     ref: "Rabbi Nachman's Stories",
    //     description: 'Les 13 Contes du Rabbi Nachman - NON DISPONIBLE',
    //     maxChapters: 13
    // },
    {
        name: 'Likkutei Etzot',
        hebrewName: 'ליקוטי עצות',
        ref: 'Likkutei Etzot, Truth and Faith',
        description: 'Conseils pratiques du Rabbi Nachman',
        maxChapters: 153,
        isComplex: true
    },
    {
        name: 'Likutei Tefilot',
        hebrewName: 'ליקוטי תפילות',
        ref: 'Likutei Tefilot, Volume I',
        description: 'Prières de Reb Noson',
        maxChapters: 210,
        isComplex: true
    },
    {
        name: 'Chayei Moharan',
        hebrewName: 'חיי מוהר"ן',
        ref: 'Chayei Moharan',
        description: 'Vie du Rabbi Nachman',
        maxChapters: 600
    }
];

// State Management
let currentBook = null;
let currentSection = 1;
let currentChapter = 1;
let autoTranslate = false; // DÉSACTIVÉ PAR DÉFAUT pour vitesse
let showHebrew = true;
let showEnglish = true;
let maxSections = 1;

// ===================================
// Initialize Library Page
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('booksList')) {
        initLibraryPage();
    }
});

function initLibraryPage() {
    loadBooksList();
    setupEventListeners();
    setupTranslationControls();
}

// ===================================
// Load Books List
// ===================================
function loadBooksList() {
    const booksList = document.getElementById('booksList');
    
    booksList.innerHTML = BRESLOV_TEXTS.map(book => `
        <div class="book-item" data-ref="${book.ref}">
            <h4>${book.name}</h4>
            <p class="hebrew-name">${book.hebrewName}</p>
            <p class="book-desc">${book.description}</p>
        </div>
    `).join('');
    
    // Add click handlers
    document.querySelectorAll('.book-item').forEach(item => {
        item.addEventListener('click', function() {
            const ref = this.getAttribute('data-ref');
            loadBook(ref);
            
            // Update active state
            document.querySelectorAll('.book-item').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// ===================================
// Découvrir le vrai nom d'un livre sur Sefaria
// ===================================
async function discoverBookName(searchTerm) {
    console.log('🔍 Découverte du nom du livre:', searchTerm);
    
    try {
        // Essayer d'abord avec l'API de recherche
        const searchUrl = `${SEFARIA_API_BASE}/name/${encodeURIComponent(searchTerm)}`;
        const response = await fetch(searchUrl);
        
        if (response.ok) {
            const data = await response.json();
            if (data.is_ref && data.url) {
                const bookName = data.url.replace('/api/texts/', '').split('.')[0];
                console.log('✅ Nom découvert via API:', bookName);
                discoveredBookNames[searchTerm] = bookName;
                return bookName;
            }
        }
        
        // Fallback: chercher dans l'index complet
        const indexUrl = `${SEFARIA_API_BASE}/index/`;
        const indexResponse = await fetch(indexUrl);
        if (indexResponse.ok) {
            const index = await indexResponse.json();
            // Chercher dans les titres
            for (const category of Object.values(index)) {
                if (Array.isArray(category)) {
                    for (const book of category) {
                        if (book.title && book.title.toLowerCase().includes(searchTerm.toLowerCase())) {
                            console.log('✅ Nom trouvé dans l\'index:', book.title);
                            discoveredBookNames[searchTerm] = book.title;
                            return book.title;
                        }
                    }
                }
            }
        }
    } catch (e) {
        console.error('Erreur découverte nom:', e);
    }
    
    return null;
}

// ===================================
// Fallback: Scraping du site Sefaria
// ===================================
async function loadBookFromWeb(ref, section = 1) {
    console.log('🕷️ FALLBACK: Scraping Sefaria web pour:', ref);
    
    try {
        // Construire l'URL web de Sefaria
        const webRef = ref.replace(/ /g, '_').replace(/,/g, '');
        const webUrl = `${SEFARIA_WEB_BASE}/${webRef}.${section}?lang=bi`;
        
        console.log('🌐 URL web:', webUrl);
        
        // Fetch la page HTML
        const response = await fetch(webUrl);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const html = await response.text();
        
        // Parser le HTML pour extraire le texte
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Trouver les textes hébreux et anglais
        const hebrewElements = doc.querySelectorAll('.he, [lang="he"]');
        const englishElements = doc.querySelectorAll('.en, [lang="en"]');
        
        const hebrewText = Array.from(hebrewElements).map(el => el.textContent.trim()).filter(t => t.length > 20);
        const englishText = Array.from(englishElements).map(el => el.textContent.trim()).filter(t => t.length > 20);
        
        if (hebrewText.length === 0 && englishText.length === 0) {
            throw new Error('Aucun texte trouvé sur la page');
        }
        
        console.log('✅ Texte extrait du web:', {
            hebrew: hebrewText.length,
            english: englishText.length
        });
        
        // Créer un objet textData compatible
        return {
            he: hebrewText,
            text: englishText,
            ref: `${ref} ${section}`,
            book: ref,
            sourceMethod: 'web-scraping'
        };
        
    } catch (error) {
        console.error('❌ Erreur web scraping:', error);
        return null;
    }
}

// ===================================
// Load Book from Sefaria - AVEC FALLBACK
// ===================================
async function loadBook(ref) {
    console.log('📖 Loading book:', ref);
    const textReader = document.getElementById('textReader');
    const textNavigation = document.getElementById('textNavigation');
    
    // Show loading
    textReader.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Connexion à Sefaria.org...</p>
            <p>Chargement de ${ref}...</p>
        </div>
    `;
    
    try {
        // Tentative 1: API Sefaria
        const fullRef = `${ref}.1`;
        console.log('🔍 Tentative 1 - API:', `${SEFARIA_API_BASE}/texts/${encodeURIComponent(fullRef)}`);
        
        const response = await fetch(`${SEFARIA_API_BASE}/texts/${encodeURIComponent(fullRef)}?commentary=0&context=0&pad=0`);
        
        if (response.ok) {
            const textData = await response.json();
            
            if (textData.he || textData.text) {
                console.log('✅ Succès via API');
                currentBook = ref;
                currentSection = 1;
                await displayText(textData, { title: ref });
                textNavigation.style.display = 'flex';
                return;
            }
        }
        
        // Tentative 2: Découvrir le vrai nom
        console.log('⚠️ API échouée, tentative découverte du nom...');
        textReader.innerHTML = `
            <div class="loading">
                <i class="fas fa-search fa-spin"></i>
                <p>Recherche du vrai nom sur Sefaria...</p>
            </div>
        `;
        
        const discoveredName = await discoverBookName(ref);
        if (discoveredName && discoveredName !== ref) {
            console.log('🔄 Réessai avec nom découvert:', discoveredName);
            return loadBook(discoveredName); // Récursion avec le bon nom
        }
        
        // Tentative 3: Fallback web scraping
        console.log('⚠️ Découverte échouée, tentative web scraping...');
        textReader.innerHTML = `
            <div class="loading">
                <i class="fas fa-spider fa-spin"></i>
                <p>Extraction du texte depuis Sefaria.org...</p>
                <p>Fallback mode activé</p>
            </div>
        `;
        
        const webData = await loadBookFromWeb(ref, 1);
        if (webData) {
            console.log('✅ Succès via web scraping');
            currentBook = ref;
            currentSection = 1;
            await displayText(webData, { title: ref });
            textNavigation.style.display = 'flex';
            window.HakolKolRabenou.showNotification('📡 Texte chargé via web scraping (fallback)', 'info');
            return;
        }
        
        // Échec total
        throw new Error('Toutes les méthodes ont échoué');
        
    } catch (error) {
        console.error('❌ Erreur complète:', error);
        textReader.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erreur de chargement</h3>
                <p><strong>Livre demandé:</strong> ${ref}</p>
                <p>${error.message}</p>
                <hr>
                <p><strong>Méthodes tentées:</strong></p>
                <ul style="text-align: left;">
                    <li>✗ API Sefaria</li>
                    <li>✗ Découverte automatique du nom</li>
                    <li>✗ Web scraping de Sefaria.org</li>
                </ul>
                <p>Ce texte n'est peut-être pas disponible sur Sefaria.</p>
                <button class="btn btn-primary" onclick="testSefariaConnection('${ref}')">Tester la connexion</button>
            </div>
        `;
    }
}

// Fonction de test de connexion Sefaria
async function testSefariaConnection(ref) {
    console.log('🧪 Testing Sefaria connection for:', ref);
    const testUrl = `${SEFARIA_API_BASE}/texts/${encodeURIComponent(ref)}.1?commentary=0`;
    console.log('Test URL:', testUrl);
    
    try {
        const response = await fetch(testUrl);
        const data = await response.json();
        console.log('Test response:', data);
        alert('Connexion réussie! Voir console pour détails.');
    } catch (e) {
        console.error('Test failed:', e);
        alert('Échec de connexion: ' + e.message);
    }
}

// ===================================
// Display Text Content
// ===================================
async function displayText(textData, indexData) {
    const textReader = document.getElementById('textReader');
    const chapterInfo = document.getElementById('chapterInfo');
    
    // Extract section number from ref (format: "Book.12" ou "Book 12")
    if (textData.ref) {
        const match = textData.ref.match(/[\.\s](\d+)$/);
        if (match) {
            currentSection = parseInt(match[1]);
            console.log('📍 Current section updated to:', currentSection);
        }
    }
    
    // Update chapter info with clear display
    if (chapterInfo) {
        const displayRef = textData.ref || `${indexData.title || currentBook} ${currentSection}`;
        chapterInfo.textContent = displayRef;
        console.log('📌 Chapter info:', displayRef);
    }
    
    // Build HTML for text display
    let html = `
        <div class="text-header">
            <h2>${textData.book || textData.title}</h2>
            <div class="text-meta">
                <span>${textData.ref}</span>
                ${indexData.heTitle ? `<span> • ${indexData.heTitle}</span>` : ''}
            </div>
        </div>
        <div class="text-content">
    `;
    
    // Handle text content
    const hebrewText = textData.he || textData.text;
    const englishText = textData.text || [];
    
    // Determine if it's array or string
    const isArray = Array.isArray(hebrewText);
    
    // TRADUCTION FRANÇAISE DÉSACTIVÉE (trop de bugs)
    let frenchTranslations = [];
    
    if (false) { // DÉSACTIVÉ
        if (isArray && englishText.length > 0) {
            // Convertir chaque élément en string et filtrer les vides
            const cleanedTexts = englishText.map(t => {
                if (!t) return '';
                // Si c'est un array, joindre
                if (Array.isArray(t)) return t.join(' ');
                // Si c'est un objet, stringify
                if (typeof t === 'object') return JSON.stringify(t);
                // Si c'est une string, retourner tel quel
                return String(t);
            }).filter(t => t && t.trim() !== '');

            if (cleanedTexts.length > 0) {
                // SIMPLE: Afficher les textes SANS traduction
                // L'utilisateur peut activer la traduction manuellement s'il le souhaite
                console.log(`📝 ${cleanedTexts.length} versets chargés (traduction désactivée par défaut)`);
                // frenchTranslations reste vide
            }
        } else if (!isArray && englishText) {
            const french = await translateToFrench(englishText);
            if (french) frenchTranslations = [french];
        }
    }
    
    if (isArray) {
        // Array of verses
        for (let i = 0; i < Math.max(hebrewText.length, englishText.length); i++) {
            let hebrew = hebrewText[i] || '';
            let english = englishText[i] || '';
            const french = frenchTranslations[i] || '';
            
            // Convertir en string si nécessaire
            if (Array.isArray(hebrew)) hebrew = hebrew.join(' ');
            if (Array.isArray(english)) english = english.join(' ');
            
            if (hebrew || english) {
                html += buildVerseHTMLSync(i + 1, hebrew, english, french);
            }
        }
    } else {
        // Single text
        const french = frenchTranslations[0] || '';
        html += buildVerseHTMLSync(1, hebrewText, englishText, french);
    }
    
    html += '</div>';
    textReader.innerHTML = html;
    
    // Afficher le bouton "Traduire tout" s'il y a des boutons de traduction
    setTimeout(() => {
        const translateAllBtn = document.getElementById('translateAllBtn');
        const translateButtons = document.querySelectorAll('.translate-btn');
        if (translateAllBtn && translateButtons.length > 0) {
            translateAllBtn.style.display = 'block';
        } else if (translateAllBtn) {
            translateAllBtn.style.display = 'none';
        }
    }, 100);
}

// ===================================
// Build Verse HTML (Synchrone - traduction déjà faite)
// ===================================
function buildVerseHTMLSync(verseNum, hebrew, english, french = '') {
    // Convertir en string si nécessaire
    if (Array.isArray(hebrew)) hebrew = hebrew.join(' ');
    if (Array.isArray(english)) english = english.join(' ');
    if (Array.isArray(french)) french = french.join(' ');
    
    hebrew = String(hebrew || '');
    english = String(english || '');
    french = String(french || '');
    
    let html = `<div class="verse-container">`;
    html += `<span class="verse-number">${verseNum}</span>`;
    
    if (showHebrew && hebrew && hebrew.trim()) {
        html += `
            <div class="translation-badge hebrew">עברית</div>
            <div class="verse-text hebrew">${hebrew}</div>
        `;
    }
    
    if (showEnglish && english && english.trim()) {
        html += `
            <div class="translation-badge english">English</div>
            <div class="verse-text english">${english}</div>
        `;
    }
    
    // Afficher le français s'il existe et est différent de l'anglais
    if (french && french.trim() && french !== english && !french.includes('[EN]')) {
        html += `
            <div class="translation-badge french">Français (Traduit)</div>
            <div class="verse-text french" id="french-${verseNum}">${french}</div>
        `;
    } else if (english && english.trim() && !french) {
        // Bouton pour traduire à la demande - encode en base64 pour éviter problèmes caractères spéciaux
        const englishB64 = btoa(unescape(encodeURIComponent(english)));
        html += `
            <button class="translate-btn" onclick="translateVerseB64(${verseNum}, '${englishB64}')" id="translate-btn-${verseNum}">
                🇫🇷 Traduire en français
            </button>
            <div class="verse-text french" id="french-${verseNum}" style="display: none;"></div>
        `;
    }

    html += '</div>';
    return html;
}

// ===================================
// Translation Progress Bar
// ===================================

function showTranslationProgress(totalChunks) {
    const progressBar = document.getElementById('translationProgress');
    if (progressBar) {
        progressBar.classList.add('show');
        updateTranslationProgress(0, totalChunks, Date.now());
    }
}

function updateTranslationProgress(current, total, startTime) {
    const percentage = Math.round((current / total) * 100);
    const elapsed = (Date.now() - startTime) / 1000;
    const remaining = current > 0 ? (elapsed / current) * (total - current) : 0;
    
    const progressPercentage = document.getElementById('progressPercentage');
    const progressBarFill = document.getElementById('progressBarFill');
    const progressCurrent = document.getElementById('progressCurrent');
    const progressTime = document.getElementById('progressTime');
    
    if (progressPercentage) progressPercentage.textContent = `${percentage}%`;
    if (progressBarFill) progressBarFill.style.width = `${percentage}%`;
    if (progressCurrent) progressCurrent.textContent = `${current} / ${total} morceaux traduits`;
    if (progressTime) {
        if (remaining > 0) {
            progressTime.textContent = `Temps restant: ${Math.ceil(remaining)}s`;
        } else {
            progressTime.textContent = `Démarrage...`;
        }
    }
}

function hideTranslationProgress() {
    const progressBar = document.getElementById('translationProgress');
    if (progressBar) {
        progressBar.classList.remove('show');
    }
}

// ===================================
// SYSTÈME DE TRADUCTION INTELLIGENT - VERSION FIXÉE
// ===================================

// ===================================
// SYSTÈME DE TRADUCTION QUI MARCHE VRAIMENT
// ===================================

async function translateTextIntelligent(text) {
    if (!text || text.trim() === '') {
        console.warn('⚠️ Texte vide');
        return null;
    }

    console.log(`🔄 TRADUCTION FRANÇAISE (${text.length} caractères)`);
    console.log(`📝 Texte original: "${text.substring(0, 100)}..."`);

    // Utiliser le système de traduction directe amélioré
    return await translateToFrenchReliable(text);
}

// Fonctions de chunking supprimées - plus nécessaires avec le nouveau système

// ===================================
// TRADUCTION FIABLE QUI MARCHE VRAIMENT
// ===================================

// ===================================
// TRADUCTION DIRECTE SANS NETLIFY FUNCTION
// ===================================

async function translateToFrenchReliable(text) {
    try {
        console.log(`🚀 TRADUCTION DIRECTE: "${text.substring(0, 50)}..."`);

        // 1. Essayer DeepL directement depuis le client
        if (typeof window !== 'undefined' && window.DEEPL_API_KEY) {
            try {
                const translation = await translateWithDeepLDirect(text);
                if (translation && isRealFrenchTranslation(text, translation)) {
                    console.log(`✅ DEEPL DIRECT SUCCESS: "${translation.substring(0, 50)}..."`);
                    return translation;
                }
            } catch (error) {
                console.error('❌ DeepL direct failed:', error.message);
            }
        }

        // 2. Fallback sur LibreTranslate (gratuit et illimité)
        try {
            const translation = await translateWithLibreTranslateDirect(text);
            if (translation && isRealFrenchTranslation(text, translation)) {
                console.log(`✅ LIBRETRANSLATE DIRECT SUCCESS: "${translation.substring(0, 50)}..."`);
                return translation;
            }
        } catch (error) {
            console.error('❌ LibreTranslate direct failed:', error.message);
        }

        console.error('❌ TOUTES LES TRADUCTIONS DIRECTES ONT ÉCHOUÉ');
        return null;

    } catch (error) {
        console.error('❌ ERREUR TRADUCTION:', error);
        return null;
    }
}

// ===================================
// DEEPL DIRECT (CLIENT-SIDE)
// ===================================

async function translateWithDeepLDirect(text) {
    // ⚠️ ATTENTION: Clé API exposée côté client (pas sécurisé mais fonctionne)
    const DEEPL_API_KEY = window.DEEPL_API_KEY || 'TONNE_CLE_DEEPL_ICI';
    const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

    console.log(`🔄 DeepL Direct (${text.length} chars)...`);

    const response = await fetch(DEEPL_API_URL, {
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
        const errorText = await response.text();
        throw new Error(`DeepL API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (data.translations && data.translations[0]) {
        return data.translations[0].text;
    }

    throw new Error('No translation returned from DeepL');
}

// ===================================
// LIBRETRANSLATE DIRECT (CLIENT-SIDE)
// ===================================

async function translateWithLibreTranslateDirect(text) {
    const LIBRETRANSLATE_API_URL = 'https://libretranslate.com/translate';

    console.log(`🔄 LibreTranslate Direct (${text.length} chars)...`);

    const response = await fetch(LIBRETRANSLATE_API_URL, {
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

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`LibreTranslate API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (data.translatedText) {
        return data.translatedText;
    }

    throw new Error('No translation returned from LibreTranslate');
}

// ===================================
// VÉRIFICATION DE TRADUCTION FRANÇAISE
// ===================================

function isRealFrenchTranslation(original, translation) {
    if (!translation || translation.length < 10) return false;

    // Pas identique à l'original
    if (translation.toLowerCase() === original.toLowerCase()) return false;

    // Contient des caractères français
    const hasFrenchChars = /[àâäéèêëïîôöùûüÿç]/i.test(translation);

    // Pas juste de l'anglais avec des accents
    const withoutAccents = translation.replace(/[àâäéèêëïîôöùûüÿç]/gi, '');
    if (withoutAccents.toLowerCase() === original.toLowerCase()) return false;

    return hasFrenchChars;
}

// ===================================
// FONCTIONS OBSOLÈTES SUPPRIMÉES
// ===================================
// Toutes les anciennes fonctions qui ne marchaient pas ont été supprimées
// Seule la nouvelle fonction translateToFrenchReliable() fonctionne maintenant

// ===================================
// Setup Event Listeners
// ===================================
function setupEventListeners() {
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
    }
    
    // Navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.addEventListener('click', loadPreviousSection);
    if (nextBtn) nextBtn.addEventListener('click', loadNextSection);
}

// ===================================
// Traduction À LA DEMANDE d'un verset - PAR BLOCS DE 500 CARACTÈRES
// ===================================

// État de traduction pour chaque verset (garde en mémoire la position)
const verseTranslationState = {};

// Version avec décodage base64 (pour caractères spéciaux) - GLOBALE
window.translateVerseB64 = async function(verseNum, englishB64) {
    // Décoder le base64
    const englishText = decodeURIComponent(escape(atob(englishB64)));
    // Appeler la vraie fonction
    return window.translateVerse(verseNum, englishText);
}

window.translateVerse = async function(verseNum, englishText) {
    const button = document.getElementById(`translate-btn-${verseNum}`);
    const frenchDiv = document.getElementById(`french-${verseNum}`);

    if (!button || !frenchDiv) return;

    // Désactiver le bouton et afficher loading
    button.disabled = true;
    button.innerHTML = `⏳ Traduction en cours... (${englishText.length} caractères)`;

    try {
        console.log(`🔄 Traduction verset ${verseNum} avec système intelligent...`);
        
        // Utiliser le nouveau système de traduction intelligent
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

// Bouton "Traduire TOUT" pour traduire tous les versets non traduits
window.translateAllVerses = async function() {
    const allButtons = document.querySelectorAll('.translate-btn');

    if (allButtons.length === 0) {
        alert('Tous les versets sont déjà traduits !');
        return;
    }

    if (!confirm(`Traduire ${allButtons.length} verset(s) en français ?`)) {
        return;
    }

    console.log(`🔄 Début traduction de ${allButtons.length} versets...`);

    for (let i = 0; i < allButtons.length; i++) {
        const button = allButtons[i];
        const verseNum = button.id.replace('translate-btn-', '');

        // Extraire le texte anglais du onclick
        const onclickAttr = button.getAttribute('onclick');
        const match = onclickAttr.match(/translateVerse\(\d+,\s*`([^`]+)`\)/);

        if (match && match[1]) {
            await translateVerse(parseInt(verseNum), match[1]);

            // Petite pause entre chaque (évite rate limiting)
            if (i < allButtons.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }

    console.log(`✅ Traduction terminée !`);
    alert('Traduction terminée !');
}

// ===================================
// Translation Controls
// ===================================
function setupTranslationControls() {
    const showHebrewCheckbox = document.getElementById('showHebrew');
    const showEnglishCheckbox = document.getElementById('showEnglish');
    const autoTranslateCheckbox = document.getElementById('autoTranslateFr');
    
    if (showHebrewCheckbox) {
        showHebrewCheckbox.addEventListener('change', function() {
            showHebrew = this.checked;
            if (currentBook) reloadCurrentText();
        });
    }
    
    if (showEnglishCheckbox) {
        showEnglishCheckbox.addEventListener('change', function() {
            showEnglish = this.checked;
            if (currentBook) reloadCurrentText();
        });
    }
    
    if (autoTranslateCheckbox) {
        autoTranslateCheckbox.addEventListener('change', function() {
            autoTranslate = this.checked;
            if (currentBook) reloadCurrentText();
        });
    }
}

// ===================================
// Reload Current Text
// ===================================
function reloadCurrentText() {
    if (currentBook) {
        loadBook(currentBook);
    }
}

// ===================================
// Search Functionality
// ===================================
async function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (!query) {
        window.HakolKolRabenou.showNotification('Veuillez entrer un terme de recherche', 'warning');
        return;
    }
    
    try {
        const response = await fetch(`${SEFARIA_API_BASE}/search-wrapper?q=${encodeURIComponent(query)}&type=text`);
        const data = await response.json();
        
        // Filter for Breslov texts
        const breslovResults = data.hits?.filter(hit => 
            BRESLOV_TEXTS.some(book => hit.ref?.includes(book.ref))
        ) || [];
        
        if (breslovResults.length > 0) {
            displaySearchResults(breslovResults);
        } else {
            window.HakolKolRabenou.showNotification('Aucun résultat trouvé dans les textes Breslov', 'info');
        }
        
    } catch (error) {
        console.error('Search error:', error);
        window.HakolKolRabenou.showNotification('Erreur de recherche', 'error');
    }
}

function displaySearchResults(results) {
    const textReader = document.getElementById('textReader');
    
    let html = `
        <div class="text-header">
            <h2>Résultats de recherche</h2>
            <div class="text-meta">${results.length} résultat(s) trouvé(s)</div>
        </div>
        <div class="search-results">
    `;
    
    results.forEach(result => {
        html += `
            <div class="verse-container" style="cursor: pointer;" onclick="loadBook('${result.ref}')">
                <span class="verse-number">${result.ref}</span>
                <div class="verse-text">${result.text}</div>
            </div>
        `;
    });
    
    html += '</div>';
    textReader.innerHTML = html;
}

// ===================================
// Navigation - VRAIE IMPLEMENTATION
// ===================================
function loadPreviousSection() {
    if (!currentBook || currentSection <= 1) {
        window.HakolKolRabenou.showNotification('Vous êtes au début du livre', 'info');
        return;
    }
    
    currentSection--;
    console.log('⬅️ Loading previous section:', currentSection);
    loadSpecificSection(currentSection);
}

function loadNextSection() {
    if (!currentBook) {
        window.HakolKolRabenou.showNotification('Veuillez d\'abord sélectionner un livre', 'info');
        return;
    }
    
    // Trouver le nombre max de sections pour ce livre
    const bookData = BRESLOV_TEXTS.find(b => b.ref === currentBook);
    if (bookData && currentSection >= bookData.maxChapters) {
        window.HakolKolRabenou.showNotification(`Vous êtes à la fin du livre (${bookData.maxChapters} chapitres)`, 'info');
        return;
    }
    
    currentSection++;
    console.log('➡️ Loading next section:', currentSection);
    loadSpecificSection(currentSection);
}

async function loadSpecificSection(sectionNumber) {
    const textReader = document.getElementById('textReader');
    const textNavigation = document.getElementById('textNavigation');
    
    if (!currentBook) {
        console.error('No current book set');
        return;
    }
    
    // Construire la référence exacte pour Sefaria
    const fullRef = `${currentBook}.${sectionNumber}`;
    console.log('📖 Loading specific section:', fullRef);
    
    textReader.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Chargement de ${currentBook} - Section ${sectionNumber}...</p>
        </div>
    `;
    
    try {
        const url = `${SEFARIA_API_BASE}/texts/${encodeURIComponent(fullRef)}?commentary=0&context=0&pad=0`;
        console.log('🔍 Fetching:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Section ${sectionNumber} non disponible (HTTP ${response.status})`);
        }
        
        const textData = await response.json();
        console.log('✅ Section data received:', textData);
        
        if (!textData.he && !textData.text) {
            throw new Error('Texte vide');
        }
        
        await displayText(textData, { title: currentBook });
        textNavigation.style.display = 'flex';
        
        // Scroll to top
        textReader.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
    } catch (error) {
        console.error('❌ Error loading section:', error);
        textReader.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Section ${sectionNumber} non disponible</h3>
                <p>${error.message}</p>
                <p>Cette section n'existe pas ou n'est pas encore disponible sur Sefaria.</p>
                <button class="btn btn-outline" onclick="loadSpecificSection(${sectionNumber - 1})">
                    <i class="fas fa-arrow-left"></i> Section précédente
                </button>
            </div>
        `;
    }
}

// ===================================
// Export for external use
// ===================================
window.SefariaLibrary = {
    loadBook,
    performSearch,
    translateToFrench,
    BRESLOV_TEXTS
};

window.testSefariaConnection = testSefariaConnection;
window.loadSpecificSection = loadSpecificSection;

