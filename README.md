# 🕎 Hakol Kol Rabenou

![Hakol Kol Rabenou Banner](https://img.shields.io/badge/Breslov-Rabbi%20Nachman-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-gold?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**Tous les enseignements de Rabbi Nachman de Breslov dans une application complète**

Site web vitrine pour l'application mobile et web "Hakol Kol Rabenou" - Une plateforme unifiée donnant accès à toutes les œuvres, enseignements, prières et ressources de la communauté Breslov mondiale.

## ✨ Fonctionnalités Principales

### 📚 Bibliothèque de Textes Sacrés
- **Intégration Sefaria API** : Accès direct aux textes de Breslov depuis Sefaria.org
- **Multilingue** : Hébreu, Anglais, Français (avec traduction automatique)
- **Textes disponibles** :
  - Likutei Moharan
  - Sichot HaRan
  - Sefer HaMidot
  - Sipurei Maasiot
  - Likutei Tefilot
- **Traduction automatique** : LibreTranslate API pour traduction FR en temps réel
- **Mode hors-ligne** : Téléchargement des textes pour lecture sans connexion

### 🎥 Chaînes YouTube Intégrées
Trois chaînes YouTube officielles :
1. **[Likutei Moharan en Français](https://www.youtube.com/@likoutemoharan9678)** - Tous les enseignements traduits
2. **[DJ Nanach Tselahya](https://www.youtube.com/@DJNanachTselahya/playlists)** - Chansons et mélodies Breslov
3. **[Likutei Moharan en Chanson](https://youtube.com/@likoutemoharanenchanson)** - Enseignements mis en musique

### 💳 Système de Dons
- **Page de paiement dédiée** : Interface complète pour les contributions
- **Options de paiement** : PayPal, Carte bancaire, Virement
- **Types de dons** : Ponctuel, Mensuel, Parrainage
- **Montants suggérés** : 18€, 36€, 54€, 100€, 180€, 360€ (valeurs symboliques)
- **Transparence totale** : Budget détaillé et rapports d'impact

### 📝 Inscription Beta
- **Modal interactif** : Formulaire d'inscription élégant
- **Collecte d'informations** : Nom, email, téléphone, centres d'intérêt
- **Validation en temps réel** : Vérification des données
- **Mock email** : Prêt pour intégration backend

### 🌐 Multilangue Complet
- **3 langues** : Français, Hébreu (עברית), English
- **Interface complète** : Navigation, formulaires, contenus
- **Changement dynamique** : Bascule instantanée entre langues
- **Direction RTL** : Support automatique pour l'hébreu

### 🎨 Design Moderne
- **Responsive** : Adapté mobile, tablette, desktop
- **Dark Mode** : Thème sombre/clair avec localStorage
- **Animations** : AOS (Animate On Scroll) pour effets fluides
- **Palette** : Bleu (#1e3a8a), Or (#f59e0b), design élégant

## 🚀 Technologies Utilisées

### Frontend
- **HTML5** : Structure sémantique moderne
- **CSS3** : Variables CSS, Flexbox, Grid
- **JavaScript ES6+** : Code modulaire et performant

### APIs & Services
- **[Sefaria API](https://www.sefaria.org/api)** : Bibliothèque de textes juifs
- **[LibreTranslate API](https://libretranslate.de)** : Traduction automatique gratuite
- **YouTube Embed API** : Intégration vidéos

### Bibliothèques
- **[AOS](https://michalsnik.github.io/aos/)** : Animations au scroll
- **[Font Awesome](https://fontawesome.com/)** : Icônes
- **[Google Fonts](https://fonts.google.com/)** : Typographie (Heebo, Cinzel)

## 📂 Structure du Projet

```
HAKOL-KOL-RABENOU/
│
├── index.html              # Page d'accueil
├── library.html            # Bibliothèque de textes (Sefaria)
├── payment.html            # Page de paiement/dons
├── README.md               # Documentation
│
├── css/
│   ├── style.css           # Styles principaux
│   └── library.css         # Styles bibliothèque
│
└── js/
    ├── main.js             # JavaScript principal
    └── sefaria.js          # Intégration Sefaria API
```

## 🛠️ Installation & Utilisation

### Installation Locale

```bash
# Cloner le repository
git clone https://github.com/votre-username/hakol-kol-rabenou.git

# Naviguer dans le dossier
cd hakol-kol-rabenou

# Ouvrir avec un serveur local (recommandé)
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js
npx http-server

# Option 3: VS Code Live Server
# Installer l'extension Live Server et cliquer sur "Go Live"
```

Puis ouvrir `http://localhost:8000` dans votre navigateur.

### Déploiement

#### Netlify (Recommandé)
1. Connectez-vous à [Netlify](https://www.netlify.com/)
2. Drag & drop le dossier du projet
3. Site en ligne en quelques secondes !

#### Vercel
```bash
npm i -g vercel
vercel
```

#### GitHub Pages
1. Push sur GitHub
2. Settings → Pages → Deploy from branch
3. Sélectionner `main` branch

## 🔧 Configuration

### API Sefaria
Aucune clé API requise - API publique gratuite.

### LibreTranslate
Par défaut : API publique `libretranslate.de`

Pour utiliser votre propre instance :
```javascript
// Dans js/sefaria.js, ligne 10
const LIBRE_TRANSLATE_API = 'https://votre-instance.com/translate';
```

### Personnalisation des Couleurs
```css
/* Dans css/style.css */
:root {
    --primary-blue: #1e3a8a;        /* Bleu principal */
    --primary-blue-light: #3b82f6;  /* Bleu clair */
    --accent-gold: #f59e0b;         /* Or accent */
    --accent-gold-light: #fbbf24;   /* Or clair */
}
```

## 📖 Documentation API

### Sefaria API
```javascript
// Charger un livre
const response = await fetch(`https://www.sefaria.org/api/texts/${bookRef}`);
const data = await response.json();

// Recherche
const search = await fetch(`https://www.sefaria.org/api/search-wrapper?q=${query}`);
```

### LibreTranslate
```javascript
// Traduire un texte
const response = await fetch('https://libretranslate.de/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        q: 'Texte à traduire',
        source: 'en',
        target: 'fr'
    })
});
```

## 🎯 Roadmap

### Phase 1 : Fondation ✅
- [x] Configuration projet
- [x] Design UI/UX
- [x] Intégration Sefaria
- [x] Système multilingue
- [x] Formulaire Beta

### Phase 2 : Fonctionnalités ✅
- [x] Bibliothèque complète
- [x] Traduction automatique
- [x] Page de paiement
- [x] Intégration YouTube
- [x] Mode sombre

### Phase 3 : Lancement 🔄
- [ ] Backend API
- [ ] Authentification utilisateurs
- [ ] Base de données
- [ ] Tests beta (100 users)
- [ ] App mobile (React Native)

### Phase 4 : Croissance 📅
- [ ] Communauté & Forums
- [ ] Radio en direct 24/7
- [ ] Notifications push
- [ ] Mode hors-ligne complet
- [ ] Langues additionnelles (ES, RU)

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment participer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/NouvelleFonctionnalite`)
3. Commit vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/NouvelleFonctionnalite`)
5. Ouvrir une Pull Request

### Code de Conduite
- Respecter les principes de modestie et de sainteté
- Code propre et bien documenté
- Tester avant de commit
- Respecter la structure existante

## 📧 Contact

**Chef de Projet** : Dan Levy  
**Email** : contact@hakolkolrabenou.com  
**Partenaire** : Tetra Brahm

### Réseaux Sociaux
- Facebook : [À venir]
- Instagram : [À venir]
- Telegram : [À venir]
- WhatsApp : [À venir]

## 📜 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- **[Sefaria](https://www.sefaria.org/)** pour leur API exceptionnelle
- **Communauté Breslov mondiale** pour leur soutien
- **Rabbi Nachman de Breslov** pour ses enseignements éternels

---

<div align="center">

### 🌟 Na Nach Nachma Nachman Meuman 🌟

*Rendre les enseignements du Rabbi Nachman accessibles à chaque âme,*  
*dans chaque langue, à chaque instant.*

**[Visiter le Site](https://hakol-kol-rabenou.netlify.app)** • **[Documentation](https://github.com)** • **[Support](mailto:contact@hakolkolrabenou.com)**

</div>

---

## 📊 Budget & Financement

### Développement Initial
- **Total** : 84,000€
- **Durée** : 7 mois
- **Équipe** : 6 personnes

### Infrastructure An 1
- **Total** : 2,772€/an
- **Supabase** : 300€
- **Cloudflare R2** : 600€
- **MeiliSearch** : 1,200€
- **Monitoring** : 672€

### Objectifs
- **Beta** : 100 utilisateurs (M6)
- **Lancement** : 1,000 utilisateurs (M7)
- **An 1** : 10,000 utilisateurs
- **An 3** : 100,000+ utilisateurs

---

**Version** : 1.0.0  
**Dernière mise à jour** : Octobre 2025  
**Lancement prévu** : Q3 2026
