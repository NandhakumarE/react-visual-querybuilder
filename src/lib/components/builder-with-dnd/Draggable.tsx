import { useDraggable } from "@dnd-kit/core";
import type { DraggableProps, DragUtilsType } from "../../types";
import { CSS } from "@dnd-kit/utilities";

const Draggable = ({
  id,
  path = [],
  children,
  isOverlay = false,
  disable,
}: DraggableProps) => {
  const { setNodeRef, attributes, listeners, transform, isDragging } =
    useDraggable({ id, data: { path }, disabled: disable });

  if (disable) return <>{children()}</>;

  const dragUtils: DragUtilsType = {
    attributes,
    listeners,
  };

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={{
          background: "#f5f5f5",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      >
        {children({ dragUtils })}
      </div>
    );
  }

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({ dragUtils })}
    </div>
  );
};

export default Draggable;
