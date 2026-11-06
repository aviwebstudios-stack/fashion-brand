import { useState } from "react";
import { useContentStore } from "../../store/contentStore";

/** Local copies of the admin media slots, shipped in /public/media-originals. */
export const localMedia = (file: string) => `/media-originals/${file}`;
/** Wrapper position: keep a caller-supplied absolute/fixed, otherwise relative. */
const wrapperPosition = (className: string) => (/\b(absolute|fixed)\b/.test(className) ? "" : "relative ");

export const localPoster = (file: string) => `/media-originals/posters/${file}.jpg`;

interface ContentImageProps {
  contentKey: string;
  /** Filename in /public/media-originals, e.g. "home-bridals.webp". */
  file: string;
  alt: string;
  /** Classes for the wrapper: size and position. */
  className?: string;
  /** Extra classes for the <img> elements, e.g. hover scale. */
  imgClassName?: string;
  /** Above-the-fold images load eagerly; everything else is lazy. */
  eager?: boolean;
}

/**
 * Shows the local file straight away. If the admin has set a different file,
 * it loads on top and fades in once it has fully loaded. If it fails, the
 * local file stays.
 */
export function ContentImage({ contentKey, file, alt, className = "", imgClassName = "", eager = false }: ContentImageProps) {
  const remote = useContentStore((s) => s.content?.[contentKey]);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const local = localMedia(file);
  const showRemote = remote && remote !== local && failedSrc !== remote;
  const loading = eager ? "eager" : "lazy";
  const imgBase = `absolute inset-0 h-full w-full object-cover ${imgClassName}`;

  return (
    <span className={`${wrapperPosition(className)}block overflow-hidden ${className}`}>
      <img src={local} alt={alt} loading={loading} decoding="async" className={imgBase} />
      {showRemote && (
        <img
          key={remote}
          src={remote}
          alt=""
          aria-hidden="true"
          loading={loading}
          decoding="async"
          onLoad={() => setLoadedSrc(remote)}
          onError={() => setFailedSrc(remote)}
          className={`media-swap ${imgBase} ${loadedSrc === remote ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </span>
  );
}

interface ContentVideoProps {
  contentKey: string;
  /** Base name in /public/media-originals, without extension, e.g. "home-hero". */
  file: string;
  className?: string;
}

/**
 * Shows a local poster frame first. Once the content request has finished,
 * plays the admin's video (or the local copy if none is set or it fails) and
 * fades it in when the first frame is ready. Only one video is downloaded.
 */
export function ContentVideo({ contentKey, file, className = "" }: ContentVideoProps) {
  const ready = useContentStore((s) => s.ready);
  const remote = useContentStore((s) => s.content?.[contentKey]);
  const [remoteFailed, setRemoteFailed] = useState(false);
  const [playingSrc, setPlayingSrc] = useState<string | null>(null);
  const local = localMedia(`${file}.mp4`);
  const poster = localPoster(file);
  const src = ready ? (remote && !remoteFailed ? remote : local) : null;

  return (
    <span className={`${wrapperPosition(className)}block overflow-hidden ${className}`}>
      <img src={poster} alt="" aria-hidden="true" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      {src && (
        <video
          key={src}
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onPlaying={() => setPlayingSrc(src)}
          onError={() => {
            if (src !== local) setRemoteFailed(true);
          }}
          className={`media-swap absolute inset-0 h-full w-full object-cover ${playingSrc === src ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </span>
  );
}
