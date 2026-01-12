import type { BuilderProps } from "../../types";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import Builder from "../builder";
import BuilderContext from "../../context/BuilderContext";
import { useState } from "react";
import useQueryBuilderContext from "../../hooks/useQueryBuilderContext";
import Draggable from "./Draggable";
import Droppable from "./Droppable";
import DefaultDragOverlay from "./DefaultDragOverlay";

export const BuilderWithDnD = (props: BuilderProps) => {
  const { query, move } = useQueryBuilderContext();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  const onDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const onDragEnd = (event: DragEndEvent) => {
    console.log("dragend", event);
    const sourcePath = event.active?.data?.current?.path || [];
    const destPath = event.over?.data?.current?.path || [];
    if (sourcePath.length > 0 && destPath.length > 0) move(sourcePath, destPath);
    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <BuilderContext.Provider
        value={{
          draggable: Draggable,
          droppable: Droppable,
        }}
      >
        <Builder {...props} />
        <DragOverlay>
          <DefaultDragOverlay
            activeId={activeId}
            query={query}
            fields={props.fields}
            operatorsByFieldType={props.operatorsByFieldType}
            renderDragPreview={props.renderDragPreview}
            renderGroup={props.renderGroup}
            renderRule={props.renderRule}
          />
        </DragOverlay>
      </BuilderContext.Provider>
    </DndContext>
  );
};
