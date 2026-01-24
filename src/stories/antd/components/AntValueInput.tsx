import { Input, InputNumber, DatePicker, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { operators, type FieldType, type OperatorKey, type Value } from '../../../lib';

interface AntValueInputProps {
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

const AntValueInput = ({
  ruleId,
  fieldType = 'string',
  operator,
  value,
  onChange,
  disabled = false,
}: AntValueInputProps) => {
  if (UNARY_OPERATORS.includes(operator)) {
    return null;
  }

  if (RANGE_OPERATORS.includes(operator)) {
    const rangeValue = Array.isArray(value) ? value : ['', ''];
    const [from, to] = rangeValue;

    const handleFromChange = (newFrom: string | number | null) => {
      onChange([newFrom ?? '', to] as Value);
    };

    const handleToChange = (newTo: string | number | null) => {
      onChange([from, newTo ?? ''] as Value);
    };

    if (fieldType === 'number') {
      return (
        <Space.Compact style={{ flex: 1 }}>
          <InputNumber
            id={`${ruleId}-value-from`}
            placeholder="From"
            value={from as number}
            onChange={handleFromChange}
            disabled={disabled}
            style={{ width: '100%' }}
          />
          <Input
            style={{
              width: 40,
              textAlign: 'center',
              pointerEvents: 'none',
              borderLeft: 0,
              borderRight: 0,
            }}
            placeholder="~"
            disabled
          />
          <InputNumber
            id={`${ruleId}-value-to`}
            placeholder="To"
            value={to as number}
            onChange={handleToChange}
            disabled={disabled}
            style={{ width: '100%' }}
          />
        </Space.Compact>
      );
    }

    if (fieldType === 'date') {
      return (
        <Space align="center" style={{ flex: 1 }}>
          <DatePicker
            id={`${ruleId}-value-from`}
            value={from ? dayjs(from as string) : null}
            onChange={(date) => handleFromChange(date?.format('YYYY-MM-DD') ?? '')}
            disabled={disabled}
            style={{ flex: 1 }}
          />
          <Typography.Text type="secondary">to</Typography.Text>
          <DatePicker
            id={`${ruleId}-value-to`}
            value={to ? dayjs(to as string) : null}
            onChange={(date) => handleToChange(date?.format('YYYY-MM-DD') ?? '')}
            disabled={disabled}
            style={{ flex: 1 }}
          />
        </Space>
      );
    }

    return (
      <Space.Compact style={{ flex: 1 }}>
        <Input
          id={`${ruleId}-value-from`}
          placeholder="From"
          value={from as string}
          onChange={(e) => handleFromChange(e.target.value)}
          disabled={disabled}
        />
        <Input
          style={{
            width: 40,
            textAlign: 'center',
            pointerEvents: 'none',
            borderLeft: 0,
            borderRight: 0,
          }}
          placeholder="~"
          disabled
        />
        <Input
          id={`${ruleId}-value-to`}
          placeholder="To"
          value={to as string}
          onChange={(e) => handleToChange(e.target.value)}
          disabled={disabled}
        />
      </Space.Compact>
    );
  }

  if (fieldType === 'boolean') {
    return null;
  }

  if (fieldType === 'number') {
    return (
      <InputNumber
        id={`${ruleId}-value`}
        placeholder="Enter value"
        value={value as number}
        onChange={(val) => onChange(val ?? 0)}
        disabled={disabled}
        style={{ flex: 1, minWidth: 150 }}
      />
    );
  }

  if (fieldType === 'date') {
    return (
      <DatePicker
        id={`${ruleId}-value`}
        value={value ? dayjs(value as string) : null}
        onChange={(date) => onChange(date?.format('YYYY-MM-DD') ?? '')}
        disabled={disabled}
        style={{ flex: 1, minWidth: 150 }}
      />
    );
  }

  return (
    <Input
      id={`${ruleId}-value`}
      placeholder="Enter value"
      value={value as string}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      style={{ flex: 1, minWidth: 150 }}
    />
  );
};

export default AntValueInput;
