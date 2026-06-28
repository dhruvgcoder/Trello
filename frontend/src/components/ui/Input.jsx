export default function Input({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  error = "",
  icon = null,
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-zinc-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-[#09090b] text-zinc-100 shadow-sm hover:border-zinc-700 ${
            error ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : "border-zinc-800"
          } ${icon ? "pl-11" : ""}`}
        />
      </div>
      {error && <p className="text-red-400 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
}
