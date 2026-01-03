import type React from "react";
import useQueryBuilderContext from "../hooks/useQueryBuilderContext";
import type { BuilderProps, FieldType, Rule, RuleGroup } from "../types";
import {
  getFieldMap,
  getOperatorForFieldType,
  getSelectedField,
  getSelectedOperatorByKey,
  isRuleGroup,
} from "../utils";
import { Fragment, useMemo } from "react";
import { OPERATORS_BY_FIELD_TYPE } from "../constants";

const Builder = (props: BuilderProps) => {
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
      const rules: (Rule | RuleGroup)[] = (query as RuleGroup).rules;
      const renderedRules = rules.map(
        (rule: Rule | RuleGroup, index: number) => (
          <Fragment key={(rule as Rule | RuleGroup).id}>
            {renderNode(rule, [...path, index])}
          </Fragment>
        )
      );
      return props.renderGroup({
        children: renderedRules,
        group: query as RuleGroup,
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
    }
    return props.renderRule({
      rule: query as Rule,
      path,
      depth: path.length,
      fields: fields,
      operators: getOperatorForFieldType(
        getSelectedField(query as Rule, fieldMap)?.type as FieldType,
        operatorsByFieldType
      ),
      slots: {
        onRemove: () => remove(path),
        onClone: () => clone(path),
        onToggleLock: () => toggleLock(path),
        lock: null,
        remove: null,
        clone: null,
      },
      selectedField: getSelectedField(query as Rule, fieldMap),
      selectedOperator: getSelectedOperatorByKey((query as Rule).operator),
      onChange: (updates: Partial<Rule>) => updateRule(path, updates),
    });
  };

  return <div>{renderNode(query)}</div>;
};

export default Builder;
