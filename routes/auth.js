const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: '請填寫帳號與密碼' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: '密碼至少需要 6 個字元' });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: '此帳號已被使用' });
    }

    const user = new User({ username, password });
    await user.save();

    req.session.userId = user._id;
    req.session.username = user.username;

    res.json({ message: '註冊成功', username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: '帳號或密碼錯誤' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ error: '帳號或密碼錯誤' });
    }

    req.session.userId = user._id;
    req.session.username = user.username;

    res.json({ message: '登入成功', username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: '已登出' });
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  if (req.session && req.session.userId) {
    return res.json({ loggedIn: true, username: req.session.username });
  }
  res.json({ loggedIn: false });
});

module.exports = router;
