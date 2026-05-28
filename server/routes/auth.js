const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { pool } = require('../config/db');
const { authenticateToken } = require('../middleware/auth');
require('dotenv').config();

router.post('/register', async (req, res) => {
    let connection;
    try {
        const { name, email, password } = req.body;
        console.log(`Регистрация: ${name} <${email}>`);

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Заполните все поля' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Пароль минимум 6 символов' });
        }

        connection = await pool.getConnection();

        const [existing] = await connection.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Этот email уже зарегистрирован' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await connection.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        const userId = result.insertId;

        const token = jwt.sign(
            { userId, email },
            process.env.JWT_SECRET || 'super-secret',
            { expiresIn: '7d' }
        );

        console.log(`Зарегистрирован: ${email}`);

        res.status(201).json({
            message: 'Регистрация успешна!',
            token,
            user: {
                id: userId,
                name,
                email
            }
        });

    } catch (error) {
        console.error(' Ошибка регистрации:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    } finally {
        if (connection) connection.release();
    }
});

router.post('/login', async (req, res) => {
    let connection;
    try {
        const { email, password } = req.body;
        console.log(` Вход: ${email}`);

        if (!email || !password) {
            return res.status(400).json({ message: 'Email и пароль обязательны' });
        }

        connection = await pool.getConnection();

        const [users] = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        // Создаем токен
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'super-secret',
            { expiresIn: '7d' }
        );

        console.log(`Вход выполнен: ${email}`);

        res.json({
            message: 'Вход выполнен',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    } finally {
        if (connection) connection.release();
    }
});

router.get('/profile', authenticateToken, async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [users] = await connection.execute(
            'SELECT id, name, email, created_at FROM users WHERE id = ?',
            [req.user.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.json({ user: users[0] });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;