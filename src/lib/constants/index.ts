import type { FieldType, Operator, Rule, RuleGroup } from "../types/common.types";
import { operators } from "../types/common.types";

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

export const OPERATORS_BY_FIELD_TYPE: Record<FieldType, Operator[]> = {
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
