import { Card, Segmented, Button, Tooltip, Space, Typography, theme } from 'antd';
import {
  HolderOutlined,
  PlusOutlined,
  DeleteOutlined,
  CopyOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import type { GroupRenderProps } from '../../../lib';

interface AntGroupProps extends GroupRenderProps {
  rootId: string;
  maxDepth?: number;
}

const AntGroup = (props: AntGroupProps) => {
  const { rootId, group, depth, children, slots, onChange, maxDepth } = props;
  const isRoot = group.id === rootId;
  const isLocked = group.isLocked;
  const isMaxDepth = depth === maxDepth;
  const { token } = theme.useToken();

  return (
    <Card
      size="small"
      style={{
        opacity: isLocked ? 0.6 : 1,
        borderLeft: isRoot ? `1px solid ${token.colorBorder}` : `3px solid ${token.colorPrimary}`,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: 'none',
      }}
      styles={{
        body: {
          padding: '16px',
        },
      }}
      hoverable={!isLocked}
    >
      <Space
        size="middle"
        style={{ marginBottom: 16, width: '100%', flexWrap: 'wrap' }}
        align="center"
      >
        {!isRoot && (
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
        )}

        {isRoot && (
          <Typography.Text
            style={{
              fontWeight: 600,
              color: token.colorPrimary,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: 11,
            }}
          >
            Query
          </Typography.Text>
        )}

        <Segmented
          value={group.combinator}
          onChange={(value) => onChange({ combinator: value as 'and' | 'or' })}
          options={[
            { label: 'AND', value: 'and' },
            { label: 'OR', value: 'or' },
          ]}
          disabled={isLocked}
          style={{ fontWeight: 600, fontSize: 11 }}
        />

        <Button
          icon={<PlusOutlined />}
          onClick={slots.onAddRule}
          disabled={isLocked}
          type="text"
          style={{ color: token.colorPrimary, fontWeight: 500 }}
          onMouseEnter={(e) => {
            if (!isLocked) e.currentTarget.style.opacity = '0.8';
          }}
          onMouseLeave={(e) => {
            if (!isLocked) e.currentTarget.style.opacity = '1';
          }}
        >
          Rule
        </Button>

        {!isMaxDepth && (
          <Button
            icon={<PlusOutlined />}
            onClick={slots.onAddGroup}
            disabled={isLocked}
            type="text"
            style={{ color: token.colorPrimary, fontWeight: 500 }}
            onMouseEnter={(e) => {
              if (!isLocked) e.currentTarget.style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              if (!isLocked) e.currentTarget.style.opacity = '1';
            }}
          >
            Group
          </Button>
        )}

        {!isRoot && (
          <Space size={4} style={{ marginLeft: 'auto' }}>
            <Tooltip title="Delete">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={slots.onRemove}
                disabled={isLocked}
                size="small"
                style={{ color: isLocked ? undefined : token.colorTextSecondary }}
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
                style={{ color: isLocked ? undefined : token.colorTextSecondary }}
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
        )}
      </Space>

      <div style={{ marginLeft: isRoot ? 0 : 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
      </div>
    </Card>
  );
};

export default AntGroup;
