import { Box, HStack, IconButton, NativeSelect } from "@chakra-ui/react";
import { Tooltip } from "./Tooltip";
import {
  MdOutlineDragIndicator,
  MdOutlineDelete,
  MdOutlineContentCopy,
  MdOutlineLock,
  MdOutlineLockOpen,
} from "react-icons/md";
import type { OperatorKey, RuleRenderProps, Value } from "../../../lib";
import ChakraValueInput from "./ChakraValueInput";

const ChakraRule = (props: RuleRenderProps) => {
  const { rule, slots, onChange, fields, operators, selectedField } = props;
  const isLocked = rule.isLocked;

  return (
    <Box
      bg={{ base: "white", _dark: "#0f2524" }}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={{ base: "teal.200", _dark: "teal.800" }}
      p={3}
      opacity={isLocked ? 0.5 : 1}
      transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        borderColor: isLocked
          ? undefined
          : { base: "teal.400", _dark: "teal.600" },
        boxShadow: isLocked ? "none" : "0 4px 12px rgba(13, 148, 136, 0.1)",
      }}
    >
      <HStack gap={3} flexWrap="wrap">
        <Box
          {...(!isLocked && slots.dragHandles)}
          cursor={isLocked ? "not-allowed" : "grab"}
          color={{ base: "teal.400", _dark: "teal.500" }}
          opacity={isLocked ? 0.3 : 0.5}
          p={1}
          borderRadius="md"
          transition="all 0.2s"
          _hover={{
            opacity: isLocked ? 0.3 : 1,
            color: "teal.500",
          }}
          _active={{
            cursor: isLocked ? "not-allowed" : "grabbing",
          }}
        >
          <MdOutlineDragIndicator size={18} />
        </Box>

        <NativeSelect.Root minW="130px" style={{width:'auto'}}>
          <NativeSelect.Field
            value={rule.field ?? ""}
            onChange={(e) => {
              onChange({ field: e.target.value as string });
            }}
            aria-disabled={isLocked}
            px={3}
            py={1.5}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={{ base: "teal.200", _dark: "teal.700" }}
            bg={{ base: "white", _dark: "#0f2524" }}
            color={{ base: "teal.900", _dark: "teal.100" }}
            fontSize="13px"
            _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
            _focus={{ borderColor: "teal.500", boxShadow: "none" }}
          >
            <option value="" disabled>
              Field
            </option>

            {fields.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </NativeSelect.Field>

          <NativeSelect.Indicator />
        </NativeSelect.Root>

        <NativeSelect.Root minW="140px" style={{width:'auto'}}>
          <NativeSelect.Field
            value={rule.operator ?? ""}
            onChange={(e) =>
              onChange({ operator: e.target.value as OperatorKey })
            }
            aria-disabled={isLocked}
            px={3}
            py={1.5}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={{ base: "teal.200", _dark: "teal.700" }}
            bg={{ base: "white", _dark: "#0f2524" }}
            color={{ base: "teal.900", _dark: "teal.100" }}
            fontSize="13px"
            _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
            _focus={{ borderColor: "teal.500", boxShadow: "none" }}
          >
            <option value="" disabled>
              Operator
            </option>

            {operators.map((op) => (
              <option key={op.value} value={op.value}>
                {op.name}
              </option>
            ))}
          </NativeSelect.Field>

          <NativeSelect.Indicator />
        </NativeSelect.Root>

        <ChakraValueInput
          ruleId={rule.id}
          fieldType={selectedField?.type}
          operator={rule.operator}
          value={rule.value}
          onChange={(value: Value) => onChange({ value })}
          disabled={isLocked}
        />

        <HStack gap={0.5} ml="auto">
          <Tooltip content="Delete">
            <IconButton
              aria-label="Delete"
              size="sm"
              variant="ghost"
              onClick={slots.onRemove}
              disabled={isLocked}
              color={{ base: "gray.500", _dark: "gray.400" }}
              _hover={{
                color: "red.500",
                bg: { base: "red.50", _dark: "red.900/20" },
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
              color={{ base: "gray.500", _dark: "gray.400" }}
              _hover={{
                color: "cyan.500",
                bg: { base: "cyan.50", _dark: "cyan.900/20" },
              }}
            >
              <MdOutlineContentCopy size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip content={isLocked ? "Unlock" : "Lock"}>
            <IconButton
              aria-label={isLocked ? "Unlock" : "Lock"}
              size="sm"
              variant="ghost"
              onClick={slots.onToggleLock}
              color={
                isLocked
                  ? "orange.500"
                  : { base: "gray.500", _dark: "gray.400" }
              }
              _hover={{
                color: "orange.500",
                bg: { base: "orange.50", _dark: "orange.900/20" },
              }}
            >
              {isLocked ? (
                <MdOutlineLock size={18} />
              ) : (
                <MdOutlineLockOpen size={18} />
              )}
            </IconButton>
          </Tooltip>
        </HStack>
      </HStack>
    </Box>
  );
};

export default ChakraRule;
