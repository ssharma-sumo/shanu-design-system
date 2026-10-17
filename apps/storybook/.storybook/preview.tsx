import type { Preview } from "@storybook/react-vite";
import { ShanuThemeProvider } from "@shanu/theme";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Color scheme",
      toolbar: {
        title: "Theme",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    (Story, context) => {
      const mode = context.globals.theme === "dark" ? "dark" : "light";

      return (
        <ShanuThemeProvider key={mode} defaultMode={mode} enableCssBaseline>
          <Story />
        </ShanuThemeProvider>
      );
    },
  ],
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
