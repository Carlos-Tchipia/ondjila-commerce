import { RouterLink } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../services/order/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [RouterLink, CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  orderService = inject(OrderService);
  orders: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.orderService.getOrders().subscribe({
      next: (res) => {
        this.orders = res.data || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatPrice(price: number) {
    return new Intl.NumberFormat('pt-AO').format(price) + ' Kz';
  }
}
