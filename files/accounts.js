const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const requireAuth = require('../middleware/auth');

// All routes below require login
router.use(requireAuth);

// GET /api/accounts — get current user's records
router.get('/', async (req, res) => {
  try {
    const records = await Account.find({ userId: req.session.userId }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// POST /api/accounts — create new record
router.post('/', async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;

    if (!title || amount === undefined || !type) {
      return res.status(400).json({ error: '請填寫完整資料' });
    }

    const record = new Account({
      userId: req.session.userId,
      title,
      amount: Number(amount),
      type,
      category: category || '其他',
      date: date || Date.now(),
    });

    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// DELETE /api/accounts/:id — delete a record (only owner)
router.delete('/:id', async (req, res) => {
  try {
    const record = await Account.findOneAndDelete({
      _id: req.params.id,
      userId: req.session.userId,
    });

    if (!record) {
      return res.status(404).json({ error: '找不到此筆記錄' });
    }

    res.json({ message: '已刪除' });
  } catch (err) {
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

module.exports = router;
