"use client";

import { useState, type FormEvent } from "react";

export default function CommentForm({
  onSubmit,
  isSubmitting,
  submitLabel,
  placeholder = "Escreva um comentário...",
  initialContent = "",
  onCancel,
  autoFocus,
}: {
  onSubmit: (content: string) => Promise<unknown>;
  isSubmitting: boolean;
  submitLabel: string;
  placeholder?: string;
  initialContent?: string;
  onCancel?: () => void;
  autoFocus?: boolean;
}) {
  const [content, setContent] = useState(initialContent);
  const canSubmit = content.trim().length > 0 && !isSubmitting;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    try {
      await onSubmit(content.trim());
      setContent("");
    } catch {
      // Keep the draft on failure so the visitor doesn't lose what they
      // wrote; the caller is responsible for surfacing the error itself.
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        rows={3}
        disabled={isSubmitting}
        autoFocus={autoFocus}
        className="w-full resize-y rounded-lg border border-zinc-300 bg-transparent p-3 text-sm text-foreground placeholder:text-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60 dark:border-zinc-700"
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Enviando..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-sm text-zinc-500 transition-colors hover:text-foreground dark:text-zinc-500"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
