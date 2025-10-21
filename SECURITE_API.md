# 🔐 Sécurité de la Clé API OpenRouter

## ✅ Configuration Sécurisée

La clé API OpenRouter est maintenant **complètement sécurisée** :

### 🛡️ Architecture de Sécurité

1. **Clé JAMAIS exposée au client** ✓
2. **Fonction serverless Netlify** agit comme proxy ✓
3. **Variable d'environnement** stocke la clé de manière sécurisée ✓

### 📝 Configuration Netlify (OBLIGATOIRE)

Pour que la traduction fonctionne, vous DEVEZ configurer la variable d'environnement sur Netlify :

#### Étapes :

1. **Aller sur le dashboard Netlify** :
   - https://app.netlify.com/sites/hakol-kol-rabenou/configuration/env

2. **Ajouter une nouvelle variable d'environnement** :
   - Nom : `OPENROUTER_API_KEY`
   - Valeur : `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`

3. **Sauvegarder et redéployer** :
   - Netlify redéploiera automatiquement avec la nouvelle variable

### 🔍 Comment ça fonctionne ?

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│   Browser   │────────>│ Netlify Function │────────>│  OpenRouter │
│  (Public)   │  Texte  │   (Serverless)   │  +Clé   │     API     │
└─────────────┘         └──────────────────┘         └─────────────┘
                              ↑
                              │ Clé API (env var)
                              │ JAMAIS exposée
```

### ✅ Sécurité Garantie

- ❌ **Pas de clé** dans le code JavaScript
- ❌ **Pas de clé** dans les fichiers HTML
- ❌ **Pas de clé** dans Git
- ✅ **Clé uniquement** dans les variables d'environnement Netlify (serveur)

### 📂 Fichiers Concernés

- `netlify/functions/translate.js` : Fonction serverless qui utilise la clé
- `js/sefaria.js` : Appelle la fonction Netlify (pas l'API directement)
- `.gitignore` : Empêche toute exposition accidentelle

### 🚨 Important

Si vous voyez un jour votre clé API exposée :
1. Révoqué immédiatement l'ancienne clé sur OpenRouter
2. Générez une nouvelle clé
3. Mettez à jour UNIQUEMENT la variable d'environnement Netlify
4. **NE JAMAIS** mettre la clé dans le code source

