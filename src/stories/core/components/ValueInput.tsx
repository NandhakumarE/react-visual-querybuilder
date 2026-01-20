import { operators, type FieldType, type OperatorKey, type Value } from "../../../lib";
import { styles, cn } from "./styles";

interface ValueInputProps {
  ruleId: string;
  fieldType?: FieldType;
  operator: OperatorKey;
  value?: Value;
  onChange: (value: Value) => void;
  disabled?: boolean;
}

// Unary operators don't need a value input
const UNARY_OPERATORS: OperatorKey[] = [
  operators.is_empty.value,
  operators.is_not_empty.value,
  operators.is_true.value,
  operators.is_false.value,
];

// Range operators need two inputs (from/to)
const RANGE_OPERATORS: OperatorKey[] = [
  operators.between.value,
  operators.not_between.value,
];

const ValueInput = ({
  ruleId,
  fieldType = "string",
  operator,
  value,
  onChange,
  disabled = false,
}: ValueInputProps) => {
  // Unary operators - no input needed
  if (UNARY_OPERATORS.includes(operator)) {
    return null;
  }

  // Range operators - two inputs (from/to)
  if (RANGE_OPERATORS.includes(operator)) {
    const rangeValue = Array.isArray(value) ? value : ["", ""];
    const [from, to] = rangeValue;

    const handleFromChange = (newFrom: string | number) => {
      onChange([newFrom, to] as Value);
    };

    const handleToChange = (newTo: string | number) => {
      onChange([from, newTo] as Value);
    };

    if (fieldType === "number") {
      return (
        <div className="flex items-center gap-2 flex-1">
          <input
            id={ruleId + "value-from"}
            className={cn(styles.input, styles.focusOutline)}
            type="number"
            placeholder="From"
            value={from as string ?? ""}
            onChange={(e) => handleFromChange(Number(e.target.value))}
            disabled={disabled}
          />
          <span className={styles.textMuted}>to</span>
          <input
            id={ruleId + "value-to"}
            className={cn(styles.input, styles.focusOutline)}
            type="number"
            placeholder="To"
            value={to as string ?? ""}
            onChange={(e) => handleToChange(Number(e.target.value))}
            disabled={disabled}
          />
        </div>
      );
    }

    if (fieldType === "date") {
      return (
        <div className="flex items-center gap-2 flex-1">
          <input
            id={ruleId + "value-from"}
            className={cn(styles.input, styles.focusOutline)}
            type="date"
            value={(from as string) ?? ""}
            onChange={(e) => handleFromChange(e.target.value)}
            disabled={disabled}
          />
          <span className={styles.textMuted}>to</span>
          <input
            id={ruleId + "value-to"}
            className={cn(styles.input, styles.focusOutline)}
            type="date"
            value={(to as string) ?? ""}
            onChange={(e) => handleToChange(e.target.value)}
            disabled={disabled}
          />
        </div>
      );
    }

    // Default range (string)
    return (
      <div className="flex items-center gap-2 flex-1">
        <input
          id={ruleId + "value-from"}
          className={cn(styles.input, styles.focusOutline)}
          type="text"
          placeholder="From"
          value={(from as string) ?? ""}
          onChange={(e) => handleFromChange(e.target.value)}
          disabled={disabled}
        />
        <span className={styles.textMuted}>to</span>
        <input
          id={ruleId + "value-to"}
          className={cn(styles.input, styles.focusOutline)}
          type="text"
          placeholder="To"
          value={(to as string) ?? ""}
          onChange={(e) => handleToChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    );
  }

  // Boolean type - should not reach here as boolean operators are unary
  if (fieldType === "boolean") {
    return null;
  }

  // Number type - single number input
  if (fieldType === "number") {
    return (
      <input
        id={ruleId + "value"}
        className={cn(styles.input, styles.focusOutline)}
        type="number"
        value={(value as number) ?? ""}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
      />
    );
  }

  // Date type - single date input
  if (fieldType === "date") {
    return (
      <input
        id={ruleId + "value"}
        className={cn(styles.input, styles.focusOutline)}
        type="date"
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    );
  }

  // String type (default) - text input
  return (
    <input
      id={ruleId + "value"}
      className={cn(styles.input, styles.focusOutline)}
      type="text"
      value={(value as string) ?? ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
};

export default ValueInput;
