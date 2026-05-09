import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../services/user/user.service';

/**
 * AuthInterceptor — Adiciona automaticamente o Bearer Token JWT
 * a todas as chamadas HTTP para a API da ONDJILA.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  const token = userService.getToken();

  // Só adiciona o header se existir token e a chamada for para a nossa API
  if (token && req.url.includes('/api')) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }

  return next(req);
};
