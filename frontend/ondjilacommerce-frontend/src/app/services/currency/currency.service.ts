import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface CurrencyConversion {
  amount: number;
  rate: number;
  from: string;
  to: string;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private http = inject(HttpClient);

  convert(amount: number, from = 'AOA', to = 'USD'): Observable<CurrencyConversion> {
    if (from === to) {
      return of({ amount, rate: 1, from, to });
    }

    return this.http.get<{ success: boolean; data: CurrencyConversion }>(`${environment.apiUrl}/currency/convert`, {
      params: { amount, from, to }
    }).pipe(
      map(res => res.data),
      catchError(() => of({ amount, rate: 1, from, to: from }))
    );
  }
}
