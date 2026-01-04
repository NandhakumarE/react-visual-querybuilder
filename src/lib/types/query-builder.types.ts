import type {
  Query,
  Field,
  FieldType,
  Operator,
  Rule,
  RuleGroup,
} from "./common.types";
import type React from "react";

interface BaseSlots {
  lock: React.ReactNode;
  remove: React.ReactNode;
  clone: React.ReactNode;

  //Handle exposed separately
  onRemove: () => void;
  onClone: () => void;
  onToggleLock: () => void;
}

interface GroupSlots extends BaseSlots {
  addGroup: React.ReactNode;
  addRule: React.ReactNode;

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

export interface BuilderProps {
  fields: Field[];
  operatorsByFieldType?: Record<FieldType, Operator[]>;
  renderRule: (props: RuleRenderProps) => React.ReactNode;
  renderGroup: (props: GroupRenderProps) => React.ReactNode;
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