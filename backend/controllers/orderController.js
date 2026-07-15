const db = require('../config/db');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const generateToken = () => 'TKN' + Math.floor(1000 + Math.random() * 9000).toString();

const createOrder = async (req, res) => {
  const { orderItems, paymentMethod } = req.body;
  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    let total_price = 0;
    
    for (let i = 0; i < orderItems.length; i++) {
      const item = orderItems[i];
      const [rows] = await connection.query('SELECT price, stock FROM products WHERE id = ?', [item.product_id]);
      if (rows.length === 0) throw new Error(`Product ${item.product_id} not found`);
      if (rows[0].stock < item.quantity) throw new Error(`Product ${item.product_id} out of stock`);
      
      item.calculatedPrice = parseFloat(rows[0].price);
      total_price += item.calculatedPrice * item.quantity;
      
      await connection.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
    }

    const otp = generateOTP();
    const token = generateToken();

    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_price, payment_method, otp, token, status) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, total_price, paymentMethod, otp, token, 'Pending']
    );
    
    const orderId = orderResult.insertId;

    for (let i = 0; i < orderItems.length; i++) {
      const item = orderItems[i];
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.calculatedPrice]
      );
    }

    await connection.commit();
    res.status(201).json({ id: orderId, total_price, payment_method: paymentMethod, otp, token, status: 'Pending' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
};

const getUserOrders = async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = orders[0];
    
    if (order.user_id !== req.user.id && req.user.role !== 'shopkeeper') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const [items] = await db.query('SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?', [order.id]);
    order.orderItems = items;
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getUserOrders, getOrderById };
