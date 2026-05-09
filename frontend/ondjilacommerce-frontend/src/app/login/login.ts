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
  name = '';
  email = '';
  password = '';
  password_confirmation = '';
  errorMessage = '';
  isLoading = false;

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    const obs = this.isLoginMode 
      ? this.userService.login(this.email, this.password)
      : this.userService.register({ 
          name: this.name, 
          email: this.email, 
          password: this.password, 
          password_confirmation: this.password_confirmation 
        });

    obs.subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/']);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Ocorreu um erro. Verifique os seus dados.';
        this.isLoading = false;
      }
    });
  }
}
