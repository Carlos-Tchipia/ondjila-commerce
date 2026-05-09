<?php
declare(strict_types=1);
namespace App\Models;

class Product
{
    public function __construct(
        public readonly ?int $id,
        public string $name,
        public string $slug,
        public string $description,
        public float $price,
        public float $original_price,
        public int $stock,
        public string $category,
        public string $brand,
        public ?string $image_url = null,
        public float $rating = 0.0,
        public int $reviews_count = 0,
        public bool $is_featured = false,
        public bool $is_active = true,
        public ?string $created_at = null,
    ) {}

    public function toArray(): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'slug'           => $this->slug,
            'description'    => $this->description,
            'price'          => $this->price,
            'original_price' => $this->original_price,
            'discount'       => $this->original_price > 0
                ? round((1 - $this->price / $this->original_price) * 100)
                : 0,
            'stock'          => $this->stock,
            'category'       => $this->category,
            'brand'          => $this->brand,
            'image_url'      => $this->image_url,
            'rating'         => $this->rating,
            'reviews_count'  => $this->reviews_count,
            'is_featured'    => $this->is_featured,
            'is_active'      => $this->is_active,
            'created_at'     => $this->created_at,
        ];
    }
}
