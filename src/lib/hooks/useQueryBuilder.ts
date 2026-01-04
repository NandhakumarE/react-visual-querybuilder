import type { Query, Rule, RuleGroup } from "../types";
import type { UseQueryBuilderReturn } from "../types/query-builder.types";
import { addToQuery, duplicateInQuery, getRuleGroupInitialData, getRuleInitialData, removeFromQuery, toggleLockInQuery } from "../utils";

interface UseQueryBuilderProps {
  value: Query;
  maxDepth?: number;
  onChange: (query: Query) => void;
}

const useQueryBuilder = (props: UseQueryBuilderProps): UseQueryBuilderReturn => {
  const { value: query, maxDepth, onChange } = props;

  const addRule = (path: number[]) => {
    const updatedQuery = addToQuery(query, path, getRuleInitialData());
    onChange(updatedQuery);
  };

  const addGroup = (path: number[]) => {
    // prevention of adding group beyond max depth
    if(Number.isFinite(maxDepth) && path.length >= (maxDepth! - 1)) return ;

    const updatedQuery = addToQuery(query, path, getRuleGroupInitialData());
    onChange(updatedQuery);
  };

  const remove = (path: number[]) => {
    const updatedQuery = removeFromQuery(query, path);
    onChange(updatedQuery);
  };

  const clone = (path: number[]) => {
    const updatedQuery = duplicateInQuery(query, path);
    onChange(updatedQuery);
  };

  const toggleLock = (path: number[]) => {
    const updatedQuery = toggleLockInQuery(query, path);
    onChange(updatedQuery);
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