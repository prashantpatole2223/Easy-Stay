import { MapPin } from "lucide-react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const HotelLocation = ({
  address,
  location
}) => {
  const fullLocation = [
    location?.city,
    location?.state,
    location?.country
  ]
    .filter(Boolean)
    .join(", ");

  const latitude = location?.coordinates?.latitude;
  const longitude = location?.coordinates?.longitude;

  const hasCoordinates =
    latitude !== undefined &&
    latitude !== null &&
    longitude !== undefined &&
    longitude !== null;

  return (
    <section className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-[#1a1a1a]">
        Location
      </h2>

      <div className="mt-4 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e6f1fd] text-[#008cff]">
          <MapPin size={18} aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-[#1a1a1a]">
            {address || "Address not available"}
          </p>

          {fullLocation && (
            <p className="mt-1 text-sm text-[#4a4a4a]">
              {fullLocation}
            </p>
          )}
        </div>
      </div>

      {hasCoordinates && (
        <div className="relative isolate z-0 mt-5 overflow-hidden rounded-lg border border-[#e7e7e7]">
          <MapContainer
            center={[latitude, longitude]}
            zoom={15}
            scrollWheelZoom={false}
            className="h-64 w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker
              position={[latitude, longitude]}
              icon={markerIcon}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">
                    Hotel Location
                  </p>

                  {fullLocation && (
                    <p className="mt-1 text-gray-600">
                      {fullLocation}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      {!hasCoordinates && (
        <div className="mt-5 flex h-64 items-center justify-center rounded-lg bg-gray-100">
          <div className="text-center">
            <MapPin
              size={28}
              className="mx-auto text-gray-400"
              aria-hidden="true"
            />

            <p className="mt-2 text-sm text-[#4a4a4a]">
              Map unavailable
            </p>

            <p className="mt-1 text-xs text-[#9b9b9b]">
              Hotel coordinates are not available.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default HotelLocation;