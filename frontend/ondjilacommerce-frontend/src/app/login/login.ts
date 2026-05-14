import { RouterLink, Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart/cart';
import { UserService } from '../services/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, timeout } from 'rxjs/operators';
import { apiErrorMessage } from '../shared/api-feedback';

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
    this.successMessage = '';

    const obs = this.isLoginMode
      ? this.userService.login(this.email, this.password)
      : this.userService.register({
          name: this.name,
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation
        });

    obs.pipe(
      timeout(15000),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/']);
          return;
        }

        this.errorMessage = this.isLoginMode
          ? 'Email ou palavra-passe incorretos.'
          : 'Nao foi possivel criar a conta. Verifique os dados.';
      },
      error: (err) => {
        this.errorMessage = apiErrorMessage(
          err,
          this.isLoginMode
            ? 'Email ou palavra-passe incorretos.'
            : 'Falha ao criar conta. Verifique os dados.'
        );
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

    this.userService.forgotPassword(this.email).pipe(
      timeout(15000),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res) => {
        this.successMessage = res.data?.message || 'E-mail de recuperacao enviado com sucesso.';
      },
      error: (err) => {
        this.errorMessage = apiErrorMessage(err, 'Erro ao enviar e-mail. Tente novamente.');
      }
    });
  }
}
