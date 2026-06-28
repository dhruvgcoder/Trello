import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { STATUSES } from "../constants";
import Btn from "./ui/Btn";
import Modal from "./ui/Modal";
import StatusBadge from "./ui/StatusBadge";
import IssueCard from "./IssueCard";
import { Plus, Loader2 } from "lucide-react";

export default function IssueBoard({ board, token }) {
  const [issues, setIssues] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [desc, setDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const fetchIssues = useCallback(async (showSkeleton = true) => {
    if (showSkeleton) setFetching(true);
    try {
      const res = await api(`/issues/${board._id || board.title}`, {}, token);
      setIssues(res.issues || []);
    } catch (err) {
      console.error("Failed to fetch issues:", err);
    }
    if (showSkeleton) setFetching(false);
  }, [board._id, board.title, token]);

  useEffect(() => { fetchIssues(true); }, [board._id, fetchIssues]);

  async function createIssue() {
    if (!desc) return;
    setCreating(true);
    try {
      await api(
        `/issues/${board._id || board.title}`,
        { method: "POST", body: JSON.stringify({ description: desc }) },
        token
      );
      setDesc("");
      setShowCreate(false);
      await fetchIssues(false);
    } catch (err) {
      console.error("Failed to create issue:", err);
    }
    setCreating(false);
  }

  async function updateStatus(issueId, newStatus) {
    setUpdatingId(issueId);
    try {
      await api(`/issues/${issueId}`, { method: "PUT", body: JSON.stringify({ newStatus }) }, token);
      setIssues((prev) => prev.map((i) => (i._id === issueId ? { ...i, status: newStatus } : i)));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
    setUpdatingId(null);
  }

  const grouped = STATUSES.reduce((acc, s) => {
    acc[s] = issues.filter((i) => i.status === s);
    return acc;
  }, {});

  if (fetching) {
    return (
      <div className="space-y-4 flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="h-7 w-48 bg-zinc-900 rounded-lg animate-pulse mb-2 shrink-0" />
        <div className="flex gap-5 overflow-x-auto pb-4 items-start flex-1 min-h-0">
          {STATUSES.map((s) => (
            <div key={s} className="w-72 shrink-0 bg-[#161619]/40 border border-zinc-800/80 rounded-2xl p-4 min-h-[300px]">
              <div className="h-5 w-24 bg-zinc-900 rounded-full animate-pulse mb-4" />
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 bg-[#1d1d22] border border-zinc-800/80 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="flex items-center justify-between mb-5 shrink-0">
        <h3 className="text-lg font-bold text-zinc-100 tracking-tight">{board.title}</h3>
        <Btn small onClick={() => setShowCreate(true)} icon={<Plus className="w-4 h-4" />}>
          Add issue
        </Btn>
      </div>

      {/* Horizontal Scrolling columns container */}
      <div className="flex-1 flex gap-5 overflow-x-auto pb-4 items-start min-h-0 select-none">
        {STATUSES.map((status) => {
          const isDragOver = dragOverColumn === status;
          return (
            <div
              key={status}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragOverColumn !== status) setDragOverColumn(status);
              }}
              onDragLeave={() => {
                setDragOverColumn(null);
              }}
              onDrop={async (e) => {
                e.preventDefault();
                setDragOverColumn(null);
                const issueId = e.dataTransfer.getData("text/plain");
                if (issueId) {
                  await updateStatus(issueId, status);
                }
              }}
              className={`w-72 shrink-0 rounded-2xl p-4 flex flex-col border max-h-[calc(100vh-180px)] transition-all duration-300 ${
                isDragOver
                  ? "bg-indigo-500/5 border-indigo-500/40 ring-2 ring-indigo-500/10 shadow-inner"
                  : "bg-[#161619]/40 border-zinc-800/80"
              }`}
            >
              <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-zinc-800/60 shrink-0">
                <StatusBadge status={status} />
                <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800/80 shadow-sm">
                  {grouped[status].length}
                </span>
              </div>

              {/* Scrollable list container inside each column */}
              <div className={`space-y-2.5 flex-1 overflow-y-auto pr-1 transition-all duration-200 min-h-[120px] scrollbar-thin ${
                isDragOver ? "translate-y-1" : ""
              }`}>
                {grouped[status].length === 0 ? (
                  <div className="text-xs text-zinc-600 text-center py-8 border border-dashed border-zinc-800/50 rounded-xl bg-zinc-950/15">
                    Drag issues here
                  </div>
                ) : (
                  grouped[status].map((issue, idx) => (
                    <IssueCard
                      key={issue._id || idx}
                      issue={issue}
                      onStatusChange={updateStatus}
                      updating={updatingId === issue._id}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showCreate && (
        <Modal title="New issue" onClose={() => setShowCreate(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Description</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
                placeholder="Describe the issue..."
                className="w-full px-4 py-2.5 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-[#09090b] text-zinc-100 shadow-inner resize-none transition-all"
              />
            </div>
            <Btn fullWidth onClick={createIssue} disabled={creating || !desc} loading={creating}>
              Add issue
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
