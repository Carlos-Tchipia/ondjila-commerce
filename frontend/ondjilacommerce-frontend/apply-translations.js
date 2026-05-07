const fs = require('fs');
const path = require('path');

const srcAppDir = path.join(__dirname, 'src', 'app');
const components = ['home', 'checkout', 'admin', 'catalog', 'product-detail'];

function formatKz(dollarStr) {
    let num = parseFloat(dollarStr.replace(/,/g, ''));
    if (isNaN(num)) return dollarStr;
    let kzNum = num * 154; 
    
    // specific overrides for realism
    if (num === 299) kzNum = 45990;
    else if (num === 249) kzNum = 38500;
    else if (num === 399) kzNum = 61500;
    else if (num === 179) kzNum = 27500;
    else if (num === 1299) kzNum = 189000;
    else if (num === 3499) kzNum = 1250000;
    else if (num < 100) kzNum = 8500;
    else kzNum = Math.round(kzNum / 100) * 100;
    
    let parts = kzNum.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(',');
}

components.forEach(comp => {
    const filePath = path.join(srcAppDir, comp, `${comp}.html`);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }

    let html = fs.readFileSync(filePath, 'utf-8');

    // 1. Navegação
    const navRegex = /<nav[^>]*>[\s\S]*?<\/nav>/;
    const newNav = `<nav class="hidden md:flex gap-md font-body-main text-body-main">
<a class="text-primary-container dark:text-primary-fixed border-b-2 border-primary-container font-bold pb-1 transition-colors duration-200" routerLink="/">Início</a>
<a class="text-on-surface-variant dark:text-surface-variant hover:text-primary-container dark:hover:text-primary-fixed transition-colors duration-200" routerLink="/catalog">Categorias</a>
<a class="text-on-surface-variant dark:text-surface-variant hover:text-primary-container dark:hover:text-primary-fixed transition-colors duration-200" routerLink="/">Ofertas</a>
<a class="text-on-surface-variant dark:text-surface-variant hover:text-primary-container dark:hover:text-primary-fixed transition-colors duration-200" routerLink="/admin">A minha conta</a>
</nav>`;
    html = html.replace(navRegex, newNav);

    // 2. Pesquisa
    html = html.replace(/placeholder="Search Product"/g, 'placeholder="Pesquisar produtos..."');
    html = html.replace(/placeholder="Search..."/gi, 'placeholder="Pesquisar produtos..."');

    // 3. Ícones da Navbar (Language Selector, Conta, Carrinho)
    const rightNavRegex = /<div class="flex items-center gap-sm">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/header>/;
    const rightNavMatch = html.match(rightNavRegex);
    if (rightNavMatch) {
        let icons = rightNavMatch[1];
        icons = icons.replace(/>\s*Account\s*</g, '>A minha conta<');
        icons = icons.replace(/>\s*Cart\s*</g, '>Carrinho<');

        const languageSelector = `
<div class="relative group hidden md:flex items-center cursor-pointer mr-sm">
  <span class="text-[12px] text-on-surface-variant flex items-center">
    [<span class="material-symbols-outlined text-[14px] mx-1">language</span> PT <span class="material-symbols-outlined text-[14px]">arrow_drop_down</span>]
  </span>
  <div class="absolute right-0 top-full mt-1 hidden group-hover:block bg-surface shadow-md rounded-md py-1 min-w-[120px] text-[12px] text-on-surface border border-outline-variant z-50">
    <div class="px-3 py-2 hover:bg-surface-container-high cursor-pointer font-medium text-primary-container">Português</div>
    <div class="px-3 py-2 hover:bg-surface-container-high cursor-pointer">English</div>
  </div>
</div>`;
        
        const newRightNav = `<div class="flex items-center gap-sm">${languageSelector}${icons}</div>\n</div>\n</div>\n</header>`;
        html = html.replace(rightNavRegex, newRightNav);
    }

    // 4. Traduções Genéricas
    html = html.replace(/>\s*Add to Cart\s*</gi, '>Adicionar ao carrinho<');
    html = html.replace(/>\s*Buy now\s*</gi, '>Comprar agora<');
    html = html.replace(/>\s*Shop Now\s*</gi, '>Comprar agora<');
    html = html.replace(/>\s*Filters\s*</gi, '>Filtros<');
    html = html.replace(/>\s*Headphones\s*</gi, '>Auscultadores<');
    html = html.replace(/>\s*Smartwatches\s*</gi, '>Relógios Inteligentes<');
    html = html.replace(/>\s*Speakers\s*</gi, '>Colunas<');
    html = html.replace(/>\s*Accessories\s*</gi, '>Acessórios<');
    html = html.replace(/>\s*Cameras\s*</gi, '>Câmaras<');
    html = html.replace(/>\s*Noise Cancelling Wireless Over-Ear\s*</gi, '>Over-Ear Sem Fios com Cancelamento de Ruído<');
    html = html.replace(/>\s*MagSafe Charging Case\s*</gi, '>Caixa de Carregamento MagSafe<');
    html = html.replace(/>\s*Industry-leading noise cancelation\s*</gi, '>Cancelamento de ruído líder de mercado<');
    html = html.replace(/>\s*Lossless Wireless \+ Bluetooth\s*</gi, '>Sem Fios Lossless + Bluetooth<');
    html = html.replace(/20% OFF/g, '-20%');
    html = html.replace(/15% OFF/g, '-15%');
    html = html.replace(/30% OFF/g, '-30%');
    html = html.replace(/10% OFF/g, '-10%');

    // Admin & Checkout terms
    html = html.replace(/>\s*Pending\s*</gi, '>Pendente<');
    html = html.replace(/>\s*Processing\s*</gi, '>Em processamento<');
    html = html.replace(/>\s*Shipped\s*</gi, '>Enviado<');
    html = html.replace(/>\s*Delivered\s*</gi, '>Entregue<');
    html = html.replace(/>\s*Your cart is empty\s*</gi, '>O teu carrinho está vazio<');

    // 5. Preços
    const priceRegex = /<span\s+class="([^"]*text-on-surface[^"]*)"[^>]*>\s*\$([0-9,.]+)\s*<\/span>/g;
    html = html.replace(priceRegex, (match, classes, dollarAmount) => {
        const kzVal = formatKz(dollarAmount);
        let newClasses = classes.replace('text-on-surface', 'text-primary-container font-bold');
        return `<span class="${newClasses}">${kzVal} <span class="text-sm font-normal">Kz</span></span>`;
    });

    const loosePriceRegex = />\s*\$([0-9,.]+)\s*</g;
    html = html.replace(loosePriceRegex, (match, dollarAmount) => {
        const kzVal = formatKz(dollarAmount);
        return `><span class="text-primary-container font-bold">${kzVal} <span class="text-sm font-normal">Kz</span></span><`;
    });

    // 6. Footer Traduções
    html = html.replace(/>\s*Privacy Policy\s*</gi, '>Política de Privacidade<');
    html = html.replace(/>\s*Terms of Service\s*</gi, '>Termos de Serviço<');
    html = html.replace(/>\s*Shipping Policy\s*</gi, '>Política de Envio<');
    html = html.replace(/>\s*SHOP\s*</gi, '>LOJA<');
    html = html.replace(/>\s*SUPPORT\s*</gi, '>SUPORTE<');
    html = html.replace(/>\s*NEWSLETTER\s*</gi, '>NEWSLETTER<');

    // Footer items
    html = html.replace(/>\s*Help Center\s*</gi, '>Centro de Ajuda<');
    html = html.replace(/>\s*Shipping & Delivery\s*</gi, '>Envio e Entrega<');
    html = html.replace(/>\s*Returns\s*</gi, '>Devoluções<');
    html = html.replace(/>\s*Contact Us\s*</gi, '>Contactos<');
    html = html.replace(/>\s*New Arrivals\s*</gi, '>Novidades<');
    html = html.replace(/>\s*Best Sellers\s*</gi, '>Best Sellers<');
    html = html.replace(/>\s*Brands\s*</gi, '>Marcas<');

    fs.writeFileSync(filePath, html);
    console.log(`Updated ${comp}.html`);
});

console.log("Done applying translations and Kz currency formatting.");
