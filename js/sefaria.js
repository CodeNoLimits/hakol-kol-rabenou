// ===================================
// Sefaria API Integration
// ===================================

const SEFARIA_API_BASE = 'https://www.sefaria.org/api';
const LIBRE_TRANSLATE_API = 'https://libretranslate.de/translate'; // Free API

// Breslov texts available on Sefaria
const BRESLOV_TEXTS = [
    {
        name: 'Likutei Moharan',
        hebrewName: 'ליקוטי מוהר"ן',
        englishName: 'Likutei Moharan',
        ref: 'Likutei Moharan',
        description: 'Enseignements principaux du Rabbi Nachman'
    },
    {
        name: 'Sichot HaRan',
        hebrewName: 'שיחות הר"ן',
        englishName: 'Sichot HaRan',
        ref: 'Sichot HaRan',
        description: 'Conversations du Rabbi Nachman'
    },
    {
        name: 'Sefer HaMidot',
        hebrewName: 'ספר המדות',
        englishName: 'Sefer HaMidot',
        ref: 'Sefer HaMidot',
        description: 'Le Livre des Traits de Caractère'
    },
    {
        name: 'Sipurei Maasiot',
        hebrewName: 'סיפורי מעשיות',
        englishName: "Rabbi Nachman's Stories",
        ref: "Rabbi Nachman's Stories",
        description: 'Les Contes du Rabbi Nachman'
    },
    {
        name: 'Likutei Tefilot',
        hebrewName: 'ליקוטי תפילות',
        englishName: 'Likutei Tefilot',
        ref: 'Likutei Tefilot',
        description: 'Prières basées sur les enseignements'
    }
];

// State Management
let currentBook = null;
let currentSection = null;
let autoTranslate = false;
let showHebrew = true;
let showEnglish = true;

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
    if (!text) return '';
    
    try {
        // Use LibreTranslate API (free, open-source)
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
            })
        });
        
        if (!response.ok) {
            console.warn('Translation API error');
            return '';
        }
        
        const data = await response.json();
        return data.translatedText || '';
        
    } catch (error) {
        console.error('Translation error:', error);
        return '';
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
    window.HakolKolRabenou.showNotification('Navigation entre sections bientôt disponible', 'info');
}

function loadNextSection() {
    window.HakolKolRabenou.showNotification('Navigation entre sections bientôt disponible', 'info');
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

