// ===================================
// Sefaria API Integration
// ===================================

const SEFARIA_API_BASE = 'https://www.sefaria.org/api';
const LIBRE_TRANSLATE_API = 'https://libretranslate.de/translate'; // Free API

// Breslov texts available on Sefaria - COMPLETE LIST
const BRESLOV_TEXTS = [
    {
        name: 'Likutei Moharan I',
        hebrewName: 'ליקוטי מוהר"ן א',
        englishName: 'Likutei Moharan I',
        ref: 'Likutei Moharan I',
        description: 'Enseignements principaux du Rabbi Nachman - Partie 1',
        sections: 282
    },
    {
        name: 'Likutei Moharan II',
        hebrewName: 'ליקוטי מוהר"ן ב',
        englishName: 'Likutei Moharan II',
        ref: 'Likutei Moharan II',
        description: 'Enseignements principaux du Rabbi Nachman - Partie 2',
        sections: 125
    },
    {
        name: 'Sichot HaRan',
        hebrewName: 'שיחות הר"ן',
        englishName: 'Sichot HaRan',
        ref: 'Sichot HaRan',
        description: 'Conversations du Rabbi Nachman',
        sections: 326
    },
    {
        name: 'Sefer HaMidot',
        hebrewName: 'ספר המדות',
        englishName: 'Sefer HaMidot',
        ref: 'Sefer HaMidot',
        description: 'Le Livre des Traits de Caractère',
        sections: 50
    },
    {
        name: "Sipurei Maasiot",
        hebrewName: 'סיפורי מעשיות',
        englishName: "Sipurei Maasiot",
        ref: "Sipurei Maasiot",
        description: 'Les 13 Contes du Rabbi Nachman',
        sections: 13
    },
    {
        name: 'Likutei Tefilot',
        hebrewName: 'ליקוטי תפילות',
        englishName: 'Likutei Tefilot',
        ref: 'Likutei Tefilot',
        description: 'Prières de Reb Noson basées sur le Likutei Moharan',
        sections: 210
    },
    {
        name: 'Likutei Halakhot',
        hebrewName: 'ליקוטי הלכות',
        englishName: 'Likutei Halakhot',
        ref: 'Likutei Halakhot',
        description: 'Commentaires halakhiques de Reb Noson',
        sections: 100
    },
    {
        name: 'Chayei Moharan',
        hebrewName: 'חיי מוהר"ן',
        englishName: 'Chayei Moharan',
        ref: 'Chayei Moharan',
        description: 'Biographie du Rabbi Nachman',
        sections: 100
    },
    {
        name: 'Likutei Etzot',
        hebrewName: 'ליקוטי עצות',
        englishName: 'Likutei Etzot',
        ref: 'Likutei Etzot',
        description: 'Conseils du Rabbi Nachman par sujets',
        sections: 100
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
// Load Book from Sefaria API
// ===================================
async function loadBook(ref) {
    const textReader = document.getElementById('textReader');
    const textNavigation = document.getElementById('textNavigation');
    
    // Show loading
    textReader.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Chargement de ${ref}...</p>
        </div>
    `;
    
    try {
        // Fetch book index to get structure
        const indexResponse = await fetch(`${SEFARIA_API_BASE}/index/${encodeURIComponent(ref)}`);
        if (!indexResponse.ok) throw new Error('Livre non trouvé');
        
        const indexData = await indexResponse.json();
        
        // Load first section/chapter
        const firstRef = `${ref} 1:1`;
        const textResponse = await fetch(`${SEFARIA_API_BASE}/texts/${encodeURIComponent(firstRef)}?commentary=0&context=0`);
        
        if (!textResponse.ok) {
            // Try without verse number
            const altRef = `${ref} 1`;
            const altResponse = await fetch(`${SEFARIA_API_BASE}/texts/${encodeURIComponent(altRef)}?commentary=0&context=0`);
            if (!altResponse.ok) throw new Error('Texte non disponible');
            const textData = await altResponse.json();
            displayText(textData, indexData);
        } else {
            const textData = await textResponse.json();
            displayText(textData, indexData);
        }
        
        currentBook = ref;
        currentSection = 1; // Reset à la section 1
        textNavigation.style.display = 'flex';
        
    } catch (error) {
        console.error('Error loading book:', error);
        textReader.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erreur de chargement</h3>
                <p>${error.message}</p>
                <p>Ce texte n'est peut-être pas encore disponible sur Sefaria.</p>
                <button class="btn btn-primary" onclick="location.reload()">Réessayer</button>
            </div>
        `;
    }
}

// ===================================
// Display Text Content
// ===================================
async function displayText(textData, indexData) {
    const textReader = document.getElementById('textReader');
    const chapterInfo = document.getElementById('chapterInfo');
    
    // Extract section number from ref
    if (textData.ref) {
        const match = textData.ref.match(/(\d+)$/);
        if (match) {
            currentSection = parseInt(match[1]);
        }
    }
    
    // Update chapter info
    if (chapterInfo) {
        chapterInfo.textContent = textData.ref || textData.title;
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
// Navigation
// ===================================
function loadPreviousSection() {
    if (!currentBook || currentSection <= 1) {
        window.HakolKolRabenou.showNotification('Vous êtes au début du livre', 'info');
        return;
    }
    
    currentSection--;
    const ref = `${currentBook} ${currentSection}`;
    loadSpecificSection(ref);
}

function loadNextSection() {
    if (!currentBook) {
        window.HakolKolRabenou.showNotification('Veuillez d\'abord sélectionner un livre', 'info');
        return;
    }
    
    // Trouver le nombre max de sections pour ce livre
    const bookData = BRESLOV_TEXTS.find(b => b.ref === currentBook);
    if (bookData && currentSection >= bookData.sections) {
        window.HakolKolRabenou.showNotification('Vous êtes à la fin du livre', 'info');
        return;
    }
    
    currentSection++;
    const ref = `${currentBook} ${currentSection}`;
    loadSpecificSection(ref);
}

async function loadSpecificSection(ref) {
    const textReader = document.getElementById('textReader');
    const textNavigation = document.getElementById('textNavigation');
    
    textReader.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Chargement de ${ref}...</p>
        </div>
    `;
    
    try {
        const textResponse = await fetch(`${SEFARIA_API_BASE}/texts/${encodeURIComponent(ref)}?commentary=0&context=0`);
        
        if (!textResponse.ok) throw new Error('Section non disponible');
        
        const textData = await textResponse.json();
        displayText(textData, { title: currentBook });
        textNavigation.style.display = 'flex';
        
    } catch (error) {
        console.error('Error loading section:', error);
        textReader.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Section non disponible</h3>
                <p>Cette section n'existe pas ou n'est pas encore disponible sur Sefaria.</p>
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

