import { RouterLink } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  imports: [RouterLink, CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  cartService = inject(CartService);
}
