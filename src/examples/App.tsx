import { useState } from "react";
import { QueryBuilder } from "../lib/components/QueryBuilder";
import type { Query } from "../lib/types";
import type { OperatorKey } from "../lib/types/common.types";

const value: Query = {
  id: "root",
  combinator: "and",
  rules: [
    {
      id: "rule-1",
      field: "firstName",
      operator: "equal",
      value: "John",
    },
  ],
};

function App() {
  const [query, setQuery] = useState<Query>(value);

  return (
    <QueryBuilder
      value={query}
      maxDepth={2}
      onChange={(newValue) => {
        console.log(newValue);
        setQuery(newValue);
      }}
    >
      <QueryBuilder.BuilderWithDnD
        fields={[
          { label: "First Name", value: "firstName", type: "string" },
          { label: "Last Name", value: "lastName", type: "string" },
          { label: "Age", value: "age", type: "number" },
        ]}
        renderRule={({
          rule,
          slots,
          onChange,
          fields,
          operators,
          selectedField,
        }) => (
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "0px 4px",
              }}
              {...slots.dragHandles.attributes}
              {...slots.dragHandles.listeners}
            >
              ||
            </span>
            <select
              value={rule.field || ""}
              onChange={(e) => onChange({ field: e.target.value })}
            >
              <option value="" disabled>
                Select field
              </option>
              {fields.map((field) => (
                <option key={field.value} value={field.value}>
                  {field.label}
                </option>
              ))}
            </select>

            <select
              value={rule.operator || ""}
              onChange={(e) =>
                onChange({ operator: e.target.value as OperatorKey })
              }
            >
              <option value="" disabled>
                Select operator
              </option>
              {operators.map((operator) => (
                <option key={operator.value} value={operator.value}>
                  {operator.name}
                </option>
              ))}
            </select>

            <input
              type={selectedField?.type === "number" ? "number" : "text"}
              value={(rule.value as string | number | undefined) || ""}
              onChange={(e) =>
                onChange({
                  value:
                    selectedField?.type === "number"
                      ? Number(e.target.value)
                      : e.target.value,
                })
              }
            />

            <button onClick={slots.onRemove}>Remove</button>
            <button onClick={slots.onClone}>Clone</button>
          </div>
        )}
        renderGroup={({ group, children, slots, onChange }) => (
          <div style={{ border: "1px solid black", padding: 8 }}>
            <div
              style={{
                marginBottom: "4px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "0px 4px",
                }}
                {...slots.dragHandles.attributes}
                {...slots.dragHandles.listeners}
              >
                ||
              </span>
              <select
                value={group.combinator}
                onChange={(e) =>
                  onChange({ combinator: e.target.value as "and" | "or" })
                }
              >
                <option value="and">AND</option>
                <option value="or">OR</option>
              </select>
              <button onClick={slots.onAddRule}>Add Rule</button>
              <button onClick={slots.onAddGroup}>Add Group</button>
              <button onClick={slots.onRemove}>Remove Group</button>
              <button onClick={slots.onClone}>Clone</button>
            </div>
            <div
              style={{
                marginLeft: 20,
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              {children}
            </div>
          </div>
        )}
      />
    </QueryBuilder>
  );
}

export default App;
