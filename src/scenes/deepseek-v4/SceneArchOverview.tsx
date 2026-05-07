import { motion } from "framer-motion";
import { Annotation } from "@/components/scrolly/primitives/Annotation";
import { ArrowFlow } from "@/components/scrolly/primitives/ArrowFlow";
import type { SceneProps } from "@/components/scrolly/types";

/**
 * Сцена «Часть I: Архитектурные инновации».
 *
 * Текст раздела задаёт рамку: миллионный контекст получается не
 * brute force, а связанной цепочкой архитектурных решений. Поэтому
 * сцена работает как карта Part I: сначала показывает квадратичную
 * стену dense attention, затем раскрывает три места вмешательства
 * DeepSeek-V4 — hybrid attention, стабильные остаточные связи и
 * sparse FFN/MoE — и завершает численным эффектом из статьи.
 */

const phaseAt = (progress: number, start: number, end: number) =>
  progress <= start ? 0 : progress >= end ? 1 : (progress - start) / (end - start);

interface SystemBand {
  title: string;
  subtitle: string;
  items: string[];
  y: number;
  color: string;
  phase: [number, number];
}

const SYSTEM_BANDS: SystemBand[] = [
  {
    title: "HYBRID ATTENTION",
    subtitle: "CSA + HCA + SWA",
    items: ["CSA ×4 · top-k", "HCA ×128 · dense", "SWA 128 · local"],
    y: 150,
    color: "hsl(var(--primary))",
    phase: [0.22, 0.46],
  },
  {
    title: "STABLE DEPTH",
    subtitle: "mHC residual mixing",
    items: ["Birkhoff polytope", "Sinkhorn normalization"],
    y: 275,
    color: "hsl(var(--accent))",
    phase: [0.42, 0.64],
  },
  {
    title: "SPARSE FFN",
    subtitle: "DeepSeekMoE",
    items: ["6 active experts", "hash-routing warmup"],
    y: 400,
    color: "hsl(var(--primary))",
    phase: [0.58, 0.78],
  },
];

const STATS = [
  { value: "1M", label: "контекст" },
  { value: "27%", label: "FLOPs" },
  { value: "10%", label: "KV-cache" },
];

const denseCells = Array.from({ length: 11 }, (_, r) =>
  Array.from({ length: 11 }, (_, c) => ({ r, c, active: c <= r })),
).flat();

