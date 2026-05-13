-- Script para Corrigir Caminhos de Imagens
-- Mapeia as 24 fotos descarregadas pelo utilizador para os produtos existentes

USE `ondjila_commerce`;

-- Smartphones
SET @count = 0;
UPDATE products 
SET image_url = CONCAT('assets/images/products/smartphones_', (@count := @count + 1), '.jpg')
WHERE category = 'Smartphones' AND @count < 4;

-- Laptops
SET @count = 0;
UPDATE products 
SET image_url = CONCAT('assets/images/products/laptops_', (@count := @count + 1), '.jpg')
WHERE category = 'Laptops' AND @count < 4;

-- Smartwatches
SET @count = 0;
UPDATE products 
SET image_url = CONCAT('assets/images/products/smartwatches_', (@count := @count + 1), '.jpg')
WHERE category = 'Smartwatches' AND @count < 4;

-- Auscultadores
SET @count = 0;
UPDATE products 
SET image_url = CONCAT('assets/images/products/auscultadores_', (@count := @count + 1), '.jpg')
WHERE category = 'Auscultadores' AND @count < 4;

-- Tablets
SET @count = 0;
UPDATE products 
SET image_url = CONCAT('assets/images/products/tablets_', (@count := @count + 1), '.jpg')
WHERE category = 'Tablets' AND @count < 4;

-- Cameras
SET @count = 0;
UPDATE products 
SET image_url = CONCAT('assets/images/products/cameras_', (@count := @count + 1), '.jpg')
WHERE category = 'Cameras' AND @count < 4;

-- Para os produtos restantes (além dos 4 primeiros de cada), vamos usar uma imagem padrão
UPDATE products 
SET image_url = 'assets/images/products/smartphones_1.jpg'
WHERE image_url LIKE '/assets/products/initial/%';
