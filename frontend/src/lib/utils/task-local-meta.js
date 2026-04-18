const STORAGE_KEY = "taskflow_task_local_meta_v1";

export const DEFAULT_TASK_META = {
  favorite: false,
  tags: [],
  checklist: [],
};

function normalizeChecklist(items = []) {
  return items
    .filter((item) => item && typeof item.text === "string" && item.text.trim())
    .map((item) => ({
      id: item.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text: item.text.trim(),
      done: Boolean(item.done),
    }));
}

export function normalizeTaskMeta(meta = {}) {
  const tags = Array.isArray(meta.tags)
    ? [...new Set(meta.tags.map((tag) => String(tag).trim()).filter(Boolean))]
    : [];

  return {
    favorite: Boolean(meta.favorite),
    tags,
    checklist: normalizeChecklist(meta.checklist),
  };
}

export function loadTaskMetaMap() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    const normalized = {};

    Object.entries(parsed).forEach(([taskId, meta]) => {
      normalized[taskId] = normalizeTaskMeta(meta);
    });

    return normalized;
  } catch {
    return {};
  }
}

export function saveTaskMetaMap(metaMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(metaMap));
}