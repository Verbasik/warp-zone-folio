import type { SceneProps } from "@/components/scrolly/types";

const VIDEO_SRC = "/warp-zone-folio/blog/deepseek-v4/Scene/Scene-01.mp4";

export const SceneHybridAttentionVideo = ({ progress }: SceneProps) => {
  const opacity = Math.min(1, Math.max(0.35, progress * 1.6));

  return (
    <div
      className="w-full h-full flex flex-col bg-background/70"
      style={{ opacity }}
    >
      <div className="shrink-0 px-4 pt-4 pb-3 border-b border-primary/25 text-center">
        <div className="font-mono text-[10px] text-primary/70 mb-1">
          FIGURE 01 · SCENE-01
        </div>
        <div className="font-mono text-sm font-bold text-primary leading-tight">
          ГИБРИДНОЕ ВНИМАНИЕ: CSA + HCA
        </div>
      </div>

      <div className="min-h-0 flex-1 flex items-center justify-center p-3">
        <video
          className="max-h-full max-w-full border border-primary/35 bg-black"
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          controls
        >
          Ваш браузер не поддерживает воспроизведение видео.
        </video>
      </div>
    </div>
  );
};
