const express = require('express');
const db = require('../config/db');
const router = express.Router();

const authMiddleware = require('../middleware/auth');

// Get all reports
router.get('/', authMiddleware, (req, res) => {
    db.query('SELECT * FROM reports', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.rowCount === 0) {
            return res.status(404).json({ message: 'No reports found' });
        }

        res.status(200).json(results.rows);
    });
});

// GET report by ID
router.get('/:id', authMiddleware, (req, res) => {
    const reportId = parseInt(req.params.id, 10);

    if (isNaN(reportId)) {
        return res.status(400).json({ error: 'Invalid report ID' });
    }

    db.query('SELECT * FROM reports WHERE id = $1', [reportId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.rowCount === 0) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.status(200).json(results.rows[0]);
    });
});

// Add a new report
router.post('/', authMiddleware, (req, res) => {
    const { name, embed_url } = req.body;

    if (!name || !embed_url) {
        return res.status(400).json({ error: 'Name and embed_url are required.' });
    }

    db.query('INSERT INTO reports (name, embed_url) VALUES ($1, $2)', [name, embed_url], (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Error adding report' });
        }

        res.status(201).json({ message: 'Report added successfully' });
    });
});

router.post('/assign', authMiddleware, (req, res) => {
    const { user_id, report_id } = req.body;

    if (!user_id || !report_id) {
        return res.status(400).json({ error: 'User ID and Report ID are required.' });
    }

    // Insert user_report_access into the database
    db.query('INSERT INTO user_report_access (user_id, report_id) VALUES ($1, $2)', [user_id, report_id], (err) => {
        if (err) {
            console.error('Database error:', err); // Log the error for debugging
            return res.status(500).json({ error: 'Error assigning report to user' });
        }

        res.status(201).json({ message: 'Report assigned to user successfully' });
    });
});


module.exports = router;
