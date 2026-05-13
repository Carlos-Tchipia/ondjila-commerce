import { RouterLink } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { SearchService } from '../services/search/search.service';
import { UserService } from '../services/user/user.service';
import { ThemeService } from '../services/theme/theme.service';
import { ProductService } from '../services/product/product.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, TranslateModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  cartService = inject(CartService);
  searchService = inject(SearchService);
  userService = inject(UserService);
  themeService = inject(ThemeService);
  productService = inject(ProductService);
  translate = inject(TranslateService);

  featuredProducts$ = this.productService.getFeaturedProducts();

  onSearch(event: any) {
    const query = event.target.value;
    this.searchService.setSearchQuery(query);
  }

  logout() {
    this.userService.logout();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleLanguage() {
    const currentLang = this.translate.currentLang;
    this.translate.use(currentLang === 'pt' ? 'en' : 'pt');
  }
}
