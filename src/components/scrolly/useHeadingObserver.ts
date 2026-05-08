import { useEffect, useState } from "react";

/**
 * Параметры хука useHeadingObserver.
 */
export interface UseHeadingObserverOptions {
  /**
   * CSS-селектор DOM-якорей, за которыми ведётся наблюдение.
   * По умолчанию — все h2/h3 c id внутри блога.
   */
  selector?: string;
  /**
   * rootMargin для IntersectionObserver. По умолчанию обрезает
   * верхние и нижние 40% viewport, оставляя «активную зону» 20%
   * посередине: заголовок считается активным, только пока его
   * top-edge находится в этой полосе.
   */
  rootMargin?: string;
  /**
   * Корневой контейнер. Если не указан — viewport.
   */
  rootRef?: React.RefObject<Element>;
  /**
   * Перезапускает наблюдатель при изменении этого значения. Нужно,
   * когда контент перерисовывается асинхронно (например, после
   * загрузки markdown по slug).
   */
  resetKey?: unknown;
}

const isInsideClosedDetails = (element: HTMLElement) =>
  element.closest("details:not([open])") !== null;

/**
 * Возвращает id якоря, который сейчас находится в активной зоне
 * viewport. Если активной зоны не достиг ни один якорь (например,
 * пользователь над первым заголовком) — возвращает null.
 *
 * Алгоритм:
 *   1. Подписываемся через IntersectionObserver на все заголовки,
 *      подходящие под selector.
 *   2. На каждое изменение/scroll пересчитываем якоря, чьи
 *      top-edge попадают в центральную 20% зону viewport/root.
 *   3. Активным считается якорь, чей top-edge ближе всего к
 *      центральной линии viewport/root.
 *
 * Хук намеренно не возвращает прогресс внутри шага — для этого
 * предусмотрен отдельный useScrollProgress, чтобы оба ответственных
 * за разные сигналы хука можно было использовать независимо.
 */
export const useHeadingObserver = ({
  selector = "h2[id], h3[id]",
  rootMargin = "-40% 0px -40% 0px",
  rootRef,
  resetKey,
}: UseHeadingObserverOptions = {}): string | null => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const root = rootRef?.current ?? null;
    const anchors = Array.from(
      (root ?? document).querySelectorAll<HTMLElement>(selector),
    );
    if (anchors.length === 0) return;

    let frame = 0;

    const updateActive = () => {
      const rootRect = root?.getBoundingClientRect();
      const top = rootRect?.top ?? 0;
      const height = rootRect?.height ?? window.innerHeight;
      const bandTop = top + height * 0.4;
      const bandBottom = top + height * 0.6;
      const activeLine = top + height / 2;

      let closest: HTMLElement | null = null;
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const anchor of anchors) {
        if (isInsideClosedDetails(anchor)) continue;

        const anchorTop = anchor.getBoundingClientRect().top;
        if (anchorTop < bandTop || anchorTop > bandBottom) continue;

        const distance = Math.abs(anchorTop - activeLine);
        if (
          distance < closestDistance ||
          (distance === closestDistance && closest && anchor.offsetTop < closest.offsetTop)
        ) {
          closest = anchor;
          closestDistance = distance;
        }
      }

      if (closest) setActiveId(closest.id);
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateActive();
      });
    };

    const observer = new IntersectionObserver(
      () => scheduleUpdate(),
      { root, rootMargin, threshold: 0 },
    );

    for (const anchor of anchors) observer.observe(anchor);
    updateActive();

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [selector, rootMargin, rootRef, resetKey]);

  return activeId;
};
