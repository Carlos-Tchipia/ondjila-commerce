import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin/admin.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Cabeçalho -->
      <div class="flex justify-between items-end">
        <div>
          <h2 class="text-3xl font-black text-[#1A1814] tracking-tight">Produtos</h2>
          <p class="text-gray-500 text-sm mt-1">Gere o catálogo e inventário da loja.</p>
        </div>
        <button (click)="openModal()" class="px-6 py-3 bg-[#C8960C] text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#A87A09] transition-all gold-shadow rounded flex items-center gap-2">
          <span class="material-symbols-outlined text-sm" translate="no">add</span>
          Novo Produto
        </button>
      </div>

      <!-- Filtros e Pesquisa -->
      <div class="bg-white p-4 rounded-xl border border-[#E8E4DC] gold-shadow flex flex-wrap gap-4 items-center justify-between">
        <div class="flex flex-grow max-w-md bg-[#F5F2EC] rounded px-4 py-2 gap-3 items-center border border-transparent focus-within:border-[#C8960C] transition-all">
          <span class="material-symbols-outlined text-gray-400 text-lg" translate="no">search</span>
          <input type="text" [(ngModel)]="searchQuery" placeholder="Pesquisar por nome ou marca..." class="bg-transparent border-none outline-none text-sm w-full">
        </div>
        <select [(ngModel)]="selectedCategory" class="bg-[#F5F2EC] px-4 py-2 rounded text-sm outline-none border border-transparent focus:border-[#C8960C]">
          <option value="">Todas as Categorias</option>
          <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
        </select>
      </div>

      <!-- Tabela de Produtos -->
      <div class="bg-white rounded-xl border border-[#E8E4DC] gold-shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-[#E8E4DC]">
              <tr>
                <th class="px-6 py-4">Produto</th>
                <th class="px-6 py-4">Preço</th>
                <th class="px-6 py-4">Stock</th>
                <th class="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let p of filteredProducts()" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-4">
                    <img [src]="p.image_url" class="w-12 h-12 object-cover rounded bg-gray-100">
                    <div>
                      <p class="font-bold text-[#1A1814] text-sm">{{ p.name }}</p>
                      <p class="text-[10px] text-gray-500 uppercase tracking-widest">{{ p.brand }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 font-black text-[#C8960C] text-sm">
                  {{ formatPrice(p.price) }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <span [class]="p.stock <= 5 ? 'text-red-500 bg-red-50' : 'text-gray-600 bg-gray-100'" 
                          class="px-2 py-1 rounded text-[10px] font-bold">
                      {{ p.stock }} uni.
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end gap-2">
                    <button (click)="openModal(p)" class="p-2 text-gray-400 hover:text-[#C8960C] transition-colors">
                      <span class="material-symbols-outlined text-[20px]" translate="no">edit</span>
                    </button>
                    <button (click)="deleteProduct(p.id)" class="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <span class="material-symbols-outlined text-[20px]" translate="no">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal de Produto -->
      <div *ngIf="showModal" class="fixed inset-0 bg-[#1A1814]/80 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
        <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div class="p-8 border-b border-[#E8E4DC] flex justify-between items-center">
            <h3 class="text-xl font-black text-[#1A1814] uppercase tracking-widest">
              {{ editingProduct ? 'Editar Produto' : 'Novo Produto' }}
            </h3>
            <button (click)="closeModal()" class="p-2 text-gray-400 hover:text-black">
              <span class="material-symbols-outlined" translate="no">close</span>
            </button>
          </div>

          <div class="p-8 overflow-y-auto space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-widest text-gray-500">Nome do Produto</label>
                <input type="text" [(ngModel)]="formProduct.name" class="w-full bg-[#F5F2EC] px-4 py-3 rounded outline-none border border-transparent focus:border-[#C8960C]">
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-widest text-gray-500">Marca</label>
                <input type="text" [(ngModel)]="formProduct.brand" class="w-full bg-[#F5F2EC] px-4 py-3 rounded outline-none border border-transparent focus:border-[#C8960C]">
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-widest text-gray-500">Categoria</label>
                <select [(ngModel)]="formProduct.category_id" class="w-full bg-[#F5F2EC] px-4 py-3 rounded outline-none border border-transparent focus:border-[#C8960C]">
                  <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-widest text-gray-500">Preço (Kz)</label>
                <input type="number" [(ngModel)]="formProduct.price" class="w-full bg-[#F5F2EC] px-4 py-3 rounded outline-none border border-transparent focus:border-[#C8960C]">
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-widest text-gray-500">Stock Inicial</label>
                <input type="number" [(ngModel)]="formProduct.stock" class="w-full bg-[#F5F2EC] px-4 py-3 rounded outline-none border border-transparent focus:border-[#C8960C]">
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-widest text-gray-500">Caminho da Imagem Local</label>
                <input type="text" [(ngModel)]="formProduct.image_url" placeholder="assets/images/products/..." class="w-full bg-[#F5F2EC] px-4 py-3 rounded outline-none border border-transparent focus:border-[#C8960C]">
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-widest text-gray-500">Descrição</label>
              <textarea [(ngModel)]="formProduct.description" rows="3" class="w-full bg-[#F5F2EC] px-4 py-3 rounded outline-none border border-transparent focus:border-[#C8960C]"></textarea>
            </div>
          </div>

          <div class="p-8 bg-gray-50 flex justify-end gap-4">
            <button (click)="closeModal()" class="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black">Cancelar</button>
            <button (click)="saveProduct()" class="px-8 py-3 bg-[#C8960C] text-white text-[10px] font-black uppercase tracking-widest gold-shadow rounded">
              {{ editingProduct ? 'Guardar Alterações' : 'Criar Produto' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class AdminProducts implements OnInit {
  adminService = inject(AdminService);
  products: any[] = [];
  categories: any[] = [];
  
  searchQuery = '';
  selectedCategory = '';
  
  showModal = false;
  editingProduct: any = null;
  formProduct: any = {
    name: '',
    brand: '',
    category_id: '',
    price: 0,
    stock: 0,
    image_url: '',
    description: ''
  };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.adminService.getProducts().subscribe(res => this.products = res.data || []);
    this.adminService.getCategories().subscribe(res => this.categories = res.data || []);
  }

  filteredProducts() {
    return this.products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                           p.brand.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCat = this.selectedCategory ? p.category_id == this.selectedCategory : true;
      return matchesSearch && matchesCat;
    });
  }

  openModal(product: any = null) {
    if (product) {
      this.editingProduct = product;
      this.formProduct = { ...product };
    } else {
      this.editingProduct = null;
      this.formProduct = { name: '', brand: '', category_id: this.categories[0]?.id || '', price: 0, stock: 0, image_url: '', description: '' };
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveProduct() {
    const obs = this.editingProduct 
      ? this.adminService.updateProduct(this.editingProduct.id, this.formProduct)
      : this.adminService.createProduct(this.formProduct);

    obs.subscribe(() => {
      this.loadData();
      this.closeModal();
    });
  }

  deleteProduct(id: number) {
    if (confirm('Tem certeza que deseja eliminar este produto?')) {
      this.adminService.deleteProduct(id).subscribe(() => this.loadData());
    }
  }

  formatPrice(price: number) {
    return new Intl.NumberFormat('pt-AO').format(price) + ' Kz';
  }
}
