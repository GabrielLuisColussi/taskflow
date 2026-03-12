<?php

class AuthController
{
    private UserRepository $users;

    public function __construct()
    {
        $this->users = new UserRepository();
    }

    private function jsonInput(): array
    {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }

    public function register(): void
    {
        $data = $this->jsonInput();

        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $password = (string)($data['password'] ?? '');

        $errors = [];
        if ($name === '') $errors['name'] = 'Nome é obrigatório';
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Email inválido';
        if (strlen($password) < 6) $errors['password'] = 'Senha deve ter no mínimo 6 caracteres';

        if ($errors) {
            Response::error('Validação falhou', 422, $errors);
        }

        if ($this->users->findByEmail($email)) {
            Response::error('Email já cadastrado', 409);
        }

        $hash = password_hash($password, PASSWORD_BCRYPT);
        $userId = $this->users->create($name, $email, $hash);

        $token = JwtService::generate(['sub' => $userId]);

        Response::success('Usuário criado com sucesso', [
            'token' => $token,
            'user' => $this->users->findById($userId)
        ], 201);
    }

    public function login(): void
    {
        $data = $this->jsonInput();

        $email = trim($data['email'] ?? '');
        $password = (string)($data['password'] ?? '');

        if ($email === '' || $password === '') {
            Response::error('Email e senha são obrigatórios', 422);
        }

        $user = $this->users->findByEmail($email);

        if (!$user || !password_verify($password, $user['password_hash'])) {
            Response::error('Credenciais inválidas', 401);
        }

        $token = JwtService::generate(['sub' => (int)$user['id']]);

        Response::success('Login realizado com sucesso', [
            'token' => $token,
            'user' => [
                'id' => (int)$user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'created_at' => $user['created_at'] ?? null
            ]
        ]);
    }

    public function me(): void
    {
        $payload = AuthMiddleware::requireAuth();
        $userId = (int)($payload['sub'] ?? 0);

        if (!$userId) {
            Response::error('Token inválido', 401);
        }

        $user = $this->users->findById($userId);

        if (!$user) {
            Response::error('Usuário não encontrado', 404);
        }

        Response::success('OK', $user);
    }
}