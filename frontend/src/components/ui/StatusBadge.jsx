import { STATUS_COLORS } from "../../constants";

export default function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status];
  if (!colors) return null;

  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-medium inline-block"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {colors.label}
    </span>
  );
}
