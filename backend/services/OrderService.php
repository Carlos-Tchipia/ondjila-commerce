<?php
declare(strict_types=1);
namespace App\Services;

use App\Models\Order;
use App\Repositories\OrderRepository;
use App\Repositories\ProductRepository;
use App\Repositories\UserRepository;

class OrderService
{
    private OrderRepository $orders;
    private ProductRepository $products;
    private UserRepository $users;
    private StripePaymentService $payments;
    private TransactionalEmailService $emails;

    public function __construct()
    {
        $this->orders   = new OrderRepository();
        $this->products = new ProductRepository();
        $this->users    = new UserRepository();
        $this->payments = new StripePaymentService();
        $this->emails   = new TransactionalEmailService();
    }

    /**
     * Cria o pedido como pendente, reserva stock, processa pagamento e confirma o pedido.
     */
    public function createOrder(int $userId, array $data): array
    {
        if (empty($data['items'])) {
            return ['success' => false, 'message' => 'O carrinho esta vazio.'];
        }

        $items    = [];
        $subtotal = 0.0;

        foreach ($data['items'] as $item) {
            $product = $this->products->findById((int) $item['product_id']);
            if ($product === null) {
                return ['success' => false, 'message' => "Produto ID {$item['product_id']} nao encontrado."];
            }
            $quantity = max(1, (int) ($item['quantity'] ?? 1));
            if ($product->stock < $quantity) {
                return ['success' => false, 'message' => "Stock insuficiente para: {$product->name}"];
            }

            $lineTotal = $product->price * $quantity;
            $subtotal += $lineTotal;

            $items[] = [
                'product_id'  => $product->id,
                'product_name'=> $product->name,
                'price'       => $product->price,
                'quantity'    => $quantity,
                'total'       => $lineTotal,
            ];
        }

        $shipping = $subtotal >= 100000 ? 0.0 : 2500.0;
        $total    = $subtotal + $shipping;

        $order = new Order(
            id:               null,
            user_id:          $userId,
            status:           'pending',
            subtotal:         $subtotal,
            shipping:         $shipping,
            total:            $total,
            payment_status:   'pending',
            payment_method:   $data['payment_method'] ?? 'card',
            currency:         'AOA',
            exchange_rate:    1.0,
            shipping_address: $data['shipping_address'] ?? null,
            notes:            $data['notes'] ?? null,
            items:            $items,
        );

        $orderId = $this->orders->create($order, $items);

        foreach ($items as $item) {
            if (!$this->products->decrementStock($item['product_id'], $item['quantity'])) {
                $this->restoreStock($items);
                $this->orders->updatePayment($orderId, 'failed', 'pending', null, 'stock');
                return ['success' => false, 'message' => "Stock indisponível para: {$item['product_name']}"];
            }
        }

        $paymentResult = $this->payments->chargeOrder($orderId, $total, 'AOA');

        if (!$paymentResult['success']) {
            $this->restoreStock($items);
            $this->orders->updatePayment(
                $orderId,
                'failed',
                'pending',
                $paymentResult['reference'] ?? null,
                $paymentResult['provider'] ?? null
            );

            return ['success' => false, 'message' => $paymentResult['error'] ?? 'Pagamento recusado. Tente novamente.'];
        }

        $this->orders->updatePayment(
            $orderId,
            'paid',
            'processing',
            $paymentResult['reference'] ?? null,
            $paymentResult['provider'] ?? null
        );

        $createdOrder = $this->orders->findById($orderId);
        if ($createdOrder === null) {
            return ['success' => false, 'message' => 'Pedido criado, mas nao foi possivel carregar os dados finais.'];
        }

        $user = $this->users->findById($userId);
        if ($user !== null) {
            $this->emails->sendOrderConfirmation($user->email, $user->name, $createdOrder->toArray());
        }

        return [
            'success'          => true,
            'order'            => $createdOrder->toArray(),
            'payment_ref'      => $paymentResult['reference'],
        ];
    }

    private function restoreStock(array $items): void
    {
        foreach ($items as $item) {
            $this->products->incrementStock($item['product_id'], $item['quantity']);
        }
    }
}
