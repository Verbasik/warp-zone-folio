import type { Scene } from "@/components/scrolly/types";
import { SceneCompressionVideo } from "./SceneCompressionVideo";
import { SceneHybridAttentionVideo } from "./SceneHybridAttentionVideo";

/**
 * Реестр сцен для поста deepseek-v4. Сцены привязаны к figure-якорям,
 * которые BlogPostRenderer создаёт из alt-текста markdown-картинок:
 * `![Figure 03](...)` превращается в <figure id="figure-03">.
 *
 * id каждой сцены ОБЯЗАН совпадать с id соответствующего figure.
 * Несовпадение приведёт к тому, что ScrollyProvider никогда не
 * активирует сцену.
 */

export const deepseekV4Scenes: Scene[] = [
  {
    id: "figure-01",
    label: "Figure 01",
    component: SceneHybridAttentionVideo,
  },
  {
    id: "figure-03",
    label: "Figure 03",
    component: SceneCompressionVideo,
  },
];
