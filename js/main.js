// ===================================
// Hakol Kol Rabenou - Main JavaScript
// ===================================

// ===================================
// Translations / i18n
// ===================================
const translations = {
    fr: {
        nav_home: "Accueil",
        nav_library: "Bibliothèque",
        nav_features: "Fonctionnalités",
        nav_tech: "Technologie",
        nav_timeline: "Timeline",
        nav_team: "Équipe",
        nav_funding: "Financement",
        nav_faq: "FAQ",
        hero_title: "Hakol Kol Rabenou",
        hero_subtitle: "Tous les enseignements de Rabbi Nachman de Breslov<br>dans une application complète",
        stat_users: "Utilisateurs visés An 1",
        stat_books: "Œuvres complètes",
        stat_radio: "Radio Breslov",
        stat_languages: "Langues",
        btn_beta: "S'inscrire à la Beta",
        btn_learn_more: "En savoir plus",
        mission_statement: "Rendre les enseignements du Rabbi Nachman de Breslov accessibles à chaque âme, dans chaque langue, à chaque instant. Par la technologie, nous créons un pont entre la sagesse ancestrale et la vie moderne.",
        features_title: "Fonctionnalités Complètes",
        features_desc: "Une plateforme unifiée pour toute la communauté Breslov mondiale",
        feature1_title: "Bibliothèque de Textes Sacrés",
        feature1_desc: "Œuvres complètes du Rabbi Nachman avec bascule instantanée Hébreu ↔ Français ↔ English",
        feature2_title: "Audio & Médias",
        feature2_desc: "Streams en direct, livres audio et bibliothèque multimédia complète",
        feature3_title: "Outils de Prière",
        feature3_desc: "Accompagnement quotidien pour votre pratique spirituelle",
        feature4_title: "Communauté",
        feature4_desc: "Forums séparés par genre avec filtrage automatique et entraide",
        feature5_title: "Ressources Pratiques",
        feature5_desc: "Services de géolocalisation et calendrier des temps halakhiques",
        feature6_title: "Croissance Spirituelle",
        feature6_desc: "Outils personnalisés pour votre développement spirituel",
        feature7_title: "Connexion Ouman",
        feature7_desc: "Restez connecté au Kever et planifiez votre voyage",
        feature8_title: "Mission & Dons",
        feature8_desc: "Soutenez la diffusion des enseignements du Rabbi",
        tech_title: "Technologie Moderne",
        tech_desc: "Stack technique de pointe pour une expérience utilisateur optimale",
        timeline_title: "Feuille de Route",
        timeline_desc: "Lancement prévu Q3 2026 - Développement en 4 phases",
        team_title: "L'Équipe",
        team_desc: "Experts passionnés réunissant technologie et spiritualité",
        funding_title: "Financement Transparent",
        funding_desc: "Budget détaillé et options de contribution",
        metrics_title: "Indicateurs de Succès",
        metrics_desc: "Objectifs mesurables et KPIs de performance",
        faq_title: "Questions Fréquentes",
        faq_desc: "Tout ce que vous devez savoir sur Hakol Kol Rabenou",
        // Beta Modal
        beta_title: "Inscription à la Beta",
        beta_subtitle: "Soyez parmi les premiers à tester l'application",
        form_name: "Nom complet",
        form_name_placeholder: "Votre nom",
        form_email: "Email",
        form_email_placeholder: "votre@email.com",
        form_phone: "Téléphone (optionnel)",
        form_phone_placeholder: "+33 6 00 00 00 00",
        form_interest: "Qu'est-ce qui vous intéresse le plus ?",
        form_select: "Sélectionner...",
        interest_texts: "Bibliothèque de textes",
        interest_audio: "Audio & Radio",
        interest_prayer: "Outils de prière",
        interest_community: "Communauté",
        interest_all: "Tout !",
        form_message: "Message (optionnel)",
        form_message_placeholder: "Dites-nous pourquoi vous voulez rejoindre...",
        form_submit: "Envoyer ma demande",
        // Library Page
        library_title: "Bibliothèque de Textes Sacrés",
        library_subtitle: "Œuvres complètes du Rabbi Nachman de Breslov - Propulsé par Sefaria",
        search_placeholder: "Rechercher un texte...",
        search_btn: "Rechercher",
        show_hebrew: "Afficher Hébreu",
        show_english: "Afficher Anglais",
        auto_translate_fr: "Traduction Auto FR",
        breslov_works: "Œuvres de Breslov",
        loading_books: "Chargement des livres...",
        select_book: "Sélectionnez un livre pour commencer",
        select_book_desc: "Les textes s'afficheront ici avec l'hébreu, l'anglais et la traduction française automatique",
        previous: "Précédent",
        next: "Suivant",
        // Payment Page
        donation_title: "Soutenez Notre Mission",
        donation_subtitle: "Votre don aide à diffuser les enseignements du Rabbi Nachman dans le monde entier",
        donation_once: "Don Ponctuel",
        donation_once_desc: "Une contribution unique",
        donation_monthly: "Don Mensuel",
        donation_monthly_desc: "Soutien récurrent",
        donation_sponsor: "Parrainage",
        donation_sponsor_desc: "Sponsoriser une fonctionnalité",
        select_amount: "Sélectionnez un montant",
        custom_amount: "Montant personnalisé:",
        payment_method: "Méthode de paiement",
        paypal_desc: "Paiement sécurisé via PayPal",
        card_payment: "Carte bancaire",
        card_desc: "Visa, Mastercard, American Express",
        bank_transfer: "Virement bancaire",
        bank_desc: "Pour les gros montants",
        donation_type_label: "Type:",
        amount_label: "Montant:",
        payment_method_label: "Méthode:",
        total_label: "Total:",
        confirm_donation: "Confirmer le don",
        secure_payment: "Paiement 100% sécurisé et crypté",
        // YouTube Videos
        videos_title: "Vidéos & Enseignements",
        videos_desc: "Accédez à des milliers d'enseignements et de chansons sur YouTube",
        channel1_title: "Likutei Moharan en Français",
        channel1_desc: "Tous les enseignements du Likutei Moharan traduits et expliqués en français",
        channel2_title: "Chansons de Breslov - DJ Nanach",
        channel2_desc: "Collection de chansons et mélodies inspirées par Rabbi Nachman",
        channel3_title: "Likutei Moharan en Chanson",
        channel3_desc: "Les enseignements du Rabbi Nachman mis en musique",
        visit_channel: "Visiter la chaîne"
    },
    he: {
        nav_home: "בית",
        nav_library: "ספרייה",
        nav_features: "תכונות",
        nav_tech: "טכנולוגיה",
        nav_timeline: "לוח זמנים",
        nav_team: "צוות",
        nav_funding: "מימון",
        nav_faq: "שאלות",
        hero_title: "הכל קול רבינו",
        hero_subtitle: "כל תורת רבי נחמן מברסלב<br>באפליקציה אחת מקיפה",
        stat_users: "משתמשים שנה ראשונה",
        stat_books: "ספרים מלאים",
        stat_radio: "רדיו ברסלב",
        stat_languages: "שפות",
        btn_beta: "הרשמה לבטא",
        btn_learn_more: "מידע נוסף",
        mission_statement: "להנגיש את תורת רבי נחמן מברסלב לכל נשמה, בכל שפה, בכל רגע. באמצעות טכנולוגיה, אנו יוצרים גשר בין חכמת הקדמונים לחיים המודרניים.",
        features_title: "תכונות מלאות",
        features_desc: "פלטפורמה מאוחדת לכל קהילת ברסלב העולמית",
        feature1_title: "ספריית טקסטים קדושים",
        feature1_desc: "כל ספרי רבי נחמן עם מעבר מיידי עברית ↔ צרפתית ↔ אנגלית",
        feature2_title: "אודיו ומדיה",
        feature2_desc: "שידורים חיים, ספרי אודיו וספרייה מולטימדיה מלאה",
        feature3_title: "כלי תפילה",
        feature3_desc: "ליווי יומיומי לתרגול הרוחני שלך",
        feature4_title: "קהילה",
        feature4_desc: "פורומים מופרדים לפי מגדר עם סינון אוטומטי ועזרה הדדית",
        feature5_title: "משאבים מעשיים",
        feature5_desc: "שירותי מיקום ולוח זמנים הלכתיים",
        feature6_title: "צמיחה רוחנית",
        feature6_desc: "כלים מותאמים אישית להתפתחות הרוחנית שלך",
        feature7_title: "חיבור לאומן",
        feature7_desc: "הישאר מחובר לציון ותכנן את הנסיעה שלך",
        feature8_title: "שליחות ותרומות",
        feature8_desc: "תמוך בהפצת תורת רבי נחמן",
        tech_title: "טכנולוגיה מתקדמת",
        tech_desc: "מחסנית טכנולוגית מתקדמת לחווית משתמש אופטימלית",
        timeline_title: "מפת דרכים",
        timeline_desc: "השקה מתוכננת Q3 2026 - פיתוח ב-4 שלבים",
        team_title: "הצוות",
        team_desc: "מומחים נלהבים המשלבים טכנולוגיה ורוחניות",
        funding_title: "מימון שקוף",
        funding_desc: "תקציב מפורט ואפשרויות תרומה",
        metrics_title: "מדדי הצלחה",
        metrics_desc: "יעדים מדידים ו-KPIs ביצועים",
        faq_title: "שאלות נפוצות",
        faq_desc: "כל מה שצריך לדעת על הכל קול רבינו",
        // Beta Modal
        beta_title: "הרשמה לבטא",
        beta_subtitle: "היו בין הראשונים לנסות את האפליקציה",
        form_name: "שם מלא",
        form_name_placeholder: "השם שלך",
        form_email: "אימייל",
        form_email_placeholder: "your@email.com",
        form_phone: "טלפון (אופציונלי)",
        form_phone_placeholder: "+972 50 000 0000",
        form_interest: "מה מעניין אותך הכי הרבה?",
        form_select: "בחר...",
        interest_texts: "ספריית טקסטים",
        interest_audio: "אודיו ורדיו",
        interest_prayer: "כלי תפילה",
        interest_community: "קהילה",
        interest_all: "הכל!",
        form_message: "הודעה (אופציונלי)",
        form_message_placeholder: "ספר לנו למה אתה רוצה להצטרף...",
        form_submit: "שלח בקשה",
        // Library Page
        library_title: "ספריית טקסטים קדושים",
        library_subtitle: "כל ספרי רבי נחמן מברסלב - מופעל על ידי Sefaria",
        search_placeholder: "חפש טקסט...",
        search_btn: "חפש",
        show_hebrew: "הצג עברית",
        show_english: "הצג אנגלית",
        auto_translate_fr: "תרגום אוטומטי לצרפתית",
        breslov_works: "ספרי ברסלב",
        loading_books: "טוען ספרים...",
        select_book: "בחר ספר כדי להתחיל",
        select_book_desc: "הטקסטים יוצגו כאן עם עברית, אנגלית ותרגום צרפתי אוטומטי",
        previous: "הקודם",
        next: "הבא",
        // Payment Page
        donation_title: "תמוך במשימה שלנו",
        donation_subtitle: "תרומתך עוזרת להפיץ את תורת רבי נחמן בכל העולם",
        donation_once: "תרומה חד פעמית",
        donation_once_desc: "תרומה בודדת",
        donation_monthly: "תרומה חודשית",
        donation_monthly_desc: "תמיכה קבועה",
        donation_sponsor: "חסות",
        donation_sponsor_desc: "מממן תכונה",
        select_amount: "בחר סכום",
        custom_amount: "סכום מותאם אישית:",
        payment_method: "אמצעי תשלום",
        paypal_desc: "תשלום מאובטח דרך PayPal",
        card_payment: "כרטיס אשראי",
        card_desc: "Visa, Mastercard, American Express",
        bank_transfer: "העברה בנקאית",
        bank_desc: "לסכומים גדולים",
        donation_type_label: "סוג:",
        amount_label: "סכום:",
        payment_method_label: "אמצעי:",
        total_label: "סה\"כ:",
        confirm_donation: "אשר תרומה",
        secure_payment: "תשלום מאובטח 100% ומוצפן",
        // YouTube Videos
        videos_title: "סרטונים ושיעורים",
        videos_desc: "גישה לאלפי שיעורים ושירים ביוטיוב",
        channel1_title: "ליקוטי מוהר\"ן בצרפתית",
        channel1_desc: "כל שיעורי ליקוטי מוהר\"ן מתורגמים ומוסברים בצרפתית",
        channel2_title: "שירי ברסלב - DJ Nanach",
        channel2_desc: "אוסף שירים ומנגינות בהשראת רבי נחמן",
        channel3_title: "ליקוטי מוהר\"ן בשיר",
        channel3_desc: "שיעורי רבי נחמן מושרים",
        visit_channel: "בקר בערוץ"
    },
    en: {
        nav_home: "Home",
        nav_library: "Library",
        nav_features: "Features",
        nav_tech: "Technology",
        nav_timeline: "Timeline",
        nav_team: "Team",
        nav_funding: "Funding",
        nav_faq: "FAQ",
        hero_title: "Hakol Kol Rabenou",
        hero_subtitle: "All teachings of Rabbi Nachman of Breslov<br>in one comprehensive app",
        stat_users: "Target Users Year 1",
        stat_books: "Complete Works",
        stat_radio: "Breslov Radio",
        stat_languages: "Languages",
        btn_beta: "Join Beta",
        btn_learn_more: "Learn More",
        mission_statement: "To make the teachings of Rabbi Nachman of Breslov accessible to every soul, in every language, at every moment. Through technology, we create a bridge between ancient wisdom and modern life.",
        features_title: "Complete Features",
        features_desc: "A unified platform for the worldwide Breslov community",
        feature1_title: "Sacred Texts Library",
        feature1_desc: "Complete works of Rabbi Nachman with instant toggle Hebrew ↔ French ↔ English",
        feature2_title: "Audio & Media",
        feature2_desc: "Live streams, audiobooks and complete multimedia library",
        feature3_title: "Prayer Tools",
        feature3_desc: "Daily accompaniment for your spiritual practice",
        feature4_title: "Community",
        feature4_desc: "Gender-separated forums with automatic filtering and mutual help",
        feature5_title: "Practical Resources",
        feature5_desc: "Geolocation services and halakhic times calendar",
        feature6_title: "Spiritual Growth",
        feature6_desc: "Personalized tools for your spiritual development",
        feature7_title: "Uman Connection",
        feature7_desc: "Stay connected to the Kever and plan your trip",
        feature8_title: "Mission & Donations",
        feature8_desc: "Support the dissemination of Rabbi Nachman's teachings",
        tech_title: "Modern Technology",
        tech_desc: "Cutting-edge tech stack for optimal user experience",
        timeline_title: "Roadmap",
        timeline_desc: "Planned launch Q3 2026 - Development in 4 phases",
        team_title: "The Team",
        team_desc: "Passionate experts combining technology and spirituality",
        funding_title: "Transparent Funding",
        funding_desc: "Detailed budget and contribution options",
        metrics_title: "Success Metrics",
        metrics_desc: "Measurable goals and performance KPIs",
        faq_title: "Frequently Asked Questions",
        faq_desc: "Everything you need to know about Hakol Kol Rabenou",
        // Beta Modal
        beta_title: "Beta Registration",
        beta_subtitle: "Be among the first to test the app",
        form_name: "Full Name",
        form_name_placeholder: "Your name",
        form_email: "Email",
        form_email_placeholder: "your@email.com",
        form_phone: "Phone (optional)",
        form_phone_placeholder: "+1 555 000 0000",
        form_interest: "What interests you most?",
        form_select: "Select...",
        interest_texts: "Text Library",
        interest_audio: "Audio & Radio",
        interest_prayer: "Prayer Tools",
        interest_community: "Community",
        interest_all: "Everything!",
        form_message: "Message (optional)",
        form_message_placeholder: "Tell us why you want to join...",
        form_submit: "Send Request",
        // Library Page
        library_title: "Sacred Texts Library",
        library_subtitle: "Complete works of Rabbi Nachman of Breslov - Powered by Sefaria",
        search_placeholder: "Search for text...",
        search_btn: "Search",
        show_hebrew: "Show Hebrew",
        show_english: "Show English",
        auto_translate_fr: "Auto Translate FR",
        breslov_works: "Breslov Works",
        loading_books: "Loading books...",
        select_book: "Select a book to begin",
        select_book_desc: "Texts will display here with Hebrew, English and automatic French translation",
        previous: "Previous",
        next: "Next",
        // Payment Page
        donation_title: "Support Our Mission",
        donation_subtitle: "Your donation helps spread Rabbi Nachman's teachings worldwide",
        donation_once: "One-time Donation",
        donation_once_desc: "Single contribution",
        donation_monthly: "Monthly Donation",
        donation_monthly_desc: "Recurring support",
        donation_sponsor: "Sponsorship",
        donation_sponsor_desc: "Sponsor a feature",
        select_amount: "Select an amount",
        custom_amount: "Custom amount:",
        payment_method: "Payment Method",
        paypal_desc: "Secure payment via PayPal",
        card_payment: "Credit Card",
        card_desc: "Visa, Mastercard, American Express",
        bank_transfer: "Bank Transfer",
        bank_desc: "For large amounts",
        donation_type_label: "Type:",
        amount_label: "Amount:",
        payment_method_label: "Method:",
        total_label: "Total:",
        confirm_donation: "Confirm Donation",
        secure_payment: "100% secure and encrypted payment",
        // YouTube Videos
        videos_title: "Videos & Teachings",
        videos_desc: "Access thousands of teachings and songs on YouTube",
        channel1_title: "Likutei Moharan in French",
        channel1_desc: "All Likutei Moharan teachings translated and explained in French",
        channel2_title: "Breslov Songs - DJ Nanach",
        channel2_desc: "Collection of songs and melodies inspired by Rabbi Nachman",
        channel3_title: "Likutei Moharan in Song",
        channel3_desc: "Rabbi Nachman's teachings set to music",
        visit_channel: "Visit Channel"
    }
};

