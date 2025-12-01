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
    let paramCount = 1;

    if (maxCalories) {
      conditions.push(`Calories <= ${paramCount}`);
      params.push(parseInt(maxCalories));
      paramCount++;
    }
    if (minProtein) {
      conditions.push(`Protein >= ${paramCount}`);
      params.push(parseInt(minProtein));
      paramCount++;
    }
    if (maxPrice) {
      conditions.push(`Price <= ${paramCount}`);
      params.push(parseInt(maxPrice));
      paramCount++;
    }

    let query = 'SELECT * FROM Item';
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY Name';

    console.log('Executing query:', query);
    console.log('With params:', params);
    
    const result = await pool.query(query, params);
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

module.exports = router;