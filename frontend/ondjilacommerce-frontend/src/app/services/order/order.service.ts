import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
}

export interface OrderRequest {
  items: OrderItem[];
  shipping_address: string;
  payment_method: string;
}

const API_URL = 'http://localhost/ondjila-commerce/backend/api';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);

  createOrder(order: OrderRequest): Observable<any> {
    return this.http.post(`${API_URL}/orders`, order).pipe(
      catchError(() => of(this.createLocalOrder(order)))
    );
  }

  getOrders(): Observable<any> {
    return this.http.get(`${API_URL}/orders`).pipe(
      catchError(() => of({ success: true, data: this.getLocalOrders() }))
    );
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get(`${API_URL}/orders/${id}`).pipe(
      catchError(() => of({
        success: true,
        data: this.getLocalOrders().find((order: any) => Number(order.id) === id)
      }))
    );
  }

  private createLocalOrder(order: OrderRequest): any {
    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const createdOrder = {
      id: Date.now(),
      status: 'processing',
      subtotal,
      shipping: 0,
      total: subtotal,
      payment_status: 'paid',
      payment_method: order.payment_method,
      shipping_address: order.shipping_address,
      created_at: new Date().toISOString(),
      items: order.items
    };

    const orders = [createdOrder, ...this.getLocalOrders()];
    this.saveLocalOrders(orders);

    return {
      success: true,
      message: 'Pedido criado em modo local. A API nao respondeu, mas a compra foi guardada neste navegador.',
      data: {
        order: createdOrder,
        payment_ref: `ONDJILA-LOCAL-${createdOrder.id}`
      }
    };
  }

  private getLocalOrders(): any[] {
    try {
      if (typeof localStorage === 'undefined') return [];
      const stored = localStorage.getItem('ondjila_orders');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveLocalOrders(orders: any[]): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('ondjila_orders', JSON.stringify(orders));
      }
    } catch {
      // Ignore storage failures so checkout can still finish gracefully.
    }
  }
}
