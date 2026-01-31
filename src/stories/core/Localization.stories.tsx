import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryBuilder } from "../../lib/components/QueryBuilder";
import type { Query, Operator, DragDropAccessibility } from "../../lib/types";
import "../stories.css";

import Rule from "./components/Rule";
import Group from "./components/Group";
import { type Labels } from "./components/labels";

// ============ LANGUAGE CONFIGURATIONS ============

type LanguageConfig = {
  fields: { label: string; value: string; type: string }[];
  operators: Record<string, Operator[]>;
  accessibility: DragDropAccessibility;
  initialQuery: Query;
  labels: Labels;
};

const languages: Record<string, LanguageConfig> = {
  spanish: {
    fields: [
      { label: "Nombre", value: "nombre", type: "string" },
      { label: "Apellido", value: "apellido", type: "string" },
      { label: "Correo", value: "correo", type: "email" },
      { label: "Edad", value: "edad", type: "number" },
      { label: "Activo", value: "activo", type: "boolean" },
      { label: "Fecha de Registro", value: "fechaRegistro", type: "date" },
    ],
    operators: {
      string: [
        { name: "Es igual a", value: "equal", type: "binary" },
        { name: "No es igual a", value: "not_equal", type: "binary" },
        { name: "Contiene", value: "contains", type: "binary" },
        { name: "Comienza con", value: "starts_with", type: "binary" },
        { name: "Termina con", value: "ends_with", type: "binary" },
        { name: "Está vacío", value: "is_empty", type: "unary" },
      ],
      number: [
        { name: "Es igual a", value: "equal", type: "binary" },
        { name: "Mayor que", value: "greater", type: "binary" },
        { name: "Menor que", value: "less", type: "binary" },
        { name: "Entre", value: "between", type: "range" },
      ],
      boolean: [
        { name: "Es verdadero", value: "is_true", type: "unary" },
        { name: "Es falso", value: "is_false", type: "unary" },
      ],
      email: [
        { name: "Es igual a", value: "equal", type: "binary" },
        { name: "Contiene", value: "contains", type: "binary" },
        { name: "Termina con", value: "ends_with", type: "binary" },
      ],
      date: [
        { name: "Es igual a", value: "equal", type: "binary" },
        { name: "Antes de", value: "less", type: "binary" },
        { name: "Después de", value: "greater", type: "binary" },
        { name: "Entre", value: "between", type: "range" },
      ],
    },
    accessibility: {
      announcements: {
        onDragStart: ({ active }) => `Elemento ${active.id} recogido`,
        onDragOver: ({ active, over }) =>
          over ? `Elemento ${active.id} sobre ${over.id}` : `Elemento ${active.id} ya no está sobre un área`,
        onDragEnd: ({ active, over }) =>
          over ? `Elemento ${active.id} soltado sobre ${over.id}` : `Elemento ${active.id} soltado`,
        onDragCancel: ({ active }) => `Arrastre cancelado para ${active.id}`,
      },
      instructions: {
        draggable: "Presione espacio para recoger. Use las flechas para mover.",
      },
    },
    initialQuery: {
      id: "root",
      combinator: "and",
      rules: [
        { id: "rule-1", field: "nombre", operator: "equal", value: "Juan" },
        { id: "rule-2", field: "edad", operator: "greater", value: 18 },
        { id: "rule-3", field: "activo", operator: "is_true" },
      ],
    },
    labels: {
      and: "Y",
      or: "O",
      selectField: "Seleccionar campo",
      selectOperator: "Seleccionar operador",
      from: "Desde",
      to: "hasta",
      addRule: "Añadir Regla",
      addGroup: "Añadir Grupo",
      remove: "Eliminar",
      clone: "Clonar",
      lock: "Bloquear",
      unlock: "Desbloquear",
      dateFormat: "dd/mm/aaaa",
    },
  },
  japanese: {
    fields: [
      { label: "名前", value: "namae", type: "string" },
      { label: "メール", value: "mail", type: "email" },
      { label: "年齢", value: "nenrei", type: "number" },
      { label: "有効", value: "yuukou", type: "boolean" },
      { label: "登録日", value: "tourokubi", type: "date" },
    ],
    operators: {
      string: [
        { name: "等しい", value: "equal", type: "binary" },
        { name: "等しくない", value: "not_equal", type: "binary" },
        { name: "含む", value: "contains", type: "binary" },
        { name: "で始まる", value: "starts_with", type: "binary" },
        { name: "で終わる", value: "ends_with", type: "binary" },
        { name: "空である", value: "is_empty", type: "unary" },
      ],
      number: [
        { name: "等しい", value: "equal", type: "binary" },
        { name: "より大きい", value: "greater", type: "binary" },
        { name: "より小さい", value: "less", type: "binary" },
        { name: "の間", value: "between", type: "range" },
      ],
      boolean: [
        { name: "真である", value: "is_true", type: "unary" },
        { name: "偽である", value: "is_false", type: "unary" },
      ],
      email: [
        { name: "等しい", value: "equal", type: "binary" },
        { name: "含む", value: "contains", type: "binary" },
      ],
      date: [
        { name: "等しい", value: "equal", type: "binary" },
        { name: "より前", value: "less", type: "binary" },
        { name: "より後", value: "greater", type: "binary" },
        { name: "の間", value: "between", type: "range" },
      ],
    },
    accessibility: {
      announcements: {
        onDragStart: ({ active }) => `${active.id}を持ち上げました`,
        onDragOver: ({ active, over }) =>
          over ? `${active.id}が${over.id}の上にあります` : `${active.id}はドロップ領域外です`,
        onDragEnd: ({ active, over }) =>
          over ? `${active.id}を${over.id}にドロップしました` : `${active.id}をドロップしました`,
        onDragCancel: ({ active }) => `${active.id}のドラッグをキャンセルしました`,
      },
      instructions: {
        draggable: "スペースキーで持ち上げ、矢印キーで移動",
      },
    },
    initialQuery: {
      id: "root",
      combinator: "and",
      rules: [
        { id: "rule-1", field: "namae", operator: "equal", value: "田中" },
        { id: "rule-2", field: "nenrei", operator: "greater", value: 20 },
      ],
    },
    labels: {
      and: "かつ",
      or: "または",
      selectField: "フィールドを選択",
      selectOperator: "演算子を選択",
      from: "から",
      to: "まで",
      addRule: "ルールを追加",
      addGroup: "グループを追加",
      remove: "削除",
      clone: "複製",
      lock: "ロック",
      unlock: "ロック解除",
      dateFormat: "yyyy/mm/dd",
    },
  },
  french: {
    fields: [
      { label: "Prénom", value: "prenom", type: "string" },
      { label: "Nom", value: "nom", type: "string" },
      { label: "Courriel", value: "courriel", type: "email" },
      { label: "Âge", value: "age", type: "number" },
      { label: "Actif", value: "actif", type: "boolean" },
      { label: "Date d'inscription", value: "dateInscription", type: "date" },
    ],
    operators: {
      string: [
        { name: "Est égal à", value: "equal", type: "binary" },
        { name: "N'est pas égal à", value: "not_equal", type: "binary" },
        { name: "Contient", value: "contains", type: "binary" },
        { name: "Commence par", value: "starts_with", type: "binary" },
        { name: "Se termine par", value: "ends_with", type: "binary" },
        { name: "Est vide", value: "is_empty", type: "unary" },
      ],
      number: [
        { name: "Est égal à", value: "equal", type: "binary" },
        { name: "Supérieur à", value: "greater", type: "binary" },
        { name: "Inférieur à", value: "less", type: "binary" },
        { name: "Entre", value: "between", type: "range" },
      ],
      boolean: [
        { name: "Est vrai", value: "is_true", type: "unary" },
        { name: "Est faux", value: "is_false", type: "unary" },
      ],
      email: [
        { name: "Est égal à", value: "equal", type: "binary" },
        { name: "Contient", value: "contains", type: "binary" },
        { name: "Se termine par", value: "ends_with", type: "binary" },
      ],
      date: [
        { name: "Est égal à", value: "equal", type: "binary" },
        { name: "Avant", value: "less", type: "binary" },
        { name: "Après", value: "greater", type: "binary" },
        { name: "Entre", value: "between", type: "range" },
      ],
    },
    accessibility: {
      announcements: {
        onDragStart: ({ active }) => `Élément ${active.id} saisi`,
        onDragOver: ({ active, over }) =>
          over ? `Élément ${active.id} sur ${over.id}` : `Élément ${active.id} hors zone`,
        onDragEnd: ({ active, over }) =>
          over ? `Élément ${active.id} déposé sur ${over.id}` : `Élément ${active.id} déposé`,
        onDragCancel: ({ active }) => `Glissement annulé pour ${active.id}`,
      },
      instructions: {
        draggable: "Appuyez sur espace pour saisir. Utilisez les flèches pour déplacer.",
      },
    },
    initialQuery: {
      id: "root",
      combinator: "and",
      rules: [
        { id: "rule-1", field: "prenom", operator: "equal", value: "Pierre" },
        { id: "rule-2", field: "age", operator: "greater", value: 25 },
        { id: "rule-3", field: "actif", operator: "is_true" },
      ],
    },
    labels: {
      and: "ET",
      or: "OU",
      selectField: "Sélectionner le champ",
      selectOperator: "Sélectionner l'opérateur",
      from: "De",
      to: "à",
      addRule: "Ajouter une règle",
      addGroup: "Ajouter un groupe",
      remove: "Supprimer",
      clone: "Dupliquer",
      lock: "Verrouiller",
      unlock: "Déverrouiller",
      dateFormat: "jj/mm/aaaa",
    },
  },
};

