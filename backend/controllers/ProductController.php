<?php
declare(strict_types=1);
namespace App\Controllers;

use App\Repositories\ProductRepository;

class ProductController
{
    private ProductRepository $products;

    public function __construct()
    {
        $this->products = new ProductRepository();
    }

    public function index(): void
    {
        $filters = [
            'category'  => $_GET['category'] ?? null,
            'brand'     => $_GET['brand'] ?? null,
            'search'    => $_GET['search'] ?? null,
            'min_price' => $_GET['min_price'] ?? null,
            'max_price' => $_GET['max_price'] ?? null,
            'featured'  => $_GET['featured'] ?? null,
            'sort'      => $_GET['sort'] ?? 'newest',
            'page'      => (int) ($_GET['page'] ?? 1),
            'limit'     => (int) ($_GET['limit'] ?? 20),
        ];

        $items = $this->products->findAll($filters);
        $total = $this->products->count($filters);

        respond([
            'items'       => $items,
            'total'       => $total,
            'page'        => $filters['page'],
            'limit'       => $filters['limit'],
            'total_pages' => (int) ceil($total / $filters['limit']),
        ]);
    }

    public function show(int $id): void
    {
        $product = $this->products->findById($id);

        if ($product === null) {
            respondError('Produto não encontrado.', 404);
        }

        respond($product->toArray());
    }
}
