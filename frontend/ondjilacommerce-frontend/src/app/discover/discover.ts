import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-discover',
  imports: [CommonModule],
  templateUrl: './discover.html',
  styleUrl: './discover.scss',
})
export class Discover {
  cartService = inject(CartService);
}
