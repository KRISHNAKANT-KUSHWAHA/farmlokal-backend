import pool from "../../config/db";

/**
 * Fetch products with filters and cursor pagination
 * SAFE VERSION — NO `.query` ANYWHERE
 */
export async function getProducts(params: any = {}) {
  // Defensive guard
  if (!params || typeof params !== "object") {
    params = {};
  }

  const limit = Number(params.limit) || 10;
  const cursor = params.cursor || new Date().toISOString();
  const category = params.category;
  const minPrice = params.minPrice;
  const maxPrice = params.maxPrice;

  let sql = `
    SELECT * FROM products
    WHERE created_at < ?
  `;

  const values: any[] = [cursor];

  if (category) {
    sql += " AND category = ?";
    values.push(category);
  }

  if (minPrice) {
    sql += " AND price >= ?";
    values.push(Number(minPrice));
  }

  if (maxPrice) {
    sql += " AND price <= ?";
    values.push(Number(maxPrice));
  }

  sql += " ORDER BY created_at DESC LIMIT ?";
  values.push(limit);

  const [rows] = await pool.query(sql, values);
  return rows;
}
