import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-help-center',
  imports: [CommonModule],
  templateUrl: './help-center.html',
  styleUrl: './help-center.scss',
})
export class HelpCenter {
  cartService = inject(CartService);
}
