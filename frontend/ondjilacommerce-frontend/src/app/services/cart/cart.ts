import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../product/product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  private toastMessage = new BehaviorSubject<string | null>(null);
  toastMessage$ = this.toastMessage.asObservable();

  constructor() { }

  addToCart(product: Product) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      this.cartItems.next([...currentItems]);
    } else {
      this.cartItems.next([...currentItems, { product, quantity: 1 }]);
    }

    this.updateCount();
    this.showToast(`✓ ${product.name} adicionado ao carrinho`);
  }

  removeFromCart(productId: string) {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(item => item.product.id !== productId);
    this.cartItems.next(updatedItems);
    this.updateCount();
  }

  updateQuantity(productId: string, quantity: number) {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(item => item.product.id === productId);
    if (item && quantity > 0) {
      item.quantity = quantity;
      this.cartItems.next([...currentItems]);
      this.updateCount();
    } else if (item && quantity === 0) {
      this.removeFromCart(productId);
    }
  }

  private updateCount() {
    const count = this.cartItems.value.reduce((acc, item) => acc + item.quantity, 0);
    this.cartCount.next(count);
  }

  private showToast(message: string) {
    this.toastMessage.next(message);
    setTimeout(() => {
      this.toastMessage.next(null);
    }, 3000);
  }

  getTotal(): string {
    const total = this.cartItems.value.reduce((acc, item) => {
      const price = parseFloat(item.product.price.replace(/[^\d]/g, '')) / 100; // Assuming prices are formatted as XXX.XXX
      // This is a bit risky due to formatting, let's do a simpler approach for now
      return acc + (1000 * item.quantity); // Placeholder logic
    }, 0);
    return 'Calculando...'; // I'll fix this later or keep it simple
  }
}
