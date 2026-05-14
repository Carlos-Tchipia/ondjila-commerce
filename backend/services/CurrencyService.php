<?php
declare(strict_types=1);

namespace App\Services;

class CurrencyService
{
    public function __construct(private ?HttpClientService $http = null)
    {
        $this->http ??= new HttpClientService();
    }

    public function convert(float $amount, string $from, string $to): array
    {
        $from = strtoupper($from);
        $to = strtoupper($to);

        if ($from === $to) {
            return ['success' => true, 'amount' => $amount, 'rate' => 1.0, 'from' => $from, 'to' => $to];
        }

        $apiKey = trim((string) ($_ENV['EXCHANGE_RATE_API_KEY'] ?? ''));
        if ($apiKey === '') {
            $fallbackRates = ['USD' => 0.0011, 'EUR' => 0.0010, 'AOA' => 1.0];
            if ($from === 'AOA' && isset($fallbackRates[$to])) {
                $rate = $fallbackRates[$to];
                return ['success' => true, 'amount' => round($amount * $rate, 2), 'rate' => $rate, 'from' => $from, 'to' => $to, 'provider' => 'fallback'];
            }
            return ['success' => false, 'message' => 'Conversão não configurada para esta moeda.'];
        }

        try {
            $response = $this->http->getJson('https://api.exchangerate.host/convert', [
                'access_key' => $apiKey,
                'from' => $from,
                'to' => $to,
                'amount' => $amount,
            ]);

            $body = $response['body'];
            if (!($body['success'] ?? false) || !isset($body['result'])) {
                return ['success' => false, 'message' => 'Não foi possível converter a moeda.'];
            }

            return [
                'success' => true,
                'amount' => (float) $body['result'],
                'rate' => (float) ($body['info']['rate'] ?? 0),
                'from' => $from,
                'to' => $to,
                'provider' => 'exchangerate.host',
            ];
        } catch (\Throwable $e) {
            error_log('ExchangeRate falhou: ' . $e->getMessage());
            return ['success' => false, 'message' => 'Serviço de câmbio indisponível.'];
        }
    }
}
