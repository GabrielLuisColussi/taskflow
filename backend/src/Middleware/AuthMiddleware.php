<?php

declare(strict_types=1);

class AuthMiddleware
{
    public function __construct(private readonly JwtService $jwtService)
    {
    }

    public function authenticate(): int
    {
        $token = $this->extractBearerToken();
        if ($token === null) {
            Response::error('Token ausente.', 401);
        }

        $payload = $this->jwtService->decodeToken($token);
        if ($payload === null || !isset($payload['sub'])) {
            Response::error('Token invalido ou expirado.', 401);
        }

        return (int) $payload['sub'];
    }

    private function extractBearerToken(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? null;

        if ($header === null && function_exists('getallheaders')) {
            $headers = getallheaders();
            if (isset($headers['Authorization'])) {
                $header = $headers['Authorization'];
            } elseif (isset($headers['authorization'])) {
                $header = $headers['authorization'];
            }
        }

        if ($header === null || !str_starts_with($header, 'Bearer ')) {
            return null;
        }

        return trim(substr($header, 7));
    }
}
