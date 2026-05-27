<?php
/**
 * Get Characters API
 * Returns all characters or a single character by ID
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
    
    // Check if requesting single character
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM characters WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $character = $stmt->fetch();
        
        if ($character) {
            echo json_encode(['success' => true, 'data' => $character]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Character not found']);
        }
    } else {
        // Return all characters
        $stmt = $pdo->query("SELECT * FROM characters ORDER BY name ASC");
        $characters = $stmt->fetchAll();
        
        echo json_encode(['success' => true, 'data' => $characters]);
    }
    
} catch (PDOException $e) {
    error_log("Get characters error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An error occurred']);
}
?>
