import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Catalog } from './catalog/catalog';
import { ProductDetail } from './product-detail/product-detail';
import { Checkout } from './checkout/checkout';
import { Admin } from './admin/admin';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'catalog', component: Catalog },
  { path: 'product', component: ProductDetail },
  { path: 'checkout', component: Checkout },
  { path: 'admin', component: Admin },
];
