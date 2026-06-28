import { useState } from "react";
import { STATUS_COLORS, STATUSES } from "../constants";
import { ChevronDown, ChevronUp, Calendar, GripVertical, ArrowRight } from "lucide-react";

export default function IssueCard({ issue, onStatusChange, updating }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", issue._id);
        e.dataTransfer.effectAllowed = "move";
      }}
      className={`bg-[#1d1d22] border border-zinc-800/80 hover:border-zinc-700 rounded-xl shadow-lg shadow-black/10 transition-all duration-200 cursor-grab active:cursor-grabbing relative overflow-hidden group ${
        updating ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Visual Status Indicator Line */}
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
        style={{ backgroundColor: STATUS_COLORS[issue.status]?.text }}
      />

      <div className="p-3.5 space-y-3">
        {/* Title & Grip */}
        <div className="flex gap-2 items-start justify-between">
          <p className="text-sm font-semibold text-zinc-200 leading-snug flex-1 break-words">
            {issue.description}
          </p>
          <GripVertical className="w-4 h-4 text-zinc-650 group-hover:text-zinc-400 cursor-grab shrink-0 transition-colors mt-0.5" />
        </div>

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-[11px] font-medium text-zinc-500">
          {issue.createdAt ? (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-600" />
              <span>
                {new Date(issue.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          ) : (
            <div />
          )}

          <button
            onClick={() => setOpen(!open)}
            className={`flex items-center gap-0.5 px-2 py-1 rounded-lg border transition-all ${
              open 
                ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" 
                : "bg-zinc-900 border-zinc-800/80 hover:text-zinc-300 hover:border-zinc-700"
            }`}
          >
            <span>Move</span>
            {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Expandable Move Actions */}
        {open && (
          <div className="pt-2 border-t border-zinc-800/60 animate-scale-in space-y-2">
            <p className="text-[10px] font-bold text-zinc-650 uppercase tracking-wider">Move to status:</p>
            <div className="grid grid-cols-2 gap-1.5">
              {STATUSES.filter((s) => s !== issue.status).map((s) => (
                <button
                  key={s}
                  disabled={updating}
                  onClick={() => {
                    onStatusChange(issue._id, s);
                    setOpen(false);
                  }}
                  className="text-[10px] px-2.5 py-1.5 rounded-lg font-bold transition-all hover:scale-102 active:scale-98 shadow-sm border text-left truncate flex items-center justify-between group/btn"
                  style={{
                    backgroundColor: STATUS_COLORS[s].bg,
                    color: STATUS_COLORS[s].text,
                    borderColor: `${STATUS_COLORS[s].text}22`,
                  }}
                >
                  <span className="truncate mr-1">{STATUS_COLORS[s].label}</span>
                  <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover/btn:opacity-100 transition-all shrink-0 translate-x-[-4px] group-hover/btn:translate-x-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
