import { RouterLink } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { ProductService, Product } from '../services/product/product.service';
import { SearchService } from '../services/search/search.service';
import { UserService } from '../services/user/user.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-catalog',
  imports: [RouterLink, CommonModule],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class Catalog implements OnInit {
  cartService = inject(CartService);
  productService = inject(ProductService);
  searchService = inject(SearchService);
  userService = inject(UserService);

  private categoryFilterSubject = new BehaviorSubject<string>('');
  private sortSubject = new BehaviorSubject<string>('featured');
  
  categories = ['Smartphones', 'Laptops', 'Áudio', 'Wearables', 'Tablets', 'Câmeras'];
  
  products$: Observable<Product[]> = combineLatest([
    this.categoryFilterSubject,
    this.sortSubject,
    this.searchService.searchQuery$.pipe(startWith(''))
  ]).pipe(
    switchMap(([category, sort, search]) => 
      this.productService.getProducts({ category, sort, search })
    )
  );

  ngOnInit() {}

  setCategory(category: string) {
    this.categoryFilterSubject.next(category);
  }

  setSort(sort: string) {
    this.sortSubject.next(sort);
  }

  getActiveCategory(): string {
    return this.categoryFilterSubject.value;
  }
}
