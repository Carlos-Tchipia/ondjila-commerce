-- ============================================================
-- ONDJILA COMMERCE — Seed de Dados (Produtos Reais de Tecnologia)
-- Execute APÓS o schema.sql
-- ============================================================

USE `ondjila_commerce`;

-- ------------------------------------------------------------
-- Admin + Utilizador de Teste
-- Senha: Admin@2026  (hash bcrypt)
-- ------------------------------------------------------------
INSERT INTO `users` (`name`, `email`, `password`, `role`) VALUES
('Carlos Tchipia', 'carlos@ondjila.ao',  '$2y$12$q8u4Vm1nM9pP3JaK.gSCeORfGRGlJCn0qm0I6F.4jEO7XBXwVmGQy', 'admin'),
('Ana Mbala',      'ana@gmail.com',      '$2y$12$q8u4Vm1nM9pP3JaK.gSCeORfGRGlJCn0qm0I6F.4jEO7XBXwVmGQy', 'customer'),
('Pedro Lopes',    'pedro@gmail.com',    '$2y$12$q8u4Vm1nM9pP3JaK.gSCeORfGRGlJCn0qm0I6F.4jEO7XBXwVmGQy', 'customer');

-- Nota: a senha acima corresponde a "Admin@2026" — mude em produção!

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
-- Produtos — Smartphones
-- ------------------------------------------------------------
INSERT INTO `products` (`name`, `slug`, `description`, `price`, `original_price`, `stock`, `category`, `brand`, `image_url`, `rating`, `reviews_count`, `is_featured`) VALUES

('Apple iPhone 15 Pro Max 256GB Titânio Natural',
 'apple-iphone-15-pro-max-256gb',
 'O iPhone 15 Pro Max apresenta o design em titânio mais avançado da Apple, chip A17 Pro, câmera principal de 48MP com zoom ótico de 5x, ecrã Super Retina XDR de 6,7" com ProMotion 120Hz e bateria de 29h de reprodução de vídeo. USB-C com velocidades USB 3. Dynamic Island.',
 749000, 820000, 15, 'Smartphones', 'Apple',
 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
 4.8, 312, 1),

('Samsung Galaxy S24 Ultra 512GB Titanium Black',
 'samsung-galaxy-s24-ultra-512gb',
 'O Galaxy S24 Ultra redefine os limites do Galaxy AI com o S Pen integrado. Ecrã Dynamic AMOLED 6,8" com brilho de 2600 nits, câmera de 200MP, zoom de 100x Space Zoom, processador Snapdragon 8 Gen 3 e bateria de 5000mAh. Câmera AI que edita as suas fotos automaticamente.',
 689000, 749000, 12, 'Smartphones', 'Samsung',
 'https://images.unsplash.com/photo-1706184526866-3e24c8fa7c47?w=800',
 4.7, 287, 1),

('Apple iPhone 15 128GB Preto',
 'apple-iphone-15-128gb-preto',
 'iPhone 15 com chip A16 Bionic, câmera principal de 48MP com modo Retrato avançado, Dynamic Island, ecrã Super Retina XDR de 6,1", carregamento USB-C e Emergência SOS via satélite. Vidro em Ceramic Shield.',
 519000, 560000, 25, 'Smartphones', 'Apple',
 'https://images.unsplash.com/photo-1696348841219-4c759b7e90bf?w=800',
 4.6, 198, 0),

('Samsung Galaxy A55 5G 256GB Azul Azurita',
 'samsung-galaxy-a55-5g-256gb',
 'Galaxy A55 5G com ecrã Super AMOLED de 6,6" a 120Hz, câmera triple de 50+12+5MP com OIS, processador Exynos 1480, 8GB RAM, bateria de 5000mAh e carregamento de 45W. Design premium com estrutura em metal.',
 189000, 210000, 40, 'Smartphones', 'Samsung',
 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
 4.4, 156, 0),

('Google Pixel 8 Pro 256GB Obsidian',
 'google-pixel-8-pro-256gb',
 'Pixel 8 Pro com chip Google Tensor G3, câmera de 50MP com zoom de 30x, ecrã LTPO OLED de 6,7" a 120Hz, 12GB RAM, 7 anos de atualizações Android e funcionalidades de IA únicas como Foto Desfocada ao Vivo e Apagador Mágico.',
 459000, 499000, 18, 'Smartphones', 'Google',
 'https://images.unsplash.com/photo-1695126037034-3cf9c9d96b7f?w=800',
 4.5, 134, 0),

('Xiaomi 14 Ultra 512GB Preto',
 'xiaomi-14-ultra-512gb',
 'Xiaomi 14 Ultra com câmera Leica de 50MP (1 polegada), Snapdragon 8 Gen 3, ecrã AMOLED de 6,73" a 120Hz, carregamento de 90W e sem fios de 80W, bateria de 5000mAh. A colaboração mais avançada com Leica na história.',
 629000, 689000, 8, 'Smartphones', 'Xiaomi',
 'https://images.unsplash.com/photo-1592950630581-03cb41342cc5?w=800',
 4.6, 89, 0);

