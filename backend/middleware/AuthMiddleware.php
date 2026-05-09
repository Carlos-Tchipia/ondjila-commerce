<?php

declare(strict_types=1);

/**
 * AuthMiddleware — Protege rotas que requerem autenticação JWT
 */
function requireAuth(): object
{
    $token = extractBearerToken();

    if ($token === null) {
        respondError('Token de autenticação não fornecido.', 401);
    }

    $payload = validateJwt($token);

    if ($payload === null) {
        respondError('Token inválido ou expirado.', 401);
    }

    return $payload;
}

function requireAdmin(): object
{
    $payload = requireAuth();

    if (($payload->role ?? 'customer') !== 'admin') {
        respondError('Acesso restrito a administradores.', 403);
    }

    return $payload;
}
