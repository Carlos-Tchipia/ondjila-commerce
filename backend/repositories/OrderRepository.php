<?php
declare(strict_types=1);
namespace App\Repositories;

use App\Config\Database;
use App\Models\Order;
use PDO;

class OrderRepository
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function create(Order $order, array $items): int
    {
        $this->db->beginTransaction();

        try {
            $stmt = $this->db->prepare(
                'INSERT INTO orders (user_id, status, subtotal, shipping, total, payment_status, payment_method, currency, exchange_rate, payment_reference, payment_provider, shipping_address, notes)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                $order->user_id,
                $order->status,
                $order->subtotal,
                $order->shipping,
                $order->total,
                $order->payment_status,
                $order->payment_method,
                $order->currency,
                $order->exchange_rate,
                $order->payment_reference,
                $order->payment_provider,
                $order->shipping_address,
                $order->notes,
            ]);

            $orderId = (int) $this->db->lastInsertId();

            foreach ($items as $item) {
                $itemStmt = $this->db->prepare(
                    'INSERT INTO order_items (order_id, product_id, product_name, price, quantity, total)
                     VALUES (:order_id, :product_id, :product_name, :price, :quantity, :total)'
                );
                $itemStmt->execute([
                    ':order_id'     => $orderId,
                    ':product_id'   => $item['product_id'],
                    ':product_name' => $item['product_name'],
                    ':price'        => $item['price'],
                    ':quantity'     => $item['quantity'],
                    ':total'        => $item['total'],
                ]);
            }

            $this->db->commit();
            return $orderId;
        } catch (\Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function findById(int $id): ?Order
    {
        $stmt = $this->db->prepare('SELECT * FROM orders WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        if (!$row) return null;

        $items = $this->getItems($id);
        return $this->hydrate($row, $items);
    }

    public function findByUser(int $userId): array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM orders WHERE user_id = :user_id ORDER BY created_at DESC'
        );
        $stmt->execute([':user_id' => $userId]);
        return array_map(fn($row) => $this->hydrate($row, $this->getItems((int)$row['id']))->toArray(), $stmt->fetchAll());
    }

    public function findAll(): array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM orders ORDER BY created_at DESC'
        );
        $stmt->execute();
        return array_map(fn($row) => $this->hydrate($row, $this->getItems((int)$row['id']))->toArray(), $stmt->fetchAll());
    }

    public function updateStatus(int $id, string $status): bool
    {
        $stmt = $this->db->prepare('UPDATE orders SET status = :status WHERE id = :id');
        return $stmt->execute([':status' => $status, ':id' => $id]);
    }

    public function updatePayment(int $id, string $paymentStatus, string $orderStatus, ?string $reference, ?string $provider): bool
    {
        $stmt = $this->db->prepare(
            'UPDATE orders
             SET payment_status = ?,
                 status = ?,
                 payment_reference = ?,
                 payment_provider = ?
             WHERE id = ?'
        );

        return $stmt->execute([$paymentStatus, $orderStatus, $reference, $provider, $id]);
    }

    private function getItems(int $orderId): array
    {
        $stmt = $this->db->prepare('SELECT * FROM order_items WHERE order_id = :order_id');
        $stmt->execute([':order_id' => $orderId]);
        return $stmt->fetchAll();
    }

    private function hydrate(array $row, array $items): Order
    {
        return new Order(
            id:               (int) $row['id'],
            user_id:          (int) $row['user_id'],
            status:           $row['status'],
            subtotal:         (float) $row['subtotal'],
            shipping:         (float) $row['shipping'],
            total:            (float) $row['total'],
            payment_status:   $row['payment_status'],
            payment_method:   $row['payment_method'],
            currency:         $row['currency'] ?? 'AOA',
            exchange_rate:    (float) ($row['exchange_rate'] ?? 1),
            payment_reference:$row['payment_reference'] ?? null,
            payment_provider: $row['payment_provider'] ?? null,
            shipping_address: $row['shipping_address'],
            notes:            $row['notes'],
            created_at:       $row['created_at'],
            items:            $items,
        );
    }
}
