import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { BuilderProps, SortableContainerProps, BaseComponentProps } from "../types";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import Builder from "./Builder";
import BuilderContext from "../context/BuilderContext";
import { useState } from "react";

const SortableItem = ({ id, children }: BaseComponentProps) => {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

const SortableContainer = ({ items, children }: SortableContainerProps) => {
  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      {children}
    </SortableContext>
  );
};

export const BuilderWithDnD = (props: BuilderProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );
  const [activeId, setActiveId] = useState<string | null>(null)

  const onDragStart = (event:DragStartEvent) => {
    console.log("dragstart", event);
     setActiveId(event.active.id as string);
  }

  const onDragEnd = (event: DragEndEvent) => {
    console.log("dragend", event);
    setActiveId(null);
  };

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <BuilderContext.Provider
        value={{
          itemWrapper: SortableItem,
          containerWrapper: SortableContainer,
        }}
      >
        <Builder {...props} />
        <DragOverlay>
          {activeId ?  <div style={{ height: '100px', width: "100%", background:'steelblue' }}/> : null }
        </DragOverlay>
      </BuilderContext.Provider>
    </DndContext>
  );
};
