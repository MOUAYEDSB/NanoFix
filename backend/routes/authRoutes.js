const express = require('express');
const router = express.Router();
require('dotenv').config();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.LOGIN_USERNAME &&
    password === process.env.LOGIN_PASSWORD
  ) {
    res.json({ message: 'Connexion réussie', user: { username } });
  } else {
    res.status(401).json({ error: 'Identifiants invalides' });
  }
});

module.exports = router;
