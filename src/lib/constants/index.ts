import type { DefaultFieldType, Operator, Rule, RuleGroup } from "../types/common.types";
import { operators } from "../types/common.types";

export const DRAG_STATE = {
  idle: 'idle',
  dragging: 'dragging'
}
export const RULE_INITIAL_DATA: Rule = {
  id: "rule-id",
  field: "",
  operator: "equal",
  value: "",
  isLocked: false,
};

export const RULE_GROUP_INITIAL_DATA: RuleGroup = {
  id: "group-id",
  combinator: "and",
  rules: [],
  isLocked: false,
};

/**
 * Default operators for the built-in field types.
 * Users can extend this with custom field types and operators.
 */
export const OPERATORS_BY_FIELD_TYPE: Record<DefaultFieldType, Operator[]> = {
  string: [
    operators.is_empty,
    operators.is_not_empty,
    operators.equal,
    operators.not_equal,
    operators.contains,
    operators.starts_with,
    operators.ends_with,
    operators.in,
    operators.not_in,
  ],
  number: [
    operators.is_empty,
    operators.is_not_empty,
    operators.equal,
    operators.not_equal,
    operators.less,
    operators.less_or_equal,
    operators.greater,
    operators.greater_or_equal,
    operators.between,
    operators.not_between,
    operators.in,
    operators.not_in,
  ],
  boolean: [
    operators.is_empty,
    operators.is_not_empty,
    operators.is_true,
    operators.is_false,
  ],
  date: [
    operators.is_empty,
    operators.is_not_empty,
    operators.equal,
    operators.not_equal,
    operators.less,
    operators.less_or_equal,
    operators.greater,
    operators.greater_or_equal,
    operators.between,
    operators.not_between,
    operators.in,
    operators.not_in,
  ],
};
