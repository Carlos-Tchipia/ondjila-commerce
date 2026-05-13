-- Limpeza e Ajuste de Produtos
-- Este script garante que apenas 4 produtos por categoria fiquem visíveis (Ativos)
-- e que cada um tenha a imagem correta.

USE `ondjila_commerce`;

-- 1. Primeiro, desativamos TODOS os produtos para começar do zero
UPDATE products SET is_active = 0;

-- 2. Função para ativar e mapear imagens (usando subqueries para precisão)
-- Smartphones
UPDATE products p
JOIN (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as row_num 
    FROM products WHERE category = 'Smartphones' LIMIT 4
) t ON p.id = t.id
SET p.is_active = 1, p.image_url = CONCAT('assets/images/products/smartphones_', t.row_num, '.jpg');

-- Laptops
UPDATE products p
JOIN (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as row_num 
    FROM products WHERE category = 'Laptops' LIMIT 4
) t ON p.id = t.id
SET p.is_active = 1, p.image_url = CONCAT('assets/images/products/laptops_', t.row_num, '.jpg');

-- Smartwatches
UPDATE products p
JOIN (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as row_num 
    FROM products WHERE category = 'Smartwatches' LIMIT 4
) t ON p.id = t.id
SET p.is_active = 1, p.image_url = CONCAT('assets/images/products/smartwatches_', t.row_num, '.jpg');

-- Auscultadores
UPDATE products p
JOIN (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as row_num 
    FROM products WHERE category = 'Auscultadores' LIMIT 4
) t ON p.id = t.id
SET p.is_active = 1, p.image_url = CONCAT('assets/images/products/auscultadores_', t.row_num, '.jpg');

-- Tablets
UPDATE products p
JOIN (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as row_num 
    FROM products WHERE category = 'Tablets' LIMIT 4
) t ON p.id = t.id
SET p.is_active = 1, p.image_url = CONCAT('assets/images/products/tablets_', t.row_num, '.jpg');

-- Cameras
UPDATE products p
JOIN (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as row_num 
    FROM products WHERE category = 'Cameras' LIMIT 4
) t ON p.id = t.id
SET p.is_active = 1, p.image_url = CONCAT('assets/images/products/cameras_', t.row_num, '.jpg');

-- 3. Garantir que o frontend filtre apenas produtos ativos
-- (Já deve estar a acontecer, mas reforçamos a query da API se necessário)
