# react-querybuilder-lite

## 1.1.0

### Minor Changes

- e43accc: Add comprehensive localization (i18n) support, flexible field types, and React 16.8+ support

  ## Features

  ### Flexible Field Types

  - `FieldType` is now `string` instead of a fixed union, allowing custom types like `email`, `datetime`, `currency`
  - Added `DefaultFieldType` for the 4 built-in types: `string`, `number`, `boolean`, `date`
  - Users can define any field type and provide custom operators via `operatorsByFieldType`

  ### Localization Support

  - **Field labels**: Translated via `fields` prop
  - **Operator names**: Translated via `operatorsByFieldType` prop with custom `name` values
  - **UI text**: Render functions (`renderRule`/`renderGroup`) give full control over buttons, placeholders, combinators
  - **Screen reader text**: New `dragDropAccessibility` prop for translated drag & drop announcements

  ### New Props

  - `dragDropAccessibility` on `BuilderWithDnD`: Customize screen reader announcements and instructions for accessibility/i18n
    - `announcements`: Localized text for `onDragStart`, `onDragOver`, `onDragEnd`, `onDragCancel`
    - `instructions`: Localized text for draggable focus instructions

  ### New Exports

  - `getInitialRule()`: Creates a new Rule with generated ID
  - `getInitialRuleGroup()`: Creates a new RuleGroup with generated ID

  ### New Types

  - `DragDropAccessibility`: Interface for accessibility options
  - `Announcements`, `ScreenReaderInstructions`: Re-exported from @dnd-kit/core

  ### React Version Support

  - Now supports React 16.8+ (previously 18+)
  - Added fallback for `crypto.randomUUID()` for older environments

  ### Storybook

  - New **Localization (i18n)** story with Spanish, Japanese, and French examples
  - Updated **Operators** story with custom field types example
  - All UI library stories now demonstrate custom field types and operators

  ### Documentation

  - Updated README with Localization section
  - Added terminology section explaining Field, Operator, Field Type, Combinator
  - Added CodeSandbox demo link

  ### Fixes

  - `Rule.operator` now defaults to empty string instead of `"equal"` on initial creation
  - `Rule.operator` type now allows custom operator values (string)

  ## Breaking Changes

  None - all changes are backward compatible

## 1.0.0

### Major Changes

- 72ada1c: Add comprehensive UI library integrations and enhanced Storybook stories

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

## 0.2.0

### Minor Changes

- 1abb2f6: ### Features

  - Add `QueryBuilder` component for building queries without drag-and-drop
  - Add `QueryBuilderDnD` component with built-in drag-and-drop support
  - Add `addRule` and `addRuleGroup` utilities for inserting new items
  - Add `removeRule` and `removeRuleGroup` utilities for deletion
  - Add `updateRuleInQuery` and `updateRuleGroupInQuery` for modifications
  - Add `cloneRule` and `cloneRuleGroup` for duplicating with new IDs
  - Add `lockRule` and `lockRuleGroup` to prevent editing
  - Add `moveHandler` for drag-and-drop reordering
  - Add `DefaultDragOverlay` component for drag preview
  - Add `Draggable` and `Droppable` components for custom DnD implementations
  - Add Storybook with interactive component examples

  ### Bug Fixes

  - Fix depth calculation in nested group render props
  - Fix drag-and-drop edge cases when moving between groups
  - Fix styles to inject at runtime (no separate CSS import required)
