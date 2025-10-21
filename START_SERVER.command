#!/bin/bash
cd "$(dirname "$0")"

echo "========================================"
echo "  SERVEUR DE TRADUCTION BRESLOV"
echo "========================================"
echo ""

if [ ! -f ".env" ]; then
    echo "ERREUR: Fichier .env manquant !"
    echo "Crée le fichier .env avec:"
    echo "OPENROUTER_API_KEY=ta-clé-ici"
    exit 1
fi

echo "Démarrage du serveur..."
node server-simple.js

echo ""
echo "Serveur arrêté."
read -p "Appuie sur Entrée pour fermer..."
