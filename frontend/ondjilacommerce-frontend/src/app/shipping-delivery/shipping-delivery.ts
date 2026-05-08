import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shipping-delivery',
  imports: [CommonModule],
  templateUrl: './shipping-delivery.html',
  styleUrl: './shipping-delivery.scss',
})
export class ShippingDelivery {
  cartService = inject(CartService);
}
