<?php
declare(strict_types=1);

namespace App\Services;

class TransactionalEmailService
{
    public function __construct(private ?HttpClientService $http = null)
    {
        $this->http ??= new HttpClientService();
    }

    public function sendWelcome(string $email, string $name): bool
    {
        return $this->send(
            $email,
            $name,
            'Bem-vindo à Ondjila Commerce',
            "<p>Olá {$this->escape($name)},</p><p>A sua conta foi criada com sucesso. Boa jornada na Ondjila Commerce.</p>",
            "Olá {$name}, a sua conta foi criada com sucesso."
        );
    }

    public function sendOrderConfirmation(string $email, string $name, array $order): bool
    {
        $total = number_format((float) ($order['total'] ?? 0), 2, ',', '.');
        $orderId = (int) ($order['id'] ?? 0);

        return $this->send(
            $email,
            $name,
            "Confirmação do pedido #{$orderId}",
            "<p>Olá {$this->escape($name)},</p><p>Recebemos o seu pedido <strong>#{$orderId}</strong>.</p><p>Total: <strong>{$total} Kz</strong>.</p>",
            "Olá {$name}, recebemos o seu pedido #{$orderId}. Total: {$total} Kz."
        );
    }

    public function sendPasswordReset(string $email, string $name, string $resetUrl): bool
    {
        return $this->send(
            $email,
            $name,
            'Recuperacao de palavra-passe - Ondjila Commerce',
            "<p>Ola {$this->escape($name)},</p><p>Recebemos um pedido para repor a sua palavra-passe.</p><p><a href=\"{$this->escape($resetUrl)}\">Repor palavra-passe</a></p><p>O link expira em 1 hora.</p>",
            "Ola {$name}, use este link para repor a sua palavra-passe: {$resetUrl}. O link expira em 1 hora."
        );
    }

    public function hasRealProvider(): bool
    {
        return trim((string) ($_ENV['EMAIL_API_KEY'] ?? $_ENV['RESEND_API_KEY'] ?? '')) !== '';
    }

    private function send(string $toEmail, string $toName, string $subject, string $html, string $text): bool
    {
        $apiKey = trim((string) ($_ENV['EMAIL_API_KEY'] ?? $_ENV['RESEND_API_KEY'] ?? ''));
        $provider = strtolower((string) ($_ENV['EMAIL_PROVIDER'] ?? 'resend'));
        $from = (string) ($_ENV['MAIL_FROM'] ?? 'Ondjila Commerce <noreply@ondjila.ao>');

        if ($apiKey === '') {
            error_log("Email transacional simulado para {$toEmail}: {$subject}");
            return true;
        }

        try {
            if ($provider === 'resend') {
                $response = $this->http->postJson('https://api.resend.com/emails', [
                    'from' => $from,
                    'to' => [$toEmail],
                    'subject' => $subject,
                    'html' => $html,
                    'text' => $text,
                ], [
                    "Authorization: Bearer {$apiKey}",
                ]);

                return $response['status'] >= 200 && $response['status'] < 300;
            }

            error_log("EMAIL_PROVIDER {$provider} não suportado; email simulado para {$toEmail}.");
            return true;
        } catch (\Throwable $e) {
            error_log('Envio de email transacional falhou: ' . $e->getMessage());
            return false;
        }
    }

    private function escape(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}
