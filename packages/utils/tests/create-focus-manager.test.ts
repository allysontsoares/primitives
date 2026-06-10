import { createFocusManager } from "../src/focus/create-focus-manager";

describe("createFocusManager", () => {
  it("focuses next and previous elements", () => {
    const container = document.createElement("div");
    const a = document.createElement("input");
    const b = document.createElement("input");
    container.append(a, b);
    document.body.append(container);

    const manager = createFocusManager(() => container);
    a.focus();
    manager.focusNext();
    expect(document.activeElement).toBe(b);

    manager.focusPrevious();
    expect(document.activeElement).toBe(a);

    document.body.removeChild(container);
  });

  it("respects accept filter", () => {
    const container = document.createElement("div");
    const a = document.createElement("input");
    const trigger = document.createElement("button");
    trigger.id = "trigger";
    container.append(a, trigger);
    document.body.append(container);

    const manager = createFocusManager(() => container, {
      accept: (el) => el.id !== "trigger",
    });

    expect(manager.focusFirst()).toBe(a);
    expect(manager.focusLast()).toBe(a);

    document.body.removeChild(container);
  });
});
