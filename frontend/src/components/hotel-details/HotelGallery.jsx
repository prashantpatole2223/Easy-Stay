import { useEffect, useState } from "react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Images,
  X
} from "lucide-react";

const Tile = ({ src, alt, label, onClick, children }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group relative block h-full w-full overflow-hidden bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#008cff]"
    >
      {!loaded && !failed && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}

      {failed ? (
        <div className="flex h-full w-full items-center justify-center text-gray-400">
          <Building2 size={40} aria-hidden="true" />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {children}
    </button>
  );
};

const thumbLayouts = {
  1: "grid-cols-1 grid-rows-1",
  2: "grid-cols-1 grid-rows-2",
  3: "grid-cols-2 grid-rows-2",
  4: "grid-cols-2 grid-rows-2"
};

const HotelGallery = ({ images = [] }) => {
  // Local UI state only: which photo is open in the lightbox
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const imageUrls = (Array.isArray(images) ? images : [])
    .map((image) => image?.url)
    .filter(Boolean);

  const total = imageUrls.length;
  const isOpen = lightboxIndex !== null;

  useEffect(() => {
    if (!isOpen || total === 0) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setLightboxIndex(null);
      } else if (event.key === "ArrowRight") {
        setLightboxIndex((current) =>
          current === null ? current : (current + 1) % total
        );
      } else if (event.key === "ArrowLeft") {
        setLightboxIndex((current) =>
          current === null
            ? current
            : (current - 1 + total) % total
        );
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen, total]);

  if (!total) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-gray-100 text-gray-400 sm:h-80 md:h-96">
        <Building2 size={44} aria-hidden="true" />
        <p className="mt-2 text-sm text-[#9b9b9b]">
          No images available
        </p>
      </div>
    );
  }

  const thumbs = imageUrls.slice(1, 5);
  const extra = total - 5;

  const showPrev = () =>
    setLightboxIndex((current) =>
      current === null
        ? current
        : (current - 1 + total) % total
    );

  const showNext = () =>
    setLightboxIndex((current) =>
      current === null ? current : (current + 1) % total
    );

  return (
    <>
      <div className="relative overflow-hidden rounded-xl border border-[#e7e7e7] bg-white shadow-sm">
        <div
          className={`grid h-64 gap-2 sm:h-80 md:h-96 ${
            total > 1 ? "md:grid-cols-2" : "grid-cols-1"
          }`}
        >
          <div className="h-full min-h-0">
            <Tile
              src={imageUrls[0]}
              alt="Hotel"
              label="Open photo gallery"
              onClick={() => setLightboxIndex(0)}
            />
          </div>

          {thumbs.length > 0 && (
            <div
              className={`hidden min-h-0 gap-2 md:grid ${
                thumbLayouts[thumbs.length]
              }`}
            >
              {thumbs.map((image, index) => (
                <div
                  key={index}
                  className={`min-h-0 ${
                    thumbs.length === 3 && index === 0
                      ? "col-span-2"
                      : ""
                  }`}
                >
                  <Tile
                    src={image}
                    alt={`Hotel ${index + 2}`}
                    label={`Open photo ${index + 2}`}
                    onClick={() =>
                      setLightboxIndex(index + 1)
                    }
                  >
                    {index === 3 && extra > 0 && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-base font-semibold text-white">
                        +{extra} photos
                      </span>
                    )}
                  </Tile>
                </div>
              ))}
            </div>
          )}
        </div>

        {total > 1 && (
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#1a1a1a] shadow transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff]"
          >
            <Images size={15} aria-hidden="true" />
            View all {total} photos
          </button>
        )}
      </div>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Hotel photos"
          className="fixed inset-0 z-50 flex flex-col bg-black/90"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top bar */}
          <div
            className="flex shrink-0 items-center justify-between px-4 py-3 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-sm font-medium">
              {lightboxIndex + 1} / {total}
            </span>

            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close gallery"
              className="rounded-full p-2 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X size={22} />
            </button>
          </div>

          {/* Main image */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4">
            <img
              key={lightboxIndex}
              src={imageUrls[lightboxIndex]}
              alt={`Hotel photo ${lightboxIndex + 1}`}
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
              className="max-h-full max-w-full rounded-lg object-contain"
            />

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrev();
                  }}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1a1a1a] shadow transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff]"
                >
                  <ChevronLeft size={22} />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showNext();
                  }}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1a1a1a] shadow transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff]"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {total > 1 && (
            <div
              className="flex shrink-0 gap-2 overflow-x-auto px-4 py-3"
              onClick={(e) => e.stopPropagation()}
            >
              {imageUrls.map((url, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`Show photo ${index + 1}`}
                  aria-current={index === lightboxIndex}
                  className={`h-14 w-20 shrink-0 overflow-hidden rounded-md bg-gray-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    index === lightboxIndex
                      ? "opacity-100 ring-2 ring-white"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={url}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default HotelGallery;