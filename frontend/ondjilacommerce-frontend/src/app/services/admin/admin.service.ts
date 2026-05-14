import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);

  getDashboardStats(): Observable<any> {
    return this.http.get(`${API_URL}/admin/stats`);
  }

  getProducts(category?: string): Observable<any> {
    const url = category ? `${API_URL}/admin/products?category=${category}` : `${API_URL}/admin/products`;
    return this.http.get(url);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(`${API_URL}/admin/products/create`, product);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.post(`${API_URL}/admin/products/update/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.post(`${API_URL}/admin/products/delete/${id}`, {});
  }

  updateStock(productId: number, quantity: number): Observable<any> {
    return this.http.post(`${API_URL}/admin/stock/update`, { product_id: productId, quantity });
  }

  getOrders(): Observable<any> {
    return this.http.get(`${API_URL}/admin/orders`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.post(`${API_URL}/admin/orders/update-status`, { order_id: orderId, status });
  }

  getCustomers(): Observable<any> {
    return this.http.get(`${API_URL}/admin/customers`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${API_URL}/admin/categories`);
  }

  getReports(type: string, startDate?: string, endDate?: string): Observable<any> {
    let url = `${API_URL}/admin/reports?type=${type}`;
    if (startDate) url += `&start_date=${startDate}`;
    if (endDate) url += `&end_date=${endDate}`;
    return this.http.get(url);
  }

  downloadReport(type: string, format: 'csv' | 'pdf' = 'csv'): Observable<Blob> {
    return this.http.get(`${API_URL}/admin/export`, {
      params: { type, format },
      responseType: 'blob'
    });
  }
}
