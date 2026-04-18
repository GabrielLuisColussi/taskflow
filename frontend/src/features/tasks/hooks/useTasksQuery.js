import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { listTasks } from "../api/tasks.service";

export function useTasksQuery(filters) {
  const query = useQuery({
    queryKey: ["tasks", filters],
    queryFn: () => listTasks(filters),
  });

  const tasks = useMemo(() => query.data?.data ?? [], [query.data]);

  return {
    ...query,
    tasks,
  };
}