// ===================================
// State Management
// ===================================
let currentLanguage = 'fr';
let currentTheme = localStorage.getItem('theme') || 'light';

// ===================================
// DOM Ready
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize
    initTheme();
    initLanguage();
    initNavigation();
    initScrollEffects();
    initFAQ();
    initAOS();
    initNewsletterForm();
    initBetaModal();
    
    console.log('Hakol Kol Rabenou - Website Loaded Successfully');
});

// ===================================
// Theme Toggle (Dark/Light Mode)
// ===================================
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Apply saved theme
    if (currentTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Theme toggle click
    themeToggle.addEventListener('click', function() {
        if (currentTheme === 'light') {
            currentTheme = 'dark';
            html.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            currentTheme = 'light';
            html.removeAttribute('data-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        
        localStorage.setItem('theme', currentTheme);
    });
}

// ===================================
// Language Switching
// ===================================
function initLanguage() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
            
            // Update active state
            langButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function switchLanguage(lang) {
    currentLanguage = lang;
    
    // Update all i18n elements
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (el.innerHTML.includes('<br>')) {
                el.innerHTML = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });
    
    // Update direction for Hebrew
    if (lang === 'he') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.body.style.fontFamily = "'Heebo', sans-serif";
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.body.style.fontFamily = "'Heebo', sans-serif";
    }
    
    localStorage.setItem('language', lang);
}

