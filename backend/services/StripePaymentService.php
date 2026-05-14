<?php
declare(strict_types=1);

namespace App\Services;

class StripePaymentService
{
    public function __construct(private ?HttpClientService $http = null)
    {
        $this->http ??= new HttpClientService();
    }

    public function chargeOrder(int $orderId, float $amountKz, string $currency = 'AOA'): array
    {
        $mode = strtolower((string) ($_ENV['STRIPE_MODE'] ?? 'simulation'));
        $secret = trim((string) ($_ENV['STRIPE_TEST_SECRET_KEY'] ?? $_ENV['STRIPE_SECRET_KEY'] ?? ''));
        if ($mode === 'simulation' || $secret === '') {
            return [
                'success' => true,
                'provider' => 'simulation',
                'status' => 'succeeded',
                'reference' => 'SIM-' . strtoupper(bin2hex(random_bytes(6))),
            ];
        }

        try {
            $response = $this->http->postForm('https://api.stripe.com/v1/payment_intents', [
                'amount' => max(1, (int) round($amountKz)),
                'currency' => strtolower($currency),
                'confirm' => 'true',
                'payment_method' => $_ENV['STRIPE_TEST_PAYMENT_METHOD'] ?? 'pm_card_visa',
                'automatic_payment_methods[enabled]' => 'true',
                'automatic_payment_methods[allow_redirects]' => 'never',
                'metadata[order_id]' => (string) $orderId,
            ], [
                "Authorization: Bearer {$secret}",
            ], 20);

            $body = $response['body'];
            $status = (string) ($body['status'] ?? 'unknown');

            return [
                'success' => $status === 'succeeded',
                'provider' => 'stripe',
                'status' => $status,
                'reference' => (string) ($body['id'] ?? ''),
                'client_secret' => $body['client_secret'] ?? null,
                'error' => $body['error']['message'] ?? null,
            ];
        } catch (\Throwable $e) {
            error_log('Stripe falhou: ' . $e->getMessage());
            return [
                'success' => false,
                'provider' => 'stripe',
                'status' => 'failed',
                'reference' => null,
                'error' => 'Pagamento indisponível no momento.',
            ];
        }
    }
}
