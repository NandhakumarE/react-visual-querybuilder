import { createContext } from "react";
import type { QueryBuilderContextType } from "../types/query-builder.types";

const QueryBuilderContext = createContext<QueryBuilderContextType | null>(null);

export default QueryBuilderContext;