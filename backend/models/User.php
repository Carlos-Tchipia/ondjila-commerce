<?php

declare(strict_types=1);

namespace App\Models;

class User
{
    public function __construct(
        public readonly ?int $id,
        public string $name,
        public string $email,
        public string $password,
        public string $role = 'customer',
        public ?string $phone = null,
        public ?string $address = null,
        public ?string $created_at = null,
    ) {}

    public function toArray(bool $withPassword = false): array
    {
        $data = [
            'id'         => $this->id,
            'name'       => $this->name,
            'email'      => $this->email,
            'role'       => $this->role,
            'phone'      => $this->phone,
            'address'    => $this->address,
            'created_at' => $this->created_at,
        ];

        if ($withPassword) {
            $data['password'] = $this->password;
        }

        return $data;
    }
}
