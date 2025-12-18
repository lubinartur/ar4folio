import * as React from "react";
import { motion } from "framer-motion";

type Aspect = "auto" | "16/9" | "16/10" | "4/3" | "1/1";

const aspectClass: Record<Exclude<Aspect, "auto">, string> = {
  "16/9": "aspect-[16/9]",
  "16/10": "aspect-[16/10]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
};

function resolveAssetSrc(src?: string) {
  if (!src) return "";
  const s = String(src);
  if (/^(https?:)?\/\//i.test(s) || s.startsWith("data:") || s.startsWith("blob:"))
    return s;

  // Support both root deploy ("/") and subpath deploys (Vite BASE_URL like "/ar4folio/").
  // - If src is already absolute ("/images/..."), keep it for root deploy.
  // - For subpath deploy, prefix BASE_URL unless src already contains it.
  const base = (((import.meta as any)?.env?.BASE_URL as string) || "/").trim() || "/";
  const baseWithSlash = base.endsWith("/") ? base : `${base}/`;
  const baseNoTrailing = baseWithSlash === "/" ? "/" : baseWithSlash.slice(0, -1);

  // Root deploy: just ensure leading slash.
  if (baseWithSlash === "/") return s.startsWith("/") ? s : `/${s}`;

  // Already includes base ("/ar4folio/...") -> keep.
  if (s.startsWith(baseWithSlash) || s.startsWith(baseNoTrailing + "/")) {
    return s.startsWith("/") ? s : `/${s}`;
  }

  // Absolute from domain root ("/images/...") -> prefix baseNoTrailing.
  if (s.startsWith("/")) return `${baseNoTrailing}${s}`.replace(/\/{2,}/g, "/");

  // Relative ("images/...") -> baseWithSlash + relative
  return `${baseWithSlash}${s}`.replace(/\/{2,}/g, "/");
}

type MediaProps = {
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  aspect?: Aspect;
  priority?: boolean;
};

export function Media({
  src,
  alt = "",
  className = "",
  imgClassName = "",
  aspect = "auto",
  priority = false,
}: MediaProps) {
  const resolvedSrc = resolveAssetSrc(src);
  const aspectCls = aspect === "auto" ? "" : aspectClass[aspect];
  // If caller uses absolute fill (e.g. "absolute inset-0"), do NOT enforce a fallback aspect.
  // Otherwise, provide a safe default to avoid zero-height wrappers.
  const shouldSkipFallbackAspect =
    className.includes("absolute") || className.includes("inset-0");
  const wrapperAspectCls = aspectCls || (shouldSkipFallbackAspect ? "" : "aspect-[16/10]");
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    setLoaded(false);
    setError(false);
    // IMPORTANT: SPA navigation + cache (304/memory cache) can skip state updates.
    // Use rAF so the node is in DOM and browser has updated `complete`.
    const raf = window.requestAnimationFrame(() => {
      const el = imgRef.current;
      if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
    });
    return () => window.cancelAnimationFrame(raf);
  }, [resolvedSrc]);

  React.useEffect(() => {
    if ((import.meta as any)?.env?.MODE !== "development") return;
    // eslint-disable-next-line no-console
    console.log("[Media]", {
      resolvedSrc,
      loaded,
      complete: imgRef.current?.complete,
      nw: imgRef.current?.naturalWidth,
    });
  }, [resolvedSrc, loaded]);

  if (!resolvedSrc) {
    if ((import.meta as any)?.env?.MODE === "development") {
      return (
        <div
          className={[
            "relative w-full",
            wrapperAspectCls || "aspect-[16/10]",
            "rounded-2xl border border-white/10 bg-white/[0.03]",
            className,
          ].join(" ")}
        >
          <div className="absolute inset-0 grid place-items-center text-xs font-mono text-white/50">
            Missing src
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div
      className={[
        // Outer wrapper: no overflow-hidden here (prevents Safari/Chrome paint issues with overflow+transform)
        "relative w-full",
        wrapperAspectCls,
        "isolate transform-gpu [transform:translateZ(0)] [backface-visibility:hidden]",
        className,
      ].join(" ")}
    >
      {/* Inner wrapper: overflow clipping lives here */}
      <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
        <img
          key={resolvedSrc}
          ref={imgRef}
          src={resolvedSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setError(true);
            setLoaded(true); // don't keep spinner forever
          }}
          className={[
            "absolute inset-0 w-full h-full object-cover block",
            "[transform:translateZ(0)] [backface-visibility:hidden] will-change-transform",
            imgClassName,
          ].join(" ")}
        />
      </div>

      {!loaded && (
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="w-7 h-7 rounded-full border border-white/20 border-t-white/60 animate-spin" />
        </div>
      )}

      {(import.meta as any)?.env?.MODE === "development" && error && (
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="max-w-[90%] rounded-xl border border-red-500/30 bg-black/60 px-3 py-2 text-[10px] font-mono text-red-200">
            <div className="text-red-300">Image failed to load</div>
            <div className="break-all opacity-90">{resolvedSrc}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export function MotionMedia(props: MediaProps & { motionStyle?: any }) {
  const {
    src,
    alt = "",
    className = "",
    imgClassName = "",
    aspect = "auto",
    priority = false,
    motionStyle,
  } = props;
  const resolvedSrc = resolveAssetSrc(src);
  const aspectCls = aspect === "auto" ? "" : aspectClass[aspect];
  const shouldSkipFallbackAspect =
    className.includes("absolute") || className.includes("inset-0");
  const wrapperAspectCls = aspectCls || (shouldSkipFallbackAspect ? "" : "aspect-[16/10]");
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    setLoaded(false);
    setError(false);
    const raf = window.requestAnimationFrame(() => {
      const el = imgRef.current;
      if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
    });
    return () => window.cancelAnimationFrame(raf);
  }, [resolvedSrc]);

  React.useEffect(() => {
    if ((import.meta as any)?.env?.MODE !== "development") return;
    // eslint-disable-next-line no-console
    console.log("[MotionMedia]", {
      resolvedSrc,
      loaded,
      complete: imgRef.current?.complete,
      nw: imgRef.current?.naturalWidth,
    });
  }, [resolvedSrc, loaded]);

  if (!resolvedSrc) {
    if ((import.meta as any)?.env?.MODE === "development") {
      return (
        <div
          className={[
            "relative w-full",
            wrapperAspectCls || "aspect-[16/10]",
            "rounded-2xl border border-white/10 bg-white/[0.03]",
            className,
          ].join(" ")}
        >
          <div className="absolute inset-0 grid place-items-center text-xs font-mono text-white/50">
            Missing src
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div
      className={[
        "relative w-full",
        wrapperAspectCls,
        "isolate transform-gpu [transform:translateZ(0)] [backface-visibility:hidden]",
        className,
      ].join(" ")}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
        <motion.img
          key={resolvedSrc}
          src={resolvedSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={imgRef as any}
          style={{ ...(motionStyle || {}) }}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setError(true);
            setLoaded(true);
          }}
          className={[
            "absolute inset-0 w-full h-full object-cover block",
            "[transform:translateZ(0)] [backface-visibility:hidden] will-change-transform",
            imgClassName,
          ].join(" ")}
        />
      </div>

      {!loaded && (
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="w-7 h-7 rounded-full border border-white/20 border-t-white/60 animate-spin" />
        </div>
      )}

      {(import.meta as any)?.env?.MODE === "development" && error && (
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="max-w-[90%] rounded-xl border border-red-500/30 bg-black/60 px-3 py-2 text-[10px] font-mono text-red-200">
            <div className="text-red-300">Image failed to load</div>
            <div className="break-all opacity-90">{resolvedSrc}</div>
          </div>
        </div>
      )}
    </div>
  );
}

