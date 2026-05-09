import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-success',
  imports: [RouterLink, CommonModule],
  template: `
    <div class="min-h-screen bg-background flex flex-col items-center justify-center p-gutter text-center font-body-main">
      <div class="w-20 h-20 bg-primary-container text-white rounded-full flex items-center justify-center mb-xl gold-shadow animate-bounce">
        <span class="material-symbols-outlined text-[48px]" translate="no">check_circle</span>
      </div>
      <h1 class="font-hero-title text-hero-title text-on-surface mb-md">Pedido Recebido!</h1>
      <p class="text-on-surface-variant max-w-[400px] mb-xl leading-relaxed">
        O seu pedido foi processado com sucesso. Receberá um e-mail de confirmação com os detalhes da entrega em instantes.
      </p>
      <div class="flex gap-md">
        <button class="bg-primary-container text-white px-xl py-md font-label-caps uppercase tracking-widest hover:bg-[#A87A09] transition-all" routerLink="/catalog">Continuar Compras</button>
        <button class="border border-on-surface px-xl py-md font-label-caps uppercase tracking-widest hover:bg-on-surface hover:text-white transition-all" routerLink="/customer-account">Ver Meus Pedidos</button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class OrderSuccess {}
