import { RouterLink, Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { UserService } from '../services/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  cartService = inject(CartService);
  userService = inject(UserService);
  router = inject(Router);

  isLoginMode = true;
  email = '';

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    this.userService.login(this.email || 'user@ondjila.com');
    this.router.navigate(['/']);
  }
}
