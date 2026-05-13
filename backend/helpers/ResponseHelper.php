<?php

declare(strict_types=1);

/**
 * ResponseHelper — Centraliza todas as respostas JSON da API
 */
function respond(mixed $data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => $status < 400,
        'data'    => $data,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function respondError(string $message, int $status = 400, ?array $errors = null): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    $body = [
        'success' => false,
        'message' => $message,
    ];
    if ($errors !== null) {
        $body['errors'] = $errors;
    }
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

function respondCreated(mixed $data, string $message = 'Criado com sucesso.'): void
{
    http_response_code(201);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => true,
        'message' => $message,
        'data'    => $data,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function getBody(): array
{
    $raw = file_get_contents('php://input');
    $decoded = json_decode($raw, true);
    $json = is_array($decoded) ? $decoded : [];
    return array_merge($_POST, $json);
}
