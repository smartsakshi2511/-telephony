<?php
include "time_zone.php";

$channel = $_REQUEST['channel'];
$host = "localhost";
$port = 5038;
$username = "cron";
$password = "1234";

$response = [];

$socket = fsockopen($host, $port, $errno, $errstr, 30);
if (!$socket) {
    $response['status'] = 'error';
    $response['message'] = "Socket Error: $errstr ($errno)";
    echo json_encode($response);
    exit;
}

// Login
fwrite($socket, "Action: Login\r\n");
fwrite($socket, "Username: $username\r\n");
fwrite($socket, "Secret: $password\r\n\r\n");

// Wait for login response
while (!feof($socket)) {
    $line = fgets($socket, 1024);
    if (strpos($line, "Response: Success") !== false) break;
    if (strpos($line, "Response: Error") !== false) {
        $response['status'] = 'error';
        $response['message'] = "Login Failed";
        fclose($socket);
        echo json_encode($response);
        exit;
    }
}

// Hangup
fwrite($socket, "Action: Hangup\r\n");
fwrite($socket, "Channel: $channel\r\n\r\n");

$success = false;
$hangupResponse = "";

while (!feof($socket)) {
    $line = fgets($socket, 1024);
    $hangupResponse .= $line;
    if (strpos($line, "Response: Success") !== false) {
        $success = true;
        break;
    }
    if (strpos($line, "Response: Error") !== false) {
        break;
    }
}

// Logoff
fwrite($socket, "Action: Logoff\r\n\r\n");
fclose($socket);

if ($success) {
    $response['status'] = 'success';
    $response['message'] = "Channel $channel hung up successfully.";
} else {
    $response['status'] = 'error';
    $response['message'] = "Failed to hang up channel. Raw response: $hangupResponse";
}

header('Content-Type: application/json');
echo json_encode($response);
