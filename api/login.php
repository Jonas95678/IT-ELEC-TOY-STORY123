<?php
/**
 * Admin Login Handler
 * Processes login form submission and creates session
 */

session_start();
require_once '../config/database.php';

header('Content-Type: application/json');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get input data
$input = json_decode(file_get_contents('php://input'), true);
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

// Validation
if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Please enter both username and password']);
    exit;
}

try {
    $pdo = getDBConnection();
    
    // Fetch admin user
    $stmt = $pdo->prepare("SELECT id, username, password_hash FROM admins WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($password, $user['password_hash'])) {
        // Login successful - create session
        $_SESSION['admin_id'] = $user['id'];
        $_SESSION['admin_username'] = $user['username'];
        $_SESSION['logged_in'] = true;
        
        // Update last login time
        $updateStmt = $pdo->prepare("UPDATE admins SET last_login = NOW() WHERE id = ?");
        $updateStmt->execute([$user['id']]);
        
        echo json_encode([
            'success' => true, 
            'message' => 'Login successful! Redirecting...',
            'redirect' => 'admin-dashboard.html'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
    }
    
} catch (PDOException $e) {
    error_log("Login error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred. Please try again.']);
}
?>
