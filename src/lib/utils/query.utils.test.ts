import { describe, expect, it } from "vitest";
import { addToQuery, duplicateInQuery, removeFromQuery, toggleLockInQuery } from "./query.utils";
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
      expect((duplicate.rules[0] as Rule).id).not.toBe((original.rules[0] as Rule).id);

      // g1's nested g2
      expect((duplicate.rules[1] as RuleGroup).id).not.toBe((original.rules[1] as RuleGroup).id);

      // g2's nested r3
      const originalG2 = original.rules[1] as RuleGroup;
      const duplicateG2 = duplicate.rules[1] as RuleGroup;
      expect((duplicateG2.rules[0] as Rule).id).not.toBe((originalG2.rules[0] as Rule).id);
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
          { id: "r1", field: "name", operator: "equal", value: "John", isLocked: true },
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
              { id: "r2", field: "age", operator: "greater", value: 30, isLocked: true },
              { id: "r3", field: "city", operator: "equal", value: "NYC", isLocked: true },
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
              { id: "r1", field: "age", operator: "greater", value: 30, isLocked: true },
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
});
