PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
) STRICT;

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL CHECK (stock >= 0),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
) STRICT;

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'canceled')), 
  total_amount REAL NOT NULL CHECK (total_amount >= 0),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) STRICT;

CREATE TABLE order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
) STRICT;

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
