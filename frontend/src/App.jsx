import { useState, useEffect } from "react";
import { api } from "./api";
import AuthScreen from "./components/AuthScreen";
import OrgSidebar from "./components/OrgSidebar";
import BoardList from "./components/BoardList";
import Avatar from "./components/ui/Avatar";
import Btn from "./components/ui/Btn";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("tb_token") || "");
  const [username, setUsername] = useState(() => localStorage.getItem("tb_user") || "");
  const [orgs, setOrgs] = useState([]);
  const [activeOrg, setActiveOrg] = useState(null);
  const [loadingOrgs, setLoadingOrgs] = useState(false);

  function handleAuth(t, u) {
    setToken(t);
    setUsername(u);
    localStorage.setItem("tb_token", t);
    localStorage.setItem("tb_user", u);
  }

  function logout() {
    setToken("");
    setUsername("");
    setOrgs([]);
    setActiveOrg(null);
    localStorage.removeItem("tb_token");
    localStorage.removeItem("tb_user");
  }

  useEffect(() => {
    if (!token) return;
    setLoadingOrgs(true);
    api("/organization", {}, token)
      .then((res) => {
        const list = res.orgs || [];
        setOrgs(list);
        if (list.length) setActiveOrg(list[0]);
        setLoadingOrgs(false);
      })
      .catch((err) => {
        console.error("Failed to load orgs:", err);
        setLoadingOrgs(false);
      });
  }, [token]);

  if (!token) return <AuthScreen onAuth={handleAuth} />;

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans text-gray-900">
      <header className="flex items-center justify-between h-14 bg-white border-b border-gray-200 px-4 shrink-0">
        <h1 className="text-lg font-semibold tracking-tight">Task Board</h1>
        <div className="flex items-center gap-4 text-sm">
          <span>{username}</span>
          <button onClick={logout} className="text-gray-500 hover:text-gray-900">Sign out</button>
        </div>
      </header>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        <OrgSidebar
          orgs={orgs}
          activeOrg={activeOrg}
          onSelect={setActiveOrg}
          token={token}
          onCreateOrg={(org) => {
            setOrgs((prev) => [...prev, org]);
            setActiveOrg(org);
          }}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          {loadingOrgs && (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-200 border-t-indigo-600 rounded-full"></div>
                <p className="text-gray-600 mt-2">Loading organizations…</p>
              </div>
            </div>
          )}

          {!loadingOrgs && !activeOrg && (
            <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
              <div className="text-xl font-medium mb-2">No organizations</div>
              <div className="text-sm">Select or create an organization to get started</div>
            </div>
          )}

          {activeOrg && <BoardList org={activeOrg} token={token} />}
        </main>
      </div>
    </div>
  );
}
