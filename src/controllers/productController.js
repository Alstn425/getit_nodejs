import pool from '../db.js';
import HttpError from '../utils/httpError.js';
import asyncHandler from '../utils/asyncHandler.js';

const parsePrice = price => {
  if (price === undefined || price === null) {
    throw new HttpError(400, 'price is required');
  }
  const numeric = Number(price);
  if (!Number.isFinite(numeric)) {
    throw new HttpError(400, 'price must be a number');
  }
  return numeric;
};

const parseProductId = id => {
  const parsed = Number(id);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new HttpError(400, 'Invalid product id');
  }
  return parsed;
};

// 전체 상품 조회
export const getAllProducts = asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM products');
  res.status(200).json({ data: rows });
});

// 상품 생성
export const createProduct = asyncHandler(async (req, res) => {
  const { name, price } = req.body;
  if (!name) {
    throw new HttpError(400, 'name is required');
  }
  const numericPrice = parsePrice(price);

  const [result] = await pool.execute(
    'INSERT INTO products (name, price) VALUES (?, ?)',
    [name, numericPrice]
  );
  res.status(201).json({ data: { id: result.insertId, name, price: numericPrice } });
});

// 단일 상품 조회
export const getProductById = asyncHandler(async (req, res) => {
  const id = parseProductId(req.params.id);
  const [rows] = await pool.execute(
    'SELECT * FROM products WHERE id = ?',
    [id]
  );
  if (rows.length === 0) {
    throw new HttpError(404, 'Product not found');
  }
  res.status(200).json({ data: rows[0] });
});
