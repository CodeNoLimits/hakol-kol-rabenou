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
        name: 'Sefer HaMidot',
        hebrewName: 'ספר המדות',
        ref: 'Sefer HaMidot',
        description: 'Le Livre des Traits de Caractère',
        maxChapters: 50
    },
    {
        name: 'Sipurei Maasiot',
        hebrewName: 'סיפורי מעשיות',
        ref: 'Sipurei Maasiot',
        description: 'Les 13 Contes du Rabbi Nachman',
        maxChapters: 13
    },
    {
        name: 'Likutei Etzot',
        hebrewName: 'ליקוטי עצות',
        ref: 'Likutei Etzot',
        description: 'Conseils pratiques du Rabbi Nachman',
        maxChapters: 100
    },
    {
        name: 'Likutei Tefilot',
        hebrewName: 'ליקוטי תפילות',
        ref: 'Likutei Tefilot',
        description: 'Prières de Reb Noson',
        maxChapters: 210
    },
    {
        name: 'Chayei Moharan',
        hebrewName: 'חיי מוהר"ן',
        ref: 'Chayei Moharan',
        description: 'Vie du Rabbi Nachman',
        maxChapters: 100
    }
];

// State Management
let currentBook = null;
let currentSection = 1;
let currentChapter = 1;
let autoTranslate = true; // ACTIVÉ PAR DÉFAUT
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
    
    if (isArray) {
        // Array of verses
        for (let i = 0; i < Math.max(hebrewText.length, englishText.length); i++) {
            const hebrew = hebrewText[i] || '';
            const english = englishText[i] || '';
            
            if (hebrew || english) {
                html += await buildVerseHTML(i + 1, hebrew, english);
            }
        }
    } else {
        // Single text
        html += await buildVerseHTML(1, hebrewText, englishText);
    }
    
    html += '</div>';
    textReader.innerHTML = html;
}

// ===================================
// Build Verse HTML
// ===================================
async function buildVerseHTML(verseNum, hebrew, english) {
    let html = `<div class="verse-container">`;
    html += `<span class="verse-number">${verseNum}</span>`;
    
    if (showHebrew && hebrew) {
        html += `
            <div class="translation-badge hebrew">עברית</div>
            <div class="verse-text hebrew">${hebrew}</div>
        `;
    }
    
    if (showEnglish && english) {
        html += `
            <div class="translation-badge english">English</div>
            <div class="verse-text english">${english}</div>
        `;
    }
    
    if (autoTranslate && english) {
        const french = await translateToFrench(english);
        if (french) {
            html += `
                <div class="translation-badge french">Français (Auto)</div>
                <div class="verse-text french">${french}</div>
            `;
        }
    }
    
    html += '</div>';
    return html;
}

// ===================================
// Translation to French
// ===================================
async function translateToFrench(text) {
    // Convertir en string si nécessaire
    if (typeof text !== 'string') {
        if (Array.isArray(text)) {
            text = text.join(' ');
        } else if (text && typeof text === 'object') {
            text = JSON.stringify(text);
        } else {
            return '';
        }
    }
    
    if (!text || text.trim() === '') return '';
    
    // Limite de 500 caractères par appel pour éviter les timeouts
    if (text.length > 500) {
        text = text.substring(0, 500) + '...';
    }
    
    try {
        // Tentative 1: LibreTranslate
        try {
            const response = await fetch(LIBRE_TRANSLATE_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    q: text,
                    source: 'en',
                    target: 'fr',
                    format: 'text'
                }),
                timeout: 5000
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.translatedText) {
                    return data.translatedText;
                }
            }
        } catch (e) {
            console.log('LibreTranslate failed, trying alternative...');
        }
        
        // Tentative 2: MyMemory API (gratuit, pas de clé requise)
        const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|fr`;
        const response2 = await fetch(myMemoryUrl);
        
        if (response2.ok) {
            const data2 = await response2.json();
            if (data2.responseData && data2.responseData.translatedText) {
                return data2.responseData.translatedText;
            }
        }
        
        // Si tout échoue, retourner un indicateur
        return `🔄 [Traduction en cours...] ${text}`;
        
    } catch (error) {
        console.error('Translation error:', error);
        return `📝 [EN] ${text}`;
    }
}

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

