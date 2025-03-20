import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    phone: {
      type: String,
      required: true,
      match: [/^\+380\d{9}$/, 'Невірний формат номера телефону'],
      index: true,
    },
    message: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 1000,
    },
    advert: {
      type: Schema.Types.ObjectId,
      ref: 'Advert',
      required: true,
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
    isRead: {
      type: Boolean,
      default: false, // За замовчуванням повідомлення є непрочитаним
    },
  },
  { timestamps: true }
);


// Віртуальне поле для визначення, чи є клієнтом
messageSchema.virtual('isClient').get(function () {
  return !this.is_admin;
});

// Зберігаємо модель
const Message = model("Message", messageSchema);

export default Message;