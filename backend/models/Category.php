<?php
declare(strict_types=1);
namespace App\Models;

class Category
{
    public function __construct(
        public readonly ?int $id,
        public string $name,
        public string $slug,
        public ?string $description = null,
        public ?string $image_url = null,
        public ?string $created_at = null,
    ) {}

    public function toArray(): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'slug'        => $this->slug,
            'description' => $this->description,
            'image_url'   => $this->image_url,
            'created_at'  => $this->created_at,
        ];
    }
}
