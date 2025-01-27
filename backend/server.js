const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const auth = require('./middleware/auth');
const User = require('./models/User');
const Arbeitszeit = require('./models/Arbeitszeit');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Verbindung
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB verbunden'))
    .catch((err) => console.error('MongoDB Verbindungsfehler:', err));

// Auth Routen
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Prüfe ob Benutzer bereits existiert
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: 'Benutzername bereits vergeben' });
        }

        // Erstelle neuen Benutzer
        const user = new User({ username, password });
        await user.save();

        // Erstelle Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.status(201).json({ token, username: user.username });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Finde Benutzer
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
        }

        // Überprüfe Passwort
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
        }

        // Erstelle Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({ token, username: user.username });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Geschützte Arbeitszeit-Routen
app.get('/api/arbeitszeiten', auth, async (req, res) => {
    try {
        const arbeitszeiten = await Arbeitszeit.find({
            user: req.user._id,
        }).sort({ datum: -1 });
        res.json(arbeitszeiten);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/arbeitszeiten', auth, async (req, res) => {
    try {
        const arbeitszeit = new Arbeitszeit({
            ...req.body,
            user: req.user._id,
        });
        const neueArbeitszeit = await arbeitszeit.save();
        res.status(201).json(neueArbeitszeit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/arbeitszeiten/:id', auth, async (req, res) => {
    try {
        const arbeitszeit = await Arbeitszeit.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!arbeitszeit) {
            return res
                .status(404)
                .json({ message: 'Arbeitszeit nicht gefunden' });
        }

        Object.assign(arbeitszeit, req.body);
        await arbeitszeit.save();
        res.json(arbeitszeit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/arbeitszeiten/:id', auth, async (req, res) => {
    try {
        const arbeitszeit = await Arbeitszeit.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!arbeitszeit) {
            return res
                .status(404)
                .json({ message: 'Arbeitszeit nicht gefunden' });
        }

        res.json({ message: 'Arbeitszeit gelöscht' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
