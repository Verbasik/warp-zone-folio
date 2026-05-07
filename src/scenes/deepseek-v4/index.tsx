import type { Scene } from "@/components/scrolly/types";
import { SceneArchOverview } from "./SceneArchOverview";
import { SceneContextScale } from "./SceneContextScale";

/**
 * Реестр сцен для поста deepseek-v4. После ревизии визуального
 * направления оставляем только первые две опорные сцены: intro и
 * overview Part I. Остальные разделы будут добавляться заново,
 * медленно и по одному, после адаптации визуального языка.
 *
 * id каждой сцены ОБЯЗАН совпадать с id, который BlogPostRenderer
 * выдаёт через slugify(текст заголовка). Несовпадение приводит
 * к тому, что ScrollyProvider никогда не активирует сцену — этот
 * случай специально логируется через debug-лейбл SceneStage.
 */

export const deepseekV4Scenes: Scene[] = [
  {
    id: "vvedenie",
    label: "Введение",
    component: SceneContextScale,
  },
  {
    id: "chast-i-arhitekturnye-innovacii",
    label: "Часть I",
    component: SceneArchOverview,
  },
];
