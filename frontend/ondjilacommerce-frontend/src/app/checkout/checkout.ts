import { RouterLink } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  cartService = inject(CartService);


}
