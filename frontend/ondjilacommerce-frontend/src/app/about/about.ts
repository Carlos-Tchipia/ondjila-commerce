import { RouterLink } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [RouterLink, CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  cartService = inject(CartService);
}
