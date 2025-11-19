import pool from '../db.js';
import HttpError from '../utils/httpError.js';
import asyncHandler from '../utils/asyncHandler.js';

const ensurePositiveInt = (value, field = 'id') => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new HttpError(400, `${field}는 양의 정수여야 합니다.`);
  }
  return parsed;
};

const normalizePrice = price => {
  if (price === undefined || price === null) {
    throw new HttpError(400, 'price는 필수입니다.');
  }
  const numeric = Number(price);
  if (!Number.isFinite(numeric) || numeric < 0) {
    throw new HttpError(400, 'price는 0 이상 숫자여야 합니다.');
  }
  return Math.floor(numeric);
};

export const createItem = asyncHandler(async (req, res) => {
  const { name, description = null, price } = req.body;
  if (!name) {
    throw new HttpError(400, 'name은 필수입니다.');
  }
  const normalizedPrice = normalizePrice(price);
  const [result] = await pool.execute(
    'INSERT INTO items (name, description, price) VALUES (?, ?, ?)',
    [name, description, normalizedPrice]
  );
  res.status(201).json({
    data: { id: result.insertId, name, description, price: normalizedPrice },
  });
});

export const listItems = asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM items ORDER BY id DESC');
  res.status(200).json({ data: rows });
});

export const getItem = asyncHandler(async (req, res) => {
  const id = ensurePositiveInt(req.params.id);
  const [rows] = await pool.query('SELECT * FROM items WHERE id = ?', [id]);
  if (rows.length === 0) {
    throw new HttpError(404, '존재하지 않는 아이템입니다.');
  }
  res.status(200).json({ data: rows[0] });
});

export const updateItem = asyncHandler(async (req, res) => {
  const id = ensurePositiveInt(req.params.id);
  const { name, description = null, price } = req.body;
  if (!name) {
    throw new HttpError(400, 'name은 필수입니다.');
  }
  const normalizedPrice = normalizePrice(price);
  const [result] = await pool.execute(
    'UPDATE items SET name = ?, description = ?, price = ? WHERE id = ?',
    [name, description, normalizedPrice, id]
  );
  if (result.affectedRows === 0) {
    throw new HttpError(404, '존재하지 않는 아이템입니다.');
  }
  res.status(200).json({
    data: { id, name, description, price: normalizedPrice },
  });
});

export const deleteItem = asyncHandler(async (req, res) => {
  const id = ensurePositiveInt(req.params.id);
  const [result] = await pool.execute('DELETE FROM items WHERE id = ?', [id]);
  if (result.affectedRows === 0) {
    throw new HttpError(404, '존재하지 않는 아이템입니다.');
  }
  res.status(204).send();
});