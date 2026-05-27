const mysql = require('mysql2/promise');

let pool;

const createPool = () => {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smartart_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
  });
  return pool;
};

const getPool = () => {
  if (!pool) createPool();
  return pool;
};

const connectDB = async (retries = 10, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const p = getPool();
      const conn = await p.getConnection();
      console.log('✅ MySQL connected successfully');
      conn.release();
      return p;
    } catch (err) {
      console.log(`⏳ DB connection attempt ${i + 1}/${retries} failed: ${err.message}`);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('❌ Could not connect to MySQL after', retries, 'attempts');
        process.exit(1);
      }
    }
  }
};

const query = async (sql, params = []) => {
  const p = getPool();
  const [results] = await p.execute(sql, params);
  return results;
};

const queryOne = async (sql, params = []) => {
  const results = await query(sql, params);
  return results[0] || null;
};

// Initialize connection
connectDB();

module.exports = { getPool, query, queryOne, connectDB };
