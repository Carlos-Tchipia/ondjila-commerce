-- Ondjila Commerce - integrações de checkout, pagamento, moeda e imagens

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS currency CHAR(3) NOT NULL DEFAULT 'AOA' AFTER payment_method,
  ADD COLUMN IF NOT EXISTS exchange_rate DECIMAL(18,8) NOT NULL DEFAULT 1 AFTER currency,
  ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(120) NULL AFTER exchange_rate,
  ADD COLUMN IF NOT EXISTS payment_provider VARCHAR(40) NULL AFTER payment_reference;

ALTER TABLE products
  MODIFY image_url VARCHAR(1000) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS image_source ENUM('local','external') NOT NULL DEFAULT 'local' AFTER image_url;

CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders (payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_reference ON orders (payment_reference);
