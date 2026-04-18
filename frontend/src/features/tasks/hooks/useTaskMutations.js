import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTask,
  deleteTask,
  updateTask,
  updateTaskStatus,
} from "../api/tasks.service";

export function useTaskMutations() {
  const queryClient = useQueryClient();

  async function refreshTasks() {
    await queryClient.invalidateQueries({ queryKey: ["tasks"] });
  }

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: refreshTasks,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateTask(id, payload),
    onSuccess: refreshTasks,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateTaskStatus(id, status),
    onSuccess: refreshTasks,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: refreshTasks,
  });

  return {
    createMutation,
    updateMutation,
    statusMutation,
    deleteMutation,
  };
}