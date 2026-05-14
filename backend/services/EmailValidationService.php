<?php
declare(strict_types=1);

namespace App\Services;

class EmailValidationService
{
    public function __construct(private ?HttpClientService $http = null)
    {
        $this->http ??= new HttpClientService();
    }

    public function validate(string $email): array
    {
        $apiKey = trim((string) ($_ENV['ABSTRACT_EMAIL_API_KEY'] ?? ''));
        if ($apiKey === '') {
            return ['valid' => true, 'provider' => 'local', 'reason' => 'Validação externa não configurada.'];
        }

        try {
            $response = $this->http->getJson('https://emailvalidation.abstractapi.com/v1/', [
                'api_key' => $apiKey,
                'email' => $email,
            ]);

            $body = $response['body'];
            $validFormat = (bool) ($body['is_valid_format']['value'] ?? false);
            $mxFound = (bool) ($body['is_mx_found']['value'] ?? false);
            $disposable = (bool) ($body['is_disposable_email']['value'] ?? false);
            $deliverability = strtoupper((string) ($body['deliverability'] ?? ''));
            $quality = (float) ($body['quality_score'] ?? 0);

            if (!$validFormat || !$mxFound || $disposable || $deliverability === 'UNDELIVERABLE' || $quality < 0.55) {
                return [
                    'valid' => false,
                    'provider' => 'abstract',
                    'reason' => 'Email inválido, temporário ou sem entrega confiável.',
                ];
            }

            return ['valid' => true, 'provider' => 'abstract'];
        } catch (\Throwable $e) {
            error_log('Abstract Email Validation falhou: ' . $e->getMessage());
            return ['valid' => true, 'provider' => 'abstract', 'reason' => 'Validação externa indisponível.'];
        }
    }
}
