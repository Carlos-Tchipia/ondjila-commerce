import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private router = inject(Router);
  private searchQuery = new BehaviorSubject<string>('');
  searchQuery$ = this.searchQuery.asObservable();

  setSearchQuery(query: string) {
    this.searchQuery.next(query);
    if (this.router.url !== '/categories' && query.length > 0) {
      this.router.navigate(['/categories']);
    }
  }
}
