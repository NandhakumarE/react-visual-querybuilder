import type React from "react";
import useQueryBuilderContext from "../hooks/useQueryBuilderContext";
import type { BuilderProps, Rule, RuleGroup } from "../types";
import {
  getFieldMap,
  getOperatorForFieldType,
  getSelectedField,
  getSelectedOperatorByKey,
  isRuleGroup,
} from "../utils";
import { useMemo } from "react";
import { OPERATORS_BY_FIELD_TYPE } from "../constants";
import useBuilderContext from "../hooks/useBuilderContext";
import DefaultWrapper from "./DefaultWrapper";
import DefaultContainer from "./DefaultContainer";

const Builder = (props: BuilderProps) => {
  const {
    itemWrapper: ItemWrapper = DefaultWrapper,
    containerWrapper: ContainerWrapper = DefaultContainer,
  } = useBuilderContext() || {};
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
    query: Rule | RuleGroup,
    path: number[] = []
  ): React.ReactNode => {
    if (isRuleGroup(query)) {
      const rules: (Rule | RuleGroup)[] = query.rules;
      const itemIds = rules.map((rule) => rule.id);
      const renderedRules = (
        <ContainerWrapper items={itemIds}>
          {rules.map((rule: Rule | RuleGroup, index: number) => (
            <ItemWrapper key={rule.id} id={rule.id}>
              {renderNode(rule, [...path, index])}
            </ItemWrapper>
          ))}
        </ContainerWrapper>
      );

      const groupContent = props.renderGroup({
        children: renderedRules,
        group: query,
        path,
        depth: path.length,
        slots: {
          onAddGroup: () => addGroup(path),
          onAddRule: () => addRule(path),
          onRemove: () => remove(path),
          onClone: () => clone(path),
          onToggleLock: () => toggleLock(path),
          addGroup: null,
          addRule: null,
          lock: null,
          remove: null,
          clone: null,
        },
        onChange: (updates: Partial<RuleGroup>) => updateGroup(path, updates),
      });

      // Root group: no wrapper | Nested group: wrapped
      return path.length === 0 ? (
        groupContent
      ) : (
        <ItemWrapper key={query.id} id={query.id}>
          {groupContent}
        </ItemWrapper>
      );
    }

    const selectedField = getSelectedField(query, fieldMap);
    const operators = selectedField
      ? getOperatorForFieldType(selectedField.type, operatorsByFieldType)
      : [];
    const selectedOperator = getSelectedOperatorByKey(query.operator);
    return props.renderRule({
      rule: query,
      path,
      depth: path.length,
      fields: fields,
      operators,
      slots: {
        onRemove: () => remove(path),
        onClone: () => clone(path),
        onToggleLock: () => toggleLock(path),
        lock: null,
        remove: null,
        clone: null,
      },
      selectedField,
      selectedOperator,
      onChange: (updates: Partial<Rule>) => updateRule(path, updates),
    });
  };

  return <div>{renderNode(query)}</div>;
};

export default Builder;
