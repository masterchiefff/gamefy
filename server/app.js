const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');

const app = express();

const port = '5500';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    console.log("response")
})

app.use('/game/html/:name', (req, res, next) => {
    const gameName = req.params.name;
    const gamePath = path.join(__dirname, 'games', 'html', gameName, 'index.html');
    express.static(gamePath)(req, res, next);
});

app.get('/game/unity/:name', (req, res) => {
    const gameName = req.params.name;
    const gamePath = path.join(__dirname, 'games', 'unity', gameName, 'index.html');
    
    if (fs.existsSync(gamePath)) {
      res.sendFile(gamePath);
    } else {
      res.status(404).send('Unity game not found');
    }
});  

app.get('/game/:type/:name/thumbnail', (req, res) => {
    const gameType = req.params.type;
    const gameName = req.params.name;
    const thumbnailPath = path.join(__dirname, 'games', gameType, gameName, 'thumbnail.jpg');
    
    if (fs.existsSync(thumbnailPath)) {
      res.sendFile(thumbnailPath);
    } else {
      res.status(404).send('Thumbnail not found');
    }
});

app.get('/api/game/:type/:name/score', (req, res) => {
    const gameType = req.params.type;
    const gameName = req.params.name;

    console.log(gameName, gameType)

    res.json({ type: gameType, game: gameName, score: Math.floor(Math.random() * 100) });
});

app.get('/api/games', async (req, res) => {
    try {
      const unityGamesDir = path.join(__dirname, 'games', 'unity');
      const htmlGamesDir = path.join(__dirname, 'games', 'html');
  
      if (!fs.existsSync(unityGamesDir)) {
        console.error('Unity games directory does not exist:', unityGamesDir);
        return res.status(500).json({ error: 'Unity games directory does not exist' });
      }
  
      if (!fs.existsSync(htmlGamesDir)) {
        console.error('HTML games directory does not exist:', htmlGamesDir);
        return res.status(500).json({ error: 'HTML games directory does not exist' });
      }
  
      const unityGames = await fs.readdir(unityGamesDir);
      const htmlGames = await fs.readdir(htmlGamesDir);
  
      res.json({
        unity: unityGames,
        html: htmlGames
      });
    } catch (err) {
      console.error('Error listing games:', err);
      const unityGamesDir = path.join(__dirname, 'games', 'unity');
      console.log(unityGamesDir)
      res.status(500).json({ error: 'Failed to list games' });
    }
});


app.listen(port, () => {
    console.log(`the app is runing on localhost:${port}`)
})