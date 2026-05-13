<?php
require_once __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->safeLoad();
require_once __DIR__ . '/config/Database.php';
$db = App\Config\Database::getConnection();

$stmt = $db->query("SELECT id, name, email, role FROM users");
while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo "ID: {$row['id']} | Name: {$row['name']} | Email: {$row['email']} | Role: {$row['role']}\n";
}