-- ------------------------------------------------------------
-- Produtos — Laptops
-- ------------------------------------------------------------
INSERT INTO `products` (`name`, `slug`, `description`, `price`, `original_price`, `stock`, `category`, `brand`, `image_url`, `rating`, `reviews_count`, `is_featured`) VALUES

('Apple MacBook Pro 14" M3 Pro 18GB/512GB Space Gray',
 'apple-macbook-pro-14-m3-pro',
 'MacBook Pro 14" com chip M3 Pro de 11 núcleos CPU e 14 núcleos GPU, 18GB de memória unificada, SSD de 512GB, ecrã Liquid Retina XDR de 14,2" com ProMotion, bateria de 18h, MagSafe 3 e câmera FaceTime 12MP. O portátil mais poderoso da Apple.',
 1450000, 1580000, 8, 'Laptops', 'Apple',
 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
 4.9, 245, 1),

('HP Spectre x360 14" Intel Core Ultra 7 16GB/1TB',
 'hp-spectre-x360-14',
 'HP Spectre x360 com Intel Core Ultra 7 155H, 16GB LPDDR5, SSD NVMe de 1TB, ecrã OLED 2.8K touch de 14" com suporte a caneta OLED, design 2-em-1, câmeras HP Privacy com obturador físico, bateria de 17h e Thunderbolt 4.',
 879000, 949000, 12, 'Laptops', 'HP',
 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
 4.6, 178, 1),

('ASUS ROG Zephyrus G14 AMD Ryzen 9 32GB RTX 4060',
 'asus-rog-zephyrus-g14-rtx4060',
 'ROG Zephyrus G14 com AMD Ryzen 9 8945HS, 32GB DDR5, RTX 4060 8GB, SSD NVMe de 1TB, ecrã OLED QHD+ de 14" a 165Hz com 0,2ms de tempo de resposta. O laptop gaming mais fino do mercado com AniMe Matrix LED.',
 749000, 820000, 10, 'Laptops', 'ASUS',
 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800',
 4.7, 203, 0),

('Lenovo ThinkPad X1 Carbon Gen 12 Intel Core Ultra 5',
 'lenovo-thinkpad-x1-carbon-gen12',
 'ThinkPad X1 Carbon Gen 12 com Intel Core Ultra 5 125H, 16GB LPDDR5X, SSD de 512GB, ecrã IPS de 14" 2,8K, apenas 1,12 kg de peso, bateria de 15h, segurança ThinkShield e MIL-STD-810H. O referencial em produtividade empresarial.',
 689000, 749000, 15, 'Laptops', 'Lenovo',
 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
 4.5, 167, 0),

('Dell XPS 15 Intel Core i9 32GB RTX 4060',
 'dell-xps-15-i9-rtx4060',
 'Dell XPS 15 com Intel Core i9-13900H, 32GB DDR5, RTX 4060 8GB, SSD NVMe de 1TB, ecrã OLED 3.5K de 15,6" a 60Hz com 100% DCI-P3 e Delta-E<2. Corpo em alumínio com fibra de carbono e Thunderbolt 4.',
 829000, 899000, 7, 'Laptops', 'Dell',
 'https://images.unsplash.com/photo-1593642634443-44adaa06623a?w=800',
 4.7, 189, 0);

-- ------------------------------------------------------------
-- Produtos — Smartwatches
-- ------------------------------------------------------------
INSERT INTO `products` (`name`, `slug`, `description`, `price`, `original_price`, `stock`, `category`, `brand`, `image_url`, `rating`, `reviews_count`, `is_featured`) VALUES

('Apple Watch Ultra 2 49mm Titanium',
 'apple-watch-ultra-2-49mm',
 'Apple Watch Ultra 2 com caixa em titânio de 49mm, chip S9 SiP, ecrã Retina LTPO2 de dupla frequência, GPS de dupla frequência L1+L5, profundidade de 100m, bateria de 60h no modo de baixo consumo e botão de ação personalizável. Para aventureiros.',
 489000, 529000, 10, 'Smartwatches', 'Apple',
 'https://images.unsplash.com/photo-1694959937341-6e7ad20b31ef?w=800',
 4.8, 289, 1),

('Samsung Galaxy Watch 7 44mm LTE',
 'samsung-galaxy-watch-7-44mm',
 'Galaxy Watch 7 com chip Exynos W1000 de 3nm, sensor BioActive de nova geração, ecrã Super AMOLED de 1,5" com 2000 nits de brilho, GPS de banda dupla, medição de glicose no sangue, bateria de 40h e resistência de 5ATM + IP68.',
 179000, 199000, 20, 'Smartwatches', 'Samsung',
 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800',
 4.5, 198, 0),

