import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin/admin.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Cabeçalho -->
      <div class="flex justify-between items-end">
        <div>
          <h2 class="text-3xl font-black text-[#1A1814] tracking-tight">Categorias</h2>
          <p class="text-gray-500 text-sm mt-1">Gere as categorias de produtos da loja.</p>
        </div>
        <button class="px-6 py-3 bg-[#C8960C] text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#A87A09] transition-all gold-shadow rounded flex items-center gap-2">
          <span class="material-symbols-outlined text-sm" translate="no">add</span>
          Nova Categoria
        </button>
      </div>

      <!-- Grelha de Categorias -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let cat of categories" class="bg-white p-6 rounded-xl border border-[#E8E4DC] gold-shadow flex justify-between items-center group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-[#F5F2EC] rounded-lg flex items-center justify-center text-[#C8960C]">
              <span class="material-symbols-outlined text-2xl" translate="no">{{ cat.icon || 'category' }}</span>
            </div>
            <div>
              <h3 class="font-bold text-[#1A1814] text-sm">{{ cat.name }}</h3>
              <p class="text-[10px] text-gray-400 uppercase tracking-widest">ID: {{ cat.id }}</p>
            </div>
          </div>
          <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="p-2 text-gray-400 hover:text-[#C8960C]">
              <span class="material-symbols-outlined text-lg" translate="no">edit</span>
            </button>
            <button class="p-2 text-gray-400 hover:text-red-500">
              <span class="material-symbols-outlined text-lg" translate="no">delete</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class AdminCategories implements OnInit {
  adminService = inject(AdminService);
  categories: any[] = [];

  ngOnInit() {
    this.adminService.getCategories().subscribe(res => this.categories = res.data || []);
  }
}
