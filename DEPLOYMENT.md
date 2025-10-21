# 🚀 Guide de Déploiement Netlify

Le CLI Netlify a rencontré un problème technique. Voici comment déployer manuellement :

## Option 1 : Déploiement via Interface Web (RECOMMANDÉ - 2 minutes)

### Méthode Simple
1. Allez sur [https://app.netlify.com/](https://app.netlify.com/)
2. Connectez-vous avec votre compte
3. Cliquez sur **"Add new site"** → **"Deploy manually"**
4. Glissez-déposez le dossier complet du projet
5. C'est fait ! ✅

### Méthode GitHub (Déploiement Automatique)
1. Allez sur [https://app.netlify.com/](https://app.netlify.com/)
2. Cliquez sur **"Add new site"** → **"Import an existing project"**
3. Choisissez **GitHub**
4. Sélectionnez le repo **hakol-kol-rabenou**
5. Configuration :
   - **Build command** : (laisser vide)
   - **Publish directory** : `.` (ou laisser par défaut)
6. Cliquez sur **"Deploy site"**

### Configuration du Nom de Domaine
1. Une fois déployé, allez dans **Site settings** → **Domain management**
2. Cliquez sur **"Options"** → **"Edit site name"**
3. Changez en : `hakol-kol-rabenou` ou le nom de votre choix
4. Votre site sera disponible à : `https://hakol-kol-rabenou.netlify.app`

## Option 2 : Déploiement via Netlify Drop

1. Allez sur [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Glissez-déposez le dossier du projet
3. C'est déployé instantanément !

## Option 3 : Réparer Netlify CLI (pour experts)

```bash
# Désinstaller la version actuelle
npm uninstall -g netlify-cli

# Installer une version stable
npm install -g netlify-cli@16.0.0

# Se connecter
netlify login

# Déployer
cd "/Users/codenolimits-dreamai-nanach/Desktop/HAKOL KOL RABENOU"
netlify deploy --prod --dir=.
```

## ✅ Vérification du Déploiement

Une fois déployé, vérifiez que :
- ✅ Page d'accueil charge correctement
- ✅ Bibliothèque Sefaria fonctionne
- ✅ Changement de langue fonctionne
- ✅ Modal Beta s'ouvre
- ✅ Page de paiement accessible
- ✅ Vidéos YouTube chargent
- ✅ Mode sombre fonctionne
- ✅ Responsive sur mobile

## 🔗 Liens Importants

- **Repository GitHub** : https://github.com/CodeNoLimits/hakol-kol-rabenou
- **Site Netlify** : https://hakol-kol-rabenou.netlify.app (à confirmer après déploiement)
- **Documentation Netlify** : https://docs.netlify.com/

## 🎉 C'est fait !

Votre site est maintenant en ligne et accessible dans le monde entier !

**Na Nach Nachma Nachman Meuman** 🙏


