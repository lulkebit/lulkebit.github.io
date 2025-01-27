const mongoose = require('mongoose');

const arbeitszeitSchema = new mongoose.Schema(
    {
        datum: {
            type: String,
            required: true,
        },
        startZeit: {
            type: String,
            required: true,
        },
        endZeit: {
            type: String,
            required: true,
        },
        pausenZeit: {
            type: String,
            required: true,
        },
        gesamtZeit: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

const Arbeitszeit = mongoose.model('Arbeitszeit', arbeitszeitSchema);

module.exports = Arbeitszeit;
