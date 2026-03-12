<?php

class AuthMiddleware
{
    public static function requireAuth(): array
    {
        $headers = getallheaders();
        $auth = $headers['Authorization'] ?? $headers['authorization'] ?? null;

        if (!$auth || !str_starts_with($auth, 'Bearer ')) {
            Response::error('Não autorizado', 401);
        }

        $token = trim(str_replace('Bearer', '', $auth));

        try {
            return JwtService::verify($token);
        } catch (Throwable $e) {
            Response::error('Token inválido', 401, [
                'details' => env('APP_DEBUG') === 'true' ? $e->getMessage() : null
            ]);
        }
    }
}