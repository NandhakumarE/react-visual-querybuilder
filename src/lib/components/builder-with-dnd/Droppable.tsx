import { useDndContext, useDroppable } from "@dnd-kit/core";
import type { DroppableProps } from "../../types";
import { isInvalidDrop } from "../../utils";

const Droppable = ({ id, path, disable }: DroppableProps) => {
  const { active } = useDndContext();

  const dragPath = active?.data?.current?.path || [];

  const isDisabled = isInvalidDrop(dragPath, path) || disable;

  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { path },
    disabled: isDisabled,
  });

  if (isDisabled) return null;

  return (
    <div
      ref={setNodeRef}
      style={{
        height: "1px",
        transition: "all 0.2s ease",
        margin: isOver ? ".25rem 0" : 0,
        borderTop: isOver ? " 3px dashed #2196f3" : "none",
      }}
    />
  );
};

export default Droppable;
