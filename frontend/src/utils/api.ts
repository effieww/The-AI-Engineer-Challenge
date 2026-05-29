/**
 * Base URL for the FastAPI backend.
 * - Local dev: leave unset — Next.js rewrites /api/chat to http://127.0.0.1:8000
 * - Vercel: leave unset — same-origin /api/chat is routed to api/index.py
 * - Split deploy: set NEXT_PUBLIC_API_URL to your backend URL (e.g. https://your-api.vercel.app)
 */
export function getApiBase(): string {
  const url = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  return url ?? "";
}

export type ChatResponse = { reply: string };
export type ChatError = { detail: string | { msg?: string }[] };

export async function sendChatMessage(message: string): Promise<string> {
  const res = await fetch(`${getApiBase()}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = (await res.json().catch(() => ({}))) as ChatResponse & ChatError;

  if (!res.ok) {
    const detail = data.detail;
    const messageText =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail.map((d) => d.msg ?? JSON.stringify(d)).join(", ")
          : `Request failed (${res.status})`;
    throw new Error(messageText);
  }

  if (!data.reply) {
    throw new Error("No reply from the coach.");
  }

  return data.reply;
}
