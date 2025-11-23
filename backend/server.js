import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './database.js';
import productRoutes from './routes/products.js';
import importExportRoutes from './routes/importExport.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Initialize database
const db = await initializeDatabase();
app.set('db', db);

// Routes
app.use('/api/products', productRoutes);
app.use('/api/products', importExportRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});