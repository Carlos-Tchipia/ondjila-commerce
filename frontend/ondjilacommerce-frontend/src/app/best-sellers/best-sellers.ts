import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { ProductService, Product } from '../services/product/product.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-best-sellers',
  imports: [CommonModule, RouterLink],
  templateUrl: './best-sellers.html',
  styleUrl: './best-sellers.scss',
})
export class BestSellers implements OnInit {
  cartService = inject(CartService);
  productService = inject(ProductService);
  
  products$: Observable<Product[]> | undefined;

  ngOnInit() {
    // Carregar os mais populares (ordenados por rating por exemplo)
    this.products$ = this.productService.getProducts({ limit: 12, sort: 'rating' });
  }
}
