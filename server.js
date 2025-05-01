import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const port = 8002;
const app = express();

// Get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "dist" directory
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoint
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Serve React index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Hyre Tracking serving at http://localhost:${port}`);
});