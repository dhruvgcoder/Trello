import { useState } from "react";
import { STATUS_COLORS, STATUSES } from "../constants";
import StatusBadge from "./ui/StatusBadge";

export default function IssueCard({ issue, onStatusChange, updating }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
      <p className="text-sm text-gray-900 mb-3 leading-relaxed">
        {issue.description}
      </p>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <StatusBadge status={issue.status} />
          <button
            onClick={() => setOpen(!open)}
            className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            {open ? "▲" : "Move ▾"}
          </button>
        </div>

        {open && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            {STATUSES.filter((s) => s !== issue.status).map((s) => (
              <button
                key={s}
                disabled={updating}
                onClick={() => {
                  onStatusChange(issue._id, s);
                  setOpen(false);
                }}
                className="text-xs px-2 py-1 rounded transition-all disabled:opacity-50 disabled:cursor-wait"
                style={{
                  backgroundColor: STATUS_COLORS[s].bg,
                  color: STATUS_COLORS[s].text,
                  border: `1px solid ${STATUS_COLORS[s].text}33`,
                }}
              >
                → {STATUS_COLORS[s].label}
              </button>
            ))}
          </div>
        )}
      </div>

      {issue.createdAt && (
        <div className="text-xs text-gray-400 mt-2">
          {new Date(issue.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })}
        </div>
      )}
    </div>
  );
}