// ===================================
// Navigation
// ===================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect on navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    mobileToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Toggle icon
        const icon = this.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// ===================================
// Scroll Effects
// ===================================
function initScrollEffects() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top click
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Parallax effect on hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            const parallaxSpeed = 0.5;
            if (scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        });
    }
}

// ===================================
// FAQ Accordion
// ===================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// ===================================
// AOS (Animate On Scroll) Initialization
// ===================================
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            delay: 50
        });
    }
}

// ===================================
// Newsletter Form
// ===================================
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (email && isValidEmail(email)) {
                // Show success message
                showNotification('Merci ! Vous êtes inscrit à notre newsletter.', 'success');
                emailInput.value = '';
                
                // In production, you would send this to your backend
                console.log('Newsletter subscription:', email);
            } else {
                showNotification('Veuillez entrer une adresse email valide.', 'error');
            }
        });
    }
}

// ===================================
// Beta Modal Functions
// ===================================
function initBetaModal() {
    const betaModal = document.getElementById('betaModal');
    const closeBetaModal = document.getElementById('closeBetaModal');
    const betaForm = document.getElementById('betaForm');
    
    if (!betaModal) return;
    
    // Close modal
    if (closeBetaModal) {
        closeBetaModal.addEventListener('click', function() {
            betaModal.classList.remove('active');
        });
    }
    
    // Close on outside click
    betaModal.addEventListener('click', function(e) {
        if (e.target === betaModal) {
            betaModal.classList.remove('active');
        }
    });
    
    // Form submission
    if (betaForm) {
        betaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('betaName').value,
                email: document.getElementById('betaEmail').value,
                phone: document.getElementById('betaPhone').value,
                interest: document.getElementById('betaInterest').value,
                message: document.getElementById('betaMessage').value
            };
            
            // In production, send to backend
            console.log('Beta registration:', formData);
            
            // Show success message
            showNotification('✅ Merci ! Votre inscription a été enregistrée. Nous vous contacterons bientôt !', 'success');
            
            // Close modal and reset form
            betaModal.classList.remove('active');
            betaForm.reset();
        });
    }
}

