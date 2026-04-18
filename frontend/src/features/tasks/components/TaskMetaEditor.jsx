import { useState } from "react";
import { Check, Plus, Star, Tag, Trash2 } from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

export default function TaskMetaEditor({
  taskId,
  meta,
  onToggleFavorite,
  onMetaChange,
}) {
  const [tagInput, setTagInput] = useState("");
  const [checklistInput, setChecklistInput] = useState("");

  function addTag() {
    const value = tagInput.trim();
    if (!value) return;

    onMetaChange(taskId, (current) => ({
      ...current,
      tags: [...current.tags, value],
    }));

    setTagInput("");
  }

  function removeTag(tagToRemove) {
    onMetaChange(taskId, (current) => ({
      ...current,
      tags: current.tags.filter((tag) => tag !== tagToRemove),
    }));
  }

  function addChecklistItem() {
    const value = checklistInput.trim();
    if (!value) return;

    onMetaChange(taskId, (current) => ({
      ...current,
      checklist: [
        ...current.checklist,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          text: value,
          done: false,
        },
      ],
    }));

    setChecklistInput("");
  }

  function toggleChecklistItem(itemId) {
    onMetaChange(taskId, (current) => ({
      ...current,
      checklist: current.checklist.map((item) =>
        item.id === itemId ? { ...item, done: !item.done } : item
      ),
    }));
  }

  function removeChecklistItem(itemId) {
    onMetaChange(taskId, (current) => ({
      ...current,
      checklist: current.checklist.filter((item) => item.id !== itemId),
    }));
  }

  const doneCount = meta.checklist.filter((item) => item.done).length;

  return (
    <div className="space-y-6 border-t border-zinc-800 pt-6">
      <div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-medium text-zinc-200">Destaque da tarefa</h3>
            <p className="mt-1 text-sm text-zinc-500">
              Marque esta tarefa como favorita para leitura mais rápida.
            </p>
          </div>

          <Button
            variant={meta.favorite ? "primary" : "secondary"}
            size="sm"
            onClick={() => onToggleFavorite(taskId)}
          >
            <Star size={14} fill={meta.favorite ? "currentColor" : "none"} />
            {meta.favorite ? "Favorita" : "Favoritar"}
          </Button>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-zinc-400" />
          <h3 className="text-sm font-medium text-zinc-200">Tags</h3>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {meta.tags.length > 0 ? (
            meta.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="rounded-full p-0.5 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-100"
                >
                  <Trash2 size={10} />
                </button>
              </span>
            ))
          ) : (
            <p className="text-sm text-zinc-500">Nenhuma tag adicionada.</p>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <Input
            placeholder="Ex.: comercial, urgente, revisão"
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addTag();
              }
            }}
          />
          <Button type="button" variant="secondary" onClick={addTag}>
            <Plus size={14} />
            Adicionar
          </Button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-medium text-zinc-200">Checklist local</h3>
            <p className="mt-1 text-sm text-zinc-500">
              {doneCount}/{meta.checklist.length} item{meta.checklist.length === 1 ? "" : "s"} concluído{meta.checklist.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {meta.checklist.length > 0 ? (
            meta.checklist.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3"
              >
                <button
                  type="button"
                  onClick={() => toggleChecklistItem(item.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      item.done
                        ? "border-emerald-400 bg-emerald-400 text-zinc-950"
                        : "border-zinc-700 text-transparent"
                    }`}
                  >
                    <Check size={12} />
                  </span>

                  <span
                    className={`truncate text-sm ${
                      item.done ? "text-zinc-500 line-through" : "text-zinc-200"
                    }`}
                  >
                    {item.text}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => removeChecklistItem(item.id)}
                  className="rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-rose-300"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-500">Nenhum item no checklist.</p>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <Input
            placeholder="Adicionar subtarefa"
            value={checklistInput}
            onChange={(event) => setChecklistInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addChecklistItem();
              }
            }}
          />
          <Button type="button" variant="secondary" onClick={addChecklistItem}>
            <Plus size={14} />
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
}