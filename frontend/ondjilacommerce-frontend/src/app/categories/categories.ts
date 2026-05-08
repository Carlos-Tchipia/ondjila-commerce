import { RouterLink } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { ProductService, Product } from '../services/product/product.service';
import { SearchService } from '../services/search/search.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-categories',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnInit {
  cartService = inject(CartService);
  productService = inject(ProductService);
  searchService = inject(SearchService);
  userService = inject(UserService);

  products: Product[] = [];
  filteredProducts: Product[] = [];
  
  selectedCategory: string = 'Todos';
  searchQuery: string = '';

  categories = ['Todos', 'SÉRIE GOLD', 'ÁUDIO PREMIUM', 'ULTRA-BOOK', 'WEARABLES', 'FOTOGRAFIA', 'JOALHARIA'];

  ngOnInit() {
    combineLatest([
      this.productService.getProducts(),
      this.searchService.searchQuery$
    ]).pipe(
      map(([products, query]) => {
        this.products = products;
        this.searchQuery = query;
        return this.filterProducts(products, query, this.selectedCategory);
      })
    ).subscribe(filtered => {
      this.filteredProducts = filtered;
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
      const matchesCategory = category === 'Todos' || p.category === category;
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
}
