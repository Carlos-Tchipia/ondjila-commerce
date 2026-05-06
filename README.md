<div align="center">

<br/>

```
 ██████╗ ███╗   ██╗██████╗      ██╗██╗██╗      █████╗
██╔═══██╗████╗  ██║██╔══██╗     ██║██║██║     ██╔══██╗
██║   ██║██╔██╗ ██║██║  ██║     ██║██║██║     ███████║
██║   ██║██║╚██╗██║██║  ██║██   ██║██║██║     ██╔══██║
╚██████╔╝██║ ╚████║██████╔╝╚█████╔╝██║███████╗██║  ██║
 ╚═════╝ ╚═╝  ╚═══╝╚═════╝  ╚════╝ ╚═╝╚══════╝╚═╝  ╚═╝
```

### *Ondjila — o caminho, a jornada de sucesso*

<br/>

[![Angular](https://img.shields.io/badge/Angular-17+-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.io/)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat-square&logo=php&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-gold?style=flat-square)](./LICENSE)
[![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-orange?style=flat-square)]()
[![ISPTEC](https://img.shields.io/badge/ISPTEC-2025%2F2026-1a1a2e?style=flat-square)](https://isptec.co.ao/)

<br/>

> **Ondjilacommerce** é um e-commerce premium minimalista inspirado na palavra Kimbundu *Ondjila*,  
> que significa **o caminho**. Cada compra é uma jornada. Cada cliente está num caminho de sucesso.

<br/>

![Preview](https://via.placeholder.com/900x400/1a1a2e/c8960c?text=Ondjilacommerce+Preview)

<br/>

</div>

---

## 📌 Índice

- [Sobre o Projecto](#-sobre-o-projecto)
- [Funcionalidades](#-funcionalidades)
- [Stack Tecnológica](#-stack-tecnológica)
- [Estrutura do Projecto](#-estrutura-do-projecto)
- [Instalação](#-instalação)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Base de Dados](#-base-de-dados)
- [API — Endpoints](#-api--endpoints)
- [Screenshots](#-screenshots)
- [Autor](#-autor)
- [Licença](#-licença)

---

## 🌿 Sobre o Projecto

O **Ondjilacommerce** é um sistema de e-commerce full-stack desenvolvido no âmbito da disciplina de **Engenharia de Software II** do curso de **Licenciatura em Engenharia Informática** do **ISPTEC** (2025/2026).

O nome é uma homenagem à cultura angolana: *Ondjila*, em Kimbundu, significa **o caminho** — simbolizando que cada compra é uma jornada de sucesso, e que o comércio digital pode ter identidade própria e raízes africanas.

O design foi inspirado na estética minimalista da **Nike** e **Apple**, com a robustez funcional do **Amazon**.

---

## ✨ Funcionalidades

### 👤 Autenticação
- [x] Registo com validação de email
- [x] Login com JWT (token 24h)
- [x] Logout seguro
- [x] Recuperação de senha por email
- [x] Perfil de utilizador editável

### 🛍️ Catálogo
- [x] Listagem de produtos com paginação
- [x] Filtros por categoria, preço e avaliação
- [x] Pesquisa em tempo real
- [x] Página de detalhe com galeria de imagens
- [x] Sistema de avaliações e comentários
- [x] Produtos em destaque

### 🛒 Carrinho & Checkout
- [x] Carrinho persistente
- [x] Checkout em 3 etapas
- [x] Integração com Stripe (modo teste)
- [x] Confirmação por email

### 📦 Gestão de Pedidos
- [x] Histórico de pedidos
- [x] Estados: Pendente → Em processamento → Enviado → Entregue
- [x] Cancelamento de pedido

### 🔧 Painel de Administração
- [x] Dashboard com métricas de vendas
- [x] CRUD completo de produtos
- [x] Gestão de categorias
- [x] Gestão de pedidos e utilizadores
- [x] Exportação de relatórios em **PDF** e **CSV**

### 🎨 Interface
- [x] Design responsivo (mobile-first)
- [x] Dark mode / Light mode
- [x] Suporte a **Português** e **Inglês**
- [x] Componentes reutilizáveis com Angular

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | Angular 17+, TypeScript, SCSS |
| **Backend** | PHP 8.2+ (puro, sem frameworks) |
| **Base de Dados** | MySQL 8.0+ |
| **Autenticação** | JWT (`firebase/php-jwt`) |
| **Pagamentos** | Stripe API (modo teste) |
| **Emails** | PHPMailer + Gmail SMTP |
| **Imagens** | Unsplash API |
| **Versionamento** | Git + GitHub |

---

## 📁 Estrutura do Projecto

```
ondjilacommerce/
│
├── 📂 frontend/                    # Angular Application
│   └── src/
│       ├── app/
│       │   ├── core/               # Guards, Interceptors, Auth Service
│       │   ├── shared/             # Componentes reutilizáveis (Button, Card, Modal)
│       │   ├── layouts/            # MainLayout, AdminLayout, AuthLayout
│       │   └── features/
│       │       ├── auth/           # Login, Registo, Recuperação de Senha
│       │       ├── catalog/        # Listagem e Detalhe de Produtos
│       │       ├── cart/           # Carrinho de Compras
│       │       ├── checkout/       # Fluxo de Checkout
│       │       ├── orders/         # Histórico de Pedidos
│       │       └── admin/          # Painel de Administração
│       └── assets/
│           └── i18n/               # pt.json, en.json
│
├── 📂 backend/                     # PHP API
│   ├── config/                     # database.php, env.php
│   ├── endpoints/                  # auth.php, products.php, orders.php...
│   ├── controllers/                # AuthController, ProductController...
│   ├── services/                   # AuthService, ProductService...
│   ├── repositories/               # UserRepository, ProductRepository...
│   ├── models/                     # User, Product, Order...
│   ├── middleware/                  # JWT Auth, CORS, Validation
│   └── helpers/                    # Response, Upload, Email helpers
│
├── 📂 database/
│   └── schema.sql                  # Script completo da base de dados
│
├── 📂 docs/
│   └── technical-report.pdf        # Relatório técnico (até 5 páginas)
│
├── .env.example                    # Template de variáveis de ambiente
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+
- PHP 8.2+
- MySQL 8.0+
- Composer
- Angular CLI (`npm install -g @angular/cli`)

### 1. Clonar o repositório
```bash
git clone https://github.com/SEU-USERNAME/ondjilacommerce.git
cd ondjilacommerce
```

### 2. Configurar o Backend
```bash
cd backend
cp ../.env.example .env
# Edita o ficheiro .env com as tuas credenciais

composer install
```

### 3. Configurar a Base de Dados
```bash
mysql -u root -p < database/schema.sql
```

### 4. Configurar o Frontend
```bash
cd frontend
npm install
ng serve
```

### 5. Aceder à aplicação
| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost/ondjilacommerce/backend |
| phpMyAdmin | http://localhost/phpmyadmin |

---

## 🔐 Variáveis de Ambiente

Cria um ficheiro `.env` na raiz do backend baseado no `.env.example`:

```env
# Base de Dados
DB_HOST=localhost
DB_NAME=ondjilacommerce
DB_USER=root
DB_PASS=

# JWT
JWT_SECRET=ondjila_secret_key_muda_isto

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...

# Email (Gmail SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=teu@email.com
MAIL_PASS=tua_app_password

# Unsplash
UNSPLASH_ACCESS_KEY=...

# App
APP_URL=http://localhost
APP_ENV=development
```

> ⚠️ **Nunca faças commit do ficheiro `.env` com dados reais!**

---

## 🗄️ Base de Dados

O ficheiro `database/schema.sql` contém o script completo com todas as tabelas, relações e dados iniciais (seed).

**Tabelas principais:**

| Tabela | Descrição |
|--------|-----------|
| `users` | Utilizadores (clientes e administradores) |
| `categories` | Categorias de produtos |
| `products` | Catálogo de produtos |
| `orders` | Pedidos realizados |
| `order_items` | Itens de cada pedido |
| `cart_items` | Itens no carrinho |
| `reviews` | Avaliações de produtos |
| `password_resets` | Tokens de recuperação de senha |

---

## 🔌 API — Endpoints

### Autenticação
```
POST   /auth/register       Registo de utilizador
POST   /auth/login          Login e geração de token
POST   /auth/logout         Invalidar token
POST   /auth/forgot-password  Solicitar reset de senha
POST   /auth/reset-password   Redefinir senha
```

### Produtos
```
GET    /products            Listar produtos (com filtros)
GET    /products/{id}       Detalhe do produto
POST   /products            Criar produto (admin)
PUT    /products/{id}       Actualizar produto (admin)
DELETE /products/{id}       Eliminar produto (admin)
```

### Pedidos
```
GET    /orders              Listar pedidos do utilizador
GET    /orders/{id}         Detalhe do pedido
POST   /orders              Criar pedido
PUT    /orders/{id}/cancel  Cancelar pedido
GET    /admin/orders        Todos os pedidos (admin)
PUT    /admin/orders/{id}   Actualizar estado (admin)
```

---

## 📸 Screenshots

> *Em breve — screenshots da interface serão adicionados após desenvolvimento.*

| Dark Mode | Light Mode |
|-----------|------------|
| ![Dark](https://via.placeholder.com/400x250/1a1a2e/c8960c?text=Dark+Mode) | ![Light](https://via.placeholder.com/400x250/f5f2ec/1a1a2e?text=Light+Mode) |

---

## 👤 Autor

<div align="center">
  <img src="https://github.com/Carlos-Tchipia.png" width="80" style="border-radius: 50%"/>
  <br/>
  <strong>Carlos Tchípia</strong>
  <br/>
  Licenciatura em Engenharia Informática — ISPTEC
  <br/>
  <br/>
  <a href="https://github.com/Carlos-Tchipia">GitHub</a> •
  <a href="mailto:nevescarlos930@gmail.com">Email</a> •
  <a href="https://linkedin.com/in/Carlos Tchípia">LinkedIn</a>
</div>

---

## 📄 Licença

Este projecto está licenciado sob a licença **MIT**. Consulta o ficheiro [LICENSE](./LICENSE) para mais detalhes.

---

<div align="center">
  <br/>
  <em>Ondjila — o caminho, a jornada de sucesso 🛤️</em>
  <br/>
  <em>Engenharia de Software II — ISPTEC 2025/2026</em>
  <br/>
  <em>Docente: Judson Paiva</em>
</div>
