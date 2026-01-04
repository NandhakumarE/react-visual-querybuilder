import { RULE_GROUP_INITIAL_DATA, RULE_INITIAL_DATA } from "../constants";
import type { Query, Rule, RuleGroup } from "../types";

type Item = Rule | RuleGroup;

export const isRuleGroup = (item: unknown): item is RuleGroup => {
  if (!item || typeof item !== "object") return false;
  return (
    Object.prototype.hasOwnProperty.call(item, "combinator") &&
    Object.prototype.hasOwnProperty.call(item, "rules")
  );
};

const generateId = () => crypto.randomUUID();

export const getRuleInitialData = (): Rule => {
  return { ...RULE_INITIAL_DATA, id: generateId() };
}

export const getRuleGroupInitialData = (): RuleGroup => {
  return { ...RULE_GROUP_INITIAL_DATA, id: generateId(), rules: [getRuleInitialData()] };
}

export const addToQuery = (query: Item, path: number[], item: Item): Query => {
  const addUtil = (node: Item, item: Item, depth: number = 0): Item => {
    if (!isRuleGroup(node)) return node;
    if (path.length === depth) {
      return {
        ...node,
        rules: [...node.rules, item],
      };
    }

    const pathIndex = path[depth];

    return {
      ...node,
      rules: node.rules.map((rule, index) =>
        pathIndex === index ? addUtil(rule, item, depth + 1) : rule
      ),
    };
  };

  return addUtil(query, item) as Query;
};

export const removeFromQuery = (query: Item, path: number[]): Query => {
  const removeUtil = (node: Item, depth: number = 0): Item => {
    if (!isRuleGroup(node)) return node;

    if (depth === path.length - 1) {
      const indexToRemoved = path[depth];
      return {
        ...node,
        rules: node.rules.filter((_, index) => index !== indexToRemoved),
      };
    }

    const pathIndex = path[depth];

    return {
      ...node,
      rules: node.rules.map((rule, index) =>
        pathIndex === index ? removeUtil(rule, depth + 1) : rule
      ),
    };
  };

  return removeUtil(query) as Query;
};

export const duplicateInQuery = (query: Item, path: number[]): Query => {
  if (path.length === 0) return query as Query;

  const deepClone = (node: Item): Item => {
    if (isRuleGroup(node)) {
      return {
        ...node,
        id: generateId(),
        rules: node.rules.map((rule) => deepClone(rule)),
      };
    }

    return { ...node, id: generateId() };
  };

  const duplicateUtil = (node: Item, depth: number = 0): Item => {
    if (!isRuleGroup(node)) return node;
    if (depth === path.length - 1) {
      const indexToBeCloned = path[depth];
      const original = node.rules[indexToBeCloned];
      if(!original) return node;

      const duplicate = deepClone(original);
      return {
        ...node,
        rules: [
          ...node.rules.slice(0, indexToBeCloned + 1),
          duplicate,
          ...node.rules.slice(indexToBeCloned + 1),
        ],
      };
    }
    const pathIndex = path[depth];
    return {
      ...node,
      rules: node.rules.map((rule, index) =>
        pathIndex === index ? duplicateUtil(rule, depth + 1) : rule
      ),
    };
  };

  return duplicateUtil(query) as Query;
};

export const toggleLockInQuery = (query: Item, path: number[]): Query => {
  const applyLockState = (node: Item, isLocked: boolean): Item => {
    if (isRuleGroup(node)) {
      return {
        ...node,
        isLocked,
        rules: node.rules.map((rule) => applyLockState(rule, isLocked)),
      };
    }
    return { ...node, isLocked };
  };
  const lockUtil = (node: Item, depth: number = 0): Item => {
    if (path.length === depth) {
      if (isRuleGroup(node)) {
        return {
          ...node,
          isLocked: !node.isLocked,
          rules: node.rules.map((rule) => applyLockState(rule, !node.isLocked)),
        };
      }
      return { ...node, isLocked: !node.isLocked };
    }

    if (!isRuleGroup(node)) return node;

    const pathIndex = path[depth];
    return {
      ...node,
      // This prevents toggling a nested item if its parent is locked
      rules: node.rules.map((rule, index) =>
        (pathIndex === index && !node.isLocked) ? lockUtil(rule, depth + 1) : rule
      ),
    };
  };

  return lockUtil(query) as Query;
};