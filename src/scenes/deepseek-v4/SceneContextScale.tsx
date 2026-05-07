import { motion } from "framer-motion";
import { ArrowFlow } from "@/components/scrolly/primitives/ArrowFlow";
import type { SceneProps } from "@/components/scrolly/types";

/**
 * Сцена «Контекстное окно: от 4K к 1M токенов».
 *
 * Вводная сцена работает как учебная доска: сначала слова становятся
 * токенами, затем активная строка attention-матрицы показывает, как
 * текущий токен сравнивается с предыдущими, после чего появляется
 * идея DeepSeek-V4 — читать длинную память через сжатые блоки и
 * локальный хвост, а не через всю O(n^2)-матрицу.
 */

const phaseAt = (progress: number, start: number, end: number) =>
  progress <= start ? 0 : progress >= end ? 1 : (progress - start) / (end - start);

const WORDS = ["модель", "читает", "очень", "длинный", "контекст", "без", "взрыва"];
const MATRIX_X = 108;
const MATRIX_Y = 128;
const CELL = 28;

const blocks = [
  { id: "b1", words: ["модель", "читает"], x: 88, selected: false },
  { id: "b2", words: ["очень", "длинный"], x: 214, selected: true },
  { id: "b3", words: ["контекст", "без"], x: 340, selected: true },
  { id: "tail", words: ["взрыва"], x: 466, selected: true },
];

const stats = [
  { value: "1M", label: "контекст", x: 142 },
  { value: "27%", label: "FLOPs", x: 300 },
  { value: "10%", label: "KV-cache", x: 458 },
];

const captions = [
  ["Текст превращается в токены.", "Каждый токен станет строкой и столбцом attention-матрицы."],
  ["Dense attention сравнивает новый токен со всеми предыдущими.", "Строка за строкой растёт матрица пар: это и есть O(n²)."],
  ["qₜ — запрос текущего токена.", "Он спрашивает: какие прошлые слова помогают понять меня сейчас?"],
  ["DeepSeek-V4 не читает миллион токенов как одну плоскую матрицу.", "Прошлое сначала собирается в компактные memory blocks."],
  ["Индексатор выбирает только нужные блоки.", "А ближайшие 128 токенов остаются плотными и несжатыми."],
];

