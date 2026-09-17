// ============================================================
// PORTGUARD AI — DRAWER COMPONENT (right-side slide-in)
// ============================================================

import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}

export default function Drawer({ open, onClose, title, children, width = '480px' }: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  // Trap focus
  useEffect(() => {
    if (open && drawerRef.current) {
      drawerRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="overlay-drawer" onClick={onClose} aria-hidden="true" />
      <div
        ref={drawerRef}
        className="drawer animate-slide-in"
        style={{ width }}
        role="dialog"
        aria-label={title}
        tabIndex={-1}
      >
        <div className="drawer__header">
          <h2 className="drawer__title">{title}</h2>
          <button className="drawer__close" onClick={onClose} aria-label="Close drawer">
            <X size={18} />
          </button>
        </div>
        <div className="drawer__body">
          {children}
        </div>
      </div>
    </>
  );
}
