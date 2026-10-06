import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Trash2,
  MapPin,
  Wifi,
  Check
} from "lucide-react";

const CreateHotel = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [amenitiesLoading, setAmenitiesLoading] = useState(true);
  const [error, setError] = useState("");

  // Available hotel amenities from database
  const [availableAmenities, setAvailableAmenities] = useState([]);

  // Selected amenities
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Hotel highlights
  const [highlights, setHighlights] = useState([]);

  // Image files
  const [images, setImages] = useState([]);

  // Hotel form
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    country: "",
    latitude: "",
    longitude: ""
  });

  // --------------------------------------------------
  // Fetch hotel amenities
  // --------------------------------------------------

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      const response = await api.get("/hotels/amenities");

      setAvailableAmenities(response.data.amenities || []);
    } catch (error) {
      console.error("Failed to fetch amenities:", error);

      setError("Unable to load hotel amenities.");
    } finally {
      setAmenitiesLoading(false);
    }
  };

  // --------------------------------------------------
  // Form change
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // --------------------------------------------------
  // Amenity selection
  // --------------------------------------------------

  const toggleAmenity = (amenityId) => {
    setSelectedAmenities((prev) => {
      const exists = prev.find(
        (item) => item.amenityId === amenityId
      );

      if (exists) {
        return prev.filter(
          (item) => item.amenityId !== amenityId
        );
      }

      return [
        ...prev,
        {
          amenityId,
          subAmenities: []
        }
      ];
    });
  };

  const isAmenitySelected = (amenityId) => {
    return selectedAmenities.some(
      (item) => item.amenityId === amenityId
    );
  };

  // --------------------------------------------------
  // Sub amenities
  // --------------------------------------------------

  const addSubAmenity = (amenityId) => {
    setSelectedAmenities((prev) =>
      prev.map((item) =>
        item.amenityId === amenityId
          ? {
              ...item,
              subAmenities: [
                ...item.subAmenities,
                ""
              ]
            }
          : item
      )
    );
  };

  const updateSubAmenity = (
    amenityId,
    index,
    value
  ) => {
    setSelectedAmenities((prev) =>
      prev.map((item) => {
        if (item.amenityId !== amenityId) {
          return item;
        }

        const updated = [...item.subAmenities];

        updated[index] = value;

        return {
          ...item,
          subAmenities: updated
        };
      })
    );
  };

  const removeSubAmenity = (
    amenityId,
    index
  ) => {
    setSelectedAmenities((prev) =>
      prev.map((item) => {
        if (item.amenityId !== amenityId) {
          return item;
        }

        return {
          ...item,
          subAmenities: item.subAmenities.filter(
            (_, i) => i !== index
          )
        };
      })
    );
  };

  // --------------------------------------------------
  // Highlights
  // --------------------------------------------------

  const addHighlight = () => {
    setHighlights((prev) => [
      ...prev,
      ""
    ]);
  };

  const updateHighlight = (
    index,
    value
  ) => {
    setHighlights((prev) => {
      const updated = [...prev];

      updated[index] = value;

      return updated;
    });
  };

  const removeHighlight = (index) => {
    setHighlights((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // --------------------------------------------------
  // Images
  // --------------------------------------------------

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages((prev) => [
      ...prev,
      ...files
    ]);
  };

  const removeImage = (index) => {
    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = new FormData();

      // --------------------------------------------------
      // Basic information
      // --------------------------------------------------

      data.append("name", formData.name);

      data.append(
        "description",
        formData.description
      );

      // --------------------------------------------------
      // Location
      // --------------------------------------------------

      data.append(
        "address",
        formData.address
      );

      data.append(
        "city",
        formData.city
      );

      data.append(
        "state",
        formData.state
      );

      data.append(
        "country",
        formData.country
      );

      // --------------------------------------------------
      // Coordinates - optional
      // --------------------------------------------------

      if (formData.latitude) {
        data.append(
          "latitude",
          formData.latitude
        );
      }

      if (formData.longitude) {
        data.append(
          "longitude",
          formData.longitude
        );
      }

      // --------------------------------------------------
      // Amenities
      // --------------------------------------------------

      data.append(
        "amenities",
        JSON.stringify(selectedAmenities)
      );

      // --------------------------------------------------
      // Highlights
      // --------------------------------------------------

      data.append(
        "highlights",
        JSON.stringify(
          highlights.filter(
            (highlight) =>
              highlight.trim() !== ""
          )
        )
      );

      // --------------------------------------------------
      // Images
      // --------------------------------------------------

      images.forEach((image) => {
        data.append("images", image);
      });

      // --------------------------------------------------
      // Create hotel
      // --------------------------------------------------

      const response = await api.post(
        "/hotels/create",
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      console.log(
        "Hotel created:",
        response.data
      );

      // Go to hotel list
      navigate("/owner/hotels");

    } catch (error) {
      console.error(
        "Create hotel error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to create hotel."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">

      <div className="mx-auto max-w-5xl">

        {/* ----------------------------------------- */}
        {/* Header */}
        {/* ----------------------------------------- */}

        <div className="mb-8">

          <button
            type="button"
            onClick={() =>
              navigate("/owner/hotels")
            }
            className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={18} />

            Back to My Hotels
          </button>

          <h1 className="text-3xl font-bold text-gray-900">
            List Your Hotel
          </h1>

          <p className="mt-2 text-gray-500">
            Add your property details so customers
            can discover and book your hotel.
          </p>

        </div>

        {/* ----------------------------------------- */}
        {/* Error */}
        {/* ----------------------------------------- */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* ======================================= */}
          {/* BASIC INFORMATION */}
          {/* ======================================= */}

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="mb-6">

              <h2 className="text-xl font-semibold text-gray-900">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Tell customers about your property.
              </p>

            </div>

            <div className="space-y-5">

              {/* Hotel name */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Hotel Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. The Grand Palace"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* Description */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your hotel, its atmosphere, location and what makes it special..."
                  rows={6}
                  required
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Give customers a clear idea of what
                  they can expect from your property.
                </p>

              </div>

            </div>

          </section>

          {/* ======================================= */}
          {/* LOCATION */}
          {/* ======================================= */}

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">

                <MapPin
                  size={20}
                  className="text-blue-600"
                />

              </div>

              <div>

                <h2 className="text-xl font-semibold text-gray-900">
                  Location
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Where is your hotel located?
                </p>

              </div>

            </div>

            <div className="space-y-5">

              {/* Address */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter the complete hotel address"
                  rows={3}
                  required
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* City / State / Country */}

              <div className="grid gap-5 md:grid-cols-3">

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Maharashtra"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Country
                  </label>

                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="India"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>

              {/* Coordinates */}

              <div>

                <div className="mb-3">

                  <label className="text-sm font-medium text-gray-700">
                    Coordinates

                    <span className="ml-2 text-xs font-normal text-gray-400">
                      Optional
                    </span>
                  </label>

                  <p className="mt-1 text-xs text-gray-400">
                    You can add these later if you want to
                    show the property on a map.
                  </p>

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="Latitude"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="Longitude"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>

            </div>

          </section>

          {/* ======================================= */}
          {/* AMENITIES */}
          {/* ======================================= */}

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="mb-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">

                  <Wifi
                    size={20}
                    className="text-blue-600"
                  />

                </div>

                <div>

                  <h2 className="text-xl font-semibold text-gray-900">
                    Hotel Amenities
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Select the facilities and services
                    available at your hotel.
                  </p>

                </div>

              </div>

            </div>

            {amenitiesLoading ? (

              <div className="py-10 text-center text-sm text-gray-500">
                Loading amenities...
              </div>

            ) : availableAmenities.length === 0 ? (

              <div className="rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                No hotel amenities available.
              </div>

            ) : (

              <div className="grid gap-3 sm:grid-cols-2">

                {availableAmenities.map(
                  (amenity) => {

                    const selected =
                      isAmenitySelected(
                        amenity._id
                      );

                    const selectedData =
                      selectedAmenities.find(
                        (item) =>
                          item.amenityId ===
                          amenity._id
                      );

                    return (

                      <div
                        key={amenity._id}
                        className={`rounded-xl border transition ${
                          selected
                            ? "border-blue-500 bg-blue-50/50"
                            : "border-gray-200 bg-white"
                        }`}
                      >

                        {/* Amenity */}

                        <button
                          type="button"
                          onClick={() =>
                            toggleAmenity(
                              amenity._id
                            )
                          }
                          className="flex w-full items-center gap-3 p-4 text-left"
                        >

                          <div
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                              selected
                                ? "border-blue-600 bg-blue-600"
                                : "border-gray-300"
                            }`}
                          >

                            {selected && (
                              <Check
                                size={14}
                                className="text-white"
                              />
                            )}

                          </div>

                          <span className="font-medium text-gray-800">
                            {amenity.name}
                          </span>

                        </button>

                        {/* Sub amenities */}

                        {selected && (

                          <div className="border-t border-blue-100 px-4 pb-4 pt-3">

                            <p className="mb-3 text-xs font-medium text-gray-500">
                              Additional details
                            </p>

                            {selectedData?.subAmenities.map(
                              (
                                subAmenity,
                                index
                              ) => (

                                <div
                                  key={index}
                                  className="mb-2 flex gap-2"
                                >

                                  <input
                                    type="text"
                                    value={
                                      subAmenity
                                    }
                                    onChange={(e) =>
                                      updateSubAmenity(
                                        amenity._id,
                                        index,
                                        e.target.value
                                      )
                                    }
                                    placeholder="e.g. Outdoor pool"
                                    className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                  />

                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeSubAmenity(
                                        amenity._id,
                                        index
                                      )
                                    }
                                    className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                                  >

                                    <Trash2
                                      size={17}
                                    />

                                  </button>

                                </div>

                              )
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                addSubAmenity(
                                  amenity._id
                                )
                              }
                              className="mt-1 flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                            >

                              <Plus size={15} />

                              Add detail

                            </button>

                          </div>

                        )}

                      </div>

                    );

                  }
                )}

              </div>

            )}

          </section>

          {/* ======================================= */}
          {/* HIGHLIGHTS */}
          {/* ======================================= */}

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="mb-6">

              <h2 className="text-xl font-semibold text-gray-900">
                Special Highlights
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add special things about your property
                that can attract customers.
              </p>

            </div>

            <div className="space-y-3">

              {highlights.map(
                (highlight, index) => (

                  <div
                    key={index}
                    className="flex gap-2"
                  >

                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) =>
                        updateHighlight(
                          index,
                          e.target.value
                        )
                      }
                      placeholder="e.g. Beautiful mountain view"
                      className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeHighlight(index)
                      }
                      className="rounded-lg p-3 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    >

                      <Trash2 size={18} />

                    </button>

                  </div>

                )
              )}

              <button
                type="button"
                onClick={addHighlight}
                className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >

                <Plus size={16} />

                Add highlight

              </button>

            </div>

            <p className="mt-3 text-xs text-gray-400">
              Examples: Mountain view, beachfront location,
              peaceful surroundings, romantic getaway,
              close to tourist attractions.
            </p>

          </section>

          {/* ======================================= */}
          {/* PHOTOS */}
          {/* ======================================= */}

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="mb-6">

              <h2 className="text-xl font-semibold text-gray-900">
                Hotel Photos
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add high-quality photos of your property.
              </p>

            </div>

            {/* Upload */}

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-10 transition hover:border-blue-400 hover:bg-blue-50/30">

              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">

                <Upload
                  size={22}
                  className="text-blue-600"
                />

              </div>

              <p className="font-semibold text-gray-700">
                Upload hotel photos
              </p>

              <p className="mt-1 text-sm text-gray-400">
                PNG, JPG or WEBP
              </p>

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />

            </label>

            {/* Preview */}

            {images.length > 0 && (

              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">

                {images.map(
                  (image, index) => (

                    <div
                      key={index}
                      className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100"
                    >

                      <img
                        src={URL.createObjectURL(
                          image
                        )}
                        alt={`Hotel ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(index)
                        }
                        className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition group-hover:opacity-100"
                      >

                        <X size={16} />

                      </button>

                      {index === 0 && (

                        <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white">
                          Main photo
                        </span>

                      )}

                    </div>

                  )
                )}

              </div>

            )}

          </section>

          {/* ======================================= */}
          {/* ACTIONS */}
          {/* ======================================= */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                navigate("/owner/hotels")
              }
              disabled={loading}
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading
                ? "Listing Hotel..."
                : "List Hotel"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CreateHotel;