const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();

const app = express();
const PORT = 3001;
const API_KEY = process.env.OPENROUTER_API_KEY;

if (!API_KEY) {
    console.error('ERREUR: Clé API manquante dans .env');
    process.exit(1);
}

console.log('Clé API chargée depuis .env');

app.use(cors());
app.use(express.json());

app.post('/api/translate', async (req, res) => {
    try {
        const text = req.body.text;
        
        if (!text) {
            return res.status(400).json({ error: 'Texte manquant' });
        }

        console.log('Traduction:', text.substring(0, 50) + '...');

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + API_KEY,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://hakol-kol-rabenou.netlify.app'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-exp:free',
                messages: [
                    {
                        role: 'system',
                        content: 'Tu es un traducteur anglais-français. Traduis UNIQUEMENT le texte en français, sans commentaire.'
                    },
                    {
                        role: 'user',
                        content: text
                    }
                ],
                temperature: 0.3,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            console.error('Erreur API:', response.status);
            return res.status(500).json({ error: 'Erreur API' });
        }

        const data = await response.json();
        const french = data.choices[0].message.content.trim();

        console.log('Traduit:', french.substring(0, 50) + '...');

        res.json({ french: french });

    } catch (error) {
        console.error('Erreur:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});

app.listen(PORT, () => {
    console.log('\n=================================');
    console.log('Serveur de traduction démarré !');
    console.log('Port:', PORT);
    console.log('=================================\n');
});
