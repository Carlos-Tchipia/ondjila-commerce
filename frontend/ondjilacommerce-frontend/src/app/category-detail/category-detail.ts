import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-detail',
  imports: [CommonModule],
  templateUrl: './category-detail.html',
  styleUrl: './category-detail.scss',
})
export class CategoryDetail {
  cartService = inject(CartService);
}
