import { Box, HStack, VStack, Button, IconButton, Text } from '@chakra-ui/react';
import { Tooltip } from './Tooltip';
import {
  MdOutlineDragIndicator,
  MdOutlineAdd,
  MdOutlineDelete,
  MdOutlineContentCopy,
  MdOutlineLock,
  MdOutlineLockOpen,
} from 'react-icons/md';
import type { GroupRenderProps } from '../../../lib';

interface ChakraGroupProps extends GroupRenderProps {
  rootId: string;
  maxDepth?: number;
}

const ChakraGroup = (props: ChakraGroupProps) => {
  const { rootId, group, depth, children, slots, onChange, maxDepth } = props;
  const isRoot = group.id === rootId;
  const isLocked = group.isLocked;
  const isMaxDepth = depth === maxDepth;

  return (
    <Box
      bg={{ base: 'white', _dark: '#0f2524' }}
      borderRadius="xl"
      borderWidth="1px"
      borderLeftWidth={isRoot ? '1px' : '3px'}
      borderLeftColor={isRoot ? { base: 'teal.200', _dark: 'teal.800' } : 'teal.500'}
      borderColor={{ base: 'teal.200', _dark: 'teal.800' }}
      p={4}
      opacity={isLocked ? 0.6 : 1}
      transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        borderColor: isLocked ? undefined : { base: 'teal.400', _dark: 'teal.600' },
      }}
    >
      <HStack gap={3} mb={4} flexWrap="wrap">
        {!isRoot && (
          <Box
            {...(!isLocked && slots.dragHandles)}
            cursor={isLocked ? 'not-allowed' : 'grab'}
            color={{ base: 'teal.400', _dark: 'teal.500' }}
            opacity={isLocked ? 0.3 : 0.5}
            p={1}
            borderRadius="md"
            transition="all 0.2s"
            _hover={{
              opacity: isLocked ? 0.3 : 1,
              color: 'teal.500',
            }}
            _active={{
              cursor: isLocked ? 'not-allowed' : 'grabbing',
            }}
          >
            <MdOutlineDragIndicator size={18} />
          </Box>
        )}

        {isRoot && (
          <Text
            fontSize="11px"
            fontWeight="600"
            color={{ base: 'teal.600', _dark: 'teal.400' }}
            textTransform="uppercase"
            letterSpacing="0.05em"
          >
            Query
          </Text>
        )}

        <HStack
          gap={0}
          borderRadius="lg"
          overflow="hidden"
          borderWidth="1px"
          borderColor={{ base: 'teal.200', _dark: 'teal.700' }}
        >
          <Button
            size="sm"
            variant={group.combinator === 'and' ? 'solid' : 'ghost'}
            bg={group.combinator === 'and' ? 'teal.500' : 'transparent'}
            color={group.combinator === 'and' ? 'white' : { base: 'teal.700', _dark: 'teal.300' }}
            onClick={() => onChange({ combinator: 'and' })}
            disabled={isLocked}
            borderRadius="0"
            fontWeight="600"
            fontSize="11px"
            px={3}
            _hover={{
              bg: group.combinator === 'and' ? 'teal.600' : { base: 'teal.50', _dark: 'teal.900' },
            }}
          >
            AND
          </Button>
          <Button
            size="sm"
            variant={group.combinator === 'or' ? 'solid' : 'ghost'}
            bg={group.combinator === 'or' ? 'teal.500' : 'transparent'}
            color={group.combinator === 'or' ? 'white' : { base: 'teal.700', _dark: 'teal.300' }}
            onClick={() => onChange({ combinator: 'or' })}
            disabled={isLocked}
            borderRadius="0"
            fontWeight="600"
            fontSize="11px"
            px={3}
            _hover={{
              bg: group.combinator === 'or' ? 'teal.600' : { base: 'teal.50', _dark: 'teal.900' },
            }}
          >
            OR
          </Button>
        </HStack>

        <Button
          size="sm"
          variant="ghost"
          onClick={slots.onAddRule}
          disabled={isLocked}
          color="teal.500"
          fontWeight="600"
          fontSize="13px"
          _hover={{
            bg: { base: 'teal.50', _dark: 'teal.900' },
            color: 'teal.600',
          }}
        >
          <MdOutlineAdd size={16} />
          Rule
        </Button>

        {!isMaxDepth && (
          <Button
            size="sm"
            variant="ghost"
            onClick={slots.onAddGroup}
            disabled={isLocked}
            color="teal.500"
            fontWeight="600"
            fontSize="13px"
            _hover={{
              bg: { base: 'teal.50', _dark: 'teal.900' },
              color: 'teal.600',
            }}
          >
            <MdOutlineAdd size={16} />
            Group
          </Button>
        )}

        {!isRoot && (
          <HStack gap={0.5} ml="auto">
            <Tooltip content="Delete">
              <IconButton
                aria-label="Delete"
                size="sm"
                variant="ghost"
                onClick={slots.onRemove}
                disabled={isLocked}
                color={{ base: 'gray.500', _dark: 'gray.400' }}
                _hover={{
                  color: 'red.500',
                  bg: { base: 'red.50', _dark: 'red.900/20' },
                }}
              >
                <MdOutlineDelete size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip content="Duplicate">
              <IconButton
                aria-label="Duplicate"
                size="sm"
                variant="ghost"
                onClick={slots.onClone}
                disabled={isLocked}
                color={{ base: 'gray.500', _dark: 'gray.400' }}
                _hover={{
                  color: 'cyan.500',
                  bg: { base: 'cyan.50', _dark: 'cyan.900/20' },
                }}
              >
                <MdOutlineContentCopy size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip content={isLocked ? 'Unlock' : 'Lock'}>
              <IconButton
                aria-label={isLocked ? 'Unlock' : 'Lock'}
                size="sm"
                variant="ghost"
                onClick={slots.onToggleLock}
                color={isLocked ? 'orange.500' : { base: 'gray.500', _dark: 'gray.400' }}
                _hover={{
                  color: 'orange.500',
                  bg: { base: 'orange.50', _dark: 'orange.900/20' },
                }}
              >
                {isLocked ? <MdOutlineLock size={18} /> : <MdOutlineLockOpen size={18} />}
              </IconButton>
            </Tooltip>
          </HStack>
        )}
      </HStack>

      <VStack align="stretch" gap={3} ml={isRoot ? 0 : 3}>
        {children}
      </VStack>
    </Box>
  );
};

export default ChakraGroup;
