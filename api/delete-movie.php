<?php
/**
 * Delete Movie API
 * Removes a movie from the database
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
    $id = (int)($input['id'] ?? 0);
    
    if ($id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid movie ID']);
        exit;
    }
    
    // Delete movie
    $stmt = $pdo->prepare("DELETE FROM movies WHERE id = ?");
    $stmt->execute([$id]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Movie deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Movie not found']);
    }
    
} catch (PDOException $e) {
    error_log("Delete movie error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred while deleting the movie']);
}
?>
