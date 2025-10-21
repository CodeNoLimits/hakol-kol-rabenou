const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

// Clé Gemini API (Google)
const GEMINI_API_KEY = 'AIzaSyCtvJHu8uQMlmHU-X3kutZrJNtXY_M6Kjw';

console.log('Utilisation de Gemini API (Google)');

app.use(cors());
app.use(express.json());

app.post('/api/translate', async (req, res) => {
    try {
        const text = req.body.text;
        
        if (!text) {
            return res.status(400).json({ error: 'Texte manquant' });
        }

        console.log('Traduction:', text.substring(0, 50) + '...');

        const prompt = 'Traduis ce texte anglais en français (texte religieux juif). Traduis UNIQUEMENT sans commentaire:\n\n' + text;

        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 2000
                    }
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erreur Gemini:', response.status, errorText);
            return res.status(500).json({ error: 'Erreur Gemini API' });
        }

        const data = await response.json();
        const french = data.candidates[0].content.parts[0].text.trim();

        console.log('Traduit:', french.substring(0, 50) + '...');

        res.json({ french: french });

    } catch (error) {
        console.error('Erreur:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', api: 'Gemini' });
});

app.listen(PORT, () => {
    console.log('\n=================================');
    console.log('  SERVEUR GEMINI - TRADUCTION');
    console.log('  Port: ' + PORT);
    console.log('=================================\n');
});
