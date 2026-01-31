// Common types
export {
  operators,
  type Combinator,
  type DefaultFieldType,
  type FieldType,
  type Operator,
  type OperatorType,
  type OperatorKey,
  type Field,
  type Value,
  type Rule,
  type RuleGroup,
  type Query,
  type RuleUpdate,
  type RuleGroupUpdate
} from "./common.types";

// QueryBuilder component types
export {
  type RuleRenderProps,
  type GroupRenderProps,
  type QueryBuilderProps,
  type BuilderProps,
  type DragPreviewProps,
  type UseQueryBuilderReturn,
  type QueryBuilderContextType,
  type BuilderContextType,
  type DraggableProps,
  type DroppableProps,
  type DragHandleType,
  type DragDropAccessibility
} from "./query-builder.types";

// Re-export @dnd-kit accessibility types for i18n customization
export type { Announcements, ScreenReaderInstructions } from "@dnd-kit/core";
