import { describe, expect, it } from "vitest";
import {
  getFieldMap,
  getSelectedField,
  getOperatorForFieldType,
  getSelectedOperatorByKey,
} from "./field.utils";
import type { Field, Rule } from "../types";
import { operators } from "../types/common.types";
import { OPERATORS_BY_FIELD_TYPE } from "../constants";

const createFields = (): Field[] => [
  { label: "Name", value: "name", type: "string" },
  { label: "Age", value: "age", type: "number" },
];

describe("field utils", () => {
  describe("getFieldMap", () => {
    it("should create a map from field value to field object", () => {
      const fields = createFields();
      const fieldMap = getFieldMap(fields);

      expect(fieldMap["name"]).toEqual({ label: "Name", value: "name", type: "string" });
      expect(fieldMap["age"]).toEqual({ label: "Age", value: "age", type: "number" });
    });

    it("should return empty object for empty fields array", () => {
      const fieldMap = getFieldMap([]);
      expect(Object.keys(fieldMap).length).toBe(0);
    });
  });

  describe("getSelectedField", () => {
    it("should return the field when rule field exists in fieldMap", () => {
      const fieldMap = getFieldMap(createFields());
      const rule: Rule = { id: "r1", field: "name", operator: "equal" };

      expect(getSelectedField(rule, fieldMap)).toEqual({
        label: "Name",
        value: "name",
        type: "string",
      });
    });

    it("should return undefined when rule field does not exist", () => {
      const fieldMap = getFieldMap(createFields());
      const rule: Rule = { id: "r1", field: "nonexistent", operator: "equal" };

      expect(getSelectedField(rule, fieldMap)).toBeUndefined();
    });

    it("should return undefined when rule field is undefined", () => {
      const fieldMap = getFieldMap(createFields());
      const rule = { id: "r1", field: undefined, operator: "equal" } as unknown as Rule;

      expect(getSelectedField(rule, fieldMap)).toBeUndefined();
    });
  });

  describe("getOperatorForFieldType", () => {
    it("should return operators for given field type", () => {
      const ops = getOperatorForFieldType("string", OPERATORS_BY_FIELD_TYPE);

      expect(ops.length).toBeGreaterThan(0);
      expect(ops).toContainEqual(expect.objectContaining({ value: "contains" }));
    });

    it("should return empty array for invalid field type", () => {
      const ops = getOperatorForFieldType("invalid" as "string", OPERATORS_BY_FIELD_TYPE);
      expect(ops).toEqual([]);
    });
  });

  describe("getSelectedOperatorByKey", () => {
    it("should return operator for valid key", () => {
      expect(getSelectedOperatorByKey("equal")).toBe(operators.equal);
      expect(getSelectedOperatorByKey("contains")).toBe(operators.contains);
    });

    it("should return undefined for invalid key", () => {
      expect(getSelectedOperatorByKey("invalid" as "equal")).toBeUndefined();
    });
  });
});
