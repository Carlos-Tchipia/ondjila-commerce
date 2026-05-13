<?php

declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->safeLoad();

require_once __DIR__ . '/helpers/ResponseHelper.php';
require_once __DIR__ . '/helpers/JwtHelper.php';
require_once __DIR__ . '/middleware/CorsMiddleware.php';
require_once __DIR__ . '/middleware/AuthMiddleware.php';

require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/ProductController.php';
require_once __DIR__ . '/controllers/OrderController.php';
require_once __DIR__ . '/controllers/AdminController.php';

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

applyCors();

$requestUri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$scriptDir     = dirname($_SERVER['SCRIPT_NAME']);
$path          = '/' . trim(substr($requestUri, strlen($scriptDir)), '/');
$method        = $_SERVER['REQUEST_METHOD'];

// COMANDO DE ELEVAÇÃO DE ADMIN (PARA TESTES)
if (isset($_GET['make-admin'])) {
    $email = $_GET['make-admin'];
    $db = App\Config\Database::getConnection();
    $stmt = $db->prepare("UPDATE users SET role = 'admin' WHERE email = :email");
    $stmt->execute([':email' => $email]);
    echo "<h1>🚀 Permissão Concedida!</h1><p>O utilizador <b>$email</b> é agora Administrador. Já podes entrar no painel.</p>";
    exit;
}

$path = preg_replace('#^/api#', '', $path);

try {
    // AUTH
    if ($path === '/auth/register' && $method === 'POST') (new App\Controllers\AuthController())->register();
    elseif ($path === '/auth/login' && $method === 'POST') (new App\Controllers\AuthController())->login();
    elseif ($path === '/auth/logout' && $method === 'POST') (new App\Controllers\AuthController())->logout();
    elseif ($path === '/auth/me' && $method === 'GET') (new App\Controllers\AuthController())->me();
    elseif ($path === '/auth/forgot-password' && $method === 'POST') (new App\Controllers\AuthController())->forgotPassword();
    elseif ($path === '/auth/reset-password' && $method === 'POST') (new App\Controllers\AuthController())->resetPassword();

    // PRODUCTS
    elseif ($path === '/products' && $method === 'GET') (new App\Controllers\ProductController())->index();
    elseif (preg_match('#^/products/([^/]+)$#', $path, $m) && $method === 'GET') {
        $param = $m[1];
        if (is_numeric($param)) (new App\Controllers\ProductController())->show((int) $param);
        else (new App\Controllers\ProductController())->index();
    }

    // ORDERS
    elseif ($path === '/orders' && $method === 'GET') (new App\Controllers\OrderController())->index();
    elseif ($path === '/orders' && $method === 'POST') (new App\Controllers\OrderController())->store();
    elseif (preg_match('#^/orders/(\d+)$#', $path, $m) && $method === 'GET') (new App\Controllers\OrderController())->show((int) $m[1]);
    elseif (preg_match('#^/orders/(\d+)/cancel$#', $path, $m) && $method === 'PUT') (new App\Controllers\OrderController())->cancel((int) $m[1]);

    // ADMIN ENDPOINTS (Protegidos por requireAdmin no controller)
    elseif ($path === '/admin/stats' && $method === 'GET') (new App\Controllers\AdminController())->getStats();
    elseif ($path === '/admin/export' && $method === 'GET') (new App\Controllers\AdminController())->exportReport();
    elseif ($path === '/admin/products' && $method === 'GET') (new App\Controllers\AdminController())->listProducts();
    elseif ($path === '/admin/products' && $method === 'POST') (new App\Controllers\AdminController())->storeProduct();
    elseif (preg_match('#^/admin/products/(\d+)$#', $path, $m) && $method === 'PUT') (new App\Controllers\AdminController())->updateProduct((int)$m[1]);
    elseif (preg_match('#^/admin/products/(\d+)$#', $path, $m) && $method === 'DELETE') (new App\Controllers\AdminController())->deleteProduct((int)$m[1]);
    elseif ($path === '/admin/orders' && $method === 'GET') (new App\Controllers\AdminController())->listOrders();
    elseif (preg_match('#^/admin/orders/(\d+)/status$#', $path, $m) && $method === 'PUT') (new App\Controllers\AdminController())->updateStatus((int)$m[1]);
    elseif ($path === '/admin/customers' && $method === 'GET') (new App\Controllers\AdminController())->listCustomers();
    elseif ($path === '/admin/categories' && $method === 'GET') (new App\Controllers\AdminController())->listCategories();
    elseif ($path === '/admin/stock/update' && $method === 'POST') (new App\Controllers\AdminController())->updateStock();

    else respondError("Rota não encontrada: {$method} {$path}", 404);

} catch (\Throwable $e) {
    respondError('Erro interno.', 500, ['msg' => $e->getMessage()]);
}
