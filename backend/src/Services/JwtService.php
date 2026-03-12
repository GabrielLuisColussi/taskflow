<?php

class JwtService
{
    private static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string
    {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        return base64_decode(strtr($data, '-_', '+/'));
    }

    public static function generate(array $payload, int $expiresInSeconds = 86400): string
    {
        $header = ['alg' => 'HS256', 'typ' => 'JWT'];

        $now = time();
        $payload = array_merge($payload, [
            'iat' => $now,
            'exp' => $now + $expiresInSeconds
        ]);

        $baseHeader  = self::base64UrlEncode(json_encode($header));
        $basePayload = self::base64UrlEncode(json_encode($payload));

        $secret = env('JWT_SECRET', 'change_me');
        $signature = hash_hmac('sha256', "{$baseHeader}.{$basePayload}", $secret, true);
        $baseSignature = self::base64UrlEncode($signature);

        return "{$baseHeader}.{$basePayload}.{$baseSignature}";
    }

    public static function verify(string $token): array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            throw new Exception('Token inválido');
        }

        [$baseHeader, $basePayload, $baseSignature] = $parts;

        $secret = env('JWT_SECRET', 'change_me');
        $expected = self::base64UrlEncode(
            hash_hmac('sha256', "{$baseHeader}.{$basePayload}", $secret, true)
        );

        if (!hash_equals($expected, $baseSignature)) {
            throw new Exception('Assinatura inválida');
        }

        $payload = json_decode(self::base64UrlDecode($basePayload), true);
        if (!is_array($payload)) {
            throw new Exception('Payload inválido');
        }

        if (isset($payload['exp']) && time() > (int)$payload['exp']) {
            throw new Exception('Token expirado');
        }

        return $payload;
    }
}