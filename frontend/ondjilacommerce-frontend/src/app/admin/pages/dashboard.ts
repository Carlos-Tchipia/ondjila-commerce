import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin/admin.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-8 animate-fade-in">
      
      <!-- Cabeçalho da Página -->
      <div class="flex justify-between items-end">
        <div>
          <h2 class="text-3xl font-black text-[#1A1814] tracking-tight">Dashboard</h2>
          <p class="text-gray-500 text-sm mt-1">Visão geral do desempenho da Ondjilacommerce.</p>
        </div>
        <div class="flex gap-3">
          <button (click)="loadStats()" class="px-4 py-2 bg-white border border-[#E8E4DC] rounded text-[11px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center gap-2">
            <span class="material-symbols-outlined text-sm" translate="no">refresh</span>
            Atualizar Dados
          </button>
        </div>
      </div>

      <!-- Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Vendas -->
        <div class="bg-white p-6 rounded-xl border border-[#E8E4DC] gold-shadow">
          <div class="flex justify-between items-start mb-4">
            <div class="p-2 bg-[#C8960C]/10 rounded-lg">
              <span class="material-symbols-outlined text-[#C8960C]" translate="no">payments</span>
            </div>
            <span class="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
          </div>
          <p class="text-gray-500 text-xs uppercase tracking-widest font-bold">Vendas do Mês</p>
          <h3 class="text-2xl font-black mt-1 text-[#1A1814]">{{ formatPrice(stats?.metrics?.monthly_sales || 0) }}</h3>
        </div>

        <!-- Pedidos -->
        <div class="bg-white p-6 rounded-xl border border-[#E8E4DC] gold-shadow">
          <div class="flex justify-between items-start mb-4">
            <div class="p-2 bg-blue-50 rounded-lg">
              <span class="material-symbols-outlined text-blue-500" translate="no">shopping_cart</span>
            </div>
          </div>
          <p class="text-gray-500 text-xs uppercase tracking-widest font-bold">Pedidos Hoje</p>
          <h3 class="text-2xl font-black mt-1 text-[#1A1814]">{{ stats?.metrics?.orders_today || 0 }}</h3>
        </div>

        <!-- Clientes -->
        <div class="bg-white p-6 rounded-xl border border-[#E8E4DC] gold-shadow">
          <div class="flex justify-between items-start mb-4">
            <div class="p-2 bg-purple-50 rounded-lg">
              <span class="material-symbols-outlined text-purple-500" translate="no">person_add</span>
            </div>
          </div>
          <p class="text-gray-500 text-xs uppercase tracking-widest font-bold">Total Clientes</p>
          <h3 class="text-2xl font-black mt-1 text-[#1A1814]">{{ stats?.metrics?.total_customers || 0 }}</h3>
        </div>

        <!-- Stock Baixo -->
        <div class="bg-white p-6 rounded-xl border border-[#E8E4DC] gold-shadow" [class.border-yellow-400]="stats?.metrics?.low_stock_count > 0">
          <div class="flex justify-between items-start mb-4">
            <div class="p-2 bg-yellow-50 rounded-lg">
              <span class="material-symbols-outlined text-yellow-600" translate="no">inventory_2</span>
            </div>
            <span *ngIf="stats?.metrics?.low_stock_count > 0" class="text-[10px] font-bold text-yellow-700 bg-yellow-100 px-2 py-1 rounded">ALERTA</span>
          </div>
          <p class="text-gray-500 text-xs uppercase tracking-widest font-bold">Stock Baixo</p>
          <h3 class="text-2xl font-black mt-1 text-[#1A1814]">{{ stats?.metrics?.low_stock_count || 0 }}</h3>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Últimos Pedidos -->
        <div class="lg:col-span-2 space-y-4">
          <div class="bg-white rounded-xl border border-[#E8E4DC] gold-shadow overflow-hidden">
            <div class="p-6 border-b border-[#E8E4DC] flex justify-between items-center">
              <h3 class="font-bold text-[#1A1814] uppercase tracking-widest text-xs">Pedidos Recentes</h3>
              <a routerLink="/admin/orders" class="text-[10px] font-bold text-[#C8960C] uppercase tracking-widest hover:underline">Ver Todos</a>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead class="bg-gray-50 text-[10px] font-bold uppercase text-gray-500 tracking-widest">
                  <tr>
                    <th class="px-6 py-3">ID</th>
                    <th class="px-6 py-3">Cliente</th>
                    <th class="px-6 py-3">Total</th>
                    <th class="px-6 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 text-sm">
                  <tr *ngFor="let order of stats?.recent_orders" class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 font-bold text-[#1A1814]">#{{ order.id }}</td>
                    <td class="px-6 py-4 text-gray-600">{{ order.customer_name }}</td>
                    <td class="px-6 py-4 font-bold text-[#C8960C]">{{ formatPrice(order.total_amount) }}</td>
                    <td class="px-6 py-4">
                      <span [class]="getStatusClass(order.status)" class="px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter">
                        {{ order.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Alertas de Stock -->
        <div class="space-y-4">
          <div class="bg-white rounded-xl border border-[#E8E4DC] gold-shadow p-6">
            <h3 class="font-bold text-[#1A1814] uppercase tracking-widest text-xs mb-6">Alertas de Stock</h3>
            <div class="space-y-4">
              <div *ngFor="let item of stats?.low_stock_list" class="flex items-center gap-4 p-3 rounded-lg border border-gray-50 hover:border-yellow-200 transition-colors">
                <img [src]="item.image_url" class="w-10 h-10 object-cover rounded bg-gray-100">
                <div class="flex-grow">
                  <p class="text-xs font-bold text-[#1A1814] line-clamp-1">{{ item.name }}</p>
                  <p class="text-[10px] text-gray-500">{{ item.stock }} unidades restantes</p>
                </div>
                <a routerLink="/admin/stock" class="p-2 text-gray-400 hover:text-[#C8960C]">
                  <span class="material-symbols-outlined text-sm" translate="no">edit</span>
                </a>
              </div>
              <p *ngIf="stats?.low_stock_list?.length === 0" class="text-xs text-gray-400 text-center py-4 italic">
                Nenhum alerta crítico de stock.
              </p>
            </div>
            <button routerLink="/admin/stock" class="w-full mt-6 py-3 border border-[#C8960C] text-[#C8960C] text-[10px] font-bold uppercase tracking-widest rounded hover:bg-[#C8960C] hover:text-white transition-all">
              Gerir Inventário
            </button>
          </div>
        </div>

      </div>

    </div>
  `
})
export class AdminDashboard implements OnInit {
  adminService = inject(AdminService);
  stats: any = null;
  isLoading = true;

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.isLoading = true;
    this.adminService.getDashboardStats().subscribe({
      next: (res) => {
        this.stats = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  formatPrice(price: number) {
    return new Intl.NumberFormat('pt-AO').format(price) + ' Kz';
  }

  getStatusClass(status: string) {
    const base = "px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ";
    switch (status) {
      case 'Pendente': return base + "bg-yellow-100 text-yellow-700";
      case 'Em processamento': return base + "bg-blue-100 text-blue-700";
      case 'Enviado': return base + "bg-purple-100 text-purple-700";
      case 'Entregue': return base + "bg-green-100 text-green-700";
      case 'Cancelado': return base + "bg-red-100 text-red-700";
      default: return base + "bg-gray-100 text-gray-700";
    }
  }
}
