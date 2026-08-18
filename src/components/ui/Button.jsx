// components/ui/Button.jsx
// Variantes con clases 100% nativas de Tailwind — compatible con CDN y Vite.

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon = null,
  iconPosition = "left",
  onClick,
  type = "button",
  className = "",
  ...props
}) {
  // ── Tamaños ──────────────────────────────────
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
    xl: "px-10 py-5 text-lg",
  };

  // ── Variantes (solo clases nativas Tailwind) ──
  const variants = {
    // Naranja sólido — CTA principal
    primary:
      "bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold shadow-md hover:shadow-lg",

    // Alias de primary — <Button variant="gradient"> también funciona
    gradient:
      "bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold shadow-md hover:shadow-lg",

    // Teal sólido — acciones secundarias
    secondary:
      "bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold shadow-md hover:shadow-lg",

    // Borde naranja, sin fondo
    outline:
      "border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold bg-transparent",

    // Borde teal, sin fondo
    outlineTeal:
      "border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white font-bold bg-transparent",

    // Sin fondo — botones de navegación secundaria
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 font-semibold",

    // Rojo — acciones destructivas
    danger:
      "bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold shadow-md hover:shadow-lg",
  };

  // ── Base común a todas las variantes ──
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl " +
    "transition-all duration-200 cursor-pointer select-none " +
    "active:scale-95 " +
    "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed";

  const iconSize =
    size === "sm" ? 14 : size === "lg" || size === "xl" ? 20 : 16;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={[
        base,
        sizes[size] ?? sizes.md,
        variants[variant] ?? variants.primary,
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {loading ? (
        <span
          className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"
          aria-label="Cargando..."
        />
      ) : (
        <>
          {Icon && iconPosition === "left" && (
            <Icon size={iconSize} aria-hidden="true" />
          )}
          {children}
          {Icon && iconPosition === "right" && (
            <Icon size={iconSize} aria-hidden="true" />
          )}
        </>
      )}
    </button>
  );
}
