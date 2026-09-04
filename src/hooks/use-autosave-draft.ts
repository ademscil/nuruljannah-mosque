"use client";

import { useEffect, useState, useCallback, useRef } from "react";

export interface UseAutoSaveDraftOptions<T> {
  key: string;
  data: T;
  isDirty?: boolean;
  debounceMs?: number;
  onRestore?: (restoredData: T) => void;
}

export function useAutoSaveDraft<T>({
  key,
  data,
  isDirty = false,
  debounceMs = 1000,
  onRestore,
}: UseAutoSaveDraftOptions<T>) {
  const [hasDraft, setHasDraft] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return Boolean(localStorage.getItem(`draft_${key}`));
    } catch {
      return false;
    }
  });

  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(`draft_${key}`);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return typeof parsed._savedAt === "string" ? parsed._savedAt : null;
    } catch {
      return null;
    }
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced auto-save when data is dirty
  useEffect(() => {
    if (!isDirty) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      try {
        const savedAtTime = new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const payload = {
          ...data,
          _savedAt: savedAtTime,
        };
        localStorage.setItem(`draft_${key}`, JSON.stringify(payload));
        setHasDraft(true);
        setDraftSavedAt(savedAtTime);
      } catch {
        // Handle storage quota error
      }
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [key, data, isDirty, debounceMs]);

  const restoreDraft = useCallback(() => {
    try {
      const stored = localStorage.getItem(`draft_${key}`);
      if (stored && onRestore) {
        const parsed = JSON.parse(stored);
        delete parsed._savedAt;
        onRestore(parsed as T);
      }
    } catch {
      // Handle restore error
    }
  }, [key, onRestore]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(`draft_${key}`);
      setHasDraft(false);
      setDraftSavedAt(null);
    } catch {
      // Handle remove error
    }
  }, [key]);

  return {
    hasDraft,
    draftSavedAt,
    restoreDraft,
    clearDraft,
  };
}

