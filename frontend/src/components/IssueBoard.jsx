import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { STATUSES } from "../constants";
import Btn from "./ui/Btn";
import Modal from "./ui/Modal";
import StatusBadge from "./ui/StatusBadge";
import IssueCard from "./IssueCard";

export default function IssueBoard({ board, token }) {
  const [issues, setIssues] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [desc, setDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchIssues = useCallback(async () => {
    setFetching(true);
    try {
      const res = await api(`/issues/${board._id || board.title}`, {}, token);
      setIssues(res.issues || []);
    } catch (err) {
      console.error("Failed to fetch issues:", err);
    }
    setFetching(false);
  }, [board._id, board.title, token]);

  useEffect(() => { fetchIssues(); }, [board._id, fetchIssues]);

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
      await fetchIssues();
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

  if (fetching) return <div className="text-gray-500 text-sm animate-pulse">Loading issues…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">{board.title}</h3>
        <Btn small onClick={() => setShowCreate(true)}> Add issue</Btn>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-max">
        {STATUSES.map((status) => (
          <div key={status} className="bg-gray-100 rounded-lg p-4 min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300">
              <StatusBadge status={status} />
              <span className="text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded">
                {grouped[status].length}
              </span>
            </div>
            <div className="space-y-3 flex-1">
              {grouped[status].length === 0 && (
                <div className="text-sm text-gray-500 text-center py-8">No issues</div>
              )}
              {grouped[status].map((issue, idx) => (
                <IssueCard
                  key={issue._id || idx}
                  issue={issue}
                  onStatusChange={updateStatus}
                  updating={updatingId === issue._id}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <Modal title="New issue" onClose={() => setShowCreate(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
                placeholder="Describe the issue…"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none"
              />
            </div>
            <Btn fullWidth onClick={createIssue} disabled={creating || !desc}>
              {creating ? "Adding…" : "Add issue"}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
