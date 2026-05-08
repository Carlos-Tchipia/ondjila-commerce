import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart/cart';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ondjilacommerce-frontend');
  cartService = inject(CartService);
  isChatOpen = signal(false);

  toggleChat() {
    this.isChatOpen.set(!this.isChatOpen());
  }
}
