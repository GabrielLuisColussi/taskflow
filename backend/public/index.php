<?php

declare(strict_types=1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../src/Helpers/env.php';
require_once __DIR__ . '/../src/Services/Response.php';
require_once __DIR__ . '/../src/Config/database.php';
require_once __DIR__ . '/../src/Services/JwtService.php';
require_once __DIR__ . '/../src/Middleware/AuthMiddleware.php';
require_once __DIR__ . '/../src/Repositories/UserRepository.php';
require_once __DIR__ . '/../src/Controllers/AuthController.php';
require_once __DIR__ . '/../src/Repositories/TaskRepository.php';
require_once __DIR__ . '/../src/Controllers/TaskController.php';

loadEnv(__DIR__ . '/../.env');

require_once __DIR__ . '/../src/routes.php';