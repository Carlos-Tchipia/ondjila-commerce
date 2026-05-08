import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-account',
  imports: [CommonModule],
  templateUrl: './customer-account.html',
  styleUrl: './customer-account.scss',
})
export class CustomerAccount {
  cartService = inject(CartService);
}
