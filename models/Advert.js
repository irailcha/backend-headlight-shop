import { Schema, model } from "mongoose";

const advertSchema = new Schema(
  {
    mark: {
      type: String,
      required: true,
      maxlength: 50,
    },
    model:{
      type: String,
      required: true,
      maxlength: 50,
    },
    year:{
      type: String,
      required: true,
      maxlength: 50,
    },
    state: {
      type: String,
      required: true,
      enum: ["Нова", "Вживана"],
    },
    typeOfLamps: {
      type: String,
      required: true,
      maxlength: 50,
    },
    side: {
      type: String,
      required: true,
      enum: ["Права", "Ліва", "Комплект"],
    },
    isOriginal: {
      type: Boolean,
      required: true,
    },
    partNumber: {
      type: String,
      required: true,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    photo: {
      type: [String],
      required: false,
    },
    videoUrl: { 
      type: [String],
      required: false, 
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);


const Advert = model("Advert", advertSchema);

export default Advert;
