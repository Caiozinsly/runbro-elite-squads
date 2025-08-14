import { LucideProps } from "lucide-react";

export function RunnerIcon({ className, ...props }: LucideProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Head */}
      <circle cx="12" cy="5" r="2" />
      
      {/* Body and running pose */}
      <path d="M12 7v4l-2 2" />
      <path d="M10 11l2 2v4" />
      <path d="M14 11l-2-2" />
      
      {/* Running legs */}
      <path d="M10 17l-2 2" />
      <path d="M12 17l2 2" />
      
      {/* Arms in running motion */}
      <path d="M10 9l-2-1" />
      <path d="M14 9l2 1" />
      
      {/* Hair/ponytail indicating movement */}
      <path d="M10 4l-1-1" />
    </svg>
  );
}