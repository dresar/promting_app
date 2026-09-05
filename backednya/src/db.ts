import mysql from 'mysql2/promise';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const query = async (text: string, params?: any[]): Promise<any> => {
  // Convert PostgreSQL parameter syntax ($1, $2) to MySQL (?)
  let mysqlSql = text.replace(/\$\d+/g, '?');
  
  // Replace PostgreSQL type casts
  mysqlSql = mysqlSql.replace(/::text/g, '');
  mysqlSql = mysqlSql.replace(/::jsonb/g, '');

  const [rows] = await pool.execute(mysqlSql, params);
  
  // Return format as { rows: [...] } to maintain compatibility with postgres controllers
  return { rows: rows as any[] };
};

export default pool;
