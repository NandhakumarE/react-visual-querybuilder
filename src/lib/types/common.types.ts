const operatorTypes = {
  UNARY: "unary",
  BINARY: "binary",
  RANGE: "range",
  LIST: "list",
} as const;

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
export type FieldType = "string" | "number" | "boolean" | "date";
export type Operator = (typeof operators)[OperatorKey];

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
