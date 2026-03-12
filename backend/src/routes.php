<?php

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Auth
if ($method === 'POST' && $uri === '/api/register') {
    (new AuthController())->register();
}

if ($method === 'POST' && $uri === '/api/login') {
    (new AuthController())->login();
}

if ($method === 'GET' && $uri === '/api/me') {
    (new AuthController())->me();
}

function routeNotFound(): void
{
    Response::error('Rota não encontrada', 404);
}

// Tasks (protegidas)
if ($method === 'GET' && $uri === '/api/tasks') {
    (new TaskController())->index();
}

if ($method === 'GET' && preg_match('#^/api/tasks/(\d+)$#', $uri, $m)) {
    (new TaskController())->show((int)$m[1]);
}

if ($method === 'POST' && $uri === '/api/tasks') {
    (new TaskController())->store();
}

if ($method === 'PUT' && preg_match('#^/api/tasks/(\d+)$#', $uri, $m)) {
    (new TaskController())->update((int)$m[1]);
}

if ($method === 'PATCH' && preg_match('#^/api/tasks/(\d+)/status$#', $uri, $m)) {
    (new TaskController())->updateStatus((int)$m[1]);
}

if ($method === 'DELETE' && preg_match('#^/api/tasks/(\d+)$#', $uri, $m)) {
    (new TaskController())->destroy((int)$m[1]);
}


$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Health
if ($method === 'GET' && $uri === '/api/health') {
    Response::success('API TaskFlow rodando ✅', [
        'env'  => env('APP_ENV', 'local'),
        'time' => date('Y-m-d H:i:s'),
    ]);
}

// DB Test
if ($method === 'GET' && $uri === '/api/db-test') {
    try {
        $pdo = Database::connect();
        $stmt = $pdo->query('SELECT NOW() AS server_time');
        $result = $stmt->fetch();

        Response::success('Conexão com banco OK ✅', $result);
    } catch (Throwable $e) {
        Response::error('Erro ao conectar no banco', 500, [
            'details' => env('APP_DEBUG') === 'true' ? $e->getMessage() : null
        ]);
    }
}

routeNotFound();