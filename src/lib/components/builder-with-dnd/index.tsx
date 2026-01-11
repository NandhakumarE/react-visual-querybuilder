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
import { findItemById, isRuleGroup } from "../../utils";
import Draggable from "./Draggable";
import Droppable from "./Droppable";


const DefaultDragPreview = ({
  item,
  type,
}: {
  item: { id: string };
  type: "rule" | "group";
}) => (
  <div
    style={{
      padding: "8px 12px",
      background: type === "rule" ? "#e3f2fd" : "#f3e5f5",
      border: `1px solid ${type === "rule" ? "#90caf9" : "#ce93d8"}`,
      borderRadius: "4px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    }}
  >
    {type === "rule" ? "Rule" : "Group"}: {item.id.slice(0, 8)}...
  </div>
);

export const BuilderWithDnD = (props: BuilderProps) => {
  const { query } = useQueryBuilderContext();
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
    setActiveId(null);
  };

  const renderDragOverlay = () => {
    if (!activeId) return null;

    const result = findItemById(query, activeId);
    if (!result) return null;

    const { item } = result;
    const type = isRuleGroup(item) ? "group" : "rule";

    if (props.renderDragPreview) {
      return props.renderDragPreview({ item, type });
    }

    return <DefaultDragPreview item={item} type={type} />;
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
        <DragOverlay>{renderDragOverlay()}</DragOverlay>
      </BuilderContext.Provider>
    </DndContext>
  );
};
