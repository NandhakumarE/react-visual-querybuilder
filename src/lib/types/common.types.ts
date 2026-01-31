const operatorTypes = {
  UNARY: "unary",
  BINARY: "binary",
  RANGE: "range",
  LIST: "list",
} as const;

/** Operator type category */
export type OperatorType = (typeof operatorTypes)[keyof typeof operatorTypes];

export const operators = {
  // unary operators
  is_empty: { name: "Is Empty", value: "is_empty", type: operatorTypes.UNARY },
  is_not_empty: {
    name: "Is Not Empty",
    value: "is_not_empty",
    type: operatorTypes.UNARY,
  },
  is_true: { name: "Is True", value: "is_true", type: operatorTypes.UNARY },
  is_false: { name: "Is False", value: "is_false", type: operatorTypes.UNARY },

  // binary operators
  equal: { name: "Equal", value: "equal", type: operatorTypes.BINARY },
  not_equal: {
    name: "Not Equal",
    value: "not_equal",
    type: operatorTypes.BINARY,
  },
  less: { name: "Less Than", value: "less", type: operatorTypes.BINARY },
  less_or_equal: {
    name: "Less Than or Equal",
    value: "less_or_equal",
    type: operatorTypes.BINARY,
  },
  greater: {
    name: "Greater Than",
    value: "greater",
    type: operatorTypes.BINARY,
  },
  greater_or_equal: {
    name: "Greater Than or Equal",
    value: "greater_or_equal",
    type: operatorTypes.BINARY,
  },
  contains: { name: "Contains", value: "contains", type: operatorTypes.BINARY },
  starts_with: {
    name: "Starts With",
    value: "starts_with",
    type: operatorTypes.BINARY,
  },
  ends_with: {
    name: "Ends With",
    value: "ends_with",
    type: operatorTypes.BINARY,
  },

  // range operators
  between: { name: "Between", value: "between", type: operatorTypes.RANGE },
  not_between: {
    name: "Not Between",
    value: "not_between",
    type: operatorTypes.RANGE,
  },

  //list operators
  in: { name: "In", value: "in", type: operatorTypes.LIST },
  not_in: { name: "Not In", value: "not_in", type: operatorTypes.LIST },
} as const;

export type OperatorKey = keyof typeof operators;

type ValueBinary = string | number | boolean | Date;
type ValueRange = [number, number] | [string, string] | [Date, Date];
type ValueList = string[] | number[] | boolean[] | Date[];
export type Value = ValueBinary | ValueRange | ValueList;

export type Combinator = "and" | "or";
/** Default field types provided by the library */
export type DefaultFieldType = "string" | "number" | "boolean" | "date";
/**
 * Field type - can be any string.
 * Default types: "string", "number", "boolean", "date"
 * Custom types: "datetime", "currency", "email", etc.
 */
export type FieldType = string;

/**
 * Operator definition.
 * You can use the built-in operators or create custom ones with any name.
 */
export interface Operator {
  /** Display name (can be any string, supports i18n) */
  name: string;
  /** Unique identifier for the operator */
  value: string;
  /** Operator category: "unary", "binary", "range", or "list" */
  type: OperatorType;
}

export interface Field {
  label: string;
  value: string;
  type: FieldType;
}

export interface Rule {
  id: string;
  field: string;
  operator: OperatorKey;
  value?: Value;
  isLocked?: boolean;
}

export interface RuleGroup {
  id: string;
  combinator: Combinator;
  rules: Array<Rule | RuleGroup>;
  isLocked?: boolean;
}

export type RuleUpdate = Partial<Omit<Rule, 'id'>>;
export type RuleGroupUpdate = Partial<Omit<RuleGroup, 'id'|'rules'>>;

export type Query = RuleGroup;
