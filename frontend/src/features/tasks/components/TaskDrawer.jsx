import Drawer from "../../../components/ui/Drawer";
import TaskForm from "./TaskForm";

export default function TaskDrawer({
  open,
  mode,
  task,
  meta,
  isSubmitting,
  onClose,
  onSubmit,
  onMetaChange,
  onToggleFavorite,
}) {
  const isEdit = mode === "edit";

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? "Editar tarefa" : "Nova tarefa"}
      description={
        isEdit
          ? "Atualize conteúdo, prioridade, prazo, status e complementos visuais da tarefa."
          : "Crie uma tarefa com foco, prioridade e prazo de forma organizada."
      }
    >
      <TaskForm
        mode={mode}
        initialValues={task}
        taskId={task?.id}
        meta={meta}
        isSubmitting={isSubmitting}
        onCancel={onClose}
        onSubmit={onSubmit}
        onMetaChange={onMetaChange}
        onToggleFavorite={onToggleFavorite}
      />
    </Drawer>
  );
}