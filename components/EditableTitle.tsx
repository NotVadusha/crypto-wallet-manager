"use client";

import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

interface EditableTitleProps {
  value: string;
  placeholder?: string;
}

export const EditableTitle = ({
  value,
  placeholder = "Untitled",
}: EditableTitleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<string>(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSave = (next: string) => {
    console.log(next);
  };

  useEffect(() => {
    if (isEditing) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [isEditing]);

  async function commit() {
    const next = draft.trim() || placeholder;
    setIsEditing(false);
    if (next !== value) await onSave(next);
  }

  function cancel() {
    setDraft(value);
    setIsEditing(false);
  }

  return (
    <div className="flex items-center gap-3">
      {isEditing ? (
        <span className="relative inline-block max-w-48">
          <span
            className="invisible whitespace-pre font-black tracking-tight"
            aria-hidden
          >
            {draft || "\u00A0"}
          </span>
          <Input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") cancel();
            }}
            className="absolute inset-0 w-full min-w-[1ch] h-auto border-0 bg-transparent px-0 font-black tracking-tight shadow-none focus-visible:ring-0"
          />
        </span>
      ) : (
        <button
          type="button"
          onClick={() => {
            setDraft(value);
            setIsEditing(true);
          }}
          className="text-left font-black tracking-tight outline-none"
          aria-label="Edit title"
        >
          {value || placeholder}
        </button>
      )}

      <button
        type="button"
        onClick={() => {
          setDraft(value);
          setIsEditing(true);
        }}
        aria-label="Edit title"
        className="size-3.5 p-0"
      >
        <Pencil className="size-3.5 cursor-pointer text-muted-foreground" />
      </button>
    </div>
  );
};
