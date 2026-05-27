<?php
/**
 * Dashboard Stats API
 * Returns statistics for the admin dashboard
 */

session_start();
require_once '../config/database.php';

header('Content-Type: application/json');

// Check if admin is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

try {
    $pdo = getDBConnection();
    
    // Get total movies count
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM movies");
    $total_movies = $stmt->fetch()['count'];
    
    // Get total characters count
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM characters");
    $total_characters = $stmt->fetch()['count'];
    
    // Get last updated timestamp (most recent update from either table)
    $stmt = $pdo->query("
        SELECT GREATEST(
            (SELECT MAX(updated_at) FROM movies),
            (SELECT MAX(updated_at) FROM characters)
        ) as last_updated
    ");
    $last_updated = $stmt->fetch()['last_updated'];
    
    // Get active sessions (simplified - just count admins who logged in today)
    $stmt = $pdo->query("
        SELECT COUNT(*) as count FROM admins 
        WHERE DATE(last_login) = CURDATE()
    ");
    $active_sessions = $stmt->fetch()['count'];
    
    echo json_encode([
        'success' => true,
        'data' => [
            'total_movies' => $total_movies,
            'total_characters' => $total_characters,
            'last_updated' => $last_updated,
            'active_sessions' => $active_sessions
        ]
    ]);
    
} catch (PDOException $e) {
    error_log("Get stats error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An error occurred']);
}
?>
