<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Sanitize incoming form inputs
    $name    = htmlspecialchars(strip_tags(trim($_POST['name'])));
    $email   = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $phone   = htmlspecialchars(strip_tags(trim($_POST['phone'])));
    $service = htmlspecialchars(strip_tags(trim($_POST['service-type'])));
    $date    = htmlspecialchars(strip_tags(trim($_POST['event-date'])));
    $message = htmlspecialchars(strip_tags(trim($_POST['message'])));

    // Validate core fields
    if (empty($name) || empty($email) || empty($phone) || empty($message)) {
        echo "Please fill in all required fields.";
        exit;
    }

    // 2. Define Recipient Configurations
    $director_email = "legitjunior9@gmail.com"; // Your official email
    
    // 3. EMAIL TO DIRECTOR
    $director_subject = "New Booking/Inquiry from " . $name;
    $director_body    = "
    <html>
    <head>
        <title>New Production Inquiry</title>
    </head>
    <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
        <h2 style='color: #d4af37;'>New Booking Request</h2>
        <p><strong>Client Name:</strong> {$name}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Phone:</strong> {$phone}</p>
        <p><strong>Requested Service:</strong> {$service}</p>
        <p><strong>Target Date:</strong> " . (!empty($date) ? $date : 'Not specified') . "</p>
        <p><strong>Project Overview:</strong><br>" . nl2br($message) . "</p>
    </body>
    </html>
    ";

    // 4. CONFIRMATION EMAIL TO CLIENT
    $client_subject = "We've Received Your Booking Request - Coast Photographic Services";
    $client_body    = "
    <html>
    <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
        <div style='max-width: 600px; margin: 0 auto; border-top: 4px solid #d4af37; padding-top: 20px;'>
            <h2 style='color: #111;'>Hello {$name},</h2>
            <p>Thank you for reaching out to <strong>Coast Photographic Services</strong>.</p>
            <p>We have received your request for <strong>{$service}</strong>. Our production team is currently reviewing your project details and proposed timeline. Director Joshua Ochiewo or a client manager will get back to you within 24 business hours to finalize your consultation.</p>
            <br>
            <p>Best regards,</p>
            <p><strong>Production Team</strong><br>Coast Photographic Services</p>
        </div>
    </body>
    </html>
    ";

    // Set common HTML headers
    $headers  = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: webmaster@coastphotographicservices.com" . "\r\n"; // Must match your domain

    // Send Emails via server mail system
    $mail_to_director = mail($director_email, $director_subject, $director_body, $headers);
    $mail_to_client   = mail($email, $client_subject, $client_body, $headers);

    // 5. REDIRECT OR THANK YOU STATUS
    if ($mail_to_director && $mail_to_client) {
        // Smoothly send them to a success state or back to contact page with success alert
        echo "<script>
                alert('Thank you! Your message has been sent. A confirmation email has been sent to you.');
                window.location.href = 'contact.html';
              </script>";
    } else {
        echo "System error: Mail delivery failed. Please try again or contact us directly via WhatsApp.";
    }
} else {
    // If someone tries to access contact.php directly, kick them back to the form page
    header("Location: contact.html");
    exit;
}
?>