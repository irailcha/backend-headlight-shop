import mongoose from "mongoose";

import app from "./app.js";



console.log("DB_HOST:", process.env.DB_HOST);

mongoose
  .connect(process.env.DB_HOST)
  .then(() => {
    const port = process.env.PORT || 3002;
    app.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  });
