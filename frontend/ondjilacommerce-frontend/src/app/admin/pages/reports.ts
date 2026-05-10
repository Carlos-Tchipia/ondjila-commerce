import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin/admin.service';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8 animate-fade-in">
      
      <!-- Cabeçalho -->
      <div>
        <h2 class="text-3xl font-black text-[#1A1814] tracking-tight">Relatórios</h2>
        <p class="text-gray-500 text-sm mt-1">Exportação de dados oficiais em CSV e PDF.</p>
      </div>

      <!-- Seleção de Relatório -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Relatório de Vendas -->
        <div class="bg-white p-8 rounded-2xl border border-[#E8E4DC] gold-shadow flex flex-col items-center text-center space-y-4 hover:border-[#C8960C] transition-all cursor-pointer group">
          <div class="p-4 bg-[#C8960C]/10 rounded-full group-hover:bg-[#C8960C] group-hover:text-white transition-all text-[#C8960C]">
            <span class="material-symbols-outlined text-3xl" translate="no">analytics</span>
          </div>
          <h3 class="font-black text-sm uppercase tracking-widest text-[#1A1814]">Vendas por Período</h3>
          <p class="text-xs text-gray-500">Resumo financeiro detalhado.</p>
          <div class="flex gap-2 w-full pt-4">
            <button class="flex-grow py-2 bg-gray-100 hover:bg-gray-200 text-[9px] font-black uppercase tracking-widest rounded transition-colors">CSV</button>
            <button class="flex-grow py-2 bg-gray-100 hover:bg-gray-200 text-[9px] font-black uppercase tracking-widest rounded transition-colors">PDF</button>
          </div>
        </div>

        <!-- Relatório de Produtos -->
        <div class="bg-white p-8 rounded-2xl border border-[#E8E4DC] gold-shadow flex flex-col items-center text-center space-y-4 hover:border-[#C8960C] transition-all cursor-pointer group">
          <div class="p-4 bg-blue-50 rounded-full group-hover:bg-blue-500 group-hover:text-white transition-all text-blue-500">
            <span class="material-symbols-outlined text-3xl" translate="no">inventory_2</span>
          </div>
          <h3 class="font-black text-sm uppercase tracking-widest text-[#1A1814]">Produtos Mais Vendidos</h3>
          <p class="text-xs text-gray-500">Ranking de performance de itens.</p>
          <div class="flex gap-2 w-full pt-4">
            <button class="flex-grow py-2 bg-gray-100 hover:bg-gray-200 text-[9px] font-black uppercase tracking-widest rounded transition-colors">CSV</button>
            <button class="flex-grow py-2 bg-gray-100 hover:bg-gray-200 text-[9px] font-black uppercase tracking-widest rounded transition-colors">PDF</button>
          </div>
        </div>

        <!-- Relatório de Stock -->
        <div class="bg-white p-8 rounded-2xl border border-[#E8E4DC] gold-shadow flex flex-col items-center text-center space-y-4 hover:border-[#C8960C] transition-all cursor-pointer group">
          <div class="p-4 bg-yellow-50 rounded-full group-hover:bg-yellow-500 group-hover:text-white transition-all text-yellow-500">
            <span class="material-symbols-outlined text-3xl" translate="no">inventory</span>
          </div>
          <h3 class="font-black text-sm uppercase tracking-widest text-[#1A1814]">Estado Atual de Stock</h3>
          <p class="text-xs text-gray-500">Auditoria completa de inventário.</p>
          <div class="flex gap-2 w-full pt-4">
            <button class="flex-grow py-2 bg-gray-100 hover:bg-gray-200 text-[9px] font-black uppercase tracking-widest rounded transition-colors">CSV</button>
            <button class="flex-grow py-2 bg-gray-100 hover:bg-gray-200 text-[9px] font-black uppercase tracking-widest rounded transition-colors">PDF</button>
          </div>
        </div>

        <!-- Relatório de Clientes -->
        <div class="bg-white p-8 rounded-2xl border border-[#E8E4DC] gold-shadow flex flex-col items-center text-center space-y-4 hover:border-[#C8960C] transition-all cursor-pointer group">
          <div class="p-4 bg-purple-50 rounded-full group-hover:bg-purple-500 group-hover:text-white transition-all text-purple-500">
            <span class="material-symbols-outlined text-3xl" translate="no">group</span>
          </div>
          <h3 class="font-black text-sm uppercase tracking-widest text-[#1A1814]">Base de Clientes</h3>
          <p class="text-xs text-gray-500">Listagem de perfis e contactos.</p>
          <div class="flex gap-2 w-full pt-4">
            <button class="flex-grow py-2 bg-gray-100 hover:bg-gray-200 text-[9px] font-black uppercase tracking-widest rounded transition-colors">CSV</button>
            <button class="flex-grow py-2 bg-gray-100 hover:bg-gray-200 text-[9px] font-black uppercase tracking-widest rounded transition-colors">PDF</button>
          </div>
        </div>

      </div>

      <!-- Preview de Dados -->
      <div class="bg-white rounded-2xl border border-[#E8E4DC] gold-shadow p-8">
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-black text-xs uppercase tracking-[0.2em] text-[#1A1814]">Pré-visualização (Amostra)</h3>
          <div class="flex gap-4">
            <input type="date" class="bg-[#F5F2EC] px-4 py-2 rounded text-[10px] uppercase font-bold outline-none">
            <input type="date" class="bg-[#F5F2EC] px-4 py-2 rounded text-[10px] uppercase font-bold outline-none">
          </div>
        </div>
        <div class="bg-[#F9F8F6] rounded-xl p-12 text-center border border-dashed border-gray-300">
          <span class="material-symbols-outlined text-gray-300 text-5xl mb-4" translate="no">table_chart</span>
          <p class="text-sm text-gray-400 font-medium">Selecione um relatório para gerar a pré-visualização dos dados.</p>
        </div>
      </div>

    </div>
  `
})
export class AdminReports {}
