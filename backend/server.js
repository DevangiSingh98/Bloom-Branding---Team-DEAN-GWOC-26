const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json());

// Helper to read data
const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading data:", err);
        return null;
    }
};

// Helper to write data
const writeData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4));
        return true;
    } catch (err) {
        console.error("Error writing data:", err);
        return false;
    }
};

// GET endpoint
app.get('/api/content', (req, res) => {
    const data = readData();
    if (data) {
        res.json(data);
    } else {
        res.status(500).json({ error: "Failed to load content" });
    }
});

// POST endpoint
app.post('/api/content', (req, res) => {
    const newData = req.body;
    if (writeData(newData)) {
        res.json({ success: true, message: "Content updated successfully", content: newData });
    } else {
        res.status(500).json({ error: "Failed to save content" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
