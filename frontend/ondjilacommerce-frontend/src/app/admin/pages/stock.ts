import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin/admin.service';
import { finalize, timeout } from 'rxjs/operators';
import { apiErrorMessage } from '../../shared/api-feedback';

@Component({
  selector: 'app-admin-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-3xl font-black text-[#1A1814] tracking-tight">Controlo de Stock</h2>
          <p class="text-gray-500 text-sm mt-1">Reposicao rapida e monitorizacao de inventario.</p>
        </div>
        <button type="button" (click)="loadProducts()" [disabled]="isLoading" class="bg-white border border-[#E8E4DC] text-[#1A1814] px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded hover:bg-gray-50 disabled:opacity-50">
          {{ isLoading ? 'A atualizar...' : 'Atualizar Stock' }}
        </button>
      </div>

      <div *ngIf="errorMessage" role="alert" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
        {{ errorMessage }}
      </div>
      <div *ngIf="successMessage" role="alert" class="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm">
        {{ successMessage }}
      </div>

      <div *ngIf="lowStockProducts().length > 0" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-yellow-700" translate="no">warning</span>
          <p class="text-sm text-yellow-700 font-medium">
            Existem <strong>{{ lowStockProducts().length }}</strong> produtos com stock critico (5 ou menos unidades).
          </p>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-[#E8E4DC] gold-shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-[#E8E4DC]">
              <tr>
                <th class="px-6 py-4">Produto</th>
                <th class="px-6 py-4">Stock Atual</th>
                <th class="px-6 py-4">Estado</th>
                <th class="px-6 py-4 text-right">Reposicao Rapida</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let p of products" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-4">
                    <img [src]="p.image_url" class="w-10 h-10 object-cover rounded bg-gray-100">
                    <p class="font-bold text-[#1A1814] text-sm">{{ p.name }}</p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-lg font-black text-[#1A1814]">{{ p.stock }}</span>
                </td>
                <td class="px-6 py-4">
                  <span *ngIf="p.stock == 0" class="bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Esgotado</span>
                  <span *ngIf="p.stock > 0 && p.stock <= 5" class="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Stock Baixo</span>
                  <span *ngIf="p.stock > 5" class="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Em Stock</span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end items-center gap-3">
                    <input type="number" [(ngModel)]="stockUpdates[p.id]" class="w-20 bg-[#F5F2EC] px-3 py-2 rounded text-sm text-center font-bold outline-none border border-transparent focus:border-[#C8960C]">
                    <button (click)="updateStock(p.id)"
                            [disabled]="stockUpdates[p.id] === undefined || isSaving"
                            class="bg-[#C8960C] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-[#A87A09] disabled:opacity-50 transition-all">
                      Repor
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminStock implements OnInit {
  adminService = inject(AdminService);
  products: any[] = [];
  stockUpdates: { [key: number]: number } = {};
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.errorMessage = '';
    this.adminService.getProducts().pipe(
      timeout(15000),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res) => {
        this.products = res.data || [];
        this.products.forEach(p => this.stockUpdates[p.id] = p.stock);
      },
      error: (err) => {
        this.errorMessage = apiErrorMessage(err, 'Nao foi possivel carregar o stock.');
      }
    });
  }

  lowStockProducts() {
    return this.products.filter(p => p.stock <= 5);
  }

  updateStock(productId: number) {
    const newQuantity = this.stockUpdates[productId];
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.adminService.updateStock(productId, newQuantity).pipe(
      timeout(15000),
      finalize(() => {
        this.isSaving = false;
      })
    ).subscribe({
      next: () => {
        this.successMessage = 'Stock atualizado com sucesso.';
        this.loadProducts();
      },
      error: (err) => {
        this.errorMessage = apiErrorMessage(err, 'Nao foi possivel atualizar o stock.');
      }
    });
  }
}
