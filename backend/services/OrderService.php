<?php
declare(strict_types=1);
namespace App\Services;

use App\Models\Order;
use App\Repositories\OrderRepository;
use App\Repositories\ProductRepository;

class OrderService
{
    private OrderRepository $orders;
    private ProductRepository $products;

    public function __construct()
    {
        $this->orders   = new OrderRepository();
        $this->products = new ProductRepository();
    }

    /**
     * Cria um pedido e simula o processamento de pagamento.
     * Em produção, aqui seria feita a chamada ao Stripe ou outro gateway.
     */
    public function createOrder(int $userId, array $data): array
    {
        // Validação dos items
        if (empty($data['items'])) {
            return ['success' => false, 'message' => 'O carrinho está vazio.'];
        }

        $items    = [];
        $subtotal = 0.0;

        foreach ($data['items'] as $item) {
            $product = $this->products->findById((int) $item['product_id']);
            if ($product === null) {
                return ['success' => false, 'message' => "Produto ID {$item['product_id']} não encontrado."];
            }
            if ($product->stock < $item['quantity']) {
                return ['success' => false, 'message' => "Stock insuficiente para: {$product->name}"];
            }

            $lineTotal = $product->price * $item['quantity'];
            $subtotal += $lineTotal;

            $items[] = [
                'product_id'  => $product->id,
                'product_name'=> $product->name,
                'price'       => $product->price,
                'quantity'    => (int) $item['quantity'],
                'total'       => $lineTotal,
            ];
        }

        $shipping = $subtotal >= 100000 ? 0.0 : 2500.0; // Envio grátis acima de 100.000 Kz
        $total    = $subtotal + $shipping;

        // ============================================================
        // PAYMENT STUB — Simulação de Pagamento
        // Em produção: substituir por chamada à API do Stripe/PayGate
        // ============================================================
        $paymentResult = $this->simulatePayment($total, $data['payment_method'] ?? 'card');

        if (!$paymentResult['success']) {
            return ['success' => false, 'message' => 'Pagamento recusado. Tente novamente.'];
        }

        // Criar o pedido na BD
        $order = new Order(
            id:               null,
            user_id:          $userId,
            status:           'processing',
            subtotal:         $subtotal,
            shipping:         $shipping,
            total:            $total,
            payment_status:   'paid',
            payment_method:   $data['payment_method'] ?? 'card',
            shipping_address: $data['shipping_address'] ?? null,
            notes:            $data['notes'] ?? null,
            items:            $items,
        );

        $orderId = $this->orders->create($order, $items);

        // Decrementar stock
        foreach ($items as $item) {
            $this->products->decrementStock($item['product_id'], $item['quantity']);
        }

        $createdOrder = $this->orders->findById($orderId);

        return [
            'success'          => true,
            'order'            => $createdOrder->toArray(),
            'payment_ref'      => $paymentResult['reference'],
        ];
    }

    /**
     * Simulação do gateway de pagamento.
     * Retorna sempre sucesso com uma referência fictícia.
     * TODO: Integrar Stripe em produção.
     */
    private function simulatePayment(float $amount, string $method): array
    {
        // Simular um ligeiro delay de processamento
        usleep(200000); // 200ms

        return [
            'success'   => true,
            'reference' => 'ONDJILA-' . strtoupper(bin2hex(random_bytes(6))),
            'amount'    => $amount,
            'method'    => $method,
            'timestamp' => date('c'),
        ];
    }
}
