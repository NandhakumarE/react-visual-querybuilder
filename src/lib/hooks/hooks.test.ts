import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import useQueryBuilder from "./useQueryBuilder";
import useQueryBuilderContext from "./useQueryBuilderContext";
import QueryBuilderContext from "../context/QueryBuilderContext";
import type { Query } from "../types";

const createQuery = (): Query => ({
  id: "root",
  combinator: "and",
  rules: [
    { id: "r1", field: "name", operator: "equal", value: "John" },
  ],
});

describe("useQueryBuilder", () => {
  it("should call onChange when addRule is called", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useQueryBuilder({ value: createQuery(), onChange })
    );

    result.current.addRule([]);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].rules.length).toBe(2);
  });

  it("should prevent adding group beyond maxDepth", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useQueryBuilder({ value: createQuery(), maxDepth: 1, onChange })
    );

    result.current.addGroup([]);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("should allow adding group within maxDepth", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useQueryBuilder({ value: createQuery(), maxDepth: 2, onChange })
    );

    result.current.addGroup([]);

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe("useQueryBuilderContext", () => {
  it("should throw error when used outside provider", () => {
    expect(() => {
      renderHook(() => useQueryBuilderContext());
    }).toThrow("useQueryBuilderContext must be used within a QueryBuilderProvider");
  });

  it("should return context value when used within provider", () => {
    const mockContextValue = {
      query: createQuery(),
      addRule: vi.fn(),
      addGroup: vi.fn(),
      updateRule: vi.fn(),
      updateGroup: vi.fn(),
      remove: vi.fn(),
      clone: vi.fn(),
      toggleLock: vi.fn(),
      move: vi.fn(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(QueryBuilderContext.Provider, { value: mockContextValue }, children);

    const { result } = renderHook(() => useQueryBuilderContext(), { wrapper });

    expect(result.current).toBe(mockContextValue);
  });
});
