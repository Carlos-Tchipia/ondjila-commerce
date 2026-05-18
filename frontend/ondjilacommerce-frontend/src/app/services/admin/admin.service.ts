import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const API_URL = 'http://localhost/ondjila-commerce/backend/api';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);

  getDashboardStats(): Observable<any> {
    return this.http.get(`${API_URL}/admin/stats`).pipe(
      catchError(err => this.fallbackUnlessAuthError(err, { success: true, data: this.getLocalStats() }))
    );
  }

  getProducts(category?: string): Observable<any> {
    const url = category ? `${API_URL}/admin/products?category=${category}` : `${API_URL}/admin/products`;
    return this.http.get(url).pipe(
      catchError(err => this.fallbackUnlessAuthError(err, {
        success: true,
        data: this.getLocalProducts().filter(p => !category || p.category === category)
      }))
    );
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(`${API_URL}/admin/products`, product).pipe(
      catchError(err => this.fallbackUnlessAuthError(err, this.createLocalProduct(product)))
    );
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.post(`${API_URL}/admin/products/${id}`, product).pipe(
      catchError(err => this.fallbackUnlessAuthError(err, this.updateLocalProduct(id, product)))
    );
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/admin/products/${id}`).pipe(
      catchError(err => this.fallbackUnlessAuthError(err, this.deleteLocalProduct(id)))
    );
  }

  updateStock(productId: number, quantity: number): Observable<any> {
    return this.http.post(`${API_URL}/admin/stock/update`, { product_id: productId, quantity }).pipe(
      catchError(err => this.fallbackUnlessAuthError(err, this.updateLocalStock(productId, quantity)))
    );
  }

  getOrders(): Observable<any> {
    return this.http.get(`${API_URL}/admin/orders`).pipe(
      catchError(err => this.fallbackUnlessAuthError(err, { success: true, data: this.getLocalOrders() }))
    );
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put(`${API_URL}/admin/orders/${orderId}/status`, { status }).pipe(
      catchError(err => this.fallbackUnlessAuthError(err, this.updateLocalOrderStatus(orderId, status)))
    );
  }

  getCustomers(): Observable<any> {
    return this.http.get(`${API_URL}/admin/customers`).pipe(
      catchError(err => this.fallbackUnlessAuthError(err, { success: true, data: this.getLocalCustomers() }))
    );
  }

  getCategories(): Observable<any> {
    return this.http.get(`${API_URL}/admin/categories`).pipe(
      catchError(err => this.fallbackUnlessAuthError(err, { success: true, data: this.getLocalCategories() }))
    );
  }

  getReports(type: string, startDate?: string, endDate?: string): Observable<any> {
    let url = `${API_URL}/admin/reports?type=${type}`;
    if (startDate) url += `&start_date=${startDate}`;
    if (endDate) url += `&end_date=${endDate}`;
    return this.http.get(url).pipe(
      catchError(err => this.fallbackUnlessAuthError(err, { success: true, data: this.getLocalStats(), type }))
    );
  }

  downloadReport(type: string): void {
    this.http.get(`${API_URL}/admin/export?type=${type}`, {
      responseType: 'blob'
    }).pipe(
      catchError(() => of(this.createLocalCsvBlob(type)))
    ).subscribe(blob => {
      this.downloadBlob(blob, `relatorio_${type}_${this.timestamp()}.csv`);
    });
  }

  downloadPdf(type: string): void {
    this.getReportRows(type).subscribe(rows => {
      const html = this.buildPrintableReport(type, rows);
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    });
  }

  getReportRows(type: string): Observable<any[]> {
    if (type === 'sales') {
      return this.getOrders().pipe(catchError(() => of({ data: this.getLocalOrders() })), this.unwrapData());
    }

    if (type === 'customers') {
      return this.getCustomers().pipe(catchError(() => of({ data: this.getLocalCustomers() })), this.unwrapData());
    }

    return this.getProducts().pipe(catchError(() => of({ data: this.getLocalProducts() })), this.unwrapData());
  }

  private getLocalProducts(): any[] {
    const stored = this.readLocal('ondjila_admin_products');
    if (stored.length) return stored;

    const products = [
      { id: 1, name: 'Apple iPhone 15 Pro Max 256GB', brand: 'Apple', category: 'Smartphones', price: 749000, stock: 15, image_url: 'assets/images/products/smartphones_1.jpg', description: 'iPhone premium com titanio e camera avancada.' },
      { id: 2, name: 'Samsung Galaxy S24 Ultra 512GB', brand: 'Samsung', category: 'Smartphones', price: 689000, stock: 12, image_url: 'assets/images/products/smartphones_2.jpg', description: 'Galaxy Ultra com S Pen e IA integrada.' },
      { id: 5, name: 'Apple MacBook Pro 14 M3 Pro', brand: 'Apple', category: 'Laptops', price: 1450000, stock: 8, image_url: 'assets/images/products/laptops_1.jpg', description: 'MacBook Pro para trabalho profissional.' },
      { id: 14, name: 'Apple AirPods Pro 2 USB-C', brand: 'Apple', category: 'Auscultadores', price: 145000, stock: 35, image_url: 'assets/images/products/auscultadores_2.jpg', description: 'Auscultadores com cancelamento de ruido.' }
    ];
    this.writeLocal('ondjila_admin_products', products);
    return products;
  }

  private getLocalOrders(): any[] {
    return this.readLocal('ondjila_orders').map((order: any) => ({
      ...order,
      customer_name: order.customer_name || 'Cliente Ondjila',
      customer_email: order.customer_email || 'cliente@ondjila.local',
      total_amount: order.total || order.total_amount || 0
    }));
  }

  private getLocalCustomers(): any[] {
    const user = this.readObject('ondjila_user');
    return user ? [user] : [{ id: 1, name: 'Cliente Ondjila', email: 'cliente@ondjila.local', phone: '', address: '', role: 'customer' }];
  }

  private getLocalCategories(): any[] {
    const counts = new Map<string, number>();
    this.getLocalProducts().forEach(p => counts.set(p.category, (counts.get(p.category) || 0) + 1));
    return Array.from(counts.entries()).map(([name, products_count]) => ({ name, products_count }));
  }

  private getLocalStats(): any {
    const products = this.getLocalProducts();
    const orders = this.getLocalOrders();
    const monthlySales = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

    return {
      metrics: {
        monthly_sales: monthlySales,
        orders_today: orders.length,
        total_customers: this.getLocalCustomers().length,
        low_stock_count: products.filter(p => Number(p.stock) <= 5).length
      },
      chart: [],
      recent_orders: orders.slice(0, 5),
      low_stock_list: products.filter(p => Number(p.stock) <= 5).slice(0, 5)
    };
  }

  private createLocalCsvBlob(type: string): Blob {
    const rows = type === 'sales'
      ? this.getLocalOrders()
      : type === 'customers'
        ? this.getLocalCustomers()
        : this.getLocalProducts();

    const headers = this.getReportHeaders(type);
    const csvRows = [
      headers.join(';'),
      ...rows.map(row => headers.map(header => this.csvValue(this.mapReportValue(type, row, header))).join(';'))
    ];

    return new Blob(['\ufeff' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  }

  private downloadBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  private buildPrintableReport(type: string, rows: any[]): string {
    const title = this.getReportTitle(type);
    const headers = this.getReportHeaders(type);
    const bodyRows = rows.map(row => `
      <tr>${headers.map(header => `<td>${this.escapeHtml(String(this.mapReportValue(type, row, header) ?? ''))}</td>`).join('')}</tr>
    `).join('');

    return `
      <!doctype html>
      <html lang="pt">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #201b12; margin: 32px; }
          h1 { color: #c8960c; font-size: 24px; margin-bottom: 4px; text-transform: uppercase; }
          p { color: #666; margin-top: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 12px; }
          th { background: #f5f2ec; text-align: left; color: #4f4634; text-transform: uppercase; }
          th, td { border: 1px solid #e8e4dc; padding: 10px; }
          footer { margin-top: 32px; color: #777; font-size: 11px; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p>Gerado em ${new Date().toLocaleString('pt-AO')}</p>
        <table>
          <thead><tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr></thead>
          <tbody>${bodyRows || `<tr><td colspan="${headers.length}">Sem dados para apresentar.</td></tr>`}</tbody>
        </table>
        <footer>Ondjila Commerce - Relatorio oficial</footer>
      </body>
      </html>
    `;
  }

  private getReportTitle(type: string): string {
    const titles: Record<string, string> = {
      sales: 'Relatorio de Vendas',
      products: 'Relatorio de Produtos e Stock',
      customers: 'Relatorio de Clientes'
    };
    return titles[type] || 'Relatorio Ondjila';
  }

  private getReportHeaders(type: string): string[] {
    if (type === 'sales') return ['ID', 'Cliente', 'Data', 'Total (Kz)', 'Estado'];
    if (type === 'customers') return ['ID', 'Nome', 'Email', 'Telefone', 'Data de Registo'];
    return ['ID', 'Nome', 'Marca', 'Categoria', 'Preco (Kz)', 'Stock'];
  }

  private mapReportValue(type: string, row: any, header: string): any {
    const normalized = header.toLowerCase();
    if (type === 'sales') {
      if (normalized === 'cliente') return row.customer_name || row.name || 'Cliente Ondjila';
      if (normalized === 'data') return row.created_at || '';
      if (normalized === 'total (kz)') return row.total_amount || row.total || 0;
      if (normalized === 'estado') return row.status || '';
      return row.id || '';
    }

    if (type === 'customers') {
      if (normalized === 'nome') return row.name || '';
      if (normalized === 'email') return row.email || '';
      if (normalized === 'telefone') return row.phone || '';
      if (normalized === 'data de registo') return row.created_at || '';
      return row.id || '';
    }

    if (normalized === 'nome') return row.name || '';
    if (normalized === 'marca') return row.brand || '';
    if (normalized === 'categoria') return row.category || '';
    if (normalized === 'preco (kz)') return row.price || 0;
    if (normalized === 'stock') return row.stock || 0;
    return row.id || '';
  }

  private csvValue(value: any): string {
    const text = String(value ?? '');
    return `"${text.replace(/"/g, '""')}"`;
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private timestamp(): string {
    return new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
  }

  private unwrapData() {
    return (source: Observable<any>) => new Observable<any[]>(subscriber => {
      const sub = source.subscribe({
        next: res => subscriber.next(res?.data || res || []),
        error: err => subscriber.error(err),
        complete: () => subscriber.complete()
      });
      return () => sub.unsubscribe();
    });
  }

  private createLocalProduct(product: any): any {
    const products = this.getLocalProducts();
    const created = { id: Date.now(), ...this.formDataToObject(product), image_url: 'assets/images/products/smartphones_1.jpg' };
    products.unshift(created);
    this.writeLocal('ondjila_admin_products', products);
    return { success: true, data: created };
  }

  private updateLocalProduct(id: number, product: any): any {
    const data = this.formDataToObject(product);
    const products = this.getLocalProducts().map(p => p.id === id ? { ...p, ...data } : p);
    this.writeLocal('ondjila_admin_products', products);
    return { success: true, data: products.find(p => p.id === id) };
  }

  private deleteLocalProduct(id: number): any {
    this.writeLocal('ondjila_admin_products', this.getLocalProducts().filter(p => p.id !== id));
    return { success: true, data: { id } };
  }

  private updateLocalStock(productId: number, quantity: number): any {
    const products = this.getLocalProducts().map(p => p.id === productId ? { ...p, stock: quantity } : p);
    this.writeLocal('ondjila_admin_products', products);
    return { success: true, data: { product_id: productId, quantity } };
  }

  private updateLocalOrderStatus(orderId: number, status: string): any {
    const orders = this.getLocalOrders().map(order => order.id === orderId ? { ...order, status } : order);
    this.writeLocal('ondjila_orders', orders);
    return { success: true, data: { order_id: orderId, status } };
  }

  private formDataToObject(value: any): any {
    if (!(value instanceof FormData)) return value;
    const result: any = {};
    value.forEach((fieldValue, key) => {
      if (typeof fieldValue === 'string') result[key] = fieldValue;
    });
    return result;
  }

  private readLocal(key: string): any[] {
    try {
      if (typeof localStorage === 'undefined') return [];
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private readObject(key: string): any {
    try {
      if (typeof localStorage === 'undefined') return null;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private writeLocal(key: string, value: any[]): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      // Storage is best-effort for the local fallback.
    }
  }

  private fallbackUnlessAuthError(err: any, value: any): Observable<any> {
    if (err?.status === 401 || err?.status === 403) {
      return throwError(() => err);
    }

    return of(value);
  }
}