function openBetaModal() {
    const betaModal = document.getElementById('betaModal');
    if (betaModal) {
        betaModal.classList.add('active');
    }
}

// ===================================
// Button Click Handlers
// ===================================
document.addEventListener('click', function(e) {
    // Beta signup button
    if (e.target.closest('[data-i18n="btn_beta"]')) {
        e.preventDefault();
        openBetaModal();
    }
    
    // Learn more button
    if (e.target.closest('[data-i18n="btn_learn_more"]')) {
        e.preventDefault();
        const featuresSection = document.getElementById('fonctionnalites');
        if (featuresSection) {
            const offsetTop = featuresSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    // Donation buttons
    if (e.target.closest('.contribution-card .btn')) {
        e.preventDefault();
        window.location.href = 'payment.html';
    }
    
    // Team apply button
    if (e.target.closest('.team-cta .btn')) {
        e.preventDefault();
        showNotification('Formulaire de candidature bientôt disponible. Envoyez votre CV à contact@hakolkolrabenou.com', 'info');
    }
    
    // Launch notification button
    if (e.target.closest('.launch-cta .btn')) {
        e.preventDefault();
        const newsletterSection = document.querySelector('.newsletter');
        if (newsletterSection) {
            newsletterSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                newsletterSection.querySelector('input[type="email"]').focus();
            }, 500);
        }
    }
    
    // Contribution amounts
    if (e.target.closest('.contribution-amounts span')) {
        e.preventDefault();
        const amount = e.target.textContent;
        showNotification(`Merci de vouloir contribuer ${amount} ! Système de paiement bientôt disponible.`, 'success');
    }
});

