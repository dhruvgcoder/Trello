import { useState } from "react";
import { api } from "../api";
import Btn from "./ui/Btn";
import Input from "./ui/Input";
import Modal from "./ui/Modal";
import { ChevronLeft, ChevronRight, Plus, Building2 } from "lucide-react";

export default function OrgSidebar({ orgs, activeOrg, onSelect, onCreateOrg, token }) {
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  async function createOrg() {
    if (!title || !desc) return;
    setError("");
    setLoading(true);
    try {
      const res = await api(
        "/organization/create",
        { method: "POST", body: JSON.stringify({ title, description: desc }) },
        token
      );
      if (res.orgId) {
        onCreateOrg({ id: res.orgId, title });
        setTitle("");
        setDesc("");
        setShowCreate(false);
      } else {
        setError(res.msg || "Failed to create organization");
      }
    } catch (err) {
      setError(err.message || "Error creating organization");
    }
    setLoading(false);
  }

  return (
    <div className={`${collapsed ? "w-18" : "w-64"} bg-[#0c0c0e] text-zinc-400 flex flex-col transition-all duration-300 border-r border-zinc-900 shadow-xl shrink-0`}>
      <div className="flex items-center justify-between p-4 border-b border-zinc-900 min-h-[57px] bg-[#09090b]">
        {!collapsed && (
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 text-xs tracking-wider uppercase">
            Workspaces
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-zinc-500 hover:text-zinc-200 transition-colors p-1.5 rounded-lg hover:bg-zinc-900 mx-auto"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {orgs.map((o) => {
          const isActive = activeOrg?.id === o.id;
          return (
            <button
              key={o.id}
              onClick={() => onSelect(o)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all relative group ${
                isActive
                  ? "bg-indigo-500/10 text-indigo-400 font-semibold shadow-sm border border-indigo-500/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
              }`}
            >
              {/* Left active line */}
              {isActive && (
                <span className="absolute left-0 top-2.5 bottom-2.5 w-1 bg-indigo-500 rounded-r-md animate-fade-in" />
              )}
              <div className={`p-1.5 rounded-lg transition-colors ${
                isActive ? "bg-indigo-500/20 text-indigo-450" : "bg-zinc-900 text-zinc-650 group-hover:text-zinc-400"
              }`}>
                <Building2 className="w-4 h-4 shrink-0" />
              </div>
              {!collapsed && (
                <span className="truncate transition-all duration-200 text-left">{o.title}</span>
              )}
            </button>
          );
        })}

        {!loading && orgs.length === 0 && !collapsed && (
          <div className="text-zinc-600 text-xs text-center py-8 px-4">
            No workspaces yet. Create one below!
          </div>
        )}
      </div>

      <div className="p-3 border-t border-zinc-900 bg-[#09090b]">
        <Btn
          small
          fullWidth
          onClick={() => {
            setCollapsed(false);
            setShowCreate(true);
          }}
          icon={<Plus className="w-4 h-4" />}
          className="bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 border-0 transition-all shadow-sm"
        >
          {collapsed ? "" : "New Workspace"}
        </Btn>
      </div>

      {showCreate && (
        <Modal title="Create Workspace" onClose={() => setShowCreate(false)}>
          <div className="space-y-4">
            <Input
              label="Workspace Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Engineering, Marketing"
            />
            <Input
              label="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="What does this workspace do?"
            />
            {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
            <Btn
              fullWidth
              onClick={createOrg}
              disabled={loading || !title || !desc}
              loading={loading}
            >
              Create Workspace
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
