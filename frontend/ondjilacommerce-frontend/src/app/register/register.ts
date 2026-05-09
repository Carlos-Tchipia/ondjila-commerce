import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { CartService } from '../services/cart/cart';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  userService = inject(UserService);
  cartService = inject(CartService);
  router = inject(Router);

  name = '';
  email = '';
  password = '';
  password_confirmation = '';
  
  isLoading = false;
  errorMessage = '';
  errors: any = {};

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.errors = {};

    const data = {
      name: this.name,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation
    };

    this.userService.register(data).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/']);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Falha ao criar conta. Verifique os dados.';
        this.errors = err.error?.data || {};
        this.isLoading = false;
      }
    });
  }
}
