<?php
/**
 * Search API
 * Handles search queries and logs them
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
    
    // Get search term
    $term = trim($_GET['q'] ?? '');
    
    if (empty($term)) {
        echo json_encode(['success' => false, 'message' => 'Search term is required']);
        exit;
    }
    
    // Log the search
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $logStmt = $pdo->prepare("INSERT INTO search_logs (search_term, ip_address) VALUES (?, ?)");
    $logStmt->execute([$term, $ip]);
    
    // Search movies
    $movieStmt = $pdo->prepare("
        SELECT 'movie' as type, id, title as name, release_year as info, poster_url as image
        FROM movies 
        WHERE title LIKE ? OR tagline LIKE ?
        ORDER BY release_year DESC
    ");
    $movieStmt->execute(["%$term%", "%$term%"]);
    $movies = $movieStmt->fetchAll();
    
    // Search characters
    $charStmt = $pdo->prepare("
        SELECT 'character' as type, id, name, role_title as info, avatar_url as image
        FROM characters 
        WHERE name LIKE ? OR role_title LIKE ? OR quote LIKE ?
        ORDER BY name ASC
    ");
    $charStmt->execute(["%$term%", "%$term%", "%$term%"]);
    $characters = $charStmt->fetchAll();
    
    // Combine results
    $results = array_merge($movies, $characters);
    
    echo json_encode([
        'success' => true,
        'data' => $results,
        'count' => count($results)
    ]);
    
} catch (PDOException $e) {
    error_log("Search error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An error occurred']);
}
?>
