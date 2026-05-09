import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Catalog } from './catalog/catalog';
import { ProductDetail } from './product-detail/product-detail';
import { Checkout } from './checkout/checkout';
import { Admin } from './admin/admin';
import { Login } from './login/login';
import { CustomerAccount } from './customer-account/customer-account';
import { Cart } from './cart/cart';
import { OrderSuccess } from './order-success/order-success';
import { About } from './about/about';
import { Contact } from './contact/contact';
import { Register } from './register/register';
import { Discover } from './discover/discover';
import { NewArrivals } from './new-arrivals/new-arrivals';
import { BestSellers } from './best-sellers/best-sellers';
import { Categories } from './categories/categories';
import { Brands } from './brands/brands';
import { CategoryDetail } from './category-detail/category-detail';
import { HelpCenter } from './help-center/help-center';
import { ShippingDelivery } from './shipping-delivery/shipping-delivery';
import { Returns } from './returns/returns';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Rotas públicas
  { path: '',              component: Home },
  { path: 'catalog',       component: Catalog },
  { path: 'product/:id',   component: ProductDetail },
  { path: 'about',         component: About },
  { path: 'contact',       component: Contact },
  { path: 'login',         component: Login },
  { path: 'register',      component: Register },
  { path: 'discover',      component: Discover },
  { path: 'new-arrivals',  component: NewArrivals },
  { path: 'best-sellers',  component: BestSellers },
  { path: 'categories',    component: Categories },
  { path: 'brands',        component: Brands },
  { path: 'category/:id',  component: CategoryDetail },
  { path: 'help-center',   component: HelpCenter },
  { path: 'shipping-delivery', component: ShippingDelivery },
  { path: 'returns',       component: Returns },

  // Rotas protegidas (requerem login)
  { path: 'cart',             component: Cart,            canActivate: [authGuard] },
  { path: 'checkout',         component: Checkout,        canActivate: [authGuard] },
  { path: 'order-success',    component: OrderSuccess,    canActivate: [authGuard] },
  { path: 'customer-account', component: CustomerAccount, canActivate: [authGuard] },
  { path: 'admin',            component: Admin,           canActivate: [authGuard] },

  // Fallback
  { path: '**', redirectTo: '' }
];
