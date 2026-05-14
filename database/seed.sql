-- ============================================================
-- ONDJILA COMMERCE — Seed de Dados (Produtos Reais de Tecnologia)
-- Execute APÓS o schema.sql
-- ============================================================

USE `ondjila_commerce`;

-- ------------------------------------------------------------
-- Perfis de teste
-- Admin: Admin@2026!
-- Clientes: Cliente@2026!
-- ------------------------------------------------------------
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'Carlos Ondjila',  'carlos@ondjila.ao',  '$2y$10$Ktdefl/3KMFLAcEz6hgLe.VJ2hbvhyNDGddCdVdCNbky0LwDFuGWC', 'admin'),
(2, 'Ana Mbala',       'ana@gmail.com',       '$2y$10$2FkbsQLOjRydBV94PxCKf.tq1fURLA4vtgWnpR4FnBMl6JFRJv0xy', 'customer'),
(3, 'Pedro Lopes',     'pedro@gmail.com',     '$2y$10$2FkbsQLOjRydBV94PxCKf.tq1fURLA4vtgWnpR4FnBMl6JFRJv0xy', 'customer'),
(4, 'Jose Tala',       'jose@ondjila.ao',     '$2y$10$2FkbsQLOjRydBV94PxCKf.tq1fURLA4vtgWnpR4FnBMl6JFRJv0xy', 'customer'),
(5, 'Cliente Ondjila', 'cliente@ondjila.ao',  '$2y$10$2FkbsQLOjRydBV94PxCKf.tq1fURLA4vtgWnpR4FnBMl6JFRJv0xy', 'customer');

-- ------------------------------------------------------------
-- Categorias
-- ------------------------------------------------------------
INSERT INTO `categories` (`name`, `slug`, `description`) VALUES
('Smartphones',     'smartphones',    'Telemóveis de última geração das melhores marcas'),
('Laptops',         'laptops',        'Computadores portáteis para trabalho e entretenimento'),
('Smartwatches',    'smartwatches',   'Relógios inteligentes e wearables premium'),
('Auscultadores',   'auscultadores',  'Headphones e earbuds com som de alta fidelidade'),
('Tablets',         'tablets',        'Tablets para produtividade e criatividade'),
('Câmeras',         'cameras',        'Câmeras e equipamento fotográfico profissional');

-- ------------------------------------------------------------
-- Produtos
-- ------------------------------------------------------------
INSERT INTO `products` (`name`, `slug`, `description`, `price`, `original_price`, `stock`, `category`, `brand`, `image_url`, `rating`, `reviews_count`, `is_featured`) VALUES

-- Smartphones (1-4)
('Apple iPhone 15 Pro Max 256GB', 'apple-iphone-15-pro-max-256gb', 'O iPhone 15 Pro Max apresenta o design em titânio mais avançado da Apple.', 749000, 820000, 15, 'Smartphones', 'Apple', 'assets/images/products/smartphones_1.jpg', 4.8, 312, 1),
('Samsung Galaxy S24 Ultra 512GB', 'samsung-galaxy-s24-ultra-512gb', 'O Galaxy S24 Ultra redefine os limites do Galaxy AI com o S Pen integrado.', 689000, 749000, 12, 'Smartphones', 'Samsung', 'assets/images/products/smartphones_2.jpg', 4.7, 287, 1),
('Google Pixel 8 Pro 256GB', 'google-pixel-8-pro-256gb', 'Pixel 8 Pro com chip Google Tensor G3 e câmera de 50MP.', 459000, 499000, 18, 'Smartphones', 'Google', 'assets/images/products/smartphones_3.jpg', 4.5, 134, 0),
('Xiaomi 14 Ultra 512GB Preto', 'xiaomi-14-ultra-512gb', 'Xiaomi 14 Ultra com câmera Leica de 50MP (1 polegada).', 629000, 689000, 8, 'Smartphones', 'Xiaomi', 'assets/images/products/smartphones_4.jpg', 4.6, 89, 0),

-- Laptops (5-8)
('Apple MacBook Pro 14" M3 Pro', 'apple-macbook-pro-14-m3-pro', 'MacBook Pro 14" com chip M3 Pro de 11 núcleos CPU.', 1450000, 1580000, 8, 'Laptops', 'Apple', 'assets/images/products/laptops_1.jpg', 4.9, 245, 1),
('Dell XPS 16 Intel Core Ultra 7', 'dell-xps-16', 'Dell XPS 16 premium com ecrã OLED 4K.', 1250000, 1350000, 5, 'Laptops', 'Dell', 'assets/images/products/laptops_2.jpg', 4.7, 120, 1),
('Lenovo ThinkPad X1 Carbon Gen 12', 'lenovo-thinkpad-x1-carbon-gen12', 'ThinkPad X1 Carbon Gen 12 com Intel Core Ultra 5.', 689000, 749000, 15, 'Laptops', 'Lenovo', 'assets/images/products/laptops_3.jpg', 4.5, 167, 0),
('ASUS ROG Zephyrus G14 RTX 4060', 'asus-rog-zephyrus-g14-rtx4060', 'O laptop gaming mais fino do mercado com AniMe Matrix LED.', 749000, 820000, 10, 'Laptops', 'ASUS', 'assets/images/products/laptops_4.jpg', 4.7, 203, 0),

