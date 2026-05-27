<?php
/**
 * Get Movies API
 * Returns all movies or a single movie by ID
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
    
    // Check if requesting single movie
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM movies WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $movie = $stmt->fetch();
        
        if ($movie) {
            echo json_encode(['success' => true, 'data' => $movie]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Movie not found']);
        }
    } else {
        // Return all movies
        $stmt = $pdo->query("SELECT * FROM movies ORDER BY release_year DESC");
        $movies = $stmt->fetchAll();
        
        echo json_encode(['success' => true, 'data' => $movies]);
    }
    
} catch (PDOException $e) {
    error_log("Get movies error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An error occurred']);
}
?>
