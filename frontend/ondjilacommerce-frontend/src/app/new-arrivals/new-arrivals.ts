import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { ProductService, Product } from '../services/product/product.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-arrivals',
  imports: [CommonModule, RouterLink],
  templateUrl: './new-arrivals.html',
  styleUrl: './new-arrivals.scss',
})
export class NewArrivals implements OnInit {
  cartService = inject(CartService);
  productService = inject(ProductService);
  
  products$: Observable<Product[]> | undefined;

  ngOnInit() {
    // Carregar apenas os mais recentes
    this.products$ = this.productService.getProducts({ limit: 12, sort: 'newest' });
  }
}