// ===================================
// Notification System
// ===================================
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || colors.info;
}

// ===================================
// Utility Functions
// ===================================
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===================================
// Performance Monitoring
// ===================================
window.addEventListener('load', function() {
    if ('performance' in window) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    }
});

// ===================================
// Service Worker Registration (for PWA)
// ===================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when service worker is ready
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
}

// ===================================
// Add animation styles dynamically
// ===================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-content i:first-child {
        font-size: 1.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.2s;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// ===================================
// Analytics Tracking (placeholder)
// ===================================
function trackEvent(category, action, label) {
    // In production, integrate with Google Analytics, Mixpanel, etc.
    console.log('Analytics Event:', { category, action, label });
    
    // Example: gtag('event', action, { event_category: category, event_label: label });
}

// Track page sections viewed
const observerOptions = {
    threshold: 0.5
};

const sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            trackEvent('Section', 'View', sectionId);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
});

// ===================================
// Easter Egg: Konami Code
// ===================================
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    showNotification('🎉 Na Nach Nachma Nachman Meuman ! Vous avez trouvé le code secret ! 🎉', 'success');
    
    // Add fun animation
    document.body.style.animation = 'rainbow 2s linear';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 2000);
}

// ===================================
// Console Message
// ===================================
console.log('%c🕎 Hakol Kol Rabenou 🕎', 'font-size: 24px; font-weight: bold; color: #3b82f6;');
console.log('%cBienvenue sur le site de l\'application Hakol Kol Rabenou', 'font-size: 14px; color: #f59e0b;');
console.log('%cNa Nach Nachma Nachman Meuman 🙏', 'font-size: 12px; font-style: italic;');
console.log('%cVous êtes développeur ? Rejoignez notre équipe ! contact@hakolkolrabenou.com', 'font-size: 12px; color: #10b981;');

// ===================================
// Export functions for external use
// ===================================
window.HakolKolRabenou = {
    switchLanguage,
    showNotification,
    trackEvent
};