<?php
/**
 * Database Configuration
 * Update these credentials to match your server environment
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'toy_story_fan_site');
define('DB_USER', 'root');      // Change to your DB username
define('DB_PASS', '');          // Change to your DB password
define('DB_CHARSET', 'utf8mb4');

/**
 * Create PDO Connection
 * Returns a PDO instance or dies on failure
 */
function getDBConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        // In production, log this error instead of showing it
        die("Database connection failed: " . $e->getMessage());
    }
}
?>
