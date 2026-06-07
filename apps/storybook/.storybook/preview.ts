import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      source: { type: "dynamic" },
    },
  },
  options: {
    storySort: {
      order: ["DatePicker", ["Single", "Range", "Multiple", "Locales"]],
    },
  },
};

export default preview;