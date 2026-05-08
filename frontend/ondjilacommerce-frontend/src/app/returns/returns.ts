import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-returns',
  imports: [CommonModule],
  templateUrl: './returns.html',
  styleUrl: './returns.scss',
})
export class Returns {
  cartService = inject(CartService);
}
