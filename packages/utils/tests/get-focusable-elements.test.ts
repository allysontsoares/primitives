import { getFocusableElements } from "../src/focus/get-focusable-elements";

describe("getFocusableElements", () => {
  it("includes spinbutton and gridcell with tabindex 0", () => {
    const container = document.createElement("div");
    container.innerHTML = `
      <input role="spinbutton" tabindex="0" />
      <div role="gridcell" tabindex="0">1</div>
      <button disabled>no</button>
    `;
    document.body.append(container);

    const elements = getFocusableElements(container);
    expect(elements).toHaveLength(2);

    document.body.removeChild(container);
  });

  it("includes elements in opacity:0 overlay during positioning", () => {
    const container = document.createElement("div");
    container.style.opacity = "0";
    const btn = document.createElement("button");
    btn.textContent = "hidden";
    container.append(btn);
    document.body.append(container);

    expect(getFocusableElements(container)).toHaveLength(1);

    document.body.removeChild(container);
  });
});
