import { useMemo } from "react";
import { motion } from "framer-motion";
import katex from "katex";

export interface AnnotationProps {
  /** X-координата якоря в SVG-юнитах. */
  x: number;
  /** Y-координата якоря в SVG-юнитах. */
  y: number;
  /**
   * Размер foreignObject. Должен быть достаточным, чтобы вместить
   * формулу при typical KaTeX-метриках; перерасчёт по факту через
   * getBBox в SVG-foreignObject ненадёжен (Safari).
   */
  width?: number;
  height?: number;
  /** Выравнивание текста относительно (x, y). */
  anchor?: "start" | "middle" | "end";
  /** TeX-исходник формулы. Render mode — display (block-уровень). */
  tex: string;
  /** Inline-формат вместо display (компактнее). */
  inline?: boolean;
  /** Видимость аннотации; обычно завязывается на progress сцены. */
  visible?: boolean;
  /** Цвет текста. */
  color?: string;
}

/**
 * KaTeX-аннотация поверх SVG-сцены. Рендерится через
 * <foreignObject>, потому что KaTeX выдаёт сложный HTML с
 * подвешенными span'ами, реализовать который нативными
 * SVG-text-узлами невозможно.
 *
 * Известные ограничения foreignObject:
 *   - Safari может игнорировать transform у вложенного div'а в
 *     отдельных версиях, поэтому никаких scale/translate внутри —
 *     анимация только через opacity.
 *   - Размер foreignObject не подстраивается под содержимое.
 *     Поэтому передаются явные width/height; вызывающий код
 *     отвечает за «достаточность» бокса для конкретной формулы.
 *
 * Для anchor="middle"/"end" мы смещаем foreignObject влево, а
 * внутренний контейнер выравниваем CSS-justify-content. Это
 * проще, чем пытаться измерить ширину KaTeX-вывода.
 *
 * Стилевая интеграция: цвет HSL переменной --foreground, размер
 * шрифта определяется внешним SVG-окружением через стандартный
 * font-size наследование. KaTeX внутри использует свои метрики,
 * но переменная color прокидывается через инлайновый style.
 */
export const Annotation = ({
  x,
  y,
  width = 240,
  height = 60,
  anchor = "middle",
  tex,
  inline = false,
  visible = true,
  color = "hsl(var(--foreground))",
}: AnnotationProps) => {
  const html = useMemo(
    () =>
      katex.renderToString(tex, {
        displayMode: !inline,
        throwOnError: false,
        output: "html",
      }),
    [tex, inline],
  );

  const offsetX =
    anchor === "middle"
      ? x - width / 2
      : anchor === "end"
        ? x - width
        : x;

  const justify =
    anchor === "middle"
      ? "center"
      : anchor === "end"
        ? "flex-end"
        : "flex-start";

  return (
    <motion.foreignObject
      x={offsetX}
      y={y}
      width={width}
      height={height}
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ overflow: "visible", pointerEvents: "none" }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: justify,
          color,
          fontSize: 14,
        }}
        // KaTeX html — производный от tex и не содержит
        // пользовательского ввода. Source-of-truth — tex prop,
        // который указывает разработчик сцены.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </motion.foreignObject>
  );
};
