<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Services\ExternalProductImageService;
use PDO;

class AdminController
{
    private PDO $db;
    private ExternalProductImageService $externalImages;

    public function __construct()
    {
        requireAdmin();
        $this->db = Database::getConnection();
        $this->externalImages = new ExternalProductImageService();
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
        $stmt = $this->db->query("SELECT * FROM products WHERE is_active = 1 ORDER BY id DESC");
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
        $errors = $this->validateProductData($data);
        if ($errors !== []) {
            respondError('Dados do produto inválidos.', 422, $errors);
        }

        $imageUrl = $this->resolveProductImage($data);

        $stmt = $this->db->prepare("
            INSERT INTO products (name, slug, description, price, stock, category, image_url, image_source, brand, is_active)
            VALUES (:name, :slug, :description, :price, :stock, :category, :image_url, :image_source, :brand, 1)
        ");
        
        $stmt->execute([
            ':name' => $data['name'],
            ':slug' => $this->slugify($data['name']),
            ':description' => $data['description'] ?? '',
            ':price' => $data['price'],
            ':stock' => $data['stock'],
            ':category' => $data['category'] ?? $data['category_id'] ?? 'Sem Categoria',
            ':image_url' => $imageUrl,
            ':image_source' => $this->isExternalImage($imageUrl) ? 'external' : 'local',
            ':brand' => $data['brand'] ?? ''
        ]);

        respondCreated(['id' => $this->db->lastInsertId()], 'Produto criado com sucesso.');
    }

    public function updateProduct(int $id): void
    {
        $data = getBody();
        $errors = $this->validateProductData($data);
        if ($errors !== []) {
            respondError('Dados do produto inválidos.', 422, $errors);
        }

        $imageUrl = $this->resolveProductImage($data);

        $stmt = $this->db->prepare("
            UPDATE products 
            SET name = :name, description = :description, price = :price, 
                stock = :stock, category = :category, image_url = :image_url,
                image_source = :image_source,
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
            ':image_source' => $this->isExternalImage($imageUrl) ? 'external' : 'local',
            ':brand' => $data['brand'] ?? '',
            ':id' => $id
        ]);

        respond(['message' => 'Produto atualizado com sucesso.']);
    }

    public function deleteProduct(int $id): void
    {
        $stmt = $this->db->prepare("UPDATE products SET is_active = 0 WHERE id = :id");
        $stmt->execute([':id' => $id]);
        respond(['message' => 'Produto eliminado com sucesso.']);
    }

    public function updateStatus(): void
    {
        $data = getBody();
        if (empty($data['order_id']) || empty($data['status'])) {
            respondError('ID do pedido e estado são obrigatórios.', 422);
        }

        $statusMap = [
            'Pendente'         => 'pending',
            'Em processamento' => 'processing',
            'Enviado'          => 'shipped',
            'Entregue'         => 'delivered',
            'Cancelado'        => 'cancelled'
        ];

        $status = $statusMap[$data['status']] ?? $data['status'];
        $allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!in_array($status, $allowedStatuses, true)) {
            respondError('Estado do pedido inválido.', 422);
        }

        $stmt = $this->db->prepare("UPDATE orders SET status = :status WHERE id = :id");
        $stmt->execute([
            ':status' => $status,
            ':id'     => (int) $data['order_id']
        ]);

        if ($stmt->rowCount() === 0) {
            respondError('Pedido não encontrado.', 404);
        }

