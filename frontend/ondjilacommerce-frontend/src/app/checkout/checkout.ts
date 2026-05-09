import { RouterLink, Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { UserService } from '../services/user/user.service';
import { OrderService, OrderRequest } from '../services/order/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  cartService = inject(CartService);
  userService = inject(UserService);
  orderService = inject(OrderService);
  router = inject(Router);

  address = '';
  city = 'Luanda';
  paymentMethod = 'stub'; // Simulação
  isLoading = false;
  errorMessage = '';

  onSubmit() {
    if (!this.address) {
      this.errorMessage = 'Por favor, insira a morada de entrega.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.cartService.cartItems$.subscribe(items => {
      if (items.length === 0) {
        this.errorMessage = 'O seu carrinho está vazio.';
        this.isLoading = false;
        return;
      }

      const orderRequest: OrderRequest = {
        items: items.map(item => ({
          product_id: parseInt(item.product.id),
          quantity: item.quantity,
          price: item.product.priceRaw || 0
        })),
        shipping_address: `${this.address}, ${this.city}, Angola`,
        payment_method: this.paymentMethod
      };

      this.orderService.createOrder(orderRequest).subscribe({
        next: (res) => {
          if (res.success) {
            this.cartService.clearCart();
            this.router.navigate(['/order-success']);
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Falha ao processar o pedido. Tente novamente.';
          this.isLoading = false;
        }
      });
    }).unsubscribe();
  }
}
