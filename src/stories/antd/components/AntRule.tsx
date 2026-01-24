import { Card, Select, Button, Tooltip, Space, theme } from 'antd';
import {
  HolderOutlined,
  DeleteOutlined,
  CopyOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import type { OperatorKey, RuleRenderProps, Value } from '../../../lib';
import AntValueInput from './AntValueInput';

const AntRule = (props: RuleRenderProps) => {
  const { rule, slots, onChange, fields, operators, selectedField } = props;
  const isLocked = rule.isLocked;
  const { token } = theme.useToken();

  return (
    <Card
      size="small"
      style={{
        opacity: isLocked ? 0.5 : 1,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        border: `1px solid ${token.colorBorder}`,
        boxShadow: 'none',
      }}
      styles={{
        body: {
          padding: '12px 16px',
        },
      }}
      hoverable={!isLocked}
    >
      <Space size="middle" style={{ width: '100%', flexWrap: 'wrap' }} align="center">
        <div
          {...(!isLocked && slots.dragHandles)}
          style={{
            cursor: isLocked ? 'not-allowed' : 'grab',
            color: isLocked ? token.colorTextDisabled : token.colorTextSecondary,
            display: 'flex',
            alignItems: 'center',
            padding: 4,
            borderRadius: token.borderRadius,
            transition: 'all 0.2s',
            opacity: isLocked ? 0.3 : 0.5,
          }}
          onMouseEnter={(e) => {
            if (!isLocked) {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.color = token.colorPrimary;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = isLocked ? '0.3' : '0.5';
            e.currentTarget.style.color = isLocked ? token.colorTextDisabled : token.colorTextSecondary;
          }}
        >
          <HolderOutlined style={{ fontSize: 14 }} />
        </div>

        <Select
          id={`${rule.id}-field`}
          value={rule.field || undefined}
          onChange={(value) => onChange({ field: value })}
          disabled={isLocked}
          style={{ minWidth: 130 }}
          placeholder="Field"
          options={fields.map((f) => ({ label: f.label, value: f.value }))}
        />

        <Select
          id={`${rule.id}-operator`}
          value={rule.operator || undefined}
          onChange={(value) => onChange({ operator: value as OperatorKey })}
          disabled={isLocked}
          style={{ minWidth: 140 }}
          placeholder="Operator"
          options={operators.map((op) => ({ label: op.name, value: op.value }))}
        />

        <div style={{ flex: 1, minWidth: 150 }}>
          <AntValueInput
            ruleId={rule.id}
            fieldType={selectedField?.type}
            operator={rule.operator}
            value={rule.value}
            onChange={(value: Value) => onChange({ value })}
            disabled={isLocked}
          />
        </div>

        <Space size={4}>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={slots.onRemove}
              disabled={isLocked}
              size="small"
              style={{
                color: isLocked ? undefined : token.colorTextSecondary,
              }}
              onMouseEnter={(e) => {
                if (!isLocked) {
                  e.currentTarget.style.color = token.colorError;
                }
              }}
              onMouseLeave={(e) => {
                if (!isLocked) {
                  e.currentTarget.style.color = token.colorTextSecondary;
                }
              }}
            />
          </Tooltip>
          <Tooltip title="Duplicate">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={slots.onClone}
              disabled={isLocked}
              size="small"
              style={{
                color: isLocked ? undefined : token.colorTextSecondary,
              }}
              onMouseEnter={(e) => {
                if (!isLocked) {
                  e.currentTarget.style.color = token.colorSuccess;
                }
              }}
              onMouseLeave={(e) => {
                if (!isLocked) {
                  e.currentTarget.style.color = token.colorTextSecondary;
                }
              }}
            />
          </Tooltip>
          <Tooltip title={isLocked ? 'Unlock' : 'Lock'}>
            <Button
              type="text"
              icon={isLocked ? <LockOutlined /> : <UnlockOutlined />}
              onClick={slots.onToggleLock}
              size="small"
              style={{ color: isLocked ? token.colorWarning : token.colorTextSecondary }}
            />
          </Tooltip>
        </Space>
      </Space>
    </Card>
  );
};

export default AntRule;
