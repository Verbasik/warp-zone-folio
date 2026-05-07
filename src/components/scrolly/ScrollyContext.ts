import { createContext, useContext } from "react";
import type { ScrollyContextValue } from "./types";

/**
 * React-контекст scroll-driven движка. Хранится отдельно от
 * провайдера-компонента, чтобы не ломать Vite Fast Refresh
 * (правило react-refresh/only-export-components).
 */
export const ScrollyContext = createContext<ScrollyContextValue | null>(null);

/**
 * Хук для доступа к контексту ScrollyProvider. Бросает понятную
 * ошибку при использовании вне провайдера, чтобы сразу ловить
 * неправильную композицию компонентов.
 */
export const useScrollyContext = (): ScrollyContextValue => {
  const ctx = useContext(ScrollyContext);
  if (!ctx) {
    throw new Error(
      "useScrollyContext must be used within <ScrollyProvider>",
    );
  }
  return ctx;
};
