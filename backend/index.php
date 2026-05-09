<?php

declare(strict_types=1);

// ============================================================
// ONDJILA COMMERCE API — Router Principal
// Todos os pedidos HTTP passam por aqui.
// ============================================================

// 1. Autoloader do Composer
require_once __DIR__ . '/vendor/autoload.php';

// 2. Carregar variáveis de ambiente
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->safeLoad();

// 3. Helpers e Middleware (ordem importa)
require_once __DIR__ . '/helpers/ResponseHelper.php';
require_once __DIR__ . '/helpers/JwtHelper.php';
require_once __DIR__ . '/middleware/CorsMiddleware.php';
require_once __DIR__ . '/middleware/AuthMiddleware.php';

// 4. Controllers
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/ProductController.php';
require_once __DIR__ . '/controllers/OrderController.php';

// 5. Config (acessa a BD via autoload PSR-4)
spl_autoload_register(function (string $class): void {
    $base = __DIR__;
    $map  = [
        'App\\Config\\'       => $base . '/config/',
        'App\\Models\\'       => $base . '/models/',
        'App\\Repositories\\' => $base . '/repositories/',
        'App\\Services\\'     => $base . '/services/',
        'App\\Controllers\\'  => $base . '/controllers/',
    ];

    foreach ($map as $prefix => $dir) {
        if (str_starts_with($class, $prefix)) {
            $file = $dir . str_replace('\\', '/', substr($class, strlen($prefix))) . '.php';
            if (file_exists($file)) {
                require_once $file;
                return;
            }
        }
    }
});

// 6. Aplicar CORS (antes de qualquer lógica)
applyCors();

// 7. Extrair o caminho da requisição
$requestUri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$scriptDir     = dirname($_SERVER['SCRIPT_NAME']);
$path          = '/' . trim(substr($requestUri, strlen($scriptDir)), '/');
$method        = $_SERVER['REQUEST_METHOD'];

// Normalizar: remover /api prefix se presente
$path = preg_replace('#^/api#', '', $path);

// 8. Roteamento
try {
    // ---- AUTH ----
    if ($path === '/auth/register' && $method === 'POST') {
        (new App\Controllers\AuthController())->register();
    }
    elseif ($path === '/auth/login' && $method === 'POST') {
        (new App\Controllers\AuthController())->login();
    }
    elseif ($path === '/auth/logout' && $method === 'POST') {
        (new App\Controllers\AuthController())->logout();
    }
    elseif ($path === '/auth/me' && $method === 'GET') {
        (new App\Controllers\AuthController())->me();
    }

    // ---- PRODUCTS ----
    elseif ($path === '/products' && $method === 'GET') {
        (new App\Controllers\ProductController())->index();
    }
    elseif (preg_match('#^/products/(\d+)$#', $path, $m) && $method === 'GET') {
        (new App\Controllers\ProductController())->show((int) $m[1]);
    }

    // ---- ORDERS ----
    elseif ($path === '/orders' && $method === 'GET') {
        (new App\Controllers\OrderController())->index();
    }
    elseif ($path === '/orders' && $method === 'POST') {
        (new App\Controllers\OrderController())->store();
    }
    elseif (preg_match('#^/orders/(\d+)$#', $path, $m) && $method === 'GET') {
        (new App\Controllers\OrderController())->show((int) $m[1]);
    }
    elseif (preg_match('#^/orders/(\d+)/cancel$#', $path, $m) && $method === 'PUT') {
        (new App\Controllers\OrderController())->cancel((int) $m[1]);
    }

    // ---- 404 ----
    else {
        respondError("Rota não encontrada: {$method} {$path}", 404);
    }

} catch (\Throwable $e) {
    $debug = ($_ENV['APP_ENV'] ?? 'production') === 'development';
    respondError(
        'Erro interno do servidor.',
        500,
        $debug ? ['exception' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()] : null
    );
}
