import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-arrivals',
  imports: [CommonModule],
  templateUrl: './new-arrivals.html',
  styleUrl: './new-arrivals.scss',
})
export class NewArrivals {
  cartService = inject(CartService);
}
