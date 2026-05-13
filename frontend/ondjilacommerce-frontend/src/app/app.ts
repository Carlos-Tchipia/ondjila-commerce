import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart/cart';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ondjilacommerce-frontend');
  cartService = inject(CartService);
  translate = inject(TranslateService);

  constructor() {
    this.translate.addLangs(['pt', 'en']);
    this.translate.setDefaultLang('pt');
    
    const browserLang = this.translate.getBrowserLang() || 'pt';
    this.translate.use(browserLang.match(/pt|en/) ? browserLang : 'pt');
  }
  isChatOpen = signal(false);

  toggleChat() {
    this.isChatOpen.set(!this.isChatOpen());
  }
}
