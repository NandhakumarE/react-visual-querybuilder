import type React from "react";
import useQueryBuilderContext from "../../hooks/useQueryBuilderContext";
import type { BuilderProps, DragHandleType, Rule, RuleGroup } from "../../types";
import {
  getFieldMap,
  getOperatorForFieldType,
  getSelectedField,
  getSelectedOperatorByKey,
  isRuleGroup,
} from "../../utils";
import CustomFragment from "./CustomFragment";
import { Fragment, useMemo } from "react";
import { OPERATORS_BY_FIELD_TYPE } from "../../constants";
import useBuilderContext from "../../hooks/useBuilderContext";

const Builder = (props: BuilderProps) => {
  const { draggable: Draggable = CustomFragment, droppable: Droppable = () => null } =
    useBuilderContext() || {};
  const { fields, operatorsByFieldType = OPERATORS_BY_FIELD_TYPE } = props;
  const {
    query,
    addGroup,
    addRule,
    remove,
    clone,
    toggleLock,
    updateGroup,
    updateRule,
  } = useQueryBuilderContext();
  const fieldMap = useMemo(() => getFieldMap(fields), [fields]);

  const renderNode = (
    node: Rule | RuleGroup,
    path: number[] = [],
    dragHandles: DragHandleType = {}
  ): React.ReactNode => {
    if (isRuleGroup(node)) {
      const rules: (Rule | RuleGroup)[] = node.rules;
      const renderedRules = (
        <>
          {rules.map((rule: Rule | RuleGroup, index: number) => {
            const localPath = [...path, index];
            return (
              <Fragment key={rule.id}>
                <Droppable
                  id={`${node.id}-drop-${index + 1}`}
                  path={localPath}
                  disable={node.isLocked}
                />
                <Draggable
                  id={rule.id}
                  path={localPath}
                  disable={node.isLocked}
                >
                  {(props) => renderNode(rule, localPath, props?.dragUtils || {})}
                </Draggable>
              </Fragment>
            );
          })}
          {/* Drop zone before first item */}
          <Droppable
            id={`${node.id}-drop-#`}
            path={[...path, rules.length]}
            disable={node.isLocked}
          />
        </>
      );

      const groupContent = props.renderGroup({
        children: renderedRules,
        group: node,
        path,
        depth: path.length + 1,
        slots: {
          onAddGroup: () => addGroup(path),
          onAddRule: () => addRule(path),
          onRemove: () => remove(path),
          onClone: () => clone(path),
          onToggleLock: () => toggleLock(path),
          dragHandles,
        },
        onChange: (updates: Partial<RuleGroup>) => updateGroup(path, updates),
      });

      // Root group: no wrapper | Nested group: wrapped
      return groupContent;
    }

    const selectedField = getSelectedField(node, fieldMap);
    const operators = selectedField
      ? getOperatorForFieldType(selectedField.type, operatorsByFieldType)
      : [];
    const selectedOperator = getSelectedOperatorByKey(node.operator);
    const ruleContent = props.renderRule({
      rule: node,
      path,
      depth: path.length,
      fields: fields,
      operators,
      slots: {
        onRemove: () => remove(path),
        onClone: () => clone(path),
        onToggleLock: () => toggleLock(path),
        dragHandles,
      },
      selectedField,
      selectedOperator,
      onChange: (updates: Partial<Rule>) => updateRule(path, updates),
    });
    return ruleContent;
  };

  return <div>{renderNode(query)}</div>;
};

export default Builder;
