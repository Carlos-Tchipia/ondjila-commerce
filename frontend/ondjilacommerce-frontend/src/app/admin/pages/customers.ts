import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin/admin.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Cabeçalho -->
      <div>
        <h2 class="text-3xl font-black text-[#1A1814] tracking-tight">Clientes</h2>
        <p class="text-gray-500 text-sm mt-1">Gere a base de utilizadores registados.</p>
      </div>

      <!-- Tabela de Clientes -->
      <div class="bg-white rounded-xl border border-[#E8E4DC] gold-shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-[#E8E4DC]">
              <tr>
                <th class="px-6 py-4">Cliente</th>
                <th class="px-6 py-4">Email</th>
                <th class="px-6 py-4">Data Registo</th>
                <th class="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-sm text-gray-600">
              <tr *ngFor="let user of customers" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4 font-bold text-[#1A1814]">{{ user.name }}</td>
                <td class="px-6 py-4">{{ user.email }}</td>
                <td class="px-6 py-4">{{ formatDate(user.created_at) }}</td>
                <td class="px-6 py-4 text-right">
                  <button class="p-2 text-gray-400 hover:text-[#C8960C]">
                    <span class="material-symbols-outlined text-[20px]" translate="no">account_circle</span>
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
export class AdminCustomers implements OnInit {
  adminService = inject(AdminService);
  userService = inject(UserService);
  router = inject(Router);
  customers: any[] = [];

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.adminService.getCustomers().subscribe({
      next: res => this.customers = res.data || [],
      error: err => {
        this.customers = [];
        if (err?.status === 401 || err?.status === 403) {
          this.userService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
}
