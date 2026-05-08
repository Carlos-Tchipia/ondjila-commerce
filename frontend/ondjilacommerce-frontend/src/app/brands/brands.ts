import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brands',
  imports: [CommonModule],
  templateUrl: './brands.html',
  styleUrl: './brands.scss',
})
export class Brands {
  cartService = inject(CartService);
}
