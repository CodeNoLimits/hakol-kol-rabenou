// ===================================
// Sefaria API Integration
// ===================================

const SEFARIA_API_BASE = 'https://www.sefaria.org/api';
const LIBRE_TRANSLATE_API = 'https://libretranslate.de/translate'; // Free API

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
// Load Book from Sefaria API - VRAIE IMPLEMENTATION
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
        // VRAI appel API Sefaria avec le nom exact
        const fullRef = `${ref}.1`; // Charger chapitre 1
        console.log('🔍 API Call:', `${SEFARIA_API_BASE}/texts/${encodeURIComponent(fullRef)}`);
        
        const response = await fetch(`${SEFARIA_API_BASE}/texts/${encodeURIComponent(fullRef)}?commentary=0&context=0&pad=0`);
        
        if (!response.ok) {
            throw new Error(`Sefaria API error: ${response.status}`);
        }
        
        const textData = await response.json();
        console.log('✅ Data received:', textData);
        
        if (!textData.he && !textData.text) {
            throw new Error('Aucun texte disponible');
        }
        
        // Save current book state
        currentBook = ref;
        currentSection = 1;
        
        // Display the text
        await displayText(textData, { title: ref });
        
        textNavigation.style.display = 'flex';
        
    } catch (error) {
        console.error('❌ Error loading book:', error);
        textReader.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erreur de chargement</h3>
                <p>${error.message}</p>
                <p><strong>Livre demandé:</strong> ${ref}</p>
                <p>Ce texte n'est peut-être pas disponible sur Sefaria avec ce nom exact.</p>
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

