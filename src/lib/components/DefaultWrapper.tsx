import type { BaseComponentProps } from "../types"

const DefaultWrapper = (props: BaseComponentProps) => {
    return <>{props.children}</>
}

export default DefaultWrapper;