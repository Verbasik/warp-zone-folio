import { useScrollyContext } from "./ScrollyContext";

/**
 * Sticky-обёртка для правой колонки. Рендерит компонент текущей
 * активной сцены, передавая ему progress; если активной сцены нет —
 * показывает нейтральный плейсхолдер в стиле сайта.
 *
 * Геометрия:
 *   - sticky top-24: прилипает чуть ниже фиксированной Navigation-
 *     панели (Navigation имеет фактическую высоту ~80px + запас).
 *   - max-w-[min(100%,calc(100vh-7rem))] + aspect-square:
 *     визуальное окно остаётся квадратным, но растягивается на всю
 *     правую колонку и ограничивается высотой viewport, чтобы не
 *     уходить под нижний край экрана.
 *   - rounded-none, чёткие 2px-границы primary/40 — чтобы стиль
 *     попадал в общий «терминал/неон/sci-fi» язык сайта (как
 *     border-2 border-primary/40 у figure в BlogPostRenderer).
 *
 * Сцены сами отвечают за внутренний viewBox/анимацию — Stage
 * лишь даёт им «холст» и доступ к контексту через SceneProps.
 */
export const SceneStage = () => {
  const { scenes, activeSceneId, progress } = useScrollyContext();
  const activeScene = scenes.find((s) => s.id === activeSceneId);
  const ActiveComponent = activeScene?.component;

  return (
    <div className="sticky top-24 flex justify-center">
      <div className="aspect-square w-full max-w-[min(100%,calc(100vh-7rem))] border-2 border-primary/40 bg-background/50 p-3 xl:p-4 relative overflow-hidden">
        {ActiveComponent ? (
          <ActiveComponent progress={progress} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-xs text-foreground/40 gap-2">
            <span className="text-primary/60">[ SCENE_IDLE ]</span>
            <span>Прокрутите статью, чтобы увидеть визуализацию</span>
          </div>
        )}

        {/* Debug-лейбл активной сцены — пригодится при отладке
            sync-механизма; в production-сборке его уберём
            отдельным шагом, после визуальной проверки. */}
        {activeScene?.label && (
          <div className="absolute top-2 right-2 font-mono text-[10px] text-primary/50 px-1.5 py-0.5 border border-primary/30 bg-background/80">
            {activeScene.label}
          </div>
        )}
      </div>
    </div>
  );
};
