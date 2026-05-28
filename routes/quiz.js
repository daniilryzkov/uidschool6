const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

router.post('/result', authenticateToken, async (req, res) => {
    let connection;
    try {
        const { category, score, totalQuestions } = req.body;
        const userId = req.user.userId;

        console.log('Сохранение:', { userId, category, score, totalQuestions });

        if (!category || score === undefined || !totalQuestions) {
            return res.status(400).json({ message: 'Не все данные' });
        }

        connection = await pool.getConnection();
        
        const sql = 'INSERT INTO test_results (user_id, category, score, total_questions) VALUES (?, ?, ?, ?)';
        const [result] = await connection.execute(sql, [userId, category, score, totalQuestions]);

        console.log('Сохранено, id:', result.insertId);
        
        res.json({ 
            message: 'Результат сохранен', 
            id: result.insertId 
        });
        
    } catch (error) {
        console.error('Ошибка:', error.message);
        console.error('Полная ошибка:', error);
        res.status(500).json({ message: 'Ошибка сервера: ' + error.message });
    } finally {
        if (connection) connection.release();
    }
});

router.get('/history', authenticateToken, async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        
        const [results] = await connection.execute(
            'SELECT category, score, total_questions, completed_at FROM test_results WHERE user_id = ? ORDER BY completed_at DESC LIMIT 50',
            [req.user.userId]
        );

        console.log(`История для user=${req.user.userId}: ${results.length} записей`);
        res.json({ results });
        
    } catch (error) {
        console.error('Ошибка истории:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;