export const SceneContextScale = ({ progress }: SceneProps) => {
  const wordsProgress = phaseAt(progress, 0, 0.12);
  const matrixProgress = phaseAt(progress, 0.08, 0.34);
  const queryProgress = phaseAt(progress, 0.26, 0.48);
  const blockProgress = phaseAt(progress, 0.4, 0.62);
  const selectProgress = phaseAt(progress, 0.54, 0.78);
  const resultProgress = phaseAt(progress, 0.7, 0.92);

  const scan = Math.min(0.999, matrixProgress) * WORDS.length;
  const activeRow = Math.min(WORDS.length - 1, Math.floor(scan));
  const rowReveal = scan - activeRow;
  const captionIndex =
    progress < 0.16 ? 0 : progress < 0.38 ? 1 : progress < 0.56 ? 2 : progress < 0.76 ? 3 : 4;

  return (
    <svg viewBox="0 0 600 600" className="w-full h-full">
      <text
        x="300"
        y="38"
        textAnchor="middle"
        fontFamily="ui-monospace, SFMono-Regular, monospace"
        fontSize="14"
        fontWeight="700"
        fill="hsl(var(--primary))"
      >
        КАК МОДЕЛЬ ЧИТАЕТ ДЛИННЫЙ КОНТЕКСТ
      </text>
      <text
        x="300"
        y="58"
        textAnchor="middle"
        fontFamily="ui-monospace, SFMono-Regular, monospace"
        fontSize="9"
        fill="hsl(var(--foreground))"
        opacity="0.55"
      >
        от сравнения слов к структурированному чтению памяти
      </text>

      <motion.g
        initial={false}
        animate={{ opacity: wordsProgress, y: (1 - wordsProgress) * 8 }}
        transition={{ duration: 0.25 }}
      >
        {WORDS.map((word, index) => (
          <g key={word}>
            <rect
              x={82 + index * 62}
              y="78"
              width="52"
              height="20"
              fill="hsl(var(--primary))"
              fillOpacity={index === activeRow ? 0.18 : 0.06}
              stroke="hsl(var(--primary))"
              strokeOpacity={index === activeRow ? 0.7 : 0.25}
            />
            <text
              x={108 + index * 62}
              y="92"
              textAnchor="middle"
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              fontSize="7.5"
              fill="hsl(var(--foreground))"
              opacity="0.72"
            >
              {word}
            </text>
          </g>
        ))}
      </motion.g>

      <motion.g
        initial={false}
        animate={{ opacity: Math.max(0.18, matrixProgress), x: (1 - matrixProgress) * -8 }}
        transition={{ duration: 0.25 }}
      >
        <text
          x="106"
          y="116"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="8"
          fontWeight="700"
          fill="hsl(var(--foreground))"
          opacity="0.55"
        >
          token × token сравнения
        </text>

        {WORDS.map((word, index) => (
          <g key={`col-${word}`}>
            <text
              x={MATRIX_X + index * CELL + CELL / 2}
              y="118"
              textAnchor="middle"
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              fontSize="6.5"
              fill="hsl(var(--foreground))"
              opacity={index <= activeRow ? 0.68 : 0.25}
            >
              k{index + 1}
            </text>
            <text
              x={MATRIX_X + index * CELL + CELL / 2}
              y="108"
              textAnchor="middle"
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              fontSize="5.6"
              fill="hsl(var(--foreground))"
              opacity={index <= activeRow ? 0.48 : 0.18}
            >
              {word.slice(0, 4)}
            </text>
          </g>
        ))}

        {WORDS.map((word, row) => (
          <g key={`row-${word}`}>
            <text
              x="96"
              y={MATRIX_Y + row * CELL + 18}
              textAnchor="end"
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              fontSize="7.2"
              fill={row === activeRow ? "hsl(var(--primary))" : "hsl(var(--foreground))"}
              opacity={row <= activeRow ? 0.78 : 0.24}
            >
              q{row + 1} {word.slice(0, 5)}
            </text>

            {WORDS.map((_, col) => {
              const isPast = row < activeRow && col <= row;
              const isCurrent = row === activeRow && col <= row;
              const reveal = isCurrent ? Number(col <= Math.floor(rowReveal * (row + 1))) : 0;
              const isLit = isPast || reveal > 0;
              const isFocus = isCurrent && col === Math.floor(rowReveal * (row + 1));

              return (
                <rect
                  key={`${row}-${col}`}
                  x={MATRIX_X + col * CELL}
                  y={MATRIX_Y + row * CELL}
                  width="22"
                  height="22"
                  fill={
                    isFocus
                      ? "hsl(var(--accent))"
                      : isLit
                        ? "hsl(var(--primary))"
                        : "transparent"
                  }
                  fillOpacity={isFocus ? 0.62 : isLit ? 0.22 : 0}
                  stroke={
                    isCurrent || col === activeRow
                      ? "hsl(var(--primary))"
                      : "hsl(var(--foreground))"
                  }
                  strokeOpacity={isCurrent || col === activeRow ? 0.66 : 0.16}
                  strokeWidth={isFocus ? 1.8 : 1}
                />
              );
            })}
          </g>
        ))}

        <text
          x="205"
          y="345"
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="15"
          fontWeight="700"
          fill="hsl(var(--foreground))"
          opacity="0.86"
        >
          O(n²)
        </text>
        <text
          x="205"
          y="362"
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="8"
          fill="hsl(var(--foreground))"
          opacity="0.52"
        >
          число сравнений растёт как площадь матрицы
        </text>
      </motion.g>

      <ArrowFlow
        from={{ x: 322, y: 240 }}
        to={{ x: 394, y: 206 }}
        progress={queryProgress}
        color="hsl(var(--accent))"
        thickness={1.3}
        label="текущий запрос"
      />

      <motion.g
        initial={false}
        animate={{ opacity: queryProgress, x: (1 - queryProgress) * 8 }}
        transition={{ duration: 0.25 }}
      >
        <rect
          x="394"
          y="140"
          width="152"
          height="124"
          fill="hsl(var(--background))"
          fillOpacity="0.78"
          stroke="hsl(var(--accent))"
          strokeOpacity="0.44"
        />
        <text
          x="470"
          y="164"
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="14"
          fontWeight="700"
          fill="hsl(var(--accent))"
        >
          qₜ
        </text>
        <text
          x="470"
          y="184"
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="8"
          fill="hsl(var(--foreground))"
          opacity="0.62"
        >
          запрос текущего слова
        </text>
        <text
          x="470"
          y="208"
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="8"
          fill="hsl(var(--foreground))"
          opacity="0.72"
        >
          «на что смотреть?»
        </text>
        <text
          x="470"
          y="236"
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="8"
          fill="hsl(var(--primary))"
          opacity="0.9"
        >
          score(qₜ, kᵢ)
        </text>
      </motion.g>

      <motion.g
        initial={false}
        animate={{ opacity: blockProgress, y: (1 - blockProgress) * 8 }}
        transition={{ duration: 0.25 }}
      >
        <text
          x="300"
          y="390"
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="9"
          fontWeight="700"
          fill="hsl(var(--accent))"
        >
          прошлые слова собираются в компактные memory blocks
        </text>
        {blocks.map((block) => (
          <g key={block.id}>
            <rect
              x={block.x}
              y="408"
              width="86"
              height="44"
              fill={block.id === "tail" ? "hsl(var(--primary))" : "hsl(var(--accent))"}
              fillOpacity={block.selected ? 0.14 : 0.06}
              stroke={block.id === "tail" ? "hsl(var(--primary))" : "hsl(var(--accent))"}
              strokeOpacity={block.selected ? 0.62 : 0.26}
            />
            <text
              x={block.x + 43}
              y="424"
              textAnchor="middle"
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              fontSize="8"
              fontWeight="700"
              fill={block.id === "tail" ? "hsl(var(--primary))" : "hsl(var(--accent))"}
            >
              {block.id === "tail" ? "local tail" : block.id}
            </text>
            {block.words.map((word, index) => (
              <text
                key={word}
                x={block.x + 43}
                y={438 + index * 10}
                textAnchor="middle"
                fontFamily="ui-monospace, SFMono-Regular, monospace"
                fontSize="7"
                fill="hsl(var(--foreground))"
                opacity="0.62"
              >
                {word}
              </text>
            ))}
            {block.selected && (
              <path
                d={`M${block.x + 43} 408 Q${block.x + 78} 332 470 264`}
                fill="none"
                stroke={block.id === "tail" ? "hsl(var(--primary))" : "hsl(var(--accent))"}
                strokeOpacity={0.12 + selectProgress * 0.4}
                strokeWidth="1.2"
              />
            )}
          </g>
        ))}
      </motion.g>

      <motion.g
        initial={false}
        animate={{ opacity: resultProgress, y: (1 - resultProgress) * 8 }}
        transition={{ duration: 0.25 }}
      >
        <rect
          x="70"
          y="468"
          width="460"
          height="42"
          fill="hsl(var(--background))"
          fillOpacity="0.72"
          stroke="hsl(var(--accent))"
          strokeOpacity="0.28"
        />
        <text
          x="300"
          y="493"
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="12"
          fontWeight="700"
          fill="hsl(var(--foreground))"
        >
          O(n²) → O(n / m + k)
        </text>
        {stats.map((stat) => (
          <g key={stat.label}>
            <text
              x={stat.x}
              y="536"
              textAnchor="middle"
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              fontSize="15"
              fontWeight="700"
              fill={stat.value === "27%" ? "hsl(var(--accent))" : "hsl(var(--primary))"}
            >
              {stat.value}
            </text>
            <text
              x={stat.x}
              y="551"
              textAnchor="middle"
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              fontSize="7.5"
              fill="hsl(var(--foreground))"
              opacity="0.56"
            >
              {stat.label}
            </text>
          </g>
        ))}
      </motion.g>

      <motion.g
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <rect
          x="46"
          y="548"
          width="508"
          height="42"
          fill="hsl(var(--foreground))"
          fillOpacity="0.035"
          stroke="hsl(var(--foreground))"
          strokeOpacity="0.14"
        />
        {captions[captionIndex].map((line, index) => (
          <text
            key={line}
            x="300"
            y={565 + index * 14}
            textAnchor="middle"
            fontFamily="ui-monospace, SFMono-Regular, monospace"
            fontSize="8.4"
            fill="hsl(var(--foreground))"
            opacity={index === 0 ? 0.82 : 0.62}
          >
            {line}
          </text>
        ))}
      </motion.g>
    </svg>
  );
};
