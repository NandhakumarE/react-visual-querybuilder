import type { SortableContainerProps } from "../types";

const DefaultContainer = (props: SortableContainerProps) => {
  return <>{props.children}</>;
};

export default DefaultContainer;