        respond(['message' => 'Estado do pedido atualizado.']);
    }

    public function updateStock(): void
    {
        $data = getBody();
        if (!isset($data['product_id'], $data['quantity']) || (int) $data['quantity'] < 0) {
            respondError('Produto e quantidade válida são obrigatórios.', 422);
        }

        $stmt = $this->db->prepare("UPDATE products SET stock = :stock WHERE id = :id");
        $stmt->execute([
            ':stock' => (int) $data['quantity'],
            ':id'    => (int) $data['product_id']
        ]);

        if ($stmt->rowCount() === 0) {
            respondError('Produto não encontrado.', 404);
        }

        respond(['message' => 'Stock atualizado.']);
    }

    public function getReportPreview(): void
    {
        $type = $_GET['type'] ?? '';

        if (!in_array($type, ['sales', 'products', 'customers'], true)) {
            respondError('Tipo de relatório inválido.', 400);
        }

        if ($type === 'sales') {
            $stmt = $this->db->query("
                SELECT o.id, u.name AS customer_name, o.created_at, o.total, o.status
                FROM orders o
                JOIN users u ON o.user_id = u.id
                ORDER BY o.created_at DESC
                LIMIT 20
            ");
        } elseif ($type === 'products') {
            $stmt = $this->db->query("
                SELECT id, name, brand, category, price, stock
                FROM products
                WHERE is_active = 1
                ORDER BY stock ASC
                LIMIT 20
            ");
        } else {
            $stmt = $this->db->query("
                SELECT id, name, email, phone, created_at
                FROM users
                WHERE role = 'customer'
                ORDER BY created_at DESC
                LIMIT 20
            ");
        }

        respond([
            'type' => $type,
            'items' => $stmt->fetchAll(PDO::FETCH_ASSOC),
        ]);
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

        if ($_FILES['image']['size'] > 2 * 1024 * 1024) {
            respondError('A imagem não pode exceder 2MB.', 422);
        }

        $uploadDir = __DIR__ . '/../../frontend/ondjilacommerce-frontend/src/assets/images/products/';
        
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $fileInfo = pathinfo($_FILES['image']['name']);
        $extension = strtolower($fileInfo['extension']);
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

        if (!in_array($extension, $allowedExtensions, true)) {
            respondError('Formato de imagem inválido.', 422);
        }

        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($_FILES['image']['tmp_name']);
        $allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!in_array($mime, $allowedMimes, true)) {
            respondError('O ficheiro enviado não é uma imagem válida.', 422);
        }

        $fileName = uniqid('prod_') . '.' . $extension;
        $targetPath = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
            return 'assets/images/products/' . $fileName;
        }

        return null;
    }

    private function resolveProductImage(array $data): string
    {
        $uploaded = $this->handleImageUpload();
        if ($uploaded !== null) {
            return $uploaded;
        }

        $imageUrl = trim((string) ($data['image_url'] ?? ''));
        if ($imageUrl !== '') {
            if ($this->isSafeImageUrl($imageUrl)) {
                return $imageUrl;
            }
            respondError('URL de imagem inválida.', 422, ['image_url' => 'Use uma URL http(s) válida para imagem.']);
        }

        $query = trim((string) (($data['brand'] ?? '') . ' ' . ($data['name'] ?? '')));
        return $query !== ''
            ? ($this->externalImages->findImage($query) ?? 'assets/images/products/smartphones_1.jpg')
            : 'assets/images/products/smartphones_1.jpg';
    }

    private function isSafeImageUrl(string $url): bool
    {
        if (str_starts_with($url, 'assets/images/products/')) {
            return true;
        }

        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            return false;
        }

        $scheme = strtolower((string) parse_url($url, PHP_URL_SCHEME));
        return in_array($scheme, ['http', 'https'], true);
    }

    private function isExternalImage(string $url): bool
    {
        return (bool) filter_var($url, FILTER_VALIDATE_URL);
    }

    private function validateProductData(array $data): array
    {
        $errors = [];

        if (empty(trim((string) ($data['name'] ?? '')))) {
            $errors['name'] = 'O nome do produto é obrigatório.';
        }
        if (!isset($data['price']) || !is_numeric($data['price']) || (float) $data['price'] <= 0) {
            $errors['price'] = 'O preço deve ser maior que zero.';
        }
        if (!isset($data['stock']) || !is_numeric($data['stock']) || (int) $data['stock'] < 0) {
            $errors['stock'] = 'O stock deve ser zero ou superior.';
        }

        return $errors;
    }

    private function getReportDataset(string $type): array
    {
        if ($type === 'sales') {
            $headers = ['ID', 'Cliente', 'Data', 'Total (Kz)', 'Estado'];
            $stmt = $this->db->query("
                SELECT o.id, u.name, o.created_at, o.total, o.status
                FROM orders o
                JOIN users u ON o.user_id = u.id
                ORDER BY o.created_at DESC
                LIMIT 60
            ");
            $rows = array_map(
                fn($row) => [$row['id'], $row['name'], $row['created_at'], $row['total'], $row['status']],
                $stmt->fetchAll(PDO::FETCH_ASSOC)
            );
            return [$headers, $rows];
        }

        if ($type === 'products') {
            $headers = ['ID', 'Nome', 'Marca', 'Categoria', 'Preco (Kz)', 'Stock'];
            $stmt = $this->db->query("
                SELECT id, name, brand, category, price, stock
                FROM products
                WHERE is_active = 1
                ORDER BY stock ASC
                LIMIT 60
            ");
            $rows = array_map(
                fn($row) => [$row['id'], $row['name'], $row['brand'], $row['category'], $row['price'], $row['stock']],
                $stmt->fetchAll(PDO::FETCH_ASSOC)
            );
            return [$headers, $rows];
        }

        $headers = ['ID', 'Nome', 'Email', 'Telefone', 'Data de Registo'];
        $stmt = $this->db->query("
            SELECT id, name, email, phone, created_at
            FROM users
            WHERE role = 'customer'
            ORDER BY created_at DESC
            LIMIT 60
        ");
        $rows = array_map(
            fn($row) => [$row['id'], $row['name'], $row['email'], $row['phone'], $row['created_at']],
            $stmt->fetchAll(PDO::FETCH_ASSOC)
        );
        return [$headers, $rows];
    }

    private function outputPdfReport(string $type, array $headers, array $rows): void
    {
        $title = 'Relatorio ' . ucfirst($type) . ' - Ondjila Commerce';
        $lines = [$title, str_repeat('-', 90), implode(' | ', $headers)];

        foreach (array_slice($rows, 0, 45) as $row) {
            $lines[] = implode(' | ', array_map(fn($value) => (string) $value, $row));
        }

        $content = "BT\n/F1 14 Tf\n50 790 Td\n(" . $this->pdfText($lines[0]) . ") Tj\n";
        $content .= "/F1 8 Tf\n0 -18 Td\n(" . $this->pdfText($lines[1]) . ") Tj\n";

        foreach (array_slice($lines, 2) as $line) {
            $content .= "0 -14 Td\n(" . $this->pdfText($line) . ") Tj\n";
        }

        $content .= "ET";
        $objects = [
            '<< /Type /Catalog /Pages 2 0 R >>',
            '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
            '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
            '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
            "<< /Length " . strlen($content) . " >>\nstream\n{$content}\nendstream",
        ];

        $pdf = "%PDF-1.4\n";
        $offsets = [0];
        foreach ($objects as $index => $object) {
            $offsets[] = strlen($pdf);
            $pdf .= ($index + 1) . " 0 obj\n{$object}\nendobj\n";
        }

        $xref = strlen($pdf);
        $pdf .= "xref\n0 " . (count($objects) + 1) . "\n0000000000 65535 f \n";
        for ($i = 1; $i <= count($objects); $i++) {
            $pdf .= sprintf("%010d 00000 n \n", $offsets[$i]);
        }
        $pdf .= "trailer\n<< /Size " . (count($objects) + 1) . " /Root 1 0 R >>\nstartxref\n{$xref}\n%%EOF";

        $filename = "relatorio_{$type}_" . date('Ymd_His') . ".pdf";
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        echo $pdf;
        exit;
    }

    private function pdfText(string $text): string
    {
        $ascii = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $text);
        $ascii = $ascii === false ? $text : $ascii;
        return str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $ascii);
    }

    public function exportReport(): void
    {
        $type = $_GET['type'] ?? '';
        $format = strtolower((string) ($_GET['format'] ?? 'csv'));
        
        if (!in_array($type, ['sales', 'products', 'customers'], true)) {
            respondError('Tipo de relatório inválido.', 400);
        }

        if (!in_array($format, ['csv', 'pdf'], true)) {
            respondError('Formato de relatório inválido.', 400);
        }

        if ($format === 'pdf') {
            [$headers, $rows] = $this->getReportDataset($type);
            $this->outputPdfReport($type, $headers, $rows);
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
                WHERE is_active = 1
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
