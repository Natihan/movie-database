import React, { useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";

export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
  from = "right",
  backdropClassName = "bg-black bg-opacity-50",
}) {
  const drawerRef = useRef(null);
  const touchStartX = useRef(null);
  const touchCurrentX = useRef(null);

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const onEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose]);

  // Swipe-to-close handling
  const onTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchMove = useCallback((e) => {
    touchCurrentX.current = e.touches[0].clientX;
    if (!touchStartX.current) return;

    const deltaX = touchCurrentX.current - touchStartX.current;
    if ((from === "left" && deltaX < -50) || (from === "right" && deltaX > 50)) {
      onClose();
      touchStartX.current = null;
      touchCurrentX.current = null;
    }
  }, [from, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${backdropClassName}`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        className={`
          fixed top-0 bottom-0 z-50 w-72 bg-white shadow-xl p-6 overflow-y-auto
          transition-transform duration-300
          ${from === "left" ? "left-0 transform translate-x-0" : "right-0 transform translate-x-0"}
        `}
        style={{
          transform: isOpen
            ? "translateX(0)"
            : from === "left"
              ? "translateX(-100%)"
              : "translateX(100%)",
        }}
      >
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close filters"
            className="text-gray-600 hover:text-gray-900 text-2xl leading-none"
          >
            &times;
          </button>
        </header>
        <div>{children}</div>
      </aside>
    </>,
    document.body
  );
}
