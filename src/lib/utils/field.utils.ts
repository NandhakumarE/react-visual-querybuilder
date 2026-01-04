import type { Field, Operator, Rule } from "../types";
import {
  operators,
  type FieldType,
  type OperatorKey,
} from "../types/common.types";

export const getFieldMap = (field: Field[]): Record<string, Field> => {
    const map: Record<string, Field> = {};
    field.forEach((eachField) => {
        map[eachField.value] = eachField;
    })
    return map
}

export const getSelectedField = (
  rule: Rule,
  fieldMap: Record<string, Field>
): Field | undefined => {
  if (rule.field === undefined) {
    return undefined;
  }
  return fieldMap[rule.field];
};

export const getOperatorForFieldType = (
  fieldType: FieldType,
  operatorsByFieldType: Record<FieldType, Operator[]>
): Operator[] => {
  return operatorsByFieldType[fieldType] || [];
};

export const getSelectedOperatorByKey = (
  key: OperatorKey
): Operator | undefined => {
  return operators[key];
};


