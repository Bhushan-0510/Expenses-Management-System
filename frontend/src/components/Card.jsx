export default function Card({ title, children, className = "" }) {
  return (
    <section className={`card ${className}`}>
      <div className="card-body p-3 p-md-4">
        {title && <h2 className="h6 mb-2 text-slate-900">{title}</h2>}
        {children}
      </div>
    </section>
  );
}

