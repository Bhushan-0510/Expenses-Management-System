export default function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`btn btn-dark d-inline-flex align-items-center justify-content-center rounded-lg px-3 py-2 text-sm font-medium shadow-sm ${className}`}
    >
      {children}
    </button>
  );
}

