<?php
/**
 * Create/Update Movie API
 * Handles both INSERT and UPDATE operations for movies
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
    $title = trim($input['title'] ?? '');
    $release_year = (int)($input['release_year'] ?? 0);
    $runtime_minutes = (int)($input['runtime_minutes'] ?? 0);
    $rating = trim($input['rating'] ?? '');
    $tagline = trim($input['tagline'] ?? '');
    $poster_url = trim($input['poster_url'] ?? '');
    
    // Validation
    if (empty($title) || $release_year <= 0) {
        echo json_encode(['success' => false, 'message' => 'Title and release year are required']);
        exit;
    }
    
    if ($id) {
        // Update existing movie
        $stmt = $pdo->prepare("
            UPDATE movies 
            SET title = ?, release_year = ?, runtime_minutes = ?, rating = ?, tagline = ?, poster_url = ?
            WHERE id = ?
        ");
        $stmt->execute([$title, $release_year, $runtime_minutes, $rating, $tagline, $poster_url, $id]);
        
        echo json_encode(['success' => true, 'message' => 'Movie updated successfully', 'id' => $id]);
    } else {
        // Create new movie
        $stmt = $pdo->prepare("
            INSERT INTO movies (title, release_year, runtime_minutes, rating, tagline, poster_url)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$title, $release_year, $runtime_minutes, $rating, $tagline, $poster_url]);
        
        $new_id = $pdo->lastInsertId();
        echo json_encode(['success' => true, 'message' => 'Movie created successfully', 'id' => $new_id]);
    }
    
} catch (PDOException $e) {
    error_log("Save movie error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred while saving the movie']);
}
?>
