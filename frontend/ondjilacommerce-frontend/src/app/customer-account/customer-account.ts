import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user/user.service';
import { CartService } from '../services/cart/cart';
import { OrderService } from '../services/order/order.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-customer-account',
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-account.html',
  styleUrl: './customer-account.scss',
})
export class CustomerAccount implements OnInit {
  cartService = inject(CartService);
  userService = inject(UserService);
  orderService = inject(OrderService);

  currentUser: any = null;
  latestOrder: any = null;

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (res) => {
        const orders = res.data || res;
        if (orders && orders.length > 0) {
          this.latestOrder = orders[0];
        }
      },
      error: (err) => console.error('Erro ao carregar encomendas', err)
    });
  }

  logout() {
    this.userService.logout();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-AO').format(price) + ' Kz';
  }
}
