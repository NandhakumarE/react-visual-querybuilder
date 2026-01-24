import {
  Box,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Fade,
} from '@mui/material';
import {
  DragIndicatorOutlined,
  AddOutlined,
  DeleteOutlined,
  ContentCopyOutlined,
  LockOutlined,
  LockOpenOutlined,
} from '@mui/icons-material';
import type { GroupRenderProps } from '../../../lib';

interface MuiGroupProps extends GroupRenderProps {
  rootId: string;
  maxDepth?: number;
}

const MuiGroup = (props: MuiGroupProps) => {
  const { rootId, group, depth, children, slots, onChange, maxDepth } = props;
  const isRoot = group.id === rootId;
  const isLocked = group.isLocked;
  const isMaxDepth = depth === maxDepth;

  return (
    <Fade in timeout={300}>
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: isLocked ? 0.6 : 1,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderLeft: isRoot ? '1px solid' : '3px solid',
          borderLeftColor: isRoot ? 'divider' : 'primary.main',
          '&:hover': {
            borderColor: isLocked ? 'divider' : 'primary.light',
            boxShadow: isLocked ? 'none' : '0 1px 3px rgba(26, 115, 232, 0.1)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 2,
            flexWrap: 'wrap',
          }}
        >
          {!isRoot && (
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
          )}

          {isRoot && (
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: 'primary.main',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '0.6875rem',
              }}
            >
              Query
            </Typography>
          )}

          <ToggleButtonGroup
            value={group.combinator}
            exclusive
            onChange={(_, value) => {
              if (value) {
                onChange({ combinator: value as 'and' | 'or' });
              }
            }}
            size="small"
            disabled={isLocked}
            sx={{
              '& .MuiToggleButton-root': {
                px: 2,
                py: 0.5,
                fontWeight: 600,
                fontSize: '0.6875rem',
                letterSpacing: '0.02em',
                border: '1px solid',
                borderColor: 'divider',
                color: 'text.secondary',
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderColor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                },
              },
            }}
          >
            <ToggleButton value="and">AND</ToggleButton>
            <ToggleButton value="or">OR</ToggleButton>
          </ToggleButtonGroup>

          <Button
            startIcon={<AddOutlined sx={{ fontSize: '1rem !important' }} />}
            size="small"
            variant="text"
            onClick={slots.onAddRule}
            disabled={isLocked}
            sx={{
              fontWeight: 500,
              fontSize: '0.8125rem',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'rgba(26, 115, 232, 0.08)',
                color: 'primary.dark',
              },
            }}
          >
            Rule
          </Button>

          {!isMaxDepth && (
            <Button
              startIcon={<AddOutlined sx={{ fontSize: '1rem !important' }} />}
              size="small"
              variant="text"
              onClick={slots.onAddGroup}
              disabled={isLocked}
              sx={{
                fontWeight: 500,
                fontSize: '0.8125rem',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(26, 115, 232, 0.08)',
                  color: 'primary.dark',
                },
              }}
            >
              Group
            </Button>
          )}

          {!isRoot && (
            <Box sx={{ display: 'flex', gap: 0.5, ml: 'auto' }}>
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
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, ml: isRoot ? 0 : 1.5 }}>
          {children}
        </Box>
      </Paper>
    </Fade>
  );
};

export default MuiGroup;
