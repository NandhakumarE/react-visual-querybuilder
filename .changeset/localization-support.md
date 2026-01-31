---
"react-querybuilder-lite": minor
---

Add comprehensive localization (i18n) support and flexible field types

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

### New Types
- `DragDropAccessibility`: Interface for accessibility options
- `Announcements`, `ScreenReaderInstructions`: Re-exported from @dnd-kit/core

### Storybook
- New **Localization (i18n)** story with Spanish, Japanese, and French examples
- Updated **Operators** story with custom field types example
- All UI library stories now demonstrate custom field types and operators

### Documentation
- Updated README with Localization section
- Added terminology section explaining Field, Operator, Field Type, Combinator

## Breaking Changes
None - all changes are backward compatible
