<?php

class TaskRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = Database::connect();
    }

    public function listByUser(int $userId, array $filters = []): array
    {
        $where = ["user_id = :user_id"];
        $params = ['user_id' => $userId];

        if (!empty($filters['status'])) {
            $where[] = "status = :status";
            $params['status'] = $filters['status'];
        }

        if (!empty($filters['priority'])) {
            $where[] = "priority = :priority";
            $params['priority'] = $filters['priority'];
        }

        if (!empty($filters['search'])) {
            $where[] = "(title LIKE :search OR description LIKE :search)";
            $params['search'] = '%' . $filters['search'] . '%';
        }

        $sql = "SELECT * FROM tasks WHERE " . implode(" AND ", $where) . " ORDER BY created_at DESC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll();
    }

    public function findById(int $id, int $userId): ?array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM tasks WHERE id = :id AND user_id = :user_id LIMIT 1");
        $stmt->execute(['id' => $id, 'user_id' => $userId]);
        $task = $stmt->fetch();

        return $task ?: null;
    }

    public function create(int $userId, array $data): int
    {
        $stmt = $this->pdo->prepare("
            INSERT INTO tasks (user_id, title, description, status, priority, due_date)
            VALUES (:user_id, :title, :description, :status, :priority, :due_date)
        ");

        $stmt->execute([
            'user_id' => $userId,
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'status' => $data['status'] ?? 'pendente',
            'priority' => $data['priority'] ?? 'media',
            'due_date' => $data['due_date'] ?? null,
        ]);

        return (int)$this->pdo->lastInsertId();
    }

    public function update(int $id, int $userId, array $data): bool
    {
        $stmt = $this->pdo->prepare("
            UPDATE tasks
            SET title = :title,
                description = :description,
                status = :status,
                priority = :priority,
                due_date = :due_date
            WHERE id = :id AND user_id = :user_id
        ");

        return $stmt->execute([
            'id' => $id,
            'user_id' => $userId,
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'status' => $data['status'] ?? 'pendente',
            'priority' => $data['priority'] ?? 'media',
            'due_date' => $data['due_date'] ?? null,
        ]);
    }

    public function updateStatus(int $id, int $userId, string $status): bool
    {
        $stmt = $this->pdo->prepare("
            UPDATE tasks SET status = :status
            WHERE id = :id AND user_id = :user_id
        ");

        return $stmt->execute([
            'id' => $id,
            'user_id' => $userId,
            'status' => $status,
        ]);
    }

    public function delete(int $id, int $userId): bool
    {
        $stmt = $this->pdo->prepare("DELETE FROM tasks WHERE id = :id AND user_id = :user_id");
        return $stmt->execute(['id' => $id, 'user_id' => $userId]);
    }
}