('Garmin Fenix 7 Pro Solar Titanium',
 'garmin-fenix-7-pro-solar',
 'Garmin Fenix 7 Pro Solar com carregamento solar, caixa em titânio, GPS multifrequência, mapas topoAtivos, monitorização de saúde 24/7, bateria de até 37 dias (solar), Pulse OX e Garmin Coach integrado. O companheiro definitivo para desportos de aventura.',
 389000, 419000, 8, 'Smartwatches', 'Garmin',
 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800',
 4.7, 145, 0);

-- ------------------------------------------------------------
-- Produtos — Auscultadores
-- ------------------------------------------------------------
INSERT INTO `products` (`name`, `slug`, `description`, `price`, `original_price`, `stock`, `category`, `brand`, `image_url`, `rating`, `reviews_count`, `is_featured`) VALUES

('Apple AirPods Pro 2ª Geração com MagSafe',
 'apple-airpods-pro-2gen',
 'AirPods Pro de 2ª geração com chip H2, Cancelamento Ativo de Ruído adaptativo até 2x mais poderoso, Áudio Espacial Personalizado, bateria de 6h (30h com estojo), USB-C e resistência a suor e água IPX4.',
 145000, 159000, 35, 'Auscultadores', 'Apple',
 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800',
 4.7, 412, 1),

('Sony WH-1000XM5 Over-Ear ANC',
 'sony-wh-1000xm5-preto',
 'Sony WH-1000XM5 com 8 microfones e processador QN1, o melhor ANC da indústria, 30h de bateria, carregamento rápido de 3 min = 3h, LDAC, som de alta resolução certificado e chamadas de voz cristalinas com Supressão de Voz Precisa.',
 129000, 149000, 22, 'Auscultadores', 'Sony',
 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800',
 4.8, 567, 1),

('Samsung Galaxy Buds3 Pro',
 'samsung-galaxy-buds3-pro',
 'Galaxy Buds3 Pro com design earbud aberto, ANC inteligente adaptativo, som Hi-Fi de 2 vias com tweeter e woofer separados, Áudio Espacial com rastreamento de cabeça 360°, bateria de 6h + 18h no estojo e integração Galaxy AI.',
 89000, 99000, 30, 'Auscultadores', 'Samsung',
 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
 4.5, 234, 0),

('Bose QuietComfort 45 Wireless',
 'bose-quietcomfort-45',
 'Bose QuietComfort 45 com modo Quiet (ANC máximo) e Aware (sons ambiente), 24h de bateria, carregamento de 15 min = 3h, equalizador TriPort, microfones com Array de beamforming e EQ personalizado através da app Bose Music.',
 119000, 135000, 18, 'Auscultadores', 'Bose',
 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
 4.6, 356, 0);

-- ------------------------------------------------------------
-- Produtos — Tablets
-- ------------------------------------------------------------
INSERT INTO `products` (`name`, `slug`, `description`, `price`, `original_price`, `stock`, `category`, `brand`, `image_url`, `rating`, `reviews_count`, `is_featured`) VALUES

('Apple iPad Pro 13" M4 WiFi 256GB',
 'apple-ipad-pro-13-m4-256gb',
 'iPad Pro 13" com o revolucionário chip M4, o ecrã Ultra Retina XDR de 13" com tecnologia tandem OLED (1000 nits, HDR, ProMotion 120Hz), compatível com Apple Pencil Pro e Magic Keyboard Folio, Face ID horizontal e câmera landscape de 12MP.',
 759000, 820000, 10, 'Tablets', 'Apple',
 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
 4.8, 198, 1),

('Samsung Galaxy Tab S9 Ultra 12GB/256GB',
 'samsung-galaxy-tab-s9-ultra',
 'Galaxy Tab S9 Ultra com ecrã Dynamic AMOLED 2X de 14,6" (Vision Booster, 120Hz), S Pen incluída, Snapdragon 8 Gen 2, 12GB RAM, resistência IP68, câmera dual frontal para videoconferências e bateria de 11200mAh.',
 579000, 649000, 8, 'Tablets', 'Samsung',
 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800',
 4.6, 167, 0);

-- ------------------------------------------------------------
-- Avaliações de Demonstração
-- ------------------------------------------------------------
INSERT INTO `reviews` (`product_id`, `user_id`, `rating`, `comment`) VALUES
(1, 2, 5, 'Produto incrível! O chip A17 Pro é uma besta. Câmera excepcional em condições de pouca luz.'),
(1, 3, 5, 'Vale cada kwanza. A diferença do titânio na mão é notável. Entrega foi rápida e bem embalada.'),
(2, 2, 5, 'O S24 Ultra com S Pen é uma ferramenta de trabalho completa. IA para edição de fotos é impressionante.'),
(7, 3, 5, 'MacBook Pro M3 Pro é extraordinário. Silencioso, rápido e a bateria dura o dia todo com trabalho pesado.'),
(12, 2, 5, 'AirPods Pro 2 têm o melhor ANC do mercado. Em transporte público é transformador.'),
(13, 3, 5, 'Sony WH-1000XM5 são os melhores headphones que já usei. O ANC é mágico.');
