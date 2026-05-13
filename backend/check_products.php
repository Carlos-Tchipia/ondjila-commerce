<?php
require_once __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->safeLoad();
require_once __DIR__ . '/config/Database.php';
$db = App\Config\Database::getConnection();
$stmt = $db->query('SELECT id, name, category, image_url FROM products ORDER BY id');
$assetsBase = __DIR__ . '/../frontend/ondjilacommerce-frontend/src/';
echo "--- ALL PRODUCTS ---\n";
while($row = $stmt->fetch()) {
    $path = $assetsBase . $row['image_url'];
    $exists = file_exists($path) ? 'OK' : 'MISSING';
    echo $row['id'] . ' | ' . $row['category'] . ' | ' . $row['image_url'] . ' | ' . $exists . "\n";
}
