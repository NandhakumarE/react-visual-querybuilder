import { createContext } from "react";
import type { BuilderContextType } from "../types";

const BuilderContext = createContext<BuilderContextType | null>(null);

export default BuilderContext;