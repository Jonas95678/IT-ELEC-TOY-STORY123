<?php
/**
 * Get Search Logs API
 * Returns recent search history for the admin dashboard
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
    
    // Get limit from query param (default 50)
    $limit = min((int)($_GET['limit'] ?? 50), 200);
    
    // Get recent search logs
    $stmt = $pdo->prepare("
        SELECT id, search_term, searched_at, ip_address
        FROM search_logs
        ORDER BY searched_at DESC
        LIMIT ?
    ");
    $stmt->bindValue(1, $limit, PDO::PARAM_INT);
    $stmt->execute();
    $logs = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => $logs,
        'count' => count($logs)
    ]);
    
} catch (PDOException $e) {
    error_log("Get search logs error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An error occurred']);
}
?>
