export type SigilVariant = "loom" | "node" | "spiral" | "eye" | "weave" | "vessel" | "crown";

type SigilProps = {
  variant?: SigilVariant;
  className?: string;
};

export function Sigil({ variant = "node", className }: SigilProps) {
  const common = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 64 64",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 0.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (variant) {
    case "loom":
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="22" opacity="0.4" />
          <path d="M10 32 L54 32 M32 10 L32 54 M16 16 L48 48 M48 16 L16 48" />
          <circle cx="32" cy="32" r="4" fill="currentColor" opacity="0.8" />
        </svg>
      );
    case "spiral":
      return (
        <svg {...common}>
          <path d="M32 32 m-2 0 a2 2 0 1 1 4 0 a4 4 0 1 1 -8 0 a8 8 0 1 1 16 0 a14 14 0 1 1 -28 0 a22 22 0 1 1 44 0" />
        </svg>
      );
    case "eye":
      return (
        <svg {...common}>
          <path d="M6 32 Q32 10 58 32 Q32 54 6 32 Z" opacity="0.6" />
          <circle cx="32" cy="32" r="8" />
          <circle cx="32" cy="32" r="2" fill="currentColor" />
        </svg>
      );
    case "weave":
      return (
        <svg {...common}>
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={12 + i * 12} y1="8" x2={12 + i * 12} y2="56" opacity="0.6" />
          ))}
          <path d="M8 20 Q32 28 56 20 M8 32 Q32 24 56 32 M8 44 Q32 52 56 44" />
        </svg>
      );
    case "vessel":
      return (
        <svg {...common}>
          <path d="M20 12 L44 12 L40 32 Q32 50 32 54 Q32 50 24 32 Z" />
          <line x1="20" y1="22" x2="44" y2="22" opacity="0.5" />
          <circle cx="32" cy="40" r="2" fill="currentColor" />
        </svg>
      );
    case "crown":
      return (
        <svg {...common}>
          <path d="M10 44 L18 18 L26 38 L32 14 L38 38 L46 18 L54 44 Z" />
          <line x1="10" y1="50" x2="54" y2="50" />
        </svg>
      );
    case "node":
    default:
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="6" fill="currentColor" opacity="0.7" />
          <circle cx="32" cy="32" r="14" opacity="0.5" />
          <circle cx="32" cy="32" r="24" opacity="0.25" />
          <line x1="32" y1="2" x2="32" y2="14" />
          <line x1="32" y1="50" x2="32" y2="62" />
          <line x1="2" y1="32" x2="14" y2="32" />
          <line x1="50" y1="32" x2="62" y2="32" />
        </svg>
      );
  }
}
