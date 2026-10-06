import {
  ChevronLeft,
  ChevronRight,
  X,
  BedDouble,
  Users,
  Check,
  Info,
  LoaderCircle
} from "lucide-react";
import { useEffect, useState } from "react";

import { getRoomDetails } from "../../services/roomService";

const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const formatPrice = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? priceFormatter.format(number)
    : "Not available";
};

// Presentational: main gallery image with skeleton and failure placeholder
const GalleryImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
        <BedDouble size={44} aria-hidden="true" />
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
};

const RoomDetailsModal = ({
  room,
  onClose,
  onSelectRoom
}) => {
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadRoomDetails = async () => {
      try {
        setLoading(true);
        setError("");
        setRoomDetails(null);
        setCurrentImage(0);

        const data = await getRoomDetails(room._id);

        if (!cancelled) {
          setRoomDetails(data.room);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error?.response?.data?.message ||
            "Failed to load room details."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadRoomDetails();

    return () => {
      cancelled = true;
    };
  }, [room._id]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose]);

  const images = roomDetails?.images || [];

  const nextImage = () => {
    if (images.length <= 1) return;

    setCurrentImage((previous) =>
      previous === images.length - 1
        ? 0
        : previous + 1
    );
  };

  const previousImage = () => {
    if (images.length <= 1) return;

    setCurrentImage((previous) =>
      previous === 0
        ? images.length - 1
        : previous - 1
    );
  };

  const handleSelectRoom = () => {
    onSelectRoom({
      ...room,
      ...roomDetails,
      availableRooms: room.availableRooms
    });
  };

  const amenities = roomDetails?.amenities || [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Room details"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:h-auto sm:max-h-[92vh] sm:rounded-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#e7e7e7] px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-[#1a1a1a]">
              {roomDetails?.name || room.name}
            </h2>

            {!loading && roomDetails && (
              <p className="mt-1 text-sm capitalize text-[#4a4a4a]">
                {roomDetails.bedType} · Up to{" "}
                {roomDetails.capacity} guests
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close room details"
            className="shrink-0 rounded-full p-2 text-[#4a4a4a] transition hover:bg-gray-100 hover:text-[#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff]"
          >
            <X size={21} />
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-80 flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-[#4a4a4a]">
              <LoaderCircle
                size={28}
                className="animate-spin text-[#008cff]"
              />

              <p className="text-sm">
                Loading room details...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-80 flex-1 items-center justify-center p-8">
            <div className="max-w-md text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fdecea] text-[#d0021b]">
                <Info size={26} aria-hidden="true" />
              </div>

              <h3 className="mt-4 font-semibold text-[#d0021b]">
                Unable to load room details
              </h3>

              <p className="mt-2 text-sm text-[#d0021b]">
                {error}
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-5 rounded-lg border border-[#008cff] bg-white px-5 py-2 text-sm font-semibold text-[#008cff] transition hover:bg-[#e6f1fd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff]"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
                {/* Gallery */}
                <div className="bg-[#f2f2f2] p-4">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-200">
                    {images.length > 0 ? (
                      <>
                        <GalleryImage
                          key={images[currentImage]?.url}
                          src={images[currentImage]?.url}
                          alt={roomDetails.name || "Room"}
                        />

                        {images.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={previousImage}
                              aria-label="Previous photo"
                              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1a1a1a] shadow transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff]"
                            >
                              <ChevronLeft size={20} />
                            </button>

                            <button
                              type="button"
                              onClick={nextImage}
                              aria-label="Next photo"
                              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1a1a1a] shadow transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff]"
                            >
                              <ChevronRight size={20} />
                            </button>

                            <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
                              {currentImage + 1} /{" "}
                              {images.length}
                            </div>

                            {images.length <= 8 && (
                              <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
                                {images.map((_, index) => (
                                  <span
                                    key={index}
                                    className={`h-1.5 rounded-full transition-all ${
                                      index === currentImage
                                        ? "w-4 bg-white"
                                        : "w-1.5 bg-white/60"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center text-gray-400">
                        <BedDouble
                          size={44}
                          aria-hidden="true"
                        />

                        <p className="mt-2 text-sm text-[#9b9b9b]">
                          No room images available
                        </p>
                      </div>
                    )}
                  </div>

                  {images.length > 1 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                      {images.map(
                        (image, index) => (
                          <button
                            key={
                              image.publicId ||
                              image.url ||
                              index
                            }
                            type="button"
                            onClick={() =>
                              setCurrentImage(index)
                            }
                            aria-label={`Show photo ${index + 1}`}
                            className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-gray-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] ${
                              currentImage === index
                                ? "border-[#008cff]"
                                : "border-transparent opacity-70 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={image.url}
                              alt={`${roomDetails.name} ${index + 1}`}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg font-semibold text-[#1a1a1a]">
                    {roomDetails.name}
                  </h3>

                  {roomDetails.description && (
                    <p className="mt-3 text-sm leading-6 text-[#4a4a4a]">
                      {roomDetails.description}
                    </p>
                  )}

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-[#e7e7e7] p-4">
                      <div className="flex items-center gap-2 text-[#4a4a4a]">
                        <BedDouble
                          size={18}
                          className="text-[#008cff]"
                          aria-hidden="true"
                        />

                        <span className="text-xs">
                          Bed Type
                        </span>
                      </div>

                      <p className="mt-2 text-sm font-semibold capitalize text-[#1a1a1a]">
                        {roomDetails.bedType ||
                          "Not specified"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#e7e7e7] p-4">
                      <div className="flex items-center gap-2 text-[#4a4a4a]">
                        <Users
                          size={18}
                          className="text-[#008cff]"
                          aria-hidden="true"
                        />

                        <span className="text-xs">
                          Capacity
                        </span>
                      </div>

                      <p className="mt-2 text-sm font-semibold text-[#1a1a1a]">
                        Up to{" "}
                        {roomDetails.capacity}{" "}
                        guests
                      </p>
                    </div>
                  </div>

                  {amenities.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-[#1a1a1a]">
                        Room amenities
                      </h4>

                      <div className="mt-3 space-y-3">
                        {amenities.map(
                          (amenity, index) => (
                            <div
                              key={
                                amenity.amenityId?._id ||
                                index
                              }
                            >
                              <div className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a]">
                                <Check
                                  size={16}
                                  className="shrink-0 text-[#1a7971]"
                                  aria-hidden="true"
                                />

                                <span>
                                  {amenity.amenityId
                                    ?.name || "Amenity"}
                                </span>
                              </div>

                              {amenity.subAmenities
                                ?.length > 0 && (
                                  <div className="ml-6 mt-2 flex flex-wrap gap-2">
                                    {amenity.subAmenities.map(
                                      (item, subIndex) => (
                                        <span
                                          key={subIndex}
                                          className="rounded-full bg-[#f2f2f2] px-3 py-1 text-xs text-[#4a4a4a]"
                                        >
                                          {item}
                                        </span>
                                      )
                                    )}
                                  </div>
                                )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {roomDetails.highlights?.length >
                    0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold text-[#1a1a1a]">
                          Highlights
                        </h4>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {roomDetails.highlights.map(
                            (highlight, index) => (
                              <span
                                key={index}
                                className="flex items-center gap-1 rounded-full bg-[#e6f4f1] px-3 py-1.5 text-xs font-medium text-[#1a7971]"
                              >
                                <Check
                                  size={12}
                                  aria-hidden="true"
                                />
                                {highlight}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex shrink-0 items-center justify-between gap-4 border-t border-[#e7e7e7] bg-white px-5 py-4">
              <div>
                <p className="text-xl font-bold text-[#1a1a1a]">
                  {formatPrice(roomDetails.price)}
                </p>

                <p className="text-xs text-[#9b9b9b]">
                  per room / night
                </p>

                <p className="mt-1 text-xs text-[#4a4a4a]">
                  {room.availableRooms}{" "}
                  {room.availableRooms === 1
                    ? "room"
                    : "rooms"}{" "}
                  available
                </p>
              </div>

              <button
                type="button"
                onClick={handleSelectRoom}
                disabled={
                  room.availableRooms <= 0
                }
                className="shrink-0 rounded-lg bg-gradient-to-r from-[#53b2fe] to-[#065af3] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-[#008cff] hover:to-[#0548c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
              >
                Select Room
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RoomDetailsModal;