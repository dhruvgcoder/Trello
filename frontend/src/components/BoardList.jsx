import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import Btn from "./ui/Btn";
import Input from "./ui/Input";
import Modal from "./ui/Modal";
import Avatar from "./ui/Avatar";
import IssueBoard from "./IssueBoard";

export default function BoardList({ org, token }) {
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [tab, setTab] = useState("board");
  const [members, setMembers] = useState([]);
  const [inviteUsername, setInviteUsername] = useState("");
  const [inviteMsg, setInviteMsg] = useState("");
  const [removeId, setRemoveId] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const fetchBoards = useCallback(async () => {
    setFetching(true);
    try {
      const res = await api(`/boards/dashboard/${org.id}`, {}, token);
      const list = (res.boards || []).map((b, i) => ({ ...b, _id: b._id || `b${i}` }));
      setBoards(list);
      if (list.length) setActiveBoard((prev) => prev || list[0]);
    } catch (err) {
      console.error("Failed to fetch boards:", err);
    }
    setFetching(false);
  }, [org.id, token]);

  const fetchMembers = useCallback(async () => {
    try {
      const res = await api(`/organization/${org.id}/members`, {}, token);
      setMembers(res.members || []);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    }
  }, [org.id, token]);

  useEffect(() => {
    setActiveBoard(null);
    fetchBoards();
    fetchMembers();
  }, [org.id, fetchBoards, fetchMembers]);

  async function createBoard() {
    if (!newTitle) return;
    setLoading(true);
    try {
      const res = await api(`/boards/${org.id}`, { method: "POST", body: JSON.stringify({ title: newTitle }) }, token);
      if (res.id) {
        await fetchBoards();
        setNewTitle("");
        setShowCreate(false);
      }
    } catch (err) {
      console.error("Failed to create board:", err);
    }
    setLoading(false);
  }

  async function inviteMember() {
    setInviteMsg("");
    try {
      const res = await api(
        `/organization/${org.id}/invite`,
        { method: "POST", body: JSON.stringify({ username: inviteUsername }) },
        token
      );
      setInviteMsg(res.msg || "Invitation sent");
      if (res.id) { 
        setInviteUsername(""); 
        fetchMembers(); 
      }
    } catch (err) {
      setInviteMsg(err.message || "Failed to invite member");
    }
  }

  async function removeMember() {
    if (!removeId) return;
    try {
      const res = await api(
        `/organization/${org.id}/remove`,
        { method: "DELETE", body: JSON.stringify({ targetUserId: removeId }) },
        token
      );
      setInviteMsg(res.msg || "Member removed");
      setRemoveId("");
      fetchMembers();
    } catch (err) {
      setInviteMsg(err.message || "Failed to remove member");
    }
  }

  return (
    <div className="flex flex-col flex-1 min-w-0 bg-white">
      {/* Header Tabs */}
      <div className="border-b border-gray-200 px-6 pt-4 flex gap-6 items-end shrink-0">
        <h2 className="text-xl font-bold pb-3">{org.title}</h2>
        {["board", "members"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 border-b-2 text-sm ${tab === t ? "border-blue-500 font-semibold text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900"}`}
          >
            {t === "board" ? "Boards" : "Members"}
          </button>
        ))}
      </div>

      {tab === "board" && (
        <div className="flex flex-1 min-h-0">
          {/* Boards Sidebar */}
          <div className={`${collapsed ? 'w-16' : 'w-56'} border-r border-gray-200 flex flex-col transition-all duration-200 bg-gray-50`}>
            <div className="flex justify-between items-center p-3 border-b border-gray-200">
              {!collapsed && <span className="text-sm font-semibold text-gray-600">Boards</span>}
              <button onClick={() => setCollapsed(!collapsed)} className="text-gray-500">
                {collapsed ? '▶' : '◀'}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {fetching && <div className="text-sm text-gray-400 p-2 text-center">Loading...</div>}
              {boards.map((b) => (
                <button
                  key={b._id || b.title}
                  onClick={() => setActiveBoard(b)}
                  className={`w-full text-left px-3 py-2 text-sm rounded ${
                    activeBoard?.title === b.title ? "bg-gray-200 font-medium" : "hover:bg-gray-100"
                  }`}
                >
                  {collapsed ? b.title[0].toUpperCase() : b.title}
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-gray-200">
              <Btn small fullWidth onClick={() => { setCollapsed(false); setShowCreate(true); }}>
                {collapsed ? '+' : '+ New Board'}
              </Btn>
            </div>
          </div>

          {/* Board Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeBoard ? (
              <IssueBoard board={activeBoard} token={token} />
            ) : (
              <div className="text-center mt-20 text-gray-500">No board selected.</div>
            )}
          </div>
        </div>
      )}

      {tab === "members" && (
        <div className="flex-1 p-6 overflow-y-auto max-w-2xl">
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-4">Members ({members.length})</h3>
            <div className="space-y-2">
              {members.map((m, i) => (
                <div key={i} className="flex justify-between items-center p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <Avatar name={m.username || `M${i}`} size={32} />
                    <span>{m.username || m._id}</span>
                  </div>
                  <button onClick={() => setRemoveId(m._id)} className="text-red-500 text-sm hover:underline">Remove</button>
                </div>
              ))}
              {members.length === 0 && <div className="text-gray-500">No members yet</div>}
            </div>
          </div>

          {removeId && (
            <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-md flex justify-between items-center">
              <span className="text-red-700 text-sm">Remove member {removeId}?</span>
              <div className="flex gap-2">
                <Btn small danger onClick={removeMember}>Yes</Btn>
                <Btn small variant="ghost" onClick={() => setRemoveId("")}>Cancel</Btn>
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-lg mb-4">Invite</h3>
            <div className="flex gap-2 mb-2">
              <Input
                value={inviteUsername}
                onChange={(e) => setInviteUsername(e.target.value)}
                placeholder="Username"
              />
              <Btn onClick={inviteMember} disabled={!inviteUsername}>Send</Btn>
            </div>
            {inviteMsg && <div className="text-sm text-gray-600">{inviteMsg}</div>}
          </div>
        </div>
      )}

      {showCreate && (
        <Modal title="New Board" onClose={() => setShowCreate(false)}>
          <div className="space-y-4">
            <Input label="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <Btn fullWidth onClick={createBoard} disabled={loading || !newTitle}>Create</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
