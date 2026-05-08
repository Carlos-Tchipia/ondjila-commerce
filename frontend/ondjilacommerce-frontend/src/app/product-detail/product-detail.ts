import { RouterLink, ActivatedRoute } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { ProductService, Product } from '../services/product/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  cartService = inject(CartService);
  productService = inject(ProductService);
  route = inject(ActivatedRoute);

  product?: Product;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.productService.getProductById(id).subscribe(p => {
          this.product = p;
        });
      }
    });
  }
}
