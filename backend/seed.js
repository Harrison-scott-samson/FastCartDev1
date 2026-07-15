const mysql = require('mysql2/promise');

async function seed() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'annaADMIN#123s',
      database: 'fastcart'
    });

    const products = [
      ['Classic Salted Lays', 'Snacks', 20.00, 50, 'https://images.unsplash.com/photo-1566478989037-eade1760eba3?auto=format&fit=crop&w=500&q=80'],
      ['Spicy Kurkure', 'Snacks', 20.00, 40, 'https://images.unsplash.com/photo-1621415444142-ffde425e4c0e?auto=format&fit=crop&w=500&q=80'],
      ['Classmate Notebook 100 Pages', 'Stationery', 45.00, 100, 'https://images.unsplash.com/photo-1531346878377-a5fbfea8a543?auto=format&fit=crop&w=500&q=80'],
      ['Blue Gel Pen (Pack of 5)', 'Stationery', 25.00, 200, 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=500&q=80'],
      ['Nescafe Cold Coffee', 'Drinks', 40.00, 30, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80'],
      ['Mineral Water Bottle 1L', 'Drinks', 20.00, 150, 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=500&q=80'],
      ['Pocket Hand Sanitizer', 'Essentials', 15.00, 80, 'https://images.unsplash.com/photo-1584483766114-2cea6facd63c?auto=format&fit=crop&w=500&q=80'],
      ['Chocolate Chip Cookies', 'Snacks', 30.00, 45, 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=500&q=80']
    ];

    // Clear existing to avoid duplicates if accidentally run twice
    await connection.query('DELETE FROM products');

    for (const p of products) {
      await connection.query(
        'INSERT INTO products (name, category, price, stock, image) VALUES (?, ?, ?, ?, ?)',
        p
      );
    }

    console.log('Successfully seeded premium products into the FASTCART database!');
    await connection.end();
  } catch (error) {
    console.error('Failed to seed:', error.message);
  }
}

seed();
