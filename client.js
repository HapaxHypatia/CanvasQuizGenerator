import dotenv from "dotenv";
dotenv.config();

const BASE = process.env.CANVAS_BASE_URL;
const TOKEN = process.env.CANVAS_TOKEN;

export async function canvasRequest(path, options = {}) {
    // allow absolute URLs
  const url = path.startsWith("http")
    ? path
    : `${BASE}${path}`;

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text}`);
  }

  return res.json();
}