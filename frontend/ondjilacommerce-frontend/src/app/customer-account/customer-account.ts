import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user/user.service';
import { CartService } from '../services/cart/cart';
import { OrderService } from '../services/order/order.service';
import { Router, RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs/operators';
import { apiErrorMessage } from '../shared/api-feedback';

type AccountTab = 'summary' | 'orders' | 'addresses' | 'details';

@Component({
  selector: 'app-customer-account',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './customer-account.html',
  styleUrl: './customer-account.scss',
})
export class CustomerAccount implements OnInit {
  cartService = inject(CartService);
  userService = inject(UserService);
  orderService = inject(OrderService);
  router = inject(Router);

  currentUser: any = null;
  orders: any[] = [];
  latestOrder: any = null;
  activeTab: AccountTab = 'summary';

  profileForm = {
    name: '',
    phone: '',
    address: ''
  };

  isLoadingOrders = false;
  isSavingProfile = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
    this.syncProfileForm();
    this.activeTab = this.tabFromUrl(this.router.url);
    this.loadOrders();
  }

  setTab(tab: AccountTab) {
    this.activeTab = tab;
    const suffix = tab === 'summary' ? '' : `/${tab}`;
    this.router.navigateByUrl(`/customer-account${suffix}`);
  }

  loadOrders() {
    this.isLoadingOrders = true;
    this.errorMessage = '';

    this.orderService.getOrders().pipe(
      timeout(15000),
      finalize(() => {
        this.isLoadingOrders = false;
      })
    ).subscribe({
      next: (res) => {
        this.orders = Array.isArray(res.data) ? res.data : [];
        this.latestOrder = this.orders[0] || null;
      },
      error: (err) => {
        this.errorMessage = apiErrorMessage(err, 'Nao foi possivel carregar o historico de compras.');
      }
    });
  }

  saveProfile() {
    this.isSavingProfile = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.updateProfile(this.profileForm).pipe(
      timeout(15000),
      finalize(() => {
        this.isSavingProfile = false;
      })
    ).subscribe({
      next: (res) => {
        this.currentUser = res.data.user;
        this.syncProfileForm();
        this.successMessage = res.data.message || 'Conta atualizada com sucesso.';
      },
      error: (err) => {
        this.errorMessage = apiErrorMessage(err, 'Nao foi possivel atualizar a conta.');
      }
    });
  }

  cancelOrder(orderId: number) {
    this.errorMessage = '';
    this.successMessage = '';

    this.orderService.cancelOrder(orderId).pipe(timeout(15000)).subscribe({
      next: () => {
        this.successMessage = 'Pedido cancelado com sucesso.';
        this.loadOrders();
      },
      error: (err) => {
        this.errorMessage = apiErrorMessage(err, 'Nao foi possivel cancelar este pedido.');
      }
    });
  }

  canCancel(order: any): boolean {
    return ['pending', 'processing'].includes(order?.status);
  }

  logout() {
    this.userService.logout();
  }

  formatPrice(price: number | string | null | undefined): string {
    const value = Number(price || 0);
    return new Intl.NumberFormat('pt-AO').format(value) + ' Kz';
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendente',
      processing: 'Em processamento',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
      failed: 'Falhou'
    };
    return labels[status] || status;
  }

  private syncProfileForm() {
    this.profileForm = {
      name: this.currentUser?.name || '',
      phone: this.currentUser?.phone || '',
      address: this.currentUser?.address || ''
    };
  }

  private tabFromUrl(url: string): AccountTab {
    if (url.includes('/orders')) return 'orders';
    if (url.includes('/addresses')) return 'addresses';
    if (url.includes('/details')) return 'details';
    return 'summary';
  }
}
