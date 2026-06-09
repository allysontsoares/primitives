import "@testing-library/jest-dom";
import "./vitest-axe-types";
import * as matchers from "vitest-axe/dist/matchers";
import { expect } from "vitest";

expect.extend(matchers);

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
