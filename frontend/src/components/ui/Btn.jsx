export default function Btn({ 
  children, 
  onClick, 
  disabled = false, 
  fullWidth = false,
  variant = "primary",
  small = false,
  danger = false
}) {
  const baseStyles = "font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5";
  
  const sizeStyles = small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";

  const variantStyles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800",
    ghost: "text-gray-600 hover:bg-gray-100 border border-gray-300",
  };

  const dangerStyles = "bg-red-100 text-red-700 hover:bg-red-200 border border-red-300";

  const variant_style = danger ? dangerStyles : variantStyles[variant] || variantStyles.ghost;
  const widthStyle = fullWidth ? "w-full justify-center" : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles} ${variant_style} ${widthStyle}`}
    >
      {children}
    </button>
  );
}
