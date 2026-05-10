<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use PDO;

class AdminController
{
    private PDO $db;

    public function __construct()
    {
        requireAdmin();
        $this->db = Database::getConnection();
    }

    /**
     * Estatísticas gerais para o Dashboard
     */
    public function getStats(): void
    {
        // 1. Vendas do mês atual
        $vendasMes = $this->db->query("
            SELECT SUM(total_amount) 
            FROM orders 
            WHERE status != 'Cancelado' 
            AND MONTH(created_at) = MONTH(CURRENT_DATE())
            AND YEAR(created_at) = YEAR(CURRENT_DATE())
        ")->fetchColumn() ?: 0;

        // 2. Pedidos hoje
        $pedidosHoje = $this->db->query("
            SELECT COUNT(*) 
            FROM orders 
            WHERE DATE(created_at) = CURRENT_DATE()
        ")->fetchColumn() ?: 0;

        // 3. Total de clientes
        $totalClientes = $this->db->query("
            SELECT COUNT(*) 
            FROM users 
            WHERE role = 'customer'
        ")->fetchColumn() ?: 0;

        // 4. Produtos com stock baixo (<= 5)
        $stockBaixoCount = $this->db->query("
            SELECT COUNT(*) 
            FROM products 
            WHERE stock <= 5
        ")->fetchColumn() ?: 0;

        // 5. Gráfico de vendas (últimos 7 dias)
        $chartData = $this->db->query("
            SELECT DATE(created_at) as date, SUM(total_amount) as total
            FROM orders
            WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
            AND status != 'Cancelado'
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        ")->fetchAll(PDO::FETCH_ASSOC);

        // 6. Últimos 5 pedidos
        $ultimosPedidos = $this->db->query("
            SELECT o.id, u.name as customer_name, o.created_at, o.total_amount, o.status
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
            LIMIT 5
        ")->fetchAll(PDO::FETCH_ASSOC);

        // 7. Lista de stock baixo (detalhada)
        $listaStockBaixo = $this->db->query("
            SELECT name, stock, image_url, category_id
            FROM products
            WHERE stock <= 5
            ORDER BY stock ASC
            LIMIT 5
        ")->fetchAll(PDO::FETCH_ASSOC);

        respond([
            'metrics' => [
                'monthly_sales' => (float)$vendasMes,
                'orders_today'  => (int)$pedidosHoje,
                'total_customers' => (int)$totalClientes,
                'low_stock_count' => (int)$stockBaixoCount
            ],
            'chart' => $chartData,
            'recent_orders' => $ultimosPedidos,
            'low_stock_list' => $listaStockBaixo
        ]);
    }

    public function listProducts(): void
    {
        $stmt = $this->db->query("SELECT * FROM products ORDER BY id DESC");
        respond($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function listOrders(): void
    {
        $stmt = $this->db->query("
            SELECT o.*, u.name as customer_name, u.email as customer_email
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        ");
        respond($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function listCustomers(): void
    {
        $stmt = $this->db->query("
            SELECT id, name, email, role, phone, address, created_at 
            FROM users 
            WHERE role = 'customer' 
            ORDER BY created_at DESC
        ");
        respond($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function listCategories(): void
    {
        $stmt = $this->db->query("SELECT * FROM categories ORDER BY name ASC");
        respond($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function storeProduct(): void
    {
        $data = getBody();
        $stmt = $this->db->prepare("
            INSERT INTO products (name, slug, description, price, stock, category_id, image_url, brand, technical_specs)
            VALUES (:name, :slug, :description, :price, :stock, :category_id, :image_url, :brand, :technical_specs)
        ");
        
        $stmt->execute([
            ':name' => $data['name'],
            ':slug' => $this->slugify($data['name']),
            ':description' => $data['description'] ?? '',
            ':price' => $data['price'],
            ':stock' => $data['stock'],
            ':category_id' => $data['category_id'],
            ':image_url' => $data['image_url'] ?? '',
            ':brand' => $data['brand'] ?? '',
            ':technical_specs' => json_encode($data['technical_specs'] ?? [])
        ]);

        respondCreated(['id' => $this->db->lastInsertId()], 'Produto criado com sucesso.');
    }

    public function updateProduct(int $id): void
    {
        $data = getBody();
        $stmt = $this->db->prepare("
            UPDATE products 
            SET name = :name, description = :description, price = :price, 
                stock = :stock, category_id = :category_id, image_url = :image_url,
                brand = :brand, technical_specs = :technical_specs
            WHERE id = :id
        ");

        $stmt->execute([
            ':name' => $data['name'],
            ':description' => $data['description'] ?? '',
            ':price' => $data['price'],
            ':stock' => $data['stock'],
            ':category_id' => $data['category_id'],
            ':image_url' => $data['image_url'] ?? '',
            ':brand' => $data['brand'] ?? '',
            ':technical_specs' => json_encode($data['technical_specs'] ?? []),
            ':id' => $id
        ]);

        respond(['message' => 'Produto atualizado com sucesso.']);
    }

    public function deleteProduct(int $id): void
    {
        $stmt = $this->db->prepare("DELETE FROM products WHERE id = :id");
        $stmt->execute([':id' => $id]);
        respond(['message' => 'Produto eliminado com sucesso.']);
    }

    public function updateStock(): void
    {
        $data = getBody();
        $stmt = $this->db->prepare("UPDATE products SET stock = :stock WHERE id = :id");
        $stmt->execute([
            ':stock' => $data['quantity'],
            ':id'    => $data['product_id']
        ]);
        respond(['message' => 'Stock atualizado.']);
    }

    private function slugify(string $text): string
    {
        $text = preg_replace('~[^\pL\d]+~u', '-', $text);
        $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
        $text = preg_replace('~[^-\w]+~', '', $text);
        $text = trim($text, '-');
        $text = preg_replace('~-+~', '-', $text);
        $text = strtolower($text);
        return $text ?: 'n-a';
    }
}
