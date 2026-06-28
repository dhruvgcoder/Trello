import { Link } from "react-router-dom";
import { LayoutDashboard, Users, ArrowRight, Kanban, GanttChart, Bell, Shield } from "lucide-react";

const features = [
  {
    icon: Kanban,
    title: "Kanban Boards",
    desc: "Visualize your workflow with drag-and-drop boards. Move tasks through stages effortlessly.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    desc: "Invite team members, assign tasks, and work together in real-time on shared boards.",
  },
  {
    icon: GanttChart,
    title: "Smart Organization",
    desc: "Organize work into projects and boards. Keep everything structured and findable.",
  },
  {
    icon: Shield,
    title: "Secure & Fast",
    desc: "Enterprise-grade security with encrypted data, secure authentication, and lightning-fast performance.",
  },
];

const steps = [
  { num: "01", title: "Create Account", desc: "Sign up free in seconds" },
  { num: "02", title: "Set Up Organization", desc: "Invite your team members" },
  { num: "03", title: "Create Boards", desc: "Organize your projects" },
  { num: "04", title: "Start Moving", desc: "Track progress visually" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans">
      <header className="border-b border-zinc-900 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 text-white p-1.5 rounded-xl shadow-md shadow-indigo-500/10">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-zinc-100 tracking-tight">TaskBoard</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-102 active:scale-98"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden flex-1 flex items-center min-h-[80vh]">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-semibold rounded-full mb-6 shadow-inner">
            <Bell className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            Trusted by modern product teams
          </div>
          <h1 className="text-4xl sm:text-7xl font-extrabold text-zinc-100 tracking-tight leading-tight max-w-4xl mx-auto">
            Manage projects the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400">
              smart way
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            TaskBoard helps teams organize, track, and manage their work with intuitive, high-performance Kanban boards. Simple enough for personal tasks, powerful enough for enterprise projects.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-6 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 flex items-center gap-2 hover:scale-102 active:scale-98 w-full sm:w-auto justify-center"
            >
              Start Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="px-6 py-3.5 text-zinc-300 font-semibold rounded-xl border border-zinc-800 bg-[#161619]/40 hover:bg-[#161619]/80 transition-all hover:text-white w-full sm:w-auto text-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-[#0c0c0e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">
              Everything you need to stay organized
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto">
              Powerful features that make project management simple and enjoyable.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-[#161619]/40 rounded-2xl p-6 border border-zinc-800/80 hover:shadow-lg hover:border-indigo-500/20 transition-all group"
              >
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:bg-indigo-500/20">
                  <f.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-zinc-100 mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">
              How it works
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-400">
              Get started in minutes, not hours.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="text-center group">
                <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all group-hover:border-indigo-500/30 group-hover:bg-indigo-500/5">
                  <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{s.num}</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-100 mb-1.5">{s.title}</h3>
                <p className="text-sm text-zinc-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-900 py-8 bg-[#09090b] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <LayoutDashboard className="w-4 h-4 text-indigo-500" />
            TaskBoard
          </div>
          <p className="text-sm text-zinc-500">&copy; {new Date().getFullYear()} TaskBoard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
