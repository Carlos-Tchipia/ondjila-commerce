import { RouterLink } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { SearchService } from '../services/search/search.service';
import { UserService } from '../services/user/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  cartService = inject(CartService);
  searchService = inject(SearchService);
  userService = inject(UserService);

  removeFromCart(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: string, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  onSearch(event: any) {
    const query = event.target.value;
    this.searchService.setSearchQuery(query);
  }

  logout() {
    this.userService.logout();
  }
}
