import { Tooltip as ChakraTooltip } from '@chakra-ui/react';
import type { ReactElement } from 'react';

interface TooltipProps {
  content: string;
  children: ReactElement;
}

export const Tooltip = ({ content, children }: TooltipProps) => {
  return (
    <ChakraTooltip.Root>
      <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
      <ChakraTooltip.Positioner>
        <ChakraTooltip.Content>
          <ChakraTooltip.Arrow>
            <ChakraTooltip.ArrowTip />
          </ChakraTooltip.Arrow>
          {content}
        </ChakraTooltip.Content>
      </ChakraTooltip.Positioner>
    </ChakraTooltip.Root>
  );
};
