const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbFile = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error('Erreur lors de la connexion à la base SQLite', err);
  } else {
    console.log('Connecté à SQLite');
  }
});

// Création d’une table exemple : clients
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT,
      prenom TEXT,
      phone TEXT,
      email TEXT
    )
  `);
});

module.exports = db;
