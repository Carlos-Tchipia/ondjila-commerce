import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal(typeof window !== 'undefined' ? localStorage.getItem('theme') === 'dark' : false);

  constructor() {
    if (typeof window !== 'undefined') {
      this.applyTheme();
    }
  }

  toggleTheme() {
    this.isDarkMode.set(!this.isDarkMode());
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
      this.applyTheme();
    }
  }

  private applyTheme() {
    if (typeof window !== 'undefined') {
      if (this.isDarkMode()) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
}
