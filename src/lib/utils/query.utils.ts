import { RULE_GROUP_INITIAL_DATA, RULE_INITIAL_DATA } from "../constants";
import type { Query, Rule, RuleGroup, RuleGroupUpdate, RuleUpdate } from "../types";

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
       if(node.isLocked) return node;
      return {
        ...node,
        rules: [...node.rules, item],
      };
    }

    const pathIndex = path[depth];

    return {
      ...node,
      rules: node.rules.map((rule, index) =>
        (pathIndex === index && !node.isLocked) ? addUtil(rule, item, depth + 1) : rule
      ),
    };
  };

  return addUtil(query, item) as Query;
};

export const removeFromQuery = (query: Item, path: number[]): Query => {
  const removeUtil = (node: Item, depth: number = 0): Item => {
    if (!isRuleGroup(node)) return node;

    if (depth === path.length - 1) {
      if(node.isLocked) return node;
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
        (pathIndex === index && !node.isLocked) ? removeUtil(rule, depth + 1) : rule
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
      if(!original || node.isLocked) return node;

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
        (pathIndex === index && !node.isLocked) ? duplicateUtil(rule, depth + 1) : rule
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

export const updateRuleInQuery = (
  query: Item,
  path: number[],
  value: RuleUpdate
): Query => {
  if (!value || Object.keys(value).length === 0) return query as Query;

  const updateUtil = (node: Item, depth: number = 0): Item => {
    if (path.length === depth && !isRuleGroup(node)) {
      if(node.isLocked) return node;
      return {
        ...node,
        ...value,
      };
    }

    if (!isRuleGroup(node)) return node;

    const pathIndex = path[depth];
    return {
      ...node,
      rules: node.rules.map((rule, index) =>
        (pathIndex === index && !node.isLocked) ? updateUtil(rule, depth + 1) : rule
      ),
    };
  };

  return updateUtil(query) as Query;
};

export const updateRuleGroupInQuery = (
  query: Item,
  path: number[],
  value: RuleGroupUpdate
): Query => {
  if (!value || Object.keys(value).length === 0) return query as Query;

  const updateUtil = (node: Item, depth: number = 0): Item => {
    if (path.length === depth && isRuleGroup(node)) {
      if(node.isLocked) return node;
      return {
        ...node,
        ...value,
      };
    }

    if (!isRuleGroup(node)) return node;

    const pathIndex = path[depth];
    return {
      ...node,
      rules: node.rules.map((rule, index) =>
        (pathIndex === index && !node.isLocked) ? updateUtil(rule, depth + 1) : rule
      ),
    };
  };

  return updateUtil(query) as Query;
};

const getItemAtPath = (query: Query, path: number[]): Item | null => {
  if (!query || Object.keys(query).length === 0 || path.length === 0)
    return query;
  let result: Item | null = null;

  const getUtil = (node: Item, depth: number = 0): void => {
    if (depth === path.length) {
      result = { ...node };
    }

    if (!isRuleGroup(node)) return;

    const pathIndex = path[depth];
    node.rules.forEach((rule, index) =>
      index === pathIndex ? getUtil(rule, depth + 1) : null
    );
  };
  getUtil(query);

  return result;
};

const getAdjustedDestPath = (
  sourcePath: number[],
  destPath: number[]
): number[] => {
  if (sourcePath.length === 0 || destPath.length === 0) return destPath;

  const sourceParent = sourcePath.slice(0, -1);
  const sourceIndex = sourcePath[sourcePath.length - 1];

  // Check if dest path passes through the same parent level
  if (destPath.length <= sourceParent.length) return destPath;

  // Compare parent paths
  const destParent = destPath.slice(0, sourceParent.length);
  const isSameParent = sourceParent.every((v, i) => v === destParent[i]);

  if (!isSameParent) return destPath;

  const destIndexAtSourceLevel = destPath[sourceParent.length];

  if (sourceIndex < destIndexAtSourceLevel) {
    return [
      ...destPath.slice(0, sourceParent.length),
      destIndexAtSourceLevel - 1,
      ...destPath.slice(sourceParent.length + 1),
    ];
  }

  return destPath;
};

// Insert item at a specific position (not just append)
// path = [2] means insert at index 2 in root
// path = [1, 2] means insert at index 2 in the group at path [1]
// path = [] means append to root (same as addToQuery)
const insertAtQuery = (query: Item, path: number[], item: Item): Query => {
  if (path.length === 0) {
    return addToQuery(query, [], item);
  }

  const parentPath = path.slice(0, -1);
  const insertIndex = path[path.length - 1];

  const insertUtil = (node: Item, depth: number = 0): Item => {
    if (!isRuleGroup(node)) return node;

    if (depth === parentPath.length) {
      if(node.isLocked) return node;
      return {
        ...node,
        rules: [
          ...node.rules.slice(0, insertIndex),
          item,
          ...node.rules.slice(insertIndex),
        ],
      };
    }

    const pathIndex = parentPath[depth];
    return {
      ...node,
      rules: node.rules.map((rule, index) =>
        (pathIndex === index && !node.isLocked) ? insertUtil(rule, depth + 1) : rule
      ),
    };
  };

  return insertUtil(query) as Query;
};

const isPathLocked = (query: Query, path: number[]): boolean => {
  if (path.length === 0) return !!query.isLocked;

  let current: Item = query;
  const parentPath = path.slice(0, -1);

  if (current.isLocked) return true;

  for (let i = 0; i < parentPath.length; i++) {
    if (!isRuleGroup(current)) return false;
    const next: Item | undefined = current.rules[parentPath[i]];
    if (!next) return false;
    if (next.isLocked) return true;
    current = next;
  }

  return !!current.isLocked;
};

export const moveHandler = (
  query: Query,
  sourcePath: number[],
  destPath: number[]
): Query => {
  if (sourcePath.length === 0) return query;

  const item = getItemAtPath(query, sourcePath);
  if (!item || item.isLocked) return query;

  // Pre-check: is destination path locked?
  if (destPath.length > 0 && isPathLocked(query, destPath)) {
    return query;
  }

  const afterRemoval = removeFromQuery(query, sourcePath);
  const adjustedDest = getAdjustedDestPath(sourcePath, destPath);
  const result = insertAtQuery(afterRemoval, adjustedDest, item);

  return result;
};