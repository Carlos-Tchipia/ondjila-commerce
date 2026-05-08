import { RouterLink, ActivatedRoute } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { ProductService, Product } from '../services/product/product.service';
import { SearchService } from '../services/search/search.service';
import { UserService } from '../services/user/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  cartService = inject(CartService);
  searchService = inject(SearchService);
  userService = inject(UserService);

  product: Product | undefined;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.productService.getProductById(id).subscribe((p) => {
          this.product = p;
        });
      }
    });
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product);
    }
  }

  onSearch(event: any) {
    const query = event.target.value;
    this.searchService.setSearchQuery(query);
  }

  logout() {
    this.userService.logout();
  }
}
