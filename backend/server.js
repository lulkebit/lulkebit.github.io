const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Verbindung
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB verbunden'))
    .catch((err) => console.error('MongoDB Verbindungsfehler:', err));

// Arbeitszeit Schema
const arbeitszeitSchema = new mongoose.Schema({
    datum: { type: String, required: true },
    startZeit: { type: String, required: true },
    endZeit: { type: String, required: true },
    pausenZeit: { type: String, required: true },
    gesamtZeit: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Arbeitszeit = mongoose.model('Arbeitszeit', arbeitszeitSchema);

// API Routen
app.get('/api/arbeitszeiten', async (req, res) => {
    try {
        const arbeitszeiten = await Arbeitszeit.find().sort({ datum: -1 });
        res.json(arbeitszeiten);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/arbeitszeiten', async (req, res) => {
    try {
        const arbeitszeit = new Arbeitszeit(req.body);
        const neueArbeitszeit = await arbeitszeit.save();
        res.status(201).json(neueArbeitszeit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/arbeitszeiten/:id', async (req, res) => {
    try {
        const arbeitszeit = await Arbeitszeit.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(arbeitszeit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/arbeitszeiten/:id', async (req, res) => {
    try {
        await Arbeitszeit.findByIdAndDelete(req.params.id);
        res.json({ message: 'Arbeitszeit gelöscht' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
