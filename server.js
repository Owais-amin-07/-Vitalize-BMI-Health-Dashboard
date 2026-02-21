
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock Database (since MySQL is not available in this environment)
let bmiRecords = [];

// Cleanup function: Remove records older than 1 hour
const CLEANUP_INTERVAL = 60 * 1000; // Check every minute
const MAX_AGE = 60 * 60 * 1000; // 1 hour in milliseconds

setInterval(() => {
  const now = Date.now();
  const initialCount = bmiRecords.length;
  bmiRecords = bmiRecords.filter(record => {
    const createdAt = new Date(record.created_at).getTime();
    return (now - createdAt) < MAX_AGE;
  });
  const removedCount = initialCount - bmiRecords.length;
  if (removedCount > 0) {
    console.log(`[Cleanup] Removed ${removedCount} expired records.`);
  }
}, CLEANUP_INTERVAL);

// Routes
// POST: Save BMI Record
app.post('/api/bmi', (req, res) => {
  const { name, age, gender, height, weight, bmi, category } = req.body;

  if (!name || !height || !weight) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newRecord = {
    id: Date.now(), // Use timestamp as ID for uniqueness
    name,
    age,
    gender,
    height,
    weight,
    bmi,
    category,
    created_at: new Date().toISOString()
  };

  bmiRecords.unshift(newRecord);
  res.status(201).json({ message: 'Record saved successfully', id: newRecord.id });
});

// GET: Retrieve last 10 records (only non-expired)
app.get('/api/bmi', (req, res) => {
  const now = Date.now();
  const activeRecords = bmiRecords.filter(record => {
    const createdAt = new Date(record.created_at).getTime();
    return (now - createdAt) < MAX_AGE;
  });
  res.json(activeRecords.slice(0, 10));
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
