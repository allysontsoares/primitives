import "@testing-library/jest-dom";
import { expect } from "vitest";
import { toHaveNoViolations } from "vitest-axe/matchers";

expect.extend({ toHaveNoViolations });

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}