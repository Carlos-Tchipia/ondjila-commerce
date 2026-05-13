<?php
require_once __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->safeLoad();
require_once __DIR__ . '/config/Database.php';
$db = App\Config\Database::getConnection();

function describe($db, $table) {
    echo "--- $table ---\n";
    $stmt = $db->query("DESCRIBE $table");
    while($row = $stmt->fetch()) {
        echo $row['Field'] . ' (' . $row['Type'] . ")\n";
    }
}

describe($db, 'products');
describe($db, 'categories');
describe($db, 'users');
describe($db, 'orders');
