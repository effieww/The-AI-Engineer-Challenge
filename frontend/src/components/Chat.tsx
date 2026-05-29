"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { sendChatMessage } from "@/utils/api";

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
}

const STARTER_PROMPTS = [
  "I'm feeling stressed about work.",
  "Help me build a morning habit.",
  "I need a confidence boost today.",
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi — I'm your supportive mental coach. What's on your mind today? You can share stress, motivation, habits, or confidence — I'm here to help.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  async function submitMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    setInput("");
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const reply = await sendChatMessage(trimmed);
      setMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, role: "assistant", content: reply },
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void submitMessage(input);
  }

  return (
    <div className="mx-auto flex h-[min(100dvh,900px)] w-full max-w-2xl flex-col px-4 py-6 sm:px-6">
      <header className="mb-6 shrink-0 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-coach-teal">
          AI Engineer Challenge
        </p>
        <h1 className="font-display mt-1 text-3xl font-semibold text-coach-deep sm:text-4xl">
          Mindful Coach
        </h1>
        <p className="mt-2 text-sm text-coach-ink/80">
          Support for stress, motivation, habits &amp; confidence
        </p>
      </header>

      <div
        className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-coach-sand bg-white shadow-lg shadow-coach-deep/5"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <ul className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed sm:max-w-[80%] ${
                  m.role === "user"
                    ? "rounded-br-md bg-coach-teal text-white"
                    : "rounded-bl-md bg-coach-cream text-coach-ink border border-coach-sand"
                }`}
              >
                {m.content}
              </div>
            </li>
          ))}
          {loading && (
            <li className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md border border-coach-sand bg-coach-cream px-4 py-3 text-coach-ink/70">
                <span className="inline-flex gap-1" aria-label="Coach is typing">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-coach-teal [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-coach-teal [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-coach-teal [animation-delay:300ms]" />
                </span>
              </div>
            </li>
          )}
          <div ref={bottomRef} />
        </ul>

        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 border-t border-coach-sand px-4 py-3">
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => void submitMessage(prompt)}
                disabled={loading}
                className="rounded-full border border-coach-teal/30 bg-white px-3 py-1.5 text-sm text-coach-deep transition hover:border-coach-teal hover:bg-coach-cream disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div
            className="mx-4 mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex shrink-0 gap-2 border-t border-coach-sand p-4"
        >
          <label htmlFor="chat-input" className="sr-only">
            Your message
          </label>
          <textarea
            id="chat-input"
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Share what's on your mind…"
            disabled={loading}
            className="min-h-[44px] max-h-32 flex-1 resize-y rounded-xl border border-coach-sand bg-coach-cream px-4 py-2.5 text-coach-ink placeholder:text-coach-ink/45 focus:border-coach-teal focus:outline-none focus:ring-2 focus:ring-coach-teal/20 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="shrink-0 self-end rounded-xl bg-coach-coral px-5 py-2.5 font-medium text-white transition hover:bg-coach-coral/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
