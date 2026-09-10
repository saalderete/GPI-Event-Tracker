import { statusLabel, type DocStatus } from "@/lib/registry";

export function StatusBadge({ status }: { status: DocStatus }) {
  const cls = status === "final" ? "badge-live" : status === "review" ? "badge-accent" : "badge-outline";
  return <span className={`badge ${cls}`}>{statusLabel[status]}</span>;
}
