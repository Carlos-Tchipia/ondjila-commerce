import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-best-sellers',
  imports: [CommonModule],
  templateUrl: './best-sellers.html',
  styleUrl: './best-sellers.scss',
})
export class BestSellers {
  cartService = inject(CartService);
}
