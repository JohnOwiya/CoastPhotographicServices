<?php
// Safeguard: Block direct URL access; only allow POST submissions
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 1. Sanitize and collect form inputs to prevent injection vulnerabilities
    $name    = filter_var(trim($_POST["name"]), FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $email   = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone   = filter_var(trim($_POST["phone"]), FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $service = filter_var(trim($_POST["service-type"]), FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $date    = filter_var(trim($_POST["event-date"]), FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $message = filter_var(trim($_POST["message"]), FILTER_SANITIZE_FULL_SPECIAL_CHARS);

    // Validate critical required fields
    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400);
        echo "Please complete all required fields.";
        exit;
    }

    // 2. Set Destination Addresses
    $photographer_email = "coast.photographic.cs69@gmail.com";
    
    // 3. EMAIL 1: Format the Alert to the Photographer
    $photo_subject = "New Studio Booking Request from: $name";
    
    $photo_body = "<h3>You have received a new booking enquiry:</h3>";
    $photo_body .= "<p><strong>Client Name:</strong> $name</p>";
    $photo_body .= "<p><strong>Email Address:</strong> $email</p>";
    $photo_body .= "<p><strong>Phone Number:</strong> $phone</p>";
    $photo_body .= "<p><strong>Service Requested:</strong> $service</p>";
    $photo_body .= "<p><strong>Proposed Event Date:</strong> " . (!empty($date) ? $date : "Not Specified") . "</p>";
    $photo_body .= "<p><strong>Project Details Brief:</strong><br>" . nl2br($message) . "</p>";

    // Headers for sending HTML emails to the photographer
    $photo_headers = "MIME-Version: 1.0" . "\r\n";
    $photo_headers .= "Content-Type: text/html; charset=UTF-8" . "\r\n";
    $photo_headers .= "From: Coast Production Website <noreply@coastphotographic.com>" . "\r\n";
    $photo_headers .= "Reply-To: $email" . "\r\n"; // Clicking reply directly emails the client

    // 4. EMAIL 2: Format the Auto-Response Receipt to the Client
    $client_subject = "We've Received Your Session Request! - Coast Photographic Services";
    
    $client_body = "<div style='font-family: Arial, sans-serif; padding: 20px; background-color: #121212; color: #ffffff; border-radius: 6px;'>";
    $client_body .= "<h2 style='color: #d4af37;'>Hello $name,</h2>";
    $client_body .= "<p>Thank you for reaching out to Coast Photographic Services. We have successfully received your production request.</p>";
    $client_body .= "<p>Our creative team is currently reviewing your timeline and specifications. We will get back to you with an official confirmation or quotation within the next 24 hours.</p>";
    $client_body .= "<br>";
    $client_body .= "<hr style='border: 0; border-top: 1px solid #333;'>";
    $client_body .= "<p style='font-size: 0.85rem; color: #a0a0a0;'>This is an automated delivery receipt for your records. Please do not reply directly to this message.</p>";
    $client_body .= "</div>";

    // Headers for sending HTML email to the client
    $client_headers = "MIME-Version: 1.0" . "\r\n";
    $client_headers .= "Content-Type: text/html; charset=UTF-8" . "\r\n";
    $client_headers .= "From: Coast Photographic Services <$photographer_email>" . "\r\n";

    // 5. Execution Matrix (Fire both emails)
    $send_to_photographer = mail($photographer_email, $photo_subject, $photo_body, $photo_headers);
    $send_to_client       = mail($email, $client_subject, $client_body, $client_headers);

    if ($send_to_photographer && $send_to_client) {
        http_response_code(200);
        echo "Success";
    } else {
        http_response_code(500);
        echo "Mailing engine configuration error. Please try again later.";
    }
} else {
    http_response_code(403);
    echo "Direct access restricted.";
}
?>