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
            return;
        }

        respondCreated([
            'token' => $result['token'],
            'user'  => $result['user'],
        ], 'Conta criada com sucesso. Bem-vindo à ONDJILA!');
        return;
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
            return;
        }

        respond([
            'token' => $result['token'],
            'user'  => $result['user'],
        ]);
        return;
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

        respond(['message' => $result['message']]);
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
