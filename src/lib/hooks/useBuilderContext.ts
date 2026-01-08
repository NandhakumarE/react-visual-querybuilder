import { useContext } from "react"
import BuilderContext from "../context/BuilderContext"

const useBuilderContext = () => {
    const contextValue = useContext(BuilderContext);
    return contextValue;
}

export default useBuilderContext;