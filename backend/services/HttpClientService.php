<?php
declare(strict_types=1);

namespace App\Services;

class HttpClientService
{
    public function getJson(string $url, array $query = [], array $headers = [], int $timeout = 10): array
    {
        if ($query !== []) {
            $url .= (str_contains($url, '?') ? '&' : '?') . http_build_query($query);
        }

        return $this->requestJson('GET', $url, null, $headers, $timeout);
    }

    public function postJson(string $url, array $payload, array $headers = [], int $timeout = 10): array
    {
        $headers[] = 'Content-Type: application/json';
        return $this->requestJson('POST', $url, json_encode($payload), $headers, $timeout);
    }

    public function postForm(string $url, array $payload, array $headers = [], int $timeout = 10): array
    {
        $headers[] = 'Content-Type: application/x-www-form-urlencoded';
        return $this->requestJson('POST', $url, http_build_query($payload), $headers, $timeout);
    }

    private function requestJson(string $method, string $url, ?string $body, array $headers, int $timeout): array
    {
        if (function_exists('curl_init')) {
            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CUSTOMREQUEST => $method,
                CURLOPT_HTTPHEADER => $headers,
                CURLOPT_TIMEOUT => $timeout,
            ]);
            if ($body !== null) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
            }

            $raw = curl_exec($ch);
            $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $error = curl_error($ch);
            curl_close($ch);

            if ($raw === false) {
                throw new \RuntimeException("Falha HTTP: {$error}");
            }
        } else {
            $context = stream_context_create([
                'http' => [
                    'method' => $method,
                    'header' => implode("\r\n", $headers),
                    'content' => $body ?? '',
                    'timeout' => $timeout,
                    'ignore_errors' => true,
                ],
            ]);
            $raw = file_get_contents($url, false, $context);
            $status = $this->extractStatusCode($http_response_header ?? []);
            if ($raw === false) {
                throw new \RuntimeException('Falha HTTP ao contactar serviço externo.');
            }
        }

        $decoded = json_decode($raw, true);
        if (!is_array($decoded)) {
            throw new \RuntimeException('Resposta externa inválida.');
        }

        return [
            'status' => $status,
            'body' => $decoded,
        ];
    }

    private function extractStatusCode(array $headers): int
    {
        $first = $headers[0] ?? '';
        return preg_match('#\s(\d{3})\s#', $first, $matches) ? (int) $matches[1] : 0;
    }
}
