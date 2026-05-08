import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  cartService = inject(CartService);
}
