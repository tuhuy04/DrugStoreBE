import mysql from 'mysql2/promise'; 
import { env } from './environment.js';

const pool = mysql.createPool({ 
    host: env.APP_HOST,  
    database: env.DATABASE_NAME, 
    user: env.DB_USER || 'root', 
    password: env.DB_PASSWORD || '13022004', 
});

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected as id ' + connection.threadId);
        connection.release();
    } catch (err) {
        console.error('Error connecting: ' + err.stack);
    }
};

testConnection();

export { pool };
