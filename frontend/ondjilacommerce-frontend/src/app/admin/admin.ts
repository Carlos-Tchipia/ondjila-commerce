import { RouterLink } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [RouterLink, CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  cartService = inject(CartService);


}
