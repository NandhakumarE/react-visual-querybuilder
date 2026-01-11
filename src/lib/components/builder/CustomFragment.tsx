interface CustomFragmentProps {
    children: () => React.ReactNode
}
const CustomFragment = ({ children }: CustomFragmentProps) => {
  return children();
}

export default CustomFragment;