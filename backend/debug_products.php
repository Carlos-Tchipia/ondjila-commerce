<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/helpers/ResponseHelper.php';

spl_autoload_register(function (string $class): void {
    $base = __DIR__;
    $map  = [
        'App\\Config\\'       => $base . '/config/',
        'App\\Models\\'       => $base . '/models/',
        'App\\Repositories\\' => $base . '/repositories/',
    ];
    foreach ($map as $prefix => $dir) {
        if (str_starts_with($class, $prefix)) {
            $file = $dir . str_replace('\\', '/', substr($class, strlen($prefix))) . '.php';
            if (file_exists($file)) { require_once $file; return; }
        }
    }
});

$repo = new App\Repositories\ProductRepository();
$products = $repo->findAll(['limit' => 100]);

echo "<h1>Diagnóstico de Slugs</h1>";
echo "<table border='1'><tr><th>ID</th><th>Nome</th><th>Slug</th><th>Ativo?</th></tr>";
foreach ($products as $p) {
    echo "<tr>";
    echo "<td>" . $p['id'] . "</td>";
    echo "<td>" . $p['name'] . "</td>";
    echo "<td>'<b>" . $p['slug'] . "</b>'</td>";
    echo "<td>Sim</td>";
    echo "</tr>";
}
echo "</table>";
