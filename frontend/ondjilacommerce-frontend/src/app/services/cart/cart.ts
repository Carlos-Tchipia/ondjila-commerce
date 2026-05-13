import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  private platformId = inject(PLATFORM_ID);

  private cartItems = new BehaviorSubject<CartItem[]>(this.loadCart());
  cartItems$ = this.cartItems.asObservable();

  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  private toastMessage = new BehaviorSubject<string | null>(null);
  toastMessage$ = this.toastMessage.asObservable();

  constructor() {
    this.updateCount();
  }

  addToCart(product: Product) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      this.cartItems.next([...currentItems]);
    } else {
      this.cartItems.next([...currentItems, { product, quantity: 1 }]);
    }

    this.saveCart();
    this.updateCount();
    this.showToast(`✓ ${product.name} adicionado ao carrinho`);
  }

  removeFromCart(productId: string) {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(item => item.product.id !== productId);
    this.cartItems.next(updatedItems);
    this.saveCart();
    this.updateCount();
  }

  updateQuantity(productId: string, quantity: number) {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(item => item.product.id === productId);
    if (item && quantity > 0) {
      item.quantity = quantity;
      this.cartItems.next([...currentItems]);
      this.saveCart();
      this.updateCount();
    } else if (item && quantity === 0) {
      this.removeFromCart(productId);
    }
  }

  clearCart() {
    this.cartItems.next([]);
    this.saveCart();
    this.updateCount();
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce((acc, item) => {
      const price = item.product.priceRaw || 0;
      return acc + (price * item.quantity);
    }, 0);
  }

  getCartTotalFormatted(): string {
    return new Intl.NumberFormat('pt-AO').format(this.getCartTotal()) + ' Kz';
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

  private saveCart() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('ondjila_cart', JSON.stringify(this.cartItems.value));
    }
  }

  private loadCart(): CartItem[] {
    try {
      if (typeof localStorage === 'undefined') return [];
      const stored = localStorage.getItem('ondjila_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}
