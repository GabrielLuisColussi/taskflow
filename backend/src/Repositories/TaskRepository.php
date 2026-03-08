<?php

declare(strict_types=1);

class TaskRepository
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function listByUser(int $userId): array
    {
        $stmt = $this->pdo->prepare('SELECT id, user_id, title, description, status, priority, due_date, created_at, updated_at FROM tasks WHERE user_id = :user_id ORDER BY created_at DESC');
        $stmt->execute(['user_id' => $userId]);

        return $stmt->fetchAll();
    }

    public function create(int $userId, string $title, ?string $description, string $status, string $priority, ?string $dueDate): array
    {
        $stmt = $this->pdo->prepare('INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES (:user_id, :title, :description, :status, :priority, :due_date)');
        $stmt->execute([
            'user_id' => $userId,
            'title' => $title,
            'description' => $description,
            'status' => $status,
            'priority' => $priority,
            'due_date' => $dueDate,
        ]);

        $taskId = (int) $this->pdo->lastInsertId();
        return $this->findByIdForUser($taskId, $userId) ?? [];
    }

    public function findByIdForUser(int $taskId, int $userId): ?array
    {
        $stmt = $this->pdo->prepare('SELECT id, user_id, title, description, status, priority, due_date, created_at, updated_at FROM tasks WHERE id = :id AND user_id = :user_id LIMIT 1');
        $stmt->execute([
            'id' => $taskId,
            'user_id' => $userId,
        ]);

        $task = $stmt->fetch();
        return $task !== false ? $task : null;
    }

    public function update(int $taskId, int $userId, string $title, ?string $description, string $status, string $priority, ?string $dueDate): ?array
    {
        $stmt = $this->pdo->prepare('UPDATE tasks SET title = :title, description = :description, status = :status, priority = :priority, due_date = :due_date WHERE id = :id AND user_id = :user_id');
        $stmt->execute([
            'id' => $taskId,
            'user_id' => $userId,
            'title' => $title,
            'description' => $description,
            'status' => $status,
            'priority' => $priority,
            'due_date' => $dueDate,
        ]);

        if ($stmt->rowCount() === 0) {
            return $this->findByIdForUser($taskId, $userId);
        }

        return $this->findByIdForUser($taskId, $userId);
    }

    public function delete(int $taskId, int $userId): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM tasks WHERE id = :id AND user_id = :user_id');
        $stmt->execute([
            'id' => $taskId,
            'user_id' => $userId,
        ]);

        return $stmt->rowCount() > 0;
    }
}
