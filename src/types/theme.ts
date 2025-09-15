export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  border: string;
  accent: string;
}

