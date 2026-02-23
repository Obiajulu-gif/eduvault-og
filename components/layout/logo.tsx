import { BookLock } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6f26f5] to-[#9338ff] text-white shadow-[0_8px_20px_-12px_rgba(111,38,245,0.95)]">
        <BookLock className="h-4 w-4" />
      </div>
      {!compact && <span className="text-[30px] font-black tracking-tight text-[#121b30]">EduVault</span>}
    </div>
  );
}
