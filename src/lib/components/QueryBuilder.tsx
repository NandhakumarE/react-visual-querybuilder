import QueryBuilderContext from "../context/QueryBuilderContext";
import useQueryBuilder from "../hooks/useQueryBuilder";
import type { QueryBuilderProps } from "../types";
import type {
  QueryBuilderContextType,
  UseQueryBuilderReturn,
} from "../types/query-builder.types";
import Builder from "./builder";
import { BuilderWithDnD } from "./builder-with-dnd";

export const QueryBuilder = (props: QueryBuilderProps) => {
  const { value, onChange, children, maxDepth } = props;
  const queryBuilderUtils: UseQueryBuilderReturn = useQueryBuilder({
    value,
    onChange,
    maxDepth,
  });
  const contextValue: QueryBuilderContextType = {
    ...queryBuilderUtils,
    maxDepth,
  };

  return (
    <QueryBuilderContext.Provider value={contextValue}>
      {children}
    </QueryBuilderContext.Provider>
  );
};

QueryBuilder.Builder = Builder;
QueryBuilder.BuilderWithDnD = BuilderWithDnD;
