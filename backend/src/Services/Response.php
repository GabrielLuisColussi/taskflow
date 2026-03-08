<?php

declare(strict_types=1);

class Response
{
    public static function json(array $payload, int $statusCode = 200): never
    {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function success(array $data = [], int $statusCode = 200): never
    {
        self::json([
            'ok' => true,
            'data' => $data,
        ], $statusCode);
    }

    public static function error(string $message, int $statusCode = 400, array $errors = []): never
    {
        $payload = [
            'ok' => false,
            'message' => $message,
        ];

        if ($errors !== []) {
            $payload['errors'] = $errors;
        }

        self::json($payload, $statusCode);
    }
}
