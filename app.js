import express from "express";
import bodyParser from 'body-parser';
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import compression from 'compression';
import advertRouter from "./routes/advert-router.js";
import messageRouter from "./routes/message-router.js";

const app = express();
dotenv.config();

const allowedOrigins = [
  'http://localhost:5174',
  'http://localhost:5173',
  'https://irailcha.github.io',
  'https://avtogalogen.com.ua'
];

// Настройка CORS
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
  credentials: true,
};

// Використання middleware CORS
app.use(cors(corsOptions));

// Обробка OPTIONS-запитів (необов'язково, якщо ви використовуєте `cors`)
app.options('*', cors(corsOptions));

// Middleware
app.use(morgan("combined"));
app.use(compression());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Маршрути
app.use("/api/adverts", advertRouter); // Маршрути для оголошень
app.use("/api/messages", messageRouter); // Маршрути для повідомлень

// Обробка 404
app.use((req, res) => {
  res
    .status(404)
    .json({ message: "Unfortunately, we cannot fulfill your request" });
});

// Глобальна обробка помилок
app.use((err, req, res, next) => {
  const { status = 500, message = "Status error" } = err;
  res.status(status).json({ message });
});

export default app;
