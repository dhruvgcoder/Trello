export default function Avatar({ name, size = 32 }) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";
  const colors = [
    "bg-indigo-550/15 text-indigo-300 border border-indigo-500/20",
    "bg-purple-550/15 text-purple-300 border border-purple-500/20",
    "bg-fuchsia-550/15 text-fuchsia-300 border border-fuchsia-500/20",
    "bg-pink-550/15 text-pink-300 border border-pink-500/20",
    "bg-violet-550/15 text-violet-300 border border-violet-500/20",
    "bg-amber-550/15 text-amber-300 border border-amber-500/20"
  ];
  const colorClass = colors[name?.charCodeAt(0) % colors.length];

  return (
    <div
      className={`${colorClass} font-bold rounded-full flex items-center justify-center flex-shrink-0 shadow-sm`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  );
}