interface LocalizationDemoProps {
  language: keyof typeof languages;
}

const LocalizationDemo = ({ language }: LocalizationDemoProps) => {
  const config = languages[language];
  const [query, setQuery] = useState<Query>(config.initialQuery);

  return (
    <div className="qb-container text-sm">
      <QueryBuilder value={query} onChange={setQuery}>
        <QueryBuilder.BuilderWithDnD
          fields={config.fields}
          operatorsByFieldType={config.operators}
          dragDropAccessibility={config.accessibility}
          renderRule={(props) => <Rule {...props} labels={config.labels} />}
          renderGroup={(props) => <Group {...props} rootId={query.id} labels={config.labels} />}
        />
      </QueryBuilder>
    </div>
  );
};

const meta: Meta<typeof LocalizationDemo> = {
  title: "Core/Localization (i18n)",
  component: LocalizationDemo,
  tags: ["autodocs"],
  argTypes: {
    language: {
      control: "select",
      options: ["spanish", "japanese", "french"],
      description: "Select language for localization",
    },
  },
  parameters: {
    layout: "padded",
    docs: {
      story: { inline: false, height: "400px" },
      description: {
        component: `
## Localization (i18n)

Full internationalization support. Pass translated text through props.

### Props for Localization

| Prop | What It Localizes |
|------|-------------------|
| \`fields\` | Field labels shown in dropdowns |
| \`operatorsByFieldType\` | Operator names for each field type |
| \`dragDropAccessibility\` | Screen reader announcements for drag & drop |
| \`renderRule\` | Placeholders, button labels in rules |
| \`renderGroup\` | Combinator labels (AND/OR), button labels in groups |

### Example

\`\`\`tsx
import { QueryBuilder, type Query, type Operator } from 'react-querybuilder-lite';

// 1. Translated field labels
const fields = [
  { label: "Nombre", value: "name", type: "string" },
  { label: "Edad", value: "age", type: "number" },
  { label: "Activo", value: "active", type: "boolean" },
];

// 2. Translated operator names
const operatorsByFieldType: Record<string, Operator[]> = {
  string: [
    { name: "Es igual a", value: "equal", type: "binary" },
    { name: "Contiene", value: "contains", type: "binary" },
    { name: "Está vacío", value: "is_empty", type: "unary" },
  ],
  number: [
    { name: "Mayor que", value: "greater", type: "binary" },
    { name: "Menor que", value: "less", type: "binary" },
    { name: "Entre", value: "between", type: "range" },
  ],
  boolean: [
    { name: "Es verdadero", value: "is_true", type: "unary" },
    { name: "Es falso", value: "is_false", type: "unary" },
  ],
};

// 3. Screen reader text (optional, for DnD accessibility)
const dragDropAccessibility = {
  // Announced during drag operations
  announcements: {
    onDragStart: ({ active }) => \`Elemento \${active.id} recogido\`,
    onDragOver: ({ active, over }) =>
      over ? \`Sobre \${over.id}\` : \`Fuera del área\`,
    onDragEnd: ({ active, over }) =>
      over ? \`Soltado sobre \${over.id}\` : \`Soltado\`,
    onDragCancel: ({ active }) => \`Cancelado\`,
  },
  // Read when a draggable item receives focus
  instructions: {
    draggable: "Presione espacio para recoger. Use las flechas para mover.",
  },
};

<QueryBuilder value={query} onChange={setQuery}>
  <QueryBuilder.BuilderWithDnD
    fields={fields}
    operatorsByFieldType={operatorsByFieldType}
    dragDropAccessibility={dragDropAccessibility}
    renderRule={({ rule, fields, operators, onChange, slots }) => (
      <div>
        <select value={rule.field} onChange={(e) => onChange({ field: e.target.value })}>
          <option value="">Seleccionar campo</option>
          {fields.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
        <select value={rule.operator} onChange={(e) => onChange({ operator: e.target.value })}>
          {operators.map((op) => <option key={op.value} value={op.value}>{op.name}</option>)}
        </select>
        <button onClick={slots.onRemove}>Eliminar</button>
      </div>
    )}
    renderGroup={({ group, children, onChange, slots }) => (
      <div>
        <select value={group.combinator} onChange={(e) => onChange({ combinator: e.target.value })}>
          <option value="and">Y</option>
          <option value="or">O</option>
        </select>
        <button onClick={slots.onAddRule}>Añadir Regla</button>
        <button onClick={slots.onAddGroup}>Añadir Grupo</button>
        {children}
      </div>
    )}
  />
</QueryBuilder>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LocalizationDemo>;

export const Demo: Story = {
  args: {
    language: "spanish",
  },
};
