import { TextField, Box, Typography } from '@mui/material';
import { operators, type FieldType, type OperatorKey, type Value } from '../../../lib';

interface MuiValueInputProps {
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

const MuiValueInput = ({
  ruleId,
  fieldType = 'string',
  operator,
  value,
  onChange,
  disabled = false,
}: MuiValueInputProps) => {
  if (UNARY_OPERATORS.includes(operator)) {
    return null;
  }

  if (RANGE_OPERATORS.includes(operator)) {
    const rangeValue = Array.isArray(value) ? value : ['', ''];
    const [from, to] = rangeValue;

    const handleFromChange = (newFrom: string | number) => {
      onChange([newFrom, to] as Value);
    };

    const handleToChange = (newTo: string | number) => {
      onChange([from, newTo] as Value);
    };

    const inputType = fieldType === 'number' ? 'number' : fieldType === 'date' ? 'date' : 'text';

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
        <TextField
          id={`${ruleId}-value-from`}
          size="small"
          type={inputType}
          placeholder="From"
          value={from ?? ''}
          onChange={(e) => {
            const val = fieldType === 'number' ? Number(e.target.value) : e.target.value;
            handleFromChange(val);
          }}
          disabled={disabled}
          sx={{ flex: 1 }}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <Typography variant="body2" color="text.secondary">
          to
        </Typography>
        <TextField
          id={`${ruleId}-value-to`}
          size="small"
          type={inputType}
          placeholder="To"
          value={to ?? ''}
          onChange={(e) => {
            const val = fieldType === 'number' ? Number(e.target.value) : e.target.value;
            handleToChange(val);
          }}
          disabled={disabled}
          sx={{ flex: 1 }}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
      </Box>
    );
  }

  if (fieldType === 'boolean') {
    return null;
  }

  const inputType = fieldType === 'number' ? 'number' : fieldType === 'date' ? 'date' : 'text';

  return (
    <TextField
      id={`${ruleId}-value`}
      size="small"
      type={inputType}
      placeholder="Enter value..."
      value={value ?? ''}
      onChange={(e) => {
        const val = fieldType === 'number' ? Number(e.target.value) : e.target.value;
        onChange(val);
      }}
      disabled={disabled}
      sx={{ flex: 1, minWidth: 150 }}
      slotProps={{
        inputLabel: { shrink: true },
      }}
    />
  );
};

export default MuiValueInput;
