import { useContext } from "react";
import QueryBuilderContext from "../context/QueryBuilderContext";

const useQueryBuilderContext = () => {
  const contextValue = useContext(QueryBuilderContext);
  if (!contextValue) {
    throw new Error(
      "useQueryBuilderContext must be used within a QueryBuilderProvider"
    );
  }
  return contextValue;
};

export default useQueryBuilderContext;
