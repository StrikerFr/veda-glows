const MAP: Record<string, { bg: string; fg: string; dot: string }> = {
  pending:    { bg: "#FFF4DD", fg: "#8A5A00", dot: "#D4A23A" },
  confirmed:  { bg: "#E6F0FF", fg: "#1E3A8A", dot: "#3B6FE0" },
  processing: { bg: "#EEE7FF", fg: "#4B2A8A", dot: "#7A5AE0" },
  shipped:    { bg: "#E1F2EA", fg: "#0F4A2C", dot: "#3F8E5E" },
  delivered:  { bg: "#143A2A", fg: "#F4ECDC", dot: "#C9A24C" },
  cancelled:  { bg: "#FBE6E6", fg: "#8A1F1F", dot: "#C03B3B" },
  refunded:   { bg: "#F0EBE3", fg: "#5A4A2A", dot: "#8B7355" },
  paid:       { bg: "#E1F2EA", fg: "#0F4A2C", dot: "#3F8E5E" },
  failed:     { bg: "#FBE6E6", fg: "#8A1F1F", dot: "#C03B3B" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = MAP[status] ?? { bg: "#F0EBE3", fg: "#444", dot: "#888" };
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] font-semibold px-2.5 py-1 rounded-full"
      style={{ background: s.bg, color: s.fg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
      {status}
    </span>
  );
}
