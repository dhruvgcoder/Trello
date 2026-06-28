export default function Btn({
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  variant = "primary",
  small = false,
  danger = false,
  loading = false,
  icon = null,
}) {
  const baseStyles = "font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5 active:scale-98 transform hover:-translate-y-0.5 active:translate-y-0";

  const sizeStyles = small ? "px-3.5 py-1.5 text-xs" : "px-4 py-2.5 text-sm";

  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 active:from-violet-750 active:to-indigo-750 shadow-md shadow-indigo-500/10 border border-indigo-500/20",
    ghost: "text-zinc-400 hover:bg-zinc-800/80 border border-zinc-800 bg-[#161619] hover:text-zinc-100 shadow-sm",
    outline: "text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/10 hover:border-indigo-500/30 shadow-sm",
    secondary: "bg-zinc-800 text-zinc-200 hover:bg-zinc-700/80 border border-transparent shadow-sm",
  };

  const dangerStyles = "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 shadow-sm";
  const variantStyle = danger ? dangerStyles : variants[variant] || variants.ghost;
  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles} ${variantStyle} ${widthStyle}`}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="w-4 h-4 flex items-center justify-center">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
