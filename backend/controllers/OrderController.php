<?php
declare(strict_types=1);
namespace App\Controllers;

use App\Services\OrderService;
use App\Repositories\OrderRepository;

class OrderController
{
    private OrderService $service;
    private OrderRepository $orders;

    public function __construct()
    {
        $this->service = new OrderService();
        $this->orders  = new OrderRepository();
    }

    public function index(): void
    {
        $payload = requireAuth();
        
        // Se for admin, vê todos. Se for cliente, vê apenas os seus.
        if (($payload->role ?? 'customer') === 'admin') {
            $orders = $this->orders->findAll();
        } else {
            $orders = $this->orders->findByUser($payload->sub);
        }
        
        respond($orders);
    }

    public function show(int $id): void
    {
        $payload = requireAuth();
        $order   = $this->orders->findById($id);

        $isAdmin = ($payload->role ?? 'customer') === 'admin';
        if ($order === null || (!$isAdmin && $order->user_id !== $payload->sub)) {
            respondError('Pedido não encontrado.', 404);
        }

        respond($order->toArray());
    }

    public function store(): void
    {
        $payload = requireAuth();
        $data    = getBody();
        $result  = $this->service->createOrder($payload->sub, $data);

        if (!$result['success']) {
            respondError($result['message'], 422);
        }

        respondCreated([
            'order'       => $result['order'],
            'payment_ref' => $result['payment_ref'],
        ], 'Pedido criado com sucesso! A sua encomenda está em processamento.');
    }

    public function cancel(int $id): void
    {
        $payload = requireAuth();
        $order   = $this->orders->findById($id);

        if ($order === null || $order->user_id !== $payload->sub) {
            respondError('Pedido não encontrado.', 404);
        }

        if (!in_array($order->status, ['pending', 'processing'])) {
            respondError('Este pedido não pode ser cancelado.', 422);
        }

        $this->orders->updateStatus($id, 'cancelled');
        respond(['message' => 'Pedido cancelado com sucesso.']);
    }
}
