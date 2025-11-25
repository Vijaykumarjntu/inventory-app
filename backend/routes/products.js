import express from 'express';
import multer from 'multer';

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  const db = req.app.get('db');
  try {
    const products = await db.all('SELECT * FROM products ORDER BY created_at DESC');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/',async(req,res)=>{
  const {name, unit, category, brand, stock, status} = req.body;
  const query =  `insert into products(name,unit,category,brand,stock,status) values ?,?,?,?,?,?`;
  await db.run(query,[name, unit, category, brand, stock, status])
})

// Search products
router.get('/search', async (req, res) => {
  const db = req.app.get('db');
  const { name } = req.query;
  
  try {
    const products = await db.all(
      'SELECT * FROM products WHERE name LIKE ? ORDER BY name',
      [`%${name}%`]
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  const db = req.app.get('db');
  const { id } = req.params;
  const { name, unit, category, brand, stock, status, changedBy = 'admin' } = req.body;

  try {
    // Get current stock for logging
    const currentProduct = await db.get('SELECT * FROM products WHERE id = ?', [id]);
    
    // Check name uniqueness (excluding current product)
    const existingProduct = await db.get(
      'SELECT id FROM products WHERE name = ? AND id != ?',
      [name, id]
    );
    
    if (existingProduct) {
      return res.status(400).json({ error: 'Product name must be unique' });
    }

    if (stock < 0) {
      return res.status(400).json({ error: 'Stock must be a positive number' });
    }

    await db.run(
      `UPDATE products 
       SET name = ?, unit = ?, category = ?, brand = ?, stock = ?, status = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [name, unit, category, brand, stock, status, id]
    );

    // Log inventory change if stock changed
    if (currentProduct.stock !== stock) {
      await db.run(
        'INSERT INTO inventory_logs (productId, oldStock, newStock, changedBy) VALUES (?, ?, ?, ?)',
        [id, currentProduct.stock, stock, changedBy]
      );
    }

    const updatedProduct = await db.get('SELECT * FROM products WHERE id = ?', [id]);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  const db = req.app.get('db');
  const { id } = req.params;

  try {
    await db.run('DELETE FROM products WHERE id = ?', [id]);
    await db.run('DELETE FROM inventory_logs WHERE productId = ?', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get inventory history
router.get('/:id/history', async (req, res) => {
  const db = req.app.get('db');
  const { id } = req.params;

  try {
    const history = await db.all(
      `SELECT * FROM inventory_logs 
       WHERE productId = ? 
       ORDER BY timestamp DESC`,
      [id]
    );
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;