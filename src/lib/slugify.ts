/**
 * Минималистичный slugify для генерации стабильных id у заголовков
 * markdown-постов. Транслитерирует кириллицу в латиницу, чтобы id
 * можно было использовать в URL hash-ссылках и в JS-селекторах без
 * экранирования.
 *
 * Не покрывает все edge-cases (украинские/белорусские буквы, ё → e
 * вместо yo и т.п.) — расширяется по мере появления реальных кейсов.
 */

const TRANSLIT_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e",
  ж: "zh", з: "z", и: "i", й: "j", к: "k", л: "l", м: "m",
  н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

const transliterate = (input: string): string =>
  input
    .toLowerCase()
    .split("")
    .map((ch) => (ch in TRANSLIT_MAP ? TRANSLIT_MAP[ch] : ch))
    .join("");

export const slugify = (input: string): string =>
  transliterate(input)
    .replace(/[^a-z0-9\s-]+/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

/**
 * react-markdown отдаёт children заголовка как ReactNode (строка,
 * массив, элементы с inline-форматированием). Эта утилита извлекает
 * чистый текст для последующего slugify.
 */
export const extractText = (node: unknown): string => {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in (node as Record<string, unknown>)) {
    const props = (node as { props?: { children?: unknown } }).props;
    return extractText(props?.children);
  }
  return "";
};
