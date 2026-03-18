export function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="form-label small mb-1">
      {children}
    </label>
  );
}

export function TextInput(props) {
  return (
    <input
      {...props}
      className={`form-control ${props.className || ""}`}
    />
  );
}

export function Select(props) {
  return (
    <select
      {...props}
      className={`form-select ${props.className || ""}`}
    />
  );
}

