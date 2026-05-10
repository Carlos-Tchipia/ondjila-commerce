import { RouterLink, ActivatedRoute } from '@angular/router';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { ProductService, Product } from '../services/product/product.service';
import { SearchService } from '../services/search/search.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  cartService = inject(CartService);
  searchService = inject(SearchService);
  private cdr = inject(ChangeDetectorRef);
  userService = inject(UserService);

  product: Product | undefined;
  isLoading = true;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const slug = params['slug'];
      console.log('[ProductDetail] Procurando por slug:', slug);
      if (slug) {
        this.isLoading = true;
        this.productService.getProductBySlug(slug).subscribe({
          next: (p) => {
            console.log('[ProductDetail] Produto recebido:', p);
            this.product = p;
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('[ProductDetail] Erro ao carregar produto:', err);
            this.isLoading = false;
            this.cdr.detectChanges();
          }
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
}
