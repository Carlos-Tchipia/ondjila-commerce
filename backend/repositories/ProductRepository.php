<?php
declare(strict_types=1);
namespace App\Repositories;

use App\Config\Database;
use App\Models\Product;
use PDO;

class ProductRepository
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function findAll(array $filters = []): array
    {
        [$conditions, $params] = $this->buildFilterConditions($filters);

        $where = implode(' AND ', $conditions);
        $orderBy = match ($filters['sort'] ?? 'newest') {
            'price_asc'  => 'p.price ASC',
            'price_desc' => 'p.price DESC',
            'rating'     => 'p.rating DESC',
            'name'       => 'p.name ASC',
            'featured'   => 'p.is_featured DESC, p.created_at DESC',
            default      => 'p.created_at DESC',
        };

        $limit  = max(1, min((int) ($filters['limit'] ?? 20), 100));
        $page   = max(1, (int) ($filters['page'] ?? 1));
        $offset = ($page - 1) * $limit;

        $sql = "SELECT p.* FROM products p
                WHERE {$where}
                ORDER BY {$orderBy}
                LIMIT {$limit} OFFSET {$offset}";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return array_map(fn($row) => $this->hydrate($row)->toArray(), $stmt->fetchAll());
    }

    public function count(array $filters = []): int
    {
        [$conditions, $params] = $this->buildFilterConditions($filters);

        $where = implode(' AND ', $conditions);
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM products p WHERE {$where}");
        $stmt->execute($params);

        return (int) $stmt->fetchColumn();
    }

    public function findById(int $id): ?Product
    {
        $stmt = $this->db->prepare('SELECT * FROM products WHERE id = :id AND is_active = 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();

        return $row ? $this->hydrate($row) : null;
    }

    public function findBySlug(string $slug): ?Product
    {
        $stmt = $this->db->prepare('SELECT * FROM products WHERE slug = :slug AND is_active = 1');
        $stmt->execute([':slug' => $slug]);
        $row = $stmt->fetch();

        return $row ? $this->hydrate($row) : null;
    }

    public function decrementStock(int $id, int $qty): bool
    {
        $stmt = $this->db->prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?');
        $stmt->execute([$qty, $id, $qty]);

        return $stmt->rowCount() === 1;
    }

    public function incrementStock(int $id, int $qty): bool
    {
        $stmt = $this->db->prepare('UPDATE products SET stock = stock + ? WHERE id = ?');
        $stmt->execute([$qty, $id]);

        return $stmt->rowCount() === 1;
    }

    private function buildFilterConditions(array $filters): array
    {
        $conditions = ['p.is_active = 1'];
        $params = [];

        if (!empty($filters['category'])) {
            $conditions[] = 'LOWER(p.category) = LOWER(:category)';
            $params[':category'] = $this->normalizeCategory((string) $filters['category']);
        }

        if (!empty($filters['brand'])) {
            $conditions[] = 'LOWER(p.brand) = LOWER(:brand)';
            $params[':brand'] = (string) $filters['brand'];
        }

        if (!empty($filters['search'])) {
            $conditions[] = '(p.name LIKE :search OR p.brand LIKE :search OR p.description LIKE :search)';
            $params[':search'] = '%' . trim((string) $filters['search']) . '%';
        }

        if (isset($filters['min_price']) && is_numeric($filters['min_price'])) {
            $conditions[] = 'p.price >= :min_price';
            $params[':min_price'] = (float) $filters['min_price'];
        }

        if (isset($filters['max_price']) && is_numeric($filters['max_price'])) {
            $conditions[] = 'p.price <= :max_price';
            $params[':max_price'] = (float) $filters['max_price'];
        }

        if (!empty($filters['featured'])) {
            $conditions[] = 'p.is_featured = 1';
        }

        return [$conditions, $params];
    }

    private function normalizeCategory(string $category): string
    {
        $map = [
            'audio' => 'auscultadores',
            'wearables' => 'smartwatches',
            'cameras' => 'cameras',
        ];

        $category = trim($category);
        $normalized = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $category);
        $normalized = $normalized === false ? $category : $normalized;
        $key = strtolower($normalized);

        return $map[$key] ?? $category;
    }

    private function hydrate(array $row): Product
    {
        return new Product(
            id:             (int) $row['id'],
            name:           $row['name'],
            slug:           $row['slug'],
            description:    $row['description'],
            price:          (float) $row['price'],
            original_price: (float) $row['original_price'],
            stock:          (int) $row['stock'],
            category:       $row['category'],
            brand:          $row['brand'],
            image_url:      $row['image_url'],
            rating:         (float) $row['rating'],
            reviews_count:  (int) $row['reviews_count'],
            is_featured:    (bool) $row['is_featured'],
            is_active:      (bool) $row['is_active'],
            created_at:     $row['created_at'],
        );
    }
}
