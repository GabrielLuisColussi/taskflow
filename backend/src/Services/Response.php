<?php

class Response
{
    public static function json(
        bool $success,
        string $message,
        $data = null,
        int $statusCode = 200,
        ?array $errors = null
    ): void {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');

        echo json_encode([
            'success' => $success,
            'message' => $message,
            'data'    => $data,
            'errors'  => $errors
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    public static function success(string $message, $data = null, int $statusCode = 200): void
    {
        self::json(true, $message, $data, $statusCode);
    }

    public static function error(string $message, int $statusCode = 400, ?array $errors = null): void
    {
        self::json(false, $message, null, $statusCode, $errors);
    }
}