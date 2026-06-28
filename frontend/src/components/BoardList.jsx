import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import Btn from "./ui/Btn";
import Input from "./ui/Input";
import Modal from "./ui/Modal";
import Avatar from "./ui/Avatar";
import IssueBoard from "./IssueBoard";
import {
  LayoutDashboard, Users, Plus, Send, Trash2, X,
  Building2, ChevronDown, ChevronRight, Settings, LogOut
} from "lucide-react";

export default function BoardList({ org, orgs, onSelectOrg, onCreateOrg, token }) {
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
  
  // Workspace dropdown & create modal states
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [newOrgTitle, setNewOrgTitle] = useState("");
  const [newOrgDesc, setNewOrgDesc] = useState("");
  const [creatingOrg, setCreatingOrg] = useState(false);
  const [orgError, setOrgError] = useState("");

  const fetchBoards = useCallback(async () => {
    if (!org) return;
    setFetching(true);
    try {
      const res = await api(`/boards/dashboard/${org.id}`, {}, token);
      const list = (res.boards || []).map((b, i) => ({ ...b, _id: b._id || `b${i}` }));
      setBoards(list);
      if (list.length) setActiveBoard((prev) => {
        // If we switch orgs, reset active board to first board of new org
        const exists = list.find((item) => item._id === prev?._id);
        return exists ? prev : list[0];
      });
      else setActiveBoard(null);
    } catch (err) {
      console.error("Failed to fetch boards:", err);
    }
    setFetching(false);
  }, [org?.id, token]);

  const fetchMembers = useCallback(async () => {
    if (!org) return;
    try {
      const res = await api(`/organization/${org.id}/members`, {}, token);
      setMembers(res.members || []);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    }
  }, [org?.id, token]);

  useEffect(() => {
    if (org) {
      fetchBoards();
      fetchMembers();
    }
  }, [org?.id, fetchBoards, fetchMembers]);

  async function createBoard() {
    if (!newTitle || !org) return;
    setLoading(true);
    try {
      const res = await api(`/boards/${org.id}`, { method: "POST", body: JSON.stringify({ title: newTitle }) }, token);
      if (res.id) {
        setNewTitle("");
        setShowCreate(false);
        // Refetch and set active
        const updated = await api(`/boards/dashboard/${org.id}`, {}, token);
        const list = (updated.boards || []).map((b, i) => ({ ...b, _id: b._id || `b${i}` }));
        setBoards(list);
        const newB = list.find((b) => b.title === newTitle) || list[list.length - 1];
        if (newB) {
          setActiveBoard(newB);
          setTab("board");
        }
      }
    } catch (err) {
      console.error("Failed to create board:", err);
    }
    setLoading(false);
  }

  async function createOrg() {
    if (!newOrgTitle || !newOrgDesc) return;
    setOrgError("");
    setCreatingOrg(true);
    try {
      const res = await api(
        "/organization/create",
        { method: "POST", body: JSON.stringify({ title: newOrgTitle, description: newOrgDesc }) },
        token
      );
      if (res.orgId) {
        onCreateOrg({ id: res.orgId, title: newOrgTitle });
        setNewOrgTitle("");
        setNewOrgDesc("");
        setShowCreateOrg(false);
        setShowOrgDropdown(false);
      } else {
        setOrgError(res.msg || "Failed to create organization");
      }
    } catch (err) {
      setOrgError(err.message || "Error creating organization");
    }
    setCreatingOrg(false);
  }

  async function inviteMember() {
    if (!org) return;
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
    if (!removeId || !org) return;
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

  // If there are no workspaces created yet
  if (!org) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#09090b]">
        <div className="max-w-md w-full bg-[#161619] border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center">
          <div className="bg-indigo-600/10 p-5 rounded-3xl border border-indigo-500/20 mb-6 shadow-inner inline-block">
            <Building2 className="w-12 h-12 text-indigo-400 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-100 mb-2">Create Workspace</h2>
          <p className="text-sm text-zinc-400 mb-6">
            You need to create a workspace before you can manage boards and track tasks.
          </p>
          <div className="space-y-4 text-left">
            <Input
              label="Workspace Name"
              value={newOrgTitle}
              onChange={(e) => setNewOrgTitle(e.target.value)}
              placeholder="e.g. Engineering Team"
            />
            <Input
              label="Workspace Description"
              value={newOrgDesc}
              onChange={(e) => setNewOrgDesc(e.target.value)}
              placeholder="Describe your workspace"
            />
            {orgError && <div className="text-red-500 text-xs font-semibold">{orgError}</div>}
            <Btn
              fullWidth
              onClick={createOrg}
              disabled={creatingOrg || !newOrgTitle || !newOrgDesc}
              loading={creatingOrg}
            >
              Create first workspace
            </Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden bg-[#09090b]">
      {/* ========================================================
          SINGLE UNIFIED SIDEBAR (Workspaces & Boards Switcher)
         ======================================================== */}
      <aside className="w-64 border-r border-zinc-900 bg-[#0c0c0e] flex flex-col shrink-0">
        
        {/* Workspace Switcher Header */}
        <div className="p-4 border-b border-zinc-900 relative">
          <label className="block text-[10px] font-bold tracking-wider uppercase text-zinc-500 mb-1.5">
            Active Workspace
          </label>
          <button
            onClick={() => setShowOrgDropdown(!showOrgDropdown)}
            className="w-full flex items-center justify-between gap-2.5 px-3 py-2 bg-zinc-900/60 border border-zinc-800 rounded-xl hover:bg-zinc-900 transition-all text-left text-zinc-200"
          >
            <div className="flex items-center gap-2 truncate">
              <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="truncate font-semibold text-sm">{org.title}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
          </button>

          {/* Switcher Dropdown Menu */}
          {showOrgDropdown && (
            <>
              <div 
                className="fixed inset-0 z-20" 
                onClick={() => setShowOrgDropdown(false)} 
              />
              <div className="absolute top-[90%] left-4 right-4 bg-[#161619] border border-zinc-800 rounded-xl shadow-2xl z-30 p-1.5 animate-scale-in">
                <p className="text-[10px] font-bold text-zinc-500 px-2 py-1.5 uppercase tracking-wider">
                  Switch Workspace
                </p>
                <div className="max-h-48 overflow-y-auto space-y-0.5">
                  {orgs.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => {
                        onSelectOrg(o);
                        setShowOrgDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 text-xs rounded-lg transition-colors text-left ${
                        o.id === org.id
                          ? "bg-indigo-600/15 text-indigo-400 font-semibold"
                          : "text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span className="truncate">{o.title}</span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-zinc-800/80 mt-1.5 pt-1.5">
                  <button
                    onClick={() => {
                      setShowCreateOrg(true);
                      setShowOrgDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors text-left"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Workspace
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar Nav Links */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-6">
          
          {/* Main Workspace Navigation */}
          <div>
            <span className="block text-[10px] font-bold tracking-wider uppercase text-zinc-500 mb-2 px-2">
              Navigation
            </span>
            <div className="space-y-1">
              <button
                onClick={() => setTab("board")}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-all ${
                  tab === "board"
                    ? "bg-zinc-900 text-zinc-100 font-semibold shadow-sm border border-zinc-800"
                    : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-zinc-500" />
                Workspace Board
              </button>
              <button
                onClick={() => setTab("members")}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-all ${
                  tab === "members"
                    ? "bg-zinc-900 text-zinc-100 font-semibold shadow-sm border border-zinc-800"
                    : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"
                }`}
              >
                <Users className="w-4 h-4 text-zinc-500" />
                Members
              </button>
            </div>
          </div>

          {/* Boards List Section (Active in Board Tab) */}
          <div>
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-500">
                Boards
              </span>
              <button
                onClick={() => setShowCreate(true)}
                className="text-zinc-500 hover:text-zinc-200 transition-colors p-0.5 rounded hover:bg-zinc-900"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="space-y-1">
              {fetching ? (
                <div className="space-y-2 px-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-8 bg-zinc-900/50 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : boards.length === 0 ? (
                <p className="text-xs text-zinc-600 px-2 py-1.5">No boards yet.</p>
              ) : (
                boards.map((b) => {
                  const isActive = activeBoard?._id === b._id && tab === "board";
                  return (
                    <button
                      key={b._id || b.title}
                      onClick={() => {
                        setActiveBoard(b);
                        setTab("board");
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center gap-2.5 transition-all relative group ${
                        isActive
                          ? "bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20"
                          : "text-zinc-450 hover:bg-zinc-900/40 hover:text-zinc-200"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-0.75 bg-indigo-500 rounded-r-full" />
                      )}
                      <LayoutDashboard className={`w-3.5 h-3.5 ${
                        isActive ? "text-indigo-400" : "text-zinc-650 group-hover:text-zinc-500"
                      }`} />
                      <span className="truncate">{b.title}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-zinc-900 bg-zinc-950/20">
          <p className="text-[10px] text-zinc-600 text-center font-semibold">
            TaskBoard v1.0.0
          </p>
        </div>
      </aside>

      {/* ========================================================
          MAIN CONTENT AREA (Board columns or Members)
         ======================================================== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#09090b]">
        
        {/* Workspace/Board Details Header */}
        <div className="border-b border-zinc-900 px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shrink-0 bg-gradient-to-r from-[#0c0c0e] to-[#09090b]/20">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse shadow-md shadow-indigo-500/50" />
              {tab === "board" ? (activeBoard?.title || "No Board Selected") : "Workspace Members"}
            </h2>
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
              {org.title} &bull; {tab === "board" ? "Board View" : "Members Directory"}
            </p>
          </div>
        </div>

        {/* Dynamic Content Panel */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {tab === "board" && (
            <div className="flex-1 overflow-x-auto p-6 flex flex-col min-w-0">
              {activeBoard ? (
                <IssueBoard board={activeBoard} token={token} />
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-zinc-500">
                  <div className="bg-zinc-900/50 p-5 rounded-3xl border border-zinc-800/40 mb-4 shadow-inner">
                    <LayoutDashboard className="w-12 h-12 text-zinc-750 animate-pulse" />
                  </div>
                  <h4 className="font-semibold text-zinc-300 mb-1">Select or Create a Board</h4>
                  <p className="text-sm max-w-xs text-center text-zinc-500 mb-4">
                    Create a task board to manage sprint tasks, backlogs, and roadmap cards.
                  </p>
                  <Btn small onClick={() => setShowCreate(true)} icon={<Plus className="w-4 h-4" />}>
                    Create Board
                  </Btn>
                </div>
              )}
            </div>
          )}

          {tab === "members" && (
            <div className="flex-1 p-6 overflow-y-auto max-w-2xl animate-fade-in mx-auto w-full">
              <div className="mb-8">
                <h3 className="font-bold text-lg text-zinc-100 mb-4">Members ({members.length})</h3>
                <div className="space-y-2">
                  {members.map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 border border-zinc-800/80 bg-[#161619]/40 rounded-xl hover:border-zinc-700 hover:bg-[#161619]/80 transition-all">
                      <div className="flex items-center gap-3">
                        <Avatar name={m.username || `M${i}`} size={32} />
                        <span className="text-sm font-semibold text-zinc-200">{m.username || m._id}</span>
                      </div>
                      <button onClick={() => setRemoveId(m._id)} className="text-red-400/80 hover:text-red-450 hover:bg-red-500/10 transition-all p-1.5 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {members.length === 0 && (
                    <div className="text-zinc-650 text-sm py-8 text-center border-2 border-dashed border-zinc-800 rounded-xl bg-[#161619]/10">No members yet</div>
                  )}
                </div>
              </div>

              {removeId && (
                <div className="mb-6 p-4 border border-red-500/20 bg-red-950/20 text-red-400 rounded-xl flex items-center justify-between animate-slide-up shadow-sm">
                  <span className="text-sm font-medium">Remove this member from workspace?</span>
                  <div className="flex gap-2">
                    <Btn small danger onClick={removeMember}>Yes</Btn>
                    <Btn small variant="ghost" onClick={() => setRemoveId("")}>
                      <X className="w-3.5 h-3.5" />
                    </Btn>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-bold text-lg text-zinc-100 mb-4">Invite Member</h3>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={inviteUsername}
                      onChange={(e) => setInviteUsername(e.target.value)}
                      placeholder="Enter username"
                      icon={<Users className="w-4 h-4" />}
                    />
                  </div>
                  <Btn onClick={inviteMember} disabled={!inviteUsername} icon={<Send className="w-4 h-4" />}>
                    Send Invitation
                  </Btn>
                </div>
                {inviteMsg && <div className="text-xs text-zinc-400 mt-2 bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-850 inline-block font-semibold">{inviteMsg}</div>}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================
          MODALS
         ======================================================== */}
      {/* Create Board Modal */}
      {showCreate && (
        <Modal title="Create Board" onClose={() => setShowCreate(false)}>
          <div className="space-y-4">
            <Input label="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Sprint, Product Roadmap" />
            <Btn fullWidth onClick={createBoard} disabled={loading || !newTitle} loading={loading}>
              Create Board
            </Btn>
          </div>
        </Modal>
      )}

      {/* Create Workspace Modal */}
      {showCreateOrg && (
        <Modal title="Create Workspace" onClose={() => setShowCreateOrg(false)}>
          <div className="space-y-4">
            <Input
              label="Workspace Name"
              value={newOrgTitle}
              onChange={(e) => setNewOrgTitle(e.target.value)}
              placeholder="e.g. Engineering, Marketing"
            />
            <Input
              label="Description"
              value={newOrgDesc}
              onChange={(e) => setNewOrgDesc(e.target.value)}
              placeholder="What does this workspace do?"
            />
            {orgError && <div className="text-red-500 text-sm font-medium">{orgError}</div>}
            <Btn
              fullWidth
              onClick={createOrg}
              disabled={creatingOrg || !newOrgTitle || !newOrgDesc}
              loading={creatingOrg}
            >
              Create Workspace
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
