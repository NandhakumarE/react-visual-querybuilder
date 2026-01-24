import { HStack, Text, Input } from "@chakra-ui/react";
import {
  operators,
  type FieldType,
  type OperatorKey,
  type Value,
} from "../../../lib";

interface ChakraValueInputProps {
  ruleId: string;
  fieldType?: FieldType;
  operator: OperatorKey;
  value?: Value;
  onChange: (value: Value) => void;
  disabled?: boolean;
}

const UNARY_OPERATORS: OperatorKey[] = [
  operators.is_empty.value,
  operators.is_not_empty.value,
  operators.is_true.value,
  operators.is_false.value,
];

const RANGE_OPERATORS: OperatorKey[] = [
  operators.between.value,
  operators.not_between.value,
];

const inputStyles = {
  px: 3,
  py: 1.5,
  borderRadius: "lg",
  borderWidth: "1px",
  fontSize: "13px",
  flex: 1,
  minW: "100px",
  transition: "all 0.2s",
  _disabled: { opacity: 0.5, cursor: "not-allowed" },
};

const ChakraValueInput = ({
  ruleId,
  fieldType = "string",
  operator,
  value,
  onChange,
  disabled = false,
}: ChakraValueInputProps) => {
  if (UNARY_OPERATORS.includes(operator)) {
    return null;
  }

  if (RANGE_OPERATORS.includes(operator)) {
    const rangeValue = Array.isArray(value) ? value : ["", ""];
    const [from, to] = rangeValue;

    const handleFromChange = (newFrom: string | number) => {
      onChange([newFrom, to] as Value);
    };

    const handleToChange = (newTo: string | number) => {
      onChange([from, newTo] as Value);
    };

    const inputType: React.InputHTMLAttributes<HTMLInputElement>["type"] =
      fieldType === "number"
        ? "number"
        : fieldType === "date"
        ? "date"
        : "text";

    return (
      <HStack flex={1} gap={2}>
        <Input
          id={`${ruleId}-value-from`}
          type={inputType}
          placeholder="From"
          value={(from as string) ?? ""}
          onChange={(e) => {
            const val =
              fieldType === "number" ? Number(e.target.value) : e.target.value;
            handleFromChange(val);
          }}
          disabled={disabled}
          borderColor={{ base: "teal.200", _dark: "teal.700" }}
          bg={{ base: "white", _dark: "#0f2524" }}
          color={{ base: "teal.900", _dark: "teal.100" }}
          _focus={{ borderColor: "teal.500", boxShadow: "none" }}
          {...inputStyles}
        />
        <Text fontSize="13px" color={{ base: "teal.600", _dark: "teal.400" }}>
          to
        </Text>
        <Input
          id={`${ruleId}-value-to`}
          type={inputType}
          placeholder="To"
          value={(to as string) ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const val =
              fieldType === "number" ? Number(e.target.value) : e.target.value;
            handleToChange(val);
          }}
          disabled={disabled}
          borderColor={{ base: "teal.200", _dark: "teal.700" }}
          bg={{ base: "white", _dark: "#0f2524" }}
          color={{ base: "teal.900", _dark: "teal.100" }}
          _focus={{ borderColor: "teal.500", outline: "none" }}
          {...inputStyles}
        />
      </HStack>
    );
  }

  if (fieldType === "boolean") {
    return null;
  }

  const inputType =
    fieldType === "number" ? "number" : fieldType === "date" ? "date" : "text";

  return (
    <Input
      id={`${ruleId}-value`}
      type={inputType}
      placeholder="Value"
      value={(value as string) ?? ""}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const val =
          fieldType === "number" ? Number(e.target.value) : e.target.value;
        onChange(val);
      }}
      disabled={disabled}
      borderColor={{ base: "teal.200", _dark: "teal.700" }}
      bg={{ base: "white", _dark: "#0f2524" }}
      color={{ base: "teal.900", _dark: "teal.100" }}
      _focus={{ borderColor: "teal.500", outline: "none" }}
      {...inputStyles}
      minW="150px"
    />
  );
};

export default ChakraValueInput;
