import { useRef, useState } from "react";
import {
  Building2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const Slide = ({ src, alt, FallbackIcon }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative h-full w-full shrink-0 snap-start bg-gray-100">
      {!failed && !loaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}

      {failed ? (
        <div className="flex h-full w-full items-center justify-center text-gray-400">
          <FallbackIcon size={40} aria-hidden="true" />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
};

const ImageSlider = ({
  images,
  alt = "Photo",
  className = "aspect-[4/3]",
  fallbackIcon: FallbackIcon = Building2
}) => {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  const urls = (Array.isArray(images) ? images : [])
    .map((img) => (typeof img === "string" ? img : img?.url))
    .filter(Boolean);

  const total = urls.length;

  if (total === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}
      >
        <FallbackIcon size={40} aria-hidden="true" />
        <span className="sr-only">No image available</span>
      </div>
    );
  }

  const handleScroll = () => {
    const el = trackRef.current;

    if (!el || !el.clientWidth) {
      return;
    }

    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  const goTo = (target) => {
    const el = trackRef.current;

    if (!el) {
      return;
    }

    const next = Math.max(0, Math.min(total - 1, target));

    el.scrollTo({
      left: next * el.clientWidth,
      behavior: "smooth"
    });
  };

  return (
    <div
      className={`group relative overflow-hidden bg-gray-100 ${className}`}
    >
      <style>{`.es-noscroll::-webkit-scrollbar{display:none}.es-noscroll{scrollbar-width:none;-ms-overflow-style:none}`}</style>

      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="es-noscroll flex h-full snap-x snap-mandatory overflow-x-auto"
      >
        {urls.map((url, i) => (
          <Slide
            key={`${url}-${i}`}
            src={url}
            alt={`${alt} - photo ${i + 1}`}
            FallbackIcon={FallbackIcon}
          />
        ))}
      </div>

      {total > 1 && (
        <>
          {index > 0 && (
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1a1a1a] opacity-100 shadow transition hover:bg-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          {index < total - 1 && (
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1a1a1a] opacity-100 shadow transition hover:bg-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronRight size={18} />
            </button>
          )}

          <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
            {index + 1}/{total}
          </span>

          {total <= 8 && (
            <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
              {urls.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageSlider; 