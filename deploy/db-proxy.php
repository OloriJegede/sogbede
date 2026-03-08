<?php
/**
 * SoGbédè Database Proxy
 * 
 * Upload this file to your Namecheap hosting public_html directory.
 * Access URL: https://yourdomain.com/db-proxy.php
 * 
 * This file allows the Next.js app to query the MySQL database
 * via HTTP since remote MySQL access is not available.
 */

// Headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['error' => 'Method not allowed']));
}

// ========================
// CONFIGURATION
// ========================
define('API_KEY', 'SOGBEDE_DB_PROXY_KEY_2026');
define('DB_HOST', 'localhost');
define('DB_NAME', 'sogbgtlg_sogbede');
define('DB_USER', 'sogbgtlg_george');
define('DB_PASS', 'kjmfG0qSQXKPjjJ');

// ========================
// AUTH CHECK
// ========================
$input = json_decode(file_get_contents('php://input'), true);
if (!$input || ($input['apiKey'] ?? '') !== API_KEY) {
    http_response_code(403);
    die(json_encode(['error' => 'Unauthorized']));
}

// ========================
// DATABASE CONNECTION
// ========================
try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'DB connection failed: ' . $e->getMessage()]));
}

// Auto-create admins table if it doesn't exist
$pdo->exec("CREATE TABLE IF NOT EXISTS `admins` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

// ========================
// TABLE WHITELIST
// ========================
$ALLOWED_TABLES = [
    'applications', 'admin_application_visibility', 'admin_settings',
    'categories', 'application_categories', 'casting_email_delivery_status',
    'consent_records', 'consent_requests', 'episodes', 'episode_members',
    'filming_calendar', 'admins'
];

function isQueryAllowed($sql, $tables) {
    $sql = trim($sql);
    // Only allow SELECT, INSERT, UPDATE, DELETE
    if (!preg_match('/^(SELECT|INSERT|UPDATE|DELETE)\b/i', $sql)) {
        return false;
    }
    // Must reference at least one allowed table
    foreach ($tables as $t) {
        if (stripos($sql, $t) !== false) {
            return true;
        }
    }
    return false;
}

// ========================
// EXECUTE QUERIES
// ========================
$queries = $input['queries'] ?? [];
$results = [];

foreach ($queries as $q) {
    $sql = $q['sql'] ?? '';
    $params = $q['params'] ?? [];

    if (!isQueryAllowed($sql, $ALLOWED_TABLES)) {
        $results[] = [
            'error' => 'Query not allowed',
            'rows' => [],
            'insertId' => null,
            'affectedRows' => 0
        ];
        continue;
    }

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $type = strtoupper(substr(trim($sql), 0, 6));

        if ($type === 'SELECT') {
            $rows = $stmt->fetchAll();
            $results[] = [
                'rows' => $rows,
                'insertId' => null,
                'affectedRows' => count($rows)
            ];
        } elseif ($type === 'INSERT') {
            $results[] = [
                'rows' => [],
                'insertId' => intval($pdo->lastInsertId()),
                'affectedRows' => $stmt->rowCount()
            ];
        } else {
            $results[] = [
                'rows' => [],
                'insertId' => null,
                'affectedRows' => $stmt->rowCount()
            ];
        }
    } catch (PDOException $e) {
        $results[] = [
            'error' => $e->getMessage(),
            'rows' => [],
            'insertId' => null,
            'affectedRows' => 0
        ];
    }
}

echo json_encode(['results' => $results]);
