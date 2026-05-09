import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { UserService } from '../services/user/user.service';

/**
 * AuthGuard — Protege rotas que requerem autenticação.
 * Redireciona para /login se o utilizador não estiver autenticado.
 */
export const authGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
