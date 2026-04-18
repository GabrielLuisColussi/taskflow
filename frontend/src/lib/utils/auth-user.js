export function deriveNameFromEmail(email = "") {
  const prefix = email.split("@")[0] || "";
  if (!prefix) return "Workspace";

  return prefix
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function saveUserSession({ token, name, email }) {
  if (token) localStorage.setItem("token", token);
  if (email) localStorage.setItem("taskflow_user_email", email);

  const resolvedName = name || deriveNameFromEmail(email);
  if (resolvedName) {
    localStorage.setItem("taskflow_user_name", resolvedName);
  }
}

export function getStoredUser() {
  const email = localStorage.getItem("taskflow_user_email") || "";
  const name =
    localStorage.getItem("taskflow_user_name") || deriveNameFromEmail(email);

  return { name, email };
}

export function clearUserSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("taskflow_user_name");
  localStorage.removeItem("taskflow_user_email");
}