import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.html',
})
export class ResetPassword implements OnInit {
  route = inject(ActivatedRoute);
  userService = inject(UserService);

  email = '';
  token = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.token = params['token'] || '';

      if (!this.email || !this.token) {
        this.errorMessage = 'Link de recuperação inválido ou incompleto.';
      }
    });
  }

  onSubmit() {
    if (!this.password || this.password.length < 6) {
      this.errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      return;
    }

    if (!this.email || !this.token) {
      this.errorMessage = 'Link de recuperação inválido.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    this.userService.resetPassword(this.email, this.token, this.password).subscribe({
      next: (res) => {
        this.successMessage = res.data?.message || 'Palavra-passe alterada com sucesso!';
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Ocorreu um erro. O link pode ter expirado.';
        this.isLoading = false;
      }
    });
  }
}
