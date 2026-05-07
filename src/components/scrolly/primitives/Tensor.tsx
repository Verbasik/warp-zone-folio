import { motion } from "framer-motion";

export interface TensorProps {
  /** Координаты левого-нижнего-переднего угла. */
  origin: { x: number; y: number };
  /** Размеры тензора в SVG-юнитах. */
  width: number;
  height: number;
  depth: number;
  /**
   * Угол изометрической проекции в градусах. По умолчанию 25 —
   * мягче канонических 30, лучше читается на маленьких холстах.
   */
  isoAngle?: number;
  /**
   * Прогресс «сборки» 0..1: 0 — ничего не видно, 0.33 — только
   * передняя грань, 0.66 — добавлена верхняя, 1 — добавлена
   * боковая. Это нативное чтение «строится 3D-объект».
   */
  progress?: number;
  /** Цвет передней грани (самый яркий). */
  fillFront?: string;
  /** Цвет верхней грани (средняя яркость). */
  fillTop?: string;
  /** Цвет боковой грани (самый тёмный). */
  fillSide?: string;
  /** Цвет рёбер. */
  stroke?: string;
  /** Толщина рёбер. */
  strokeWidth?: number;
  /** Подпись над тензором. */
  label?: string;
}

const POLY = (points: Array<[number, number]>) =>
  points.map(([x, y]) => `${x},${y}`).join(" ");

/**
 * Псевдо-3D тензор в изометрической проекции через три
 * полигона (front / top / side). Используется для KV-кэша,
 * стопок embedding'ов, multi-head параллельных проекций.
 *
 * Геометрия рассчитывается так, чтобы origin указывал на
 * левый-нижний-передний угол объёма. Это удобно при
 * композиции с Matrix (которая «лежит» по такой же
 * математической конвенции «origin = top-left»), и при
 * выравнивании тензоров в ряд.
 *
 * Появление управляется progress: каждая грань появляется
 * на своём подынтервале и плавно фейдится через motion.polygon.
 * Лёгкое расщепление по времени даёт отчётливое ощущение
 * «строится объём», а не «появилась картинка».
 */
export const Tensor = ({
  origin,
  width,
  height,
  depth,
  isoAngle = 25,
  progress = 1,
  fillFront = "hsl(var(--primary))",
  fillTop = "hsl(var(--primary))",
  fillSide = "hsl(var(--primary))",
  stroke = "hsl(var(--primary))",
  strokeWidth = 1.25,
  label,
}: TensorProps) => {
  const rad = (isoAngle * Math.PI) / 180;
  const dx = depth * Math.cos(rad);
  const dy = depth * Math.sin(rad);

  const x = origin.x;
  const yBottom = origin.y;
  const yTop = origin.y - height;

  // Front face: прямоугольник width × height, передняя плоскость.
  const frontPoints: Array<[number, number]> = [
    [x, yTop],
    [x + width, yTop],
    [x + width, yBottom],
    [x, yBottom],
  ];

  // Top face: верхняя крышка, параллелограмм.
  const topPoints: Array<[number, number]> = [
    [x, yTop],
    [x + dx, yTop - dy],
    [x + width + dx, yTop - dy],
    [x + width, yTop],
  ];

  // Side face: правая боковая грань, параллелограмм.
  const sidePoints: Array<[number, number]> = [
    [x + width, yTop],
    [x + width + dx, yTop - dy],
    [x + width + dx, yBottom - dy],
    [x + width, yBottom],
  ];

  // Подынтервалы прогресса для трёх граней.
  const frontVisible = progress > 0;
  const topVisible = progress > 0.33;
  const sideVisible = progress > 0.66;

  const labelX = x + width / 2 + dx / 2;
  const labelY = yTop - dy - 12;

  return (
    <g>
      {label && (
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="12"
          fill="hsl(var(--foreground))"
          opacity="0.7"
        >
          {label}
        </text>
      )}
      <motion.polygon
        points={POLY(sidePoints)}
        fill={fillSide}
        fillOpacity="0.2"
        stroke={stroke}
        strokeOpacity="0.7"
        strokeWidth={strokeWidth}
        initial={false}
        animate={{ opacity: sideVisible ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
      <motion.polygon
        points={POLY(topPoints)}
        fill={fillTop}
        fillOpacity="0.3"
        stroke={stroke}
        strokeOpacity="0.7"
        strokeWidth={strokeWidth}
        initial={false}
        animate={{ opacity: topVisible ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
      <motion.polygon
        points={POLY(frontPoints)}
        fill={fillFront}
        fillOpacity="0.4"
        stroke={stroke}
        strokeOpacity="0.85"
        strokeWidth={strokeWidth}
        initial={false}
        animate={{ opacity: frontVisible ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
    </g>
  );
};
