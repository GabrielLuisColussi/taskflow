export default function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5">
      <p className="text-sm text-zinc-400">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <h3 className="text-3xl font-semibold tracking-tight">{value}</h3>
        {hint ? <span className="text-xs text-zinc-500">{hint}</span> : null}
      </div>
    </div>
  );
}