"use client";
import { useEffect, useState, type ReactNode } from "react";
import { MotionConfig, LayoutGroup } from "motion/react";
import { CustomerSession } from "@/components/auth/shopping-auth";
import { useCatalog } from "@/stores/catalog";
import { useShop } from "@/stores/shop";
import { X, Check } from "lucide-react";
export function Providers({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const notice = useShop((s) => s.notice);
  const notify = useShop((s) => s.notify);
  useEffect(() => {
    void Promise.resolve(useShop.persist.rehydrate()).then(()=>setHydrated(true));
    const refresh = () => { void useCatalog.getState().refresh().catch(() => {}); };
    refresh();
    window.addEventListener('focus', refresh);
    window.addEventListener('catalog-updated', refresh);
    const timer = window.setInterval(refresh, 15000);
    return () => { window.removeEventListener('focus',refresh); window.removeEventListener('catalog-updated',refresh); clearInterval(timer); };
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => notify(""), 4500);
    return () => clearTimeout(timer);
  }, [notice, notify]);
  return (
    <MotionConfig reducedMotion="user">
      {hydrated && <CustomerSession />}<LayoutGroup>{children}</LayoutGroup>
      <div className={`toast ${notice ? "visible" : ""}`} role="status">
        {notice && (
          <>
            <Check size={16} />
            <span>{notice}</span>
            <button
              aria-label="Dismiss notification"
              onClick={() => notify("")}
            >
              <X size={16} />
            </button>
          </>
        )}
      </div>
    </MotionConfig>
  );
}
