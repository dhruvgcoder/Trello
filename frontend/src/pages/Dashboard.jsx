import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import BoardList from "../components/BoardList";
import { LogOut, LayoutDashboard } from "lucide-react";

export default function Dashboard() {
  const { token, username, logout } = useAuth();
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState([]);
  const [activeOrg, setActiveOrg] = useState(null);
  const [loadingOrgs, setLoadingOrgs] = useState(true);

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  useEffect(() => {
    if (!token) return;
    setLoadingOrgs(true);
    api("/organization", {}, token)
      .then((res) => {
        const list = res.orgs || [];
        setOrgs(list);
        if (list.length) setActiveOrg((prev) => prev || list[0]);
        setLoadingOrgs(false);
      })
      .catch((err) => {
        console.error("Failed to load orgs:", err);
        setLoadingOrgs(false);
      });
  }, [token]);

  return (
    <div className="flex flex-col h-screen bg-[#09090b] font-sans text-zinc-100 overflow-hidden">
      <header className="flex items-center justify-between h-16 bg-[#0c0c0e]/85 backdrop-blur-md border-b border-zinc-800/80 px-6 shrink-0 shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-1.5 rounded-xl shadow-md shadow-indigo-500/10">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent">
            TaskBoard
          </h1>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <div className="flex items-center gap-2.5 bg-[#161619] px-3.5 py-1.5 rounded-xl border border-zinc-800/60 shadow-inner">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {username?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="font-semibold text-zinc-300">{username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-xl transition-all duration-200 font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {loadingOrgs ? (
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-zinc-800 border-t-indigo-500 rounded-full" />
              <p className="text-zinc-400 mt-3 text-sm font-medium">Loading workspace...</p>
            </div>
          </div>
        ) : (
          <BoardList
            org={activeOrg}
            orgs={orgs}
            onSelectOrg={setActiveOrg}
            onCreateOrg={(org) => {
              setOrgs((prev) => [...prev, org]);
              setActiveOrg(org);
            }}
            token={token}
          />
        )}
      </div>
    </div>
  );
}
