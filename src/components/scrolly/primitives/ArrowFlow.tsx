import { motion } from "framer-motion";
import { useId } from "react";

export interface ArrowFlowProps {
  /** Координаты начала стрелки. */
  from: { x: number; y: number };
  /** Координаты конца стрелки (без учёта arrowhead). */
  to: { x: number; y: number };
  /**
   * Кривизна 0..1. 0 — прямая линия, 1 — выраженная дуга.
   * Положительное значение прогибает дугу против часовой
   * стрелки относительно прямой from→to.
   */
  curve?: number;
  /**
   * Прогресс «прорисовки» 0..1. Реализован через
   * pathLength="1" + strokeDasharray=1, поэтому работает
   * без замеров DOM и одинаково ведёт себя на bezier и
   * прямых линиях.
   */
  progress?: number;
  /** Цвет линии и наконечника. */
  color?: string;
  /** Толщина линии. */
  thickness?: number;
  /** Показывать наконечник на конце. */
  arrowHead?: boolean;
  /**
   * Подпись посередине стрелки (опционально). Рендерится
   * горизонтально, чтобы оставаться читаемой; для математики
   * предпочтительнее использовать Annotation.
   */
  label?: string;
}

/**
 * Анимированная стрелка/связь между двумя точками SVG.
 *
 * Используется для отображения потока данных в сценах:
 *   - Q · Kᵀ → softmax;
 *   - входной токен → embedding → projection;
 *   - роутинг в MoE;
 *   - residual / hyperconnection между блоками.
 *
 * Технические детали:
 *   - прогрессивная отрисовка через pathLength="1" и
 *     strokeDasharray="1": pathLength нормализует длину пути
 *     к 1, и dashoffset от 1 до 0 даёт эффект «рисуется».
 *     Решение независимое от реальной длины пути и от того,
 *     прямая это или кривая.
 *   - кривая строится как quadratic bezier через одну
 *     control-точку, смещённую перпендикулярно прямой
 *     from→to на curve * |from→to| / 2. Это компромисс между
 *     контролем формы и числом параметров: достаточно для
 *     красивой связи, не требует управления второй
 *     контрольной точкой.
 *   - arrowhead через <marker> в <defs>. id маркера получается
 *     через useId, чтобы несколько ArrowFlow на одном холсте
 *     не путали свои наконечники.
 */
export const ArrowFlow = ({
  from,
  to,
  curve = 0,
  progress = 1,
  color = "hsl(var(--primary))",
  thickness = 2,
  arrowHead = true,
  label,
}: ArrowFlowProps) => {
  const reactId = useId().replace(/[^a-zA-Z0-9_-]/g, "-");
  const markerId = `arrow-${reactId}`;

  // Control point: середина from→to + перпендикулярное смещение.
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  // Перпендикуляр к (dx, dy) единичной длины — (-dy, dx)/len.
  const cx = mx + (-dy / len) * (curve * len) * 0.5;
  const cy = my + (dx / len) * (curve * len) * 0.5;

  const d = `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;

  return (
    <g>
      {arrowHead && (
        <defs>
          <marker
            id={markerId}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
          </marker>
        </defs>
      )}
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        markerEnd={arrowHead ? `url(#${markerId})` : undefined}
        initial={false}
        animate={{ strokeDashoffset: 1 - Math.max(0, Math.min(1, progress)) }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />
      {label && (
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="11"
          fill="hsl(var(--foreground))"
          opacity={progress > 0.5 ? 0.8 : 0}
          style={{ transition: "opacity 0.25s ease-out" }}
        >
          {label}
        </text>
      )}
    </g>
  );
};
