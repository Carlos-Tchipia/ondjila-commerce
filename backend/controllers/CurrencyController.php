<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Services\CurrencyService;

class CurrencyController
{
    public function convert(): void
    {
        $amount = (float) ($_GET['amount'] ?? 0);
        $from = (string) ($_GET['from'] ?? 'AOA');
        $to = (string) ($_GET['to'] ?? 'USD');

        if ($amount < 0) {
            respondError('O valor deve ser positivo.', 422);
        }

        $result = (new CurrencyService())->convert($amount, $from, $to);
        if (!($result['success'] ?? false)) {
            respondError($result['message'] ?? 'Conversão indisponível.', 502);
        }

        respond($result);
    }
}
