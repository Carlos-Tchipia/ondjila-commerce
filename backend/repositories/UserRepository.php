<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Config\Database;
use App\Models\User;
use PDO;

class UserRepository
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function findByEmail(string $email): ?User
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM users WHERE email = :email LIMIT 1'
        );
        $stmt->execute([':email' => $email]);
        $row = $stmt->fetch();

        return $row ? $this->hydrate($row) : null;
    }

    public function findById(int $id): ?User
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM users WHERE id = :id LIMIT 1'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();

        return $row ? $this->hydrate($row) : null;
    }

    public function create(User $user): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO users (name, email, password, role, phone, address)
             VALUES (:name, :email, :password, :role, :phone, :address)'
        );
        $stmt->execute([
            ':name'     => $user->name,
            ':email'    => $user->email,
            ':password' => $user->password,
            ':role'     => $user->role,
            ':phone'    => $user->phone,
            ':address'  => $user->address,
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function emailExists(string $email): bool
    {
        $stmt = $this->db->prepare(
            'SELECT COUNT(*) FROM users WHERE email = :email'
        );
        $stmt->execute([':email' => $email]);
        return (int) $stmt->fetchColumn() > 0;
    }

    public function updateProfile(int $id, array $data): bool
    {
        $stmt = $this->db->prepare(
            'UPDATE users SET name = :name, phone = :phone, address = :address WHERE id = :id'
        );
        return $stmt->execute([
            ':name'    => $data['name'],
            ':phone'   => $data['phone'] ?? null,
            ':address' => $data['address'] ?? null,
            ':id'      => $id,
        ]);
    }

    private function hydrate(array $row): User
    {
        return new User(
            id:         (int) $row['id'],
            name:       $row['name'],
            email:      $row['email'],
            password:   $row['password'],
            role:       $row['role'],
            phone:      $row['phone'],
            address:    $row['address'],
            created_at: $row['created_at'],
        );
    }
}
