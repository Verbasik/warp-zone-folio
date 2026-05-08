import type { ComponentType } from "react";

/**
 * Описание одной сцены визуализации. Привязывается к id DOM-якоря
 * в посте. SceneStage рендерит компонент component, когда
 * activeSceneId === id.
 */
export interface Scene {
  /**
   * id DOM-якоря (как в DOM, после slugify).
   */
  id: string;
  /**
   * Человекочитаемая подпись сцены (для отладки и a11y).
   */
  label?: string;
  /**
   * React-компонент сцены. Получает SceneProps от SceneStage.
   */
  component: ComponentType<SceneProps>;
}

/**
 * Пропсы, которые SceneStage передаёт активной сцене.
 */
export interface SceneProps {
  /**
   * Прогресс 0..1 внутри текущей секции — доля скролла между
   * заголовком этой сцены и заголовком следующей. Поставляется
   * через useScrollProgress (см. ScrollyProvider).
   */
  progress: number;
}

/**
 * Контекст ScrollyProvider, доступный всем дочерним компонентам.
 */
export interface ScrollyContextValue {
  /**
   * Список зарегистрированных сцен в порядке появления в посте.
   */
  scenes: Scene[];
  /**
   * id активной сцены или null, если ни один заголовок не попал
   * в активную зону viewport.
   */
  activeSceneId: string | null;
  /**
   * Прогресс внутри активной секции, 0..1. Считается как доля
   * пройденного скролла от верха активного заголовка до верха
   * следующего; см. useScrollProgress.
   */
  progress: number;
}
