<?php
/**
 * Create/Update Character API
 * Handles both INSERT and UPDATE operations for characters
 */

session_start();
require_once '../config/database.php';

header('Content-Type: application/json');

// Check if admin is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $pdo = getDBConnection();
    
    // Get input data
    $input = json_decode(file_get_contents('php://input'), true);
    
    $id = $input['id'] ?? null;
    $name = trim($input['name'] ?? '');
    $role_title = trim($input['role_title'] ?? '');
    $quote = trim($input['quote'] ?? '');
    $description = trim($input['description'] ?? '');
    $avatar_url = trim($input['avatar_url'] ?? '');
    
    // Validation
    if (empty($name)) {
        echo json_encode(['success' => false, 'message' => 'Character name is required']);
        exit;
    }
    
    if ($id) {
        // Update existing character
        $stmt = $pdo->prepare("
            UPDATE characters 
            SET name = ?, role_title = ?, quote = ?, description = ?, avatar_url = ?
            WHERE id = ?
        ");
        $stmt->execute([$name, $role_title, $quote, $description, $avatar_url, $id]);
        
        echo json_encode(['success' => true, 'message' => 'Character updated successfully', 'id' => $id]);
    } else {
        // Create new character
        $stmt = $pdo->prepare("
            INSERT INTO characters (name, role_title, quote, description, avatar_url)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([$name, $role_title, $quote, $description, $avatar_url]);
        
        $new_id = $pdo->lastInsertId();
        echo json_encode(['success' => true, 'message' => 'Character created successfully', 'id' => $new_id]);
    }
    
} catch (PDOException $e) {
    error_log("Save character error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred while saving the character']);
}
?>
