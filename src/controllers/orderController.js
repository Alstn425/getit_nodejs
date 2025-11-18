import pool from '../db.js';
import HttpError from '../utils/httpError.js';
import asyncHandler from '../utils/asyncHandler.js';

const ensureNumberId = (value, fieldName) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new HttpError(400, `${fieldName} must be a positive integer`);
  }
  return parsed;
};

const ensureEntityExists = async (table, id) => {
  const [rows] = await pool.query(`SELECT id FROM ${table} WHERE id = ?`, [id]);
  if (rows.length === 0) {
    throw new HttpError(404, `${table.slice(0, -1)} not found`);
  }
};

// 전체 주문 조회
export const getAllOrders = asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM orders');
  res.status(200).json({ data: rows });
});

// 주문 생성
export const createOrder = asyncHandler(async (req, res) => {
  if (req.body.user_id === undefined || req.body.product_id === undefined) {
    throw new HttpError(400, 'user_id and product_id are required');
  }

  const userId = ensureNumberId(req.body.user_id, 'user_id');
  const productId = ensureNumberId(req.body.product_id, 'product_id');

  await ensureEntityExists('users', userId);
  await ensureEntityExists('products', productId);

  const [result] = await pool.execute(
    'INSERT INTO orders (user_id, product_id) VALUES (?, ?)',
    [userId, productId]
  );
  res.status(201).json({
    data: { id: result.insertId, user_id: userId, product_id: productId },
  });
});

// 사용자+상품 JOIN 조회
export const getJoinedOrders = asyncHandler(async (req, res) => {
  const userId = ensureNumberId(req.query.userId ?? 1, 'userId');

  const sql = `
    SELECT
      o.id         AS id,
      o.user_id    AS user_id,
      u.name       AS user_name,
      p.name       AS product_name,
      o.order_date AS order_date
    FROM orders o
    JOIN users    u ON o.user_id    = u.id
    JOIN products p ON o.product_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.order_date DESC
  `;

  const [rows] = await pool.execute(sql, [userId]);
  res.status(200).json({ data: rows });
});

// 특정 사용자 주문 조회
export const getUserOrders = asyncHandler(async (req, res) => {
  const userId = ensureNumberId(req.params.userId, 'userId');

  const [rows] = await pool.execute(
    'SELECT * FROM orders WHERE user_id = ?',
    [userId]
  );

  if (rows.length === 0) {
    throw new HttpError(404, 'Orders not found for this user');
  }

  res.status(200).json({ data: rows });
});
