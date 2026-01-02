import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

// vi.mock("*.module.css", () => ({
//   default: new Proxy(
//     {},
//     {
//       get: (_target, prop) => prop,
//     }
//   ),
// }));
