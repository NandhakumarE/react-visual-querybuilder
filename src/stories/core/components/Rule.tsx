import type { OperatorKey, RuleRenderProps, Value } from "../../../lib";
import { FaRegClone } from "react-icons/fa6";
import { FiTrash } from "react-icons/fi";
import { MdOutlineDragIndicator } from "react-icons/md";
import { IoLockOpenOutline, IoLockClosedOutline } from "react-icons/io5";
import { styles, cn } from "./styles";
import ValueInput from "./ValueInput";

export interface RuleFeatures {
  showDrag?: boolean;
  showRemove?: boolean;
  showClone?: boolean;
  showLock?: boolean;
}

const Rule = (props: RuleRenderProps & { features?: RuleFeatures }) => {
  const { rule, slots, onChange, fields, operators, selectedField, features } = props;
  const { showDrag = true, showRemove = true, showClone = true, showLock = true } = features || {};

  const isLocked = rule.isLocked;

  return (
    <div
      className={cn(
        "flex items-center gap-1 border border-gray-300 rounded-md overflow-hidden",
        isLocked && styles.lockedContainer
      )}
      aria-disabled={isLocked}
    >
      {showDrag && (
        <div
          className={cn(
            isLocked ? styles.dragHandleDisabled : styles.dragHandle,
            styles.focusOutline
          )}
          {...(!isLocked && slots.dragHandles)}
        >
          <MdOutlineDragIndicator size="18" />
        </div>
      )}
      <div className={`${showDrag ? 'border-x': 'border-r'} border-gray-300 bg-gray-50 p-2 flex-1 flex gap-4`}>
        <select
          id={rule.id + "field"}
          className={cn(styles.input, styles.focusOutline)}
          value={rule.field || ""}
          onChange={(e) => onChange({ field: e.target.value })}
          disabled={isLocked}
        >
          <option value="" disabled>
            Select field
          </option>
          {fields.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <select
          id={rule.id + "operator"}
          className={cn(styles.input, styles.focusOutline)}
          value={rule.operator || ""}
          onChange={(e) => onChange({ operator: e.target.value as OperatorKey })}
          disabled={isLocked}
        >
          <option value="" disabled>
            Select operator
          </option>
          {operators.map((op) => (
            <option key={op.value} value={op.value}>
              {op.name}
            </option>
          ))}
        </select>
        <ValueInput
          ruleId={rule.id}
          fieldType={selectedField?.type}
          operator={rule.operator}
          value={rule.value}
          onChange={(value: Value) => onChange({ value })}
          disabled={isLocked}
        />
      </div>
      <div className="flex gap-4 px-2">
        {showRemove && (
          <button
            className={cn(
              isLocked ? styles.iconButtonDisabled : styles.iconButton,
              styles.focusOutline
            )}
            onClick={slots.onRemove}
            disabled={isLocked}
          >
            <FiTrash size="17" title="Delete" />
          </button>
        )}
        {showClone && (
          <button
            className={cn(
              isLocked ? styles.iconButtonDisabled : styles.iconButton,
              styles.focusOutline
            )}
            onClick={slots.onClone}
            disabled={isLocked}
          >
            <FaRegClone size="16" title="Clone" />
          </button>
        )}
        {showLock && (
          <button
            className={cn(
              isLocked ? styles.iconLockButtonActive : styles.iconLockButton,
              styles.focusOutline,
            )}
            onClick={slots.onToggleLock}
          >
            {isLocked ? (
              <IoLockClosedOutline size="18" title="Unlock"/>
            ) : (
              <IoLockOpenOutline size="18" title="Lock" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Rule;
