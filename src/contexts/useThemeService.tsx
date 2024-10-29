import { createContext, useContext, createEffect, createSignal, Accessor, JSX, onCleanup } from "solid-js";
import { ColorTheme } from "../types/theme";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/localStorageHelper";

interface ProviderProps {
  children: JSX.Element; // JSX.Element for Solid.js
}

export function createThemeServiceHook() {
  interface ContextValueProps {
    colorTheme: Accessor<ColorTheme>;
    toggleColorTheme: (theme: ColorTheme) => void;
    clear: () => void;
  }

  const Context = createContext<ContextValueProps>();

  function Provider(props: ProviderProps) {

    // Default color theme
    const DEFAULT_COLOR_THEME = ColorTheme.BLACK_AND_WHITE;

    // Create signal for colorTheme with default and localStorage integration
    const [colorTheme, setColorTheme] = createSignal<ColorTheme>(
      loadFromLocalStorage<ColorTheme>("colorTheme", DEFAULT_COLOR_THEME)
    );

    // Watch for changes and update localStorage accordingly
    createEffect(() => saveToLocalStorage("colorTheme", colorTheme()));

    const toggleColorTheme = (theme: ColorTheme) => {
      clear();
      setColorTheme(theme);
    }

    function clear() {
      document.body.classList.remove(
        ColorTheme.BLACK_AND_WHITE,
        ColorTheme.BLUE_AND_WHITE,
        ColorTheme.PINK_AND_TIFFANY,
        ColorTheme.GREENGRASS_AND_FLIRTMAROON,
        ColorTheme.GREENGRASS_AND_BLACK,
        ColorTheme.GOLD_AND_BLUE,
        ColorTheme.FORESTBLUE_AND_REDWOORD,
        ColorTheme.RED_MONOCHROMATIC,
        ColorTheme.PINKGLAMOUR_MONOCHROMATIC,
        ColorTheme.GREY_MONOCHROMATIC,
      );
    }

    const value: ContextValueProps = {
      colorTheme,
      toggleColorTheme,
      clear,
    };
    // Provide the context value to children components
    return <Context.Provider value={value}> {props.children} </Context.Provider>;
  }

  // Hook to consume the context
  function useThemeServiceContext() {
    const ctx = useContext(Context);
    if (!ctx) {
      throw new Error("useThemeContext must be used within a ThemeServiceProvider");
    }
    return ctx;
  }

  return {
    Provider,
    useThemeServiceContext,
  };
}

const { Provider, useThemeServiceContext } = createThemeServiceHook();
export { Provider as ThemeServiceProvider, useThemeServiceContext as useThemeService };
