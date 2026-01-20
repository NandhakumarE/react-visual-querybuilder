import type { GroupRenderProps } from "../../../lib";
import { MdOutlineDragIndicator } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { FaRegClone } from "react-icons/fa6";
import { FiTrash } from "react-icons/fi";
import { IoLockOpenOutline, IoLockClosedOutline } from "react-icons/io5";
import { styles, cn } from "./styles";

export interface GroupFeatures {
  showDrag?: boolean;
  showAddRule?: boolean;
  showAddGroup?: boolean;
  showRemove?: boolean;
  showClone?: boolean;
  showLock?: boolean;
}

const Group = (props: GroupRenderProps & { rootId: string; features?: GroupFeatures, maxDepth?: number }) => {
  const { rootId, group, depth, children, slots, onChange, features, maxDepth } = props;
  const { showDrag = true, showAddRule = true, showAddGroup = true, showRemove = true, showClone = true, showLock = true } = features || {};

  const isRoot = group.id === rootId;
  const isLocked = group.isLocked;
  const isMaxDepth = depth===maxDepth;

  return (
    <div
      className={cn(
        styles.groupContainer,
        isLocked && styles.lockedContainer
      )}
      aria-disabled={isLocked}
    >
      <div className="mb-1 flex items-center gap-2 py-1 pl-2">
        {showDrag && !isRoot && (
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
        <select
          id={group.id + "combinator"}
          className={cn(styles.select, "font-semibold", styles.textLabel, styles.focusOutline)}
          value={group.combinator}
          onChange={(e) =>
            onChange({ combinator: e.target.value as "and" | "or" })
          }
          disabled={isLocked}
        >
          <option value="and">AND</option>
          <option value="or">OR</option>
        </select>
        {showAddRule && (
          <button
            className={cn(
              isLocked ? styles.buttonDisabled : styles.button,
              styles.focusOutline
            )}
            onClick={slots.onAddRule}
            disabled={isLocked}
          >
            <IoMdAdd /> Add Rule
          </button>
        )}
        {showAddGroup && !isMaxDepth && (
          <button
            className={cn(
              isLocked ? styles.buttonDisabled : styles.button,
              styles.focusOutline
            )}
            onClick={slots.onAddGroup}
            disabled={isLocked}
          >
            <IoMdAdd /> Add Group
          </button>
        )}
        {showRemove && !isRoot && (
          <button
            className={cn(
              isLocked ? styles.buttonDisabled : styles.button,
              styles.focusOutline
            )}
            onClick={slots.onRemove}
            disabled={isLocked}
          >
            <FiTrash /> Remove
          </button>
        )}
        {showClone && !isRoot && (
          <button
            className={cn(
              isLocked ? styles.buttonDisabled : styles.button,
              styles.focusOutline
            )}
            onClick={slots.onClone}
            disabled={isLocked}
          >
            <FaRegClone /> Clone
          </button>
        )}
        {showLock && !isRoot && (
          <button
            className={cn(
              isLocked ? styles.lockButtonActive : styles.lockButton,
              styles.focusOutline
            )}
            onClick={slots.onToggleLock}
          >
            {isLocked ? <IoLockClosedOutline size="18" /> : <IoLockOpenOutline size="18" />}
            {isLocked ? "Unlock" : "Lock"}
          </button>
        )}
      </div>
      <div className="ml-6 flex flex-col gap-2">{children}</div>
    </div>
  );
};

export default Group;
