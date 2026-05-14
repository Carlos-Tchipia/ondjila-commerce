<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\AuthService;

class AuthController
{
    private AuthService $auth;

    public function __construct()
    {
        $this->auth = new AuthService();
    }

    public function register(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            respondError('Método não permitido.', 405);
        }

        $data   = getBody();
        $result = $this->auth->register($data);

        if (!$result['success']) {
            respondError(
                $result['message'] ?? 'Erro no registo.',
                422,
                $result['errors'] ?? null
            );
        }

        respondCreated([
            'token' => $result['token'],
            'user'  => $result['user'],
        ], 'Conta criada com sucesso. Bem-vindo à ONDJILA!');
    }

    public function login(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            respondError('Método não permitido.', 405);
        }

        $data   = getBody();
        $result = $this->auth->login($data);

        if (!$result['success']) {
            respondError($result['message'] ?? 'Credenciais inválidas.', 401);
        }

        respond([
            'token' => $result['token'],
            'user'  => $result['user'],
        ]);
    }

    public function me(): void
    {
        $payload = requireAuth();
        $user    = (new \App\Repositories\UserRepository())->findById($payload->sub);

        if ($user === null) {
            respondError('Utilizador não encontrado.', 404);
        }

        respond($user->toArray());
    }

    public function updateMe(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            respondError('Metodo nao permitido.', 405);
        }

        $payload = requireAuth();
        $data = getBody();
        $name = trim((string) ($data['name'] ?? ''));

        if ($name === '' || strlen($name) < 2) {
            respondError('O nome deve ter pelo menos 2 caracteres.', 422, ['name' => 'Nome invalido.']);
        }

        $repo = new \App\Repositories\UserRepository();
        $updated = $repo->updateProfile((int) $payload->sub, [
            'name' => $name,
            'phone' => trim((string) ($data['phone'] ?? '')) ?: null,
            'address' => trim((string) ($data['address'] ?? '')) ?: null,
        ]);

        if (!$updated) {
            respondError('Nao foi possivel atualizar a conta.', 500);
        }

        $user = $repo->findById((int) $payload->sub);
        respond(['user' => $user?->toArray(), 'message' => 'Conta atualizada com sucesso.']);
    }

    public function logout(): void
    {
        // Aqui confirmamos apenas o sucesso da operação.
        respond(['message' => 'Sessão terminada com sucesso.']);
    }

    public function forgotPassword(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            respondError('Método não permitido.', 405);
        }

        $data = getBody();
        $email = $data['email'] ?? '';

        $result = $this->auth->forgotPassword($email);

        if (!$result['success']) {
            respondError($result['message'], 400);
        }

        respond([
            'message' => $result['message'],
            'reset_url' => $result['reset_url'] ?? null,
        ]);
    }

    public function resetPassword(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            respondError('Método não permitido.', 405);
        }

        $data = getBody();
        $email = $data['email'] ?? '';
        $token = $data['token'] ?? '';
        $newPassword = $data['password'] ?? '';

        $result = $this->auth->resetPassword($email, $token, $newPassword);

        if (!$result['success']) {
            respondError($result['message'], 400);
        }

        respond(['message' => $result['message']]);
    }
}
