import { cn } from "@/lib/utils";

export const Logo = ({ className = "" }) => {
  return (
    <div
      className={cn(
        "inline-flex items-center text-2xl font-extrabold tracking-tight",
        className,
      )}
    >
      <span className="text-slate-900 dark:text-white">
        Edu
      </span>
      <span className="text-emerald-600 dark:text-emerald-400">
        Connect
      </span>
    </div>
  );
};