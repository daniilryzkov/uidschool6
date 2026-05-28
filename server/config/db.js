const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: undefined,
    database: 'pdd_test',
    port: 3307,
    waitForConnections: true,
    connectionLimit: 10
});

async function initializeDatabase() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: undefined,
            port: 3307
        });

        await connection.execute(
            'CREATE DATABASE IF NOT EXISTS `pdd_test` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
        );
        console.log('База данных готова');
        
        await connection.end();
        

        connection = await pool.getConnection();
        
        // Создаем таблицы, только если их нет
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS test_results (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                category VARCHAR(50) NOT NULL,
                score INT NOT NULL,
                total_questions INT NOT NULL,
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        console.log('Таблицы проверены и готовы');
        
    } catch (error) {
        console.error('Ошибка инициализации БД:', error.message);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

module.exports = { pool, initializeDatabase };