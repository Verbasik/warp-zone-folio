import { motion } from "framer-motion";

export interface MatrixProps {
  /** Число строк. */
  rows: number;
  /** Число колонок. */
  cols: number;
  /** Размер квадратной ячейки в SVG-юнитах. */
  cellSize?: number;
  /** Промежуток между ячейками. */
  cellGap?: number;
  /** Координаты левого-верхнего угла матрицы. */
  origin?: { x: number; y: number };
  /**
   * Прогресс появления, 0..1. При 0 видно 0 ячеек, при 1 —
   * все. Появление идёт «слева-направо, сверху-вниз», что
   * естественно читается как заполнение матрицы.
   */
  progress?: number;
  /**
   * Заполнение ячеек. Цвет HSL переменной из tokens сайта,
   * чтобы matrix корректно перекрашивался под тему.
   */
  fill?: string;
  /** Цвет границы каждой ячейки. */
  stroke?: string;
  /** Толщина границы. */
  strokeWidth?: number;
  /**
   * Маска подсветки [rows][cols] — true означает, что ячейка
   * подсвечена (обычно ярче, чем базовая заливка). Полезно для
   * top-K выборки или диагональной маски attention.
   */
  highlight?: boolean[][];
  /** Цвет подсвеченной ячейки. */
  highlightFill?: string;
  /**
   * Опциональная подпись над матрицей (например, обозначение
   * Q, K, V, QK^T). Рендерится без KaTeX — для математики
   * используем Annotation primitive.
   */
  label?: string;
}

/**
 * Анимированная матрица из rows×cols квадратных ячеек.
 *
 * Появление ячеек управляется параметром progress: при 0
 * ячейки скрыты, при 1 — все полностью видны. Между этими
 * крайними значениями ячейки «зажигаются» по очереди в
 * порядке row-major.
 *
 * Используется как переиспользуемый строительный блок для
 * сцен attention, KV-кэша, экспертных таблиц и т.п. Сами
 * сцены композируют Matrix с ArrowFlow, Annotation и
 * другими примитивами; Matrix не знает ничего о контексте,
 * в котором её используют.
 */
export const Matrix = ({
  rows,
  cols,
  cellSize = 24,
  cellGap = 2,
  origin = { x: 0, y: 0 },
  progress = 1,
  fill = "hsl(var(--primary))",
  stroke = "hsl(var(--primary))",
  strokeWidth = 1,
  highlight,
  highlightFill = "hsl(var(--accent))",
  label,
}: MatrixProps) => {
  const total = rows * cols;
  const visibleCount = Math.round(progress * total);
  const step = cellSize + cellGap;
  const width = cols * step - cellGap;

  return (
    <g>
      {label && (
        <text
          x={origin.x + width / 2}
          y={origin.y - 8}
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="12"
          fill="hsl(var(--foreground))"
          opacity="0.7"
        >
          {label}
        </text>
      )}
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const index = r * cols + c;
          const visible = index < visibleCount;
          const isHi = highlight?.[r]?.[c] ?? false;
          return (
            <motion.rect
              key={`${r}-${c}`}
              x={origin.x + c * step}
              y={origin.y + r * step}
              width={cellSize}
              height={cellSize}
              fill={isHi ? highlightFill : fill}
              fillOpacity={isHi ? 0.85 : 0.35}
              stroke={stroke}
              strokeOpacity="0.7"
              strokeWidth={strokeWidth}
              initial={false}
              animate={{
                opacity: visible ? 1 : 0,
                scale: visible ? 1 : 0.6,
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{
                transformOrigin: `${origin.x + c * step + cellSize / 2}px ${
                  origin.y + r * step + cellSize / 2
                }px`,
              }}
            />
          );
        }),
      )}
    </g>
  );
};
