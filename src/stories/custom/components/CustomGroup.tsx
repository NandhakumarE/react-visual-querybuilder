import { MdAdd, MdDeleteOutline } from 'react-icons/md';
import type { GroupRenderProps } from '../../../lib';

interface CustomGroupProps extends GroupRenderProps {
  rootId: string;
  maxDepth?: number;
}

const CustomGroup = (props: CustomGroupProps) => {
  const { rootId, group, depth, children, slots, onChange, maxDepth } = props;
  const isRoot = group.id === rootId;
  const isLocked = group.isLocked;
  const isMaxDepth = depth === maxDepth;

  // Root level group
  if (isRoot) {
    return (
      <div className="custom-root-group" style={{ opacity: isLocked ? 0.6 : 1 }}>
        <div className="custom-root-header">
          <div className="custom-combinator-toggle">
            <button
              className={`custom-combinator-btn ${group.combinator === 'and' ? 'active' : ''}`}
              onClick={() => onChange({ combinator: 'and' })}
              disabled={isLocked}
            >
              AND
            </button>
            <button
              className={`custom-combinator-btn ${group.combinator === 'or' ? 'active' : ''}`}
              onClick={() => onChange({ combinator: 'or' })}
              disabled={isLocked}
            >
              OR
            </button>
          </div>
        </div>

        <div className="custom-rules-container">
          {children}
        </div>

        {!isMaxDepth && (
          <button
            className="custom-add-group-btn"
            onClick={slots.onAddGroup}
            disabled={isLocked}
          >
            <MdAdd size={18} />
            Add new Group
          </button>
        )}
      </div>
    );
  }

  // Nested group with bracket
  return (
    <div className="custom-group" style={{ opacity: isLocked ? 0.6 : 1 }}>
      {/* Combinator badge on bracket */}
      <div className="custom-group-combinator-badge">
        <span className="custom-combinator-label">
          {group.combinator.toUpperCase()}
        </span>
      </div>

      {/* Rules */}
      <div className="custom-rules-container">
        {children}
      </div>

      {/* Footer with actions */}
      <div className="custom-group-footer">
        <button
          className="custom-add-btn primary"
          onClick={slots.onAddRule}
          disabled={isLocked}
        >
          <MdAdd size={16} />
          Add new conditions
        </button>

        <div className="custom-combinator-toggle">
          <button
            className={`custom-combinator-btn ${group.combinator === 'and' ? 'active' : ''}`}
            onClick={() => onChange({ combinator: 'and' })}
            disabled={isLocked}
          >
            AND
          </button>
          <button
            className={`custom-combinator-btn ${group.combinator === 'or' ? 'active' : ''}`}
            onClick={() => onChange({ combinator: 'or' })}
            disabled={isLocked}
          >
            OR
          </button>
        </div>

        <button
          className="custom-add-btn secondary"
          onClick={slots.onRemove}
          disabled={isLocked}
        >
          <MdDeleteOutline size={16} />
          Delete group
        </button>
      </div>
    </div>
  );
};

export default CustomGroup;
