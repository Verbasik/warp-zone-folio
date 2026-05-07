import { motion } from "framer-motion";

export interface TokenStreamProps {
  /** Координаты левого-верхнего угла первого токена. */
  origin: { x: number; y: number };
  /** Последовательность строковых токенов. */
  tokens: string[];
  /** Опциональные id токенов, выводятся мелким шрифтом снизу. */
  ids?: Array<number | string>;
  /** Индексы подсвеченных токенов. */
  highlightIndices?: number[];
  /** Ширина одной ячейки. */
  cellWidth?: number;
  /** Высота одной ячейки. */
  cellHeight?: number;
  /** Зазор между ячейками. */
  gap?: number;
  /**
   * Прогресс появления, 0..1. Токены приходят слева направо
   * по мере роста progress, как если бы их «печатали».
   */
  progress?: number;
  /** Цвет рамки и текста. */
  color?: string;
  /** Цвет подсвеченных ячеек. */
  highlightColor?: string;
}

/**
 * Горизонтальная цепочка токенов в виде ряда прямоугольников
 * со строковыми надписями. Опционально под каждой ячейкой
 * выводится числовой id (как в референс-картинке статьи —
 * подписи 5299, 621, 481 и т.д. под токенами).
 *
 * Используется для:
 *   - входной последовательности (Введение, Часть I);
 *   - сжатых латентов CSA (KV-кэш с перекрытием);
 *   - активных блоков, отобранных Lightning Indexer;
 *   - параллельной генерации MTP.
 *
 * Поведение progress: появление слева направо, по одной ячейке
 * за такт. Это естественно читается как «приходят токены»,
 * без необходимости отдельной анимации typing-эффекта.
 */
export const TokenStream = ({
  origin,
  tokens,
  ids,
  highlightIndices,
  cellWidth = 56,
  cellHeight = 32,
  gap = 4,
  progress = 1,
  color = "hsl(var(--primary))",
  highlightColor = "hsl(var(--accent))",
}: TokenStreamProps) => {
  const total = tokens.length;
  const visibleCount = Math.round(progress * total);
  const highlightSet = new Set(highlightIndices ?? []);
  const step = cellWidth + gap;

  return (
    <g>
      {tokens.map((tok, i) => {
        const visible = i < visibleCount;
        const isHi = highlightSet.has(i);
        const x = origin.x + i * step;
        const cx = x + cellWidth / 2;
        const cy = origin.y + cellHeight / 2;
        const fillColor = isHi ? highlightColor : color;
        return (
          <motion.g
            key={`${i}-${tok}`}
            initial={false}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 4 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <rect
              x={x}
              y={origin.y}
              width={cellWidth}
              height={cellHeight}
              fill={fillColor}
              fillOpacity={isHi ? 0.3 : 0.1}
              stroke={fillColor}
              strokeOpacity={isHi ? 0.9 : 0.55}
              strokeWidth={1.25}
            />
            <text
              x={cx}
              y={cy + 4}
              textAnchor="middle"
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              fontSize="11"
              fill="hsl(var(--foreground))"
              opacity={isHi ? 0.95 : 0.8}
            >
              {tok}
            </text>
            {ids?.[i] !== undefined && (
              <text
                x={cx}
                y={origin.y + cellHeight + 12}
                textAnchor="middle"
                fontFamily="ui-monospace, SFMono-Regular, monospace"
                fontSize="9"
                fill="hsl(var(--foreground))"
                opacity="0.45"
              >
                {ids[i]}
              </text>
            )}
          </motion.g>
        );
      })}
    </g>
  );
};
