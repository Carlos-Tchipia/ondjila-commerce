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

    public function logout(): void
    {
        // JWT é stateless: o frontend apaga o token localmente.
        // Aqui confirmamos apenas o sucesso da operação.
        respond(['message' => 'Sessão terminada com sucesso.']);
    }
}
