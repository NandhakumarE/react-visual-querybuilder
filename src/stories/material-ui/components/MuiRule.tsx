import {
  Box,
  Paper,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Fade,
} from '@mui/material';
import {
  DragIndicatorOutlined,
  DeleteOutlined,
  ContentCopyOutlined,
  LockOutlined,
  LockOpenOutlined,
} from '@mui/icons-material';
import type { RuleRenderProps, Value } from '../../../lib';
import MuiValueInput from './MuiValueInput';

const MuiRule = (props: RuleRenderProps) => {
  const { rule, slots, onChange, fields, operators, selectedField } = props;
  const isLocked = rule.isLocked;

  return (
    <Fade in timeout={300}>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 2,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: isLocked ? 0.5 : 1,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          '&:hover': {
            borderColor: isLocked ? 'divider' : 'primary.light',
            boxShadow: isLocked ? 'none' : '0 1px 3px rgba(26, 115, 232, 0.1)',
          },
        }}
      >
        <Box
          {...(!isLocked && slots.dragHandles)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: isLocked ? 'not-allowed' : 'grab',
            color: 'text.secondary',
            opacity: isLocked ? 0.3 : 0.5,
            transition: 'all 0.2s ease',
            '&:hover': {
              opacity: isLocked ? 0.3 : 1,
              color: 'primary.main',
            },
            '&:active': {
              cursor: isLocked ? 'not-allowed' : 'grabbing',
            },
          }}
        >
          <DragIndicatorOutlined fontSize="small" />
        </Box>

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel id={`${rule.id}-field-label`} sx={{ fontSize: '0.8125rem' }}>Field</InputLabel>
          <Select
            labelId={`${rule.id}-field-label`}
            id={`${rule.id}-field`}
            value={rule.field || ''}
            label="Field"
            onChange={(e) => onChange({ field: e.target.value })}
            disabled={isLocked}
            sx={{ fontSize: '0.8125rem' }}
          >
            {fields.map((f) => (
              <MenuItem key={f.value} value={f.value} sx={{ fontSize: '0.8125rem' }}>
                {f.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id={`${rule.id}-operator-label`} sx={{ fontSize: '0.8125rem' }}>Operator</InputLabel>
          <Select
            labelId={`${rule.id}-operator-label`}
            id={`${rule.id}-operator`}
            value={rule.operator || ''}
            label="Operator"
            onChange={(e) => onChange({ operator: e.target.value })}
            disabled={isLocked}
            sx={{ fontSize: '0.8125rem' }}
          >
            {operators.map((op) => (
              <MenuItem key={op.value} value={op.value} sx={{ fontSize: '0.8125rem' }}>
                {op.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <MuiValueInput
          ruleId={rule.id}
          fieldType={selectedField?.type}
          operator={rule.operator}
          value={rule.value}
          onChange={(value: Value) => onChange({ value })}
          disabled={isLocked}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
          <Tooltip title="Delete" arrow placement="top">
            <span>
              <IconButton
                size="small"
                onClick={slots.onRemove}
                disabled={isLocked}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'error.main',
                    backgroundColor: 'rgba(234, 67, 53, 0.08)',
                  },
                }}
              >
                <DeleteOutlined fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Duplicate" arrow placement="top">
            <span>
              <IconButton
                size="small"
                onClick={slots.onClone}
                disabled={isLocked}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'secondary.main',
                    backgroundColor: 'rgba(52, 168, 83, 0.08)',
                  },
                }}
              >
                <ContentCopyOutlined fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={isLocked ? 'Unlock' : 'Lock'} arrow placement="top">
            <IconButton
              size="small"
              onClick={slots.onToggleLock}
              sx={{
                color: isLocked ? 'warning.main' : 'text.secondary',
                '&:hover': {
                  color: 'warning.main',
                  backgroundColor: 'rgba(251, 188, 4, 0.08)',
                },
              }}
            >
              {isLocked ? <LockOutlined fontSize="small" /> : <LockOpenOutlined fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    </Fade>
  );
};

export default MuiRule;
