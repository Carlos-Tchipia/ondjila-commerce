import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Product {
  id: string;
  name: string;
  slug?: string;
  price: string;        // formatado "450.000 Kz" (para compatibilidade com o frontend)
  priceRaw?: number;    // valor numérico vindo da API
  original_price?: number;
  discount?: number;
  category: string;
  brand?: string;
  description: string;
  image: string;
  image_url?: string;
  thumbnails: string[];
  rating?: number;
  reviews_count?: number;
  stock?: number;
  is_featured?: boolean;
  specs?: { label: string; value: string }[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface ProductListResponse {
  items: any[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

const API_URL = 'http://localhost/ondjila-commerce/backend/api';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  getProducts(filters?: {
    category?: string;
    search?: string;
    brand?: string;
    sort?: string;
    page?: number;
    limit?: number;
    featured?: boolean;
  }): Observable<Product[]> {
    let params = new HttpParams();
    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.search)   params = params.set('search', filters.search);
    if (filters?.brand)    params = params.set('brand', filters.brand);
    if (filters?.sort)     params = params.set('sort', filters.sort);
    if (filters?.page)     params = params.set('page', filters.page.toString());
    if (filters?.limit)    params = params.set('limit', filters.limit.toString());
    if (filters?.featured) params = params.set('featured', '1');

    return this.http.get<ApiResponse<ProductListResponse>>(`${API_URL}/products`, { params }).pipe(
      map(res => res.data.items.map(p => this.normalize(p))),
      catchError(err => {
        console.warn('[ProductService] API indisponível — usando dados locais.', err);
        return of(this.getFallbackProducts());
      })
    );
  }

  getProductById(id: string): Observable<Product | undefined> {
    const numericId = parseInt(id, 10);
    if (!isNaN(numericId)) {
      return this.http.get<ApiResponse<any>>(`${API_URL}/products/${numericId}`).pipe(
        map(res => res.success ? this.normalize(res.data) : undefined),
        catchError(() => of(this.getFallbackProducts().find(p => p.id === id)))
      );
    }
    return of(this.getFallbackProducts().find(p => p.id === id));
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    return this.http.get<ApiResponse<any>>(`${API_URL}/products?slug=${slug}`).pipe(
      map(res => res.success ? this.normalize(res.data) : undefined),
      catchError(() => of(this.getFallbackProducts().find(p => p.slug === slug)))
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.getProducts({ featured: true, limit: 8 });
  }

  // ──────────────────────────────────────────────────────
  // Normalização: converte resposta da API para o formato
  // interno do frontend (mantém compatibilidade total)
  // ──────────────────────────────────────────────────────
  private normalize(p: any): Product {
    const priceFormatted = new Intl.NumberFormat('pt-AO').format(p.price) + ' Kz';
    return {
      id:             String(p.id),
      name:           p.name,
      slug:           p.slug,
      price:          priceFormatted,
      priceRaw:       p.price,
      original_price: p.original_price,
      discount:       p.discount,
      category:       p.category,
      brand:          p.brand,
      description:    p.description,
      image:          p.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      image_url:      p.image_url,
      thumbnails:     p.image_url ? [p.image_url] : [],
      rating:         p.rating,
      reviews_count:  p.reviews_count,
      stock:          p.stock,
      is_featured:    p.is_featured,
      specs:          [],
    };
  }

  // ──────────────────────────────────────────────────────
  // Fallback local — mantém o site funcional se a API
  // estiver temporariamente offline
  // ──────────────────────────────────────────────────────
  private getFallbackProducts(): Product[] {
    return [
      {
        id: '1', name: 'Apple iPhone 15 Pro Max 256GB', price: '749.000 Kz', priceRaw: 749000,
        category: 'Smartphones', brand: 'Apple', description: 'O iPhone mais avançado da Apple com chip A17 Pro e câmera de 48MP.',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800', thumbnails: [], rating: 4.8, stock: 15, is_featured: true
      },
      {
        id: '2', name: 'Samsung Galaxy S24 Ultra 512GB', price: '689.000 Kz', priceRaw: 689000,
        category: 'Smartphones', brand: 'Samsung', description: 'Galaxy com S Pen, câmera de 200MP e IA integrada.',
        image: 'https://images.unsplash.com/photo-1706184526866-3e24c8fa7c47?w=800', thumbnails: [], rating: 4.7, stock: 12, is_featured: true
      },
      {
        id: '7', name: 'Apple MacBook Pro 14" M3 Pro', price: '1.450.000 Kz', priceRaw: 1450000,
        category: 'Laptops', brand: 'Apple', description: 'MacBook Pro com chip M3 Pro e bateria de 18 horas.',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', thumbnails: [], rating: 4.9, stock: 8, is_featured: true
      },
      {
        id: '11', name: 'Apple AirPods Pro 2ª Geração', price: '145.000 Kz', priceRaw: 145000,
        category: 'Auscultadores', brand: 'Apple', description: 'Cancelamento de ruído adaptativo com chip H2.',
        image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800', thumbnails: [], rating: 4.7, stock: 35, is_featured: true
      },
      {
        id: '12', name: 'Sony WH-1000XM5', price: '129.000 Kz', priceRaw: 129000,
        category: 'Auscultadores', brand: 'Sony', description: '8 microfones e o melhor ANC do mercado. 30h de bateria.',
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800', thumbnails: [], rating: 4.8, stock: 22, is_featured: true
      },
      {
        id: '10', name: 'Apple Watch Ultra 2 49mm', price: '489.000 Kz', priceRaw: 489000,
        category: 'Smartwatches', brand: 'Apple', description: 'O smartwatch mais robusto e avançado da Apple.',
        image: 'https://images.unsplash.com/photo-1694959937341-6e7ad20b31ef?w=800', thumbnails: [], rating: 4.8, stock: 10, is_featured: true
      },
    ];
  }
}
