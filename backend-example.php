<?php
/**
 * Backend API Example for Midtrans Integration
 * Raymaizing | autofile
 * 
 * This is a simple PHP example for creating Midtrans transactions.
 * You can adapt this to your preferred backend (Node.js, Python, etc.)
 */

// Enable CORS (adjust for production)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Midtrans Configuration
define('MIDTRANS_SERVER_KEY', 'YOUR_SERVER_KEY_HERE'); // Get from Midtrans Dashboard
define('MIDTRANS_IS_PRODUCTION', false); // Set to true for production
define('MIDTRANS_API_URL', MIDTRANS_IS_PRODUCTION 
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions'
);

/**
 * Create Midtrans Transaction
 * 
 * Endpoint: POST /api/create-transaction
 */
function createTransaction() {
    // Get request body
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // Validate input
    if (!$data || !isset($data['transaction_details']) || !isset($data['customer_details'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid request data'
        ]);
        return;
    }
    
    // Prepare transaction data
    $transactionData = [
        'transaction_details' => [
            'order_id' => $data['transaction_details']['order_id'],
            'gross_amount' => (int)$data['transaction_details']['gross_amount']
        ],
        'customer_details' => [
            'first_name' => $data['customer_details']['first_name'],
            'last_name' => $data['customer_details']['last_name'],
            'email' => $data['customer_details']['email'],
            'phone' => $data['customer_details']['phone'],
            'billing_address' => $data['customer_details']['billing_address']
        ],
        'item_details' => $data['item_details'],
        'credit_card' => [
            'secure' => true
        ]
    ];
    
    // Optional: Add custom expiry
    if (isset($data['custom_expiry'])) {
        $transactionData['custom_expiry'] = $data['custom_expiry'];
    }
    
    // Call Midtrans API
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, MIDTRANS_API_URL);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($transactionData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: Basic ' . base64_encode(MIDTRANS_SERVER_KEY . ':')
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    // Handle response
    if ($httpCode === 201) {
        $result = json_decode($response, true);
        
        // Save to database (optional)
        saveTransaction($data['transaction_details']['order_id'], $data, $result);
        
        // Return snap token
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'snap_token' => $result['token'],
            'redirect_url' => $result['redirect_url']
        ]);
    } else {
        http_response_code($httpCode);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to create transaction',
            'error' => json_decode($response, true)
        ]);
    }
}

/**
 * Handle Midtrans Webhook/Notification
 * 
 * Endpoint: POST /api/midtrans-webhook
 */
function handleWebhook() {
    // Get notification body
    $input = file_get_contents('php://input');
    $notification = json_decode($input, true);
    
    // Verify signature (important for security!)
    $orderId = $notification['order_id'];
    $statusCode = $notification['status_code'];
    $grossAmount = $notification['gross_amount'];
    $serverKey = MIDTRANS_SERVER_KEY;
    
    $signatureKey = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);
    
    if ($signatureKey !== $notification['signature_key']) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid signature'
        ]);
        return;
    }
    
    // Get transaction status
    $transactionStatus = $notification['transaction_status'];
    $fraudStatus = $notification['fraud_status'];
    
    // Update database based on status
    if ($transactionStatus == 'capture') {
        if ($fraudStatus == 'accept') {
            // Payment success
            updateTransactionStatus($orderId, 'success');
            activateSubscription($orderId);
        }
    } else if ($transactionStatus == 'settlement') {
        // Payment success
        updateTransactionStatus($orderId, 'success');
        activateSubscription($orderId);
    } else if ($transactionStatus == 'pending') {
        // Payment pending
        updateTransactionStatus($orderId, 'pending');
    } else if ($transactionStatus == 'deny' || $transactionStatus == 'expire' || $transactionStatus == 'cancel') {
        // Payment failed
        updateTransactionStatus($orderId, 'failed');
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Notification processed'
    ]);
}

/**
 * Save transaction to database
 */
function saveTransaction($orderId, $requestData, $midtransResponse) {
    // TODO: Implement database save
    // Example:
    /*
    $db = new PDO('mysql:host=localhost;dbname=raymaizing', 'username', 'password');
    $stmt = $db->prepare('
        INSERT INTO transactions (order_id, customer_email, amount, status, snap_token, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
    ');
    $stmt->execute([
        $orderId,
        $requestData['customer_details']['email'],
        $requestData['transaction_details']['gross_amount'],
        'pending',
        $midtransResponse['token']
    ]);
    */
    
    // For now, just log
    error_log("Transaction saved: $orderId");
}

/**
 * Update transaction status
 */
function updateTransactionStatus($orderId, $status) {
    // TODO: Implement database update
    // Example:
    /*
    $db = new PDO('mysql:host=localhost;dbname=raymaizing', 'username', 'password');
    $stmt = $db->prepare('UPDATE transactions SET status = ?, updated_at = NOW() WHERE order_id = ?');
    $stmt->execute([$status, $orderId]);
    */
    
    // For now, just log
    error_log("Transaction updated: $orderId -> $status");
}

/**
 * Activate subscription after successful payment
 */
function activateSubscription($orderId) {
    // TODO: Implement subscription activation
    // Example:
    /*
    // Get transaction details
    $db = new PDO('mysql:host=localhost;dbname=raymaizing', 'username', 'password');
    $stmt = $db->prepare('SELECT * FROM transactions WHERE order_id = ?');
    $stmt->execute([$orderId]);
    $transaction = $stmt->fetch();
    
    // Create/update subscription
    $stmt = $db->prepare('
        INSERT INTO subscriptions (user_email, tier, files_limit, status, start_date, end_date)
        VALUES (?, ?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH))
        ON DUPLICATE KEY UPDATE
            tier = VALUES(tier),
            files_limit = VALUES(files_limit),
            status = VALUES(status),
            end_date = DATE_ADD(NOW(), INTERVAL 1 MONTH)
    ');
    $stmt->execute([
        $transaction['customer_email'],
        $transaction['tier'],
        $transaction['files_limit'],
        'active'
    ]);
    
    // Send confirmation email
    sendConfirmationEmail($transaction['customer_email'], $transaction);
    */
    
    // For now, just log
    error_log("Subscription activated: $orderId");
}

/**
 * Send confirmation email
 */
function sendConfirmationEmail($email, $transaction) {
    // TODO: Implement email sending
    // Use PHPMailer, SendGrid, or other email service
    
    error_log("Confirmation email sent to: $email");
}

// Route requests
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

if ($requestMethod === 'POST') {
    if (strpos($requestUri, '/api/create-transaction') !== false) {
        createTransaction();
    } elseif (strpos($requestUri, '/api/midtrans-webhook') !== false) {
        handleWebhook();
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Endpoint not found'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
}
?>
