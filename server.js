const express = require('express');
const axios = require('axios');
const mysql = require('mysql2');
const cors = require('cors'); 

const app = express();

// Enable CORS
app.use(cors());

app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'jokeapp'
});

db.connect(err => {
  if (err) throw err;
  console.log('Database connected!');
});

// Serve static files
app.use(express.static('public'));

// Fetch jokes from API
app.get('/search-jokes', async (req, res) => {
  const query = req.query.query || '';
  try {
    const response = await axios.get(`https://icanhazdadjoke.com/search`, {
      headers: { Accept: 'application/json' },
      params: { term: query }
    });
    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jokes' });
  }
});

// Save favorite joke to DB
app.post('/favourite-joke', (req, res) => {
  const { jokeId, jokeText } = req.body;
  db.query('INSERT INTO favourites (jokeId, jokeText) VALUES (?, ?)', [jokeId, jokeText], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to save favourite' });
    res.json({ success: true });
  });
});

// Fetch favorite jokes from DB
app.get('/favourite-jokes', (req, res) => {
  db.query('SELECT * FROM favourites', (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch favourites' });
    res.json(results);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
