import { api } from "./client";

export async function listTasks(params = {}) {
  const { data } = await api.get("/tasks", { params });
  return data;
}

export async function createTask(payload) {
  const { data } = await api.post("/tasks", payload);
  return data;
}

export async function updateTaskStatus(id, status) {
  const { data } = await api.patch(`/tasks/${id}/status`, { status });
  return data;
}

export async function deleteTask(id) {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
}

export async function updateTask(id, payload) {
  const { data } = await api.put(`/tasks/${id}`, payload);
  return data;
}


