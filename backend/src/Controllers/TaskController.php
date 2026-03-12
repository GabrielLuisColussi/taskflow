<?php

class TaskController
{
    private TaskRepository $tasks;

    public function __construct()
    {
        $this->tasks = new TaskRepository();
    }

    private function jsonInput(): array
    {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }

    private function userIdFromToken(): int
    {
        $payload = AuthMiddleware::requireAuth();
        return (int)($payload['sub'] ?? 0);
    }

    public function index(): void
    {
        $userId = $this->userIdFromToken();

        $filters = [
            'status' => $_GET['status'] ?? null,
            'priority' => $_GET['priority'] ?? null,
            'search' => $_GET['search'] ?? null,
        ];

        $data = $this->tasks->listByUser($userId, $filters);
        Response::success('OK', $data);
    }

    public function show(int $id): void
    {
        $userId = $this->userIdFromToken();
        $task = $this->tasks->findById($id, $userId);

        if (!$task) {
            Response::error('Tarefa não encontrada', 404);
        }

        Response::success('OK', $task);
    }

    public function store(): void
    {
        $userId = $this->userIdFromToken();
        $data = $this->jsonInput();

        $title = trim($data['title'] ?? '');
        if ($title === '') {
            Response::error('Validação falhou', 422, ['title' => 'Título é obrigatório']);
        }

        $allowedStatus = ['pendente', 'em_andamento', 'concluida'];
        $allowedPriority = ['baixa', 'media', 'alta'];

        if (isset($data['status']) && !in_array($data['status'], $allowedStatus, true)) {
            Response::error('Status inválido', 422);
        }

        if (isset($data['priority']) && !in_array($data['priority'], $allowedPriority, true)) {
            Response::error('Prioridade inválida', 422);
        }

        $id = $this->tasks->create($userId, [
            'title' => $title,
            'description' => $data['description'] ?? null,
            'status' => $data['status'] ?? 'pendente',
            'priority' => $data['priority'] ?? 'media',
            'due_date' => $data['due_date'] ?? null,
        ]);

        $task = $this->tasks->findById($id, $userId);
        Response::success('Tarefa criada com sucesso', $task, 201);
    }

    public function update(int $id): void
    {
        $userId = $this->userIdFromToken();
        $current = $this->tasks->findById($id, $userId);

        if (!$current) {
            Response::error('Tarefa não encontrada', 404);
        }

        $data = $this->jsonInput();
        $title = trim($data['title'] ?? $current['title']);

        $allowedStatus = ['pendente', 'em_andamento', 'concluida'];
        $allowedPriority = ['baixa', 'media', 'alta'];

        if (isset($data['status']) && !in_array($data['status'], $allowedStatus, true)) {
            Response::error('Status inválido', 422);
        }

        if (isset($data['priority']) && !in_array($data['priority'], $allowedPriority, true)) {
            Response::error('Prioridade inválida', 422);
        }

        $this->tasks->update($id, $userId, [
            'title' => $title,
            'description' => $data['description'] ?? $current['description'],
            'status' => $data['status'] ?? $current['status'],
            'priority' => $data['priority'] ?? $current['priority'],
            'due_date' => $data['due_date'] ?? $current['due_date'],
        ]);

        $task = $this->tasks->findById($id, $userId);
        Response::success('Tarefa atualizada com sucesso', $task);
    }

    public function updateStatus(int $id): void
    {
        $userId = $this->userIdFromToken();
        $current = $this->tasks->findById($id, $userId);

        if (!$current) {
            Response::error('Tarefa não encontrada', 404);
        }

        $data = $this->jsonInput();
        $status = $data['status'] ?? '';

        $allowedStatus = ['pendente', 'em_andamento', 'concluida'];
        if (!in_array($status, $allowedStatus, true)) {
            Response::error('Status inválido', 422, ['status' => 'Use: pendente, em_andamento, concluida']);
        }

        $this->tasks->updateStatus($id, $userId, $status);
        $task = $this->tasks->findById($id, $userId);

        Response::success('Status atualizado', $task);
    }

    public function destroy(int $id): void
    {
        $userId = $this->userIdFromToken();
        $current = $this->tasks->findById($id, $userId);

        if (!$current) {
            Response::error('Tarefa não encontrada', 404);
        }

        $this->tasks->delete($id, $userId);
        Response::success('Tarefa removida com sucesso');
    }
}
