"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Minus, Plus } from "lucide-react";
import { useRef, useId, type ReactNode } from "react";
export function Modal({
  open,
  onClose,
  title,
  children,
  className = "",
  description,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  description?: string;
}) {
  const previousFocus = useRef<HTMLElement | null>(null);
  const descriptionId = useId();
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content
          className={`modal-panel ${className}`}
          aria-describedby={description ? descriptionId : undefined}
          onOpenAutoFocus={() => {
            previousFocus.current =
              document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            const target = previousFocus.current;
            if (target?.isConnected) target.focus({ preventScroll: true });
          }}
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          {description && (
            <Dialog.Description id={descriptionId} className="sr-only">
              {description}
            </Dialog.Description>
          )}
          <Dialog.Close className="icon-button modal-close" aria-label="Close">
            <X size={20} />
          </Dialog.Close>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export function Quantity({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="quantity">
      <button
        aria-label="Decrease quantity"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={14} />
      </button>
      <span aria-live="polite">{value}</span>
      <button
        aria-label="Increase quantity"
        disabled={value >= 10}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
