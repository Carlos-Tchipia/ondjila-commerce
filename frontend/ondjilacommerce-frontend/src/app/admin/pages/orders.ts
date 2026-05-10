import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin/admin.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Cabeçalho -->
      <div class="flex justify-between items-end">
        <div>
          <h2 class="text-3xl font-black text-[#1A1814] tracking-tight">Gestão de Pedidos</h2>
          <p class="text-gray-500 text-sm mt-1">Acompanhe e atualize o estado das vendas.</p>
        </div>
        <div class="flex gap-3">
          <button class="px-4 py-2 bg-white border border-[#E8E4DC] rounded text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 flex items-center gap-2">
            <span class="material-symbols-outlined text-sm" translate="no">download</span>
            Exportar CSV
          </button>
        </div>
      </div>

      <!-- Filtros -->
      <div class="bg-white p-4 rounded-xl border border-[#E8E4DC] gold-shadow flex gap-4 items-center">
        <select [(ngModel)]="statusFilter" class="bg-[#F5F2EC] px-4 py-2 rounded text-sm outline-none border border-transparent focus:border-[#C8960C]">
          <option value="">Todos os Estados</option>
          <option value="Pendente">Pendente</option>
          <option value="Em processamento">Em processamento</option>
          <option value="Enviado">Enviado</option>
          <option value="Entregue">Entregue</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      <!-- Tabela de Pedidos -->
      <div class="bg-white rounded-xl border border-[#E8E4DC] gold-shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-[#E8E4DC]">
              <tr>
                <th class="px-6 py-4">Pedido</th>
                <th class="px-6 py-4">Cliente</th>
                <th class="px-6 py-4">Data</th>
                <th class="px-6 py-4">Total</th>
                <th class="px-6 py-4">Estado</th>
                <th class="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let order of filteredOrders()" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4 font-bold text-[#1A1814]">#{{ order.id }}</td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="font-bold text-[#1A1814] text-sm">{{ order.customer_name }}</span>
                    <span class="text-[10px] text-gray-500">{{ order.customer_email }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-gray-500 text-sm">
                  {{ formatDate(order.created_at) }}
                </td>
                <td class="px-6 py-4 font-black text-[#C8960C] text-sm">
                  {{ formatPrice(order.total_amount) }}
                </td>
                <td class="px-6 py-4">
                  <select [ngModel]="order.status" (ngModelChange)="updateStatus(order.id, $event)"
                          [class]="getStatusClass(order.status)"
                          class="px-3 py-1 rounded text-[10px] font-black uppercase tracking-tighter outline-none border-none cursor-pointer appearance-none">
                    <option value="Pendente">Pendente</option>
                    <option value="Em processamento">Em processamento</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Entregue">Entregue</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </td>
                <td class="px-6 py-4 text-right">
                  <button class="p-2 text-gray-400 hover:text-[#C8960C]">
                    <span class="material-symbols-outlined text-[20px]" translate="no">visibility</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class AdminOrders implements OnInit {
  adminService = inject(AdminService);
  orders: any[] = [];
  statusFilter = '';

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.adminService.getOrders().subscribe(res => this.orders = res.data || []);
  }

  filteredOrders() {
    if (!this.statusFilter) return this.orders;
    return this.orders.filter(o => o.status === this.statusFilter);
  }

  updateStatus(orderId: number, newStatus: string) {
    this.adminService.updateOrderStatus(orderId, newStatus).subscribe(() => {
      this.loadOrders();
    });
  }

  formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatPrice(price: number) {
    return new Intl.NumberFormat('pt-AO').format(price) + ' Kz';
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Pendente': return "bg-yellow-100 text-yellow-700";
      case 'Em processamento': return "bg-blue-100 text-blue-700";
      case 'Enviado': return "bg-purple-100 text-purple-700";
      case 'Entregue': return "bg-green-100 text-green-700";
      case 'Cancelado': return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  }
}
