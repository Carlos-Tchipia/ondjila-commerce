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
  isRecoveryMode = false;
  name = '';
  email = '';
  password = '';
  password_confirmation = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.isRecoveryMode = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  toggleRecovery() {
    this.isRecoveryMode = !this.isRecoveryMode;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit() {
    if (this.isRecoveryMode) {
      this.forgotPassword();
      return;
    }

    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

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
        } else {
          this.errorMessage = 'Resposta da API sem sucesso.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erro de ligação ao servidor. Verifique se o XAMPP está ativo.';
        this.isLoading = false;
      }
    });
  }

  forgotPassword() {
    if (!this.email) {
      this.errorMessage = 'Por favor, introduza o seu e-mail.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.successMessage = res.data?.message || 'E-mail de recuperação enviado com sucesso.';
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erro ao enviar e-mail. Verifique a sua ligação.';
        this.isLoading = false;
      }
    });
  }
}
