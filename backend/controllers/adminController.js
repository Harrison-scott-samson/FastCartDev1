const db = require('../config/db');

const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.*, u.name as user_name 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC
    `);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Preparing', 'Ready', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ message: 'Order updated', id: req.params.id, status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const [orders] = await db.query('SELECT COUNT(*) as totalOrders FROM orders');
    const [products] = await db.query('SELECT COUNT(*) as totalProducts FROM products');
    const [users] = await db.query('SELECT COUNT(*) as totalUsers FROM users WHERE role="student"');
    
    res.json({
      orders: orders[0].totalOrders,
      products: products[0].totalProducts,
      users: users[0].totalUsers
    });
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllOrders, updateOrderStatus, getAdminStats };
