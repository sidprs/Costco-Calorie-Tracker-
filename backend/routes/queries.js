const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/items', async (req, res) => {
  try {
    const result = await pool.query({
      text: 'SELECT * FROM Item ORDER BY Name',
      values: []
    });
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

router.get('/items/search', async (req, res) => {
  try {
    const { query } = req.query;
    const result = await pool.query({
      text: 'SELECT * FROM Item WHERE LOWER(Name) LIKE LOWER($1) ORDER BY Name',
      values: [`%${query}%`]
    });
    res.json(result.rows);
  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

router.get('/items/filter', async (req, res) => {
  try {
    const { maxCalories, minProtein, maxPrice } = req.query;
    const conditions = [];
    const params = [];

    if (maxCalories) {
      conditions.push(`Calories <= $${params.length + 1}`);
      params.push(parseInt(maxCalories));
    }
    if (minProtein) {
      conditions.push(`Protein >= $${params.length + 1}`);
      params.push(parseInt(minProtein));
    }
    if (maxPrice) {
      conditions.push(`Price <= $${params.length + 1}`);
      params.push(parseInt(maxPrice));
    }

    let queryText = 'SELECT * FROM Item';
    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }
    queryText += ' ORDER BY Name';

    console.log('Executing query:', queryText);
    console.log('With params:', params);
    
    const result = await pool.query({
      text: queryText,
      values: params
    });
    
    console.log('Filter successful. Rows returned:', result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error('Filter error:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

router.get('/users/:userId/orders', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query({
      text: `SELECT o.*, u.FirstName, u.LastName 
             FROM Orders o 
             JOIN Users u ON o.UserID = u.UserID 
             WHERE o.UserID = $1 
             ORDER BY o.Date DESC`,
      values: [userId]
    });
    res.json(result.rows);
  } catch (err) {
    console.error('Orders error:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

router.get('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const orderResult = await pool.query({
      text: 'SELECT * FROM Orders WHERE OrderID = $1',
      values: [orderId]
    });
    
    const itemsResult = await pool.query({
      text: `SELECT oi.*, i.* 
             FROM OrderItem oi 
             JOIN Item i ON oi.ItemName = i.Name 
             WHERE oi.OrderID = $1`,
      values: [orderId]
    });
    
    res.json({
      order: orderResult.rows[0],
      items: itemsResult.rows
    });
  } catch (err) {
    console.error('Order details error:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

router.get('/users/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query({
      text: `SELECT 
              COUNT(*) as total_orders,
              AVG(TotalCalories) as avg_calories,
              AVG(TotalProtein) as avg_protein,
              SUM(Receipt) as total_spent
             FROM Orders 
             WHERE UserID = $1`,
      values: [userId]
    });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Stats error:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

router.get('/items/favorites', async (req, res) => {
  try {
    const result = await pool.query({
      text: 'SELECT * FROM Item WHERE Favorite = TRUE ORDER BY Name',
      values: []
    });
    res.json(result.rows);
  } catch (err) {
    console.error('Favorites error:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

router.get('/users/:userId/favorites', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query({
      text: `SELECT * FROM Orders 
             WHERE UserID = $1 AND Favorite = TRUE 
             ORDER BY Date DESC`,
      values: [userId]
    });
    res.json(result.rows);
  } catch (err) {
    console.error('User favorites error:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

router.post('/orders', async (req, res) => {
  const client = await pool.connect();
  try {
    const { userId, items, totals } = req.body;
    await client.query('BEGIN');
    const idResult = await client.query('SELECT MAX(OrderID) as max_id FROM Orders');
    const newOrderId = (idResult.rows[0].max_id || 1000) + 1;
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    await client.query({
      text: `INSERT INTO Orders (OrderID, Date, Favorite, Notes, TotalCalories, TotalProtein, TotalCarbs, TotalFats, TotalFiber, Receipt, UserID)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      values: [
        newOrderId,
        today,
        false,
        '',
        totals.calories,
        totals.protein,
        totals.carbs,
        totals.fats,
        totals.fiber,
        totals.price,
        userId
      ]
    });
    const itemCounts = {};
    items.forEach(item => {
      itemCounts[item.name] = (itemCounts[item.name] || 0) + 1;
    });
    for (const [itemName, quantity] of Object.entries(itemCounts)) {
      await client.query({
        text: 'INSERT INTO OrderItem (OrderID, ItemName, Quantity) VALUES ($1, $2, $3)',
        values: [newOrderId, itemName, quantity]
      });
    }
    await client.query('COMMIT');
    res.status(201).json({ message: 'Order placed successfully', orderId: newOrderId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Checkout error:', err.message);
    res.status(500).json({ error: 'Checkout failed', details: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;