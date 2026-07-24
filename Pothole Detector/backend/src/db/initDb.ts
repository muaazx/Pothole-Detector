import fs from 'fs';
import path from 'path';
import pool from './index';

async function initDb() {
  try {
    console.log('Reading schema.sql...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    
    console.log('Executing schema...');
    await pool.query(schemaSql);
    
    console.log('Database schema initialized successfully.');
  } catch (err) {
    console.error('Error initializing database schema:', err);
  } finally {
    await pool.end();
  }
}

initDb();
