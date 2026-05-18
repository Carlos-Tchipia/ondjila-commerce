import { ActivatedRoute, RouterLink } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { ProductService, Product } from '../services/product/product.service';
import { SearchService } from '../services/search/search.service';
import { UserService } from '../services/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { combineLatest, map } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../services/theme/theme.service';

@Component({
  selector: 'app-categories',
  imports: [RouterLink, CommonModule, FormsModule, TranslateModule],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnInit {
  cartService = inject(CartService);
  productService = inject(ProductService);
  searchService = inject(SearchService);
  userService = inject(UserService);
  translate = inject(TranslateService);
  themeService = inject(ThemeService);
  private route = inject(ActivatedRoute);

  products: Product[] = [];
  filteredProducts: Product[] = [];
  
  selectedCategory: string = 'Todos';
  searchQuery: string = '';

  categories = ['Todos', 'Smartphones', 'Laptops', 'Smartwatches', 'Auscultadores', 'Tablets', 'Cameras'];

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const category = params.get('category');
      if (category && this.categories.includes(category)) {
        this.selectCategory(category);
      }
    });

    this.loadProducts();
    this.searchService.searchQuery$.subscribe(query => {
      this.searchQuery = query;
      this.filteredProducts = this.filterProducts(this.products, query, this.selectedCategory);
    });
  }

  loadProducts() {
    // Aumentamos o limite para garantir que todos os produtos sejam carregados para o filtro local
    // ou poderíamos usar filtros de servidor. Para este SPA, 100 produtos é razoável.
    this.productService.getProducts({ limit: 100 }).subscribe(products => {
      this.products = products;
      this.filteredProducts = this.filterProducts(products, this.searchQuery, this.selectedCategory);
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filteredProducts = this.filterProducts(this.products, this.searchQuery, category);
  }

  private filterProducts(products: Product[], query: string, category: string): Product[] {
    return products.filter(p => {
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) || 
                           p.category.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category.toLowerCase() === 'todos' || 
                               p.category.toLowerCase() === category.toLowerCase();
      return matchesQuery && matchesCategory;
    });
  }

  onSearch(event: any) {
    const query = event.target.value;
    this.searchService.setSearchQuery(query);
  }

  logout() {
    this.userService.logout();
  }

  toggleLanguage() {
    const currentLang = this.translate.currentLang;
    this.translate.use(currentLang === 'pt' ? 'en' : 'pt');
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