export const SceneArchOverview = ({ progress }: SceneProps) => {
  const denseProgress = phaseAt(progress, 0, 0.18);
  const routeProgress = phaseAt(progress, 0.14, 0.3);
  const metricsProgress = phaseAt(progress, 0.78, 0.94);
  const formulaProgress = phaseAt(progress, 0.9, 1);

  return (
    <svg viewBox="0 0 600 600" className="w-full h-full">
      <text
        x="300"
        y="48"
        textAnchor="middle"
        fontFamily="ui-monospace, SFMono-Regular, monospace"
        fontSize="16"
        fontWeight="700"
        fill="hsl(var(--primary))"
      >
        ЧАСТЬ I · АРХИТЕКТУРНОЕ ЯДРО
      </text>
      <text
        x="300"
        y="70"
        textAnchor="middle"
        fontFamily="ui-monospace, SFMono-Regular, monospace"
        fontSize="11"
        fill="hsl(var(--foreground))"
        opacity="0.58"
      >
        Миллион токенов как система согласованных замен
      </text>

      <motion.g
        initial={false}
        animate={{
          opacity: Math.max(0.25, denseProgress * (1 - routeProgress * 0.55)),
          x: -routeProgress * 8,
        }}
        transition={{ duration: 0.25 }}
      >
        <rect
          x="50"
          y="132"
          width="130"
          height="130"
          fill="hsl(var(--foreground))"
          fillOpacity="0.04"
          stroke="hsl(var(--foreground))"
          strokeOpacity="0.2"
        />
        {denseCells.map(({ r, c, active }) => (
          <rect
            key={`${r}-${c}`}
            x={62 + c * 10}
            y={145 + r * 10}
            width="8"
            height="8"
            fill={active ? "hsl(var(--foreground))" : "transparent"}
            fillOpacity={active ? 0.24 + denseProgress * 0.24 : 0}
            stroke="hsl(var(--foreground))"
            strokeOpacity={active ? 0.05 : 0.08}
          />
        ))}
        <text
          x="115"
          y="286"
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="11"
          fontWeight="700"
          fill="hsl(var(--foreground))"
          opacity="0.72"
        >
          DENSE ATTENTION
        </text>
        <text
          x="115"
          y="305"
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="10"
          fill="hsl(var(--foreground))"
          opacity="0.52"
        >
          1M → 10^12 пар
        </text>
      </motion.g>

      <ArrowFlow
        from={{ x: 188, y: 198 }}
        to={{ x: 238, y: 198 }}
        progress={routeProgress}
        color="hsl(var(--accent))"
        thickness={1.5}
        label="заменить"
      />

      <motion.g
        initial={false}
        animate={{ opacity: routeProgress }}
        transition={{ duration: 0.25 }}
      >
        <rect
          x="238"
          y="112"
          width="310"
          height="360"
          fill="hsl(var(--primary))"
          fillOpacity="0.035"
          stroke="hsl(var(--primary))"
          strokeOpacity="0.22"
          strokeDasharray="4 5"
        />
        <text
          x="393"
          y="132"
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="10"
          fill="hsl(var(--foreground))"
          opacity="0.55"
        >
          DeepSeek-V4 transformer layer
        </text>
      </motion.g>

      {SYSTEM_BANDS.map((band, index) => {
        const local = phaseAt(progress, band.phase[0], band.phase[1]);
        const itemWidth = band.items.length === 2 ? 116 : 84;
        return (
          <motion.g
            key={band.title}
            initial={false}
            animate={{ opacity: local, y: (1 - local) * 8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <rect
              x="260"
              y={band.y}
              width="266"
              height="78"
              fill={band.color}
              fillOpacity="0.08"
              stroke={band.color}
              strokeOpacity="0.62"
              strokeWidth="1.2"
            />
            <text
              x="276"
              y={band.y + 23}
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              fontSize="12"
              fontWeight="700"
              fill={band.color}
            >
              {band.title}
            </text>
            <text
              x="276"
              y={band.y + 42}
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              fontSize="10"
              fill="hsl(var(--foreground))"
              opacity="0.62"
            >
              {band.subtitle}
            </text>

            {band.items.map((item, itemIndex) => (
              <g key={item}>
                <rect
                  x={272 + itemIndex * itemWidth}
                  y={band.y + 52}
                  width={itemWidth - 8}
                  height="14"
                  fill="hsl(var(--background))"
                  fillOpacity="0.65"
                  stroke={band.color}
                  strokeOpacity="0.35"
                />
                <text
                  x={272 + itemIndex * itemWidth + itemWidth / 2 - 4}
                  y={band.y + 62}
                  textAnchor="middle"
                  fontFamily="ui-monospace, SFMono-Regular, monospace"
                  fontSize="7.5"
                  fill="hsl(var(--foreground))"
                  opacity="0.74"
                >
                  {item}
                </text>
              </g>
            ))}

            {index < SYSTEM_BANDS.length - 1 && (
              <ArrowFlow
                from={{ x: 393, y: band.y + 78 }}
                to={{ x: 393, y: SYSTEM_BANDS[index + 1].y }}
                progress={local}
                color={band.color}
                thickness={1}
                arrowHead={false}
              />
            )}
          </motion.g>
        );
      })}

      <motion.g
        initial={false}
        animate={{ opacity: metricsProgress, y: (1 - metricsProgress) * 8 }}
        transition={{ duration: 0.25 }}
      >
        {STATS.map((stat, index) => (
          <g key={stat.label}>
            <rect
              x={76 + index * 158}
              y="508"
              width="132"
              height="48"
              fill="hsl(var(--accent))"
              fillOpacity="0.09"
              stroke="hsl(var(--accent))"
              strokeOpacity="0.45"
            />
            <text
              x={142 + index * 158}
              y="531"
              textAnchor="middle"
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              fontSize="18"
              fontWeight="700"
              fill="hsl(var(--accent))"
            >
              {stat.value}
            </text>
            <text
              x={142 + index * 158}
              y="548"
              textAnchor="middle"
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              fontSize="9"
              fill="hsl(var(--foreground))"
              opacity="0.58"
            >
              {stat.label}
            </text>
          </g>
        ))}
      </motion.g>

      <Annotation
        x={300}
        y={568}
        width={500}
        height={30}
        anchor="middle"
        inline
        tex="O(n^2) \rightarrow O(n \cdot k),\quad k \ll n"
        visible={formulaProgress > 0}
        color="hsl(var(--foreground))"
      />
    </svg>
  );
};
