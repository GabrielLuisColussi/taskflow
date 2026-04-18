import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";
import {
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from "../../../lib/constants/task-options";
import TaskMetaEditor from "./TaskMetaEditor";

const schema = z.object({
  title: z.string().trim().min(1, "Título é obrigatório."),
  description: z.string().optional(),
  priority: z.enum(["baixa", "media", "alta"]),
  status: z.enum(["pendente", "em_andamento", "concluida"]),
  due_date: z.string().optional(),
});

const defaultValues = {
  title: "",
  description: "",
  priority: "media",
  status: "pendente",
  due_date: "",
};

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-2 text-sm text-rose-300">{message}</p>;
}

export default function TaskForm({
  mode = "create",
  initialValues,
  isSubmitting,
  onSubmit,
  onCancel,
  taskId,
  meta,
  onMetaChange,
  onToggleFavorite,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (mode === "edit" && initialValues) {
      reset({
        title: initialValues.title || "",
        description: initialValues.description || "",
        priority: initialValues.priority || "media",
        status: initialValues.status || "pendente",
        due_date: initialValues.due_date || "",
      });
      return;
    }

    reset(defaultValues);
  }, [initialValues, mode, reset]);

  function submit(values) {
    onSubmit({
      title: values.title.trim(),
      description: values.description?.trim() ? values.description.trim() : null,
      priority: values.priority,
      status: values.status,
      due_date: values.due_date ? values.due_date : null,
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">Título</label>
        <Input placeholder="Ex.: Validar apresentação comercial" {...register("title")} />
        <FieldError message={errors.title?.message} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">Descrição</label>
        <Textarea
          rows={5}
          placeholder="Adicione contexto suficiente para facilitar a execução da tarefa"
          {...register("description")}
        />
        <FieldError message={errors.description?.message} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">Prioridade</label>
          <Select {...register("priority")}>
            {TASK_PRIORITY_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
          <FieldError message={errors.priority?.message} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">Prazo</label>
          <Input type="date" {...register("due_date")} />
          <FieldError message={errors.due_date?.message} />
        </div>
      </div>

      {mode === "edit" ? (
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">Status</label>
          <Select {...register("status")}>
            {TASK_STATUS_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
          <FieldError message={errors.status?.message} />
        </div>
      ) : null}

      {mode === "edit" && taskId ? (
        <TaskMetaEditor
          taskId={taskId}
          meta={meta}
          onMetaChange={onMetaChange}
          onToggleFavorite={onToggleFavorite}
        />
      ) : (
        <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/60 px-4 py-4 text-sm text-zinc-500">
          Salve a tarefa primeiro para adicionar favoritos, tags e checklist local.
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-zinc-800 pt-5 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {mode === "edit" ? "Salvar alterações" : "Criar tarefa"}
        </Button>
      </div>
    </form>
  );
}