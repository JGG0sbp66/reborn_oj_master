// src/global.d.ts
export { };

declare global {
  interface Window {
    turnstile: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          theme?: 'light' | 'dark' | 'auto';
          callback?: (token: string) => void;
          'error-callback'?: () => void;
        }
      ) => void;
      reset: (container?: string | HTMLElement) => void;
    };
  }
}