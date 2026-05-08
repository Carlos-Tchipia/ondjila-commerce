import { RouterLink } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  imports: [RouterLink, CommonModule],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
  cartService = inject(CartService);
}
