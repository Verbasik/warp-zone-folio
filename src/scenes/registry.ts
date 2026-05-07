import type { Scene } from "@/components/scrolly/types";
import { deepseekV4Scenes } from "./deepseek-v4";

/**
 * Маппинг slug поста на реестр сцен. BlogPost обращается сюда,
 * чтобы понять, нужна ли посту scroll-driven визуализация: если
 * для slug найден массив сцен — рендерится двухколоночный layout,
 * иначе — обычный single-column.
 *
 * Регистрация сцен — единственная точка интеграции нового поста
 * со scroll-driven движком. Сами сцены лежат в src/scenes/<slug>/
 * и не имеют циклических зависимостей с компонентами поста.
 */
export const sceneRegistry: Record<string, Scene[]> = {
  "deepseek-v4": deepseekV4Scenes,
};

export const getScenesForSlug = (slug: string): Scene[] | undefined =>
  sceneRegistry[slug];
