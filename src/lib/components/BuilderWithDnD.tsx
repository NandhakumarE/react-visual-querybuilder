import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { BuilderProps, SortableItemProps } from "../types";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Builder from "./Builder";
import BuilderContext from "../context/BuilderContext";

const SortableItem = ({ id, children }: SortableItemProps) => {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

export const BuilderWithDnD = (props: BuilderProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );
  return (
    <DndContext sensors={sensors}>
      <BuilderContext.Provider value={{ itemWrapper: SortableItem }}>
        <Builder {...props} />
      </BuilderContext.Provider>
    </DndContext>
  );
};
