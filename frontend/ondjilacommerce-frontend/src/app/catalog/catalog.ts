import { RouterLink } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { ProductService, Product } from '../services/product/product.service';
import { SearchService } from '../services/search/search.service';
import { UserService } from '../services/user/user.service';
import { CurrencyService } from '../services/currency/currency.service';
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
  currencyService = inject(CurrencyService);

  private categoryFilterSubject = new BehaviorSubject<string>('');
  private sortSubject = new BehaviorSubject<string>('featured');
  private currencySubject = new BehaviorSubject<string>('AOA');

  categories = ['Smartphones', 'Laptops', 'Auscultadores', 'Smartwatches', 'Tablets', 'Câmeras'];
  currencies = ['AOA', 'USD', 'EUR'];

  products$: Observable<Product[]> = combineLatest([
    this.categoryFilterSubject,
    this.sortSubject,
    this.searchService.searchQuery$.pipe(startWith('')),
    this.currencySubject
  ]).pipe(
    switchMap(([category, sort, search, currency]) =>
      this.productService.getProducts({ category, sort, search }).pipe(
        switchMap(products =>
          this.currencyService.convert(1, 'AOA', currency).pipe(
            map(conversion => products.map(product => this.withDisplayCurrency(product, currency, conversion.rate)))
          )
        )
      )
    )
  );

  ngOnInit() {}

  setCategory(category: string) {
    this.categoryFilterSubject.next(category);
  }

  setSort(sort: string) {
    this.sortSubject.next(sort);
  }

  setCurrency(currency: string) {
    this.currencySubject.next(currency);
  }

  getActiveCategory(): string {
    return this.categoryFilterSubject.value;
  }

  getActiveCurrency(): string {
    return this.currencySubject.value;
  }

  private withDisplayCurrency(product: Product, currency: string, rate: number): Product {
    if (currency === 'AOA' || !product.priceRaw) {
      return product;
    }

    const value = product.priceRaw * rate;
    return {
      ...product,
      price: new Intl.NumberFormat('pt-AO', {
        style: 'currency',
        currency,
        maximumFractionDigits: 2
      }).format(value)
    };
  }
}
