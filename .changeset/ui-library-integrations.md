---
"react-querybuilder-lite": major
---

Add comprehensive UI library integrations and enhanced Storybook stories

## Features

### UI Library Integrations
- **Ant Design**: Complete query builder integration with custom Rule, Group, and ValueInput components supporting light/dark themes
- **Chakra UI**: Full Chakra UI implementation with accessible components and theme configuration
- **Material UI**: Material Design query builder components with Google-inspired palette and theme system
- **Custom CSS**: Pure CSS-based query builder with unique vertical line design pattern

### Components & Utilities
- Custom ValueInput components for each UI library handling string, number, date, and boolean field types
- Range value input support for operators like `between` and `not_between`
- Drag-and-drop handles for all components (when items are not locked)
- Lock/unlock functionality with visual feedback
- Duplicate and delete actions for rules and groups
- AND/OR combinator toggles with keyboard and mouse support

### Story Enhancements
- Complete core stories for BasicBuilder, MaxDepth, Operators, WithDragAndDrop, and LockedRules
- Story component utilities with configurable features (drag, clone, lock)
- Dark mode support across all stories
- Improved responsive layouts with proper container styling

### Dependencies
- Added: `@chakra-ui/react`, `@emotion/react`, `@emotion/styled`
- Added: `@mui/icons-material`, `@mui/material`
- Added: `antd`, `dayjs`

### Testing & Configuration
- Updated vitest configuration for improved test setup
- Enhanced TypeScript configuration support
- Added GitHub workflows for CI/CD (deploy-storybook, release)

## Breaking Changes
None

## Migration Guide
No migration needed. This is a purely additive release with new story examples and UI library integrations.
