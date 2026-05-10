import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { ProductService, Product } from '../services/product/product.service';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './category-detail.html',
  styleUrl: './category-detail.scss',
})
export class CategoryDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  cartService = inject(CartService);
  
  products$: Observable<Product[]> | undefined;
  categoryName: string = '';

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.categoryName = params['id']; // O parâmetro na rota é :id mas representa o nome da categoria
      if (this.categoryName) {
        this.products$ = this.productService.getProducts({ category: this.categoryName });
      }
    });
  }
}
