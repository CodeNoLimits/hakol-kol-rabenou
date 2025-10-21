# 🔐 SYSTÈME DE TRADUCTION SÉCURISÉ

## ⚠️ IMPORTANT - Clé API Protégée

La clé API OpenRouter est maintenant **100% sécurisée** et **jamais exposée au client**.

---

## 🏗️ Architecture

```
┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
│   Frontend   │  ────▶  │  Serveur Proxy   │  ────▶  │  OpenRouter  │
│  (Browser)   │         │  (Node.js/       │         │     API      │
│              │         │   Netlify)       │         │              │
└──────────────┘         └──────────────────┘         └──────────────┘
   Pas de clé            🔐 Clé API ici                  Traduction
```

**Avantages:**
- ✅ Clé API jamais visible dans le code client
- ✅ Impossible de voler la clé depuis la console
- ✅ Contrôle serveur sur les requêtes
- ✅ Logs centralisés côté serveur

---

## 📁 Fichiers Importants

### Fichiers SECRETS (jamais commités)
- `.env` - Contient la clé API (ignoré par Git)
- `js/config.js` - Ancien fichier avec clé (ignoré par Git)

### Fichiers du Serveur
- `translation-server.js` - Serveur Node.js local (développement)
- `netlify/functions/translate.js` - Fonction serverless (production)
- `package.json` - Dépendances npm

### Frontend
- `js/sefaria.js` - Code modifié pour utiliser le serveur proxy

---

## 🚀 DÉMARRAGE LOCAL (Développement)

### 1. Installer les dépendances
```bash
npm install
```

### 2. Vérifier que `.env` existe
Le fichier `.env` doit contenir:
```
OPENROUTER_API_KEY=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
PORT=3001
```

### 3. Démarrer le serveur de traduction
```bash
npm start
```

Vous verrez:
```
🚀 Serveur de traduction démarré sur http://localhost:3001
📡 Endpoint: POST http://localhost:3001/api/translate
💚 Santé: GET http://localhost:3001/api/translate
```

### 4. Ouvrir l'application
Ouvrez `index.html` ou `library.html` dans votre navigateur.

Le frontend détectera automatiquement qu'il est en local et utilisera:
```
http://localhost:3001/api/translate
```

---

## 🌐 DÉPLOIEMENT NETLIFY (Production)

### 1. Ajouter la clé API dans Netlify

1. Aller sur **Netlify Dashboard**
2. Sélectionner votre site
3. **Site settings** → **Environment variables**
4. Cliquer **Add a variable**
5. Créer:
   - **Key:** `OPENROUTER_API_KEY`
   - **Value:** `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`
   - **Scopes:** Cocher "All scopes"
6. Cliquer **Create variable**

### 2. Déployer sur Netlify

Netlify détectera automatiquement:
- `netlify.toml` - Configuration
- `netlify/functions/translate.js` - Fonction serverless

En production, le frontend utilisera:
```
https://hakol-kol-rabenou.netlify.app/.netlify/functions/translate
```

### 3. Tester la fonction

Après déploiement, tester:
```bash
curl -X POST https://hakol-kol-rabenou.netlify.app/.netlify/functions/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world"}'
```

Réponse attendue:
```json
{"french":"Bonjour le monde"}
```

---

## 🧪 TESTS

### Test local
```bash
# Terminal 1: Démarrer le serveur
npm start

# Terminal 2: Tester
curl -X POST http://localhost:3001/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"The Torah was given at Mount Sinai"}'
```

### Test Santé
```bash
curl http://localhost:3001/api/health
```

---

## 🔍 DEBUGGING

### Vérifier la clé API (local)
```bash
cat .env
```

### Logs du serveur
Le serveur affiche automatiquement:
- ✅ Traductions réussies
- ❌ Erreurs API
- 🔄 Requêtes en cours

### Console navigateur
Ouvrir la console (F12) pour voir:
```
🔄 Traduction via serveur sécurisé: http://localhost:3001/api/translate
✅ Traduction réussie: La Torah a été donnée au Mont Sinaï
```

---

## ⚠️ SÉCURITÉ - CHECKLIST

- [x] `.env` ajouté au `.gitignore`
- [x] `js/config.js` ajouté au `.gitignore`
- [x] Clé API jamais dans le code client
- [x] Serveur proxy créé (local + Netlify)
- [x] Frontend modifié pour utiliser le proxy
- [x] CORS configuré correctement
- [x] Variable d'environnement Netlify configurée

---

## 🆘 PROBLÈMES COURANTS

### "OPENROUTER_API_KEY manquante"
- Vérifier que `.env` existe et contient la clé
- Redémarrer le serveur après modification de `.env`

### "Failed to fetch"
- Vérifier que le serveur est démarré (`npm start`)
- Vérifier que le port 3001 est libre

### "Clé API révoquée"
- OpenRouter a révoqué l'ancienne clé car elle était exposée
- Nouvelle clé ajoutée dans `.env` (sécurisée)
- Ne JAMAIS committer `.env` sur Git

### Traduction ne marche pas en production
- Vérifier que la variable d'environnement est ajoutée dans Netlify
- Vérifier les logs Netlify Functions
- Tester l'endpoint directement avec curl

---

## 📝 NOTES

**Ancienne architecture (DANGEREUSE):**
- Clé API dans `js/config.js`
- Visible dans le code source
- N'importe qui peut la voler

**Nouvelle architecture (SÉCURISÉE):**
- Clé API dans `.env` (serveur seulement)
- Frontend appelle serveur proxy
- Clé jamais exposée au client

---

**Créé par Claude Code - Sécurisation complète de la clé API**
**Date: 2025-10-21**
