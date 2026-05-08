import { RouterLink } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalog',
  imports: [RouterLink, CommonModule],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class Catalog {
  cartService = inject(CartService);


}
