import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-promotions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div>
        <h2 class="text-3xl font-black text-[#1A1814] tracking-tight">Promoções</h2>
        <p class="text-gray-500 text-sm mt-1">Gere campanhas de marketing e descontos.</p>
      </div>

      <div class="bg-white p-12 rounded-2xl border border-[#E8E4DC] gold-shadow flex flex-col items-center justify-center text-center">
        <div class="p-6 bg-[#C8960C]/5 rounded-full mb-6">
          <span class="material-symbols-outlined text-5xl text-[#C8960C]" translate="no">loyalty</span>
        </div>
        <h3 class="text-xl font-bold text-[#1A1814] mb-2">Sistema de Promoções</h3>
        <p class="text-gray-500 max-w-md mx-auto text-sm">
          Esta funcionalidade está a ser preparada. Em breve poderá criar cupões e descontos sazonais diretamente aqui.
        </p>
        <button class="mt-8 px-8 py-3 bg-[#1A1814] text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-black transition-all">
          Notificar quando estiver pronto
        </button>
      </div>
    </div>
  `
})
export class AdminPromotions {}
