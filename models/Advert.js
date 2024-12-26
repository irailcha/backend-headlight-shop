import { Schema, model } from "mongoose";

const advertSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    compatibility: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
      enum: ["new", "used", "refurbished"],
    },
    typeOfLamps: {
      type: String,
      required: true,
      enum: ["halogen", "xenon", "LED"],
    },
    isOriginal: {
      type: Boolean,
      required: true,
    },
    partNumber: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    typeOfGlass: {
      type: String,
      required: true,
    },
    functionality: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    photo: {
      type: [String],
      required: true,
    },
    videoUrl: { 
      type: String,
      required: false, 
    },
    completeSet: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Advert = model("Advert", advertSchema);

export default Advert;
