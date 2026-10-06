import { z } from "zod";

const hotelValidator = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Hotel name must be at least 2 characters")
    .max(100, "Hotel name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description cannot exceed 2000 characters"),

  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(300, "Address cannot exceed 300 characters"),

  location: z.object({
    city: z
      .string()
      .trim()
      .min(2, "City is required"),

    state: z
      .string()
      .trim()
      .min(2, "State is required"),

    country: z
      .string()
      .trim()
      .min(2, "Country is required"),

    coordinates: z
      .object({
        latitude: z
          .number()
          .min(-90, "Latitude must be between -90 and 90")
          .max(90, "Latitude must be between -90 and 90"),

        longitude: z
          .number()
          .min(-180, "Longitude must be between -180 and 180")
          .max(180, "Longitude must be between -180 and 180")
      })
      .optional()
  }),

  amenities: z
    .array(
      z.object({
        amenityId: z.string().min(1, "Amenity ID is required"),

        subAmenities: z
          .array(
            z.string().trim().min(1, "Sub-amenity cannot be empty")
          )
          .optional()
      })
    )
    .optional(),

  highlights: z
    .array(
      z.string()
        .trim()
        .min(1, "Highlight cannot be empty")
        .max(100, "Highlight cannot exceed 100 characters")
    )
    .max(10, "You can add a maximum of 10 highlights")
    .optional(),

  status: z
    .enum(["active", "inactive"])
    .optional()
});

export default hotelValidator;