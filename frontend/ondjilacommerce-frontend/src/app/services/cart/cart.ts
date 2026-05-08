import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  private toastMessage = new BehaviorSubject<string | null>(null);
  toastMessage$ = this.toastMessage.asObservable();

  constructor() { }

  addToCart() {
    this.cartCount.next(this.cartCount.value + 1);
    this.showToast('✓ Produto adicionado ao carrinho');
  }

  private showToast(message: string) {
    this.toastMessage.next(message);
    setTimeout(() => {
      this.toastMessage.next(null);
    }, 3000);
  }
}
