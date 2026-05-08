import type { ReactNode } from "react";

interface ScrollyLayoutProps {
  /**
   * Левая колонка — текст поста. Скроллится естественно вместе со
   * страницей и формирует «дорожку», по которой едет sticky-сцена.
   */
  text: ReactNode;
  /**
   * Правая колонка — sticky-обёртка со сценой визуализации. На
   * мобильных устройствах (<lg) скрывается, чтобы не ломать
   * читаемость текста на узком экране.
   */
  stage: ReactNode;
}

/**
 * Двухколоночный layout для постов со scroll-driven визуализацией.
 *
 * Поведение по брейкпоинтам:
 *   - <lg (мобильные/планшеты): рендерится только text. stage
 *     скрыт через display: none, потому что sticky-колонка слишком
 *     узка и визуализация теряет читаемость. На этом этапе мобильные
 *     читатели получают обычный текстовый пост.
 *   - >=lg: текстовая колонка центрируется относительно всей
 *     страницы, а stage становится правым overlay-слоем. Так
 *     визуализация не сдвигает основной текст влево.
 *
 * Layout сознательно не оборачивает stage в sticky сам — это
 * ответственность SceneStage. Здесь задаётся только геометрия:
 * центрированный текст и правая зона для визуализации.
 */
export const ScrollyLayout = ({ text, stage }: ScrollyLayoutProps) => {
  return (
    <div className="relative mx-auto w-full max-w-[min(118rem,calc(100vw-1rem))]">
      <div className="min-w-0 w-full max-w-[60rem] mx-auto">{text}</div>
      <div className="absolute inset-y-0 right-0 z-10 hidden lg:block w-[clamp(17rem,23vw,30rem)]">
        {stage}
      </div>
    </div>
  );
};
