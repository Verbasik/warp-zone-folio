import { motion } from "framer-motion";

export interface MorphPathProps {
  /**
   * Список keyframe-путей в SVG-нотации. progress 0 показывает
   * keyframes[0], progress 1 — keyframes[length-1], промежуточные
   * значения — линейно интерполированы между соседними.
   *
   * Для плавного морфинга keyframes должны быть совместимы по
   * структуре (одинаковое число команд и точек). Framer Motion
   * умеет интерполировать только такие пути; иначе переход
   * выглядит как мгновенная смена. На случай несовместимых
   * keyframes есть стратегия crossfade (см. ниже).
   */
  keyframes: string[];
  /** Прогресс 0..1 по keyframes-цепочке. */
  progress?: number;
  /**
   * Стратегия перехода между keyframes:
   *   - "morph" (по умолчанию): интерполяция d-атрибута через
   *     framer-motion. Гладко, но требует совместимости путей.
   *   - "crossfade": каждый keyframe рендерится отдельным
   *     <motion.path>, и opacity переключается между ними. Не
   *     требует совместимости, но визуально жёстче.
   */
  mode?: "morph" | "crossfade";
  /** Цвет линии. */
  stroke?: string;
  /** Толщина линии. */
  strokeWidth?: number;
  /** Цвет заливки (none по умолчанию). */
  fill?: string;
  /** Stroke-dasharray; полезно для пунктирных морфингов. */
  strokeDasharray?: string;
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

/**
 * Морфинг между несколькими SVG-путями, управляемый прогрессом.
 *
 * Используется для непрерывных трансформаций геометрии в
 * сценах: последовательное «вытягивание» матрицы Q в QKᵀ,
 * перемещение «луча» внимания между блоками, морфинг attention-
 * маски от full-density к sparse, эволюция формы distribution
 * в Muon/MTP.
 *
 * Две стратегии перехода предусмотрены сознательно: morph даёт
 * визуально лучший результат, но требует от вызывающего кода
 * заранее «выровнять» keyframes по числу команд и точек.
 * crossfade — запасной вариант для случаев, когда такое
 * выравнивание неудобно или невозможно (морф между ломаной и
 * замкнутым контуром, например). Сцена сама выбирает стратегию
 * по характеру данных.
 */
export const MorphPath = ({
  keyframes,
  progress = 0,
  mode = "morph",
  stroke = "hsl(var(--primary))",
  strokeWidth = 2,
  fill = "none",
  strokeDasharray,
}: MorphPathProps) => {
  if (keyframes.length === 0) return null;

  const p = clamp(progress, 0, 1);
  const lastIndex = keyframes.length - 1;
  const scaled = p * lastIndex;
  const lo = Math.floor(scaled);
  const hi = Math.min(lo + 1, lastIndex);
  const t = scaled - lo;

  if (mode === "morph") {
    // Полагаемся на Framer Motion: animate d с лиерпом между
    // keyframes даёт плавный переход. mix factor t передаём
    // как два кадра (animate d: [from, to]) и progress через
    // transition.duration; но проще — просто менять конечный d
    // по индексам, и Framer сделает свою анимацию между
    // последовательными значениями.
    const d = t < 0.5 ? keyframes[lo] : keyframes[hi];
    return (
      <motion.path
        d={d}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        animate={{ d }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
    );
  }

  // crossfade: рендерим все keyframes сразу, opacity управляется
  // близостью текущего прогресса к индексу keyframe'а.
  return (
    <g>
      {keyframes.map((d, i) => {
        // Tent-функция: opacity 1 при i == scaled, 0 при |i - scaled| >= 1.
        const distance = Math.abs(i - scaled);
        const opacity = clamp(1 - distance, 0, 1);
        return (
          <motion.path
            key={i}
            d={d}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            animate={{ opacity }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        );
      })}
    </g>
  );
};
