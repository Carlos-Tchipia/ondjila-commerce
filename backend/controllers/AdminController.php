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
            SELECT SUM(total) 
            FROM orders 
            WHERE status != 'cancelled' 
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
            SELECT DATE(created_at) as date, SUM(total) as total
            FROM orders
            WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
            AND status != 'cancelled'
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        ")->fetchAll(PDO::FETCH_ASSOC);

        // 6. Últimos 5 pedidos (Mapeado para o frontend)
        $ultimosPedidosRaw = $this->db->query("
            SELECT o.id, u.name as customer_name, o.created_at, o.total, o.status
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
            LIMIT 5
        ")->fetchAll(PDO::FETCH_ASSOC);

        $statusMap = [
            'pending'    => 'Pendente',
            'processing' => 'Em processamento',
            'shipped'    => 'Enviado',
            'delivered'  => 'Entregue',
            'cancelled'  => 'Cancelado'
        ];

        $ultimosPedidos = array_map(function($o) use ($statusMap) {
            $o['total_amount'] = (float)$o['total'];
            $o['status'] = $statusMap[$o['status']] ?? $o['status'];
            return $o;
        }, $ultimosPedidosRaw);

        // 7. Lista de stock baixo (detalhada)
        $listaStockBaixo = $this->db->query("
            SELECT name, stock, image_url, category
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
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $statusMap = [
            'pending'    => 'Pendente',
            'processing' => 'Em processamento',
            'shipped'    => 'Enviado',
            'delivered'  => 'Entregue',
            'cancelled'  => 'Cancelado'
        ];

        $mappedOrders = array_map(function($o) use ($statusMap) {
            $o['total_amount'] = (float)$o['total'];
            $o['status'] = $statusMap[$o['status']] ?? $o['status'];
            return $o;
        }, $orders);

        respond($mappedOrders);
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
        $imageUrl = $this->handleImageUpload() ?? ($data['image_url'] ?? '');

        $stmt = $this->db->prepare("
            INSERT INTO products (name, slug, description, price, stock, category, image_url, brand, is_active)
            VALUES (:name, :slug, :description, :price, :stock, :category, :image_url, :brand, 1)
        ");
        
        $stmt->execute([
            ':name' => $data['name'],
            ':slug' => $this->slugify($data['name']),
            ':description' => $data['description'] ?? '',
            ':price' => $data['price'],
            ':stock' => $data['stock'],
            ':category' => $data['category'] ?? $data['category_id'] ?? 'Sem Categoria',
            ':image_url' => $imageUrl,
            ':brand' => $data['brand'] ?? ''
        ]);

        respondCreated(['id' => $this->db->lastInsertId()], 'Produto criado com sucesso.');
    }

    public function updateProduct(int $id): void
    {
        $data = getBody();
        $imageUrl = $this->handleImageUpload() ?? ($data['image_url'] ?? '');

        $stmt = $this->db->prepare("
            UPDATE products 
            SET name = :name, description = :description, price = :price, 
                stock = :stock, category = :category, image_url = :image_url,
                brand = :brand
            WHERE id = :id
        ");
        $stmt->execute([
            ':name' => $data['name'],
            ':description' => $data['description'] ?? '',
            ':price' => $data['price'],
            ':stock' => $data['stock'],
            ':category' => $data['category'] ?? $data['category_id'] ?? 'Sem Categoria',
            ':image_url' => $imageUrl,
            ':brand' => $data['brand'] ?? '',
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

    public function updateStatus(): void
    {
        $data = getBody();
        $statusMap = [
            'Pendente'         => 'pending',
            'Em processamento' => 'processing',
            'Enviado'          => 'shipped',
            'Entregue'         => 'delivered',
            'Cancelado'        => 'cancelled'
        ];

        $status = $statusMap[$data['status']] ?? $data['status'];

        $stmt = $this->db->prepare("UPDATE orders SET status = :status WHERE id = :id");
        $stmt->execute([
            ':status' => $status,
            ':id'     => $data['order_id']
        ]);

        respond(['message' => 'Estado do pedido atualizado.']);
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

    private function handleImageUpload(): ?string
    {
        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            return null;
        }

        $uploadDir = __DIR__ . '/../../frontend/ondjilacommerce-frontend/src/assets/images/products/';
        
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $fileInfo = pathinfo($_FILES['image']['name']);
        $extension = strtolower($fileInfo['extension']);
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

        if (!in_array($extension, $allowedExtensions)) {
            return null; // Invalid format
        }

        $fileName = uniqid('prod_') . '.' . $extension;
        $targetPath = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
            return 'assets/images/products/' . $fileName;
        }

        return null;
    }

    public function exportReport(): void
    {
        $type = $_GET['type'] ?? '';
        
        if (!in_array($type, ['sales', 'products', 'customers'])) {
            respondError('Tipo de relatório inválido.', 400);
        }

        $filename = "relatorio_{$type}_" . date('Ymd_His') . ".csv";
        
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        
        $output = fopen('php://output', 'w');
        
        // BOM for Excel UTF-8 support
        fputs($output, $bom =(chr(0xEF) . chr(0xBB) . chr(0xBF)));

        if ($type === 'sales') {
            fputcsv($output, ['ID', 'Cliente', 'Data', 'Total (Kz)', 'Estado'], ';');
            $stmt = $this->db->query("
                SELECT o.id, u.name, o.created_at, o.total, o.status 
                FROM orders o 
                JOIN users u ON o.user_id = u.id 
                ORDER BY o.created_at DESC
            ");
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                fputcsv($output, [
                    $row['id'], 
                    $row['name'], 
                    $row['created_at'], 
                    $row['total'], 
                    $row['status']
                ], ';');
            }
        } elseif ($type === 'products') {
            fputcsv($output, ['ID', 'Nome', 'Marca', 'Categoria', 'Preço (Kz)', 'Stock'], ';');
            $stmt = $this->db->query("
                SELECT id, name, brand, category, price, stock 
                FROM products
                ORDER BY stock ASC
            ");
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                fputcsv($output, [
                    $row['id'], 
                    $row['name'], 
                    $row['brand'], 
                    $row['category'], 
                    $row['price'], 
                    $row['stock']
                ], ';');
            }
        }
 elseif ($type === 'customers') {
            fputcsv($output, ['ID', 'Nome', 'Email', 'Telefone', 'Data de Registo'], ';');
            $stmt = $this->db->query("
                SELECT id, name, email, phone, created_at 
                FROM users 
                WHERE role = 'customer' 
                ORDER BY created_at DESC
            ");
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                fputcsv($output, [
                    $row['id'], 
                    $row['name'], 
                    $row['email'], 
                    $row['phone'], 
                    $row['created_at']
                ], ';');
            }
        }

        fclose($output);
        exit;
    }
}
