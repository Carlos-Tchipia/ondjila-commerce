import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { UserService } from '../services/user/user.service';

/**
 * AdminGuard — Protege rotas exclusivas para administradores.
 * Verifica se o utilizador está logado e se o seu papel (role) é 'admin'.
 */
export const adminGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);
  const user = userService.getCurrentUser();

  if (userService.isLoggedIn() && user?.role === 'admin') {
    return true;
  }

  // Redireciona para o login ou home se não for admin
  router.navigate(['/login']);
  return false;
};
