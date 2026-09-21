"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * ConfirmDialog
 * Lichtgewicht, afhankelijkheidsvrije bevestigingsmodal voor het klantportaal.
 * Vervangt window.confirm/alert. Sluit op Escape, klik buiten of Annuleren.
 *
 * Props:
 *  - open           tonen/verbergen
 *  - title          kop
 *  - description     tekst (string of node)
 *  - confirmLabel    tekst op de bevestigknop (default "Verwijderen")
 *  - cancelLabel     default "Annuleren"
 *  - tone            "danger" (default) of "primary" — kleur van de bevestigknop
 *  - busy            bezig met de actie -> knoppen disabled + spinner
 *  - error           foutmelding om binnen de modal te tonen (modal blijft open)
 *  - onConfirm       callback voor de bevestigknop
 *  - onClose         callback voor sluiten/annuleren
 */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Verwijderen",
  cancelLabel = "Annuleren",
  tone = "danger",
  busy = false,
  error = "",
  onConfirm,
  onClose,
}) {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape" && !busy) onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    confirmRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open, busy, onClose]);

  if (!open || typeof document === "undefined") return null;

  const confirmClasses =
    tone === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-[linear-gradient(135deg,#2D6BE4_0%,#1B3A6B_100%)] hover:shadow-lg hover:shadow-secondary/20";

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <button
        type="button"
        aria-label="Sluiten"
        onClick={() => !busy && onClose?.()}
        className="absolute inset-0 h-full w-full cursor-default bg-primary/40 backdrop-blur-[2px]"
      />

      <div className="relative w-full max-w-md rounded-2xl border border-blue-100 bg-white p-6 shadow-[0_24px_60px_rgba(27,58,107,0.25)]">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${
              tone === "danger" ? "bg-red-50 text-red-600" : "bg-blue-50 text-secondary"
            }`}
          >
            <i className="fa-solid fa-triangle-exclamation" />
          </div>
          <div className="min-w-0">
            <h2 id="confirm-dialog-title" className="text-base font-bold text-primary">
              {title}
            </h2>
            {description && (
              <div className="mt-1 text-sm text-gray-600">{description}</div>
            )}
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <i className="fa-solid fa-circle-exclamation mr-2" />
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => onClose?.()}
            disabled={busy}
            className="rounded-xl border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-blue-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={() => onConfirm?.()}
            disabled={busy}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60 ${confirmClasses}`}
          >
            {busy && <i className="fa-solid fa-spinner fa-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
