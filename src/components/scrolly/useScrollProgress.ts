import { useEffect, useState } from "react";

interface UseScrollProgressOptions {
  /**
   * id текущего активного раздела. Прогресс считается от
   * момента, когда якорь раздела пересекает якорную
   * горизонтальную линию (anchorRatio * viewportHeight),
   * до момента, когда такую же линию пересекает следующий якорь.
   */
  activeId: string | null;
  /**
   * Селектор якорей, среди которых определяется «следующий
   * раздел». По умолчанию совпадает с useHeadingObserver,
   * чтобы оба хука согласовывались по DOM-узлам.
   */
  selector?: string;
  /**
   * Доля от верха viewport, в которой стоит «якорь прогресса».
   * 0.7 означает: progress = 0 в момент, когда верх якоря
   * находится на 70% высоты viewport (то есть только-только
   * показался снизу), и progress = 1 — когда такую же линию
   * пересекает следующий якорь. Это совпадает с тем, как
   * scrollytelling-сайты задают «начало» и «конец» сцены —
   * чтобы у пользователя не было «мёртвой зоны», в которой
   * сцена активна, но визуально пустая.
   */
  anchorRatio?: number;
  /**
   * Перезапуск при асинхронной загрузке контента (markdown
   * грузится fetch'ом, и DOM-узлы появляются позже).
   */
  resetKey?: unknown;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const isInsideClosedDetails = (element: HTMLElement) =>
  element.closest("details:not([open])") !== null;

/**
 * Возвращает прогресс 0..1 внутри активного раздела.
 *
 * Якорная модель прогресса:
 *   - в viewport проводится горизонтальная якорная линия
 *     y = anchorRatio * viewportHeight (по умолчанию 70%);
 *   - progress = 0 в момент, когда верх активного якоря
 *     совпадает с этой линией (т.е. только-только показался
 *     снизу при скролле вниз);
 *   - progress = 1 в момент, когда такую же линию пересекает
 *     ВЕРХ следующего якоря;
 *   - между — линейная интерполяция.
 *
 * Эта модель устраняет «мёртвую зону»: useHeadingObserver
 * активирует сцену, как только заголовок входит в центральные
 * 20% viewport, а прогресс к этому моменту уже успевает
 * накопить заметное значение. Иначе сцена активна, но
 * визуально пустая, потому что progress = 0 ещё держится.
 *
 * Почему через rAF, а не через scroll-event:
 *   - scroll-event срабатывает чаще, чем рендер, и без
 *     дросселирования вызовет каскад setState;
 *   - requestAnimationFrame синхронизирован с repaint, так
 *     что обновления визуально гладкие и не пропадают.
 *
 * Хук обновляет state только при изменении прогресса больше
 * чем на 0.005 — это ниже порога визуального восприятия и
 * предотвращает лишние ре-рендеры сцены.
 */
export const useScrollProgress = ({
  activeId,
  selector = "h2[id], h3[id]",
  anchorRatio = 0.7,
  resetKey,
}: UseScrollProgressOptions): number => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!activeId) {
      setProgress(0);
      return;
    }

    const active = document.getElementById(activeId);
    if (!active) {
      setProgress(0);
      return;
    }

    const anchors = Array.from(
      document.querySelectorAll<HTMLElement>(selector),
    ).filter((anchor) => !isInsideClosedDetails(anchor));
    const idx = anchors.indexOf(active);
    const next = idx >= 0 ? anchors[idx + 1] : undefined;

    let raf = 0;
    let last = -1;

    const measure = () => {
      raf = 0;
      const vh = window.innerHeight;
      const anchor = anchorRatio * vh;
      const activeTop = active.getBoundingClientRect().top;
      const nextTop = next ? next.getBoundingClientRect().top : null;

      if (nextTop === null || nextTop <= activeTop) {
        // Последний раздел: прогресс растёт по тому, как
        // активный якорь прошёл якорную линию относительно
        // своей высоты.
        const span = active.offsetHeight + 1;
        const p = clamp01((anchor - activeTop) / span);
        if (Math.abs(p - last) > 0.005) {
          last = p;
          setProgress(p);
        }
        return;
      }

      const denom = nextTop - activeTop;
      if (denom <= 0) {
        if (last !== 1) {
          last = 1;
          setProgress(1);
        }
        return;
      }
      // (anchor - activeTop) — сколько раздел уже прошёл
      // мимо якоря; (nextTop - activeTop) — полная длина
      // секции до следующего якоря.
      const p = clamp01((anchor - activeTop) / denom);
      if (Math.abs(p - last) > 0.005) {
        last = p;
        setProgress(p);
      }
    };

    const onScroll = () => {
      if (raf !== 0) return;
      raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf !== 0) cancelAnimationFrame(raf);
    };
  }, [activeId, selector, anchorRatio, resetKey]);

  return progress;
};
