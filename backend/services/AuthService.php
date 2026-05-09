<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;

class AuthService
{
    private UserRepository $users;

    public function __construct()
    {
        $this->users = new UserRepository();
    }

    public function register(array $data): array
    {
        // Validação
        $errors = $this->validateRegister($data);
        if (!empty($errors)) {
            return ['success' => false, 'errors' => $errors];
        }

        if ($this->users->emailExists($data['email'])) {
            return ['success' => false, 'errors' => ['email' => 'Este email já está registado.']];
        }

        $user = new User(
            id:       null,
            name:     trim($data['name']),
            email:    strtolower(trim($data['email'])),
            password: password_hash($data['password'], PASSWORD_BCRYPT),
            role:     'customer',
            phone:    $data['phone'] ?? null,
            address:  $data['address'] ?? null,
        );

        $userId = $this->users->create($user);
        $user = $this->users->findById($userId);

        $token = generateJwt([
            'sub'   => $userId,
            'email' => $user->email,
            'role'  => $user->role,
        ]);

        return [
            'success' => true,
            'token'   => $token,
            'user'    => $user->toArray(),
        ];
    }

    public function login(array $data): array
    {
        $email    = strtolower(trim($data['email'] ?? ''));
        $password = $data['password'] ?? '';

        if (empty($email) || empty($password)) {
            return ['success' => false, 'message' => 'Email e senha são obrigatórios.'];
        }

        $user = $this->users->findByEmail($email);

        if ($user === null || !password_verify($password, $user->password)) {
            return ['success' => false, 'message' => 'Credenciais inválidas.'];
        }

        $token = generateJwt([
            'sub'   => $user->id,
            'email' => $user->email,
            'role'  => $user->role,
        ]);

        return [
            'success' => true,
            'token'   => $token,
            'user'    => $user->toArray(),
        ];
    }

    private function validateRegister(array $data): array
    {
        $errors = [];

        if (empty($data['name']) || strlen($data['name']) < 2) {
            $errors['name'] = 'O nome deve ter pelo menos 2 caracteres.';
        }
        if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Email inválido.';
        }
        if (empty($data['password']) || strlen($data['password']) < 6) {
            $errors['password'] = 'A senha deve ter pelo menos 6 caracteres.';
        }
        if (($data['password'] ?? '') !== ($data['password_confirmation'] ?? '')) {
            $errors['password_confirmation'] = 'As senhas não coincidem.';
        }

        return $errors;
    }
}