-- Smartwatches (9-12)
('Apple Watch Ultra 2 49mm', 'apple-watch-ultra-2-49mm', 'Apple Watch Ultra 2 com caixa em titânio de 49mm.', 489000, 529000, 10, 'Smartwatches', 'Apple', 'assets/images/products/smartwatches_1.jpg', 4.8, 289, 1),
('Samsung Galaxy Watch 6 Classic', 'samsung-galaxy-watch-6-classic', 'O design clássico de relógio com coroa rotativa física.', 179000, 199000, 20, 'Smartwatches', 'Samsung', 'assets/images/products/smartwatches_2.jpg', 4.5, 198, 0),
('Garmin Fenix 7X Pro Solar', 'garmin-fenix-7x-pro-solar', 'Garmin Fenix 7X Pro Solar com carregamento solar e lanterna.', 389000, 419000, 8, 'Smartwatches', 'Garmin', 'assets/images/products/smartwatches_3.jpg', 4.7, 145, 0),
('Huawei Watch GT 4', 'huawei-watch-gt-4', 'Design geométrico elegante e até 14 dias de bateria.', 129000, 149000, 15, 'Smartwatches', 'Huawei', 'assets/images/products/smartwatches_4.jpg', 4.4, 98, 0),

-- Auscultadores (13-16)
('Sony WH-1000XM5 Over-Ear ANC', 'sony-wh-1000xm5-preto', 'O melhor Cancelamento Ativo de Ruído da indústria.', 129000, 149000, 22, 'Auscultadores', 'Sony', 'assets/images/products/auscultadores_1.jpg', 4.8, 567, 1),
('Apple AirPods Pro 2 (USB-C)', 'apple-airpods-pro-2-usb-c', 'AirPods Pro de 2ª geração com chip H2 e USB-C.', 145000, 159000, 35, 'Auscultadores', 'Apple', 'assets/images/products/auscultadores_2.jpg', 4.7, 412, 1),
('Bose QuietComfort Ultra', 'bose-quietcomfort-ultra', 'Som imersivo de classe mundial e o melhor ANC da Bose.', 189000, 210000, 12, 'Auscultadores', 'Bose', 'assets/images/products/auscultadores_3.jpg', 4.6, 120, 0),
('Sennheiser Momentum 4', 'sennheiser-momentum-4', 'Qualidade de som superior Sennheiser com 60h de bateria.', 159000, 175000, 14, 'Auscultadores', 'Sennheiser', 'assets/images/products/auscultadores_4.jpg', 4.5, 85, 0),

-- Tablets (17-20)
('Apple iPad Pro M4 13"', 'apple-ipad-pro-13-m4', 'iPad Pro 13" com o revolucionário chip M4 e OLED.', 759000, 820000, 10, 'Tablets', 'Apple', 'assets/images/products/tablets_1.jpg', 4.8, 198, 1),
('Samsung Galaxy Tab S9 Ultra', 'samsung-galaxy-tab-s9-ultra', 'Ecrã Dynamic AMOLED 2X de 14,6" com S Pen incluída.', 579000, 649000, 8, 'Tablets', 'Samsung', 'assets/images/products/tablets_2.jpg', 4.6, 167, 0),
('Apple iPad Air M2', 'apple-ipad-air-m2', 'Performance poderosa do chip M2 num design leve.', 389000, 429000, 25, 'Tablets', 'Apple', 'assets/images/products/tablets_3.jpg', 4.7, 145, 0),
('Microsoft Surface Pro 11', 'microsoft-surface-pro-11', 'O novo Surface Copilot+ PC para máxima produtividade.', 529000, 580000, 5, 'Tablets', 'Microsoft', 'assets/images/products/tablets_4.jpg', 4.5, 56, 0),

-- Cameras (21-24)
('Sony A7RV', 'sony-a7rv', 'Mirrorless full-frame de 61MP com autofoco com IA.', 1890000, 2000000, 3, 'Câmeras', 'Sony', 'assets/images/products/cameras_1.jpg', 4.9, 45, 1),
('Canon EOS R5', 'canon-eos-r5', 'Câmera full-frame fantástica para fotos 45MP e vídeo 8K.', 1750000, 1850000, 4, 'Câmeras', 'Canon', 'assets/images/products/cameras_2.jpg', 4.8, 62, 1),
('Fujifilm X100VI', 'fujifilm-x100vi', 'A câmera compacta premium mais desejada do mercado.', 850000, 920000, 2, 'Câmeras', 'Fujifilm', 'assets/images/products/cameras_3.jpg', 4.9, 128, 0),
('DJI Osmo Action 4', 'dji-osmo-action-4', 'A melhor câmera de ação para baixa luminosidade.', 189000, 210000, 18, 'Câmeras', 'DJI', 'assets/images/products/cameras_4.jpg', 4.6, 89, 0);

-- ------------------------------------------------------------
-- Avaliações de Demonstração
-- ------------------------------------------------------------
INSERT INTO `reviews` (`product_id`, `user_id`, `rating`, `comment`) VALUES
(1, 2, 5, 'Produto incrível! O chip A17 Pro é uma besta. Câmera excepcional.'),
(1, 3, 5, 'Vale cada kwanza. A diferença do titânio na mão é notável.'),
(5, 3, 5, 'MacBook Pro M3 Pro é extraordinário. Silencioso e rápido.'),
(13, 2, 5, 'Sony WH-1000XM5 são os melhores headphones que já usei.');
