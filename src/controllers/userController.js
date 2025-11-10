// 전체 조회
import pool from '../db.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.status(200).json({ data: rows });
  } catch (err) {
    next(err);
  }
};


// 단일 조회
export const getUserById = async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// 생성
export const createUser = async (req, res, next) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  try {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    const insertedId = result.insertId;
    res.status(201).json({ data: { id: insertedId, name, email } });
  } catch (err) {
    next(err);
  }
};


// 전체 교체 (PUT)
export const replaceUser = async (req, res, next) => {
  const id = Number(req.params.id);
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  try {
    const [result] = await pool.execute(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    res.status(200).json({ data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// 일부 수정 (PATCH)
/* export const updateUser = (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { name, email } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  res.json({ data: user });
}; */

// 삭제
export const deleteUser = async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
