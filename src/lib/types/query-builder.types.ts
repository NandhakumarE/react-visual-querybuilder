import type { DraggableAttributes, Announcements, ScreenReaderInstructions } from "@dnd-kit/core";
import type {
  Query,
  Field,
  FieldType,
  Operator,
  Rule,
  RuleGroup,
} from "./common.types";
import type React from "react";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

interface BaseSlots {
  // lock: React.ReactNode;
  // remove: React.ReactNode;
  // clone: React.ReactNode;

  //Handle exposed separately
  onRemove: () => void;
  onClone: () => void;
  onToggleLock: () => void;
  dragHandles: DragHandleType;
}

interface GroupSlots extends BaseSlots {
  // addGroup: React.ReactNode;
  // addRule: React.ReactNode;

  //Handle exposed separately
  onAddGroup: () => void;
  onAddRule: () => void;
}

export interface RuleRenderProps {
  rule: Rule;
  path: number[];
  depth: number;
  fields: Field[];
  operators: Operator[];
  selectedField?: Field;
  selectedOperator?: Operator;
  slots: BaseSlots;
  onChange: (updates: Partial<Rule>) => void;
}

export interface GroupRenderProps {
  group: Query;
  path: number[];
  children: React.ReactNode;
  depth: number;
  slots: GroupSlots;
  onChange: (updates: Partial<RuleGroup>) => void;
}

export interface QueryBuilderProps {
  value: Query;
  children: React.ReactNode;
  /**
   * Maximum depth of nested groups.
   * - undefined: unlimited nesting
   * - 1: only root level (no nested groups)
   * - 2: root + one level of nesting
   * - 3: root + two levels of nesting
   */
  maxDepth?: number;
  onChange: (query: Query) => void;
}

export interface DragPreviewProps {
  item: Rule | RuleGroup;
  type: "rule" | "group";
}

/**
 * Accessibility options for drag and drop.
 * Use this to customize screen reader text for i18n or accessibility needs.
 */
export interface DragDropAccessibility {
  /**
   * Text announced by screen readers during drag operations.
   * Customize for different languages or clearer descriptions.
   * @example
   * announcements: {
   *   onDragStart: ({ active }) => `Picked up ${active.id}`,
   *   onDragEnd: ({ active, over }) => `Dropped ${active.id}`,
   * }
   */
  announcements?: Announcements;
  /**
   * Instructions read when a draggable item receives focus.
   * Customize for different languages.
   * @example
   * instructions: {
   *   draggable: "Press space to pick up. Use arrow keys to move."
   * }
   */
  instructions?: ScreenReaderInstructions;
}

export interface BuilderProps {
  fields: Field[];
  operatorsByFieldType?: Record<FieldType, Operator[]>;
  renderRule: (props: RuleRenderProps) => React.ReactNode;
  renderGroup: (props: GroupRenderProps) => React.ReactNode;
  renderDragPreview?: (props: DragPreviewProps) => React.ReactNode;
  /**
   * Accessibility options for drag and drop (screen reader support).
   * Use this for i18n or to customize how screen readers announce drag operations.
   */
  dragDropAccessibility?: DragDropAccessibility;
}

export interface UseQueryBuilderReturn {
  query: Query;
  addRule: (path: number[]) => void;
  addGroup: (path: number[]) => void;
  updateRule: (path: number[], updates: Partial<Rule>) => void;
  updateGroup: (path: number[], updates: Partial<RuleGroup>) => void;
  remove: (path: number[]) => void;
  clone: (path: number[]) => void;
  toggleLock: (path: number[]) => void;
  move: (fromPath: number[], toPath: number[]) => void;
}

export interface QueryBuilderContextType extends UseQueryBuilderReturn {
  maxDepth?: number;
}

type DataAttributes = {
  [K in `data-${string}`]?: string;
};

export type DragHandleType =  DraggableAttributes & SyntheticListenerMap | DataAttributes;

export interface DraggableProps {
  id: string;
  path: number[];
  children: (props?:{ dragUtils: DragHandleType }) => React.ReactNode;
  isOverlay?: boolean;
  disable?: boolean;
}
export interface DroppableProps {
  id: string;
  path: number[];
  disable?: boolean;
  maxDepth?: number;
}
export interface BuilderContextType {
  draggable: (props: DraggableProps) => React.ReactNode;
  droppable: (props: DroppableProps) => React.ReactNode;
}


