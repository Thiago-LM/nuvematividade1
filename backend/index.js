const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const PORT = 3000;

app.use(express.json());
app.use(cors());

const scoresFile = path.join(__dirname, 'scores.json');

// Helper to read and write scores
const readScores = () => {
    if (!fs.existsSync(scoresFile)) return [];
    try {
        const data = fs.readFileSync(scoresFile, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

const writeScores = (scores) => {
    fs.writeFileSync(scoresFile, JSON.stringify(scores, null, 2), 'utf8');
};

app.get('/', (req, res) => {
    res.send('Leaderboard backend is running!');
});

// CREATE score
app.post('/scores', (req, res) => {
    const { nickname, score } = req.body;
    if (!nickname || typeof score !== 'number') {
        return res.status(400).json({ error: 'nickname and score are required' });
    }
    
    const scores = readScores();
    const existingIndex = scores.findIndex(s => s.nickname === nickname);
    
    let scoreObj;
    if (existingIndex !== -1) {
        scores[existingIndex].score = Math.max(scores[existingIndex].score, score);
        scores[existingIndex].timestamp = new Date().toISOString();
        scoreObj = scores[existingIndex];
    } else {
        scoreObj = {
            id: Date.now().toString(),
            nickname,
            score,
            timestamp: new Date().toISOString()
        };
        scores.push(scoreObj);
    }

    // Sort by score descending
    scores.sort((a, b) => b.score - a.score);
    
    writeScores(scores);
    res.status(201).json(scoreObj);
});

// READ scores (Top 10)
app.get('/scores', (req, res) => {
    const scores = readScores();
    res.json(scores.slice(0, 10)); // Returns top 10
});

// UPDATE score
app.put('/scores/:id', (req, res) => {
    const { id } = req.params;
    const { nickname, score } = req.body;
    
    const scores = readScores();
    const index = scores.findIndex(s => s.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Score not found' });
    }
    
    if (nickname) scores[index].nickname = nickname;
    if (typeof score === 'number') scores[index].score = score;
    
    scores.sort((a, b) => b.score - a.score);
    writeScores(scores);
    
    res.json(scores[index]);
});

// DELETE score
app.delete('/scores/:id', (req, res) => {
    const { id } = req.params;
    let scores = readScores();
    const initialLength = scores.length;
    
    scores = scores.filter(s => s.id !== id);
    
    if (scores.length === initialLength) {
        return res.status(404).json({ error: 'Score not found' });
    }
    
    writeScores(scores);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});