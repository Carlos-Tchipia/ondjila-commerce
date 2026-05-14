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
      <div>
        <h2 class="text-3xl font-black text-[#1A1814] tracking-tight">Relatorios</h2>
        <p class="text-gray-500 text-sm mt-1">Exportacao de dados oficiais em CSV e PDF.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-8 rounded-2xl border border-[#E8E4DC] gold-shadow flex flex-col items-center text-center space-y-4 hover:border-[#C8960C] transition-all cursor-pointer group">
          <div class="p-4 bg-[#C8960C]/10 rounded-full group-hover:bg-[#C8960C] group-hover:text-white transition-all text-[#C8960C]">
            <span class="material-symbols-outlined text-3xl" translate="no">analytics</span>
          </div>
          <h3 class="font-black text-sm uppercase tracking-widest text-[#1A1814]">Vendas por Periodo</h3>
          <p class="text-xs text-gray-500">Resumo financeiro detalhado.</p>
          <div class="flex gap-2 w-full pt-4">
            <button (click)="downloadCsv('sales')" class="flex-grow py-2 bg-gray-100 hover:bg-[#C8960C] hover:text-white text-gray-700 text-[9px] font-black uppercase tracking-widest rounded transition-colors">CSV</button>
            <button (click)="downloadPdf('sales')" class="flex-grow py-2 bg-gray-100 hover:bg-[#C8960C] hover:text-white text-gray-700 text-[9px] font-black uppercase tracking-widest rounded transition-colors">PDF</button>
          </div>
        </div>

        <div class="bg-white p-8 rounded-2xl border border-[#E8E4DC] gold-shadow flex flex-col items-center text-center space-y-4 hover:border-[#C8960C] transition-all cursor-pointer group">
          <div class="p-4 bg-blue-50 rounded-full group-hover:bg-blue-500 group-hover:text-white transition-all text-blue-500">
            <span class="material-symbols-outlined text-3xl" translate="no">inventory_2</span>
          </div>
          <h3 class="font-black text-sm uppercase tracking-widest text-[#1A1814]">Produtos Mais Vendidos</h3>
          <p class="text-xs text-gray-500">Ranking de performance de itens.</p>
          <div class="flex gap-2 w-full pt-4">
            <button (click)="downloadCsv('products')" class="flex-grow py-2 bg-gray-100 hover:bg-blue-500 hover:text-white text-gray-700 text-[9px] font-black uppercase tracking-widest rounded transition-colors">CSV</button>
            <button (click)="downloadPdf('products')" class="flex-grow py-2 bg-gray-100 hover:bg-blue-500 hover:text-white text-gray-700 text-[9px] font-black uppercase tracking-widest rounded transition-colors">PDF</button>
          </div>
        </div>

        <div class="bg-white p-8 rounded-2xl border border-[#E8E4DC] gold-shadow flex flex-col items-center text-center space-y-4 hover:border-[#C8960C] transition-all cursor-pointer group">
          <div class="p-4 bg-yellow-50 rounded-full group-hover:bg-yellow-500 group-hover:text-white transition-all text-yellow-500">
            <span class="material-symbols-outlined text-3xl" translate="no">inventory</span>
          </div>
          <h3 class="font-black text-sm uppercase tracking-widest text-[#1A1814]">Estado Atual de Stock</h3>
          <p class="text-xs text-gray-500">Auditoria completa de inventario.</p>
          <div class="flex gap-2 w-full pt-4">
            <button (click)="downloadCsv('products')" class="flex-grow py-2 bg-gray-100 hover:bg-yellow-500 hover:text-white text-gray-700 text-[9px] font-black uppercase tracking-widest rounded transition-colors">CSV</button>
            <button (click)="downloadPdf('products')" class="flex-grow py-2 bg-gray-100 hover:bg-yellow-500 hover:text-white text-gray-700 text-[9px] font-black uppercase tracking-widest rounded transition-colors">PDF</button>
          </div>
        </div>

        <div class="bg-white p-8 rounded-2xl border border-[#E8E4DC] gold-shadow flex flex-col items-center text-center space-y-4 hover:border-[#C8960C] transition-all cursor-pointer group">
          <div class="p-4 bg-purple-50 rounded-full group-hover:bg-purple-500 group-hover:text-white transition-all text-purple-500">
            <span class="material-symbols-outlined text-3xl" translate="no">group</span>
          </div>
          <h3 class="font-black text-sm uppercase tracking-widest text-[#1A1814]">Base de Clientes</h3>
          <p class="text-xs text-gray-500">Listagem de perfis e contactos.</p>
          <div class="flex gap-2 w-full pt-4">
            <button (click)="downloadCsv('customers')" class="flex-grow py-2 bg-gray-100 hover:bg-purple-500 hover:text-white text-gray-700 text-[9px] font-black uppercase tracking-widest rounded transition-colors">CSV</button>
            <button (click)="downloadPdf('customers')" class="flex-grow py-2 bg-gray-100 hover:bg-purple-500 hover:text-white text-gray-700 text-[9px] font-black uppercase tracking-widest rounded transition-colors">PDF</button>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-[#E8E4DC] gold-shadow p-8">
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-black text-xs uppercase tracking-[0.2em] text-[#1A1814]">Pre-visualizacao (Amostra)</h3>
          <div class="flex gap-4">
            <input type="date" class="bg-[#F5F2EC] px-4 py-2 rounded text-[10px] uppercase font-bold outline-none">
            <input type="date" class="bg-[#F5F2EC] px-4 py-2 rounded text-[10px] uppercase font-bold outline-none">
          </div>
        </div>
        <div class="bg-[#F9F8F6] rounded-xl p-12 text-center border border-dashed border-gray-300">
          <span class="material-symbols-outlined text-gray-300 text-5xl mb-4" translate="no">table_chart</span>
          <p class="text-sm text-gray-400 font-medium">Selecione um relatorio para gerar a pre-visualizacao dos dados.</p>
        </div>
      </div>
    </div>
  `
})
export class AdminReports {
  adminService = inject(AdminService);

  downloadCsv(type: string) {
    this.downloadReport(type, 'csv');
  }

  downloadPdf(type: string) {
    this.downloadReport(type, 'pdf');
  }

  private downloadReport(type: string, format: 'csv' | 'pdf') {
    this.adminService.downloadReport(type, format).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `relatorio_${type}_${new Date().toISOString().slice(0, 10)}.${format}`;
        link.click();
        URL.revokeObjectURL(url);
      },
      error: () => {
        alert('Nao foi possivel exportar o relatorio. Confirme a sessao de administrador.');
      }
    });
  }
}
