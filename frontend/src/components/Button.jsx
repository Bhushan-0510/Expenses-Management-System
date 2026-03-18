export default function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium shadow-sm bg-slate-900 text-white hover:bg-slate-800 ${className}`}
    >
      {children}
    </button>
  );
}

