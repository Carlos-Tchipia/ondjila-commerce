<?php

declare(strict_types=1);

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

/**
 * JwtHelper — Geração e Validação de JSON Web Tokens
 */
function generateJwt(array $payload): string
{
    $secret  = $_ENV['JWT_SECRET'] ?? 'fallback_secret_change_in_production';
    $expiry  = (int) ($_ENV['JWT_EXPIRY'] ?? 86400);

    $payload['iat'] = time();
    $payload['exp'] = time() + $expiry;

    return JWT::encode($payload, $secret, 'HS256');
}

function validateJwt(string $token): ?object
{
    try {
        $secret = $_ENV['JWT_SECRET'] ?? 'fallback_secret_change_in_production';
        return JWT::decode($token, new Key($secret, 'HS256'));
    } catch (\Exception $e) {
        return null;
    }
}

function extractBearerToken(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+(.+)/', $header, $matches)) {
        return $matches[1];
    }
    return null;
}
