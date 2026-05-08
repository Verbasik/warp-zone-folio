import { useMemo, type ReactNode } from "react";
import { useHeadingObserver } from "./useHeadingObserver";
import { useScrollProgress } from "./useScrollProgress";
import { ScrollyContext } from "./ScrollyContext";
import type { Scene, ScrollyContextValue } from "./types";

interface ScrollyProviderProps {
  /**
   * Реестр сцен для текущего поста. Порядок должен соответствовать
   * порядку появления заголовков-якорей в markdown.
   */
  scenes: Scene[];
  /**
   * Перезапускает heading observer, когда меняется ключ — например,
   * после асинхронной загрузки markdown по slug.
   */
  resetKey?: unknown;
  children: ReactNode;
}

/**
 * Провайдер scroll-driven визуализации. Объединяет два сигнала —
 * активный заголовок (через useHeadingObserver) и прогресс внутри
 * секции (через useScrollProgress) — в единый контекст, доступный
 * SceneStage и сценам.
 */
export const ScrollyProvider = ({
  scenes,
  resetKey,
  children,
}: ScrollyProviderProps) => {
  const sceneIds = useMemo(
    () => new Set(scenes.map((s) => s.id)),
    [scenes],
  );

  const sceneSelector = useMemo(
    () =>
      scenes
        .map((scene) => `[id="${scene.id.replace(/["\\]/g, "\\$&")}"]`)
        .join(", "),
    [scenes],
  );

  const observedId = useHeadingObserver({
    selector: sceneSelector || "h2[id], h3[id]",
    resetKey,
  });

  // Активной считаем только сцену, явно зарегистрированную в реестре.
  // Это защищает от попадания посторонних якорей из markdown,
  // для которых сцены не предусмотрены.
  const activeSceneId =
    observedId && sceneIds.has(observedId) ? observedId : null;

  const progress = useScrollProgress({
    activeId: activeSceneId,
    selector: sceneSelector || "h2[id], h3[id]",
    resetKey,
  });

  const value = useMemo<ScrollyContextValue>(
    () => ({
      scenes,
      activeSceneId,
      progress,
    }),
    [scenes, activeSceneId, progress],
  );

  return (
    <ScrollyContext.Provider value={value}>{children}</ScrollyContext.Provider>
  );
};
