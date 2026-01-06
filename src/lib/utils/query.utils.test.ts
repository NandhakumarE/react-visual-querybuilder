import { describe, expect, it } from "vitest";
import { addToQuery, duplicateInQuery, moveHandler, removeFromQuery, toggleLockInQuery, updateRuleGroupInQuery, updateRuleInQuery } from "./query.utils";
import type { Query, Rule, RuleGroup } from "../types";

const createQuery = (): Query => ({
  id: "root",
  combinator: "and",
  rules: [
    { id: "r1", field: "name", operator: "equal", value: "John" },
    {
      id: "g1",
      combinator: "or",
      rules: [
        { id: "r2", field: "age", operator: "greater", value: 30 },
        {
          id: "g2",
          combinator: "and",
          rules: [{ id: "r3", field: "city", operator: "equal", value: "NYC" }],
        },
      ],
    },
  ],
});

describe("query utils", () => {
  describe("addToQuery", () => {
    const ruleToBeAdded: Rule = {
      id: "r4",
      field: "country",
      operator: "equal",
      value: "USA",
      isLocked: false,
    };
    const ruleGroupTOBeAdded: RuleGroup = {
      id: "g2",
      combinator: "and",
      rules: [],
    };
    it("should add a rule at the root level", () => {
      const query = createQuery();
      const updatedQuery = addToQuery(query, [], ruleToBeAdded);

      expect(updatedQuery.rules.length).toBe(3);
      expect((updatedQuery.rules[2] as Rule).id).toBe("r4");
    });

    it("should add a rule group at the root level", () => {
      const query = createQuery();
      const updatedQuery = addToQuery(query, [], ruleGroupTOBeAdded);

      expect(updatedQuery.rules.length).toBe(3);
      expect((updatedQuery.rules[2] as Rule).id).toBe("g2");
    });

    it("should add a rule at the nested level", () => {
      const query = createQuery();
      const updatedQuery = addToQuery(query, [1], ruleToBeAdded);

      expect((updatedQuery.rules[1] as RuleGroup).rules.length).toBe(3);
      expect(((updatedQuery.rules[1] as RuleGroup).rules[2] as Rule).id).toBe(
        "r4"
      );
    });

    it("should add a rule group at the nested level", () => {
      const query = createQuery();
      const updatedQuery = addToQuery(query, [1], ruleGroupTOBeAdded);

      expect((updatedQuery.rules[1] as RuleGroup).rules.length).toBe(3);
      expect(((updatedQuery.rules[1] as RuleGroup).rules[2] as Rule).id).toBe(
        "g2"
      );
    });
    it("should add a rule at deep nested level", () => {
      const query = createQuery();
      const updatedQuery = addToQuery(query, [1, 1], ruleToBeAdded);

      expect(
        ((updatedQuery.rules[1] as RuleGroup).rules[1] as RuleGroup).rules
          .length
      ).toBe(2);
      expect(
        ((updatedQuery.rules[1] as RuleGroup).rules[1] as RuleGroup).rules[1].id
      ).toBe("r4");
    });
    it("should not mutate the original query", () => {
      const query = createQuery();
      const originalRulesLength = query.rules.length;
      addToQuery(query, [], ruleToBeAdded);

      expect(query.rules.length).toBe(originalRulesLength);
    });
    it("should add to a group with empty rules", () => {
      const emptyQuery: Query = {
        id: "root",
        combinator: "and",
        rules: [],
      };

      const updatedQuery = addToQuery(emptyQuery, [], ruleToBeAdded);

      expect(updatedQuery.rules.length).toBe(1);
      expect((updatedQuery.rules[0] as Rule).id).toBe("r4");
    });
    it("should handle invalid path gracefully", () => {
      const query = createQuery();
      const updatedQuery = addToQuery(query, [99], ruleToBeAdded);

      // Should not throw, rules unchanged at root
      expect(updatedQuery.rules.length).toBe(2);
    });
    it("should return a new query reference", () => {
      const query = createQuery();
      const updatedQuery = addToQuery(query, [], ruleToBeAdded);

      expect(updatedQuery).not.toBe(query);
    });

    it("should create new references for modified nested groups", () => {
      const query = createQuery();
      const updatedQuery = addToQuery(query, [1], ruleToBeAdded);

      expect(updatedQuery.rules[1]).not.toBe(query.rules[1]);
    });

    it("should keep same reference for unmodified siblings", () => {
      const query = createQuery();
      const updatedQuery = addToQuery(query, [1], ruleToBeAdded);

      expect(updatedQuery.rules[0]).toBe(query.rules[0]); // r1 unchanged
    });
  });
  describe("removeFromQuery", () => {
    it("should remove a rule at root level", () => {
      const query = createQuery();
      const updatedQuery = removeFromQuery(query, [0]);

      expect(updatedQuery.rules.length).toBe(1);
      expect((updatedQuery.rules[0] as RuleGroup).id).toBe("g1");
    });

    it("should remove a group at root level", () => {
      const query = createQuery();
      const updatedQuery = removeFromQuery(query, [1]);

      expect(updatedQuery.rules.length).toBe(1);
      expect((updatedQuery.rules[0] as Rule).id).toBe("r1");
    });

    it("should remove a rule at nested level", () => {
      const query = createQuery();
      const updatedQuery = removeFromQuery(query, [1, 0]);

      const g1 = updatedQuery.rules[1] as RuleGroup;
      expect(g1.rules.length).toBe(1);
      expect((g1.rules[0] as RuleGroup).id).toBe("g2");
    });

    it("should remove a group at nested level", () => {
      const query = createQuery();
      const updatedQuery = removeFromQuery(query, [1, 1]);

      const g1 = updatedQuery.rules[1] as RuleGroup;
      expect(g1.rules.length).toBe(1);
      expect((g1.rules[0] as Rule).id).toBe("r2");
    });

    it("should remove at deeply nested level", () => {
      const query = createQuery();
      const updatedQuery = removeFromQuery(query, [1, 1, 0]);

      const g1 = updatedQuery.rules[1] as RuleGroup;
      const g2 = g1.rules[1] as RuleGroup;
      expect(g2.rules.length).toBe(0);
    });

    it("should not mutate the original query", () => {
      const query = createQuery();

      removeFromQuery(query, [1, 0]);

      expect(query.rules.length).toBe(2);
      expect((query.rules[1] as RuleGroup).rules.length).toBe(2);
    });

    it("should return a new query reference", () => {
      const query = createQuery();
      const updatedQuery = removeFromQuery(query, [0]);

      expect(updatedQuery).not.toBe(query);
    });

    it("should create new reference for modified nested groups", () => {
      const query = createQuery();
      const updatedQuery = removeFromQuery(query, [1, 0]);

      expect(updatedQuery.rules[1]).not.toBe(query.rules[1]);
    });

    it("should keep same reference for unmodified siblings", () => {
      const query = createQuery();
      const updatedQuery = removeFromQuery(query, [1, 0]);

      expect(updatedQuery.rules[0]).toBe(query.rules[0]);
    });

    it("should handle empty path", () => {
      const query = createQuery();
      const updatedQuery = removeFromQuery(query, []);

      expect(updatedQuery.rules.length).toBe(2);
    });

    it("should handle invalid path index", () => {
      const query = createQuery();
      const updatedQuery = removeFromQuery(query, [99]);

      expect(updatedQuery.rules.length).toBe(2);
    });

    it("should result in empty rules when removing last item", () => {
      const query = createQuery();
      const updatedQuery = removeFromQuery(query, [1, 1, 0]);

      const g1 = updatedQuery.rules[1] as RuleGroup;
      const g2 = g1.rules[1] as RuleGroup;
      expect(g2.rules).toEqual([]);
    });
  });
  describe("duplicateInQuery", () => {
    it("should duplicate a rule at root level", () => {
      const query = createQuery();
      const updatedQuery = duplicateInQuery(query, [0]);

      expect(updatedQuery.rules.length).toBe(3);
      expect((updatedQuery.rules[0] as Rule).field).toBe("name");
      expect((updatedQuery.rules[1] as Rule).field).toBe("name"); // duplicate
      expect((updatedQuery.rules[2] as RuleGroup).id).toBe("g1");
    });

    it("should duplicate a group at root level", () => {
      const query = createQuery();
      const updatedQuery = duplicateInQuery(query, [1]);

      expect(updatedQuery.rules.length).toBe(3);
      expect((updatedQuery.rules[1] as RuleGroup).combinator).toBe("or");
      expect((updatedQuery.rules[2] as RuleGroup).combinator).toBe("or"); // duplicate
    });

    it("should duplicate a rule at nested level", () => {
      const query = createQuery();
      const updatedQuery = duplicateInQuery(query, [1, 0]);

      const g1 = updatedQuery.rules[1] as RuleGroup;
      expect(g1.rules.length).toBe(3);
      expect((g1.rules[0] as Rule).field).toBe("age");
      expect((g1.rules[1] as Rule).field).toBe("age"); // duplicate
      expect((g1.rules[2] as RuleGroup).id).toBe("g2");
    });

    it("should duplicate a group at nested level", () => {
      const query = createQuery();
      const updatedQuery = duplicateInQuery(query, [1, 1]);

      const g1 = updatedQuery.rules[1] as RuleGroup;
      expect(g1.rules.length).toBe(3);
      expect((g1.rules[1] as RuleGroup).combinator).toBe("and");
      expect((g1.rules[2] as RuleGroup).combinator).toBe("and"); // duplicate
    });

    it("should duplicate at deeply nested level", () => {
      const query = createQuery();
      const updatedQuery = duplicateInQuery(query, [1, 1, 0]);

      const g1 = updatedQuery.rules[1] as RuleGroup;
      const g2 = g1.rules[1] as RuleGroup;
      expect(g2.rules.length).toBe(2);
      expect((g2.rules[0] as Rule).field).toBe("city");
      expect((g2.rules[1] as Rule).field).toBe("city"); // duplicate
    });

    it("should generate new ID for duplicated rule", () => {
      const query = createQuery();
      const updatedQuery = duplicateInQuery(query, [0]);

      const original = updatedQuery.rules[0] as Rule;
      const duplicate = updatedQuery.rules[1] as Rule;

      expect(duplicate.id).not.toBe(original.id);
      expect(duplicate.field).toBe(original.field);
      expect(duplicate.operator).toBe(original.operator);
      expect(duplicate.value).toBe(original.value);
    });

    it("should generate new ID for duplicated group", () => {
      const query = createQuery();
      const updatedQuery = duplicateInQuery(query, [1]);

      const original = updatedQuery.rules[1] as RuleGroup;
      const duplicate = updatedQuery.rules[2] as RuleGroup;

      expect(duplicate.id).not.toBe(original.id);
      expect(duplicate.combinator).toBe(original.combinator);
    });

    it("should generate new IDs for all nested items in duplicated group", () => {
      const query = createQuery();
      const updatedQuery = duplicateInQuery(query, [1]);

      const original = updatedQuery.rules[1] as RuleGroup;
      const duplicate = updatedQuery.rules[2] as RuleGroup;

      // g1's nested r2
      expect((duplicate.rules[0] as Rule).id).not.toBe(
        (original.rules[0] as Rule).id
      );

      // g1's nested g2
      expect((duplicate.rules[1] as RuleGroup).id).not.toBe(
        (original.rules[1] as RuleGroup).id
      );

      // g2's nested r3
      const originalG2 = original.rules[1] as RuleGroup;
      const duplicateG2 = duplicate.rules[1] as RuleGroup;
      expect((duplicateG2.rules[0] as Rule).id).not.toBe(
        (originalG2.rules[0] as Rule).id
      );
    });

    it("should insert duplicate immediately after original", () => {
      const query = createQuery();
      const updatedQuery = duplicateInQuery(query, [0]);

      expect((updatedQuery.rules[0] as Rule).id).toBe("r1"); // original
      expect((updatedQuery.rules[1] as Rule).id).not.toBe("r1"); // duplicate (new id)
      expect((updatedQuery.rules[1] as Rule).field).toBe("name"); // same data
      expect((updatedQuery.rules[2] as RuleGroup).id).toBe("g1"); // shifted
    });

    it("should not mutate the original query", () => {
      const query = createQuery();

      duplicateInQuery(query, [0]);

      expect(query.rules.length).toBe(2);
      expect((query.rules[0] as Rule).id).toBe("r1");
    });

    it("should return a new query reference", () => {
      const query = createQuery();
      const updatedQuery = duplicateInQuery(query, [0]);

      expect(updatedQuery).not.toBe(query);
    });

    it("should create new reference for modified nested groups", () => {
      const query = createQuery();
      const updatedQuery = duplicateInQuery(query, [1, 0]);

      expect(updatedQuery.rules[1]).not.toBe(query.rules[1]);
    });

    it("should keep same reference for unmodified siblings", () => {
      const query = createQuery();
      const updatedQuery = duplicateInQuery(query, [1, 0]);

      expect(updatedQuery.rules[0]).toBe(query.rules[0]);
    });

    it("should handle empty path", () => {
      const query = createQuery();
      const updatedQuery = duplicateInQuery(query, []);

      expect(updatedQuery.rules.length).toBe(2); // unchanged
    });

    it("should handle invalid path index", () => {
      const query = createQuery();
      const updatedQuery = duplicateInQuery(query, [99]);

      expect(updatedQuery.rules.length).toBe(2); // unchanged
    });
  });
  describe("toggleLockInQuery", () => {
    it("should lock a rule at root level", () => {
      const query = createQuery();
      const updatedQuery = toggleLockInQuery(query, [0]);

      expect((updatedQuery.rules[0] as Rule).isLocked).toBe(true);
    });

    it("should unlock a previously locked rule", () => {
      const query: Query = {
        ...createQuery(),
        rules: [
          {
            id: "r1",
            field: "name",
            operator: "equal",
            value: "John",
            isLocked: true,
          },
          createQuery().rules[1],
        ],
      };
      const updatedQuery = toggleLockInQuery(query, [0]);

      expect((updatedQuery.rules[0] as Rule).isLocked).toBe(false);
    });

    it("should lock a group at root level", () => {
      const query = createQuery();
      const updatedQuery = toggleLockInQuery(query, [1]);

      expect((updatedQuery.rules[1] as RuleGroup).isLocked).toBe(true);
    });

    it("should cascade lock state to all children when locking a group", () => {
      const query = createQuery();
      const updatedQuery = toggleLockInQuery(query, [1]);

      const g1 = updatedQuery.rules[1] as RuleGroup;
      expect(g1.isLocked).toBe(true);
      expect((g1.rules[0] as Rule).isLocked).toBe(true); // r2
      expect((g1.rules[1] as RuleGroup).isLocked).toBe(true); // g2

      const g2 = g1.rules[1] as RuleGroup;
      expect((g2.rules[0] as Rule).isLocked).toBe(true); // r3
    });

    it("should cascade unlock state to all children when unlocking a group", () => {
      const query: Query = {
        id: "root",
        combinator: "and",
        rules: [
          { id: "r1", field: "name", operator: "equal", value: "John" },
          {
            id: "g1",
            combinator: "or",
            isLocked: true,
            rules: [
              {
                id: "r2",
                field: "age",
                operator: "greater",
                value: 30,
                isLocked: true,
              },
              {
                id: "r3",
                field: "city",
                operator: "equal",
                value: "NYC",
                isLocked: true,
              },
            ],
          },
        ],
      };
      const updatedQuery = toggleLockInQuery(query, [1]);

      const g1 = updatedQuery.rules[1] as RuleGroup;
      expect(g1.isLocked).toBe(false);
      expect((g1.rules[0] as Rule).isLocked).toBe(false);
      expect((g1.rules[1] as Rule).isLocked).toBe(false);
    });

    it("should lock a rule at nested level", () => {
      const query = createQuery();
      const updatedQuery = toggleLockInQuery(query, [1, 0]);

      const g1 = updatedQuery.rules[1] as RuleGroup;
      expect((g1.rules[0] as Rule).isLocked).toBe(true);
    });

    it("should lock a group at nested level with cascade", () => {
      const query = createQuery();
      const updatedQuery = toggleLockInQuery(query, [1, 1]);

      const g1 = updatedQuery.rules[1] as RuleGroup;
      const g2 = g1.rules[1] as RuleGroup;
      expect(g2.isLocked).toBe(true);
      expect((g2.rules[0] as Rule).isLocked).toBe(true); // r3
    });

    it("should toggle at deeply nested level", () => {
      const query = createQuery();
      const updatedQuery = toggleLockInQuery(query, [1, 1, 0]);

      const g1 = updatedQuery.rules[1] as RuleGroup;
      const g2 = g1.rules[1] as RuleGroup;
      expect((g2.rules[0] as Rule).isLocked).toBe(true);
    });

    it("should not toggle nested item if parent is locked", () => {
      const query: Query = {
        id: "root",
        combinator: "and",
        isLocked: false,
        rules: [
          {
            id: "g1",
            combinator: "or",
            isLocked: true,
            rules: [
              {
                id: "r1",
                field: "age",
                operator: "greater",
                value: 30,
                isLocked: true,
              },
            ],
          },
        ],
      };
      const updatedQuery = toggleLockInQuery(query, [0, 0]);

      const g1 = updatedQuery.rules[0] as RuleGroup;
      // Should remain locked because parent g1 is locked
      expect((g1.rules[0] as Rule).isLocked).toBe(true);
    });

    it("should toggle lock on root with empty path", () => {
      const query = createQuery();
      const updatedQuery = toggleLockInQuery(query, []);

      expect(updatedQuery.isLocked).toBe(true);
    });

    it("should cascade lock to all items when locking root", () => {
      const query = createQuery();
      const updatedQuery = toggleLockInQuery(query, []);

      expect(updatedQuery.isLocked).toBe(true);
      expect((updatedQuery.rules[0] as Rule).isLocked).toBe(true);

      const g1 = updatedQuery.rules[1] as RuleGroup;
      expect(g1.isLocked).toBe(true);
      expect((g1.rules[0] as Rule).isLocked).toBe(true);

      const g2 = g1.rules[1] as RuleGroup;
      expect(g2.isLocked).toBe(true);
      expect((g2.rules[0] as Rule).isLocked).toBe(true);
    });

    it("should not mutate the original query", () => {
      const query = createQuery();
      const originalLocked = (query.rules[0] as Rule).isLocked;

      toggleLockInQuery(query, [0]);

      expect((query.rules[0] as Rule).isLocked).toBe(originalLocked);
    });

    it("should return a new query reference", () => {
      const query = createQuery();
      const updatedQuery = toggleLockInQuery(query, [0]);

      expect(updatedQuery).not.toBe(query);
    });

    it("should create new reference for modified nested groups", () => {
      const query = createQuery();
      const updatedQuery = toggleLockInQuery(query, [1, 0]);

      expect(updatedQuery.rules[1]).not.toBe(query.rules[1]);
    });

    it("should keep same reference for unmodified siblings", () => {
      const query = createQuery();
      const updatedQuery = toggleLockInQuery(query, [1, 0]);

      expect(updatedQuery.rules[0]).toBe(query.rules[0]);
    });

    it("should handle invalid path index", () => {
      const query = createQuery();
      const updatedQuery = toggleLockInQuery(query, [99]);

      // Should return unchanged
      expect(updatedQuery.rules.length).toBe(2);
    });

    it("should handle undefined isLocked (treat as false)", () => {
      const query = createQuery(); // isLocked is undefined
      const updatedQuery = toggleLockInQuery(query, [0]);

      // undefined -> !undefined -> true
      expect((updatedQuery.rules[0] as Rule).isLocked).toBe(true);
    });
  });
  describe("updateRuleInQuery", () => {
    it("should update rule field at root level", () => {
      const query = createQuery();
      const updatedQuery = updateRuleInQuery(query, [0], { field: "email" });

      expect((updatedQuery.rules[0] as Rule).field).toBe("email");
    });

    it("should update rule operator at root level", () => {
      const query = createQuery();
      const updatedQuery = updateRuleInQuery(query, [0], {
        operator: "contains",
      });

      expect((updatedQuery.rules[0] as Rule).operator).toBe("contains");
    });

    it("should update rule value at root level", () => {
      const query = createQuery();
      const updatedQuery = updateRuleInQuery(query, [0], { value: "Jane" });

      expect((updatedQuery.rules[0] as Rule).value).toBe("Jane");
    });

    it("should update multiple properties at once", () => {
      const query = createQuery();
      const updatedQuery = updateRuleInQuery(query, [0], {
        field: "email",
        operator: "contains",
        value: "@gmail.com",
      });

      const rule = updatedQuery.rules[0] as Rule;
      expect(rule.field).toBe("email");
      expect(rule.operator).toBe("contains");
      expect(rule.value).toBe("@gmail.com");
    });

    it("should update rule at nested level", () => {
      const query = createQuery();
      const updatedQuery = updateRuleInQuery(query, [1, 0], {
        field: "salary",
      });

      const g1 = updatedQuery.rules[1] as RuleGroup;
      expect((g1.rules[0] as Rule).field).toBe("salary");
    });

    it("should update rule at deeply nested level", () => {
      const query = createQuery();
      const updatedQuery = updateRuleInQuery(query, [1, 1, 0], { value: "LA" });

      const g1 = updatedQuery.rules[1] as RuleGroup;
      const g2 = g1.rules[1] as RuleGroup;
      expect((g2.rules[0] as Rule).value).toBe("LA");
    });

    it("should update isLocked on rule", () => {
      const query = createQuery();
      const updatedQuery = updateRuleInQuery(query, [0], { isLocked: true });

      expect((updatedQuery.rules[0] as Rule).isLocked).toBe(true);
    });

    it("should return unchanged if path points to a group", () => {
      const query = createQuery();
      const updatedQuery = updateRuleInQuery(query, [1], { field: "test" });

      // g1 is a group, should not be updated
      expect((updatedQuery.rules[1] as RuleGroup).combinator).toBe("or");
    });

    it("should return unchanged if empty value", () => {
      const query = createQuery();
      const updatedQuery = updateRuleInQuery(query, [0], {});

      expect(updatedQuery).toBe(query);
    });

    it("should handle invalid path gracefully", () => {
      const query = createQuery();
      const updatedQuery = updateRuleInQuery(query, [99], { field: "test" });

      expect(updatedQuery.rules.length).toBe(2);
    });

    it("should not mutate the original query", () => {
      const query = createQuery();
      updateRuleInQuery(query, [0], { value: "Jane" });

      expect((query.rules[0] as Rule).value).toBe("John");
    });

    it("should return a new query reference", () => {
      const query = createQuery();
      const updatedQuery = updateRuleInQuery(query, [0], { value: "Jane" });

      expect(updatedQuery).not.toBe(query);
    });

    it("should create new reference for modified path", () => {
      const query = createQuery();
      const updatedQuery = updateRuleInQuery(query, [1, 0], {
        field: "salary",
      });

      expect(updatedQuery.rules[1]).not.toBe(query.rules[1]);
    });

    it("should keep same reference for unmodified siblings", () => {
      const query = createQuery();
      const updatedQuery = updateRuleInQuery(query, [1, 0], {
        field: "salary",
      });

      expect(updatedQuery.rules[0]).toBe(query.rules[0]);
    });
  });
  describe("updateRuleGroupInQuery", () => {
    it("should update group combinator", () => {
      const query = createQuery();
      const updatedQuery = updateRuleGroupInQuery(query, [1], {
        combinator: "and",
      });

      expect((updatedQuery.rules[1] as RuleGroup).combinator).toBe("and");
    });

    it("should update root group combinator with empty path", () => {
      const query = createQuery();
      const updatedQuery = updateRuleGroupInQuery(query, [], {
        combinator: "or",
      });

      expect(updatedQuery.combinator).toBe("or");
    });

    it("should update isLocked on group", () => {
      const query = createQuery();
      const updatedQuery = updateRuleGroupInQuery(query, [1], {
        isLocked: true,
      });

      expect((updatedQuery.rules[1] as RuleGroup).isLocked).toBe(true);
    });

    it("should update group at nested level", () => {
      const query = createQuery();
      const updatedQuery = updateRuleGroupInQuery(query, [1, 1], {
        combinator: "or",
      });

      const g1 = updatedQuery.rules[1] as RuleGroup;
      expect((g1.rules[1] as RuleGroup).combinator).toBe("or");
    });

    it("should return unchanged if path points to a rule", () => {
      const query = createQuery();
      const updatedQuery = updateRuleGroupInQuery(query, [0], {
        combinator: "or",
      });

      // r1 is a rule, should not be updated, query structure unchanged
      expect((updatedQuery.rules[0] as Rule).field).toBe("name");
    });

    it("should return unchanged if empty value", () => {
      const query = createQuery();
      const updatedQuery = updateRuleGroupInQuery(query, [1], {});

      expect(updatedQuery).toBe(query);
    });

    it("should handle invalid path gracefully", () => {
      const query = createQuery();
      const updatedQuery = updateRuleGroupInQuery(query, [99], {
        combinator: "or",
      });

      expect(updatedQuery.rules.length).toBe(2);
    });

    it("should not mutate the original query", () => {
      const query = createQuery();
      updateRuleGroupInQuery(query, [1], { combinator: "and" });

      expect((query.rules[1] as RuleGroup).combinator).toBe("or");
    });

    it("should return a new query reference", () => {
      const query = createQuery();
      const updatedQuery = updateRuleGroupInQuery(query, [1], {
        combinator: "and",
      });

      expect(updatedQuery).not.toBe(query);
    });

    it("should create new reference for modified path", () => {
      const query = createQuery();
      const updatedQuery = updateRuleGroupInQuery(query, [1, 1], {
        combinator: "or",
      });

      expect(updatedQuery.rules[1]).not.toBe(query.rules[1]);
    });

    it("should keep same reference for unmodified siblings", () => {
      const query = createQuery();
      const updatedQuery = updateRuleGroupInQuery(query, [1], {
        combinator: "and",
      });

      expect(updatedQuery.rules[0]).toBe(query.rules[0]);
    });
  });
  describe("moveHandler", () => {
    // Helper to create a flat query for simpler move tests
    const createFlatQuery = (): Query => ({
      id: "root",
      combinator: "and",
      rules: [
        { id: "r0", field: "name", operator: "equal", value: "A" },
        { id: "r1", field: "age", operator: "greater", value: 10 },
        { id: "r2", field: "city", operator: "equal", value: "B" },
        { id: "r3", field: "country", operator: "equal", value: "C" },
      ],
    });

    // Helper to create a nested query for complex move tests
    const createNestedQuery = (): Query => ({
      id: "root",
      combinator: "and",
      rules: [
        { id: "r0", field: "name", operator: "equal", value: "John" },
        { id: "r1", field: "email", operator: "contains", value: "@" },
        {
          id: "g1",
          combinator: "or",
          rules: [
            { id: "r2", field: "age", operator: "greater", value: 18 },
            { id: "r3", field: "status", operator: "equal", value: "active" },
          ],
        },
        { id: "r4", field: "role", operator: "equal", value: "admin" },
      ],
    });

    describe("basic moves at same level", () => {
      it("should move rule forward at root level", () => {
        const query = createFlatQuery();
        // To move r0 to final position 2, use destPath [3]
        // because adjustment: source 0 < dest 3, so dest becomes 2
        // Original: [r0, r1, r2, r3]
        // After removal: [r1, r2, r3]
        // After insert at [2]: [r1, r2, r0, r3]
        const updatedQuery = moveHandler(query, [0], [3]);

        expect(updatedQuery.rules.length).toBe(4);
        expect((updatedQuery.rules[0] as Rule).id).toBe("r1");
        expect((updatedQuery.rules[1] as Rule).id).toBe("r2");
        expect((updatedQuery.rules[2] as Rule).id).toBe("r0");
        expect((updatedQuery.rules[3] as Rule).id).toBe("r3");
      });

      it("should move rule backward at root level", () => {
        const query = createFlatQuery();
        const updatedQuery = moveHandler(query, [3], [0]);

        // r3 moved from index 3 to index 0
        // Original: [r0, r1, r2, r3]
        // After removal: [r0, r1, r2]
        // After insert at [0]: [r3, r0, r1, r2]
        expect(updatedQuery.rules.length).toBe(4);
        expect((updatedQuery.rules[0] as Rule).id).toBe("r3");
        expect((updatedQuery.rules[1] as Rule).id).toBe("r0");
        expect((updatedQuery.rules[2] as Rule).id).toBe("r1");
        expect((updatedQuery.rules[3] as Rule).id).toBe("r2");
      });

      it("should move rule within nested group", () => {
        const query = createNestedQuery();
        // Move r2 from [2,0] to position [2,1]
        // Original g1: [r2, r3]
        // After removal from [2,0]: [r3]
        // Source [2,0] and dest [2,1] have same parent [2]
        // source index 0 < dest index 1, so adjust: [2, 0]
        // Insert at [2, 0]: [r2, r3] - same as before
        // To actually swap, we need dest [2, 2] which adjusts to [2, 1]
        const updatedQuery = moveHandler(query, [2, 0], [2, 2]);

        const g1 = updatedQuery.rules[2] as RuleGroup;
        expect(g1.rules.length).toBe(2);
        expect((g1.rules[0] as Rule).id).toBe("r3");
        expect((g1.rules[1] as Rule).id).toBe("r2");
      });
    });

    describe("moves between different levels", () => {
      it("should move rule from root into a group", () => {
        const query = createNestedQuery();
        // To move r0 INTO g1 (append), we use destPath = [2, 2]
        // which means "insert at position 2 within the group at index 2"
        // Original root: [r0, r1, g1, r4]
        // After removal of [0]: [r1, g1, r4]
        // g1 is now at index 1, adjust destPath [2, 2] -> [1, 2]
        // Insert at [1, 2] within g1: g1 gets r0 at position 2
        const updatedQuery = moveHandler(query, [0], [2, 2]);

        expect(updatedQuery.rules.length).toBe(3);
        expect((updatedQuery.rules[0] as Rule).id).toBe("r1");

        const g1 = updatedQuery.rules[1] as RuleGroup;
        expect(g1.rules.length).toBe(3);
        expect((g1.rules[2] as Rule).id).toBe("r0");
      });

      it("should move rule from group to root", () => {
        const query = createNestedQuery();
        const updatedQuery = moveHandler(query, [2, 0], []);

        // Move r2 from g1 to root
        expect(updatedQuery.rules.length).toBe(5);
        expect((updatedQuery.rules[4] as Rule).id).toBe("r2");

        const g1 = updatedQuery.rules[2] as RuleGroup;
        expect(g1.rules.length).toBe(1);
        expect((g1.rules[0] as Rule).id).toBe("r3");
      });

      it("should move entire group to different position", () => {
        const query = createNestedQuery();
        const updatedQuery = moveHandler(query, [2], [0]);

        // Move g1 from index 2 to index 0
        // Original: [r0, r1, g1, r4]
        // After removal: [r0, r1, r4]
        // After insert at [0]: [g1, r0, r1, r4]
        expect(updatedQuery.rules.length).toBe(4);
        expect((updatedQuery.rules[0] as RuleGroup).id).toBe("g1");
        expect((updatedQuery.rules[1] as Rule).id).toBe("r0");
        expect((updatedQuery.rules[2] as Rule).id).toBe("r1");
        expect((updatedQuery.rules[3] as Rule).id).toBe("r4");
      });
    });

    describe("path adjustment (source before destination)", () => {
      it("should adjust dest path when source is before dest at same level", () => {
        const query = createFlatQuery();
        // Move r0 (index 0) to position after r3 (dest [3])
        // Without adjustment: remove [0] -> [r1, r2, r3], insert at [3] would be out of bounds
        // With adjustment: dest becomes [2] -> [r1, r2, r3, r0] - but we want at end
        const updatedQuery = moveHandler(query, [0], [3]);

        // Source [0] < Dest [3], so dest should adjust to [2] after removal
        // Result: [r1, r2, r0, r3]
        expect(updatedQuery.rules.length).toBe(4);
        expect((updatedQuery.rules[0] as Rule).id).toBe("r1");
        expect((updatedQuery.rules[1] as Rule).id).toBe("r2");
        expect((updatedQuery.rules[2] as Rule).id).toBe("r0");
        expect((updatedQuery.rules[3] as Rule).id).toBe("r3");
      });

      it("should adjust nested dest path when source affects it", () => {
        // sourcePath = [2], destPath = [6, 2]
        // After removing index 2, index 6 becomes 5
        // So destPath should become [5, 2]
        const query: Query = {
          id: "root",
          combinator: "and",
          rules: [
            { id: "r0", field: "a", operator: "equal", value: "0" },
            { id: "r1", field: "b", operator: "equal", value: "1" },
            { id: "r2", field: "c", operator: "equal", value: "2" }, // source - will be moved
            { id: "r3", field: "d", operator: "equal", value: "3" },
            { id: "r4", field: "e", operator: "equal", value: "4" },
            { id: "r5", field: "f", operator: "equal", value: "5" },
            {
              id: "g1",
              combinator: "or",
              rules: [
                { id: "r6", field: "g", operator: "equal", value: "6" },
                { id: "r7", field: "h", operator: "equal", value: "7" },
                { id: "r8", field: "i", operator: "equal", value: "8" },
              ],
            },
          ],
        };

        const updatedQuery = moveHandler(query, [2], [6, 2]);

        // After removal of [2], g1 shifts from index 6 to 5
        // With adjustment, r2 should be inserted into g1 (now at index 5) at position 2
        expect(updatedQuery.rules.length).toBe(6); // One less at root

        const g1 = updatedQuery.rules[5] as RuleGroup;
        expect(g1.rules.length).toBe(4); // One more in group
        expect((g1.rules[2] as Rule).id).toBe("r2"); // r2 inserted at position 2
      });

      it("should not adjust when source is after destination", () => {
        const query = createFlatQuery();
        // Move r3 (index 3) to position 1
        // Source [3] > Dest [1], no adjustment needed
        const updatedQuery = moveHandler(query, [3], [1]);

        // Original: [r0, r1, r2, r3]
        // After removal: [r0, r1, r2]
        // After insert at [1]: [r0, r3, r1, r2]
        expect(updatedQuery.rules.length).toBe(4);
        expect((updatedQuery.rules[0] as Rule).id).toBe("r0");
        expect((updatedQuery.rules[1] as Rule).id).toBe("r3");
        expect((updatedQuery.rules[2] as Rule).id).toBe("r1");
        expect((updatedQuery.rules[3] as Rule).id).toBe("r2");
      });

      it("should not adjust when paths have different parents", () => {
        // sourcePath = [2, 0], destPath = [0]
        // Removing from inside g1 doesn't affect root indices
        const query = createNestedQuery();
        const updatedQuery = moveHandler(query, [2, 0], [0]);

        // r2 moved from g1 to root at position 0
        // Original root: [r0, r1, g1, r4]
        // After insert at [0]: [r2, r0, r1, g1, r4]
        expect(updatedQuery.rules.length).toBe(5);
        expect((updatedQuery.rules[0] as Rule).id).toBe("r2");

        const g1 = updatedQuery.rules[3] as RuleGroup;
        expect(g1.rules.length).toBe(1);
      });

      it("should adjust when moving within same nested parent", () => {
        const query: Query = {
          id: "root",
          combinator: "and",
          rules: [
            {
              id: "g1",
              combinator: "or",
              rules: [
                { id: "r0", field: "a", operator: "equal", value: "0" },
                { id: "r1", field: "b", operator: "equal", value: "1" },
                { id: "r2", field: "c", operator: "equal", value: "2" },
                { id: "r3", field: "d", operator: "equal", value: "3" },
                { id: "r4", field: "e", operator: "equal", value: "4" },
              ],
            },
          ],
        };

        // Move r1 from [0, 1] to [0, 4]
        const updatedQuery = moveHandler(query, [0, 1], [0, 4]);

        const g1 = updatedQuery.rules[0] as RuleGroup;
        // After removal: [r0, r2, r3, r4]
        // With adjustment [0, 4] -> [0, 3]
        // After insert at [0, 3]: [r0, r2, r3, r1, r4]
        expect(g1.rules.length).toBe(5);
        expect((g1.rules[0] as Rule).id).toBe("r0");
        expect((g1.rules[1] as Rule).id).toBe("r2");
        expect((g1.rules[2] as Rule).id).toBe("r3");
        expect((g1.rules[3] as Rule).id).toBe("r1");
        expect((g1.rules[4] as Rule).id).toBe("r4");
      });
    });

    describe("edge cases", () => {
      it("should return unchanged query if source path is invalid", () => {
        const query = createFlatQuery();
        const updatedQuery = moveHandler(query, [99], [0]);

        expect(updatedQuery.rules.length).toBe(4);
        expect((updatedQuery.rules[0] as Rule).id).toBe("r0");
      });

      it("should return unchanged query if source path is empty", () => {
        const query = createFlatQuery();
        const updatedQuery = moveHandler(query, [], [0]);

        // Moving root itself - should return the query
        expect(updatedQuery.rules.length).toBe(4);
      });

      it("should handle moving to same position", () => {
        const query = createFlatQuery();
        const updatedQuery = moveHandler(query, [1], [1]);

        // Move r1 to position 1 (same position)
        // After removal: [r0, r2, r3]
        // After insert at [1]: [r0, r1, r2, r3]
        expect(updatedQuery.rules.length).toBe(4);
        expect((updatedQuery.rules[0] as Rule).id).toBe("r0");
        expect((updatedQuery.rules[1] as Rule).id).toBe("r1");
      });

      it("should handle moving to end of list", () => {
        const query = createFlatQuery();
        const updatedQuery = moveHandler(query, [0], []);

        // Move r0 to end (empty path = append to root)
        expect(updatedQuery.rules.length).toBe(4);
        expect((updatedQuery.rules[3] as Rule).id).toBe("r0");
      });

      it("should handle empty query gracefully", () => {
        const query: Query = {
          id: "root",
          combinator: "and",
          rules: [],
        };
        const updatedQuery = moveHandler(query, [0], [1]);

        expect(updatedQuery.rules.length).toBe(0);
      });
    });

    describe("immutability", () => {
      it("should not mutate the original query", () => {
        const query = createFlatQuery();
        const originalIds = query.rules.map((r) => (r as Rule).id);

        moveHandler(query, [0], [2]);

        const currentIds = query.rules.map((r) => (r as Rule).id);
        expect(currentIds).toEqual(originalIds);
      });

      it("should return a new query reference", () => {
        const query = createFlatQuery();
        const updatedQuery = moveHandler(query, [0], [2]);

        expect(updatedQuery).not.toBe(query);
      });

      it("should create new references for modified groups", () => {
        const query = createNestedQuery();
        const updatedQuery = moveHandler(query, [2, 0], [2, 1]);

        expect(updatedQuery.rules[2]).not.toBe(query.rules[2]);
      });

      it("should keep same reference for unmodified items", () => {
        const query = createNestedQuery();
        // Move r0 from [0] to [2] (insert at position 2)
        // Original: [r0, r1, g1, r4]
        // After removal: [r1, g1, r4]
        // Adjust dest [2] -> [1] (since source 0 < dest 2)
        // Insert at [1]: [r1, r0, g1, r4]
        const updatedQuery = moveHandler(query, [0], [2]);

        // g1 and r4 should be same reference (not in the move path)
        expect(updatedQuery.rules[2]).toBe(query.rules[2]); // g1 same ref
        expect(updatedQuery.rules[3]).toBe(query.rules[3]); // r4 same ref
      });
    });

    describe("moving groups with children", () => {
      it("should move group with all its children intact", () => {
        const query = createNestedQuery();
        const updatedQuery = moveHandler(query, [2], [0]);

        const movedGroup = updatedQuery.rules[0] as RuleGroup;
        expect(movedGroup.id).toBe("g1");
        expect(movedGroup.rules.length).toBe(2);
        expect((movedGroup.rules[0] as Rule).id).toBe("r2");
        expect((movedGroup.rules[1] as Rule).id).toBe("r3");
      });

      it("should preserve nested structure when moving deeply nested group", () => {
        const query: Query = {
          id: "root",
          combinator: "and",
          rules: [
            { id: "r0", field: "a", operator: "equal", value: "0" },
            {
              id: "g1",
              combinator: "or",
              rules: [
                {
                  id: "g2",
                  combinator: "and",
                  rules: [
                    { id: "r1", field: "b", operator: "equal", value: "1" },
                  ],
                },
              ],
            },
          ],
        };

        const updatedQuery = moveHandler(query, [1, 0], []);

        // g2 moved from inside g1 to root
        expect(updatedQuery.rules.length).toBe(3);

        const movedGroup = updatedQuery.rules[2] as RuleGroup;
        expect(movedGroup.id).toBe("g2");
        expect(movedGroup.rules.length).toBe(1);
        expect((movedGroup.rules[0] as Rule).id).toBe("r1");

        const g1 = updatedQuery.rules[1] as RuleGroup;
        expect(g1.rules.length).toBe(0);
      });
    });
  });
});
