// src/lib/utils/uuid.js
export function uuid() {
  return crypto.randomUUID?.() || Math.random().toString(36).slice(2);
}
