import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    return this.http.post(`${API_URL}/orders`, order);
  }

  getOrders(): Observable<any> {
    return this.http.get(`${API_URL}/orders`);
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get(`${API_URL}/orders/${id}`);
  }
}
