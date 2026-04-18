const STORAGE_KEY = "taskflow_workspace_settings_v1";

export const DEFAULT_WORKSPACE_SETTINGS = {
  workspaceName: "Workspace de tarefas",
  dailyGoal: 5,
  showFocusBoard: true,
  compactCards: false,
  defaultDisplayMode: "cards",
};

export function getWorkspaceSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_WORKSPACE_SETTINGS;

    const parsed = JSON.parse(raw);

    return {
      ...DEFAULT_WORKSPACE_SETTINGS,
      ...parsed,
    };
  } catch {
    return DEFAULT_WORKSPACE_SETTINGS;
  }
}

export function saveWorkspaceSettings(values) {
  const current = getWorkspaceSettings();
  const next = {
    ...current,
    ...values,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}