<?php
declare(strict_types=1);
namespace App\Models;

class Order
{
    public function __construct(
        public readonly ?int $id,
        public int $user_id,
        public string $status,
        public float $subtotal,
        public float $shipping,
        public float $total,
        public string $payment_status,
        public string $payment_method,
        public ?string $shipping_address = null,
        public ?string $notes = null,
        public ?string $created_at = null,
        public array $items = [],
    ) {}

    public function toArray(): array
    {
        return [
            'id'              => $this->id,
            'user_id'         => $this->user_id,
            'status'          => $this->status,
            'subtotal'        => $this->subtotal,
            'shipping'        => $this->shipping,
            'total'           => $this->total,
            'payment_status'  => $this->payment_status,
            'payment_method'  => $this->payment_method,
            'shipping_address'=> $this->shipping_address,
            'notes'           => $this->notes,
            'created_at'      => $this->created_at,
            'items'           => $this->items,
        ];
    }
}
