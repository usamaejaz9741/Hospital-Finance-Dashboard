export type Theme = 'light' | 'dark' | 'auto';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
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

