import dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.CANVAS_BASE_URL;
const TOKEN = process.env.CANVAS_TOKEN;
const OUTCOMES_BASE =
  process.env.OUTCOMES_BASE_URL;
const OUTCOMES_TOKEN =
  process.env.OUTCOMES_TOKEN;


export async function canvasRequest(
  method,
  path,
  params = null
) {
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`
    }
  };

  if (params) {
    options.headers["Content-Type"] =
      "application/x-www-form-urlencoded";

    options.body = params;
  }

  const res = await fetch(
    `${BASE_URL}${path}`,
    options
  );

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`${res.status}: ${text}`);
  }

  return text ? JSON.parse(text) : {};
}

export async function createAlignmentSet(
  outcomeIds
) {
  const res = await fetch(
    `${OUTCOMES_BASE}/api/alignment_sets`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": TOKEN
      },
      body: JSON.stringify({
        outcome_ids: outcomeIds,
        includes: [
          "outcomes",
          "source_context_info"
        ]
      })
    }
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.json();
}