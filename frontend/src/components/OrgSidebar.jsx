import { useState } from "react";
import { api } from "../api";
import Btn from "./ui/Btn";
import Input from "./ui/Input";
import Modal from "./ui/Modal";

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
      setError("Error creating organization");
    }
    setLoading(false);
  }

  return (
    <div className={`${collapsed ? 'w-16' : 'w-56'} bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-200`}>
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        {!collapsed && <span className="font-semibold text-gray-700 text-sm">Organizations</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="text-gray-500 hover:text-gray-900">
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {orgs.map((o) => (
          <button
            key={o.id}
            onClick={() => onSelect(o)}
            className={`w-full text-left px-3 py-2 text-sm rounded ${
              activeOrg?.id === o.id ? "bg-gray-200 font-medium" : "hover:bg-gray-100"
            }`}
          >
            {collapsed ? o.title[0].toUpperCase() : o.title}
          </button>
        ))}
      </div>

      <div className="p-3 border-t border-gray-200">
        <Btn small fullWidth onClick={() => { setCollapsed(false); setShowCreate(true); }}>
          {collapsed ? '+' : '+ New Org'}
        </Btn>
      </div>

      {showCreate && (
        <Modal title="New organization" onClose={() => setShowCreate(false)}>
          <div className="space-y-4">
            <Input label="Name" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input label="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Btn fullWidth onClick={createOrg} disabled={loading || !title || !desc}>
              {loading ? "Creating…" : "Create"}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
