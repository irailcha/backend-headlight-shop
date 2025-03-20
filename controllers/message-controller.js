import axios from 'axios';
import dotenv from 'dotenv';
import Message from "../models/Message.js";
import Advert from "../models/Advert.js"; // Якщо потрібно отримувати додаткові дані про оголошення

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

const sendMessage = async (req, res) => {
  const { phone, message, is_admin } = req.body;
  const { id: advertId } = req.params;


  if (!advertId) {
    console.log('Advert ID відсутній');
    return res.status(400).json({ success: false, message: "ID оголошення відсутній" });
  }

  try {
    // Отримуємо дані про оголошення
    const advert = await Advert.findById(advertId);
    if (!advert) {
      return res.status(404).json({ success: false, message: "Оголошення не знайдено" });
    }

    // Зберігаємо повідомлення в базу даних
    const newMessage = await Message.create({
      phone,
      message,
      advert: advertId,
      is_admin: false, 
    });


    // Формуємо текст для Telegram
    const text = `Нове повідомлення від клієнта:\n
Оголошення: ${advert.compatibility}\n
Телефон: ${phone}\n
Повідомлення: ${message}`;

    // Надсилаємо повідомлення адміністратору
    const telegramResponse = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: ADMIN_CHAT_ID,
      text,
    });

    res.status(201).json({ success: true, message: "Повідомлення надіслано!", data: newMessage });
  } catch (error) {
    console.error('Error sending message:', error.message);
    res.status(500).json({ success: false, message: "Сталася помилка.", error: error.message });
  }
};

const markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true } // Повертаємо оновлений документ
    );

    if (!updatedMessage) {
      return res.status(404).json({ success: false, message: "Повідомлення не знайдено" });
    }

    res.status(200).json({ success: true, data: updatedMessage });
  } catch (error) {
    console.error('Error marking message as read:', error.message);
    res.status(500).json({ success: false, message: "Сталася помилка.", error: error.message });
  }
};



const getMessage=async(req, res, next)=>{
  try {
    const messages = await Message.find().populate('advert');
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
}

const replyMessage=async(req, res, next)=>{
  const { id: messageId } = req.params; // Отримуємо ID повідомлення
  const { replyMessage } = req.body;

  try {
    // Отримуємо повідомлення клієнта
    const clientMessage = await Message.findById(messageId).populate('advert');
    if (!clientMessage) {
      return res.status(404).json({ success: false, message: "Повідомлення не знайдено" });
    }

    // Надсилаємо відповідь клієнту
    const text = `Відповідь на ваше запитання:\n
Ваше запитання: ${clientMessage.message}\n
Відповідь: ${replyMessage}\n
Оголошення: ${clientMessage.advert ? clientMessage.advert.compatibility : "ID: " + clientMessage.advert}`;

    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: clientMessage.phone, // Використовуємо телефон клієнта як ідентифікатор
      text,
    });

    // Зберігаємо відповідь у базу даних
    const adminReply = await Message.create({
      phone: clientMessage.phone,
      message: replyMessage,
      advert: clientMessage.advert,
      is_admin: true, // Позначаємо, що це відповідь адміністратора
    });

    res.status(201).json({ success: true, message: "Відповідь надіслано!", data: adminReply });
  } 
  catch(err){
    next(err);
  }

}

export default { sendMessage, getMessage, replyMessage, markAsRead };
