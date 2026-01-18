# react-querybuilder-lite

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
