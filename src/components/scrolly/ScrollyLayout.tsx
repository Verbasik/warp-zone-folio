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
 *   - >=lg: grid из двух колонок. Левая колонка остаётся в
 *     комфортной текстовой ширине, а правая забирает всё доступное
 *     пространство под крупный sticky-холст. max-w-[100rem] даёт
 *     сцене заметно больше воздуха на широких экранах.
 *
 * Layout сознательно не оборачивает stage в sticky сам — это
 * ответственность SceneStage (следующий шаг). Так компонент
 * остаётся максимально предсказуемым: только сетка, ничего больше.
 */
export const ScrollyLayout = ({ text, stage }: ScrollyLayoutProps) => {
  return (
    <div className="mx-auto w-full max-w-[min(100rem,calc(100vw-2rem))] grid grid-cols-1 lg:grid-cols-[minmax(0,680px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,720px)_minmax(0,1fr)] lg:gap-10 xl:gap-12">
      <div className="min-w-0">{text}</div>
      <div className="hidden lg:block min-w-0 w-full">{stage}</div>
    </div>
  );
};
