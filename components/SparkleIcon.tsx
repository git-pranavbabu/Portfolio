type Props = {
  size?: number;
  className?: string;
  gradient?: boolean;
};

export function SparkleIcon({ size = 14, className = "", gradient = true }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={gradient ? "url(#sparkle-gradient)" : "currentColor"}
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="50%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <path d="M12 0c.6 5.4 1.5 7.5 6 9-4.5 1.5-5.4 3.6-6 9-.6-5.4-1.5-7.5-6-9 4.5-1.5 5.4-3.6 6-9z" />
      <path d="M21 14c.3 2.7.75 3.75 3 4.5-2.25.75-2.7 1.8-3 4.5-.3-2.7-.75-3.75-3-4.5 2.25-.75 2.7-1.8 3-4.5z" />
      <path d="M3 14c.3 2.7.75 3.75 3 4.5-2.25.75-2.7 1.8-3 4.5-.3-2.7-.75-3.75-3-4.5 2.25-.75 2.7-1.8 3-4.5z" />
    </svg>
  );
}
