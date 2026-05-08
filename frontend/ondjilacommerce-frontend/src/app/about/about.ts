import { RouterLink } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { SearchService } from '../services/search/search.service';
import { UserService } from '../services/user/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [RouterLink, CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  cartService = inject(CartService);
  searchService = inject(SearchService);
  userService = inject(UserService);

  onSearch(event: any) {
    const query = event.target.value;
    this.searchService.setSearchQuery(query);
  }

  logout() {
    this.userService.logout();
  }
}
