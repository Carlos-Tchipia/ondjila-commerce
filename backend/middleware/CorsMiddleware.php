<?php

declare(strict_types=1);

/**
 * CorsMiddleware — Configura os cabeçalhos CORS
 * Permite que o frontend Angular (localhost:4200) comunique com esta API.
 */
function applyCors(): void
{
    $allowedOrigins = [
        'http://localhost:4200',
        'http://localhost:4000',
        $_ENV['APP_FRONTEND_URL'] ?? 'http://localhost:4200',
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $allowedOrigins, true)) {
        header("Access-Control-Allow-Origin: {$origin}");
    } else {
        // Em desenvolvimento, permitir qualquer origem local
        header('Access-Control-Allow-Origin: http://localhost:4200');
    }

    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // Cache preflight 24h

    // Responder imediatamente aos pedidos OPTIONS (preflight)
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
