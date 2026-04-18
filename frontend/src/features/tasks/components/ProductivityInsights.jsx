function InsightCard({ label, value, hint }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5">
      <p className="text-sm text-zinc-400">{label}</p>
      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-100">
        {value}
      </h3>
      <p className="mt-2 text-xs leading-5 text-zinc-500">{hint}</p>
    </div>
  );
}

export default function ProductivityInsights({
  completionRate,
  activeItems,
  criticalItems,
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <InsightCard
        label="Taxa de conclusão"
        value={`${completionRate}%`}
        hint="Percentual atual de tarefas concluídas no workspace."
      />
      <InsightCard
        label="Carga ativa"
        value={activeItems}
        hint="Itens ainda em andamento ou aguardando ação."
      />
      <InsightCard
        label="Itens críticos"
        value={criticalItems}
        hint="Soma de tarefas atrasadas e tarefas que vencem hoje."
      />
    </section>
  );
}