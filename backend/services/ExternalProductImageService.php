<?php
declare(strict_types=1);

namespace App\Services;

class ExternalProductImageService
{
    public function __construct(private ?HttpClientService $http = null)
    {
        $this->http ??= new HttpClientService();
    }

    public function findImage(string $query): ?string
    {
        try {
            $response = $this->http->getJson('https://dummyjson.com/products/search', [
                'q' => $query,
                'limit' => 1,
            ]);

            $product = $response['body']['products'][0] ?? null;
            $image = $product['thumbnail'] ?? $product['images'][0] ?? null;

            return is_string($image) && filter_var($image, FILTER_VALIDATE_URL) ? $image : null;
        } catch (\Throwable $e) {
            error_log('DummyJSON image lookup falhou: ' . $e->getMessage());
            return null;
        }
    }
}
