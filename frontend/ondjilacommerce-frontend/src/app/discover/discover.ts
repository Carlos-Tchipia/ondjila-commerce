import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart/cart';

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './discover.html',
  styleUrl: './discover.scss',
})
export class Discover {
  cartService = inject(CartService);
}
