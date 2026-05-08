"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/common/Button";
import { validateMessage } from "@/lib/filters";

export function ChatInput({
  disabled,
  placeholder,
  onSend,
}: {
  disabled?: boolean;
  placeholder: string;
  onSend: (body: string) => string | null;
}) {
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    const validationError = validateMessage(body);
    if (validationError) {
      setError(validationError);
      return;
    }

    const sendError = onSend(body);
    if (sendError) {
      setError(sendError);
      return;
    }

    setBody("");
    setError(null);
  }

  return (
    <form className="border-t border-line bg-white p-3" onSubmit={submit}>
      <div className="flex gap-2">
        <input
          className="h-11 min-w-0 flex-1 rounded-md border border-line px-3 outline-none transition placeholder:text-neutral-400 focus:border-ink disabled:bg-neutral-100"
          disabled={disabled}
          maxLength={140}
          onChange={(event) => setBody(event.target.value)}
          placeholder={placeholder}
          value={body}
        />
        <Button className="w-12 px-0" disabled={disabled} type="submit">
          <Send size={18} aria-hidden />
          <span className="sr-only">Send</span>
        </Button>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs font-semibold">
        <p className={error ? "text-rust" : "text-neutral-500"}>
          {disabled ? "This room stays silent." : error ?? "No links, contact info, or long posts."}
        </p>
        <p className="text-neutral-500">{body.length}/140</p>
      </div>
    </form>
  );
}
