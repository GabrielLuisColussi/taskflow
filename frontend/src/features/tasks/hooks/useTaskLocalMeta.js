import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_TASK_META,
  loadTaskMetaMap,
  normalizeTaskMeta,
  saveTaskMetaMap,
} from "../../../lib/utils/task-local-meta";

export function useTaskLocalMeta() {
  const [metaMap, setMetaMap] = useState(() => loadTaskMetaMap());

  useEffect(() => {
    saveTaskMetaMap(metaMap);
  }, [metaMap]);

  const getMeta = useCallback(
    (taskId) => {
      if (!taskId) return DEFAULT_TASK_META;
      return normalizeTaskMeta(metaMap[String(taskId)] || DEFAULT_TASK_META);
    },
    [metaMap]
  );

  const updateMeta = useCallback((taskId, updater) => {
    if (!taskId) return;

    setMetaMap((current) => {
      const currentMeta = normalizeTaskMeta(current[String(taskId)] || DEFAULT_TASK_META);
      const nextMeta =
        typeof updater === "function"
          ? normalizeTaskMeta(updater(currentMeta))
          : normalizeTaskMeta({ ...currentMeta, ...updater });

      return {
        ...current,
        [String(taskId)]: nextMeta,
      };
    });
  }, []);

  const toggleFavorite = useCallback(
    (taskId) => {
      updateMeta(taskId, (current) => ({
        ...current,
        favorite: !current.favorite,
      }));
    },
    [updateMeta]
  );

  return {
    metaMap,
    getMeta,
    updateMeta,
    toggleFavorite,
  };
}