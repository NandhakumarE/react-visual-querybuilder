import { MdClose, MdDragIndicator } from 'react-icons/md';
import type { OperatorKey, RuleRenderProps, Value } from '../../../lib';
import { operators } from '../../../lib';

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

const CustomRule = (props: RuleRenderProps) => {
  const { rule, slots, onChange, fields, operators: ops, selectedField } = props;
  const isLocked = rule.isLocked;
  const fieldType = selectedField?.type || 'string';
  const isUnary = UNARY_OPERATORS.includes(rule.operator);
  const isRange = RANGE_OPERATORS.includes(rule.operator);

  const renderValueInput = () => {
    if (isUnary) return null;

    if (isRange) {
      const rangeValue = Array.isArray(rule.value) ? rule.value : ['', ''];
      const [from, to] = rangeValue;
      const inputType = fieldType === 'number' ? 'number' : fieldType === 'date' ? 'date' : 'text';

      return (
        <>
          <input
            type={inputType}
            className="custom-input"
            placeholder="Select date"
            value={(from as string) ?? ''}
            onChange={(e) => {
              const val = fieldType === 'number' ? Number(e.target.value) : e.target.value;
              onChange({ value: [val, to] as Value });
            }}
            disabled={isLocked}
            style={{ minWidth: 120 }}
          />
          <span className="custom-range-separator">to</span>
          <input
            type={inputType}
            className="custom-input"
            placeholder="Select date"
            value={(to as string) ?? ''}
            onChange={(e) => {
              const val = fieldType === 'number' ? Number(e.target.value) : e.target.value;
              onChange({ value: [from, val] as Value });
            }}
            disabled={isLocked}
            style={{ minWidth: 120 }}
          />
        </>
      );
    }

    if (fieldType === 'boolean') return null;

    const inputType = fieldType === 'number' ? 'number' : fieldType === 'date' ? 'date' : 'text';

    return (
      <input
        type={inputType}
        className="custom-input"
        placeholder="Value"
        value={(rule.value as string) ?? ''}
        onChange={(e) => {
          const val = fieldType === 'number' ? Number(e.target.value) : e.target.value;
          onChange({ value: val });
        }}
        disabled={isLocked}
        style={{ minWidth: 140 }}
      />
    );
  };

  return (
    <div className="custom-rule" style={{ opacity: isLocked ? 0.5 : 1 }}>
      <div
        className="custom-drag-handle"
        {...(!isLocked && slots.dragHandles)}
        style={{ cursor: isLocked ? 'not-allowed' : 'grab' }}
      >
        <MdDragIndicator size={18} />
      </div>

      <button
        className="custom-delete-btn"
        onClick={slots.onRemove}
        disabled={isLocked}
        title="Remove rule"
      >
        <MdClose size={16} />
      </button>

      <select
        className="custom-select"
        value={rule.field || ''}
        onChange={(e) => onChange({ field: e.target.value })}
        disabled={isLocked}
        style={{ minWidth: 160 }}
      >
        <option value="" disabled>Field</option>
        {fields.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      <select
        className="custom-select"
        value={rule.operator || ''}
        onChange={(e) => onChange({ operator: e.target.value as OperatorKey })}
        disabled={isLocked}
        style={{ minWidth: 100 }}
      >
        <option value="" disabled>Operator</option>
        {ops.map((op) => (
          <option key={op.value} value={op.value}>
            {op.name}
          </option>
        ))}
      </select>

      {renderValueInput()}
    </div>
  );
};

export default CustomRule;
