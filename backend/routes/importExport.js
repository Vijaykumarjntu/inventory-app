import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Import CSV
router.post('/import', upload.single('file'), async (req, res) => {
  const db = req.app.get('db');
  const results = [];
  const duplicates = [];
  let added = 0;
  let skipped = 0;
  console.log("this part in import working")
  try {
    // Read and process CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });
    console.log("reading promise working")
    // Process each record
    for (const record of results) {
      const { name, unit, category, brand, stock, status, image } = record;
      
      // Check for duplicates (case-insensitive)
      const existingProduct = await db.get(
        'SELECT id FROM products WHERE LOWER(name) = LOWER(?)',
        [name]
      );

      if (existingProduct) {
        skipped++;
        duplicates.push({ name, existingId: existingProduct.id });
        continue;
      }

      // Insert new product
      await db.run(
        `INSERT INTO products (name, unit, category, brand, stock, status, image) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, unit, category, brand, parseInt(stock), status, image]
      );
      added++;
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({ added, skipped, duplicates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export CSV
router.get('/export', async (req, res) => {
  const db = req.app.get('db');

  try {
    const products = await db.all('SELECT * FROM products');

    const csvWriter = createObjectCsvWriter({
      path: 'products_export.csv',
      header: [
        { id: 'name', title: 'Name' },
        { id: 'unit', title: 'Unit' },
        { id: 'category', title: 'Category' },
        { id: 'brand', title: 'Brand' },
        { id: 'stock', title: 'Stock' },
        { id: 'status', title: 'Status' },
        { id: 'image', title: 'Image' }
      ]
    });

    await csvWriter.writeRecords(products);

    res.download('products_export.csv', 'products_export.csv', (err) => {
      if (!err) {
        fs.unlinkSync('products_export.csv');
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;