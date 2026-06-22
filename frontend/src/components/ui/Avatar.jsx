export default function Avatar({ name, size = 32 }) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";
  const colors = [
    "bg-indigo-500", "bg-blue-500", "bg-purple-500",
    "bg-pink-500", "bg-red-500", "bg-orange-500"
  ];
  const colorClass = colors[name?.charCodeAt(0) % colors.length];

  return (
    <div
      className={`${colorClass} text-white font-bold rounded-full flex items-center justify-center flex-shrink-0`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  );
}
