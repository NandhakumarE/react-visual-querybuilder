import type {
  Field,
  FieldType,
  Operator,
  Query,
  Rule,
  RuleGroup,
} from "../../types/common.types";
import type {
  DragPreviewProps,
  GroupRenderProps,
  RuleRenderProps,
} from "../../types/query-builder.types";
import {
  findItemById,
  isRuleGroup,
  getFieldMap,
  getSelectedField,
  getOperatorForFieldType,
  getSelectedOperatorByKey,
} from "../../utils";
import { OPERATORS_BY_FIELD_TYPE } from "../../constants";

interface DefaultDragOverlayProps {
  activeId: string | null;
  query: Query;
  fields: Field[];
  operatorsByFieldType?: Record<FieldType, Operator[]>;
  renderDragPreview?: (props: DragPreviewProps) => React.ReactNode;
  renderGroup: (props: GroupRenderProps) => React.ReactNode;
  renderRule: (props: RuleRenderProps) => React.ReactNode;
}

const noOpDragHandles = {
  attributes: undefined,
  listeners: undefined,
};

const noOpSlots = {
  onRemove: () => {},
  onClone: () => {},
  onToggleLock: () => {},
  dragHandles: noOpDragHandles,
};

const noOpGroupSlots = {
  ...noOpSlots,
  onAddGroup: () => {},
  onAddRule: () => {},
};

const DefaultDragOverlay = ({
  activeId,
  query,
  fields,
  operatorsByFieldType,
  renderDragPreview,
  renderGroup,
  renderRule,
}: DefaultDragOverlayProps) => {
  const fieldMap = getFieldMap(fields);
  const effectiveOperatorsByFieldType =
    operatorsByFieldType ?? OPERATORS_BY_FIELD_TYPE;

  // Recursive function to render any item (rule or group)
  const renderItem = (
    item: Rule | RuleGroup,
    path: number[],
    depth: number
  ): React.ReactNode => {
    if (isRuleGroup(item)) {
      // Recursively render all children
      const children = (
        <>
          {item.rules.map((child, index) =>
            renderItem(child, [...path, index], depth + 1)
          )}
        </>
      );

      return renderGroup({
        group: item,
        path,
        depth,
        children,
        slots: noOpGroupSlots,
        onChange: () => {},
      });
    }

    // Render rule
    const selectedField = getSelectedField(item, fieldMap);
    const operators = selectedField
      ? getOperatorForFieldType(selectedField.type, effectiveOperatorsByFieldType)
      : [];
    const selectedOperator = getSelectedOperatorByKey(item.operator);

    return renderRule({
      rule: item,
      path,
      depth,
      fields,
      operators,
      selectedField,
      selectedOperator,
      slots: noOpSlots,
      onChange: () => {},
    });
  };

  if (!activeId) return null;

  const result = findItemById(query, activeId);
  if (!result) return null;

  const { item, path } = result;

  // If custom drag preview is provided, use it
  if (renderDragPreview) {
    const type = isRuleGroup(item) ? "group" : "rule";
    return renderDragPreview({ item, type });
  }

  // Render the item (rule or group) with full recursive content
  return renderItem(item, path, path.length);
};

export default DefaultDragOverlay;
