-- Atualiza/cria os perfis demo sem reimportar toda a base.
-- Admin:   carlos@ondjila.ao  / Ondjila@2026
-- Cliente: cliente@ondjila.ao / Cliente@2026

INSERT INTO `users` (`name`, `email`, `password`, `role`, `phone`, `address`) VALUES
('Carlos Ondjila', 'carlos@ondjila.ao', '$2y$10$htxLeucoo.h2zwaIENT1mewlvNDp8Gk4Pkuyt1CaRPgXwnX3r4IxK', 'admin', '+244 900 000 001', 'Luanda, Angola'),
('Cliente Ondjila', 'cliente@ondjila.ao', '$2y$10$VzskTSWCGAYsU65et66t3edkiyozOyMEe3cKs7ioHCFz5zmmHVyWG', 'customer', '+244 900 000 002', 'Luanda, Angola')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `password` = VALUES(`password`),
  `role` = VALUES(`role`),
  `phone` = VALUES(`phone`),
  `address` = VALUES(`address`);
