import { useState } from "react";
import type { Query, Rule, RuleGroup } from "../types";
import type { UseQueryBuilderReturn } from "../types/query-builder.types";

interface UseQueryBuilderProps {
  value: Query;
  maxDepth?: number;
  onChange: (query: Query) => void;
}

const useQueryBuilder = (props: UseQueryBuilderProps): UseQueryBuilderReturn => {
  const { value, maxDepth } = props;
  const [query] = useState<Query>(value);

  const addRule = (path: number[]) => {
    console.log("addRule", path, maxDepth);
  };

  const addGroup = (path: number[]) => {
    console.log("addGroup", path);
  };

  const remove = (path: number[]) => {
    console.log("remove", path);
  };

  const clone = (path: number[]) => {
    console.log("clone", path);
  };

  const toggleLock = (path: number[]) => {
    console.log("lock", path);
  };

  const move = (fromPath: number[], toPath: number[]) => {
    console.log("dragHandle", fromPath, toPath);
  };

  const updateRule = (path: number[], updates: Partial<Rule>) => {
    console.log("updateRule", path, updates);
  }

  const updateGroup = (path: number[], updates: Partial<RuleGroup>) => {
    console.log("updateGroup", path, updates);
  }

  return {
    query,
    addRule,
    addGroup,
    updateRule,
    updateGroup,
    remove,
    clone,
    toggleLock,
    move,
  };
};


export default useQueryBuilder;