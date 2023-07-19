const express = require('express');
const jsonServer = require('json-server');

const app = express();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

app.use(express.json());
app.use(middlewares);
app.use('/api', router);

// playlist model
class Playlist {
  constructor(title, artists, url) {
    this.title = title;
    this.artists = artists;
    this.url = url;
    this.playCount = 0;
  }
}

app.post('/api/playlist', (req, res) => {
  const { title, artists, url } = req.body;
  const newSong = new Playlist(title, artists, url);

  const db = require('./db.json');
  db.playlist.push(newSong);

  const fs = require('fs');
  fs.writeFileSync('db.json', JSON.stringify(db, null, 2));

  res.status(201).json(newSong);
});

app.get('/api/playlist', (req, res) => {
  const db = require('./db.json');
  let playlist = db.playlist;

//   sortir playlist berdasarkan banyaknya playcount
  playlist = playlist.sort((a, b) => b.playCount - a.playCount);

  res.json(playlist);
});

app.post('/api/playlist/:id/play', (req, res) => {
  const songId = parseInt(req.params.id);
  const db = require('./db.json');
  const playlist = db.playlist;

  const song = playlist.find((s) => s.id === songId);
  if (!song) {
    res.status(404).json({ message: 'Song not found' });
    return;
  }

  song.playCount++;

  fs.writeFileSync('db.json', JSON.stringify(db, null, 2));

  res.json({ message: 'Song played successfully' });
});
// memulai server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
