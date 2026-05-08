import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-success',
  imports: [CommonModule],
  templateUrl: './order-success.html',
  styleUrl: './order-success.scss',
})
export class OrderSuccess {
  cartService = inject(CartService);
}
